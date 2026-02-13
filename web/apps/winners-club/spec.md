# Winners Club Data Schema Spec

## Current State: No Local Database

Winners Club is **entirely stateless** — there is no Postgres, no ORM, no migrations, no local storage of any kind. All data persistence is delegated to the **Whop API**, which serves as the sole source of truth. Community forum posts are stored in Vercel Blob.

---

## Current Data Model (All in Whop)

### Entity Map

| App Concept | Whop Entity | Key Fields | Why It's Stored There |
|---|---|---|---|
| **User/Auth** | OIDC JWT (no DB) | `id`, `username`, `profile_pic_url`, `accessToken` | Stateless auth — token lives client-side, user data from Whop OIDC profile |
| **Tipster** | Company (connected account) | `id`, `title`, `owner_user.id`, `logo.url`, `metadata.*` | Each tipster is a Whop sub-company under the platform's parent company. Enables per-tipster payouts via Whop's connected account infrastructure |
| **Tipster Profile** | Company metadata | `user_id`, `email`, `plan` ("core"\|"pro"), `bio`, `categories` (JSON string) | Stored as metadata on the company object — no local DB needed for simple key-value profile data |
| **Pick Package** | Product | `id`, `title`, `visibility` | A pick package is modeled as a purchasable Whop product under the tipster's company |
| **Package Details** | Product `description` (JSON string) | `type`, `title`, `description`, `date`, `time`, `duration`, `price` | JSON-encoded in the `description` field, prefixed with `{"type":"coaching_session"`. This is a hack — Whop products don't have custom structured metadata fields, so the description is overloaded |
| **Package Pricing** | Plan | `id`, `plan_type: "one_time"`, `initial_price`, `product_id`, `company_id` | Created alongside each product. Whop Plans handle pricing, checkout, and payment splitting |
| **Subscription** | Membership | `id`, `user.*`, `created_at`, `canceled_at`, `metadata.*` | When a subscriber purchases a package, Whop creates a membership. The membership IS the subscription record |
| **Subscription Details** | Membership metadata | `coach_id`, `coach_name`, `time_slot`, `date`, `time`, `title`, `session_plan_id`, `type`, `duration` | Subscription context passed through checkout metadata → membership metadata |
| **Checkout** | Checkout Configuration | `purchase_url`, `plan.id`, `metadata.*` | Whop handles the entire payment flow. Platform fee (8% core / 5% pro) set via `application_fee_amount` |
| **Tipster Payouts** | Access Tokens + Account Links | temporary tokens/URLs | No local storage — generates ephemeral tokens for Whop's embedded payout components |
| **Tipster Plan Tier** | Company metadata `plan` field | `"core"` or `"pro"` | Updated by webhook when tipster subscribes/unsubscribes to Pro plan |
| **Forum Posts** | Vercel Blob | `id`, `title`, `body`, `authorId`, `category`, `createdAt` | Community discussions stored in blob storage |

---

## Whop API Calls (Complete Inventory)

| SDK Method | Used For | Called From |
|---|---|---|
| `companies.list({parent_company_id})` | Find all tipsters / find a specific tipster by user_id | 6+ routes |
| `companies.create({...})` | Create tipster connected account | `POST /api/instructor/connected-account` |
| `companies.retrieve(id)` | Get tipster details | checkout, tipster/profile |
| `companies.update(id, {...})` | Update tipster profile or plan tier | webhook, `PATCH /api/instructor/profile` |
| `products.create({...})` | Create pick package | `POST /api/instructor/sessions` |
| `products.list({company_id})` | List tipster's packages | sessions, tipster/sessions |
| `products.retrieve(id)` | Get package details | sessions, tipster/sessions |
| `products.update(id, {...})` | Edit or soft-delete package | `PATCH/DELETE /api/instructor/sessions` |
| `plans.create({...})` | Create pricing for package | `POST /api/instructor/sessions` |
| `memberships.list({...})` | List subscriptions (tipster or subscriber view) | tipster/sessions, subscriber/bookings |
| `checkoutConfigurations.create({...})` | Create payment session | `POST /api/checkout` |
| `accessTokens.create({company_id})` | Auth for embedded payout UI | `GET /api/payouts/token` |
| `accountLinks.create({...})` | Generate payout portal URL | `GET /api/payouts/portal` |

---

## Key Data Flows

### Becoming a Tipster
1. User authenticates via Whop OIDC
2. `POST /api/instructor/connected-account` → `companies.create()` with `parent_company_id`
3. Tipster company created with metadata: `{user_id, email, plan: "core"}`

### Creating a Pick Package
1. `POST /api/instructor/sessions` → `products.create()` with JSON-encoded metadata in `description`
2. `plans.create()` with `one_time` pricing linked to the product

### Buying a Pick Package (Subscriber)
1. `POST /api/checkout` → `checkoutConfigurations.create()` with platform fee
2. Subscriber completes Whop checkout
3. Whop creates a Membership (the subscription) with metadata passed from checkout

### Browsing Packages
1. `GET /api/classes` → iterates ALL companies under platform, lists ALL products per company
2. Filters products where `description` starts with `{"type":"coaching_session"`
3. Parses JSON from description field

---

## Persistence

### Vercel Blob Storage

| Blob Path | Purpose |
|---|---|
| `classes/index.json` | Denormalized index of all visible pick packages |
| `instructors/index.json` | Lightweight tipster lookup map (companyId → profile) |
| `community/posts/index.json` | Forum posts for the community page |
| `webhooks/{eventType}/{eventId}.json` | Webhook event audit log |

### Whop Company Metadata

| Field | Type | Purpose |
|---|---|---|
| `user_id` | string | Maps Whop user to their tipster company |
| `email` | string | Tipster contact email |
| `plan` | string | `"core"` or `"pro"` tier |
| `bio` | string | Tipster biography |
| `categories` | string (JSON array) | Sports the tipster covers |
