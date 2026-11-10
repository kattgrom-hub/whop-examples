# Whop gross-revenue reporting (read-only)

Private endpoint: `GET /api/admin/revenue`.

## One business

```text
/api/admin/revenue?account_id=biz_nqnFbpT8ioDrWI&from=2025-11-12&to=2026-11-11&interval=month&convert_to=usd
```

## All configured businesses

```text
/api/admin/revenue?account_id=all&from=2025-11-12&to=2026-11-11&interval=month&convert_to=usd
```

The `all` mode queries every ID in `WHOP_REVENUE_ACCOUNT_IDS` (up to 50) and returns one result per business. A permission or API failure for one business is reported independently and does not hide successful results for the others.

## Access and configuration

- Requires a Whop-authenticated session whose email exactly matches `WHOP_AUDIT_ADMIN_EMAIL`.
- Uses the server-only `WHOP_API_KEY`; never expose it in a `NEXT_PUBLIC_*` variable or browser code.
- Uses the configured sandbox or production API host. Preview deployments must remain sandbox-only under the existing checkout configuration.
- Set `WHOP_REVENUE_ACCOUNT_IDS` to a comma-separated allowlist of exact `biz_...` IDs for every business to include. Do not add IDs until confirmed in the Whop dashboard.
- The configured company ID is the fallback when no allowlist is set; in that case all mode includes only that company.
- The API key must have read-only gross-revenue stats access to every listed business.
- Pins the API contract to `Api-Version-Date: 2026-07-01`.

## Query parameters

- `account_id`: one allowlisted business ID, or `all` to query the full allowlist.
- `from`, `to`: valid `YYYY-MM-DD` dates, inclusive, maximum 366 calendar days.
- `interval`: `hour`, `day`, `week`, or `month`; defaults to `hour`.
- `convert_to`: three-letter currency code; defaults to `usd`.

The response preserves Whop's returned time-series payload without assuming undocumented inner field names. It is read-only: no payments, products, payouts, or Whop account settings are changed.

## Verification required before production use

Test in sandbox first with an allowlisted sandbox business and a read-only key. Confirm the returned JSON shape and that the account ID, date range, interval, and currency match the request. Then configure production secrets and the production allowlist separately. A successful deployment alone does not prove Whop permissions or live revenue data are working.
