const test = require("node:test");
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");
const { readWhopWebhook } = require("../index.cjs");
const secret = "ws_0123456789abcdef0123456789abcdef";
process.env.WHOP_WEBHOOK_SECRET = secret;
function signed(body, { age = 0, override = {}, key = secret, transform = x => x } = {}) {
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  const id = "msg_Test", timestamp = String(Math.floor(Date.now()/1000) + age);
  const signature = createHmac("sha256", key).update(`${id}.${timestamp}.${raw}`).digest("base64");
  return new Request("https://example.com/api/webhooks/whop", { method: "POST", body: transform(raw), headers: {
    "webhook-id": id, "webhook-timestamp": timestamp, "webhook-signature": `v1,${signature}`, ...override,
  }});
}
const event = { id: "msg_Test", api_version: "v1", type: "payment.succeeded", account_id: "biz_Test", data: { id: "pay_Test" } };
test("current SDK accepts literal ws_ secret and exact signed bytes", async () => {
  assert.deepEqual(await readWhopWebhook(signed(event)), event);
});
for (const [label, options] of Object.entries({
  tampered: { transform: raw => raw + " " }, wrongKey: { key: "other" }, stale: { age: -600 }, future: { age: 600 },
  missingId: { override: { "webhook-id": "" } }, missingTimestamp: { override: { "webhook-timestamp": "" } },
  missingSignature: { override: { "webhook-signature": "" } },
})) test(`rejects ${label}`, async () => {
  await assert.rejects(readWhopWebhook(signed(event, options)), { status: 401 });
});
test("accepts a matching signature during key rotation", async () => {
  const request = signed(event);
  request.headers.set("webhook-signature", "v1,bad " + request.headers.get("webhook-signature"));
  assert.equal((await readWhopWebhook(request)).id, event.id);
});
for (const [label, changes] of Object.entries({ legacy: { api_version: "v2" }, mismatchedId: { id: "msg_Other" }, missingData: { data: null }, arrayData: { data: [] }, missingType: { type: null }, legacyName: { type: "membership_went_valid" } })) {
  test(`rejects signed malformed envelope: ${label}`, async () => {
    await assert.rejects(readWhopWebhook(signed({ ...event, ...changes })), { status: 400 });
  });
}
test("verification does not require an API key", async () => {
  delete process.env.WHOP_API_KEY;
  assert.equal((await readWhopWebhook(signed(event))).type, event.type);
});
test("missing signing configuration fails closed", async () => {
  delete process.env.WHOP_WEBHOOK_SECRET;
  try { await assert.rejects(readWhopWebhook(signed(event)), { status: 503 }); }
  finally { process.env.WHOP_WEBHOOK_SECRET = secret; }
});
test("payload limit counts UTF-8 bytes", async () => {
  await assert.rejects(readWhopWebhook(signed({ ...event, data: { value: "é".repeat(600000) } })), { status: 413 });
});
