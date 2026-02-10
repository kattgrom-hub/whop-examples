import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { createTournament, listTournamentsByOrganizer, getTournament, updateTournament, cancelTournament } from "@/lib/db";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function POST(request: NextRequest) {
  try {
    const { organizerId, organizerName, title, description, date, time, entryFee, maxPlayers, prizeStructure } = await request.json();
    if (!organizerId || !title || !date || !time || entryFee === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const client = getWhopApi();

    // Create product on the PLATFORM company (needed for Whop checkout/memberships)
    // Whop requires unique product titles per company, so append a short ID
    const suffix = crypto.randomUUID().slice(0, 8);
    const product = await client.products.create({
      company_id: PLATFORM_COMPANY_ID,
      title: `${title} [${suffix}]`,
      description: title,
      visibility: "visible",
    });

    // Create a one-time plan for the entry fee
    const plan = await client.plans.create({
      company_id: PLATFORM_COMPANY_ID,
      product_id: product.id,
      plan_type: "one_time",
      initial_price: entryFee,
      visibility: "visible",
      release_method: "buy_now",
    });

    // Store tournament metadata in Postgres
    const tournament = await createTournament({
      id: product.id,
      whop_plan_id: plan.id,
      title,
      description: description || "",
      date,
      time,
      entry_fee: entryFee,
      max_players: maxPlayers || 0,
      organizer_id: organizerId,
      organizer_name: organizerName || "",
      prize_structure: prizeStructure || { "1st": 50, "2nd": 30, "3rd": 20 },
    });

    return NextResponse.json({
      success: true,
      tournament: {
        id: tournament.id,
        title: tournament.title,
        description: tournament.description,
        date: tournament.date,
        time: tournament.time,
        entryFee: tournament.entry_fee,
        maxPlayers: tournament.max_players,
        organizerId: tournament.organizer_id,
        organizerName: tournament.organizer_name,
        prizeStructure: tournament.prize_structure,
        status: tournament.status,
        results: null,
        currentPlayers: 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create tournament: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const organizerId = request.nextUrl.searchParams.get("organizerId");
  if (!organizerId) return NextResponse.json({ error: "organizerId required" }, { status: 400 });

  try {
    const tournaments = await listTournamentsByOrganizer(organizerId);
    const client = getWhopApi();

    const enriched = await Promise.all(
      tournaments.map(async (t) => {
        let currentPlayers = 0;
        try {
          for await (const _m of await client.memberships.list({ product_ids: [t.id] })) {
            currentPlayers++;
          }
        } catch {
          // membership count may fail
        }

        return {
          id: t.id,
          title: t.title,
          description: t.description,
          date: t.date,
          time: t.time,
          entryFee: t.entry_fee,
          maxPlayers: t.max_players,
          organizerId: t.organizer_id,
          organizerName: t.organizer_name,
          prizeStructure: t.prize_structure,
          status: t.status,
          results: t.results,
          currentPlayers,
        };
      })
    );

    return NextResponse.json({ tournaments: enriched });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { tournamentId, ...updates } = await request.json();
    if (!tournamentId) return NextResponse.json({ error: "tournamentId required" }, { status: 400 });

    const existing = await getTournament(tournamentId);
    if (!existing) {
      return NextResponse.json({ error: "Not a tournament" }, { status: 404 });
    }

    // Map camelCase from client to snake_case for DB
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.date !== undefined) dbUpdates.date = updates.date;
    if (updates.time !== undefined) dbUpdates.time = updates.time;
    if (updates.entryFee !== undefined) dbUpdates.entry_fee = updates.entryFee;
    if (updates.maxPlayers !== undefined) dbUpdates.max_players = updates.maxPlayers;
    if (updates.prizeStructure !== undefined) dbUpdates.prize_structure = updates.prizeStructure;
    if (updates.status !== undefined) dbUpdates.status = updates.status;

    const updated = await updateTournament(tournamentId, dbUpdates as Parameters<typeof updateTournament>[1]);

    // Also update the Whop product title if changed
    if (updates.title) {
      try {
        const client = getWhopApi();
        await client.products.update(tournamentId, { title: updates.title });
      } catch { /* non-critical */ }
    }

    return NextResponse.json({ success: true, tournament: updated });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const tournamentId = new URL(request.url).searchParams.get("tournamentId");
    if (!tournamentId) return NextResponse.json({ error: "tournamentId required" }, { status: 400 });

    await cancelTournament(tournamentId);

    // Also hide the Whop product
    try {
      const client = getWhopApi();
      await client.products.update(tournamentId, { visibility: "hidden" });
    } catch { /* non-critical */ }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
