# Legacy AI Credit Mastery portal remediation

## Read-only audit finding — 6 November 2026

The current launch contract in this repository protects the new Dropify route at `/ai-credit-mastery`, but a separate Supabase-hosted portal remains active and is not controlled by the Dropify release flag.

Read-only inspection of Supabase project `annkrblalwfefhyifgzq` found:

- Edge Function `ai-credit-mastery` is ACTIVE, version 1, with JWT verification disabled because it serves a public HTML login/marketing page.
- Its page still embeds three direct Stripe Payment Links: Self-Paced Blueprint (A$197), AI Toolkit Bundle (A$497), and Accelerator Cohort (A$1,497).
- All three corresponding `acm_products` records are currently `active=true`.
- The separate `stripe-ai-credit-mastery` webhook is ACTIVE, version 3. It records paid purchases and entitlements, and handles refunds/disputes by updating purchase and entitlement state.
- Read-only counts at audit time: 3 product rows, 0 rows in `acm_purchases`, 0 in `acm_entitlements`, and 0 in `acm_stripe_events`.

These observations are a snapshot, not proof that there are no historic buyers or obligations. Stripe dashboard history, payment-link history, email receipts, exports and other systems have not been reconciled.

## Required remediation

The legacy public portal must be brought into line with the approved single-offer contract before any production launch:

1. Remove the three hard-coded Stripe purchase links from the public portal. Replace the purchase section with a clear unavailable notice while Whop payment and delivery remain unverified.
2. Do not add a Whop purchase link until a dedicated A$197 AUD one-time product, plan, canonical hosted checkout, native delivery and signed-webhook fulfilment have all been verified.
3. Keep the `stripe-ai-credit-mastery` webhook deployed during the investigation. Do not delete it, rotate its signing secret, disable it, or change its event handling until historic payment, refund, dispute and entitlement obligations have been reconciled.
4. Review the three product records. The A$497 and A$1,497 offers are paused in the current commercial scope, but do not deactivate product records until historical customer access and any active purchase links are checked.
5. Preserve all existing entitlements and member login behavior. Do not revoke access or alter account creation/sign-in flows as part of hiding purchase CTAs.
6. Add automated tests for the public portal HTML ensuring no legacy Stripe Payment Link or paused-tier CTA is emitted.
7. Deploy the replacement Edge Function only after review and explicit production approval; verify the deployed function version and public response afterward.

## Security and access notes

The legacy page's browser code signs users in with Supabase Auth, then calls `ai-credit-mastery-course` with the user's access token. That course function requires JWT verification and returns course data based on authenticated entitlement access. The public page's JWT-disabled setting is therefore not itself evidence of a bypass; it is the public entry page. Keep the course endpoint's authorization and row-level-security checks intact.

The course endpoint currently queries active entitlements for the authenticated caller and relies on database policies to scope visible rows. Do not simplify these queries or disable RLS as part of this remediation.

## Release boundary

The Dropify `creditMasteryRelease` remains null. The new A$197 offer remains unavailable. This document records an audit finding and a safe remediation sequence only.

No live Supabase function, database row, Stripe setting, Whop resource, customer entitlement, or Vercel setting was changed during this audit.
