# Whop v1 webhook migration

Code migration prepared 15 October 2026. **Not deployed or live-validated.**

## Implemented

All five `/api/webhooks/whop` handlers now use the current `@whop/sdk/helpers` verifier through `@whop-examples/webhooks`. The shared package pins SDK 2.5.0; existing payment/API clients keep their existing SDK versions. Pass `WHOP_WEBHOOK_SECRET` exactly as issued, including `ws_`; no manual encoding. Verification uses raw UTF-8 body bytes, Standard Webhooks headers, the SDK's timestamp tolerance and signature rotation support. Missing configuration returns 503; bad signatures return 401; invalid v1 envelopes or inconsistent body/header IDs return 400. No legacy unsigned fallback exists.

Handlers consume `type` and `data` from the signed v1 envelope. Current membership subscriptions are `membership.activated` and `membership.updated`; updates only downgrade canceled/expired memberships, not cancellation scheduled at period end. Masterclass, Winners Club and Waterbnb retrieve current membership state before applying membership effects, so delayed activation snapshots cannot grant canceled access. Payout monitoring uses `payout.updated`, without treating every update as completion. Waterbnb/Winners Club event persistence now receives the envelope `webhook-id`, rather than conflating delivery IDs and payment IDs.

Dropify retains its durable database replay protection, current payment lookup, seller/environment/amount/plan checks and refund/dispute holds. Its API client no longer handles webhook secrets. AI Credit Mastery's separate launch gate and all checkout availability settings are unchanged.

## Required subscriptions

| App | Events |
| --- | --- |
| Dropify | `payment.succeeded`, `refund.created`, `refund.updated`, `dispute.created`, `dispute.updated` |
| Masterclass | `membership.activated`, `membership.updated` |
| Waterbnb, Winners Club, Titled Tuesday | `payment.succeeded`, `payment.failed`, `membership.activated`, `membership.updated`, `payout.updated` |

## Cutover requirements

1. Inventory actual Whop endpoints, owners, environments, subscribed events, enabled state and version pins. No account-level inventory was available in this session. Do not disable any current endpoint yet.
2. Coordinate this change with draft PR #9 (`fix/whop-api-version-compatibility`), which separately pins existing API clients. This branch does not replace that REST migration. Retain a compatible dated webhook contract (the existing pre-versioning data shape, `2025-01-01`, proposed in #9) until the deployed payment/resource readers are validated against a newer date. Installing a current signature helper does not migrate money fields or other REST schemas.
3. Deploy this code to a separate reachable deployment/hostname for validation. Create a v1 webhook to that deployment, set an explicit compatible `api_version_date`, and securely configure that endpoint's own signing secret. Never paste secrets into source, logs or PR comments. Keep legacy endpoints routed to their existing deployed handler until cutover is verified: these new handlers intentionally reject legacy envelopes.
4. Send Whop test events and inspect delivery logs; test missing/bad signatures and retry behavior. API and storage operations must have valid credentials/permissions in the same environment. Do not make a real purchase to test this change.
5. Complete the operational items below for each app to be activated. Observe successful real delivery processing before disabling a superseded endpoint; reconcile missed events using the API. Keep purchases closed for AI Credit Mastery until its separate payment and secure-delivery requirements pass.

## Operational items still blocking full live certification

- Non-Dropify examples lack a transactional durable inbox/worker keyed by `webhook-id`. Stable Blob filenames are audit storage, **not** atomic deduplication. In particular, Waterbnb's DM creation/message side effects can repeat on retries. Do not activate that booking flow until these effects have durable per-step idempotency.
- Current routes still perform API/storage work synchronously; they do not implement a durable queue that can accept work and return within five seconds. Dropify correctly returns retryable failures, but worst-case response time can exceed the delivery budget. Add durable acceptance plus a worker before claiming the fast-ack requirement is met; returning 200 before durable acceptance would lose work.
- Some pre-existing example business handlers swallow Blob/DM failures and have read/modify/write races. Their workflow recovery needs separate implementation before activating those flows. Membership access policies beyond explicit canceled/expired states require business confirmation and environment-specific fixtures.
- Live secrets, endpoint pins, permissions, deployed URLs and real Whop test-delivery results remain unverified. No live Whop mutation, deployment or sale was performed.

## Validation

Run from `web` with repository-pinned pnpm 10.28.2:

- `pnpm --filter @whop-examples/webhooks test`
- `pnpm --filter dropify test`
- `NEXT_PUBLIC_WHOP_ENVIRONMENT=sandbox pnpm --filter dropify build`

Shared verification tests cover literal secrets, tampering, wrong keys, stale/future timestamps, missing headers, signature rotation, malformed/legacy envelopes, mismatched IDs and UTF-8 payload limits. Route tests cover all four formerly unsigned handlers, delivery-ID persistence, delayed membership activation, cancellation at period end and retryable API failures. Existing Dropify database/payment tests remain in the suite.

Reference: https://docs.whop.com/developer/guides/webhooks

Results on this branch: 18 shared verifier tests and 43 application/database tests passed (61 total). Dropify's sandbox-configured production build and type validation passed. Explicit TypeScript checks passed for Masterclass, Waterbnb, Winners Club and Titled Tuesday. The build reported existing SWC-version and multiple-lockfile warnings.
