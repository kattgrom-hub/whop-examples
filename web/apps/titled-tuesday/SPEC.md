# Titled Tuesday - Online Chess Tournament Hosting Platform

## Overview

Titled Tuesday is a chess tournament hosting platform built as a **Whop App**. The platform (parent company) holds all funds centrally. Organizers create tournaments, players enter via embedded checkout, and all payouts are handled through transfer requests that surface as Whop notifications and are resolved by admins inside the Whop dashboard.

**Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Whop SDK, Vercel Blob

**Key principle:** All money flows through the platform parent account. No funds sit in child accounts unless explicitly transferred there via an approved request.

---

## Whop App Structure

Titled Tuesday is registered as a Whop App with three views:

| View | App Path | Renders Inside | Purpose |
|---|---|---|---|
| Public site | `base_url` | Standalone (titled-tuesday.com) | Landing, browse tournaments, sign up |
| Customer hub | `experience_path` | Whop hub (embedded) | Tournament entry, history, payout requests |
| Admin dashboard | `dashboard_path` | Whop dashboard (embedded) | Approve payout requests, manage transfers |

The `dashboard_path` is where admins resolve payout requests after clicking a Whop notification. The admin never leaves Whop.

---

## Domain Model

### Vercel Blob (app data)

Each record is stored as a JSON file in Vercel Blob at a deterministic path:

| Blob prefix | Purpose | Key fields |
|---|---|---|
| `users/{id}.json` | User profiles, roles | `id` (Whop user ID), `role`, `whop_company_id` |
| `tournaments/{id}.json` | Tournament metadata | `id` (= Whop product ID), `whop_plan_id`, `title`, `date`, `entry_fee`, `prize_structure`, `status`, `results` |
| `payout-requests/{id}.json` | Payout request lifecycle | `id` (req_xxx), `requester_id`, `amount`, `status`, `transfer_id`, `denial_reason` |

No schema setup required — Blob is schemaless. Query helpers in `src/lib/db.ts`.

### Whop primitives (financial/payment layer)

| Domain Concept | Whop Primitive | Notes |
|---|---|---|
| Platform | Parent Company (`NEXT_PUBLIC_WHOP_COMPANY_ID`) | Holds all funds centrally |
| Organizer | Child Company (connected account) | Receives transfers when requests are approved |
| Player | Child Company (connected account) | Receives transfers when requests are approved |
| Tournament (checkout) | Product (on platform company) | Shell product for Whop checkout/memberships. Metadata lives in Postgres. |
| Tournament Entry (entry fee) | Plan (`one_time`) on the product | Created at checkout. `company_id = platform`. All funds go to platform. |
| Player Registration | Membership | Created when player completes checkout |
| Payout Execution | Transfer (`client.transfers.create()`) | Platform -> recipient's connected account |
| Request Notification | Notification (`client.notifications.create()`) | Surfaces in Whop bell, deep links to admin dashboard |
| User Identity | Whop OAuth (OIDC) | `sub` claim = user ID |

---

## Money Flow

```
Player pays $50 entry fee
  └─> ALL $50 lands in Platform parent account (biz_platform)
      (plan.company_id = platform, no application_fee_amount splitting)

After tournament completes:
  Organizer submits payout request for their cut ($46)
    └─> Notification fires to Whop
    └─> Admin clicks notification -> opens admin dashboard inside Whop
    └─> Admin approves
    └─> client.transfers.create({ origin: biz_platform, destination: biz_organizer, amount: 4600 })

  Winner submits payout request for prize ($1,600)
    └─> Same notification -> approval -> transfer flow
    └─> client.transfers.create({ origin: biz_platform, destination: biz_player, amount: 160000 })

Recipient withdraws from their connected account to bank
  └─> Embedded payout components (BalanceElement, WithdrawButtonElement)
```

Platform retains its fee (the difference between total entry fees and total approved payouts).

---

## User Roles

| Role | How Determined | Capabilities |
|---|---|---|
| Visitor | Not authenticated | Browse tournaments, view landing page |
| Player | Authenticated + connected account (`role: "player"`) | Enter tournaments, view history, submit payout requests, withdraw from balance |
| Organizer | Authenticated + connected account (`role: "organizer"`) | All player capabilities + create/manage tournaments, submit payout requests for revenue |
| Admin | Platform team member (in Whop dashboard) | Approve/deny payout requests, execute transfers, view all balances |

### Role Resolution

- **Player:** Connected account created on first sign-in with `metadata.role = "player"`.
- **Organizer:** Existing player account upgraded via `metadata.role = "organizer"` during "Become an Organizer" flow.
- **Admin:** Not a titled-tuesday role -- this is a Whop dashboard team member who sees notifications and uses the embedded admin view.

