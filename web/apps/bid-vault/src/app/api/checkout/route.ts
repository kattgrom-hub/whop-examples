import { NextRequest, NextResponse } from "next/server";
import Whop from "@whop/sdk";

const client = new Whop({
  apiKey: process.env.WHOP_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auctionId, auctionTitle, price, type, sellerId } = body;

    if (!auctionId || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID not configured" },
        { status: 500 }
      );
    }

    // Create a checkout configuration with a one-time payment plan
    const checkoutConfig = await client.checkoutConfigurations.create({
      mode: "payment",
      redirect_url: `${appUrl}/dashboard/won?success=true&auction=${auctionId}`,
      metadata: {
        auction_id: auctionId,
        auction_title: auctionTitle,
        seller_id: sellerId,
        purchase_type: type, // "buy_now" or "auction_win"
      },
      plan: {
        company_id: companyId,
        currency: "usd",
        initial_price: price,
        plan_type: "one_time",
        visibility: "hidden",
        release_method: "buy_now",
      },
    });

    return NextResponse.json({
      checkoutUrl: checkoutConfig.purchase_url,
      checkoutId: checkoutConfig.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
