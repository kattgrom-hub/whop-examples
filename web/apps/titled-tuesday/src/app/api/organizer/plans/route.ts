import { NextRequest, NextResponse } from "next/server";

const PRO_MONTHLY_PLAN_ID = process.env.WHOP_PLAN_PRO_MONTHLY || "";
const PRO_YEARLY_PLAN_ID = process.env.WHOP_PLAN_PRO_YEARLY || "";

export async function GET(request: NextRequest) {
  const billing = request.nextUrl.searchParams.get("billing") || "monthly";

  const planId = billing === "yearly" ? PRO_YEARLY_PLAN_ID : PRO_MONTHLY_PLAN_ID;

  if (!planId) {
    return NextResponse.json(
      { error: "Pro plan not configured" },
      { status: 500 }
    );
  }

  // Whop hosted checkout URL
  const checkoutUrl = `https://whop.com/checkout/${planId}`;

  return NextResponse.json({ checkoutUrl, planId });
}
