# Wallet balances across the eight example apps

Each app listed in `web/apps.json` now has `/wallet` and a footer link. Masterclass,
Waterbnb and Winners Club also use the new balance element in their existing payout
pages. The existing withdrawal controls remain on their original integration.

The shared component isolates the latest balance element in a same-origin iframe,
because both the legacy payout SDK and the latest SDK use `window.WhopElements`.
The document loads Whop's documented amber CDN and mounts
`wallet -> balances -> balance`, with a one-month initial range. Tokens refresh a
minute before expiry (or every ten minutes), and frames are destroyed on unload
or token failures. The hosted SDK follows Whop's amber release channel.

## Deployment setup

- All eight apps need their own Whop OAuth app ID and client configuration,
  `AUTH_SECRET`, and an allowed callback URL of
  `https://APP_HOST/api/auth/callback/whop`.
- Whmcs and Grail Talent now have an OAuth handler; see their `.env.example` files.
- Enable `user:balance:read` for each app. Existing users must sign in again to
  grant the new scope. Expired OAuth credentials require another sign-in.
- Masterclass, Waterbnb and Winners Club use the connected company ID from their
  existing signed session when available. Their server-side `WHOP_API_KEY` must
  permit `company:balance:read` and `stats:read` on that company.
- Other users see their personal total, without a history chart, as documented by
  Whop. No platform-wide account is used as a fallback.

`/api/wallet/token` accepts no client account selector. Company tokens are minted
only for the session's connected account; personal tokens use the signed-in user's
OAuth credential. Token responses are private and uncached, and upstream errors
never return secrets. The two read-only scopes do not grant money movement.

## Verification

Run `pnpm install --frozen-lockfile` from `web`, then typecheck each changed app
with `pnpm --filter APP exec tsc --noEmit`. Test signed-out access (401), failed
credentials, personal total, a connected business chart, range changes, retry,
token refresh, and navigation away/back with configured test accounts before
production deployment. Whop-hosted content and live balances require network and
real credentials; they cannot be validated by a local typecheck.
