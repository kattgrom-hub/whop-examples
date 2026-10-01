import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/app/api/wallet/token/route.ts", import.meta.url), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;

function handler(session, fetchImpl, environment = "production") {
  const context = {
    exports: {}, Date, AbortSignal,
    process: { env: { NEXT_PUBLIC_WHOP_ENVIRONMENT: environment, WHOP_API_KEY: "must-never-be-used" } },
    fetch: fetchImpl,
    require(name) {
      if (name === "@/auth") return { auth: async () => session };
      if (name === "next/server") return { NextResponse: { json: (data, options = {}) => ({ data, status: options.status || 200, headers: options.headers }) } };
      throw new Error(`Unexpected import: ${name}`);
    },
  };
  vm.runInNewContext(code, context);
  return context.exports.GET;
}

const viewer = { user: { id: "user_viewer" }, accessToken: "viewer-oauth" };
const noFetch = () => { throw new Error("Must not contact Whop"); };

test("unauthenticated or missing OAuth session is rejected before upstream access", async () => {
  for (const session of [null, { user: viewer.user }]) {
    const response = await handler(session, noFetch)();
    assert.equal(response.status, 401);
    assert.equal(response.headers["Cache-Control"], "no-store");
  }
});

test("company or invalid viewer IDs are rejected", async () => {
  for (const id of ["biz_other", "123", "user_../../other"]) {
    assert.equal((await handler({ ...viewer, user: { id } }, noFetch)()).status, 403);
  }
});

test("minting uses only the viewer's OAuth token and ignores forged account selection", async () => {
  let request;
  const expiry = new Date(Date.now() + 900000).toISOString();
  const response = await handler(viewer, async (url, options) => {
    request = { url, options };
    return { ok: true, json: async () => ({ token: "short-lived", expires_at: expiry }) };
  })({ url: "https://example.com/api/wallet/token?accountId=biz_victim&user_id=user_victim" });
  assert.equal(response.status, 200);
  assert.equal(response.data.accountId, viewer.user.id);
  assert.equal(response.data.token, "short-lived");
  assert.equal(response.headers["Cache-Control"], "no-store");
  assert.equal(request.url, "https://api.whop.com/api/v1/access_tokens");
  assert.equal(request.options.headers.Authorization, "Bearer viewer-oauth");
  const body = JSON.parse(request.options.body);
  assert.deepEqual(Object.keys(body), ["expires_at"]);
  assert.ok(Date.parse(body.expires_at) > Date.now());
  assert.equal(request.options.cache, "no-store");
});

test("sandbox routes to sandbox and invalid environments fail closed", async () => {
  let host;
  await handler(viewer, async (url) => { host = url; return { ok: false, status: 403 }; }, "sandbox")();
  assert.equal(host, "https://sandbox-api.whop.com/api/v1/access_tokens");
  assert.equal((await handler(viewer, noFetch, "typo")()).status, 503);
});

test("upstream credential failure does not expose errors or tokens", async () => {
  const response = await handler(viewer, async () => ({ ok: false, status: 401, json: async () => ({ secret: "private" }) }))();
  assert.equal(response.status, 401);
  assert.equal(JSON.stringify(response).includes("private"), false);
});

test("expired, missing and malformed tokens and network failure are rejected", async () => {
  for (const data of [{}, { token: "x", expires_at: "bad" }, { token: "x", expires_at: "2020-01-01" }]) {
    assert.equal((await handler(viewer, async () => ({ ok: true, json: async () => data }))()).status, 502);
  }
  assert.equal((await handler(viewer, async () => { throw new Error("private upstream error"); })()).status, 502);
});
