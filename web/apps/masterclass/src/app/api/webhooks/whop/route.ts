import { getWhopApi } from "@/lib/whop-sdk";
import { readWhopWebhook, WebhookRequestError } from "@whop-examples/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { addBooking, type BookingRecord } from "@/lib/blob/bookings-index";
import { updateInstructorEntry } from "@/lib/blob/instructors-index";

const PRO_PLAN_IDS = [
  "plan_dILTpyq7hdoFT", // Pro Monthly
  "plan_HuiQ7GzCm8jtG", // Pro Yearly
];

function isProPlan(planId: string): boolean {
  return PRO_PLAN_IDS.includes(planId);
}

export async function POST(request: NextRequest) {
  try {
    const body = await readWhopWebhook(request);
    const event = body.type;
    let data = body.data;
    if (event === "membership.activated" || event === "membership.updated") {
      // Webhook delivery order is not guaranteed. Reconcile against the API before
      // granting or revoking access instead of trusting a delayed snapshot.
      data = await getWhopApi().memberships.retrieve(data.id) as unknown as typeof data;
      if (event === "membership.activated" && !["active", "trialing"].includes(data.status)) {
        return NextResponse.json({ received: true });
      }
    }
    console.info("Whop webhook received", { eventId: body.id, type: event });

    switch (event) {
      case "membership.activated": {
        const planId = data.plan?.id ?? data.plan_id;
        const userId = data.user?.id ?? data.user_id;
        const metadata = data.metadata as Record<string, string> | undefined;

        // Instructor subscribed to Pro plan — update their tier
        if (planId && isProPlan(planId) && userId) {
          // Find instructor's company by checking if the membership is under the platform company
          const companyId = data.account?.id ?? data.company?.id ?? data.company_id;
          if (companyId) {
            await updateInstructorEntry(companyId, { plan: "pro" }).catch((err) =>
              console.error("Failed to update instructor plan in blob:", err)
            );
          }
        }

        // Masterclass booking — persist to blob storage
        if (metadata?.type === "masterclass" && userId) {
          const booking: BookingRecord = {
            id: data.id,
            userId,
            instructorId: metadata.instructor_id || "",
            instructorName: metadata.instructor_name || "",
            title: metadata.title || "Masterclass",
            date: metadata.date || "",
            time: metadata.time || "",
            timeSlot: metadata.time_slot || "",
            duration: parseInt(metadata.duration || "60", 10),
            type: "masterclass",
            productId: metadata.product_id || undefined,
            createdAt: data.created_at || new Date().toISOString(),
          };
          await addBooking(booking).catch((err) =>
            console.error("Failed to persist booking to blob:", err)
          );
          console.log(`Booking persisted to blob: ${booking.id} for user ${userId}`);
        }

        console.log("Membership activated:", data.id);
        break;
      }

      case "membership.updated": {
        // Cancellation at period end alone must not revoke paid access.
        if (!["canceled", "expired"].includes(data.status)) break;
        const deactPlanId = data.plan?.id ?? data.plan_id;
        const deactCompanyId = data.account?.id ?? data.company?.id ?? data.company_id;

        // Instructor's Pro subscription ended — downgrade to core
        if (deactPlanId && isProPlan(deactPlanId) && deactCompanyId) {
          await updateInstructorEntry(deactCompanyId, { plan: "core" }).catch((err) =>
            console.error("Failed to update instructor plan in blob:", err)
          );
        }

        console.log("Membership deactivated:", data.id);
        break;
      }

      default:
        console.log("Unhandled webhook event:", event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    if (error instanceof WebhookRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

// Whop may send GET requests to verify the endpoint
export async function GET() {
  return NextResponse.json({
    status: "Whop webhook endpoint active",
    events: [
      "membership.activated",
      "membership.updated",
    ],
  });
}
