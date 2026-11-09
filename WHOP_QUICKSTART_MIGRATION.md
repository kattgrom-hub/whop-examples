# Whop Quickstart migration — implementation plan

Status: **review required; no production changes**

This audit compared the repository's current `main` branch with Whop's current published TypeScript SDK and embedded-checkout guidance.

## Confirmed repository findings

- `web/apps/dropify/package.json` pins `@whop/sdk` to `0.0.28`.
- `web/packages/webhooks/package.json` pins `@whop/sdk` to `2.5.0`.
- `web/pnpm-lock.yaml` records the old Dropify SDK dependency and must be regenerated with the workspace package manifests.
- `web/apps/dropify/src/lib/whop-sdk.ts` constructs the older default-export `Whop` client using `apiKey`, `baseURL`, and a hard-coded `Api-Version-Date: 2025-01-01`.
- The current published `@whop/sdk` is `2.7.0`; current examples use `WhopClient`, `token`, and `WhopEnvironment`.
- Dropify's checkout route currently sends a nested, dynamically created `plan` object to `checkoutConfigurations.create`. Whop's current embedded-checkout example instead creates a checkout configuration using an existing `variant_id` and an idempotency key. This payload and the order-to-plan mapping must be migrated and tested, not assumed compatible.
- Dropify's client component currently loads a custom Elements script and uses the older `Elements(...).checkout.create(...)` interface. Whop's current example uses `loadWhop` from `@whop/elements` and `Checkout`, `CheckoutElement`, and `WhopElements` from `@whop/elements-react`. Confirm the supported integration path and add the React package if adopting that current example.
- The webhook verifier in `web/packages/webhooks/index.cjs` uses `unwrapWebhook` against the raw request body and validates the signed v1 envelope. The ingress queues a reduced payment reference for asynchronous reconciliation. Preserve this security boundary and test duplicate delivery and durable queue acknowledgement.
- The AI Credit Mastery release remains deliberately null. Its purchase endpoint must continue returning 503 until the dedicated production resources and delivery evidence are reviewed.

## Deployment check observed during this audit

The commit for this documentation branch has mixed Vercel statuses:
- `kattassie-dropify` preview reported success.
- `whop-examples` preview reported `BUILD_FAILED` / `Resource provisioning failed`; the Vercel events endpoint did not expose build logs for this deployment, so the cause is not established.
- `kattassie-ai-business-manager` failed before build because its Vercel project is configured with root directory `apps/kattassie-ai-business-manager`, which does not exist in this repository. This is a Vercel project configuration mismatch, not evidence of a Whop SDK compile error.

These are preview checks associated with this documentation commit; they do not prove production checkout health.

## Required implementation sequence

1. Update all workspace `@whop/sdk` dependencies to one tested version (current published version observed: 2.7.0; pin it exactly for the migration).
2. Regenerate `web/pnpm-lock.yaml` with the repository's pinned pnpm version (10.28.2). Do not hand-edit package integrity or snapshot metadata.
3. Migrate the shared Whop client to `WhopClient` and `WhopEnvironment`, retaining strict server-only secret access and explicit sandbox/production separation.
4. Remove the stale hard-coded API version date only after confirming the SDK's supported version-date configuration and the API version required by this project.
5. Migrate checkout creation to the current supported checkout-configuration contract. Preserve server-side order creation, cart price validation, metadata linkage, idempotency, and environment checks. Do not create a new plan per cart/order unless Whop's current API explicitly requires it.
6. Migrate or explicitly validate the existing client-side Elements integration against the current supported package/API. Do not treat the browser's completion callback as proof of payment.
7. Compile and test every app importing the SDK, not just Dropify. In particular, verify plan retrieval, checkout configuration creation, webhook helpers, and any auth/OAuth flows.
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
- Checkout creation and Elements rendering work in sandbox.
- Browser completion alone cannot mark an order paid.
- Webhook signature verification, durable acceptance, idempotent reconciliation, refunds, and failure handling pass tests.
- AI Credit Mastery purchases remain closed until a separately reviewed release.
