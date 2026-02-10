import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";
const REQUESTS_PRODUCT_TITLE = "__trout_tournaments_payout_requests__";

export async function POST(request: NextRequest) {
  try {
    const { requestId, reason, adminUserId } = await request.json();
    if (!requestId) return NextResponse.json({ error: "requestId required" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const client = getWhopApi();

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

    if (requests[idx].status !== "pending") {
      return NextResponse.json({ error: "Request already resolved" }, { status: 400 });
    }

    requests[idx] = {
      ...requests[idx],
      status: "denied",
      denialReason: reason || "Denied by admin",
      resolvedAt: new Date().toISOString(),
      resolvedBy: adminUserId || "admin",
    };

    await client.products.update(requestsProductId, {
      description: JSON.stringify({ type: "payout_requests_store", requests }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
