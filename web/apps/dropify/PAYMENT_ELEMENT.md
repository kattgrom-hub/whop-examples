# Kattassie PaymentElement integration

`/payment-element` implements Whop's lower-level payment form: the official
`@whop/elements` 1.8.0 loader, a Payments controller, PaymentElement with full
billing details, mandatory BrandingElement, email collection, readiness gating,
confirmation tokens, server confirmation and pending provider actions.

This is a **disabled sandbox integration**, not a replacement for the shop's
hosted purchase links. Those links continue to grant native access to each kit.
The new form cannot run in the production Whop environment or a Vercel production
deployment. It does not fulfil orders, grant downloads or mark legacy orders paid.
Its webhook metadata is deliberately separate from the legacy fulfilment path.
Branch deployments are disabled in both Vercel configuration files.

## Sandbox configuration

Once Whop supports Elements in sandbox:

1. Set `NEXT_PUBLIC_WHOP_ENVIRONMENT=sandbox` and the sandbox company's
   `NEXT_PUBLIC_WHOP_COMPANY_ID` and server-only `WHOP_API_KEY`.
2. Choose a sandbox plan belonging to that company and set
   `DROPIFY_PAYMENT_ELEMENT_PLAN_ID`. The browser cannot choose the server's
   plan, seller, price or return URL. The plan supplies pricing and methods.
3. Use a sandbox Supabase database; apply `database/orders.sql`, then
   `database/payment-element.sql`. Configure `DROPIFY_SUPABASE_URL`, the
   server-only `DROPIFY_SUPABASE_SERVICE_ROLE_KEY`, and a random
   `CHECKOUT_SIGNING_SECRET` of at least 32 characters. No schema is applied
   automatically.
4. Configure the local/Preview origin as described in CHECKOUT.md and set
   `DROPIFY_PAYMENT_ELEMENT_ENABLED=true`. Visit `/payment-element` directly;
   it has no shop purchase link. The pay button starts a sandbox test only.

Never use a production key or production plan for this route. The API host is
fixed to `sandbox-api.whop.com`; the runtime also explicitly uses sandbox.
The current Whop sandbox guide still says Elements isn't available there, so
real sandbox collection and 3DS validation remain blocked as of 2026-10-09.

## Attempt handling

An HttpOnly, SameSite=Lax cookie identifies the browser's session. Only its
access hash is stored. Session creation is rate limited using the existing
durable checkout limiter. A database compare-and-set reserves one attempt
before sending a confirmation token to Whop. Parallel requests get 409.

A timeout leaves the reservation locked: Whop might have accepted the charge.
The form never automatically retries charge creation. If confirmation succeeded
but the response was lost, the status endpoint can recover the recorded payment.
If the provider accepted a charge but its response or database attachment was
lost, the session reports `unknown` and needs reconciliation using the provider's
`element_session` metadata. It must not be unlocked without checking Whop.

Terminal failures also retain the reservation. To run another controlled sandbox
test, use a fresh browser context after confirming the old attempt is terminal.
Production retry/expiry/reconciliation and native kit access would require a
separate validated rollout before removing the production block.

Status comes from an authenticated server fetch and matches the recorded payment,
seller, plan and metadata. Redirect parameters and `handleNextAction` results do
not confirm success. Scoped client secrets are returned only to the authorized
browser with `Cache-Control: no-store`, removed from the address bar on return,
and excluded from referrers by the existing app metadata.

## Validation

Run `pnpm --filter dropify test` from `web` for route, identity, timeout,
concurrency, database rate-limit and RLS tests, including the existing checkout
regressions. Run `pnpm --filter dropify build` with
`NEXT_PUBLIC_WHOP_ENVIRONMENT=sandbox`.

`tests/payment-element-browser.mjs` exercises the built page in Chromium with all
Whop traffic mocked or blocked: initial session failure/retry, readiness gating,
double submission, forged return parameters, provider-result versus server-status
confirmation, unresolved attempts, resumed verification and script failure/reload.
With Playwright installed separately, run from the app directory:

```sh
DROPIFY_TEST_START=1 node tests/payment-element-browser.mjs
```

`PLAYWRIGHT_MODULE_PATH` and `CHROMIUM_EXECUTABLE_PATH` can point to an existing
test installation. `DROPIFY_TEST_URL` selects the local origin (default port 5019).
The script starts and stops a local production server with sandbox flags. Initial
session failures have a working retry; missing API credentials are checked before
an attempt is reserved.

Local mocks cannot prove API permissions, correct account configuration, provider
authentication, or payment collection. No external payment, schema change or
deployment is performed by these checks.

References:

- https://docs.whop.com/elements/latest/payments/payment
- https://docs.whop.com/elements/latest/payments/overview
- https://docs.whop.com/api-reference/payments/create-payment
- https://docs.whop.com/developer/guides/sandbox
