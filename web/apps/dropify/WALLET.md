# Personal wallet (disabled pending validation)

`WHOP_WALLET_ENABLED` defaults to disabled. The wallet page and token endpoint do not expose actions until explicitly enabled. No automatic deployment is enabled for this PR branch.

OAuth credentials remain in the encrypted NextAuth cookie; Dropify's browser session omits the OAuth access token. The token route decrypts the authenticated cookie server-side, validates user ID, OAuth expiry, recorded grant and environment, and exchanges only the viewer credential. Embedded tokens explicitly request only the configured approved scope subset and are never cached.

## Merge with the wallet disabled

Before merging this scaffolding, confirm production and every preview override explicitly use `WHOP_WALLET_ENABLED=false`; leave `WHOP_WALLET_OAUTH_SCOPES` empty until permissions are approved. Disabled wallets do not request additional OAuth permissions, even if old scope configuration remains. The browser session still omits the OAuth access token.

On the final commit, verify `/wallet` renders its unavailable state and `/api/wallet/token` returns HTTP 503 with `Cache-Control: no-store` without contacting Whop. Check ordinary sign-in and existing checkout loading because authentication and the Elements loader are shared. Require passing tests, typecheck and build plus review of the final commit.

The deployment restriction applies to this PR branch, not `main`. Merging may trigger a production deployment; verify the disabled configuration before merging. Merge readiness is separate from wallet activation readiness. Keep the authorized Whop validation below open, and enable wallet actions only as a separately reviewed change.

## Configuration and platform blocker

Set an explicit `NEXT_PUBLIC_WHOP_ENVIRONMENT`. Preview must be sandbox. Configure the existing OAuth app ID, client secret and AUTH_SECRET. Set comma-separated `WHOP_WALLET_OAUTH_SCOPES` to exact Whop-approved permissions; no scope names are guessed by this project. Sign out and sign in again after changing permissions. Missing expiry or grants fails closed and requires reauthentication.

The existing OIDC provider uses production `https://api.whop.com`; its credentials are recorded as production and cannot be sent to sandbox. Do not guess a sandbox OAuth issuer or reuse production credentials there. Whop must confirm supported sandbox OAuth configuration before that path is implemented.

Whop's current sandbox guide explicitly says Elements sandbox is not available yet; payouts are also unavailable. Keep wallet disabled until Whop confirms support and an authorized environment check passes. Do not switch preview to production as a workaround.

## Required authorized validation

On the final commit, record approved scopes and actual consent grant, authenticated token exchange, correct personal account, each overlay opening/canceling, renewal before expiry, expired/revoked credential recovery, missing permissions, CDN failure/retry, navigation cleanup, and existing checkout loading. Stop before all monetary confirmations and company creation. No real monetary action has been performed.

Accept opens company creation for personal wallets. Business balances need a separate authorized mapping. Action-request callbacks report overlay opening, never completed payments.

## Local validation

From `web`: `pnpm --filter dropify test`, `pnpm --filter dropify typecheck`, and `NEXT_PUBLIC_WHOP_ENVIRONMENT=sandbox pnpm --filter dropify build`. Tests mock credentials and Whop responses; they cannot prove live authorization or overlay support.

References:
- https://docs.whop.com/developer/guides/sandbox
- https://docs.whop.com/api-reference/access-tokens/create-access-token
- https://docs.whop.com/elements/latest/wallet/overview
