# AI Credit Mastery launch contract

AI Credit Mastery is a separate product from the existing creator-kit catalog.

## Approved offer

- Product: AI Credit Mastery — Credit Clarity Workbook + AI Toolkit
- Price: A$197 AUD, one-time
- Subscription: none
- Delivery: secure digital delivery for the approved Credit Clarity bundle
- Checkout: dedicated Whop hosted checkout only

## Safety gate

Public sales must remain closed until all of these are true:

1. A dedicated Whop product/plan exists for the A$197 AUD one-time offer.
2. Its hosted checkout URL is known and belongs to that product/plan.
3. The Credit Clarity digital bundle is attached to the same product.
4. `payment.succeeded` is the fulfilment source of truth.
5. One successful payment produces exactly one delivery.
6. Failed, expired and cancelled payments produce no access.
7. Duplicate webhook events are idempotent.
8. Refund handling is verified.
9. Public CTAs all use the same verified hosted checkout URL.

Do not use a creator-kit product ID, plan ID, checkout URL or delivery entitlement for AI Credit Mastery.
Do not make a real purchase merely to test this workflow.

## Existing creator-kit catalog

The products in `src/data/products.ts` are creator products and are not AI Credit Mastery. They must remain unchanged unless separately requested.

## Implementation boundary

Do not add AI Credit Mastery to `src/data/products.ts` until its real Whop product ID and hosted checkout URL have been created and verified. A placeholder or invented checkout URL would create a false launch path.

When the real Whop identifiers are available, implement AI Credit Mastery as a dedicated product path and add regression tests proving that:

- creator-kit checkout URLs cannot be selected for AI Credit Mastery;
- AI Credit Mastery cannot use creator-kit delivery;
- the A$197 price is server/config authoritative;
- checkout stays unavailable when the dedicated Whop configuration is absent.

## Dedicated checkout implementation (sales remain closed)

`/ai-credit-mastery` presents the approved single offer. All of its purchase
actions use `POST /api/credit-mastery/checkout`. There are no client-supplied
product IDs, amounts or redirect destinations. No public link has been added to
the creator-kit catalog.

`src/lib/credit-mastery-release.ts` deliberately contains a **null release**.
Neither the existing Dropify delivery flag nor webhook/reconciliation settings
can enable this path. The unconfigured endpoint returns HTTP 503 without calling
Whop, creating resources, charging a buyer or granting access.

After all release gates above have passed, a separate reviewed change may add a
release containing the dedicated company, product, plan, exact canonical hosted
URL, environment, verification-report link and native-delivery configuration
link. Those links document review evidence; the code does not independently
prove delivery merely because a link exists. Keep the release null until that
evidence has actually been reviewed. Sandbox verification alone does not approve
production purchases.

At every purchase attempt the server retrieves the plan through the repository's
existing Whop SDK and verifies the configured seller/product/plan, AUD 197,
one-time billing, no renewal/trial/installments/expiry, inclusive tax and exact
hosted URL. Errors fail closed. The browser cannot select a creator-kit plan or
override the amount. Preview deployments must use sandbox configuration.

### Remaining provider work before a release can be populated

1. Configure and inspect the dedicated Whop resources and attach the actual
   approved downloadable files to authenticated native Whop delivery.
2. Verify the final checkout total, policy disclosure and delivery entitlement
   match the offer. Do not put bundle files in the Next.js public directory.
3. Record test evidence for signed payment success, exactly one entitlement,
   duplicates, failed/expired/cancelled payments, refunds and delayed events.
4. Confirm the dedicated native-delivery setup fulfils from verified payment
   state. The existing `/api/webhooks/whop` processes only `dropify_order`
   metadata and **does not fulfil this hosted product**. Its infrastructure
   readiness is not evidence of AI Credit Mastery delivery.
5. Review production configuration separately, then populate the release in an
   explicit launch change. Recheck the Whop resources after subsequent changes.

This implementation adds the isolated checkout layer, not a verified live
payment-and-delivery deployment. No real purchase is required for these tests.
