import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getTournament } from "@/lib/db";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function POST(request: NextRequest) {
  try {
    const { tournamentId } = await request.json();
    if (!tournamentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5003";
    const client = getWhopApi();

    // Fetch tournament from DB
    const tournament = await getTournament(tournamentId);
    if (!tournament) {
      return NextResponse.json({ error: "Not a tournament" }, { status: 400 });
    }

    if (tournament.status !== "upcoming") {
      return NextResponse.json({ error: "Tournament is not accepting entries" }, { status: 400 });
    }

    if (tournament.max_players > 0) {
      let currentPlayers = 0;
      try {
        for await (const _m of await client.memberships.list({ product_ids: [tournamentId] })) {
          currentPlayers++;
        }
      } catch {
        // membership count may fail
      }
      if (currentPlayers >= tournament.max_players) {
        return NextResponse.json({ error: "Tournament is full" }, { status: 400 });
      }
    }

    // Create checkout — same pattern as session-pro
    const checkoutConfig = await client.checkoutConfigurations.create({
      mode: "payment",
      redirect_url: `${appUrl}/tournaments/${tournamentId}?entered=true`,
      metadata: {
        organizer_id: tournament.organizer_id,
        tournament_id: tournamentId,
        type: "tournament_entry",
      },
      plan: {
        company_id: PLATFORM_COMPANY_ID,
        product_id: tournamentId,
        currency: "usd",
        initial_price: tournament.entry_fee,
        plan_type: "one_time",
        visibility: "hidden",
        release_method: "buy_now",
      },
    });

    const planId = checkoutConfig.plan?.id;
    if (!planId) {
      return NextResponse.json({ error: "Failed to create plan for checkout" }, { status: 500 });
    }

    return NextResponse.json({
      checkoutUrl: checkoutConfig.purchase_url,
      planId,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    if (error && typeof error === "object") {
      console.error("Error details:", JSON.stringify(error, null, 2));
    }
    return NextResponse.json(
      { error: `Failed to create checkout: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
