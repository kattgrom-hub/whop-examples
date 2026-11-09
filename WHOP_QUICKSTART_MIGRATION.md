# Whop Quickstart migration — implementation plan

Status: **review required; no production changes**

This audit compared the repository's current `main` branch with Whop's current published TypeScript SDK and official embedded-payments example (checked 9 November 2026).

## Confirmed repository findings

- `web/apps/dropify/package.json` pins `@whop/sdk` to `0.0.28`.
- `web/packages/webhooks/package.json` pins `@whop/sdk` to `2.5.0`.
- `web/pnpm-lock.yaml` records the old Dropify SDK dependency and must be regenerated with the workspace package manifests.
- `web/apps/dropify/src/lib/whop-sdk.ts` constructs the older default-export `Whop` client using `apiKey`, `baseURL`, and a hard-coded `Api-Version-Date: 2025-01-01`.
- The current published `@whop/sdk` is `2.7.0`; current examples use `WhopClient`, `token`, and `WhopEnvironment`.
- **Important checkout design issue:** `web/apps/dropify/src/app/api/checkout/route.ts` creates a new hidden Whop plan inside each checkout request. It builds the plan dynamically from the cart/order and sends it as a nested `plan` object to `checkoutConfigurations.create`. This can create plan/catalogue clutter and is not the official existing-plan variant flow. The current call also does not pass an idempotency key. Migrate to a pre-created, approved plan using `variant_id`, attach `metadata.order_id`, and use a stable per-order idempotency key. Preserve server-side price/order validation; never trust a client-supplied variant price.
- Dropify's client component currently loads a custom Elements script and uses `Elements(...).checkout.create(...)`. Whop's current official React example installs `@whop/elements@1.9.0` and `@whop/elements-react@1.9.0`, calls `loadWhop()`, and renders `WhopElements`, `Checkout`, and `CheckoutElement`. The current package manifest includes `@whop/elements` but not `@whop/elements-react`. Prefer the documented React integration unless a compatibility test proves the current script integration is still supported for this app.
- The webhook verifier in `web/packages/webhooks/index.cjs` uses `unwrapWebhook` against the raw request body and validates the signed v1 envelope. The ingress queues a reduced payment reference for asynchronous reconciliation. Preserve this security boundary and test duplicate delivery and durable queue acknowledgement.
- Whop's official guide explicitly says fulfilment should be driven by the signed `payment.succeeded` webhook; the browser's `onComplete` callback only indicates that checkout interaction finished. The existing browser callback must never mark an order paid.
- The AI Credit Mastery release remains deliberately null. Its purchase endpoint must continue returning 503 until the dedicated production resources and delivery evidence are reviewed.

## Additional checkout and webhook review

- The checkout route writes a pending order before calling Whop. If Whop rejects the checkout request, the catch block returns 503 but does not cancel/expire the pending order. A retry generates a new order UUID, so the first order can remain orphaned. Add an explicit checkout-creation state and safe compensation/expiry path; do not mark the order paid or retry against an uncertain Whop response without reconciliation.
- `checkoutClientKey(request)` is derived from the caller IP (HMAC) and is passed to the database order-creation RPC as a rate-limit/client key. It is not passed to Whop's checkout-configuration creation call and therefore does not provide Whop-side idempotency.
- The webhook ingress verifies the raw signed envelope and checks the v1 event ID against the `webhook-id` header. Reconciliation then retrieves authoritative payment state and validates company, plan, checkout configuration, order metadata, currency, and amount before recording payment. This is a good foundation.
- The webhook tests cover signature tampering, key mismatch, timestamp boundaries, malformed envelopes, missing secrets, and payload size. They do not currently demonstrate end-to-end durable queue acknowledgement, duplicate event delivery, repeated reconciliation idempotency, refund/dispute races, or retry recovery. Those remain required integration tests, not proven behaviour from the unit test file.
- The checkout route has a separate `DROPIFY_DIGITAL_DELIVERY_READY` fail-closed gate. Keep it false until fulfilment is connected and verified.

## Deployment and CI observations

The documentation branch commit has mixed Vercel statuses:
- `kattassie-dropify` preview reported success.
- `whop-examples` preview reported `BUILD_FAILED` / `Resource provisioning failed`; the Vercel events endpoint did not expose build logs for this deployment, so the cause is not established.
- `kattassie-ai-business-manager` failed before build because its Vercel project is configured with root directory `apps/kattassie-ai-business-manager`, which does not exist in this repository. This is a Vercel project configuration mismatch, not evidence of a Whop SDK compile error.

The only workflow currently present under `.github/workflows` is `dropify-checkout.yml`. It runs on pull requests only when app/package/lockfile/workflow paths change, or by manual `workflow_dispatch`. Since PR #25 changes only this Markdown document, no workflow run was created for it. These preview checks do not prove production checkout health.

## Required implementation sequence

1. Update all workspace `@whop/sdk` dependencies to one tested version (current published version observed: 2.7.0; pin it exactly for the migration). Add the two Whop Elements packages at the compatible 1.9.0 version if adopting the official React example.
2. Regenerate `web/pnpm-lock.yaml` with the repository's pinned pnpm version (10.28.2). Do not hand-edit package integrity or snapshot metadata.
3. Migrate the shared Whop client to `WhopClient` and `WhopEnvironment`, retaining strict server-only secret access and explicit sandbox/production separation.
4. Remove the stale hard-coded API version date only after confirming the SDK's supported version-date configuration and the API version required by this project.
5. Replace per-checkout plan creation with `variant_id` for an existing approved plan, `metadata.order_id`, and a per-order idempotency key. Preserve server-side order creation, cart price validation, metadata linkage, and environment checks. Do not create a new plan per cart/order.
6. Migrate the client-side checkout to the official Elements React components, or document and test the compatibility of the existing script integration. A checkout completion callback may update UI state only; it cannot fulfil an order.
7. Compile and test every app importing the SDK, not just Dropify. In particular, verify plan retrieval, checkout configuration creation, Elements rendering, webhook helpers, and any auth/OAuth flows.
8. Keep the existing checkout routes and AI Credit Mastery null-release gate unchanged until the migration passes.
9. Run sandbox tests for checkout creation, signed webhook delivery, duplicate events, payment failures, refunds, and order reconciliation.
10. Correct the unrelated Vercel project root-directory mismatch and investigate the `whop-examples` provisioning failure separately.
11. Open a separate reviewed change for any AI Credit Mastery production release. Do not enable it as part of the SDK migration.

## Why the dependency bump is not applied in this documentation-only change

The repository is a pnpm workspace. Updating package manifests without regenerating the lockfile can break frozen-lockfile CI installs. The connected GitHub file-edit workflow cannot execute pnpm or the TypeScript build, so it cannot safely generate and verify the lockfile. This change records the verified migration scope rather than committing an unbuildable dependency update.

## Acceptance criteria

- All workspace packages resolve one compatible Whop SDK version.
- Frozen-lockfile install succeeds.
- TypeScript checks and app builds pass for all affected applications.
- Sandbox and production clients cannot be cross-wired.
- Checkout creation uses an existing approved plan variant, not a newly created plan for every order.
- Per-order idempotency prevents duplicate checkout configuration creation on retries.
- Checkout and Elements rendering work in sandbox.
- Browser completion alone cannot mark an order paid.
- Signed webhook verification, durable acceptance, idempotent reconciliation, refunds, and failure handling pass tests.
- AI Credit Mastery purchases remain closed until a separately reviewed release.
