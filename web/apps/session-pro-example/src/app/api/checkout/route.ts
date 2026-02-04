import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Checkout API
 *
 * In production, this creates a checkout configuration for processing payments.
 * This demo version returns a mock plan ID for the embedded checkout.
 */

export async function POST(request: NextRequest) {
  console.log("💳 [Demo] Creating checkout configuration");

  try {
    const body = await request.json();
    const { coachId, coachName, price, timeSlot, productId, sessionId, sessionTitle } = body;

    if (!coachId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("📋 [Demo] Checkout details:");
    console.log(`   Coach: ${coachName || coachId}`);
    console.log(`   Session: ${sessionTitle || "Coaching Session"}`);
    console.log(`   Price: $${price || 0}`);
    console.log(`   Time: ${timeSlot || "TBD"}`);

    // Generate a mock plan ID
    const mockPlanId = `plan_demo_${Date.now()}`;

    return NextResponse.json({
      checkoutUrl: `/checkout/${mockPlanId}`,
      planId: mockPlanId,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to create checkout session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
