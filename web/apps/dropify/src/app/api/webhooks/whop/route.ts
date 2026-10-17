import { readWhopWebhook, WebhookRequestError } from "@whop-examples/webhooks";
import { NextResponse } from "next/server";
import { reconcileWhopEvent } from "@/lib/webhook-reconciliation";

export async function POST(request: Request) {
  try {
    return await reconcileWhopEvent(await readWhopWebhook(request));
  } catch (error) {
    const status = error instanceof WebhookRequestError ? error.status : 503;
    return NextResponse.json({ error: error instanceof WebhookRequestError ? error.message : "Webhook unavailable" }, { status });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Whop webhook endpoint active", events: ["payment.succeeded", "refund.created", "refund.updated", "dispute.created", "dispute.updated"] });
}
