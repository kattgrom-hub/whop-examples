import { NextRequest, NextResponse } from "next/server";

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
        console.log("Membership went valid:", data);
        break;

      case "membership.went_invalid":
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
