import { NextRequest, NextResponse } from "next/server";
import { setUserPlanTier } from "@/lib/db";

const PRO_PLAN_IDS = [
  process.env.WHOP_PLAN_PRO_MONTHLY,
  process.env.WHOP_PLAN_PRO_YEARLY,
].filter(Boolean);

function isProPlan(planId: string): boolean {
  return PRO_PLAN_IDS.includes(planId);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    console.log(`Received Whop webhook: ${event}`, data);

    switch (event) {
      case "payment.succeeded":
        console.log("Payment succeeded:", data);
        break;

      case "payment.failed":
        console.log("Payment failed:", data);
        break;

      case "membership.went_valid":
        if (data.plan_id && isProPlan(data.plan_id) && data.user_id) {
          await setUserPlanTier(data.user_id, "pro");
          console.log(`Updated user ${data.user_id} plan to: pro`);
        }
        console.log("Membership went valid:", data);
        break;

      case "membership.went_invalid":
        if (data.plan_id && isProPlan(data.plan_id) && data.user_id) {
          await setUserPlanTier(data.user_id, "core");
          console.log(`Updated user ${data.user_id} plan to: core`);
        }
        console.log("Membership went invalid:", data);
        break;

      case "payout.completed":
        console.log("Payout completed:", data);
        break;

      default:
        console.log("Unhandled webhook event:", event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Whop webhook endpoint active",
    events: [
      "payment.succeeded",
      "payment.failed",
      "membership.went_valid",
      "membership.went_invalid",
      "payout.completed"
    ]
  });
}
