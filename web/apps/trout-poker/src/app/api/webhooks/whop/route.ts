import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PRO_PLAN_IDS = [
  process.env.WHOP_PLAN_PRO_MONTHLY,
  process.env.WHOP_PLAN_PRO_YEARLY,
].filter(Boolean);

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

async function updateUserPlanTier(userId: string, plan: "core" | "pro") {
  const client = getWhopApi();

  const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
  for await (const account of accounts) {
    const meta = account.metadata as Record<string, string> | undefined;
    if (account.owner_user?.id === userId || meta?.user_id === userId) {
      await (client.companies.update as Function)(account.id, {
        metadata: { ...meta, plan },
      });
      console.log(`Updated user ${account.id} plan to: ${plan}`);
      return true;
    }
  }
  console.warn(`Could not find connected account for user: ${userId}`);
  return false;
}

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
          await updateUserPlanTier(data.user_id, "pro");
        }
        console.log("Membership went valid:", data);
        break;

      case "membership.went_invalid":
        if (data.plan_id && isProPlan(data.plan_id) && data.user_id) {
          await updateUserPlanTier(data.user_id, "core");
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
