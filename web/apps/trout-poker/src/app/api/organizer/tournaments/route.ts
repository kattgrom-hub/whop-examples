import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function POST(request: NextRequest) {
  try {
    const { organizerId, organizerName, title, description, date, time, entryFee, maxPlayers, prizeStructure } = await request.json();
    if (!organizerId || !title || !date || !time || entryFee === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const client = getWhopApi();

    const metadata = {
      type: "fishing_tournament",
      title,
      description: description || "",
      date,
      time,
      entryFee,
      maxPlayers: maxPlayers || 0,
      organizerId,
      organizerName: organizerName || "",
      prizeStructure: prizeStructure || { "1st": 50, "2nd": 30, "3rd": 20 },
      status: "upcoming",
      results: null,
    };

    // Create product on the PLATFORM company (all funds go to platform)
    const product = await client.products.create({
      company_id: PLATFORM_COMPANY_ID,
      title,
      description: JSON.stringify(metadata),
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

    // Store plan ID in product description for checkout
    const fullMeta = { ...metadata, planId: plan.id };
    await client.products.update(product.id, {
      description: JSON.stringify(fullMeta),
    });

    return NextResponse.json({
      success: true,
      tournament: { id: product.id, ...fullMeta, currentPlayers: 0 },
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
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();
    const tournaments: Array<Record<string, unknown>> = [];

    for await (const productItem of await client.products.list({ company_id: PLATFORM_COMPANY_ID })) {
      const product = await client.products.retrieve(productItem.id);
      if (!product.description?.startsWith('{"type":"fishing_tournament"') && !product.description?.startsWith('{"type":"poker_tournament"')) continue;

      try {
        const meta = JSON.parse(product.description);
        if ((meta.organizerId || meta.commissionerId) !== organizerId) continue;

        let currentPlayers = 0;
        try {
          for await (const _m of await client.memberships.list({ product_ids: [product.id] })) {
            currentPlayers++;
          }
        } catch {
          // membership count may fail for products without plans
        }

        tournaments.push({
          id: product.id,
          ...meta,
          entryFee: meta.entryFee ?? meta.buyIn ?? 0,
          organizerId: meta.organizerId || meta.commissionerId || "",
          organizerName: meta.organizerName || meta.commissionerName || "",
          currentPlayers,
        });
      } catch {
        continue;
      }
    }

    return NextResponse.json({ tournaments });
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

    const client = getWhopApi();
    const product = await client.products.retrieve(tournamentId);

    if (!product.description?.startsWith('{"type":"fishing_tournament"') && !product.description?.startsWith('{"type":"poker_tournament"')) {
      return NextResponse.json({ error: "Not a tournament" }, { status: 404 });
    }

    const currentMeta = JSON.parse(product.description);
    const updatedMeta = { ...currentMeta, ...updates };

    await client.products.update(tournamentId, {
      title: updatedMeta.title,
      description: JSON.stringify(updatedMeta),
    });

    return NextResponse.json({ success: true, tournament: updatedMeta });
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

    const client = getWhopApi();
    const product = await client.products.retrieve(tournamentId);

    if (product.description?.startsWith('{"type":"fishing_tournament"') || product.description?.startsWith('{"type":"poker_tournament"')) {
      const meta = JSON.parse(product.description);
      meta.status = "cancelled";
      await client.products.update(tournamentId, {
        visibility: "hidden",
        description: JSON.stringify(meta),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
