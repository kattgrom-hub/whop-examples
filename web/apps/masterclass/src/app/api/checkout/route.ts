import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getInstructorEntry } from "@/lib/blob/instructors-index";

// Fee rates by instructor plan tier
const FEE_RATES = {
  core: 0.08, // 8% for free tier
  pro: 0.05,  // 5% for paid tier
} as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { coachId, coachName, price, timeSlot, sessionId, productId, sessionTitle, duration } = body;

    // coachId is the connected account company ID (kept for backward compat)
    const instructorId = coachId;
    const instructorName = coachName;

    if (!instructorId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5001";

    const client = getWhopApi();

    // Look up instructor's plan tier from blob first, fall back to Whop API
    let feeRate: number = FEE_RATES.core; // Default to core (8%)
    const cachedInstructor = await getInstructorEntry(instructorId);
    if (cachedInstructor) {
      feeRate = cachedInstructor.plan === "pro" ? FEE_RATES.pro : FEE_RATES.core;
    } else {
      try {
        const instructorAccount = await client.companies.retrieve(instructorId);
        const metadata = instructorAccount.metadata as Record<string, string> | undefined;
        const instructorPlan = metadata?.plan || "core";
        feeRate = instructorPlan === "pro" ? FEE_RATES.pro : FEE_RATES.core;
      } catch (e) {
        console.warn("Could not fetch instructor account, using default fee rate:", e);
      }
    }

    // Calculate platform fee
    const classPrice = price || 0;
    const applicationFee = Math.round(classPrice * feeRate * 100) / 100; // Round to cents

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

    // Create a checkout configuration with the instructor's company
    // The membership will be created under the instructor's connected account
    const checkoutConfig = await client.checkoutConfigurations.create({
      mode: "payment",
      redirect_url: `${appUrl}/dashboard/sessions?success=true`,
      metadata: {
        instructor_id: instructorId,
        instructor_name: instructorName || "",
        time_slot: timeSlot || "",
        date: date,
        time: time,
        duration: String(duration || 60),
        title: sessionTitle || "Masterclass",
        product_id: sessionId || productId || "",
        type: "masterclass",
      },
      plan: {
        company_id: instructorId,
        ...((sessionId || productId) && { product_id: sessionId || productId }),
        currency: "usd",
        initial_price: classPrice,
        plan_type: "one_time",
        visibility: "hidden",
        release_method: "buy_now",
        // Platform fee: 8% for core instructors, 5% for pro instructors
        // Only include application fee for paid classes (Whop requires fee > 0 and < total)
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