---

## Supported User Flows

### Flow 1: Organizer Sign-Up
1. Visitor lands on `/` (landing page)
2. Clicks "Host Tournaments" CTA -> navigates to `/become-organizer`
3. Clicks "Continue with Whop" -> OAuth flow (`openid profile email`)
4. On callback, connected account auto-created with `role: "player"`
5. App upgrades account metadata to `role: "organizer"`
6. Redirected to `/dashboard`

### Flow 2: Regular User Sign-Up
1. Visitor lands on `/` or `/tournaments`
2. Clicks "Sign In" or attempts to enter a tournament
3. OAuth flow -> callback
4. Connected account auto-created with `role: "player"`
5. Redirected to `/tournaments`

### Flow 3: Player Becomes Organizer
1. Authenticated player visits `/become-organizer`
2. Already logged in, skips OAuth
3. App updates connected account metadata: `role: "player"` -> `role: "organizer"`
4. Redirected to `/dashboard`

### Flow 4: Player Enters a Tournament
1. Player browses `/tournaments`, clicks a tournament
2. Tournament detail page shows: name, entry fee, prize pool, date/time, player count, max capacity
3. Player clicks "Enter Tournament" -> embedded checkout modal
4. `POST /api/checkout` enforces capacity, creates checkout config with `company_id = platform`
5. Player completes payment via `<WhopCheckoutEmbed>`
6. Membership created = player registered. All funds land in platform account.
7. Webhook `payment.succeeded` fires

### Flow 5: Organizer Creates a Tournament
1. Organizer visits `/dashboard/tournaments`
2. Clicks "Create Tournament"
3. Fills form: name, description, date, time, entry fee, max players, prize structure (% split)
4. `POST /api/organizer/tournaments` creates a Product on the **platform company** with `metadata.organizer_id`
5. Tournament appears in browse listing

### Flow 6: Organizer Manages Tournaments
1. Organizer views their tournaments at `/dashboard/tournaments`
2. Can edit (PATCH) or cancel (soft-delete via visibility: "hidden")
3. Can view registered players (memberships list)
4. Can transition status: upcoming -> in_progress -> completed
5. Can record results (placements from registered players)

### Flow 7: Submitting a Payout Request
1. After tournament completes, organizer or winning player visits `/dashboard/payouts`
2. Sees list of claimable amounts (organizer: revenue share; player: prize winnings)
3. Clicks "Request Payout" for a specific amount
4. `POST /api/payout-requests` creates the request and fires a notification:
   ```ts
   await client.notifications.create({
     company_id: PLATFORM_COMPANY_ID,
     title: "Payout Request: $1,600",
     content: "PlayerX requests prize from Weekly Blitz Arena (1st place)",
     rest_path: "/requests/req_123",
   });
   ```
5. Request status = `pending`

### Flow 8: Admin Approves Payout (Inside Whop)
1. Admin sees notification in Whop bell
2. Clicks notification -> opens titled-tuesday admin view at `dashboard_path + /requests/req_123` inside Whop
3. Admin sees: requester, amount, tournament, reason, platform balance
4. Admin clicks "Approve"
5. `POST /api/admin/payout-requests/approve` executes:
   ```ts
   await client.transfers.create({
     amount: requestAmount,
     currency: "usd",
     origin_id: PLATFORM_COMPANY_ID,
     destination_id: requesterCompanyId,
     metadata: { request_id, tournament_id, type },
     idempotence_key: requestId,
   });
   ```
6. Request status updated to `approved`, transfer ID recorded
7. Funds land in requester's connected account balance

### Flow 9: Withdrawing to Bank
1. User (player or organizer) visits `/dashboard/withdrawals`
2. Sees embedded payout components for their connected account
3. `<BalanceElement>` shows available balance (from approved transfers)
4. `<WithdrawButtonElement>` initiates withdrawal to bank
5. `<WithdrawalsElement>` shows withdrawal history

---

## Pages & Routes

### Public Pages (standalone site)
| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero, how it works, CTAs for "Enter" and "Host" |
| `/tournaments` | Browse | Server-rendered list of upcoming tournaments |
| `/tournaments/[id]` | Tournament Detail | Full info, player count, enter button with embedded checkout |
| `/become-organizer` | Onboarding | Organizer sign-up flow |
| `/auth/login` | Login | "Continue with Whop" + dev bypass |
| `/auth/callback` | Callback | OAuth callback handler |

