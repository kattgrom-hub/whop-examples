import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs, require } from './load-ts.mjs';
const { renderToStaticMarkup } = require('react-dom/server');

Object.assign(process.env, {
  NEXT_PUBLIC_WHOP_ENVIRONMENT: 'sandbox',
  NEXT_PUBLIC_WHOP_COMPANY_ID: 'biz_CreditTest',
  NEXT_PUBLIC_APP_URL: 'http://localhost:5007',
});
const release = {
  environment: 'sandbox', companyId: 'biz_CreditTest', productId: 'prod_CreditTest', planId: 'plan_CreditTest',
  checkoutUrl: 'https://sandbox.whop.com/checkout/plan_CreditTest/',
  verificationReport: 'https://example.test/review', deliveryConfiguration: 'https://example.test/delivery',
};
const plan = {
  id: release.planId, product: { id: release.productId }, company: { id: release.companyId },
  currency: 'aud', initial_price: 197, plan_type: 'one_time', renewal_price: 0,
  billing_period: null, trial_period_days: null, split_pay_required_payments: null,
  expiration_days: null, tax_type: 'inclusive', release_method: 'buy_now', purchase_url: release.checkoutUrl,
};
function checkout(config = release, record = plan) {
  const calls = [];
  const loaded = loadTs('src/lib/credit-mastery-checkout.ts', {
    './credit-mastery-release': { creditMasteryRelease: config },
    './whop-sdk': { getWhopApi: () => ({ plans: { retrieve: async id => { calls.push(id); return record; } } }) },
  });
  return { ...loaded, calls };
}
test('checked-in release stays closed even with existing payment flags enabled', async () => {
  Object.assign(process.env, { DROPIFY_DIGITAL_DELIVERY_READY: 'true', AI_CREDIT_MASTERY_ENABLED: 'true' });
  const loaded = loadTs('src/lib/credit-mastery-checkout.ts', {
    './whop-sdk': { getWhopApi: () => { throw new Error('must not contact Whop'); } },
  });
  assert.equal(await loaded.getCreditMasteryCheckout(), null);
});
test('a verified dedicated release uses the provider plan and fixed A$197 offer', async () => {
  const loaded = checkout();
  assert.equal(await loaded.getCreditMasteryCheckout(), release.checkoutUrl);
  assert.deepEqual(loaded.calls, [release.planId]);
  assert.equal(loaded.creditMasteryOffer.amountMinor, 19700);
  assert.equal(Object.isFrozen(loaded.creditMasteryOffer), true);
});
test('creator-kit products and checkout plans are rejected independently', async () => {
  for (const change of [
    ...loadTs('src/data/products.ts').products.flatMap(product => {
      const planId = new URL(product.checkoutUrl).pathname.split('/')[2];
      return [
        { productId: product.whopProductId },
        { planId, checkoutUrl: `https://sandbox.whop.com/checkout/${planId}/` },
      ];
    }),
  ]) {
    const loaded = checkout({ ...release, ...change });
    await assert.rejects(loaded.getCreditMasteryCheckout());
    assert.equal(loaded.calls.length, 0);
  }
});
test('mismatched seller/environment, missing evidence and unsafe redirect URLs fail closed', async () => {
  for (const change of [
    { companyId: 'biz_Other' }, { environment: 'production' }, { productId: '' },
    { verificationReport: '' }, { deliveryConfiguration: 'http://example.test' },
    ...['https://attacker.test/checkout/plan_CreditTest/', 'https://whop.com/checkout/plan_CreditTest/',
      'https://sandbox.whop.com/checkout/plan_Other/', release.checkoutUrl + '?price=1',
      release.checkoutUrl + '#fragment', 'https://user:pass@sandbox.whop.com/checkout/plan_CreditTest/']
      .map(checkoutUrl => ({ checkoutUrl })),
  ]) await assert.rejects(checkout({ ...release, ...change }).getCreditMasteryCheckout());
});
test('live plan drift cannot change identity, price, currency, billing or tax treatment', async () => {
  for (const change of [
    { id: 'plan_Other' }, { company: { id: 'biz_Other' } }, { product: { id: 'prod_Other' } },
    { product: null }, { initial_price: 1.97 }, { initial_price: 197.001 }, { currency: 'usd' },
    { plan_type: 'renewal' }, { renewal_price: 197 }, { billing_period: 30 },
    { trial_period_days: 7 }, { split_pay_required_payments: 3 }, { expiration_days: 30 },
    { release_method: 'waitlist' }, { tax_type: 'exclusive' }, { tax_type: 'unspecified' },
    { purchase_url: 'https://attacker.test/' },
  ]) await assert.rejects(checkout(release, { ...plan, ...change }).getCreditMasteryCheckout());
});
const request = (origin = 'http://localhost:5007') => new Request('http://localhost:5007/api/credit-mastery/checkout?price=1&status=succeeded', {
  method: 'POST', headers: { origin }, body: JSON.stringify({ price: 1, checkoutUrl: 'https://attacker.test' }),
});
test('checkout endpoint ignores browser overrides and rechecks before redirecting', async () => {
  let calls = 0;
  const route = loadTs('src/app/api/credit-mastery/checkout/route.ts', {
    '@/lib/credit-mastery-checkout': { getCreditMasteryCheckout: async () => { calls++; return release.checkoutUrl; } },
  });
  assert.equal((await route.POST(request('https://attacker.test'))).status, 403);
  assert.equal(calls, 0);
  const response = await route.POST(request());
  assert.equal(response.status, 303);
  assert.equal(response.headers.get('location'), release.checkoutUrl);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(calls, 1);
});
test('closed release and provider outage return 503 with no checkout URL', async () => {
  for (const getCreditMasteryCheckout of [async () => null, async () => { throw new Error('private-provider-response'); }]) {
    const route = loadTs('src/app/api/credit-mastery/checkout/route.ts', {
      '@/lib/credit-mastery-checkout': { getCreditMasteryCheckout },
    });
    const response = await route.POST(request());
    assert.equal(response.status, 503);
    assert.equal(response.headers.get('location'), null);
    assert.deepEqual(await response.json(), { error: 'Purchases currently unavailable.' });
  }
});
test('closed product page has no purchase form, checkout URL or false success state', async () => {
  const Page = loadTs('src/app/ai-credit-mastery/page.tsx').default;
  const markup = renderToStaticMarkup(await Page());
  assert.match(markup, /Purchases currently unavailable/);
  assert.match(markup, /A\$197 total, one-time payment/);
  assert.doesNotMatch(markup, /<form|whop\.com\/checkout|payment successful/i);
});


test('closed product publishes machine-readable A$197 AUD offer without claiming stock', async () => {
  const Page = loadTs('src/app/ai-credit-mastery/page.tsx').default;
  const markup = renderToStaticMarkup(await Page());
  assert.match(markup, /application\/ld\+json/);
  assert.match(markup, /schema\.org\/OutOfStock/);
  assert.match(markup, /"price":"197\.00"/);
  assert.match(markup, /"priceCurrency":"AUD"/);
  assert.doesNotMatch(markup, /schema\.org\/InStock/);
  assert.doesNotMatch(markup, /whop\.com\/checkout/);
});
