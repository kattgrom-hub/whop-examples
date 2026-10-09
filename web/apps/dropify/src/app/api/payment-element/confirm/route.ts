import { NextRequest, NextResponse } from "next/server";
import { attachElementPayment, elementApi, elementOrigin, elementPayment, readElementSession, requireElementCredentials, reserveElementSession } from "@/lib/payment-element-server";
export async function POST(request: NextRequest) {
  try {
    const origin = elementOrigin(request, true);
    const session = await readElementSession(request);
    if (!session) return NextResponse.json({ error: "Payment session unavailable" }, { status: 404 });
    if (!request.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Expected JSON" }, { status: 415 });
    const raw = await request.text();
    if (raw.length > 4096) return NextResponse.json({ error: "Request too large" }, { status: 413 });
    let body;
    try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
    if (!/^ctok_[a-zA-Z0-9]+$/.test(body?.confirmationToken || "") ||
        typeof body?.email !== "string" || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json({ error: "Valid payment token and email required" }, { status: 400 });
    }
    requireElementCredentials();
    // Durable compare-and-set BEFORE the external charge. Never unlock on a timeout:
    // the provider may have accepted it. Reloads and parallel requests cannot pay twice.
    if (!await reserveElementSession(session.id)) return NextResponse.json({ error: "An attempt already exists. Check its status." }, { status: 409 });
    const payment = await elementApi("payments", { account_id: session.company_id, plan: session.plan_id,
      confirmation_token: body.confirmationToken, email: body.email, return_url: `${origin}/payment-element`,
      metadata: { type: "dropify_element_test", element_session: session.id },
    });
    const result = elementPayment(session, payment);
    await attachElementPayment(session.id, result.paymentId);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store", Vary: "Cookie" } });
  } catch {
    return NextResponse.json({ error: "The attempt could not be confirmed. Check status before doing anything else." }, { status: 503 });
  }
}
