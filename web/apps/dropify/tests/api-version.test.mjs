import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { loadTs, app as dropifyRoot } from './load-ts.mjs';

// Exercise real SDK transport, without contacting Whop or charging a buyer.
test('every shared SDK client pins its existing contract and rejects a V2 environment override', async () => {
  Object.assign(process.env, { WHOP_API_KEY: 'local-test-only', WHOP_BASE_URL: 'https://api.whop.com/api/v2',
    NEXT_PUBLIC_WHOP_ENVIRONMENT: 'sandbox' });
  try {
    for (const app of ['dropify', 'grail-talent', 'masterclass', 'sockx', 'titled-tuesday', 'waterbnb', 'whmcs', 'winners-club']) {
      const appRequire = createRequire(path.resolve(dropifyRoot, '..', app, 'package.json'));
      const client = loadTs(`../${app}/src/lib/whop-sdk.ts`, { '@whop/sdk': appRequire('@whop/sdk') }).getWhopApi();
      const requests = [];
      client.fetch = async (url, init) => {
        requests.push({ url: String(url), headers: new Headers(init.headers) });
        return new Response(JSON.stringify({ id: 'pay_Local' }), { headers: { 'Content-Type': 'application/json' } });
      };
      await client.payments.retrieve('pay_Local');
      assert.equal(requests.length, 1);
      assert.equal(requests[0].url, `https://${app === 'dropify' ? 'sandbox-api' : 'api'}.whop.com/api/v1/payments/pay_Local`);
      assert.equal(requests[0].headers.get('Api-Version-Date'), '2025-01-01');
    }
  } finally { delete process.env.WHOP_BASE_URL; }
});

test('direct PaymentElement reads and writes explicitly pin the same sandbox contract', async () => {
  Object.assign(process.env, { WHOP_API_KEY: 'local-test-only', NEXT_PUBLIC_WHOP_ENVIRONMENT: 'sandbox',
    NEXT_PUBLIC_WHOP_COMPANY_ID: 'biz_Local', DROPIFY_PAYMENT_ELEMENT_ENABLED: 'true',
    DROPIFY_PAYMENT_ELEMENT_PLAN_ID: 'plan_Local' });
  const saved = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async (url, init) => {
    requests.push({ url: String(url), method: init.method, headers: new Headers(init.headers) });
    return new Response('{}', { headers: { 'Content-Type': 'application/json' } });
  };
  try {
    const { elementApi } = loadTs('src/lib/payment-element-server.ts');
    await elementApi('payments/pay_Local');
    await elementApi('payments', { confirmation_token: 'ctok_Local' });
    assert.deepEqual(requests.map(r => r.method), ['GET', 'POST']);
    for (const request of requests) {
      assert.match(request.url, /^https:\/\/sandbox-api\.whop\.com\/api\/v1\/payments/);
      assert.equal(request.headers.get('Api-Version-Date'), '2025-01-01');
    }
  } finally { globalThis.fetch = saved; }
});
