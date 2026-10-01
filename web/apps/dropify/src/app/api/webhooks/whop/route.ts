import { NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

type PaymentData = {
  id?: string;
  status?: string;
  substatus?: string | null;
  total?: number | null;
  currency?: string | null;
  amount_after_fees?: number | null;
  paid_at?: string | null;
  metadata?: Record<string, unknown> | null;
  product?: { id?: string; title?: string | null } | null;
  plan?: { id?: string } | null;
  user?: { id?: string; email?: string | null } | null;
};

export async function POST(request: Request) {
  if (!process.env.WHOP_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "WHOP_WEBHOOK_SECRET is not configured" },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  let event: {
    id?: string;
    type: string;
    data: PaymentData;
  };

  try {
    const whop = getWhopApi();
    event = whop.webhooks.unwrap(rawBody, { headers }) as typeof event;
  } catch (error) {
    console.error("Whop webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event.type === "payment.succeeded") {
    const payment = event.data;

    if (!payment.id || payment.status !== "paid") {
      console.warn("Ignoring payment.succeeded with unexpected payment state", {
        eventId: event.id,
        paymentId: payment.id,
        status: payment.status,
        substatus: payment.substatus,
      });
      return NextResponse.json({ received: true });
    }

    console.info("Verified Whop payment", {
      eventId: event.id,
      paymentId: payment.id,
      status: payment.status,
      substatus: payment.substatus,
      total: payment.total,
      currency: payment.currency,
      amountAfterFees: payment.amount_after_fees,
      paidAt: payment.paid_at,
      productId: payment.product?.id,
      planId: payment.plan?.id,
      userId: payment.user?.id,
      customerEmail: payment.user?.email,
      metadata: payment.metadata,
    });

    // Fulfil the order here only after this verified webhook.
    // Recommended next step: persist payment.id as an idempotency key and
    // mark the matching Dropify order paid before triggering fulfilment.
  } else if (event.type === "payment.failed") {
    console.warn("Verified Whop payment failure", {
      eventId: event.id,
      paymentId: event.data?.id,
      status: event.data?.status,
      substatus: event.data?.substatus,
    });
  }

  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({
    status: "Whop webhook endpoint active",
    events: ["payment.succeeded", "payment.failed"],
  });
}
