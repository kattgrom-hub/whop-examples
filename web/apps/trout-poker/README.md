# Trout Tournaments

Online fishing tournament hosting platform built as a Whop App. Organizers create tournaments, anglers enter via embedded checkout, and all payouts flow through admin-approved transfer requests.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Whop SDK

---

## Whop Features Used

### Connected Accounts (Companies)

Anglers and organizers are modeled as **child companies** under the platform's parent company. Created on first OAuth login via `client.companies.create()`. The `metadata.role` field distinguishes anglers from organizers.

- `companies.create()` — Register new angler/organizer accounts
- `companies.list({ parent_company_id })` — List all child accounts
- `companies.retrieve(id)` — Get account details
- `companies.update(id, { metadata })` — Update role or plan tier

### Products (Tournaments)

Each tournament is a **Product** on the platform company. Tournament data (title, date, entry fee, max anglers, status, results) is stored as JSON in the product's `description` field.

- `products.create()` — Create a tournament
- `products.list({ company_id })` — List tournaments
- `products.retrieve(id)` — Get tournament details
- `products.update(id, { ... })` — Update status, record results

### Plans (Entry Fees)

Each tournament gets a **one-time Plan** for its entry fee price. The plan's `company_id` is set to the platform (not the organizer), so all funds land in the platform account.

- `plans.create()` — Create the entry fee plan for a tournament

### Checkout Configurations (Tournament Entry)

Embedded checkout handles angler registration. A checkout configuration is created server-side, then rendered client-side via `<WhopCheckoutEmbed>` from `@whop/checkout/react`.

- `checkoutConfigurations.create()` — Generate a checkout session (validates capacity + tournament status)

### Memberships (Angler Registration)

A membership is created when an angler completes checkout. Membership count = registered angler count.

- `memberships.list({ product_ids })` — Count anglers in a tournament, check registration

### Transfers (Payouts)

When an admin approves a payout request, the platform transfers funds to the recipient's connected account. Uses `idempotence_key` set to the request ID to prevent double-transfers.

- `transfers.create()` — Execute platform-to-recipient transfer
- `transfers.list()` — Audit log of all transfers

### Ledger Accounts (Balance)

The admin dashboard shows the platform's available balance before approving payouts.

- `ledgerAccounts.retrieve(id)` — Get platform balance

### Notifications (Payout Alerts)

When a user submits a payout request, a notification is fired to the Whop bell icon. The notification deep-links to the admin request detail page via `rest_path`.

- `notifications.create()` — Push notification with deep link to `/requests/[id]`

### Access Tokens (Embedded Payouts)

The withdrawal page uses Whop's embedded payout components (`@whop/embedded-components-react-js`) to show balance, initiate withdrawals, and view history. An access token scoped to the user's connected account is required.

- `accessTokens.create({ company_id })` — Generate token for embedded payout UI

### OAuth (Identity)

OAuth 2.0 with PKCE handles authentication. Scopes: `openid`, `profile`, `email`. Tokens and user info are stored in localStorage via a React context provider.

### Whop App Views

The app registers three views in the Whop Developer Dashboard:

| View | Path | Purpose |
|------|------|---------|
| Public site | `base_url` | Landing page, browse tournaments, sign up |
| Customer hub | `experience_path` | Dashboard embedded in Whop hub |
| Admin dashboard | `dashboard_path` | Approve payouts, embedded in Whop dashboard |

---

## User Flows

### Angler Signs Up

1. Visit landing page, click "Sign In"
2. Redirected to Whop OAuth (PKCE flow)
3. On callback, connected account auto-created with `role: "angler"`
4. Redirected to `/tournaments`

### Angler Enters a Tournament

1. Browse `/tournaments`, click a tournament card
2. View details: name, entry fee, prize pool, date/time, angler count, capacity
3. Click "Enter Tournament" — embedded checkout modal opens
4. Server validates tournament is `upcoming` and has capacity
5. Angler completes payment via `<WhopCheckoutEmbed>`
6. All funds land in the platform account (not the organizer)
7. Membership created = angler registered
8. Redirected to success page

