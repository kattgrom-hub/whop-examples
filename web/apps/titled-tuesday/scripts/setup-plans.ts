/**
 * Setup script: Creates organizer Pro plans on the platform company.
 *
 * Usage:
 *   npx tsx scripts/setup-plans.ts
 *
 * Requires: WHOP_API_KEY, NEXT_PUBLIC_WHOP_COMPANY_ID in .env
 */

import "dotenv/config";
import Whop from "@whop/sdk";

const API_KEY = process.env.WHOP_API_KEY;
const COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

if (!API_KEY || !COMPANY_ID) {
  console.error("Missing WHOP_API_KEY or NEXT_PUBLIC_WHOP_COMPANY_ID in .env");
  process.exit(1);
}

const client = new Whop({ apiKey: API_KEY });

async function main() {
  console.log("Creating organizer subscription product...");

  // Create a product for organizer subscriptions
  const product = await client.products.create({
    company_id: COMPANY_ID!,
    title: "Titled Tuesday Organizer Pro",
    description: JSON.stringify({
      type: "organizer_subscription",
      description: "Reduced platform fees for organizers",
    }),
    visibility: "visible",
  });

  console.log(`Product created: ${product.id}`);

  // Create monthly plan
  const monthlyPlan = await client.plans.create({
    company_id: COMPANY_ID!,
    product_id: product.id,
    plan_type: "renewal",
    initial_price: 19,
    renewal_price: 19,
    billing_period: 30,
    visibility: "visible",
    release_method: "buy_now",
  });

  console.log(`Monthly plan created: ${monthlyPlan.id}`);

  // Create yearly plan
  const yearlyPlan = await client.plans.create({
    company_id: COMPANY_ID!,
    product_id: product.id,
    plan_type: "renewal",
    initial_price: 150,
    renewal_price: 150,
    billing_period: 365,
    visibility: "visible",
    release_method: "buy_now",
  });

  console.log(`Yearly plan created: ${yearlyPlan.id}`);

  console.log("\nAdd these to your .env:");
  console.log(`WHOP_PLAN_PRO_MONTHLY=${monthlyPlan.id}`);
  console.log(`WHOP_PLAN_PRO_YEARLY=${yearlyPlan.id}`);
}

main().catch(console.error);
