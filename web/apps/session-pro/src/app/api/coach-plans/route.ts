import { NextRequest, NextResponse } from "next/server";

/**
 * Coach plan checkout links - all plans go to Whop hosted checkout
 */
const PLAN_IDS = {
  core: process.env.WHOP_PLAN_CORE || "",
  pro_monthly: process.env.WHOP_PLAN_PRO_MONTHLY || "",
  pro_yearly: process.env.WHOP_PLAN_PRO_YEARLY || "",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, billing } = body; // plan: 'core' | 'pro', billing: 'monthly' | 'yearly'

    if (!plan || !billing) {
      return NextResponse.json(
        { error: "Missing plan or billing period" },
        { status: 400 }
      );
    }

    // Validate plan and billing
    if (!['core', 'pro'].includes(plan) || !['monthly', 'yearly'].includes(billing)) {
      return NextResponse.json(
        { error: "Invalid plan or billing period" },
        { status: 400 }
      );
    }

    // Get the plan ID - Core is the same for monthly/yearly (it's free)
    const planKey = plan === "core" ? "core" : `pro_${billing}` as keyof typeof PLAN_IDS;
    const planId = PLAN_IDS[planKey];

    if (!planId) {
      return NextResponse.json(
        { error: `Plan not configured. Run: npx tsx scripts/setup-plans.ts` },
        { status: 500 }
      );
    }

    // Return the Whop hosted checkout URL
    return NextResponse.json({
      checkoutUrl: `https://whop.com/checkout/${planId}`,
    });
  } catch (error) {
    console.error("Coach plan error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
