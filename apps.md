# Whop Examples Apps

Demo apps showcasing Whop SDK integrations for different industries and use cases.

## Apps

| App | Directory | Category | Description | Target Leads | Status |
|-----|-----------|----------|-------------|--------------|--------|
| **SessionPro** | `apps/session-pro` | Coaching | 1:1 coaching marketplace — book sessions with experts, coaches get paid via Whop Payouts | Metafy, Athletes Untapped | ✅ Built |
| **SharpSheet** | `apps/sharp-sheet` | Picks | Sports picks subscriptions — subscribe to analysts, get picks, track performance | SoBet | 🔲 Planned |
| **PoolPlay** | `apps/pool-play` | Contest | Fantasy contests — create/join P2P contests with entry fees and prize pools | Splash Sports | 🔲 Planned |
| **TalentDrop** | `apps/talent-drop` | Talent | Talent marketplace — connect businesses with creators/workers, automated payouts | FoodFluence, VeroSkills, Hey Amara | 🔲 Planned |
| **CampusDrop** | `apps/campus-drop` | Student Marketplace | Campus marketplace — buy/sell tickets, fashion, textbooks between students | SeatStock, ECloset | 🔲 Planned |
| **BidVault** | `apps/bid-vault` | Auction | Collectibles auction — bid on rare items, secure payments, seller payouts | Raremarq | 🔲 Planned |
| **SnapCash** | `apps/snap-cash` | Data Rewards | Data monetization — upload photos/videos, earn when licensed for AI training | Kled AI | 🔲 Planned |

## Whop Integrations by App

| App | Checkout | Payouts | Memberships | Chat | Forums | Courses | Notifications | Webhooks |
|-----|----------|---------|-------------|------|--------|---------|---------------|----------|
| SessionPro | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| SharpSheet | ✅ | ✅ | ✅ | ✅ | ✅ | - | ✅ | - |
| PoolPlay | ✅ | ✅ | - | - | ✅ | - | ✅ | ✅ |
| TalentDrop | ✅ | ✅ | ✅ | ✅ | - | - | ✅ | ✅ |
| CampusDrop | ✅ | ✅ | - | ✅ | - | - | ✅ | ✅ |
| BidVault | ✅ | ✅ | - | ✅ | ✅ | - | ✅ | ✅ |
| SnapCash | ✅ | ✅ | ✅ | - | - | - | ✅ | ✅ |

## Running Apps Locally

```bash
# From app directory
cd apps/session-pro && pnpm dev

# Or from root with filter
pnpm dev:session-pro
```

## Deploying to Vercel

Each app deploys as a separate Vercel project:

1. Import `whopio/whop-examples` repo
2. Set **Root Directory** to `apps/[app-name]`
3. Deploy

The `vercel.json` in each app handles build configuration.
