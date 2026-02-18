import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getHostEntry } from "@/lib/blob/hosts-index";

// Fee rates by host plan tier
const FEE_RATES = {
  core: 0.08, // 8% for free tier
  pro: 0.05,  // 5% for paid tier
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hostId, hostName, price, reservationDate, productId: rawProductId, boatId, boatTitle, location } = body;
    const productId = rawProductId || boatId;

    if (!hostId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5002";

    const client = getWhopApi();

    // Look up host's plan tier from blob first, fall back to Whop API
    let feeRate: number = FEE_RATES.core;
    const cachedHost = await getHostEntry(hostId);
    if (cachedHost) {
      feeRate = cachedHost.plan === "pro" ? FEE_RATES.pro : FEE_RATES.core;
    } else {
      try {
        const hostAccount = await client.companies.retrieve(hostId);
        const metadata = hostAccount.metadata as Record<string, string> | undefined;
        const hostPlan = metadata?.plan || "core";
        feeRate = hostPlan === "pro" ? FEE_RATES.pro : FEE_RATES.core;
      } catch (e) {
        console.warn("Could not fetch host account, using default fee rate:", e);
      }
    }

    // Calculate platform fee
    const tripPrice = price || 0;
    const applicationFee = Math.round(tripPrice * feeRate * 100) / 100;

    // Create a checkout configuration with the host's company
    const checkoutConfig = await client.checkoutConfigurations.create({
      mode: "payment",
      redirect_url: `${appUrl}/dashboard/listings?success=true&host=${hostId}`,
      metadata: {
        host_id: hostId,
        host_name: hostName || "",
        reservation_date: reservationDate || "",
        title: boatTitle || "Waterbnb",
        boat_plan_id: boatId || "",
        location: location || "",
        type: "waterbnb",
      },
      plan: {
        company_id: hostId,
        ...(productId && { product_id: productId }),
        currency: "usd",
        initial_price: tripPrice,
        plan_type: "one_time",
        visibility: "hidden",
        release_method: "buy_now",
        ...(applicationFee > 0 && { application_fee_amount: applicationFee }),
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
      checkoutUrl: checkoutConfig.purchase_url,
      planId: planId,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    if (error && typeof error === 'object') {
      console.error("Error details:", JSON.stringify(error, null, 2));
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to create checkout: ${errorMessage}` },
      { status: 500 }
    );
  }
}
