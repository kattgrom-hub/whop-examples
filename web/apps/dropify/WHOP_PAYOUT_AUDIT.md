# Whop payout audit (read-only)

This app exposes a private, read-only reconciliation endpoint:

- `GET /api/admin/payout-audit`
- Requires an authenticated Whop session whose email exactly matches `WHOP_AUDIT_ADMIN_EMAIL`.
- Uses the existing server-only `WHOP_API_KEY`, `NEXT_PUBLIC_WHOP_COMPANY_ID`, and `NEXT_PUBLIC_WHOP_ENVIRONMENT` configuration.
- Uses the sandbox API when the environment is `sandbox`; preview deployments are already required to use sandbox by the existing checkout configuration.
- Reads the company's ledger account and payout list only.
- Returns currency-by-currency available, pending, and reserve balances plus a restricted payout summary (ID, status, amount, currency, timestamps).
- Never returns payout destination details or raw provider error bodies.

## Required configuration

Set `WHOP_AUDIT_ADMIN_EMAIL` to the exact email on the Whop-authenticated admin session.

The company API key must have these read permissions:

- `company:balance:read`
- `payout:account:read`
- `payout:withdrawal:read`

The key must belong to the same Whop environment and company configured for the app. Do not place it in a `NEXT_PUBLIC_*` variable or browser code.

## Safety boundary

This integration has no code path for creating payouts, withdrawals, transfers, deposits, swaps, payout destinations, or access tokens. It is a reporting endpoint only. It does not initiate a payout, change payout settings, or change a Whop balance.

The endpoint currently returns the first page returned by Whop (up to 100 rows exposed by this application). It is a diagnostic snapshot, not a full historical accounting export. Reconcile against Whop's dashboard and official ledger records before making financial decisions.
