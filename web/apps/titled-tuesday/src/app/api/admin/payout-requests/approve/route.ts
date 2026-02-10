import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getPayoutRequest, approvePayoutRequest } from "@/lib/db";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function POST(request: NextRequest) {
  try {
    const { requestId, adminUserId } = await request.json();
    if (!requestId) return NextResponse.json({ error: "requestId required" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const payoutRequest = await getPayoutRequest(requestId);
    if (!payoutRequest) return NextResponse.json({ error: "Request not found" }, { status: 404 });
    if (payoutRequest.status !== "pending") {
      return NextResponse.json({ error: "Request already resolved" }, { status: 400 });
    }

    const client = getWhopApi();

    // Check platform balance
    try {
      const ledger = await client.ledgerAccounts.retrieve(PLATFORM_COMPANY_ID);
      const usdBalance = ledger.balances?.find((b: { currency: string }) => b.currency === "usd");
      const available = usdBalance?.balance ?? 0;
      if (available < payoutRequest.amount) {
        return NextResponse.json({ error: "Insufficient platform balance" }, { status: 400 });
      }
    } catch (balanceError) {
      console.warn("Could not check platform balance:", balanceError);
    }

    // Execute transfer
    const transfer = await client.transfers.create({
      amount: payoutRequest.amount,
      currency: "usd",
      origin_id: PLATFORM_COMPANY_ID,
      destination_id: payoutRequest.requester_company_id,
      metadata: {
        request_id: requestId,
        tournament_id: payoutRequest.tournament_id || "",
        type: payoutRequest.reason || "",
      },
      notes: `${payoutRequest.tournament_title || "Tournament"} - ${payoutRequest.reason}`.slice(0, 50),
      idempotence_key: requestId,
    });

    // Update request status in DB
    await approvePayoutRequest(requestId, transfer.id, adminUserId);

    return NextResponse.json({ success: true, transfer: { id: transfer.id } });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
