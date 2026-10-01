# Apple Pay and Google Pay for Dropify

The app's vercel.json proxies the exact Apple Pay domain association path to Whop's official verification file. No merchant credentials or API keys belong in this route. The existing Next.js framework and build commands are preserved.

## Activate after an approved deployment

1. Use the actual HTTPS hostname serving the embedded checkout. Do not assume a store domain or a preview hostname is the production checkout domain.
2. Fetch https://<checkout-hostname>/.well-known/apple-developer-merchantid-domain-association without authentication. Confirm a successful response containing the unchanged Whop verification file, rather than an HTML page, sign-in prompt, or 404. Deployment protection, middleware and hosting rules must allow this path.
3. In Whop checkout settings, open Apple Pay and Google Pay for embedded checkout > Configure > Payment domains > Add domain > Self-hosted verification. Enter the checkout hostname.
4. Confirm the domain is Verified. If it needs verification, fix file access and select Verify domain. Register other hostnames separately when used for embedded checkout.
5. Open the embedded checkout in Safari on a real Apple device with Apple Pay configured. Confirm the wallet is available without authorizing a purchase. Wallet visibility depends on the buyer's device and wallet availability.

A verified payment method domain enables both Apple Pay and Google Pay for Whop Elements on that domain. Whop-hosted checkout pages are already approved and do not need this self-hosted setup.

This change prepares domain verification; it does not register a domain, activate an account, deploy the app, or prove a completed payment. Fulfilment must continue to depend on verified server-side Whop webhooks.

Official guide: https://docs.whop.com/payments/apple-pay
