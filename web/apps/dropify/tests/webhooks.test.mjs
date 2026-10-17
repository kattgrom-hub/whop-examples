import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { loadTs } from './load-ts.mjs';
process.env.WHOP_WEBHOOK_SECRET = 'ws_test-route-secret';
function signed(type, data = {}, { valid = true, id = 'msg_Test' } = {}) {
  const body = JSON.stringify({ api_version: 'v1', id, type, data });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHmac('sha256', process.env.WHOP_WEBHOOK_SECRET).update(`${id}.${timestamp}.${body}`).digest('base64');
  return new Request('https://example.com/api/webhooks/whop', { method: 'POST', body, headers: {
    'webhook-id': id, 'webhook-timestamp': timestamp, 'webhook-signature': `v1,${valid ? signature : 'bad'}`,
  }});
}
function route(app, extra = {}) {
  const effects = [];
  let current = { id: 'mem_Test', status: 'active', plan_id: 'plan_Test', user_id: 'user_Test', metadata: {} };
  const mocks = {
    '@/lib/whop-sdk': { getWhopApi: () => ({ memberships: { retrieve: async () => { effects.push('retrieve'); return current; } } }) },
    '@/lib/blob/webhook-events': { persistWebhookEvent: async (...args) => effects.push(args) },
    '@/lib/blob/instructors-index': { updateInstructorEntry: async () => effects.push('instructor') },
    '@/lib/blob/classes-index': { removeClass: async () => effects.push('removeClass') },
    '@/lib/blob/bookings-index': { addBooking: async () => effects.push('booking') },
    '@/lib/blob/hosts-index': { updateHostEntry: async () => effects.push('host') },
    '@/lib/blob/boats-index': { removeBookedDate: async () => effects.push('date') },
    '@/lib/blob/storage': { storeRead: async () => null },
    '@/lib/blob/chats-index': { addChatEntry: async () => effects.push('chat') },
    ...extra,
  };
  return { ...loadTs(`../${app}/src/app/api/webhooks/whop/route.ts`, mocks), effects, setCurrent: value => { current = value; } };
}
for (const app of ['masterclass', 'waterbnb', 'winners-club', 'titled-tuesday']) {
  test(`${app}: unsigned requests fail before any API/storage effect`, async () => {
    const { POST, effects } = route(app);
    assert.equal((await POST(signed('membership.activated', {}, { valid: false }))).status, 401);
    assert.deepEqual(effects, []);
  });
  test(`${app}: verified unknown event is acknowledged without effects`, async () => {
    const { POST, effects } = route(app);
    assert.equal((await POST(signed('product.updated'))).status, 200);
    assert.deepEqual(effects, []);
  });
}
for (const app of ['waterbnb', 'winners-club']) {
  test(`${app}: persistence receives delivery ID, distinct from resource ID`, async () => {
    const { POST, effects } = route(app);
    assert.equal((await POST(signed('payment.succeeded', { id: 'pay_Test' }))).status, 200);
    assert.deepEqual(effects, [['payment.succeeded', { id: 'pay_Test' }, 'msg_Test']]);
  });
}
for (const app of ['masterclass', 'waterbnb', 'winners-club']) {
  test(`${app}: delayed activation cannot grant canceled membership`, async () => {
    const { POST, effects, setCurrent } = route(app);
    setCurrent({ id: 'mem_Test', status: 'canceled', metadata: { type: 'masterclass' }, user_id: 'user_Test' });
    assert.equal((await POST(signed('membership.activated', { id: 'mem_Test', status: 'active' }))).status, 200);
    assert.deepEqual(effects, ['retrieve']);
  });
  test(`${app}: cancellation at period end keeps active membership access`, async () => {
    const { POST, effects } = route(app);
    assert.equal((await POST(signed('membership.updated', { id: 'mem_Test', cancel_at_period_end: true }))).status, 200);
    assert.deepEqual(effects, ['retrieve']);
  });
  test(`${app}: API reconciliation failure remains retryable`, async () => {
    const { POST } = route(app, { '@/lib/whop-sdk': { getWhopApi: () => ({ memberships: { retrieve: async () => { throw new Error('unavailable'); } } }) } });
    assert.equal((await POST(signed('membership.activated', { id: 'mem_Test' }))).status, 500);
  });
}
