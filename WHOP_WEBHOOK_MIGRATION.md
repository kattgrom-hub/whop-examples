# Whop v1 webhook migration

Code migration prepared 15 October 2026. Storefront cutover and live Whop delivery remain unverified. A dedicated webhook-only ingress is included for public delivery without exposing the storefront preview.

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
- Existing storefront/example webhook routes still perform API/storage work synchronously. Use the dedicated ingress for Dropify cutover. It publishes durably before returning 202, gives publishing a three-second deadline, and uses a private Vercel queue consumer to reconcile. It does not migrate the unrelated Waterbnb/Masterclass example workflows to the queue.
- Some pre-existing example business handlers swallow Blob/DM failures and have read/modify/write races. Their workflow recovery needs separate implementation before activating those flows. Membership access policies beyond explicit canceled/expired states require business confirmation and environment-specific fixtures.
- Live Whop signing/API secrets, endpoint pins, permissions and real Whop test-delivery results remain unverified. Account-level Whop tools are unavailable. The storefront Vercel project inventory has no WHOP_WEBHOOK_SECRET, WHOP_API_KEY or DROPIFY_SUPABASE_SERVICE_ROLE_KEY configured. Payment reconciliation must remain disabled until valid credentials and the existing order database are verified. No live Whop endpoint mutation or sale was performed.

## Validation

Run from `web` with repository-pinned pnpm 10.28.2:

- `pnpm --filter @whop-examples/webhooks test`
- `pnpm --filter dropify test`
- `NEXT_PUBLIC_WHOP_ENVIRONMENT=sandbox pnpm --filter dropify build`

Shared verification tests cover literal secrets, tampering, wrong keys, stale/future timestamps, missing headers, signature rotation, malformed/legacy envelopes, mismatched IDs and UTF-8 payload limits. Route tests cover all four formerly unsigned handlers, delivery-ID persistence, delayed membership activation, cancellation at period end and retryable API failures. Existing Dropify database/payment tests remain in the suite.

Reference: https://docs.whop.com/developer/guides/webhooks

Results on this branch: 18 shared verifier tests and 43 application/database tests passed (61 total). Dropify's sandbox-configured production build and type validation passed. Explicit TypeScript checks passed for Masterclass, Waterbnb, Winners Club and Titled Tuesday. The build reported existing SWC-version and multiple-lockfile warnings.


## Dedicated webhook ingress

`web/apps/whop-webhooks` is a separate API-only application. Deploy it as its own Vercel project, with public Production delivery and protected Previews. Keep the existing `whop-examples` storefront protection unchanged. Its only routes are service/health information, the signed webhook ingress and the private queue-trigger consumer. Automatic Git deployments are disabled for this service; explicitly release the reviewed commit.

- Public path: `/api/webhooks/whop`; use the new project's stable production domain, never the protected storefront preview.
- The ingress uses the same signature verifier and publishes to `whop-reconcile`. Success returns 202 only after the broker accepts the message. Broker failure/timeout returns 503 so Whop retries.
- `idempotencyKey` is the verified message ID, with seven-day retention and the broker's 24-hour deduplication window. Dropify's existing transactional replay protection remains the authority for replays outside that window. Broker idempotency alone does not provide permanent exactly-once delivery.
- The queue stores only payment/order references. Customer email, address and other raw payload details are omitted. The worker fetches the current payment state before recording anything.
- A reconciliation error response causes the worker to throw, preserving retries with bounded exponential delays. Queue-trigger security is provided by Vercel, not by an exposed business handler. Reconciliation runs up to 60 seconds per attempt. Messages expire after seven days; monitor failing deliveries and reconcile from Whop's API before expiry.
- Both ingress and consumer require `WHOP_WEBHOOK_RECONCILIATION_ENABLED=true` plus the account/database prerequisites for payment events. Default deployment fails closed. Installing only a flag is insufficient.
- Runtime configuration: WHOP_WEBHOOK_SECRET, WHOP_API_KEY, NEXT_PUBLIC_WHOP_COMPANY_ID, NEXT_PUBLIC_WHOP_ENVIRONMENT, DROPIFY_SUPABASE_URL, DROPIFY_SUPABASE_SERVICE_ROLE_KEY, WHOP_WEBHOOK_RECONCILIATION_ENABLED. The signing key must be the one Whop issued for this endpoint. Set secrets directly in Vercel. Do not copy production credentials into previews.
- The existing Dropify REST client is pinned to `Api-Version-Date: 2025-01-01` so moving reconciliation into a new project does not silently adopt a new payment schema. Coordinate the equivalent REST compatibility work in PR #9.

Additional ingress tests cover delayed durable acceptance, stable idempotency keys, queue errors/timeouts, missing credentials despite an enable flag, reference-only payloads, and worker failures becoming broker retries. Build and test this app with `pnpm --filter whop-webhooks test` and `pnpm --filter whop-webhooks build`.