### Authenticated Pages (Player + Organizer)
| Route | Page | Description |
|---|---|---|
| `/dashboard` | Overview | Upcoming tournaments, past results, balance summary |
| `/dashboard/history` | Tournament History | Full history with results and placements |
| `/dashboard/payouts` | Payout Requests | View claimable amounts, submit payout requests, request status |
| `/dashboard/withdrawals` | Withdrawals | Embedded payout components to withdraw balance to bank |

### Organizer-Only Pages
| Route | Page | Description |
|---|---|---|
| `/dashboard/tournaments` | Manage Tournaments | CRUD, view registrations, record results, transition status |
### Admin Pages (embedded inside Whop dashboard)
| Route | Page | Description |
|---|---|---|
| `/admin` | Request Queue | List of all pending payout requests |
| `/admin/requests/[id]` | Request Detail | Review and approve/deny a specific payout request |
| `/admin/transfers` | Transfer History | Audit log of all executed transfers |

---

## API Routes

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/token` | Exchange OAuth code for tokens (PKCE) |

### Connected Accounts
| Method | Route | Description |
|---|---|---|
| GET/POST | `/api/connected-account` | Get or create connected account. POST creates with `role: "player"`. |
| PATCH | `/api/connected-account` | Update metadata (e.g., upgrade to organizer) |

### Tournaments (Public)
| Method | Route | Description |
|---|---|---|
| GET | `/api/tournaments` | List all visible tournaments |
| GET | `/api/tournaments/[id]` | Get tournament detail with player count |

### Checkout
| Method | Route | Description |
|---|---|---|
| POST | `/api/checkout` | Create checkout config. Enforces capacity + status. `company_id = platform`. |

### Organizer
| Method | Route | Description |
|---|---|---|
| GET/POST/PATCH/DELETE | `/api/organizer/tournaments` | CRUD tournaments (Products on platform company) |
| POST | `/api/organizer/tournaments/results` | Record results (placements + prize amounts) |
### Payout Requests
| Method | Route | Description |
|---|---|---|
| GET | `/api/payout-requests` | List requests for current user (or all, for admin) |
| POST | `/api/payout-requests` | Submit a new payout request. Fires Whop notification. |
| GET | `/api/payout-requests/[id]` | Get request detail |

### Admin (called from embedded Whop dashboard view)
| Method | Route | Description |
|---|---|---|
| POST | `/api/admin/payout-requests/approve` | Approve request + execute `client.transfers.create()` |
| POST | `/api/admin/payout-requests/deny` | Deny request with reason |
| GET | `/api/admin/transfers` | List all transfers (audit log) |
| GET | `/api/admin/balance` | Get platform account balance via `client.ledgerAccounts.retrieve()` |

### Payouts (Withdrawals)
| Method | Route | Description |
|---|---|---|
| GET | `/api/payouts/token` | Generate access token for embedded payout components |
| GET | `/api/payouts/portal` | Generate hosted payout portal URL (fallback) |

### Webhooks
| Method | Route | Description |
|---|---|---|
| POST | `/api/webhooks/whop` | Handle `payment.succeeded`, `payment.failed`, `payout.completed`, `membership.went_valid`, `membership.went_invalid` |

---

## Data Storage

All app data lives in **Vercel Blob** (JSON document store). Financial operations (transfers, checkout, memberships) use the **Whop API** at runtime.

### Blob storage

Each entity is a JSON file at a deterministic path (`{type}/{id}.json`). All CRUD goes through `src/lib/db.ts` which wraps `@vercel/blob`'s `put`, `list`, and `del` functions.

- **`users/{id}.json`** — Whop user ID as key, role (`player`/`organizer`), linked connected account ID
- **`tournaments/{id}.json`** — Whop product ID as key, all tournament metadata, `prize_structure`, `results`
- **`payout-requests/{id}.json`** — `req_xxx` ID, requester info, amount, status (`pending` -> `approved` | `denied`), transfer ID on approval

### Setup

1. Add Blob Store in Vercel project Storage tab (auto-provisions `BLOB_READ_WRITE_TOKEN`)
2. No schema setup needed — deploy and go

### Tournament results (JSONB in tournaments.results)
```json
{
  "placements": [
    { "userId": "user_xxx", "companyId": "biz_xxx", "username": "PlayerA", "place": 1, "prize": 1600 },
    { "userId": "user_yyy", "companyId": "biz_yyy", "username": "PlayerB", "place": 2, "prize": 960 }
  ],
  "totalPrizePool": 3200,
  "totalEntries": 64,
  "completedAt": "2025-03-15T23:45:00Z"
}
```

---

## Tournament Status Lifecycle (Manual)

| Status | Description | Transitions |
|---|---|---|
| `upcoming` | Accepting entries via checkout | -> `in_progress`, -> `cancelled` |
| `in_progress` | Tournament live, entries blocked | -> `completed`, -> `cancelled` |
| `completed` | Results recorded, payouts claimable | Terminal |
| `cancelled` | Tournament cancelled | Terminal |

---

## Max Player Enforcement

The `/api/checkout` route enforces capacity:
1. Parse `maxPlayers` from tournament product metadata
2. Count existing memberships for the tournament product
3. If `currentPlayers >= maxPlayers`, return 400: "Tournament is full"
4. Block checkout if status is not `upcoming`

---

## Checkout Configuration

All payments go to the platform:

```ts
client.checkoutConfigurations.create({
  mode: "payment",
  redirect_url: `${appUrl}/tournaments/${tournamentId}?entered=true`,
  metadata: {
    organizer_id: organizerId,
    tournament_id: tournamentId,
    type: "tournament_entry",
  },
  plan: {
    company_id: PLATFORM_COMPANY_ID,  // ALL funds go to platform
    product_id: tournamentProductId,
    currency: "usd",
    initial_price: entryFeeAmount,
    plan_type: "one_time",
    visibility: "hidden",
    release_method: "buy_now",
  },
});
```

No `application_fee_amount` -- the platform holds 100% and distributes via transfers.

---

## Notification + Approval Flow

### Submitting a request (from titled-tuesday UI)
```ts
// 1. Store the request (as product metadata or similar)
const requestId = crypto.randomUUID();

