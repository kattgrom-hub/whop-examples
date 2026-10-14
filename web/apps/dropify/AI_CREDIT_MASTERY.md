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
