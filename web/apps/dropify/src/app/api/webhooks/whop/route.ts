import { readWhopWebhook, WebhookRequestError } from "@whop-examples/webhooks";
import { NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getWhopCompanyId, getWhopEnvironment } from "@/lib/checkout-config";
import { getOrder, recordVerifiedPayment, holdOrder } from "@/lib/order-store";
import { validateOrderPayment, validateOrderIdentity, type OrderPayment } from "@/lib/payment-validation";

export async function POST(request: Request) {
  let event;
  try { event = await readWhopWebhook(request); }
  catch (error) {
    const status = error instanceof WebhookRequestError ? error.status : 500;
    return NextResponse.json({ error: error instanceof WebhookRequestError ? error.message : "Webhook unavailable" }, { status });
  }
  let client;
  try { client = getWhopApi(); } catch { return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 }); }
  const adverse = ["refund.created", "refund.updated", "dispute.created", "dispute.updated"].includes(event.type);
  if (event.type !== "payment.succeeded" && !adverse) return NextResponse.json({ received: true });
  const source = adverse ? event.data?.payment : event.data;
  if (source?.metadata?.type !== "dropify_order") return NextResponse.json({ received: true });
  if (!event.id || !source?.id || !/^pay_[a-zA-Z0-9]+$/.test(source.id)) {
    return NextResponse.json({ error: "Malformed payment event" }, { status: 400 });
  }
  try {
    const orderId = source.metadata?.order_id;
    if (typeof orderId !== "string") throw new Error("Missing order reference");
    const order = await getOrder(orderId);
    if (!order || order.environment !== getWhopEnvironment() || order.company_id !== getWhopCompanyId()) {
      throw new Error("Order environment mismatch");
    }
    // Fetch current authoritative state too: a delayed success event must not dispatch a refunded order.
    const payment = await client.payments.retrieve(source.id) as unknown as OrderPayment;
    validateOrderIdentity(order, payment);
    if (adverse || payment.substatus !== "succeeded" || payment.status !== "paid") {
      await holdOrder(order.id);
      return NextResponse.json({ received: true });
    }
    const addressComplete = validateOrderPayment(order, payment);
    const result = await recordVerifiedPayment(order.id, { paymentId: payment.id, eventId: event.id,
      shippingAddress: addressComplete ? payment.shipping_address : null, customerEmail: payment.user?.email || null });
    console.info("Dropify payment recorded", { eventId: event.id, paymentId: payment.id, result });
    return NextResponse.json({ received: true });
  } catch {
    // Preserve retries on database/API/reconciliation failures; never acknowledge a lost order.
    console.error("Dropify payment reconciliation requires attention", { eventId: event.id, paymentId: event.data.id });
    return NextResponse.json({ error: "Payment reconciliation unavailable" }, { status: 503 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "Whop webhook endpoint active", events: ["payment.succeeded", "refund.created", "refund.updated", "dispute.created", "dispute.updated"] });
}
