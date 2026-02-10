import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { persistWebhookEvent } from "@/lib/blob/webhook-events";
import { updateInstructorEntry } from "@/lib/blob/instructors-index";

// Pro plan IDs from environment
const PRO_PLAN_IDS = [
  process.env.WHOP_PLAN_PRO_MONTHLY,
  process.env.WHOP_PLAN_PRO_YEARLY,
].filter(Boolean);

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

/**
 * Update instructor's plan tier in their connected account metadata
 */
async function updateInstructorPlanTier(userId: string, plan: "core" | "pro") {
  const client = getWhopApi();

  // Find the instructor's connected account by user_id in metadata
  const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
  for await (const account of accounts) {
    const meta = account.metadata as Record<string, string> | undefined;
    if (account.owner_user?.id === userId || meta?.user_id === userId) {
      await (client.companies.update as Function)(account.id, {
        metadata: { ...meta, plan },
      });
      console.log(`Updated instructor ${account.id} plan to: ${plan}`);
      return account.id;
    }
  }
  console.warn(`Could not find connected account for user: ${userId}`);
  return null;
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
 * - payment.succeeded - When a learner pays for a class
 * - payment.failed - When a payment fails
 * - membership.went_valid - When a subscription becomes active
 * - membership.went_invalid - When a subscription is cancelled/expired
 * - payout.completed - When an instructor payout is processed
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { event, data } = body;

    console.log(`Received Whop webhook: ${event}`, data);

    switch (event) {
      case "payment.succeeded": {
        await persistWebhookEvent(event, data);
        console.log("Payment succeeded (persisted):", data.id);
        break;
      }

      case "payment.failed": {
        await persistWebhookEvent(event, data);
        console.log("Payment failed (persisted):", data.id);
        break;
      }

      case "membership.went_valid": {
        // Instructor subscribed to Pro plan - update their tier
        if (data.plan_id && isProPlan(data.plan_id) && data.user_id) {
          const companyId = await updateInstructorPlanTier(data.user_id, "pro");
          if (companyId) {
            await updateInstructorEntry(companyId, { plan: "pro" }).catch(() => {});
          }
        }
        console.log("Membership went valid:", data.id);
        break;
      }

      case "membership.went_invalid": {
        // Instructor's Pro subscription ended - downgrade to core
        if (data.plan_id && isProPlan(data.plan_id) && data.user_id) {
          const companyId = await updateInstructorPlanTier(data.user_id, "core");
          if (companyId) {
            await updateInstructorEntry(companyId, { plan: "core" }).catch(() => {});
          }
        }
        console.log("Membership went invalid:", data.id);
        break;
      }

      case "payout.completed": {
        await persistWebhookEvent(event, data);
        console.log("Payout completed (persisted):", data.id);
        break;
      }

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
      "membership.went_valid",
      "membership.went_invalid",
      "payout.completed"
    ]
  });
}
