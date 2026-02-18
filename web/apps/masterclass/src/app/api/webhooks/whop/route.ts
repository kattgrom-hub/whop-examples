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
    const body = await request.json();
    const { data } = body;
    // Normalize event name: v2 sends underscores, handler uses dots
    const event = (body.event as string).replace(/_/g, ".");

    console.log(`Received Whop webhook: ${event}`, JSON.stringify(data, null, 2));

    switch (event) {
      case "membership.went.valid":
      case "membership.activated": {
        const planId = data.plan?.id ?? data.plan_id;
        const userId = data.user?.id ?? data.user_id;
        const metadata = data.metadata as Record<string, string> | undefined;

        // Instructor subscribed to Pro plan — update their tier
        if (planId && isProPlan(planId) && userId) {
          // Find instructor's company by checking if the membership is under the platform company
          const companyId = data.company?.id ?? data.company_id;
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

      case "membership.went.invalid":
      case "membership.deactivated": {
        const deactPlanId = data.plan?.id ?? data.plan_id;
        const deactCompanyId = data.company?.id ?? data.company_id;

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
      "membership.went_valid",
      "membership.went_invalid",
    ],
  });
}
