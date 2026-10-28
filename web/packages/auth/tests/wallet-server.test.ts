import assert from "node:assert/strict";
import { test } from "node:test";
import type { Session } from "next-auth";
import { createWalletTokenResponse } from "../src/wallet-server";

const session = (companyId?: string) => ({
  user: { id: "user_test", companyId }, accessToken: "oauth-secret", expires: "2099-01-01",
}) as unknown as Session;

test("wallet tokens enforce identity, scopes, privacy and upstream failures", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.WHOP_API_KEY;
  const requests: { body: Record<string, unknown>; authorization: string | null }[] = [];
  globalThis.fetch = async (_url, init) => {
    requests.push({ body: JSON.parse(init?.body as string), authorization: new Headers(init?.headers).get("Authorization") });
    return Response.json({ token: "scoped-token", expires_at: new Date(Date.now() + 900000).toISOString() });
  };
  try {
    assert.equal((await createWalletTokenResponse(null)).status, 401);
    assert.equal(requests.length, 0);
    const personal = await createWalletTokenResponse(session());
    assert.equal(personal.status, 200);
    assert.equal(personal.headers.get("Cache-Control"), "private, no-store");
    assert.equal((await personal.json()).accountId, "user_test");
    assert.equal(requests[0].authorization, "Bearer oauth-secret");
    assert.deepEqual(requests[0].body.scoped_actions, ["user:balance:read"]);
    assert.equal(requests[0].body.account_id, undefined);
    process.env.WHOP_API_KEY = "server-secret";
    const business = await createWalletTokenResponse(session("biz_owned"));
    assert.equal((await business.json()).accountId, "biz_owned");
    assert.equal(requests[1].body.account_id, "biz_owned");
    assert.equal(requests[1].authorization, "Bearer server-secret");
    assert.deepEqual(requests[1].body.scoped_actions, ["company:balance:read", "stats:read"]);
    assert.equal((await createWalletTokenResponse(session("invalid"))).status, 403);
    assert.equal(requests.length, 2);
    globalThis.fetch = async () => Response.json({ error: "secret upstream details" }, { status: 403 });
    const failure = await createWalletTokenResponse(session());
    assert.equal(failure.status, 502);
    assert.ok(!(await failure.text()).includes("secret"));
    globalThis.fetch = async () => Response.json({ token: "scoped-token", expires_at: "invalid" });
    assert.equal((await createWalletTokenResponse(session())).status, 502);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.WHOP_API_KEY;
    else process.env.WHOP_API_KEY = originalKey;
  }
});

test("wallet document isolates the SDK and restricts framing", async () => {
  const { walletDocument } = await import("../src/wallet-document");
  const { Script } = await import("node:vm");
  const response = walletDocument();
  assert.equal(response.headers.get("X-Frame-Options"), "SAMEORIGIN");
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  const html = await response.text();
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  // Parse the delivered JavaScript independently of TypeScript's HTML string.
  new Script(script);
});
