# Central Whop Business Dashboard

## Decision and safety boundaries

The dashboard is a central operator view over independently owned Whop businesses. It does not merge businesses, move funds, change ownership, alter payout destinations, or publish products. Each business retains its own Whop company ID, app credentials, products, plans, checkout URLs, webhook configuration, and payout settings.

All initial integrations are read-only. Any future write action (for example, changing a plan, checkout, payout setting, or product availability) must be separately permission-gated and require explicit operator confirmation.

## Current verified baseline

The existing `WALLET_DEPLOYMENTS.json` currently describes eight apps, all mapped to the same Whop company ID, `biz_Ngf1SlU09oO3TE` (Kattassie). These are app deployments, not proof of eight separate Whop businesses:

- dropify
- masterclass
- winners-club
- waterbnb
- dischord
- sockx
- whmcs
- grail-talent

The manifest marks their deployments production-ready, but each authenticated wallet balance test remains pending user sign-in. The dashboard must preserve that distinction and must not display authenticated balance integration as verified until a real signed-in test passes.

## Registry model

Create one registry record per independently verified Whop company. Do not infer or manufacture company IDs from app names or historical notes.

Recommended fields:

| Field | Purpose |
| --- | --- |
| `businessId` | Exact Whop company ID (`biz_...`), unique key |
| `displayName` | Operator-friendly business name |
| `connectionStatus` | `unconnected`, `connected`, `reauth_required`, or `error` |
| `credentialRef` | Name/reference of a server-side secret; never the secret value |
| `appIds` | Whop app IDs explicitly associated with this business |
| `environment` | Sandbox/production status per integration |
| `webhookStatus` | Last verified delivery and signature-validation status |
| `reconciliationStatus` | Last reconciliation time and mismatch count |
| `checkoutStatus` | Read-only summary of hosted checkout/plan availability |
| `payoutStatus` | Read-only status only; no payout mutations |
| `lastVerifiedAt` | Timestamp and evidence for the latest successful check |

A business may have multiple apps, and an app must not be assumed to represent a separate business. Model the relationship as business-to-many-apps.

## Dashboard sections

1. **Overview** — number of businesses connected, businesses needing attention, latest sync time, and clearly labelled stale/unknown data.
2. **Businesses** — one row/card per verified Whop company, with its own connection and health status.
3. **Apps** — app-to-business mapping, OAuth callback, configured scopes, and deployment/test status.
4. **Products and plans** — read-only catalogue and availability; never auto-enable paused/out-of-stock offers.
5. **Checkouts** — hosted checkout/plan links, currency, amount, and availability checks; do not expose secret keys.
6. **Payments and reconciliation** — payment event totals, webhook processing state, idempotency/reconciliation exceptions.
7. **Payouts** — display current status and missing setup items only; do not initiate or edit payouts.
8. **Sandbox/production** — separate credentials, endpoints, webhook secrets, and test evidence. Never mix sandbox events with production reporting.

## Security requirements

- Keep Whop API keys and webhook secrets server-side in the deployment secret store.
- Store only secret references/connection metadata in the registry.
- Scope credentials to the specific company and minimum required read permissions.
- Resolve the company identity from a verified server-side session or explicit server-side registry mapping; never accept a client-supplied company ID as authorization.
- Enforce tenant isolation on every query and API route.
- Verify webhook signatures against the correct business/environment secret before processing.
- Make webhook processing idempotent and retain event IDs, processing outcomes, and timestamps without logging secrets or sensitive payment data.
- Use private/no-store responses for account-specific data.
- Keep sandbox and production databases, credentials, webhook endpoints, and reporting clearly separated.

## Build sequence

### Phase 1 — inventory and registry
- Enumerate the actual Whop businesses accessible to the connected operator account.
- Verify each exact company ID and display name against Whop, then add one registry record per company.
- Map existing apps to the correct business. Do not assume all apps belong to one business beyond the currently documented manifest.
- Identify missing per-business OAuth/API credentials without copying secrets into Git.

### Phase 2 — read-only connections
- Add a server-side connection adapter that selects credentials by registry record.
- Add read-only business, product/plan, checkout, payment, and payout-status retrieval where the Whop API supports it.
- Show unsupported/unavailable fields as unknown, not as zero or healthy.

### Phase 3 — events and reconciliation
- Register/verify the correct webhook endpoint and signing secret for each business/environment.
- Persist event IDs with unique constraints and idempotent processing.
- Reconcile webhook events against payment records and flag mismatches for review.

### Phase 4 — dashboard and validation
- Build the central UI with per-business filtering and clear sandbox/production labels.
- Test authorization boundaries, cross-business isolation, stale data, expired credentials, webhook replay, and upstream failures.
- Require a successful signed-in test for each business before marking its connection verified.

## Acceptance criteria

- Every displayed business has a verified Whop company ID and an independent registry record.
- Apps are linked to businesses explicitly; no cross-business fallback credential is allowed.
- No ownership, payout, product availability, pricing, or checkout setting is changed by the initial dashboard.
- Sandbox and production data cannot be mixed.
- Account-specific endpoints enforce authorization and return private/no-store responses.
- Webhook events are signature-verified, idempotent, and auditable.
- Every status includes evidence and a last-checked timestamp; pending tests remain visibly pending.