// 2. Fire notification to Whop
await client.notifications.create({
  company_id: PLATFORM_COMPANY_ID,
  title: `Payout Request: $${amount}`,
  content: `${requesterName} requests ${reason} from ${tournamentTitle}`,
  subtitle: reason === "tournament_prize" ? `${place} place` : "Organizer revenue",
  rest_path: `/requests/${requestId}`,
});
```

### Approving a request (from admin dashboard inside Whop)
```ts
// 1. Check platform balance
const ledger = await client.ledgerAccounts.retrieve(PLATFORM_COMPANY_ID);
const available = ledger.balances.find(b => b.currency === "usd")?.balance ?? 0;
if (available < amount) throw new Error("Insufficient platform balance");

// 2. Execute transfer
const transfer = await client.transfers.create({
  amount,
  currency: "usd",
  origin_id: PLATFORM_COMPANY_ID,
  destination_id: requesterCompanyId,
  metadata: { request_id: requestId, tournament_id: tournamentId, type: reason },
  notes: `${tournamentTitle} - ${reason}`.slice(0, 50),
  idempotence_key: requestId,
});

// 3. Update request status
// ... mark as approved, store transfer.id
```

---

## Embedded Checkout (Client-Side)

```tsx
import { WhopCheckoutEmbed } from "@whop/checkout/react";

<WhopCheckoutEmbed
  planId={planId}
  onComplete={(planId, receiptId) => { /* redirect or refresh */ }}
  theme="dark"
  skipRedirect={true}
/>
```

---

## Embedded Payout Components (Withdrawals)

Used by both players and organizers to withdraw approved transfers to their bank:

```tsx
import { Elements, PayoutsSession, BalanceElement, WithdrawButtonElement, WithdrawalsElement }
  from "@whop/embedded-components-react-js";
import { loadWhopElements } from "@whop/embedded-components-vanilla-js";

<Elements elements={elements} appearance={appearance}>
  <PayoutsSession token={tokenFetcher} companyId={connectedAccountId} redirectUrl={redirectUrl}>
    <BalanceElement />
    <WithdrawButtonElement />
    <WithdrawalsElement />
  </PayoutsSession>
