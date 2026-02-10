import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const client = getWhopApi();
    const product = await client.products.retrieve(id);

    if (!product.description?.startsWith('{"type":"fishing_tournament"') && !product.description?.startsWith('{"type":"poker_tournament"')) {
      return NextResponse.json({ error: "Not a tournament" }, { status: 404 });
    }

    const meta = JSON.parse(product.description);

    // Count current players
    let currentPlayers = 0;
    for await (const _m of await client.memberships.list({ product_ids: [id] })) {
      currentPlayers++;
    }

    return NextResponse.json({
      tournament: {
        id: product.id,
        title: meta.title || product.title,
        description: meta.description || "",
        date: meta.date || "",
        time: meta.time || "",
        entryFee: meta.entryFee ?? meta.buyIn ?? 0,
        maxPlayers: meta.maxPlayers || 0,
        currentPlayers,
        organizerId: meta.organizerId || meta.commissionerId || "",
        organizerName: meta.organizerName || meta.commissionerName || "",
        prizeStructure: meta.prizeStructure || {},
        status: meta.status || "upcoming",
        results: meta.results || null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
