import { NextRequest, NextResponse } from "next/server";
import { getPayoutRequest, denyPayoutRequest } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { requestId, reason, adminUserId } = await request.json();
    if (!requestId) return NextResponse.json({ error: "requestId required" }, { status: 400 });

    const payoutRequest = await getPayoutRequest(requestId);
    if (!payoutRequest) return NextResponse.json({ error: "Request not found" }, { status: 404 });
    if (payoutRequest.status !== "pending") {
      return NextResponse.json({ error: "Request already resolved" }, { status: 400 });
    }

    await denyPayoutRequest(requestId, reason, adminUserId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
