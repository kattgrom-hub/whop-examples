import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

// Pro plan IDs from environment
const PRO_PLAN_IDS = [
  process.env.WHOP_PLAN_PRO_MONTHLY,
  process.env.WHOP_PLAN_PRO_YEARLY,
].filter(Boolean);

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

/**
 * Update coach's plan tier in their connected account metadata
 */
async function updateCoachPlanTier(userId: string, plan: "core" | "pro") {
  const client = getWhopApi();

  // Find the coach's connected account by user_id in metadata
  const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
  for await (const account of accounts) {
    const meta = account.metadata as Record<string, string> | undefined;
    if (account.owner_user?.id === userId || meta?.user_id === userId) {
      // Update the plan in metadata
      await client.companies.update(account.id, {
        metadata: { ...meta, plan },
      });
      console.log(`Updated coach ${account.id} plan to: ${plan}`);
      return true;
    }
  }
  console.warn(`Could not find connected account for user: ${userId}`);
  return false;
}

/**
 * Check if a plan ID is a Pro plan
 */
function isProPlan(planId: string): boolean {
  return PRO_PLAN_IDS.includes(planId);
}

/**
 * Whop Webhook Handler
 *
 * This endpoint receives webhook events from Whop for:
 * - payment.succeeded - When a student pays for a session
 * - payment.failed - When a payment fails
 * - membership.went_valid - When a subscription becomes active
 * - membership.went_invalid - When a subscription is cancelled/expired
 * - payout.completed - When a coach payout is processed
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Verify webhook signature with Whop SDK
    // const isValid = whop.webhooks.verify(request);

    const { event, data } = body;

    console.log(`Received Whop webhook: ${event}`, data);

    switch (event) {
      case "payment.succeeded":
        // TODO: Create session booking in database
        // TODO: Send confirmation notification to student
        // TODO: Send notification to coach
        console.log("Payment succeeded:", data);
        break;

      case "payment.failed":
        // TODO: Handle failed payment
        // TODO: Notify user
        console.log("Payment failed:", data);
        break;

      case "membership.went_valid":
        // Coach subscribed to Pro plan - update their tier
        if (data.plan_id && isProPlan(data.plan_id) && data.user_id) {
          await updateCoachPlanTier(data.user_id, "pro");
        }
        console.log("Membership went valid:", data);
        break;

      case "membership.went_invalid":
        // Coach's Pro subscription ended - downgrade to core
        if (data.plan_id && isProPlan(data.plan_id) && data.user_id) {
          await updateCoachPlanTier(data.user_id, "core");
        }
        console.log("Membership went invalid:", data);
        break;

      case "payout.completed":
        // TODO: Update coach's payout history
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

// Whop may send GET requests to verify endpoint
export async function GET() {
  return NextResponse.json({
    status: "Whop webhook endpoint active",
    events: [
      "payment.succeeded",
      "payment.failed",
      "membership.created",
      "membership.cancelled",
      "payout.completed"
    ]
  });
}
