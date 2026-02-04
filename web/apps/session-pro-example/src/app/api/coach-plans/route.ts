import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Coach Plans API
 *
 * In production, this returns checkout URLs for coach subscription plans.
 * This demo version returns mock checkout URLs.
 */

export async function POST(request: NextRequest) {
  console.log("🚀 [Demo] Getting coach plan checkout URL");

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

    console.log(`📋 [Demo] Plan selected: ${plan} (${billing})`);

    const mockPlanId = `plan_${plan}_${billing}_demo`;

    return NextResponse.json({
      checkoutUrl: `/checkout/${mockPlanId}`,
    });
  } catch (error) {
    console.error("Coach plan error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
