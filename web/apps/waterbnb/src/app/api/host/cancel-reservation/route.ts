import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { addBoatDates } from "@/lib/blob/boats-index";

export async function POST(request: NextRequest) {
  try {
    const { membershipId, boatId, date } = await request.json();
    if (!membershipId) {
      return NextResponse.json({ error: "membershipId required" }, { status: 400 });
    }

    const client = getWhopApi();

    // Cancel the membership via Whop API
    await client.memberships.cancel(membershipId);

    // Restore the booked date back to available dates
    if (boatId && date) {
      await addBoatDates(boatId, [date]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to cancel reservation: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
