import { NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { listTournaments } from "@/lib/db";

export async function GET() {
  try {
    const tournaments = await listTournaments();
    const client = getWhopApi();

    // Enrich with live membership counts from Whop
    const enriched = await Promise.all(
      tournaments.map(async (t) => {
        let currentPlayers = 0;
        try {
          for await (const _m of await client.memberships.list({ product_ids: [t.id] })) {
            currentPlayers++;
          }
        } catch {
          // membership count may fail for products without plans
        }

        return {
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
        };
      })
    );

    return NextResponse.json({ tournaments: enriched });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch tournaments: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
