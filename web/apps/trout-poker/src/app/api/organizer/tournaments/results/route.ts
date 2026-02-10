import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

export async function POST(request: NextRequest) {
  try {
    const { tournamentId, placements } = await request.json();
    if (!tournamentId || !placements || !Array.isArray(placements)) {
      return NextResponse.json({ error: "tournamentId and placements array required" }, { status: 400 });
    }

    const client = getWhopApi();
    const product = await client.products.retrieve(tournamentId);

    if (!product.description?.startsWith('{"type":"fishing_tournament"') && !product.description?.startsWith('{"type":"poker_tournament"')) {
      return NextResponse.json({ error: "Not a tournament" }, { status: 404 });
    }

    const meta = JSON.parse(product.description);

    if (meta.status !== "in_progress" && meta.status !== "upcoming") {
      return NextResponse.json({ error: "Tournament must be in progress to record results" }, { status: 400 });
    }

    // Count total entries for prize pool calculation
    let totalEntries = 0;
    for await (const _m of await client.memberships.list({ product_ids: [tournamentId] })) {
      totalEntries++;
    }

    const totalPrizePool = (meta.entryFee ?? meta.buyIn) * totalEntries;

    // Calculate prize amounts based on prize structure percentages
    const resultsWithPrizes = placements.map((p: { userId: string; companyId: string; username: string; place: number }) => ({
      ...p,
      prize: Math.floor(totalPrizePool * ((meta.prizeStructure[`${p.place}${getOrdinalSuffix(p.place)}`] || 0) / 100)),
    }));

    meta.status = "completed";
    meta.results = {
      placements: resultsWithPrizes,
      totalPrizePool,
      totalEntries,
      completedAt: new Date().toISOString(),
    };

    await client.products.update(tournamentId, {
      description: JSON.stringify(meta),
    });

    return NextResponse.json({ success: true, results: meta.results });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
