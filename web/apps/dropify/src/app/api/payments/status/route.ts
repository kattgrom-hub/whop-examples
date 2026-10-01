import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { verifyOrderToken } from "@/lib/checkout-token";

export async function POST(request: NextRequest) {
  try {
    const { paymentId, orderToken } = (await request.json()) as {
      paymentId?: string;
      orderToken?: string;
    };

    if (!paymentId || !orderToken) {
      return NextResponse.json(
        { error: "Missing payment verification data" },
        { status: 400 }
      );
    }

    const order = verifyOrderToken(orderToken);
    const client = getWhopApi();

    const payment = await client.payments.retrieve({
      payment_id: paymentId,
    });

    if (
      payment.metadata?.type !== "dropify_order" ||
      payment.metadata?.order_id !== order.orderId ||
      payment.plan_id !== order.planId
    ) {
      return NextResponse.json(
        { error: "Payment does not match this checkout" },
        { status: 403 }
      );
    }

    const status = await client.payments.retrieveStatus({
      payment_id: paymentId,
    });

    return NextResponse.json({
      paymentId,
      status: status.status,
    });
  } catch (error) {
    console.error("Payment status verification error:", error);
    return NextResponse.json(
      { error: "Unable to verify payment status" },
      { status: 400 }
    );
  }
}
