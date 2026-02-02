import { NextRequest, NextResponse } from "next/server";

/**
 * Whop Webhook Handler
 *
 * This endpoint receives webhook events from Whop for:
 * - payment.succeeded - When a student pays for a session
 * - payment.failed - When a payment fails
 * - membership.created - When a subscription starts
 * - membership.cancelled - When a subscription is cancelled
 * - payout.completed - When a coach payout is processed
 *
 * TODO: Implement Whop webhook verification and handling
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

      case "membership.created":
        // TODO: Grant access to coaching bundle
        console.log("Membership created:", data);
        break;

      case "membership.cancelled":
        // TODO: Revoke access
        console.log("Membership cancelled:", data);
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
