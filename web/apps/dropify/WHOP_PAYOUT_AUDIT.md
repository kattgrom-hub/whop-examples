# Whop payout audit (read-only)

This app exposes a private, read-only reconciliation endpoint:

- `GET /api/admin/payout-audit`
- Requires an authenticated Whop session whose email exactly matches `WHOP_AUDIT_ADMIN_EMAIL`.
- Uses the existing server-only `WHOP_API_KEY`, `NEXT_PUBLIC_WHOP_COMPANY_ID`, and `NEXT_PUBLIC_WHOP_ENVIRONMENT` configuration.
- Uses the sandbox API when the environment is `sandbox`; preview deployments are already required to use sandbox by the existing checkout configuration.
- Calls Whop's documented `GET /financial_reports?report_type=balance_summary`, `GET /financial_activity`, and `GET /payouts` endpoints, each scoped by `account_id`.
- Returns a balance-summary report, a recent financial-activity sample, and a minimal payout status summary. Bank, wallet, and payout-method details are omitted.
- Uses `Api-Version-Date: 2026-11-05-1` to pin response behavior.

## Required configuration

Set `WHOP_AUDIT_ADMIN_EMAIL` to the exact email on the Whop-authenticated admin session.

The server-side account API key must be scoped to the configured business and environment, with the relevant read permissions enabled in Whop. At minimum, enable balance/financial activity read access and `payout:withdrawal:read` for payout history. Do not enable `payout:withdrawal:create`, transfer, deposit, swap, or payout-method write permissions for this reporting integration.

The key must belong to the same Whop environment and company configured for the app. Never put it in a `NEXT_PUBLIC_*` variable or browser code.

## Safety boundary

This integration has no code path for creating or canceling payouts, withdrawals, transfers, deposits, swaps, payout destinations, or access tokens. It is a reporting endpoint only. It does not initiate a payout, change payout settings, or change a Whop balance.

The endpoint returns the first page of financial activity and payouts (50 rows each). The response includes pagination cursors for follow-up implementation; it is a diagnostic snapshot, not a full historical accounting export. Financial reports provide Whop's summarized report values. Reconcile against Whop's dashboard and official ledger records before making financial decisions.
