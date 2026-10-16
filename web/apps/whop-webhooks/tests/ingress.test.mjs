import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { loadTs } from '../../dropify/tests/load-ts.mjs';
const { createIngress } = loadTs('../whop-webhooks/src/lib/ingress.ts');
const { createConsumer } = loadTs('../whop-webhooks/src/lib/consumer.ts');
process.env.WHOP_WEBHOOK_SECRET = 'ws_ingress-test-secret';
function signed(type = 'product.updated', id = 'msg_Ingress', valid = true) {
  const body = JSON.stringify({ api_version: 'v1', id, type, data: { id: 'prod_Test' } });
  const timestamp = String(Math.floor(Date.now()/1000));
  const signature = createHmac('sha256', process.env.WHOP_WEBHOOK_SECRET).update(`${id}.${timestamp}.${body}`).digest('base64');
  return new Request('https://example.com/api/webhooks/whop', { method: 'POST', body, headers: {
    'webhook-id': id, 'webhook-timestamp': timestamp, 'webhook-signature': `v1,${valid ? signature : 'bad'}`,
  }});
}
test('unauthenticated traffic cannot publish', async () => {
  let writes = 0;
  const POST = createIngress(async () => { writes++; });
  assert.equal((await POST(signed('product.updated', undefined, false))).status, 401);
  assert.equal(writes, 0);
});
test('real payment events fail closed until reconciliation is enabled', async () => {
  delete process.env.WHOP_WEBHOOK_RECONCILIATION_ENABLED;
  let writes = 0;
  assert.equal((await createIngress(async () => { writes++; })(signed('payment.succeeded'))).status, 503);
  assert.equal(writes, 0);
});
test('acknowledges only after durable acceptance; retries share an idempotency key', async () => {
  let release;
  const published = [];
  const POST = createIngress((...args) => { published.push(args); return new Promise(resolve => { release = resolve; }); });
  let finished = false;
  const result = POST(signed()).then(response => { finished = true; return response; });
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(finished, false);
  release({ messageId: 'queue_Test' });
  assert.equal((await result).status, 202);
  const again = POST(signed());
  await new Promise(resolve => setImmediate(resolve)); release({ messageId: 'queue_Test' });
  assert.equal((await again).status, 202);
  assert.equal(published[0][0], 'whop-reconcile');
  assert.deepEqual(published.map(args => args[2]), [
    { idempotencyKey: 'msg_Ingress', retentionSeconds: 604800 },
    { idempotencyKey: 'msg_Ingress', retentionSeconds: 604800 },
  ]);
});
test('broker errors remain retryable instead of acknowledging lost work', async () => {
  const POST = createIngress(async () => { throw new Error('broker down'); });
  assert.equal((await POST(signed())).status, 503);
});
test('queue acceptance deadline returns retryable failure within delivery budget', async () => {
  const start = Date.now();
  const POST = createIngress(async () => new Promise(() => {}));
  assert.equal((await POST(signed())).status, 503);
  assert.ok(Date.now() - start < 4500);
});
test('consumer throws on failed reconciliation so broker retries', async () => {
  const consume = createConsumer(async () => Response.json({ error: 'db down' }, { status: 503 }));
  await assert.rejects(consume({ id: 'msg_Test', type: 'payment.succeeded', data: {} }), /503/);
});
test('consumer accepts a delayed previously verified event without rechecking its expired signature', async () => {
  let calls = 0;
  const consume = createConsumer(async () => { calls++; return Response.json({ received: true }); });
  await consume({ id: 'msg_Test', api_version: 'v1', type: 'product.updated', data: {}, timestamp: '2025-01-01T00:00:00Z' });
  assert.equal(calls, 1);
});

test('enable flag alone cannot accept real payments without account and database credentials', async () => {
  process.env.WHOP_WEBHOOK_RECONCILIATION_ENABLED = 'true';
  delete process.env.WHOP_API_KEY;
  let writes = 0;
  try {
    assert.equal((await createIngress(async () => { writes++; })(signed('payment.succeeded'))).status, 503);
    assert.equal(writes, 0);
  } finally { delete process.env.WHOP_WEBHOOK_RECONCILIATION_ENABLED; }
});
test('fully configured ingress durably queues payment events', async () => {
  const config = {
    WHOP_WEBHOOK_RECONCILIATION_ENABLED: 'true', WHOP_API_KEY: 'local-test-only',
    DROPIFY_SUPABASE_URL: 'https://example.invalid', DROPIFY_SUPABASE_SERVICE_ROLE_KEY: 'local-test-only',
    NEXT_PUBLIC_WHOP_COMPANY_ID: 'biz_Test', NEXT_PUBLIC_WHOP_ENVIRONMENT: 'sandbox',
  };
  const previous = Object.fromEntries(Object.keys(config).map(key => [key, process.env[key]]));
  Object.assign(process.env, config);
  let writes = 0;
  try {
    assert.equal((await createIngress(async () => { writes++; })(signed('payment.succeeded'))).status, 202);
    assert.equal(writes, 1);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});

 test('queue messages exclude customer data and retain only reconciliation references', () => {
  const { reconciliationMessage } = loadTs('../whop-webhooks/src/lib/ingress.ts');
  const event = { id: 'msg_Test', api_version: 'v1', type: 'payment.succeeded', data: {
    id: 'pay_Test', user: { email: 'private@example.invalid' }, shipping_address: { name: 'private' },
    metadata: { type: 'dropify_order', order_id: 'order_Test', other: 'private' },
  } };
  assert.deepEqual(reconciliationMessage(event), { id: event.id, api_version: 'v1', type: event.type,
    data: { id: 'pay_Test', metadata: { type: 'dropify_order', order_id: 'order_Test' } } });
});
