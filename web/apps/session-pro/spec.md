# Session-Pro Data Schema Spec

## Current State: No Local Database

Session-pro is **entirely stateless** — there is no Postgres, no ORM, no migrations, no local storage of any kind. All data persistence is delegated to the **Whop API**, which serves as the sole source of truth.

---

## Current Data Model (All in Whop)

### Entity Map

| App Concept | Whop Entity | Key Fields | Why It's Stored There |
|---|---|---|---|
| **User/Auth** | OIDC JWT (no DB) | `id`, `username`, `profile_pic_url`, `accessToken` | Stateless auth — token lives client-side, user data from Whop OIDC profile |
| **Coach** | Company (connected account) | `id`, `title`, `owner_user.id`, `logo.url`, `metadata.*` | Each coach is a Whop sub-company under the platform's parent company. Enables per-coach payouts via Whop's connected account infrastructure |
| **Coach Profile** | Company metadata | `user_id`, `email`, `plan` ("core"\|"pro"), `bio`, `categories` (JSON string) | Stored as metadata on the company object — no local DB needed for simple key-value profile data |
| **Session Listing** | Product | `id`, `title`, `visibility` | A coaching session is modeled as a purchasable Whop product under the coach's company |
| **Session Details** | Product `description` (JSON string) | `type`, `title`, `description`, `date`, `time`, `duration`, `price` | JSON-encoded in the `description` field, prefixed with `{"type":"coaching_session"`. This is a hack — Whop products don't have custom structured metadata fields, so the description is overloaded |
| **Session Pricing** | Plan | `id`, `plan_type: "one_time"`, `initial_price`, `product_id`, `company_id` | Created alongside each product. Whop Plans handle pricing, checkout, and payment splitting |
| **Booking** | Membership | `id`, `user.*`, `created_at`, `canceled_at`, `metadata.*` | When a student purchases a session, Whop creates a membership. The membership IS the booking record |
| **Booking Details** | Membership metadata | `coach_id`, `coach_name`, `time_slot`, `date`, `time`, `title`, `session_plan_id`, `type`, `duration` | Booking context passed through checkout metadata → membership metadata |
| **Checkout** | Checkout Configuration | `purchase_url`, `plan.id`, `metadata.*` | Whop handles the entire payment flow. Platform fee (8% core / 5% pro) set via `application_fee_amount` |
| **Coach Payouts** | Access Tokens + Account Links | temporary tokens/URLs | No local storage — generates ephemeral tokens for Whop's embedded payout components |
| **Coach Plan Tier** | Company metadata `plan` field | `"core"` or `"pro"` | Updated by webhook when coach subscribes/unsubscribes to Pro plan |

### Platform Plans (Hardcoded)

| Plan | ID | Price |
|---|---|---|
| Core (free) | `plan_jkXUdgZw1MAeL` | $0 |
| Pro Monthly | `plan_dILTpyq7hdoFT` | $19/mo |
| Pro Yearly | `plan_HuiQ7GzCm8jtG` | $150/yr |

---

## Whop API Calls (Complete Inventory)

| SDK Method | Used For | Called From |
|---|---|---|
| `companies.list({parent_company_id})` | Find all coaches / find a specific coach by user_id | 6+ routes |
| `companies.create({...})` | Create coach connected account | `POST /api/coach/connected-account` |
| `companies.retrieve(id)` | Get coach details | checkout, coach/profile |
| `companies.update(id, {...})` | Update coach profile or plan tier | webhook, `PATCH /api/coach/profile` |
| `products.create({...})` | Create session listing | `POST /api/coach/sessions` |
| `products.list({company_id})` | List coach's sessions | sessions, coach/sessions |
| `products.retrieve(id)` | Get session details | sessions, coach/sessions |
| `products.update(id, {...})` | Edit or soft-delete session | `PATCH/DELETE /api/coach/sessions` |
| `plans.create({...})` | Create pricing for session | `POST /api/coach/sessions` |
| `memberships.list({...})` | List bookings (coach or student view) | coach/sessions, student/bookings |
| `checkoutConfigurations.create({...})` | Create payment session | `POST /api/checkout` |
| `accessTokens.create({company_id})` | Auth for embedded payout UI | `GET /api/payouts/token` |
| `accountLinks.create({...})` | Generate payout portal URL | `GET /api/payouts/portal` |

---

## Key Data Flows

### Becoming a Coach
1. User authenticates via Whop OIDC
2. `POST /api/coach/connected-account` → `companies.create()` with `parent_company_id`
3. Coach company created with metadata: `{user_id, email, plan: "core"}`

### Creating a Session
1. `POST /api/coach/sessions` → `products.create()` with JSON-encoded metadata in `description`
2. `plans.create()` with `one_time` pricing linked to the product

