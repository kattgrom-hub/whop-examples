import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coachId, coachName, price, timeSlot, productId, sessionId, sessionTitle } = body;

    // coachId is now the connected account company ID
    if (!coachId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

    // Get the Whop API client
    const client = getWhopApi();

    // Parse date and time from timeSlot if available
    let date = "";
    let time = "";
    if (timeSlot) {
      const parts = timeSlot.split(" ");
      if (parts.length >= 2) {
        date = parts[0];
        time = parts[1];
      }
    }

    // Create a checkout configuration with the coach's company
    // The membership will be created under the coach's connected account
    const checkoutConfig = await client.checkoutConfigurations.create({
      mode: "payment",
      redirect_url: `${appUrl}/dashboard/sessions?success=true&coach=${coachId}`,
      metadata: {
        coach_id: coachId,
        coach_name: coachName || "",
        time_slot: timeSlot || "",
        date: date,
        time: time,
        title: sessionTitle || "Coaching Session",
        session_plan_id: sessionId || "",
        type: "coaching_session",
      },
      plan: {
        // Use the coach's connected account company ID
        company_id: coachId,
        // Include product_id if we have one
        ...(productId && { product_id: productId }),
        currency: "usd",
        initial_price: price || 0,
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
    // Log full error details
    if (error && typeof error === 'object') {
      console.error("Error details:", JSON.stringify(error, null, 2));
    }
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to create checkout session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
