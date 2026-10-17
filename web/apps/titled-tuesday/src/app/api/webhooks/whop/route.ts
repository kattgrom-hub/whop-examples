import { readWhopWebhook, WebhookRequestError } from "@whop-examples/webhooks";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await readWhopWebhook(request);
    const { type: event, data } = body;
    console.info("Whop webhook received", { eventId: body.id, type: event });

    switch (event) {
      case "payment.succeeded":
        console.log("Payment succeeded:", data.id);
        break;

      case "payment.failed":
        console.log("Payment failed:", data.id);
        break;

      case "membership.activated":
        console.log("Membership went valid:", data.id);
        break;

      case "membership.updated":
        console.log("Membership updated:", data.id);
        break;

      case "payout.updated":
        console.log("Payout updated:", data.id);
        break;

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

export async function GET() {
  return NextResponse.json({
    status: "Whop webhook endpoint active",
    events: [
      "payment.succeeded",
      "payment.failed",
      "membership.activated",
      "membership.updated",
      "payout.updated"
    ]
  });
}