### Booking a Session (Student)
1. `POST /api/checkout` → `checkoutConfigurations.create()` with platform fee
2. Student completes Whop checkout
3. Whop creates a Membership (the booking) with metadata passed from checkout

### Browsing Sessions
1. `GET /api/sessions` → iterates ALL companies under platform, lists ALL products per company
2. Filters products where `description` starts with `{"type":"coaching_session"`
3. Parses JSON from description field

---

## Known Limitations of Current Architecture

1. **N+1 query pattern**: Browsing sessions requires listing all companies, then all products per company, then retrieving each product individually
2. **JSON-in-description hack**: Session metadata is JSON-encoded in the product `description` field — no structured querying, no validation
3. **No webhook signature verification**: Webhook handler has TODO for verification
4. **No caching**: Every page load hits the Whop API directly
5. **No local search/filter**: All filtering done client-side after fetching everything
6. **Webhook handler is mostly stubs**: payment.succeeded, payment.failed, payout.completed all just log

---

## Persistence Proposal

### Storage Constraints

Only two storage options:
- **Whop Metadata** — key-value JSON on supported entities (Companies, Memberships, Checkouts, Payments). NOT available on Products or Plans. Cannot be queried/filtered server-side. Unknown size limits (no documented max keys, max value length). SDK `CompanyUpdateParams` omits metadata (requires type cast).
- **Vercel Blob** (`@vercel/blob`) — S3-backed object storage. All blobs are **publicly accessible via URL** (no private mode). 60-second cache propagation on updates. No atomic operations. Pro plan: 5GB included, $0.023/GB overage. Rate limits: 120/s reads, 75/s writes.

### Decision Framework

| Criteria | Use Whop Metadata | Use Vercel Blob |
|---|---|---|
| Data shape | Small key-value pairs (profile fields, flags) | Structured JSON documents, indexes, collections |
| Read pattern | Always read alongside parent entity | Standalone reads, index lookups |
| Sensitivity | Can contain PII (private API) | **No PII** — all URLs are public |
| Write trigger | Entity create/update | Webhook events, cache rebuilds |
| Query needs | None (always fetched with parent) | Prefix-based listing only |

---

### What We Persist and Where

#### 1. Coach Profile — Whop Company Metadata (keep as-is)

| Field | Type | Purpose |
|---|---|---|
| `user_id` | string | Maps Whop user to their coach company |
| `email` | string | Coach contact email |
| `plan` | string | `"core"` or `"pro"` tier |
| `bio` | string | Coach biography |
| `categories` | string (JSON array) | Coach specialties for browse filtering |

**Why Whop Metadata**: Small key-value data. Always read alongside the company entity. Contains PII (email) — cannot go in Blob. Whop is source of truth for the coach's connected account anyway.

**SDK note**: `companies.update()` requires type cast for metadata — this is an SDK gap, not an API limitation.

#### 2. Sessions Index — Vercel Blob: `sessions/index.json`

A single denormalized JSON file containing all visible sessions across all coaches.

```json
{
  "updatedAt": "2026-02-10T16:00:00Z",
  "sessions": [
    {
      "id": "prod_abc",
      "companyId": "biz_xyz",
      "coachName": "Coach Mike",
      "coachLogo": "https://...",
      "title": "Advanced Techniques",
      "description": "Learn advanced coaching methods",
      "date": "2026-03-15",
      "time": "10:00",
      "duration": 60,
      "price": 75,
      "categories": ["Fitness"]
    }
  ]
}
```

**Why Vercel Blob**: Products have **no metadata field** — the JSON-in-description hack is the only Whop option and it's fragile. A blob index eliminates the N+1 scan (browse page currently does 1 + N + M API calls → 1 blob read). Session listings are public information — no PII concern.

**Updated on**: Session create, update, delete (`POST/PATCH/DELETE /api/coach/sessions`). Read the current blob, mutate, write back.

**Staleness**: 60s cache propagation is acceptable — new sessions appearing with a ~1 min delay is fine for a browse page.

#### 3. Coaches Lookup — Vercel Blob: `coaches/index.json`

A lightweight map for resolving userId → companyId without scanning all companies.

```json
{
  "updatedAt": "2026-02-10T16:00:00Z",
  "coaches": {
    "biz_xyz": {
      "name": "Coach Mike",
      "plan": "core",
      "categories": ["Fitness"]
    },
    "biz_uvw": {
      "name": "Coach Sarah",
      "plan": "pro",
      "categories": ["Music"]
    }
  }
}
```

**Why Vercel Blob**: The O(N) company scan on every request is the single biggest performance problem. 6+ routes do `companies.list()` + iterate all. This index makes lookups O(1).

