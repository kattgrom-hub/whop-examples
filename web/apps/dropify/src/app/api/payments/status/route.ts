import { NextRequest, NextResponse } from "next/server";
import { verifyOrderToken } from "@/lib/checkout-token";
import {
  retrieveWhopPayment,
  retrieveWhopPaymentStatus,
} from "@/lib/whop-payments";

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
    const payment = await retrieveWhopPayment(paymentId);

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

    const status = await retrieveWhopPaymentStatus(paymentId);

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
