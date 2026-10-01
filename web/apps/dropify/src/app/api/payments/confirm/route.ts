import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { verifyOrderToken } from "@/lib/checkout-token";

export async function POST(request: NextRequest) {
  try {
    const { confirmationToken, orderToken } = (await request.json()) as {
      confirmationToken?: string;
      orderToken?: string;
    };

    if (!confirmationToken || !orderToken) {
      return NextResponse.json(
        { error: "Missing payment confirmation data" },
        { status: 400 }
      );
    }

    const order = verifyOrderToken(orderToken);
    const accountId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

    if (!accountId || accountId === "biz_xxxxx") {
      return NextResponse.json(
        { error: "Whop account is not configured" },
        { status: 503 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5007";
    const client = getWhopApi();

    const payment = await client.payments.create({
      account_id: accountId,
      plan_id: order.planId,
      confirmation_token: confirmationToken,
      return_url: `${appUrl}/checkout?planId=${encodeURIComponent(
        order.planId
      )}`,
      metadata: {
        type: "dropify_order",
        order_id: order.orderId,
        expected_total: String(order.totalPrice),
        currency: order.currency,
        items: JSON.stringify(order.items),
      },
    });

    const paymentStatus = await client.payments.retrieveStatus({
      payment_id: payment.id,
    });

    return NextResponse.json({
      paymentId: payment.id,
      status: paymentStatus.status,
      clientSecret: payment.client_secret,
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);

    const message =
      error instanceof Error ? error.message : "Payment confirmation failed";

    if (
      message.includes("order token") ||
      message.includes("Order token") ||
      message.includes("expired")
    ) {
      return NextResponse.json(
        { error: "Your checkout session is invalid or expired. Please try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "We could not confirm the payment. Please try again." },
      { status: 500 }
    );
  }
}
