# Whop wallet actions

`/wallet` embeds Whop Elements' Deposit, Accept, Send, Convert and Withdraw
controls for the signed-in user's personal wallet. The Wallet link is visible
on desktop and mobile. Sign-in returns directly to this page.

## Authentication and setup

- Configure the existing Whop OAuth app ID, client secret and NextAuth secret.
- Set `WHOP_WALLET_OAUTH_SCOPES` to a comma-separated list of permissions that
  Whop has approved for this app's intended wallet features. This is a server
  variable; do not put API keys or tokens in public variables.
- Re-sign in after changing scopes. Identity-only login may not authorize the
  wallet overlays. Whop must approve the applicable permissions before the
  integration can be verified against a real account.
- `/api/wallet/token` exchanges the viewer's OAuth credential for a 15-minute
  embedded token. Whop derives the user from OAuth. The endpoint accepts no
  account selection and never uses the merchant API key. The embedded token
  inherits only the viewer-authorized OAuth permissions.
- The client updates the token one minute before expiration. If the underlying
  OAuth credential expires, the wallet closes and offers sign-in again.
- For a CSP, permit `https://cdn.whop.com` in `script-src` and `frame-src`.
- The wallet uses `NEXT_PUBLIC_WHOP_ENVIRONMENT`, including the corresponding
  server API host. Sandbox access depends on availability for your Whop account;
  do not switch to production merely to make a test succeed.

This page is a **personal wallet**, not a business balance or merchant payout
dashboard. The personal Accept button opens Whop company creation, as specified
by Whop. A business wallet needs a separately authorized business-account mapping.
Requested-action events report that an overlay opened, never that money moved.
Identity-verification requests show an instruction and an explicit link to Whop.

## Validation

From this app's directory:

```sh
node --test tests/*.test.mjs
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/next build
```

Token tests mock authentication and Whop responses. They never mint live tokens
or initiate payments, deposits, transfers, conversions or withdrawals.
After Whop permissions and OAuth configuration are available, sign in and verify
loading, token renewal and each overlay in an authorized sandbox. Stop before
confirming any monetary action. No live transaction validation was performed.

## References

- https://docs.whop.com/elements/latest/wallet/actions
- https://docs.whop.com/elements/latest/wallet/overview
- https://docs.whop.com/elements/latest/getting-started
- https://docs.whop.com/api-reference/access-tokens/create-access-token

The Swift Package dependency is for native iOS apps and is not used by this
Next.js implementation.
