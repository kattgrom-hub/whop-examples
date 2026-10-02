# Dropify checkout release

## Current release blocker

As checked on 2026-10-03, Whop's sandbox guide explicitly says Whop Elements is not yet available in sandbox. Sandbox API credentials alone cannot validate the embedded payment flow. Keep Preview in sandbox and use mocked browser tests until Whop confirms support; do not switch Preview to production to work around this limitation.

Sandbox accounts, company IDs, API keys and webhooks are separate from production and must be created at https://sandbox.whop.com/dashboard/developer. A key created on whop.com is not a sandbox key. Sandbox currently supports card payments only, not Apple Pay or Google Pay.

Source: https://docs.whop.com/developer/guides/sandbox

## Payments overview integration

The existing full Whop Elements Checkout controller collects payment details and handles confirmation and provider actions. Keep that single payment path rather than also exposing a custom confirmation endpoint. The lower-level Payments API is intended for custom payment forms; this checkout already delegates those responsibilities to the Checkout controller.

Return handling follows the Payments overview: `succeeded` waits for the verified webhook, `failed` and `canceled` offer explicit retry, and pending or unknown statuses stay in confirmation mode so buyers cannot accidentally pay again. The document uses `no-referrer` because Whop can append a scoped `client_secret` to return URLs. URL status and browser callbacks never authorize fulfilment.

Reference: https://docs.whop.com/elements/latest/payments/overview

The cart is priced from the server catalog. An order is persisted before Whop receives a checkout configuration. The full Whop Checkout controller receives that configuration (including order metadata and required shipping collection). All restores return to `/checkout?orderId=...`; browser status parameters and completion events never mark an order paid.

Buyers access order status using a random HttpOnly, SameSite=Lax cookie. Only its SHA-256 hash is stored. No order token, secret or customer information is placed in the restore URL or returned from the status API. `planId` fallback is supported only for an existing authorized order, never an arbitrary plan query parameter. Legacy direct confirmation endpoints return 410.

## Database

Choose a Supabase database, run `database/orders.sql` once, and set `DROPIFY_SUPABASE_URL` plus the **server-only** `DROPIFY_SUPABASE_SERVICE_ROLE_KEY`. This release does not apply the schema to an external database automatically. Missing storage configuration disables checkout.

Tables have RLS enabled and no buyer policies or grants. The RPCs use SECURITY INVOKER with execution restricted to service_role. Payment recording, replay protection and fulfilment insertion occur in one transaction. Multiple paid attempts for one order are retained for review and cannot dispatch the order twice. Missing shipping addresses and refunds/disputes place orders on hold/review.

The rate limiter allows five checkout creations per hashed platform IP per minute. Outside Vercel, the local/shared limit is conservative; configure a trusted platform-specific client identity before moving to another hosting provider. Old rows in `dropify_checkout_limits` can be deleted during regular maintenance.

## Whop / hosting configuration

- Explicitly set `NEXT_PUBLIC_WHOP_ENVIRONMENT` to sandbox or production. Preview must use sandbox. Use API keys, company IDs and webhook secrets from that same environment. The locked SDK 0.0.28 uses `baseURL` (capital URL).
- `NEXT_PUBLIC_APP_URL` must be the checkout's actual HTTPS origin in production. Local loopback HTTP is allowed for development. Leave it blank for Preview: `VERCEL_URL` or `CHECKOUT_ALLOWED_ORIGINS` must allow the incoming origin. Set this per deployment; do not copy localhost or production origins into Preview.
- Set a random `CHECKOUT_SIGNING_SECRET` of at least 32 characters for hashed rate-limiter identities. Do not reuse a placeholder.
- Install/authorize the Whop app for the chosen company and grant checkout/plan/product creation and payment-read permissions required by the SDK endpoints. The inline physical product is unique per order and requires shipping collection; this example still sells the repository's original sample candles in USD. Confirm the catalog represents goods you can supply before live sales.
- Configure the endpoint `<origin>/api/webhooks/whop`, subscribe to `payment.succeeded`, `refund.created`, `refund.updated`, `dispute.created`, `dispute.updated`, and set its signing secret. Hosting protection must permit signed webhook POSTs without exposing staff pages.
- Configure Whop OAuth for staff and set the allowlisted Whop user IDs in `DROPIFY_FULFILMENT_ADMIN_IDS`. `/fulfilment` shows the durable queue to authenticated staff only. A tracking reference records manual dispatch; the app does not buy shipping labels or send customer emails. Staff must check address, stock and dispatch arrangements. Payment is rechecked with Whop before recording dispatch.
- Vercel root: `web/apps/dropify`, include source outside the root for the shared auth package. Build/install commands are in the app's `vercel.json`. The PR and fix branches have automatic deployment disabled for Dropify.
- If hosting enforces CSP, permit Whop's hosted script and frames from `cdn.whop.com` and the network origins used by the chosen environment. Register a payment-method domain if offering wallet payments. Sandbox cannot validate Apple Pay or Google Pay; verify their production domain and account configuration separately before offering them.

## Validation

From `web`: `pnpm --filter dropify test` and `pnpm --filter dropify build`.

Tests exercise tampered prices, invalid quantities, cross-site requests, wrong environments/origins, real SDK signature checks (including stale events), payment/order reconciliation, cookie authorization, staff restrictions, refunded payments, RLS, idempotency, rate limits and atomic rollback using local PGlite. No external Whop payment is created by the tests.

Browser scenarios use a local production server and a mocked Whop runtime: completion waits for the verified order, forged success URLs fail, failed/canceled returns require explicit retry, waitlist completion does not count as payment, and script errors offer a retry. To run, install Playwright locally, start Dropify on port 5018 with sandbox at build time, and run `node tests/browser-smoke.mjs` (set `DROPIFY_TEST_URL` for another port).

Once Whop supports Elements in sandbox, run a separate **sandbox-only** purchase-flow check with the configured database and webhook endpoint: success, decline, 3DS approval/cancellation, reload, duplicate webhook delivery, refund hold and queue inspection. These integration checks remain blocked by platform support; local mocks cannot prove account configuration or successful payment collection. A Vercel Ready deployment proves the application built, not that checkout accepts payments. Real purchases and a production launch require separate authorization.
