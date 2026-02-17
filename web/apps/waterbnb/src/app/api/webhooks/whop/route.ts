import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { persistWebhookEvent } from "@/lib/blob/webhook-events";
import { updateHostEntry, getUserIdByCompanyId } from "@/lib/blob/hosts-index";
import { removeBookedDate } from "@/lib/blob/boats-index";
import { addChatEntry } from "@/lib/blob/chats-index";

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
 * - membership.went_valid — removes booked date, creates DM channel
 * - membership.went_invalid — downgrades host plan
 * - payout.completed
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
        // Host subscribed to Pro plan - update their tier
        if (data.plan_id && isProPlan(data.plan_id) && data.user_id) {
          const companyId = await updateHostPlanTier(data.user_id, "pro");
          if (companyId) {
            await updateHostEntry(companyId, { plan: "pro" }).catch(() => {});
          }
        }

        // Boat was reserved - remove the booked date
        const metadata = data.metadata as Record<string, string> | undefined;
        if (metadata?.type === "waterbnb" && data.product_id) {
          const reservationDate = metadata.reservation_date || "";

          // Remove the booked date from available dates
          if (reservationDate) {
            await removeBookedDate(data.product_id, reservationDate).catch((err) =>
              console.error("Failed to remove booked date:", err)
            );
            console.log(`Boat ${data.product_id}: removed date ${reservationDate}`);
          }

          // Create DM channel between host and guest
          try {
            const client = getWhopApi();
            const hostCompanyId = data.company_id as string;
            const guestUserId = data.user_id as string;

            // Look up host's userId from hosts-index
            const hostUserId = await getUserIdByCompanyId(hostCompanyId);

            if (hostUserId && guestUserId) {
              const dmChannel = await client.dmChannels.create({
                with_user_ids: [hostUserId, guestUserId],
                company_id: PLATFORM_COMPANY_ID,
                custom_name: `Waterbnb: ${metadata.title || "Boat Trip"}`,
              });

              // Persist to chats index
              await addChatEntry({
                channelId: dmChannel.id,
                hostUserId,
                guestUserId,
                membershipId: data.id as string,
                boatTitle: metadata.title || "Boat Trip",
                createdAt: new Date().toISOString(),
              });

              console.log(`DM channel created: ${dmChannel.id} for ${metadata.title}`);
            }
          } catch (chatErr) {
            console.error("Failed to create DM channel:", chatErr);
          }
        }

        console.log("Membership went valid:", data.id);
        break;
      }

      case "membership.went_invalid": {
        // Host's Pro subscription ended - downgrade to core
        if (data.plan_id && isProPlan(data.plan_id) && data.user_id) {
          const companyId = await updateHostPlanTier(data.user_id, "core");
          if (companyId) {
            await updateHostEntry(companyId, { plan: "core" }).catch(() => {});
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
