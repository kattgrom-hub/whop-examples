# Whop Quickstart migration — implementation plan

Status: **review required; no production changes**

This audit compared the current `main` branch with the official Whop TypeScript SDK Quickstart and the published `@whop/sdk` package.

## Confirmed repository findings

- `web/apps/dropify/package.json` pins `@whop/sdk` to `0.0.28`.
- `web/packages/webhooks/package.json` pins `@whop/sdk` to `2.5.0`.
- `web/pnpm-lock.yaml` records the old Dropify SDK dependency and must be regenerated with the workspace package manifests.
- `web/apps/dropify/src/lib/whop-sdk.ts` constructs the older `Whop` client using `apiKey`, `baseURL`, and a hard-coded `Api-Version-Date: 2025-01-01`.
- The current SDK Quickstart uses `WhopClient`, `token`, and `WhopEnvironment`; the current published package is `2.7.0`.
- The webhook verifier in `web/packages/webhooks/index.cjs` uses `unwrapWebhook` and validates the signed v1 envelope.
- The AI Credit Mastery release remains deliberately null. Its purchase endpoint must continue returning 503 until the dedicated production resources and delivery evidence are reviewed.

## Required implementation sequence

1. Update all workspace `@whop/sdk` dependencies to a single tested version (minimum 2.7.0; prefer exact pinning for this migration).
2. Regenerate `web/pnpm-lock.yaml` with the repository's pinned pnpm version (10.28.2). Do not hand-edit package integrity or snapshot metadata.
3. Migrate the shared Whop client to `WhopClient` and `WhopEnvironment`, retaining strict server-only secret access and explicit sandbox/production separation.
4. Remove the stale hard-coded API version date only after confirming the SDK's supported version-date configuration and the API version required by this project.
5. Compile and test every app importing the SDK, not just Dropify. In particular, verify plan retrieval, checkout configuration creation, webhook helpers, and any auth/OAuth flows.
6. Keep the existing checkout routes and AI Credit Mastery null-release gate unchanged until the migration passes.
7. Run sandbox tests for checkout creation, signed webhook delivery, duplicate events, payment failures, refunds, and order reconciliation.
8. Open a separate reviewed change for any AI Credit Mastery production release. Do not enable it as part of the SDK migration.

## Why the dependency bump is not applied in this documentation-only change

The repository is a pnpm workspace. Updating package manifests without regenerating the lockfile can break frozen-lockfile CI installs. The connected GitHub file-edit workflow cannot execute pnpm or the TypeScript build, so it cannot safely generate and verify the lockfile. This change records the verified migration scope rather than committing an unbuildable dependency update.

## Acceptance criteria

- All workspace packages resolve one compatible Whop SDK version.
- Frozen-lockfile install succeeds.
- TypeScript checks and app builds pass for all affected applications.
- Sandbox and production clients cannot be cross-wired.
- Existing checkout/order behaviour remains covered by tests.
- Webhook signature verification and idempotent processing pass tests.
- AI Credit Mastery purchases remain closed until a separately reviewed release.
