import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";
const REQUESTS_PRODUCT_TITLE = "__trout_tournaments_payout_requests__";

/**
 * Find or create the dedicated "payout requests" product on the platform.
 * Each request is stored as an entry in a JSON array in the product description.
 */
async function getRequestsProduct(client: ReturnType<typeof getWhopApi>) {
  // Look for existing requests product
  for await (const product of await client.products.list({ company_id: PLATFORM_COMPANY_ID })) {
    if (product.title === REQUESTS_PRODUCT_TITLE) {
      return product;
    }
  }

  // Create it if not found
  return await client.products.create({
    company_id: PLATFORM_COMPANY_ID,
    title: REQUESTS_PRODUCT_TITLE,
    description: JSON.stringify({ type: "payout_requests_store", requests: [] }),
    visibility: "hidden",
  });
}

function parseRequests(description: string): Array<Record<string, unknown>> {
  try {
    const data = JSON.parse(description);
    return data.requests || [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const all = request.nextUrl.searchParams.get("all");
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();
    const product = await getRequestsProduct(client);
    const full = await client.products.retrieve(product.id);
    let requests = parseRequests(full.description || "");

    // Filter by user unless requesting all (admin)
    if (!all && userId) {
      requests = requests.filter((r) => r.requesterId === userId);
    }

    // Sort newest first
    requests.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());

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

    const client = getWhopApi();
    const product = await getRequestsProduct(client);
    const full = await client.products.retrieve(product.id);
    const requests = parseRequests(full.description || "");

    const requestId = `req_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;

    const newRequest = {
      type: "payout_request",
      id: requestId,
      requesterId,
      requesterCompanyId,
      requesterName: requesterName || "Unknown",
      amount,
      currency: "usd",
      reason,
      tournamentId: tournamentId || null,
      tournamentTitle: tournamentTitle || null,
      place: place || null,
      status: "pending",
      transferId: null,
      resolvedAt: null,
      resolvedBy: null,
      denialReason: null,
      createdAt: new Date().toISOString(),
    };

    requests.push(newRequest);

    await client.products.update(product.id, {
      description: JSON.stringify({ type: "payout_requests_store", requests }),
    });

    // Fire notification to Whop
    try {
      const subtitle = reason === "tournament_prize"
        ? `${place ? `${place} place` : "Prize"}`
        : "Organizer revenue";

      await client.notifications.create({
        company_id: PLATFORM_COMPANY_ID,
        title: `Payout Request: $${(amount / 100).toFixed(2)}`,
        content: `${requesterName} requests ${reason === "tournament_prize" ? "prize" : "revenue"} from ${tournamentTitle || "tournament"}`,
        subtitle,
        rest_path: `/requests/${requestId}`,
      });
    } catch (notifError) {
      console.error("Failed to send notification:", notifError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({ success: true, request: newRequest });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
