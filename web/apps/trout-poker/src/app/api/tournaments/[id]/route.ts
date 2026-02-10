import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getTournament } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const t = await getTournament(id);
    if (!t) {
      return NextResponse.json({ error: "Not a tournament" }, { status: 404 });
    }

    // Count current players from Whop memberships
    const client = getWhopApi();
    let currentPlayers = 0;
    for await (const _m of await client.memberships.list({ product_ids: [id] })) {
      currentPlayers++;
    }

    return NextResponse.json({
      tournament: {
        id: t.id,
        title: t.title,
        description: t.description || "",
        date: t.date,
        time: t.time,
        entryFee: t.entry_fee,
        maxPlayers: t.max_players,
        currentPlayers,
        organizerId: t.organizer_id,
        organizerName: t.organizer_name,
        prizeStructure: t.prize_structure,
        status: t.status,
        results: t.results || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
