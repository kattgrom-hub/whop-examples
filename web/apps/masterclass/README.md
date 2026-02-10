# Masterclass

A 1:1 class marketplace built on Whop. Learners book classes with expert instructors, and instructors get paid via Whop Payouts.

## Business Model

### Value Proposition

Masterclass connects learners with expert instructors for live 1:1 classes. The platform handles discovery, payments, and payouts so instructors can focus on teaching.

### Revenue Model

**For Instructors (Sellers):**

| Plan | Price | Platform Fee |
|------|-------|--------------|
| Core | Free | 8% per transaction |
| Pro Monthly | $15/month | 5% |
| Pro Yearly | $150/year ($12.50/mo) | 5% |

**For Learners (Buyers):**
- Free to browse and book
- Pay the class price set by the instructor (no markup)

---

## User Flows

### User Roles

1. **Learners** - Browse classes, book & pay, attend classes
2. **Instructors** - Create classes, receive bookings, withdraw earnings

### Account Structure

```
Masterclass Platform (main company)
├── Instructor A (connected account)
├── Instructor B (connected account)
└── Instructor C (connected account)
```

Each instructor gets their own Whop connected account for independent payouts.

---

## Money Flows

### Flow 1: Learner Books a Class

```
Learner                    Masterclass                Whop                      Instructor
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
  "instructorId": "biz_xxxxx",
  "instructorName": "Alex Chen",
  "price": 45,
  "timeSlot": "2024-01-15 14:00",
  "classId": "prod_xxxxx",
  "classTitle": "Advanced Python"
}
```

**What happens:**
1. Creates a Whop checkout configuration with `mode: "payment"`
2. Sets the instructor's connected account as the payment recipient
3. Returns an embeddable checkout URL
4. Learner completes payment in the embedded Whop checkout
5. Funds go directly to instructor's connected account (minus platform fee if applicable)

---

### Flow 2: Instructor Creates a Class

```
Instructor                 Masterclass                Whop
  │                            │                        │
  │  1. Fill class form        │                        │
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
  │  5. Class live             │                        │
  │<───────────────────────────│                        │
```

**API Route:** `POST /api/instructor/sessions`

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
1. Creates a Whop Product in the instructor's connected account
2. Creates a one-time Plan attached to that product
3. Class metadata stored in the product description (JSON)
4. Class appears in the public browse page

---

### Flow 3: Instructor Withdraws Earnings

```
Instructor                 Masterclass                Whop                    Bank
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

### Flow 4: Instructor Upgrades to Pro Plan

```
Instructor                 Masterclass                Whop
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

**API Route:** `POST /api/instructor-plans`

**Plans:**
| Plan | Type | Price | Billing |
|------|------|-------|---------|
| Core | one_time | $0 | N/A |
| Pro Monthly | renewal | $19 | 30 days |
| Pro Yearly | renewal | $156 | 365 days |

---

### Flow 5: New Instructor Onboarding

```
Visitor                    Masterclass                Whop
   │                           │                        │
   │  1. Click "Become         │                        │
   │     Instructor"           │                        │
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
1. Instructor authenticates via Whop OAuth (PKCE flow)
2. On first login, system auto-creates a connected account
3. Connected account enables independent payouts
4. Instructor can immediately create classes and receive payments

---

## Whop Integrations

| Feature | Purpose | Files |
|---------|---------|-------|
| **OAuth** | User authentication | `/src/lib/whop-oauth.ts` |
| **Checkout** | Class payments | `/src/app/api/checkout/route.ts` |
| **Connected Accounts** | Per-instructor payment accounts | `/src/app/api/instructor/connected-account/route.ts` |
| **Products & Plans** | Class listings | `/src/app/api/instructor/sessions/route.ts` |
| **Embedded Payouts** | Instructor withdrawals | `/src/app/dashboard/payouts/page.tsx` |
| **Webhooks** | Payment events | `/src/app/api/webhooks/whop/route.ts` |

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/checkout` | POST | Create checkout session for booking |
| `/api/instructor-plans` | POST | Get instructor subscription checkout URLs |
| `/api/instructor/connected-account` | GET/POST | Manage instructor's connected account |
| `/api/instructor/sessions` | GET/POST/PATCH/DELETE | CRUD for instructor's classes |
| `/api/payouts/token` | GET | Generate payout portal access token |
| `/api/payouts/portal` | GET | Generate payout portal URL |
| `/api/classes` | GET | List all available classes |
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
NEXT_PUBLIC_APP_URL=https://masterclass.vercel.app

# Instructor Plans (from setup script)
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

# Run instructor plans setup (one-time)
npx tsx scripts/setup-plans.ts

# Start development server
pnpm dev
```

---

## Architecture Notes

- **No database** - All data stored in Whop (Products, Plans, Memberships)
- **Stateless** - Class info embedded in Whop product metadata
- **Thin UI layer** - Masterclass is a frontend for Whop's payment infrastructure
- **Per-instructor accounts** - Each instructor has independent connected account for payouts