**Why NOT user IDs as keys**: Blobs are public. We index by companyId (already public in URLs/products) and store only public-facing coach info. The userId → companyId resolution moves to a server-side map that is NOT in the blob — instead, on coach creation we store the mapping in **Whop company metadata** (already there as `metadata.user_id`), and the API routes that need userId lookup do a single `companies.list()` call with the result cached in-memory for the request. Alternatively, the full userId map can be kept in a separate blob if we accept that Whop user IDs in an unguessable URL is an acceptable tradeoff.

**Updated on**: Coach creation, profile update, plan tier change (webhook).

#### 4. Booking Details — Whop Membership Metadata (keep as-is)

| Field | Type | Purpose |
|---|---|---|
| `type` | string | `"coaching_session"` — discriminator for filtering |
| `title` | string | Session title at time of booking |
| `coach_id` | string | Coach's company ID |
| `coach_name` | string | Coach display name at time of booking |
| `date` | string | Session date |
| `time` | string | Session time |
| `time_slot` | string | Full timestamp |
| `duration` | string | Session duration |
| `session_plan_id` | string | Original session/plan ID |

**Why Whop Metadata**: Booking data flows through checkout → membership metadata automatically. Contains user context (PII-adjacent). Memberships are Whop's source of truth for purchase records. The metadata propagation from checkout config to membership is a Whop feature we should keep using.

**N+1 for student bookings**: `GET /api/student/bookings` still scans all companies. This can be improved by using the coaches index blob to get all companyIds, then batch the membership queries — but the fundamental issue (Whop doesn't support cross-company membership queries) remains. For now, this is acceptable given the expected scale.

#### 5. Webhook Event Log — Vercel Blob: `webhooks/{eventType}/{eventId}.json`

Currently dropped events that should be persisted:

| Event | What to Store | Purpose |
|---|---|---|
| `payment.succeeded` | `eventId`, `amount`, `companyId`, `planId`, `timestamp` | Payment audit trail, booking confirmation |
| `payment.failed` | `eventId`, `amount`, `companyId`, `planId`, `timestamp`, `failureReason` | Failed payment tracking, retry logic |
| `payout.completed` | `eventId`, `companyId`, `amount`, `timestamp` | Coach payout history |

**Why Vercel Blob**: These are append-only event records. No PII in the stored fields (company IDs and amounts only — no user emails/names). Prefix-based listing (`webhooks/payment.succeeded/`) enables simple event browsing. No query needs beyond "list recent events."

**Why not Whop Metadata**: These events don't belong as metadata on any single Whop entity. They're platform-level audit records.

#### 6. Coach Plan Tier — Whop Company Metadata (keep as-is)

The `plan` field on company metadata (`"core"` | `"pro"`) is updated by the webhook handler on `membership.went_valid` / `membership.went_invalid`. This stays in Whop — it's a property of the coach's connected account.

---

### What We Do NOT Persist Locally

| Data | Why Not |
|---|---|
| User identity / profile | Stateless JWT from OIDC. No local mirror needed. |
| Checkout configurations | Ephemeral — created per checkout, used once. |
| Payout tokens / account links | Ephemeral — generated on demand, short-lived. |
| Plan definitions | Hardcoded IDs. Rarely change. |
| Membership lifecycle (active/cancelled) | Whop is source of truth. Read on demand. |
| Payment processing details | Whop handles entirely. We only log the webhook event. |

---

### Performance Impact

| Route | Before (API calls) | After |
|---|---|---|
| `GET /api/sessions` (browse) | 1 + N(coaches) + M(products) + M(retrieves) | **1 blob read** |
| `GET /api/coach/sessions` | 1 companies.list scan + P retrieves | 1 blob read (coaches index) + 1 `companies.retrieve` + filtered blob read |
| `GET /api/coach/profile` | 1 companies.list scan + 1 retrieve | 1 blob read (coaches index) + 1 `companies.retrieve` |
| `GET /api/student/bookings` | 1 + N(coaches) membership queries | 1 blob read (coaches index) + K `memberships.list` calls (K = coaches with bookings) |
| `POST /api/checkout` | 1 `companies.retrieve` | No change (already direct) |

For a platform with 50 coaches averaging 5 sessions each, the browse page goes from ~300 API calls to **1 blob read**.

---

## Whop Entities NOT Used by Session-Pro

The Whop API offers many more entities that session-pro does not currently use:
- Experiences (courses, forums, chat)
- Invoices, Refunds, Disputes
- Promo Codes
- Notifications API (marked TODO in code)
- DM Channels, Messages
- Reviews, Leads, Verifications
- File uploads
- AI Chats
