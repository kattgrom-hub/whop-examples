import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coachId, coachName, price, timeSlot } = body;

    if (!coachId || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

    if (!companyId) {
      return NextResponse.json(
        { error: "Company ID not configured" },
        { status: 500 }
      );
    }

    // Get the Whop API client
    const client = getWhopApi();

    // Build checkout config - redirect_url requires HTTPS, so only include in production
    const isProduction = appUrl.startsWith("https://");

    // Create a checkout configuration with a one-time payment plan
    const checkoutConfig = await client.checkoutConfigurations.create({
      mode: "payment",
      // Only include redirect_url if we have an HTTPS URL (required by Whop)
      ...(isProduction && {
        redirect_url: `${appUrl}/dashboard/sessions?success=true&coach=${coachId}`,
      }),
      metadata: {
        coach_id: coachId,
        coach_name: coachName,
        time_slot: timeSlot,
        type: "coaching_session",
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

    // The checkout configuration includes the created plan with its ID
    // We can use this plan ID with the embedded checkout component
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
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
