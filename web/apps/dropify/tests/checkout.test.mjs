import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import { loadTs, require } from './load-ts.mjs';
const { NextRequest } = require('next/server');
const Whop = require('@whop/sdk').default;
const configEnv = {
  NEXT_PUBLIC_WHOP_ENVIRONMENT: 'sandbox', NEXT_PUBLIC_WHOP_COMPANY_ID: 'biz_TestCompany',
  WHOP_API_KEY: 'local-test-only', WHOP_WEBHOOK_SECRET: 'local-signing-secret',
  NEXT_PUBLIC_APP_URL: 'http://localhost:5007', CHECKOUT_SIGNING_SECRET: 'a'.repeat(64),
};
Object.assign(process.env, configEnv);

const request = (path, body, extra = {}) => new NextRequest(`http://localhost:5007${path}`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:5007', ...extra },
  body: JSON.stringify(body),
});

test('catalog prices override tampered values; bad carts are rejected', () => {
  const { priceCart } = loadTs('src/lib/checkout-cart.ts');
  const cart = priceCart([{ productId: 'midnight-jasmine', quantity: 2, price: 0.01, name: 'tampered' }]);
  assert.equal(cart.totalMinor, 13600); assert.equal(cart.items[0].name, 'Midnight Jasmine');
  for (const value of [null, {}, [], [{productId:'unknown',quantity:1}], [{productId:'midnight-jasmine',quantity:-1}], [{productId:'midnight-jasmine',quantity:1.5}], [{productId:'midnight-jasmine',quantity:21}], [{productId:'midnight-jasmine',quantity:1},{productId:'midnight-jasmine',quantity:1}]]) {
    assert.throws(() => priceCart(value));
  }
});

test('environment fails closed and sandbox routes the old SDK correctly', () => {
  const config = loadTs('src/lib/checkout-config.ts');
  for (const value of ['', 'test', undefined]) {
    if (value === undefined) delete process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT;
    else process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT = value;
    assert.throws(() => config.getWhopEnvironment());
  }
  Object.assign(process.env, configEnv);
  const sdk = loadTs('src/lib/whop-sdk.ts').getWhopApi();
  assert.equal(sdk.baseURL, 'https://sandbox-api.whop.com/api/v1');
  process.env.VERCEL_ENV = 'preview'; process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT = 'production';
  assert.throws(() => config.getWhopEnvironment());
  delete process.env.VERCEL_ENV; Object.assign(process.env, configEnv);
});

test('restore origins reject credential URLs, non-HTTPS remote URLs, paths and spoofed hosts', () => {
  const { getAppOrigin } = loadTs('src/lib/checkout-config.ts');
  for (const value of ['http://example.com','https://user:pass@example.com','https://example.com/path','https://example.com?status=success']) {
    process.env.NEXT_PUBLIC_APP_URL = value; assert.throws(() => getAppOrigin('http://localhost:5007'));
  }
  delete process.env.NEXT_PUBLIC_APP_URL;
  assert.throws(() => getAppOrigin('https://attacker.example'));
  process.env.CHECKOUT_ALLOWED_ORIGINS = 'https://preview.example';
  assert.equal(getAppOrigin('https://preview.example/api/checkout'), 'https://preview.example');
  Object.assign(process.env, configEnv);
});

