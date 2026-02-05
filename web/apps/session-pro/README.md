# SessionPro

A 1:1 coaching marketplace built on Whop. Students book sessions with expert coaches, and coaches get paid via Whop Payouts.

## Business Model

### Value Proposition

SessionPro connects students with expert coaches for live 1:1 sessions. The platform handles discovery, payments, and payouts so coaches can focus on coaching.

### Revenue Model

**For Coaches (Sellers):**

| Plan | Price | Platform Fee |
|------|-------|--------------|
| Core | Free | 8% per transaction |
| Pro Monthly | $19/month | 0% |
| Pro Yearly | $156/year ($13/mo) | 0% |

**For Students (Buyers):**
- Free to browse and book
- Pay the session price set by the coach (no markup)

---

## User Flows

### User Roles

1. **Students** - Browse sessions, book & pay, attend sessions
2. **Coaches** - Create sessions, receive bookings, withdraw earnings

### Account Structure

```
SessionPro Platform (main company)
├── Coach A (connected account)
├── Coach B (connected account)
└── Coach C (connected account)
```

Each coach gets their own Whop connected account for independent payouts.

---

## Money Flows

### Flow 1: Student Books a Session

```
Student                    SessionPro                 Whop                      Coach
   │                           │                        │                         │
   │  1. Click "Book Now"      │                        │                         │
   │──────────────────────────>│                        │                         │
   │                           │                        │                         │
   │                           │  2. Create checkout    │                         │
   │                           │     configuration      │                         │
   │                           │───────────────────────>│                         │
   │                           │                        │                         │
   │                           │  3. Return checkout    │                         │
   │                           │     URL                │                         │
   │                           │<───────────────────────│                         │
   │                           │                        │                         │
   │  4. Embedded checkout     │                        │                         │
   │<──────────────────────────│                        │                         │
   │                           │                        │                         │
   │  5. Enter payment info    │                        │                         │
   │─────────────────────────────────────────────────────>                        │
   │                           │                        │                         │
   │                           │                        │  6. Funds deposited     │
   │                           │                        │─────────────────────────>│
   │                           │                        │                         │
   │  7. Redirect to success   │                        │                         │
   │<──────────────────────────│                        │                         │
```

**API Route:** `POST /api/checkout`

**Request:**
```json
{
  "coachId": "biz_xxxxx",
  "coachName": "Alex Chen",
  "price": 45,
  "timeSlot": "2024-01-15 14:00",
  "sessionId": "prod_xxxxx",
  "sessionTitle": "Advanced Python"
}
```

**What happens:**
1. Creates a Whop checkout configuration with `mode: "payment"`
2. Sets the coach's connected account as the payment recipient
3. Returns an embeddable checkout URL
4. Student completes payment in the embedded Whop checkout
5. Funds go directly to coach's connected account (minus platform fee if applicable)

---

### Flow 2: Coach Creates a Session

```
Coach                      SessionPro                 Whop
  │                            │                        │
  │  1. Fill session form      │                        │
  │───────────────────────────>│                        │
  │                            │                        │
  │                            │  2. Create product     │
  │                            │───────────────────────>│
  │                            │                        │
  │                            │  3. Create plan        │
  │                            │───────────────────────>│
  │                            │                        │
  │                            │  4. Return product ID  │
  │                            │<───────────────────────│
  │                            │                        │
  │  5. Session live           │                        │
  │<───────────────────────────│                        │
```

**API Route:** `POST /api/coach/sessions`

**Request:**
```json
{
  "title": "Advanced Python Coaching",
  "description": "Deep dive into Python internals",
  "date": "2024-01-15",
  "time": "14:00",
  "duration": 60,
  "price": 45
}
```

**What happens:**
1. Creates a Whop Product in the coach's connected account
2. Creates a one-time Plan attached to that product
3. Session metadata stored in the product description (JSON)
4. Session appears in the public browse page

---

### Flow 3: Coach Withdraws Earnings

```
Coach                      SessionPro                 Whop                    Bank
  │                            │                        │                       │
  │  1. Visit /payouts         │                        │                       │
  │───────────────────────────>│                        │                       │
  │                            │                        │                       │
  │                            │  2. Get access token   │                       │
  │                            │───────────────────────>│                       │
  │                            │                        │                       │
  │  3. Embedded payout UI     │                        │                       │
  │<───────────────────────────│                        │                       │
  │                            │                        │                       │
  │  4. Click "Withdraw"       │                        │                       │
  │─────────────────────────────────────────────────────>                       │
  │                            │                        │                       │
  │                            │                        │  5. Transfer funds    │
  │                            │                        │──────────────────────>│
  │                            │                        │                       │
  │  6. Confirmation           │                        │                       │
  │<─────────────────────────────────────────────────────                       │
```

