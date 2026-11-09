# Whop gross-revenue reporting (read-only)

Private endpoint: `GET /api/admin/revenue`.

Example:

```text
/api/admin/revenue?account_id=biz_YwENtmO5iOW9bM&from=2026-11-09&to=2026-11-09&interval=hour&convert_to=usd
```

## Access and configuration

- Requires a Whop-authenticated session whose email exactly matches `WHOP_AUDIT_ADMIN_EMAIL`.
- Uses the server-only `WHOP_API_KEY`; never expose it in a `NEXT_PUBLIC_*` variable or browser code.
- Uses the configured sandbox or production API host. Preview deployments must remain sandbox-only under the existing checkout configuration.
- By default, only `NEXT_PUBLIC_WHOP_COMPANY_ID` is allowed. To report on additional businesses, set `WHOP_REVENUE_ACCOUNT_IDS` to a comma-separated allowlist of `biz_...` IDs, including the configured company if it should remain available.
- Requires Whop permission to read gross-revenue statistics for each allowed business. Grant read-only access only; no write scopes are used.
- Pins the API contract to `Api-Version-Date: 2026-07-01`, matching the supplied request.

## Query parameters

- `account_id`: optional; defaults to the configured company and must be allowlisted.
- `from`, `to`: valid `YYYY-MM-DD` dates, inclusive, maximum 32 calendar days.
- `interval`: `hour`, `day`, `week`, or `month`; defaults to `hour`.
- `convert_to`: three-letter currency code; defaults to `usd`.

The response wraps Whop's returned time-series payload without assuming undocumented inner field names. It is a read-only reporting endpoint and cannot create payments, change products, or initiate payouts.

## Verification required before production use

Test in sandbox first with an allowlisted sandbox business and a read-only key. Confirm the returned JSON shape and that the account ID, date range, interval, and currency match the request. Then configure the production allowlist and production key separately. A successful deployment alone does not prove Whop permissions or live revenue data are working.