test('checkout persists canonical order before external config creation and sets HttpOnly cookie', async () => {
  const calls = [];
  const mocks = {
    '@/lib/order-store': { requireOrderStore() {}, checkoutClientKey() { return 'test'; }, hashAccess() { return 'hash'; }, newOrderAccess() { return 'token'; }, orderCookieName(id) { return `dropify_order_${id}`; },
      async createOrder(input) { calls.push(['order', input]); return input; },
      async attachCheckout(...input) { calls.push(['attach', input]); },
    },
    '@/lib/whop-sdk': { getWhopApi() { return { checkoutConfigurations: { async create(input) { calls.push(['whop',input]); return { id:'ch_Test', plan:{id:'plan_Test'} }; } } }; } },
  };
  const { POST } = loadTs('src/app/api/checkout/route.ts', mocks);
  const response = await POST(request('/api/checkout', { items: [{ productId:'midnight-jasmine', quantity:1, price:0 }] }));
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(calls[0][0], 'order'); assert.equal(calls[0][1].total_minor, 6800);
  assert.equal(calls[1][1].plan.initial_price, 68);
  assert.equal(calls[1][1].plan.product.collect_shipping_address, true);
  assert.equal(calls[1][1].metadata.order_id, data.orderId);
  assert.equal(calls[1][1].redirect_url, `http://localhost:5007/checkout?orderId=${data.orderId}`);
  assert.match(response.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(response.headers.get('set-cookie'), /Path=\/api\/orders/i);
  assert.equal(data.checkoutConfigurationId,'ch_Test');
});

test('cross-site checkout and rate-limited attempts cannot create Whop configurations', async () => {
  let calls=0;
  const mocks = {
    '@/lib/order-store': { requireOrderStore(){}, checkoutClientKey(){return 'key';}, newOrderAccess(){return 'token';}, hashAccess(){return 'hash';}, createOrder: async()=>null },
    '@/lib/whop-sdk': { getWhopApi(){return { checkoutConfigurations:{create(){calls++;}} };} },
  };
  const { POST } = loadTs('src/app/api/checkout/route.ts', mocks);
  const cart={items:[{productId:'midnight-jasmine',quantity:1}]};
  assert.equal((await POST(request('/api/checkout',cart,{Origin:'https://attacker.example'}))).status,403);
  assert.equal((await POST(request('/api/checkout',cart))).status,429);
  assert.equal(calls,0);
});

const order = { id: randomUUID(), environment:'sandbox', company_id:'biz_TestCompany', currency:'usd', total_minor:6800,
  plan_id:'plan_Test',checkout_configuration_id:'ch_Test',status:'pending' };
const payment = { id:'pay_Test',status:'paid',substatus:'succeeded',subtotal:68,currency:'usd',company:{id:order.company_id},plan:{id:order.plan_id},checkout_configuration_id:order.checkout_configuration_id,
  metadata:{type:'dropify_order',order_id:order.id,environment:'sandbox'},shipping_address:{name:'Sample Buyer',line1:'1 Example Road',city:'Hobart',postal_code:'7000',country:'AU'} };
test('reconciliation rejects amount, seller, plan, config, environment and refunded payments', () => {
  const {validateOrderPayment}=loadTs('src/lib/payment-validation.ts');
  assert.equal(validateOrderPayment(order,payment),true);
  for(const change of [{subtotal:0.01},{currency:'aud'},{company:{id:'biz_Other'}},{plan:{id:'plan_Other'}},{checkout_configuration_id:'ch_Other'},{status:'open'},{substatus:'refunded'},{metadata:{...payment.metadata,environment:'production'}},{metadata:{...payment.metadata,order_id:randomUUID()}}]) {
    assert.throws(()=>validateOrderPayment(order,{...payment,...change}));
  }
  assert.equal(validateOrderPayment(order,{...payment,shipping_address:null}),false);
});

function signedWebhook(event, timestamp=Math.floor(Date.now()/1000), corrupt=false) {
  const body=JSON.stringify(event); const id='msg_Test';
  const signature=createHmac('sha256',process.env.WHOP_WEBHOOK_SECRET).update(`${id}.${timestamp}.${body}`).digest('base64');
  return new Request('http://localhost:5007/api/webhooks/whop',{method:'POST',headers:{'webhook-id':id,'webhook-timestamp':String(timestamp),'webhook-signature':`v1,${corrupt?'bad':signature}`},body});
}
test('real SDK signature verification rejects tampering/stale events; valid event queues only after reconciliation', async () => {
  let writes=0;
  const sdk=new Whop({apiKey:'local-only',webhookKey:Buffer.from(process.env.WHOP_WEBHOOK_SECRET).toString('base64')});
  sdk.payments.retrieve=async()=>payment;
  const mocks={ '@/lib/whop-sdk':{getWhopApi:()=>sdk}, '@/lib/order-store':{getOrder:async()=>order,recordVerifiedPayment:async()=>{writes++;return 'recorded';}} };
  const {POST}=loadTs('src/app/api/webhooks/whop/route.ts',mocks);
  const event={id:'msg_Test',type:'payment.succeeded',data:payment};
  assert.equal((await POST(signedWebhook(event,undefined,true))).status,401);
  assert.equal((await POST(signedWebhook(event,Math.floor(Date.now()/1000)-3600))).status,401);
  assert.equal(writes,0);
  assert.equal((await POST(signedWebhook(event))).status,200); assert.equal(writes,1);
  sdk.payments.retrieve=async()=>({...payment,subtotal:0.01});
  assert.equal((await POST(signedWebhook(event))).status,503); assert.equal(writes,1);
  mocks['@/lib/order-store'].recordVerifiedPayment=async()=>{throw new Error('database down');};
  sdk.payments.retrieve=async()=>payment;
  assert.equal((await POST(signedWebhook(event))).status,503);
});

test('order lookup requires correct cookie, seller and environment; returns no PII', async () => {
  const store=loadTs('src/lib/order-store.ts');
  const access=store.newOrderAccess(); const saved={...order,access_hash:store.hashAccess(access),payment_id:'pay_Test'};
  assert.equal(store.hasOrderAccess(saved,access),true); assert.equal(store.hasOrderAccess(saved,'wrong'),false);
  const {GET}=loadTs('src/app/api/orders/[orderId]/route.ts',{'@/lib/order-store':{...store,getOrder:async()=>saved}});
  const context={params:Promise.resolve({orderId:order.id})};
  assert.equal((await GET(new NextRequest(`http://localhost:5007/api/orders/${order.id}`),context)).status,404);
  const response=await GET(new NextRequest(`http://localhost:5007/api/orders/${order.id}`,{headers:{cookie:`${store.orderCookieName(order.id)}=${access}`}}),context);
  assert.equal(response.status,200); assert.equal((await response.json()).access_hash,undefined);
  assert.equal(response.headers.get('cache-control'),'no-store');
});

test('legacy charge endpoints are closed', async () => {
  for(const route of ['confirm','status']) {
    const {POST}=loadTs(`src/app/api/payments/${route}/route.ts`);
    assert.equal((await POST()).status,410);
  }
});

test('refund/dispute notifications hold orders and delayed success cannot requeue them', async () => {
  let holds=0,writes=0;
  const sdk=new Whop({apiKey:'local-only',webhookKey:Buffer.from(process.env.WHOP_WEBHOOK_SECRET).toString('base64')});
  sdk.payments.retrieve=async()=>({...payment,substatus:'refunded'});
  const {POST}=loadTs('src/app/api/webhooks/whop/route.ts',{
    '@/lib/whop-sdk':{getWhopApi:()=>sdk},
    '@/lib/order-store':{getOrder:async()=>order,holdOrder:async()=>{holds++;},recordVerifiedPayment:async()=>{writes++;}},
  });
  assert.equal((await POST(signedWebhook({id:'msg_Refund',type:'refund.created',data:{payment}}))).status,200);
  assert.equal(holds,1); assert.equal(writes,0);
  assert.equal((await POST(signedWebhook({id:'msg_Delayed',type:'payment.succeeded',data:payment}))).status,200);
  assert.equal(holds,2); assert.equal(writes,0);
});

test('fulfilment denies nonstaff access and shipment cannot bypass payment validation', async () => {
  const {GET,POST}=loadTs('src/app/api/fulfilment/route.ts',{'@/auth':{auth:async()=>({user:{id:'user_NotStaff'}})}});
  process.env.DROPIFY_FULFILMENT_ADMIN_IDS='user_Staff';
  assert.equal((await GET()).status,403);
  assert.equal((await POST(request('/api/fulfilment',{orderId:order.id,trackingReference:'TEST'}))).status,403);
  const admin=loadTs('src/app/api/fulfilment/route.ts',{
    '@/auth':{auth:async()=>({user:{id:'user_Staff'}})},
    '@/lib/order-store':{getOrder:async()=>({...order,status:'paid',payment_id:payment.id}),orderRequest:async()=>{throw new Error('must not write');}},
    '@/lib/whop-sdk':{getWhopApi:()=>({payments:{retrieve:async()=>({...payment,substatus:'refunded'})}})},
  });
  assert.equal((await admin.POST(request('/api/fulfilment',{orderId:order.id,trackingReference:'TEST'}))).status,503);
});
