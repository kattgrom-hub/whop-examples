import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { persistWebhookEvent } from "@/lib/blob/webhook-events";
import { updateHostEntry } from "@/lib/blob/hosts-index";
import { removeBookedDate } from "@/lib/blob/boats-index";

// Pro plan IDs from environment
const PRO_PLAN_IDS = [
  process.env.WHOP_PLAN_PRO_MONTHLY,
  process.env.WHOP_PLAN_PRO_YEARLY,
].filter(Boolean);

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

/**
 * Update host's plan tier in their connected account metadata
 */
async function updateHostPlanTier(userId: string, plan: "core" | "pro") {
  const client = getWhopApi();

  const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
  for await (const account of accounts) {
    const meta = account.metadata as Record<string, string> | undefined;
    if (account.owner_user?.id === userId || meta?.user_id === userId) {
      await (client.companies.update as Function)(account.id, {
        metadata: { ...meta, plan },
      });
      console.log(`Updated host ${account.id} plan to: ${plan}`);
      return account.id;
    }
  }
  console.warn(`Could not find connected account for user: ${userId}`);
  return null;
}

function isProPlan(planId: string): boolean {
  return PRO_PLAN_IDS.includes(planId);
}

/**
 * Whop Webhook Handler
 *
 * Handles:
 * - payment.succeeded / payment.failed
 * - membership.went_valid — removes booked date
 * - membership.went_invalid — downgrades host plan
 * - payout.completed
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = body;
    // Normalize event name: v2 sends underscores (membership_went_valid), handler uses dots
    const event = (body.event as string).replace(/_/g, ".");

    console.log(`Received Whop webhook: ${event}`, JSON.stringify(data, null, 2));

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

      case "membership.activated": {
        const planId = data.plan?.id ?? data.plan_id;
        const userId = data.user?.id ?? data.user_id;
        const productId = data.product?.id ?? data.product_id;
        const metadata = data.metadata as Record<string, string> | undefined;

        // Host subscribed to Pro plan - update their tier
        if (planId && isProPlan(planId) && userId) {
          const hostCompanyId = await updateHostPlanTier(userId, "pro");
          if (hostCompanyId) {
            await updateHostEntry(hostCompanyId, { plan: "pro" }).catch(() => {});
          }
        }

        // Remove the booked date from available dates
        const reservationDate = metadata?.reservation_date || "";
        if (reservationDate && productId) {
          await removeBookedDate(productId, reservationDate).catch((err) =>
            console.error("Failed to remove booked date:", err)
          );
          console.log(`Boat ${productId}: removed date ${reservationDate}`);
        }

        console.log("Membership activated:", data.id);
        break;
      }

      case "membership.deactivated": {
        // Host's Pro subscription ended - downgrade to core
        const deactPlanId = data.plan?.id ?? data.plan_id;
        const deactUserId = data.user?.id ?? data.user_id;
        if (deactPlanId && isProPlan(deactPlanId) && deactUserId) {
          const deactCompanyId = await updateHostPlanTier(deactUserId, "core");
          if (deactCompanyId) {
            await updateHostEntry(deactCompanyId, { plan: "core" }).catch(() => {});
          }
        }
        console.log("Membership deactivated:", data.id);
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
