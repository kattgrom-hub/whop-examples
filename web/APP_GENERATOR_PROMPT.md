# Demo App Prompt Template

Use this prompt to generate new Whop example apps in the `whop-examples` monorepo.

---

## The Prompt

```
Build a demo app called **[APP_NAME]** in the whop-examples monorepo.

### Context
This is a demo app for docs.whop.com to showcase Whop SDK integrations. It will be displayed on a wall of example apps for sales leads to see what's possible with Whop. The app should look production-ready but uses mock data (no real Whop SDK integration yet).

### App Concept
- **Name**: [APP_NAME]
- **Tagline**: "[TAGLINE]"
- **Category**: [CATEGORY - e.g., Coaching, Picks, Contest, Talent, Marketplace, Auction, Data Rewards]
- **Description**: [1-2 sentences describing what the app does]
- **Target leads**: [Companies this app would resonate with]

### Whop Integrations to Showcase
Mark which Whop features this app demonstrates:
- [ ] Embedded Checkout - for payments
- [ ] Embedded Payouts - for paying out users/creators
- [ ] OAuth - for authentication
- [ ] Memberships - for subscriptions
- [ ] Chat - for messaging
- [ ] Forums - for community discussions
- [ ] Courses - for educational content
- [ ] Notifications API - for alerts
- [ ] Webhooks - for event handling

### Pages to Build

**Public pages:**
- [ ] `/` - Home/landing page
- [ ] `/browse` - Browse listings/people
- [ ] `/[item]/[id]` - Detail page
- [ ] `/auth/login` - Login (Whop OAuth placeholder)
- [ ] `/auth/callback` - OAuth callback

**Authenticated pages:**
- [ ] `/dashboard` - User dashboard
- [ ] `/dashboard/[feature]` - Feature-specific pages
- [ ] `/messages` - Chat interface (if applicable)
- [ ] `/community` - Forums (if applicable)

**API routes:**
- [ ] `/api/webhooks/whop` - Webhook handler stub
- [ ] `/api/notifications` - Notifications stub

### Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS v4
- TypeScript
- Located in `apps/[app-name]/`

### Structure
Follow the existing monorepo pattern:
- `src/app/` - Pages and API routes
- `src/components/` - Reusable components
- `src/lib/` - Mock data and utilities
- `vercel.json` - Vercel deployment config

### Requirements
1. All pages should have polished UI with dark theme (gray-900 background)
2. Use mock data in `src/lib/` files - no real database
3. Add placeholder boxes where Whop components will be integrated
4. Include "Powered by Whop" in footer
5. Navigation should highlight active page
6. Build should pass with no errors
```

---

## Example: Filled Out Prompt

```
Build a demo app called **SharpSheet** in the whop-examples monorepo.

### Context
This is a demo app for docs.whop.com to showcase Whop SDK integrations. It will be displayed on a wall of example apps for sales leads to see what's possible with Whop. The app should look production-ready but uses mock data (no real Whop SDK integration yet).

### App Concept
- **Name**: SharpSheet
- **Tagline**: "Follow the edge"
- **Category**: Picks (sports betting content)
- **Description**: A subscription platform where sports analysts share picks and insights. Members subscribe to top analysts and access premium betting advice.
- **Target leads**: SoBet

### Whop Integrations to Showcase
- [x] Embedded Checkout - for subscriptions
- [x] Embedded Payouts - for analyst revenue share
- [x] OAuth - for authentication
- [x] Memberships - for subscription tiers
- [x] Chat - for premium DM access
- [x] Forums - for community discussion
- [ ] Courses - N/A
- [x] Notifications API - for pick alerts
- [ ] Webhooks - for subscription events

### Pages to Build

**Public pages:**
- [x] `/` - Home with featured analysts and recent picks
- [x] `/analysts` - Browse analysts by sport/record
- [x] `/analyst/[id]` - Analyst profile with subscription CTA
- [x] `/auth/login` - Login (Whop OAuth placeholder)
- [x] `/auth/callback` - OAuth callback

**Authenticated pages:**
- [x] `/feed` - Subscriber's pick feed
- [x] `/dashboard` - Analyst dashboard (for analysts)
- [x] `/dashboard/picks` - Manage picks
- [x] `/dashboard/subscribers` - View subscribers
- [x] `/dashboard/payouts` - Earnings & payouts
- [x] `/messages` - DMs with subscribers
- [x] `/community` - Discussion forums

**API routes:**
- [x] `/api/webhooks/whop` - Webhook handler stub
- [x] `/api/notifications` - Pick alert notifications

### Tech Stack
- Next.js 15 (App Router)
- Tailwind CSS v4
- TypeScript
- Located in `apps/sharp-sheet/`
```

---

## Key Information to Provide

| What | Why It Matters |
|------|----------------|
| **App name & tagline** | Sets the branding and tone |
| **Category** | Determines the user flows and data models |
| **Target leads** | Ensures the demo resonates with sales pipeline |
| **Whop integrations** | Defines which SDK features to showcase |
| **Page list** | Ensures complete coverage of user journeys |
| **User roles** | Who uses the app (e.g., student/coach, analyst/subscriber) |

---

## Reference: Whop Features Available

From docs.whop.com:

| Feature | Description | Common Use |
|---------|-------------|------------|
| **Embedded Checkout** | Drop-in payment UI | Buy/subscribe buttons |
| **Embedded Payouts** | Balance, withdraw, payout methods | Creator dashboards |
| **OAuth** | Login with Whop | Authentication |
| **Memberships API** | Subscriptions, access passes | Recurring revenue |
| **Chat SDK** | Channels, DMs, moderation | Messaging features |
| **Forums API** | Posts, comments, threads | Community pages |
| **Courses API** | Chapters, lessons, progress | Educational content |
| **Notifications API** | Push alerts to users | Reminders, updates |
| **Webhooks** | Event callbacks | Backend automation |

---

## After Generation

1. Run `pnpm install` from root
2. Run `cd apps/[app-name] && pnpm dev` to test locally
3. Verify all pages render correctly
4. Run `pnpm build` to ensure no errors
5. Update `apps.md` with the new app
6. Commit and push
