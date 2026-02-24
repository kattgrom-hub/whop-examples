import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    if (!companyId || companyId === "biz_xxxxx") {
      return NextResponse.json(
        {
          error:
            "Whop Company ID not configured. Copy .env.example to .env.local and add your credentials from the Whop Developer Dashboard (https://whop.com/developer).",
        },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5007";
    const client = getWhopApi();

    // Calculate total price from cart items
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Build a summary of items for metadata
    const itemsSummary = items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(", ");

    const checkoutConfig = await client.checkoutConfigurations.create({
      mode: "payment",
      redirect_url: `${appUrl}/checkout?status=success`,
      metadata: {
        items: JSON.stringify(items),
        items_summary: itemsSummary,
        type: "dropify_order",
      },
      plan: {
        company_id: companyId,
        currency: "usd",
        initial_price: totalPrice,
        plan_type: "one_time",
        visibility: "hidden",
        release_method: "buy_now",
      },
    });

    const planId = checkoutConfig.plan?.id;

    if (!planId) {
      return NextResponse.json(
        { error: "Failed to create plan for checkout" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      planId,
      checkoutUrl: checkoutConfig.purchase_url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to create checkout: ${errorMessage}` },
      { status: 500 }
    );
  }
}
