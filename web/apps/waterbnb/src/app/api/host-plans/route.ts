import { NextRequest, NextResponse } from "next/server";

/**
 * Host plan checkout links - all plans go to Whop hosted checkout
 */
const PLAN_IDS = {
  core: "plan_jkXUdgZw1MAeL",
  pro_monthly: "plan_dILTpyq7hdoFT",
  pro_yearly: "plan_HuiQ7GzCm8jtG",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, billing } = body;

    if (!plan || !billing) {
      return NextResponse.json(
        { error: "Missing plan or billing period" },
        { status: 400 }
      );
    }

    if (!['core', 'pro'].includes(plan) || !['monthly', 'yearly'].includes(billing)) {
      return NextResponse.json(
        { error: "Invalid plan or billing period" },
        { status: 400 }
      );
    }

    const planKey = plan === "core" ? "core" : `pro_${billing}` as keyof typeof PLAN_IDS;
    const planId = PLAN_IDS[planKey];

    if (!planId) {
      return NextResponse.json(
        { error: `Plan not configured. Run: npx tsx scripts/setup-plans.ts` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkoutUrl: `https://whop.com/checkout/${planId}`,
    });
  } catch (error) {
    console.error("Host plan error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
