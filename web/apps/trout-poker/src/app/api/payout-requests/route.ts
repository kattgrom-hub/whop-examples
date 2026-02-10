import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { createPayoutRequest, listPayoutRequests } from "@/lib/db";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const all = request.nextUrl.searchParams.get("all");

  try {
    const requests = await listPayoutRequests(all ? undefined : (userId || undefined));
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { requesterId, requesterCompanyId, requesterName, amount, reason, tournamentId, tournamentTitle, place } = await request.json();
    if (!requesterId || !requesterCompanyId || !amount || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const requestId = `req_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;

    const newRequest = await createPayoutRequest({
      id: requestId,
      requester_id: requesterId,
      requester_company_id: requesterCompanyId,
      requester_name: requesterName || "Unknown",
      amount,
      reason,
      tournament_id: tournamentId || null,
      tournament_title: tournamentTitle || null,
      place: place || null,
    });

    // Fire notification to Whop
    try {
      const client = getWhopApi();
      const subtitle = reason === "tournament_prize"
        ? `${place ? `${place} place` : "Prize"}`
        : "Commissioner revenue";

      await client.notifications.create({
        company_id: PLATFORM_COMPANY_ID,
        title: `Payout Request: $${(amount / 100).toFixed(2)}`,
        content: `${requesterName} requests ${reason === "tournament_prize" ? "prize" : "revenue"} from ${tournamentTitle || "tournament"}`,
        subtitle,
        rest_path: `/requests/${requestId}`,
      });
    } catch (notifError) {
      console.error("Failed to send notification:", notifError);
    }

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
