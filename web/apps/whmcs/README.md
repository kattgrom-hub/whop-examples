# WHMCS Demo — Whop VerifyElement Integration

Demo app showing how Whop's embedded KYC (VerifyElement) integrates into a WHMCS-like hosting platform.

## What this demos

**Whop Feature:** `VerifyElement` — standalone identity verification (KYC) component with 3 screens:
1. Account creation (personal info, address, business type)
2. Identity verification (government ID scan via Veriff)
3. Compliance questions (RFI)

**User flow:**
```
Landing Page → "Get Started" → KYC Verification (Whop VerifyElement) → Dashboard
```

## Pages

| Route | Description |
|---|---|
| `/` | WHMCS landing page clone |
| `/get-started` | Onboarding with embedded VerifyElement |
| `/dashboard` | Post-verification dashboard |
| `/dashboard/clients` | Client management |
| `/dashboard/billing` | Billing & payment methods |
| `/dashboard/support` | Support tickets |
| `/dashboard/services` | Hosting services & integrations |

## Run locally

```bash
npm install
npm run dev -- -p 3456
```

Open http://localhost:3456

## Activate real KYC

Set these environment variables to enable the live Whop VerifyElement:

```bash
WHOP_API_KEY=your_whop_api_key
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_xxx
NEXT_PUBLIC_APP_URL=https://your-deployed-url.vercel.app
```

Without these, the app runs in demo mode with a placeholder KYC flow.

## Tech stack

- Next.js 15 / React 19
- `@whop/embedded-components-react-js` — VerifyElement, PayoutsSession, Elements
- `@whop/sdk` — server-side token generation