### Angler Requests Payout

1. Visit `/dashboard/payouts`, see claimable amounts
2. Click "Request Payout" for a specific tournament result
3. Request stored in dedicated payout requests product
4. Whop notification fires to admin's bell icon
5. Request status: `pending`

### Angler Withdraws to Bank

1. Visit `/dashboard/withdrawals`
2. Embedded payout components show balance, withdraw button, and history
3. Withdraw funds from connected account to bank

### Organizer Signs Up

1. Visit `/become-organizer`
2. If not logged in, complete OAuth flow first
3. Connected account metadata updated: `role: "organizer"`
4. Redirected to `/dashboard/tournaments`

### Organizer Creates a Tournament

1. Visit `/dashboard/tournaments`, click "Create Tournament"
2. Fill form: name, description, date, time, entry fee, max anglers
3. Server creates Product on platform + one-time Plan for entry fee
4. Tournament appears in public browse listing

### Organizer Manages Tournaments

1. View tournaments at `/dashboard/tournaments`
2. Status transitions: `upcoming` → `in_progress` → `completed`
3. Record results (placements and prize amounts)
4. Cancel tournaments (soft delete)

### Admin Approves Payout

1. Notification appears in Whop dashboard bell
2. Click notification → opens `/admin/requests/[id]` inside Whop
3. View requester info, amount, tournament, platform balance
4. Click "Approve" → transfer executed from platform to recipient
5. Recipient can now withdraw from their connected account

---

## Common Pitfalls

These are implementation gotchas discovered while building this app.

### 1. Port conflicts cause silent 404s

If another app is already running on your configured port, Next.js silently increments to the next port. But your OAuth redirect URI and `NEXT_PUBLIC_APP_URL` still point to the original port, so every callback and API call 404s. Always verify the actual running port matches your env vars.

### 2. OAuth redirect URI must be registered

The OAuth code can be perfect, but if the redirect URI (`http://localhost:3003/auth/callback`) isn't registered in the Whop Developer Dashboard, the flow silently fails. This is a config step, not a code fix.

### 3. Connected accounts must be eagerly created

Pages that call `GET /api/connected-account` will spin forever with "Setting up your account..." if the account doesn't exist yet. The fix is to auto-create the connected account on first access (POST fallback) rather than assuming it already exists. Every page that needs the account should handle the 404 case.

### 4. Company metadata is not updatable after creation

The `become-organizer` flow originally tried to update the connected account's `metadata.role` via the SDK. This fails in multiple ways:
- `CompanyUpdateParams` doesn't include `metadata` in its types
- Casting around the types and calling the raw API returns **400: metadata is not updatable after creation**
- **Workaround:** Store roles in a local JSON file (`data/users.json`) instead of relying on company metadata

### 5. Membership errors can silently skip tournaments

The tournament listing calls `memberships.list({ product_ids })` to get angler counts. If this throws (e.g., invalid product, permissions), and it's inside a `try/catch` that wraps the entire product processing, every tournament silently gets `continue`'d past — the list appears empty. **Fix:** Isolate the membership count in its own `try/catch` so a failure only zeroes out the count, not the entire tournament.

### 6. Checkout requires exact parameter shape

Creating a checkout configuration went through three broken attempts:
- Inline `plan` with `company_id` inside → failed
- `plan_id` approach → "company_id required"
- `plan_id` + top-level `company_id` via type cast → SDK stripped it

The working pattern uses `mode: "payment"` with an inline `plan` object (matching the session-pro example app's exact shape). The SDK types don't surface all required fields — when in doubt, match a working example exactly.

### The common thread

The Whop SDK types don't always match the API's actual requirements. Metadata isn't updatable after creation (but nothing warns you). `company_id` is required for checkout but not in the types. `memberships.list` can fail silently. Most bugs came from assuming the TypeScript types told the full story. When something doesn't work, check the raw API behavior, not just the types.
