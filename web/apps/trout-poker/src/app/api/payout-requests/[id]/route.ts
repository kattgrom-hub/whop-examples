import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";
const REQUESTS_PRODUCT_TITLE = "__trout_tournaments_payout_requests__";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();

    // Find the requests product
    let requestsProductId: string | null = null;
    for await (const product of await client.products.list({ company_id: PLATFORM_COMPANY_ID })) {
      if (product.title === REQUESTS_PRODUCT_TITLE) {
        requestsProductId = product.id;
        break;
      }
    }

    if (!requestsProductId) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const full = await client.products.retrieve(requestsProductId);
    const data = JSON.parse(full.description || "{}");
    const requests = data.requests || [];
    const payoutRequest = requests.find((r: Record<string, unknown>) => r.id === id);

    if (!payoutRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ request: payoutRequest });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
