import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Webhook Handler
 *
 * In production, this endpoint receives real-time webhook events:
 * - payment.succeeded - When a student pays for a session
 * - payment.failed - When a payment fails
 * - membership.created - When a subscription starts
 * - membership.cancelled - When a subscription is cancelled
 * - payout.completed - When a coach payout is processed
 *
 * This demo version logs received webhooks and returns success.
 */

export async function POST(request: NextRequest) {
  console.log("📬 [Demo] Webhook received");

  try {
    const body = await request.json();
    const { event, data } = body;

    console.log(`🔔 [Demo] Webhook event: ${event || "unknown"}`);
    console.log("📦 [Demo] Webhook data:", JSON.stringify(data, null, 2));

    switch (event) {
      case "payment.succeeded":
        console.log("✅ [Demo] Payment succeeded - would create session booking");
        break;

      case "payment.failed":
        console.log("❌ [Demo] Payment failed - would notify user");
        break;

      case "membership.created":
        console.log("🎉 [Demo] Membership created - would grant access");
        break;

      case "membership.cancelled":
        console.log("👋 [Demo] Membership cancelled - would revoke access");
        break;

      case "payout.completed":
        console.log("💰 [Demo] Payout completed - would update coach history");
        break;

      default:
        console.log("❓ [Demo] Unknown event type");
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

// Verify endpoint is active
export async function GET() {
  return NextResponse.json({
    status: "Webhook endpoint active (demo mode)",
    events: [
      "payment.succeeded",
      "payment.failed",
      "membership.created",
      "membership.cancelled",
      "payout.completed",
    ],
  });
}
