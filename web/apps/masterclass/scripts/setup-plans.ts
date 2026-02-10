/**
 * Setup script to create Masterclass coach plans via Whop API
 *
 * Run with: npx tsx scripts/setup-plans.ts
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import Whop from "@whop/sdk";

const COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
const API_KEY = process.env.WHOP_API_KEY;

if (!COMPANY_ID || !API_KEY) {
  console.error("Missing NEXT_PUBLIC_WHOP_COMPANY_ID or WHOP_API_KEY in environment");
  process.exit(1);
}

const client = new Whop({ apiKey: API_KEY });

async function findOrCreateProduct() {
  // Check if product already exists
  const products = await client.products.list({ company_id: COMPANY_ID! });

  for await (const product of products) {
    if (product.title === "Masterclass Coach Plans") {
      console.log("Found existing product:", product.id);
      return product.id;
    }
  }

  // Create new product
  console.log("Creating new product...");
  const product = await client.products.create({
    company_id: COMPANY_ID!,
    title: "Masterclass Coach Plans",
    description: "Coaching platform subscription plans",
    visibility: "visible",
  });

  console.log("Created product:", product.id);
  return product.id;
}

async function createPlans(productId: string) {
  const plans: Array<{
    title: string;
    description: string;
    initial_price: number;
    renewal_price?: number;
    billing_period?: number;
    plan_type: "renewal" | "one_time";
    internal_notes: string;
  }> = [
    {
      title: "Core Plan (Free)",
      description: "Everything you need to get started. Free to join + 8% platform fee on earnings.",
      initial_price: 0,
      plan_type: "one_time",
      internal_notes: "core",
    },
    {
      title: "Pro Monthly",
      description: "Lower fees for high-volume coaches. $19/month + 5% platform fee.",
      initial_price: 19,
      renewal_price: 19,
      billing_period: 30,
      plan_type: "renewal",
      internal_notes: "pro_monthly",
    },
    {
      title: "Pro Yearly",
      description: "Lower fees for high-volume coaches. $150/year ($12.50/month) + 5% platform fee.",
      initial_price: 150,
      renewal_price: 150,
      billing_period: 365,
      plan_type: "renewal",
      internal_notes: "pro_yearly",
    },
  ];

  console.log("\nCreating plans...\n");

  const createdPlans: Record<string, string> = {};

  for (const planData of plans) {
    // Check if plan already exists
    const existingPlans = await client.plans.list({
      company_id: COMPANY_ID!,
      product_ids: [productId],
    });

    let existingPlan = null;
    for await (const plan of existingPlans) {
      if (plan.internal_notes === planData.internal_notes) {
        existingPlan = plan;
        break;
      }
    }

    if (existingPlan) {
      console.log(`Plan "${planData.title}" already exists: ${existingPlan.id}`);
      console.log(`  Purchase URL: ${existingPlan.purchase_url}`);
      createdPlans[planData.internal_notes] = existingPlan.id;
      continue;
    }

    // Create plan
    const plan = await client.plans.create({
      company_id: COMPANY_ID!,
      product_id: productId,
      title: planData.title,
      description: planData.description,
      plan_type: planData.plan_type,
      initial_price: planData.initial_price,
      ...(planData.renewal_price !== undefined && { renewal_price: planData.renewal_price }),
      ...(planData.billing_period !== undefined && { billing_period: planData.billing_period }),
      currency: "usd",
      visibility: "visible",
      internal_notes: planData.internal_notes,
    });

    console.log(`Created plan "${planData.title}": ${plan.id}`);
    console.log(`  Purchase URL: ${plan.purchase_url}`);
    createdPlans[planData.internal_notes] = plan.id;
  }

  return createdPlans;
}

async function main() {
  console.log("Setting up Masterclass coach plans...\n");
  console.log("Company ID:", COMPANY_ID);
  console.log("");

  try {
    const productId = await findOrCreateProduct();
    const plans = await createPlans(productId);

    console.log("\n========================================");
    console.log("Add these to your .env.local:");
    console.log("========================================\n");
    console.log(`WHOP_PLAN_CORE=${plans.core}`);
    console.log(`WHOP_PLAN_PRO_MONTHLY=${plans.pro_monthly}`);
    console.log(`WHOP_PLAN_PRO_YEARLY=${plans.pro_yearly}`);
    console.log("");
  } catch (error) {
    console.error("Error setting up plans:", error);
    process.exit(1);
  }
}

main();
