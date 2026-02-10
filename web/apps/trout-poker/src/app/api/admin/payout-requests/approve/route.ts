import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";
const REQUESTS_PRODUCT_TITLE = "__trout_tournaments_payout_requests__";

export async function POST(request: NextRequest) {
  try {
    const { requestId, adminUserId } = await request.json();
    if (!requestId) return NextResponse.json({ error: "requestId required" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const client = getWhopApi();

    // Find requests product
    let requestsProductId: string | null = null;
    for await (const product of await client.products.list({ company_id: PLATFORM_COMPANY_ID })) {
      if (product.title === REQUESTS_PRODUCT_TITLE) {
        requestsProductId = product.id;
        break;
      }
    }

    if (!requestsProductId) return NextResponse.json({ error: "No requests found" }, { status: 404 });

    const full = await client.products.retrieve(requestsProductId);
    const data = JSON.parse(full.description || "{}");
    const requests: Array<Record<string, unknown>> = data.requests || [];
    const idx = requests.findIndex((r) => r.id === requestId);

    if (idx === -1) return NextResponse.json({ error: "Request not found" }, { status: 404 });

    const payoutRequest = requests[idx];
    if (payoutRequest.status !== "pending") {
      return NextResponse.json({ error: "Request already resolved" }, { status: 400 });
    }

    // Check platform balance
    try {
      const ledger = await client.ledgerAccounts.retrieve(PLATFORM_COMPANY_ID);
      const usdBalance = ledger.balances?.find((b: { currency: string }) => b.currency === "usd");
      const available = usdBalance?.balance ?? 0;
      if (available < (payoutRequest.amount as number)) {
        return NextResponse.json({ error: "Insufficient platform balance" }, { status: 400 });
      }
    } catch (balanceError) {
      console.warn("Could not check platform balance:", balanceError);
      // Continue anyway -- the transfer will fail if insufficient
    }

    // Execute transfer
    const transfer = await client.transfers.create({
      amount: payoutRequest.amount as number,
      currency: "usd",
      origin_id: PLATFORM_COMPANY_ID,
      destination_id: payoutRequest.requesterCompanyId as string,
      metadata: {
        request_id: requestId,
        tournament_id: (payoutRequest.tournamentId as string) || "",
        type: (payoutRequest.reason as string) || "",
      },
      notes: `${payoutRequest.tournamentTitle || "Tournament"} - ${payoutRequest.reason}`.slice(0, 50),
      idempotence_key: requestId,
    });

    // Update request status
    requests[idx] = {
      ...payoutRequest,
      status: "approved",
      transferId: transfer.id,
      resolvedAt: new Date().toISOString(),
      resolvedBy: adminUserId || "admin",
    };

    await client.products.update(requestsProductId, {
      description: JSON.stringify({ type: "payout_requests_store", requests }),
    });

    return NextResponse.json({ success: true, transfer: { id: transfer.id } });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
