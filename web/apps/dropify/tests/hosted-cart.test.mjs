import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './load-ts.mjs';

const { getHostedCartOffer, creatorBundle } = loadTs('src/lib/hosted-cart.ts');

test('hosted checkout selects the exact purchased entitlement and bundle price', () => {
  const coastal = 'coastal-creator-toolkit', viral = 'viral-gold-video-kit';
  assert.equal(getHostedCartOffer([coastal]).checkoutUrl, 'https://whop.com/checkout/plan_jXJDMD5T3MKJD/');
  assert.equal(getHostedCartOffer([viral]).checkoutUrl, 'https://whop.com/checkout/plan_iTC5mUal2nJw5/');
  for (const pair of [[coastal, viral], [viral, coastal]]) {
    const offer = getHostedCartOffer(pair);
    assert.equal(offer, creatorBundle);
    assert.equal(Math.round(offer.price * 100), 4999);
    assert.equal(offer.checkoutUrl, 'https://whop.com/checkout/plan_BlhWmxBPGOOeC/');
  }
  for (const ids of [[], ['unknown'], [coastal, coastal], [viral, viral], [coastal, 'unknown'], [coastal, viral, 'unknown']]) {
    assert.equal(getHostedCartOffer(ids), null);
  }
});
