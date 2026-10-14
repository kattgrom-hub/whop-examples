# Whop API compatibility and V2 migration

Reviewed against the [V2 migration guide](https://docs.whop.com/developer/api/migrate-from-v2)
and [dated API versions](https://docs.whop.com/developer/api/versioning) on 15 October 2026.

## Repository findings

No direct V2 URLs or V2 checkout/license routes were found in the current source.
The installed 0.0.26–0.0.28 SDKs already default to `/api/v1`. This is not evidence
that every deployed application or live webhook has migrated.

All account SDK constructors now explicitly select `/api/v1`; Dropify retains its
sandbox/production selection. SDK constructors and the three direct Whop REST
calls send `Api-Version-Date: 2025-01-01`. This deliberately preserves the original
pre-versioning contract used by these SDKs, independently of an API key's saved
version or a `WHOP_BASE_URL` override. The SDK package versions are locked to the
versions already resolved in the workspace lockfile.

This is compatibility stabilization, not an upgrade to the latest dated API or
SDK. In particular, existing payment validation expects embedded `company` and
`plan` objects and numeric `subtotal`. Later dated versions change these fields
to IDs and money objects. Do not change the pin without migrating and testing
those consumers. Existing plans endpoints remain available during the separate
plans-to-variants migration; use variants for new integrations.

## Remaining account and deployment checks

1. Inventory deployed integrations and inspect API logs for V2 calls and
   `Deprecation`, `Sunset`, and successor `Link` headers. V2 is scheduled to stop
   working on 13 November 2026. This source audit cannot inspect external clients.
2. Inspect every live webhook's origin, payload format and version. V2-created
   webhooks continue sending V2 payloads even after request URLs change. For any
   such webhook, prepare a new Current API webhook, verify signed payloads and
   reconciliation in a non-live test, then cut over before retiring the old one.
   The request pin does not change webhook payload versions.
3. Test the explicit baseline pin against the intended sandbox account and inspect
   responses before deploying. Local mocked transport verifies headers and paths;
   it does not establish that account credentials, permissions or delivery work.
4. Upgrade to a newer SDK/date in a separate change: review all intervening
   changelog entries, migrate namespace/response changes, and test refunds,
   disputes, checkout and pagination before changing live configuration.

AI Credit Mastery's dedicated A$197 offer and launch gates remain separate.
This change creates no product, checkout, delivery resource or live purchase,
and does not enable its sales. No setup script needs to run for this change.

## Local checks

From `web`, install with the repository's pnpm version and frozen lockfile, then
run `pnpm --filter dropify test` and `pnpm --filter dropify build`.
The tests mock network transport and do not contact Whop or charge a buyer.