</Elements>
```

---

## OAuth Flow

Identical to session-pro:
1. `startWhopOAuth(redirect)` -- PKCE verifier/challenge, redirect to `api.whop.com/oauth/authorize`
2. Whop redirects to `/auth/callback?code=...&state=...`
3. Callback exchanges code via `POST /api/auth/token`
4. Fetches user info from `api.whop.com/oauth/userinfo`
5. Stores tokens + user in localStorage via AuthContext
6. Auto-creates connected account on first login
7. Redirects to intended destination

**Scopes:** `openid profile email`
**No token refresh** -- expired tokens cleared on page load.

---

## Whop SDK Methods Used

| Method | Purpose |
|---|---|
| `new Whop({ apiKey })` | Server-side SDK init |
| **Connected Accounts** | |
| `client.companies.create()` | Create connected account (player or organizer) |
| `client.companies.list({ parent_company_id })` | List all connected accounts |
| `client.companies.retrieve(id)` | Get connected account details |
| `client.companies.update(id, { metadata })` | Update role |
| **Tournaments** | |
| `client.products.create()` | Create tournament (on platform company) |
| `client.products.list({ company_id })` | List tournaments |
| `client.products.retrieve(id)` | Get tournament details |
| `client.products.update(id, { ... })` | Update/cancel tournament |
| `client.plans.create()` | Create entry fee plan |
| `client.memberships.list({ company_id })` | List registrations |
| **Checkout** | |
| `client.checkoutConfigurations.create()` | Create embedded checkout (funds to platform) |
| **Transfers & Balances** | |
| `client.transfers.create()` | Execute payout: platform -> recipient |
| `client.transfers.list()` | List transfers (audit log) |
| `client.transfers.retrieve(id)` | Get transfer detail |
| `client.ledgerAccounts.retrieve(id)` | Get platform or user balance |
| **Notifications** | |
| `client.notifications.create()` | Push payout request notification to Whop |
| **Payouts** | |
| `client.accessTokens.create({ company_id })` | Generate token for embedded payout components |
| `client.accountLinks.create()` | Generate hosted payout portal URL (fallback) |

---

## Environment Variables

```env
# Whop API (server-side only)
WHOP_API_KEY=sk_live_xxxxx

# Whop App (public)
NEXT_PUBLIC_WHOP_APP_ID=app_xxxxx
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_xxxxx
NEXT_PUBLIC_APP_URL=http://localhost:5003

# Vercel Blob (auto-provisioned by Vercel Storage)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxx
```

---

## File Structure

```
web/apps/titled-tuesday/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/token/route.ts
│   │   │   ├── checkout/route.ts
│   │   │   ├── connected-account/route.ts
│   │   │   ├── organizer/
│   │   │   │   ├── tournaments/route.ts
│   │   │   │   └── tournaments/results/route.ts
│   │   │   ├── payout-requests/route.ts
│   │   │   ├── payout-requests/[id]/route.ts
│   │   │   ├── admin/
│   │   │   │   ├── payout-requests/approve/route.ts
│   │   │   │   ├── payout-requests/deny/route.ts
│   │   │   │   ├── transfers/route.ts
│   │   │   │   └── balance/route.ts
│   │   │   ├── payouts/
│   │   │   │   ├── token/route.ts
│   │   │   │   └── portal/route.ts
│   │   │   ├── tournaments/route.ts
│   │   │   ├── tournaments/[id]/route.ts
│   │   │   └── webhooks/whop/route.ts
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── callback/page.tsx
│   │   ├── become-organizer/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── history/page.tsx
│   │   │   ├── tournaments/page.tsx
│   │   │   ├── payouts/page.tsx
│   │   │   └── withdrawals/page.tsx
│   │   ├── admin/                          # Embedded inside Whop dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Request queue
│   │   │   ├── requests/[id]/page.tsx      # Request detail + approve/deny
│   │   │   └── transfers/page.tsx          # Transfer audit log
│   │   ├── tournaments/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── nav.tsx
│   │   ├── tournament-card.tsx
│   │   ├── whop-checkout.tsx
│   │   └── payout-components.tsx
│   └── lib/
│       ├── auth-context.tsx
│       ├── db.ts                          # Vercel Blob client + query helpers
│       ├── whop-oauth.ts
│       └── whop-sdk.ts
├── package.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── tailwind.config.ts
```

---

## Design Decisions

1. **Platform holds all funds.** Entry fees go to the parent account. No `application_fee_amount` splitting. The platform is the central treasury.

2. **All users get connected accounts.** Players and organizers both have child companies for receiving transfers and withdrawing to bank.

3. **Payout requests + notifications.** Users submit requests in the titled-tuesday UI. `client.notifications.create()` surfaces them in Whop. `rest_path` deep links admins to the embedded admin view inside Whop.

4. **Admin resolution inside Whop.** Admins approve/deny requests from the embedded `dashboard_path` view. Approval executes `client.transfers.create()` from platform to recipient. Idempotency keys prevent double-sends.

5. **Fee is calculated, not deducted.** Platform fee determines how much of the entry fee pool the organizer can claim, not a payment-time deduction.

6. **Tournament capacity enforced server-side.** Checkout route checks membership count vs `maxPlayers`.

7. **Manual tournament lifecycle.** Organizers control status transitions (upcoming -> in_progress -> completed -> payouts claimable).
