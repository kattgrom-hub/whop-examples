import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./load-ts.mjs";

test("AI Credit Mastery release remains closed until reviewed release evidence exists", () => {
  const { creditMasteryRelease } = loadTs("src/lib/credit-mastery-release.ts");
  assert.equal(creditMasteryRelease, null);
});

test("missing release returns no checkout and never calls Whop", async () => {
  let providerCalled = false;
  const checkout = loadTs("src/lib/credit-mastery-checkout.ts", {
    "@/data/products": { products: [] },
    "./whop-sdk": {
      getWhopApi() {
        providerCalled = true;
        throw new Error("Whop must not be called while release is absent");
      },
    },
    "./checkout-config": {
      getWhopCompanyId: () => "biz_test",
      getWhopEnvironment: () => "production",
    },
    "./credit-mastery-release": { creditMasteryRelease: null },
  });

  assert.equal(await checkout.getCreditMasteryCheckout(), null);
  assert.equal(providerCalled, false);
});

test("the approved public offer remains a single A$197 AUD one-time product", () => {
  const { creditMasteryOffer } = loadTs("src/lib/credit-mastery-checkout.ts", {
    "@/data/products": { products: [] },
    "./whop-sdk": { getWhopApi: () => { throw new Error("unexpected provider call"); } },
    "./checkout-config": {
      getWhopCompanyId: () => "biz_test",
      getWhopEnvironment: () => "production",
    },
    "./credit-mastery-release": { creditMasteryRelease: null },
  });

  assert.deepEqual(creditMasteryOffer, {
    name: "Credit Clarity Workbook + AI Toolkit",
    amountMinor: 19700,
    currency: "aud",
    priceLabel: "A$197 total, one-time payment",
  });
});
