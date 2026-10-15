import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHmac, randomUUID } from 'node:crypto';
import { app, require, loadTs } from './load-ts.mjs';
const { PGlite } = require('@electric-sql/pglite');

test('signed ingress, reference-only queue, worker and real SQL reconcile safely across retries', async () => {
  const config = {
    WHOP_WEBHOOK_SECRET: 'ws_local-pipeline-test', WHOP_WEBHOOK_RECONCILIATION_ENABLED: 'true',
    WHOP_API_KEY: 'local-only', NEXT_PUBLIC_WHOP_COMPANY_ID: 'biz_Test',
    NEXT_PUBLIC_WHOP_ENVIRONMENT: 'sandbox', DROPIFY_SUPABASE_URL: 'https://database.example.invalid',
    DROPIFY_SUPABASE_SERVICE_ROLE_KEY: 'local-only',
  };
  const previous = Object.fromEntries(Object.keys(config).map(key => [key, process.env[key]]));
  Object.assign(process.env, config);
  const originalFetch = globalThis.fetch;
  const db = new PGlite();
  const messages = [];
  const payments = new Map();
  let apiFailure = false;
  let apiReads = 0;
  try {
    await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
    await db.exec(fs.readFileSync(path.join(app, 'database/orders.sql'), 'utf8'));
    await db.exec('set role service_role');
    // Only the external HTTP boundary is replaced. The actual order store,
    // validation, reconciliation and production SQL functions all run here.
    globalThis.fetch = async (input, options) => {
      const url = new URL(input);
      assert.equal(url.origin, config.DROPIFY_SUPABASE_URL);
      assert.equal(options.headers.apikey, config.DROPIFY_SUPABASE_SERVICE_ROLE_KEY);
      assert.equal(options.headers.Authorization, 'Bearer local-only');
      try {
        let result;
        const body = options.body && JSON.parse(options.body);
        if (url.pathname === '/rest/v1/dropify_orders') {
          const id = url.searchParams.get('id').replace(/^eq\./, '');
          result = (await db.query('select * from public.dropify_orders where id=$1', [id])).rows;
        } else if (url.pathname === '/rest/v1/rpc/dropify_record_payment') {
          result = (await db.query('select public.dropify_record_payment($1,$2,$3,$4::jsonb,$5) as value',
            [body.p_order_id, body.p_payment_id, body.p_event_id, body.p_shipping_address, body.p_customer_email])).rows[0].value;
        } else if (url.pathname === '/rest/v1/rpc/dropify_hold_order') {
          result = (await db.query('select public.dropify_hold_order($1) as value', [body.p_order_id])).rows[0].value;
        } else throw new Error('Unexpected order-store request');
        return Response.json(result);
      } catch { return Response.json({ error: 'Database unavailable' }, { status: 503 }); }
    };
    const { createIngress } = loadTs('../whop-webhooks/src/lib/ingress.ts');
    const { createConsumer } = loadTs('../whop-webhooks/src/lib/consumer.ts');
    const { reconcileWhopEvent } = loadTs('src/lib/webhook-reconciliation.ts', {
      '@/lib/whop-sdk': { getWhopApi: () => ({ payments: { retrieve: async id => {
        apiReads++;
        if (apiFailure) throw new Error('Provider unavailable');
        assert.ok(payments.has(id));
        return structuredClone(payments.get(id));
      } } }) },
    });
    const ingress = createIngress(async (_topic, message) => { messages.push(structuredClone(message)); });
    const consume = createConsumer(reconcileWhopEvent);
    const signed = (event, valid = true) => {
      const body = JSON.stringify({ api_version: 'v1', ...event });
      const timestamp = String(Math.floor(Date.now() / 1000));
      const signature = createHmac('sha256', config.WHOP_WEBHOOK_SECRET)
        .update(`${event.id}.${timestamp}.${body}`).digest('base64');
      return new Request('https://receiver.example.invalid/api/webhooks/whop', { method: 'POST', body, headers: {
        'webhook-id': event.id, 'webhook-timestamp': timestamp, 'webhook-signature': `v1,${valid ? signature : 'invalid'}`,
      } });
    };
    const makeOrder = async paymentId => {
      const id = randomUUID();
      await db.query(`insert into public.dropify_orders
        (id,access_hash,environment,company_id,currency,total_minor,items,plan_id,checkout_configuration_id)
        values ($1,$2,'sandbox','biz_Test','usd',6800,'[]','plan_Test','ch_Test')`, [id, 'a'.repeat(64)]);
      const payment = { id: paymentId, status: 'paid', substatus: 'succeeded', subtotal: 68, currency: 'usd',
        company: { id: 'biz_Test' }, plan: { id: 'plan_Test' }, checkout_configuration_id: 'ch_Test',
        metadata: { type: 'dropify_order', order_id: id, environment: 'sandbox' },
        user: { email: 'buyer@example.invalid' },
        shipping_address: { name: 'Test Buyer', line1: '1 Test Road', city: 'Hobart', postal_code: '7000', country: 'AU' },
      };
      payments.set(paymentId, payment);
      return payment;
    };
    const counts = async () => (await db.query(`select
      (select count(*)::int from public.dropify_payments) as payments,
      (select count(*)::int from public.dropify_fulfilment_queue) as fulfilments`)).rows[0];
    const payment = await makeOrder('pay_PipelineOne');
    const success = { id: 'msg_PipelineSuccess', type: 'payment.succeeded', data: payment };
    assert.equal((await ingress(signed(success, false))).status, 401);
    assert.equal(messages.length, 0);
    assert.equal((await ingress(signed(success))).status, 202);
    assert.deepEqual(await counts(), { payments: 0, fulfilments: 0 });
    assert.doesNotMatch(JSON.stringify(messages[0]), /buyer@example|Test Road/);
    await consume(messages[0]);
    await consume(messages[0]); // Database deduplication, independent of broker TTL.
    assert.deepEqual(await counts(), { payments: 1, fulfilments: 1 });

    // Whop's real dispute shape has no payment metadata. It must still hold
    // the order using the authoritative payment retrieved by its ID.
    assert.equal((await ingress(signed({ id: 'msg_PipelineDispute', type: 'dispute.created',
      data: { id: 'dspt_Test', payment: { id: payment.id } } }))).status, 202);
    await consume(messages[1]);
    await consume(messages[0]); // Delayed paid snapshot cannot release the hold.
    assert.equal((await db.query('select status from public.dropify_fulfilment_queue where order_id=$1',
      [payment.metadata.order_id])).rows[0].status, 'held');

    const second = await makeOrder('pay_PipelineTwo');
    await ingress(signed({ id: 'msg_PipelineRetry', type: 'payment.succeeded', data: second }));
    apiFailure = true;
    await assert.rejects(consume(messages[2]), /503/);
    apiFailure = false;
    await db.exec('reset role; revoke insert on public.dropify_fulfilment_queue from service_role; set role service_role');
    await assert.rejects(consume(messages[2]), /503/);
    assert.deepEqual(await counts(), { payments: 1, fulfilments: 1 }); // Atomic rollback.
    await db.exec('reset role; grant insert on public.dropify_fulfilment_queue to service_role; set role service_role');
    await consume(messages[2]);
    assert.deepEqual(await counts(), { payments: 2, fulfilments: 2 });

    const readsBefore = apiReads;
    await ingress(signed({ id: 'msg_PipelineUnrelated', type: 'refund.updated', data: { payment: { id: 'pay_Other' } } }));
    payments.set('pay_Other', { id: 'pay_Other', metadata: { type: 'other' } });
    await consume(messages[3]);
    assert.equal(apiReads, readsBefore + 1);
    assert.deepEqual(await counts(), { payments: 2, fulfilments: 2 });
  } finally {
    globalThis.fetch = originalFetch;
    await db.close();
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
});
