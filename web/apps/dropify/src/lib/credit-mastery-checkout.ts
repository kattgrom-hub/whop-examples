import "server-only";
import { products } from "@/data/products";
import { getWhopApi } from "./whop-sdk";
import { getWhopCompanyId, getWhopEnvironment } from "./checkout-config";
import { creditMasteryRelease, type CreditMasteryRelease } from "./credit-mastery-release";

export const creditMasteryOffer = Object.freeze({
  name: "Credit Clarity Workbook + AI Toolkit",
  amountMinor: 19700,
  currency: "aud",
  priceLabel: "A$197 total, one-time payment",
});

function hostedUrl(value: string, planId: string, environment: string) {
  const url = new URL(value);
  const host = environment === "sandbox" ? "sandbox.whop.com" : "whop.com";
  if (url.protocol !== "https:" || url.host !== host || url.username || url.password ||
      url.search || url.hash || url.pathname !== `/checkout/${planId}/`) {
    throw new Error("Invalid dedicated hosted checkout");
  }
  return url.href;
}

export function validateCreditRelease(release: CreditMasteryRelease) {
  if (release.environment !== getWhopEnvironment() || release.companyId !== getWhopCompanyId() ||
      !/^prod_[a-zA-Z0-9]+$/.test(release.productId) || !/^plan_[a-zA-Z0-9]+$/.test(release.planId)) {
    throw new Error("Dedicated release does not match this environment");
  }
  const url = hostedUrl(release.checkoutUrl, release.planId, release.environment);
  if (products.some(product => product.whopProductId === release.productId ||
      product.checkoutUrl === url || new URL(product.checkoutUrl).pathname === new URL(url).pathname)) {
    throw new Error("Creator-kit resources cannot fulfil AI Credit Mastery");
  }
  for (const evidence of [release.verificationReport, release.deliveryConfiguration]) {
    const source = new URL(evidence);
    if (source.protocol !== "https:" || source.username || source.password) {
      throw new Error("Release verification evidence is required");
    }
  }
  return url;
}

// Validate the current provider record on each checkout attempt; never trust
// browser prices, query parameters, a success return URL, or cached plan details.
export async function getCreditMasteryCheckout(): Promise<string | null> {
  if (!creditMasteryRelease) return null;
  const release = creditMasteryRelease;
  const url = validateCreditRelease(release);
  const plan = await getWhopApi().plans.retrieve(release.planId);
  if (plan.id !== release.planId || plan.product?.id !== release.productId ||
      plan.company?.id !== release.companyId || plan.currency !== creditMasteryOffer.currency ||
      plan.initial_price !== creditMasteryOffer.amountMinor / 100 ||
      plan.plan_type !== "one_time" || plan.renewal_price !== 0 || plan.billing_period !== null ||
      plan.trial_period_days !== null || plan.split_pay_required_payments !== null ||
      plan.expiration_days !== null || plan.release_method !== "buy_now" ||
      plan.tax_type !== "inclusive" ||
      hostedUrl(plan.purchase_url, release.planId, release.environment) !== url) {
    throw new Error("Whop plan does not match the approved A$197 offer");
  }
  return url;
}