**API Routes:**
- `GET /api/payouts/token` - Generate temporary access token
- `GET /api/payouts/portal` - Generate payout portal URL (fallback)

**Embedded Components:**
- `<BalanceElement>` - Shows current available balance
- `<WithdrawButtonElement>` - Initiates withdrawal to bank
- `<WithdrawalsElement>` - Shows withdrawal history

---

### Flow 4: Coach Upgrades to Pro Plan

```
Coach                      SessionPro                 Whop
  │                            │                        │
  │  1. Select Pro plan        │                        │
  │───────────────────────────>│                        │
  │                            │                        │
  │                            │  2. Get plan checkout  │
  │                            │───────────────────────>│
  │                            │                        │
  │  3. Redirect to checkout   │                        │
  │<───────────────────────────│                        │
  │                            │                        │
  │  4. Complete payment       │                        │
  │─────────────────────────────────────────────────────>
  │                            │                        │
  │  5. Pro membership active  │                        │
  │<─────────────────────────────────────────────────────
```

**API Route:** `POST /api/coach-plans`

**Plans:**
| Plan | Type | Price | Billing |
|------|------|-------|---------|
| Core | one_time | $0 | N/A |
| Pro Monthly | renewal | $19 | 30 days |
| Pro Yearly | renewal | $156 | 365 days |

---

### Flow 5: New Coach Onboarding

```
Visitor                    SessionPro                 Whop
   │                           │                        │
   │  1. Click "Become Coach"  │                        │
   │──────────────────────────>│                        │
   │                           │                        │
   │  2. OAuth redirect        │                        │
   │<──────────────────────────│                        │
   │                           │                        │
   │  3. Authorize app         │                        │
   │─────────────────────────────────────────────────────>
   │                           │                        │
   │  4. Callback with code    │                        │
   │──────────────────────────>│                        │
   │                           │                        │
   │                           │  5. Exchange for token │
   │                           │───────────────────────>│
   │                           │                        │
   │                           │  6. Create connected   │
   │                           │     account            │
   │                           │───────────────────────>│
   │                           │                        │
   │  7. Redirect to dashboard │                        │
   │<──────────────────────────│                        │
```

**What happens:**
1. Coach authenticates via Whop OAuth (PKCE flow)
2. On first login, system auto-creates a connected account
3. Connected account enables independent payouts
4. Coach can immediately create sessions and receive payments

---

## Whop Integrations

| Feature | Purpose | Files |
|---------|---------|-------|
| **OAuth** | User authentication | `/src/lib/whop-oauth.ts` |
| **Checkout** | Session payments | `/src/app/api/checkout/route.ts` |
| **Connected Accounts** | Per-coach payment accounts | `/src/app/api/coach/connected-account/route.ts` |
| **Products & Plans** | Session listings | `/src/app/api/coach/sessions/route.ts` |
| **Embedded Payouts** | Coach withdrawals | `/src/app/dashboard/payouts/page.tsx` |
| **Webhooks** | Payment events | `/src/app/api/webhooks/whop/route.ts` |

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/checkout` | POST | Create checkout session for booking |
| `/api/coach-plans` | POST | Get coach subscription checkout URLs |
| `/api/coach/connected-account` | GET/POST | Manage coach's connected account |
| `/api/coach/sessions` | GET/POST/PATCH/DELETE | CRUD for coach's sessions |
| `/api/payouts/token` | GET | Generate payout portal access token |
| `/api/payouts/portal` | GET | Generate payout portal URL |
| `/api/sessions` | GET | List all available sessions |
| `/api/webhooks/whop` | POST | Receive Whop webhook events |
| `/api/auth/token` | POST | Exchange OAuth code for tokens |

---

## Environment Variables

```env
# Whop API
WHOP_API_KEY=sk_live_xxxxx

# Whop OAuth (Public)
NEXT_PUBLIC_WHOP_APP_ID=app_xxxxx
NEXT_PUBLIC_WHOP_COMPANY_ID=biz_xxxxx
NEXT_PUBLIC_APP_URL=https://session-pro.vercel.app

# Coach Plans (from setup script)
WHOP_PLAN_CORE=plan_xxxxx
WHOP_PLAN_PRO_MONTHLY=plan_xxxxx
WHOP_PLAN_PRO_YEARLY=plan_xxxxx
```

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run coach plans setup (one-time)
npx tsx scripts/setup-plans.ts

# Start development server
pnpm dev
```

---

## Architecture Notes

- **No database** - All data stored in Whop (Products, Plans, Memberships)
- **Stateless** - Session info embedded in Whop product metadata
- **Thin UI layer** - SessionPro is a frontend for Whop's payment infrastructure
- **Per-coach accounts** - Each coach has independent connected account for payouts
