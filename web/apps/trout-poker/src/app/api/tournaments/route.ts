import { NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function GET() {
  if (!PLATFORM_COMPANY_ID) {
    return NextResponse.json({ error: "Platform not configured" }, { status: 500 });
  }

  try {
    const client = getWhopApi();
    const tournaments: Array<Record<string, unknown>> = [];

    for await (const productItem of await client.products.list({ company_id: PLATFORM_COMPANY_ID })) {
      const product = await client.products.retrieve(productItem.id);
      if (!product.description?.startsWith('{"type":"fishing_tournament"') && !product.description?.startsWith('{"type":"poker_tournament"')) continue;

      try {
        const meta = JSON.parse(product.description);
        if (meta.status === "cancelled") continue;

        // Count current players via memberships
        let currentPlayers = 0;
        try {
          for await (const _m of await client.memberships.list({ product_ids: [product.id] })) {
            currentPlayers++;
          }
        } catch (membershipErr) {
          console.error("Membership count failed for", product.id, membershipErr);
        }

        tournaments.push({
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
        });
      } catch {
        continue;
      }
    }

    // Sort: upcoming first, then by date
    tournaments.sort((a, b) => {
      if (a.status === "upcoming" && b.status !== "upcoming") return -1;
      if (a.status !== "upcoming" && b.status === "upcoming") return 1;
      return new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime();
    });

    return NextResponse.json({ tournaments });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch tournaments: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
