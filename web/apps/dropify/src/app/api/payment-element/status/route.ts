import { NextRequest, NextResponse } from "next/server";
import { elementApi, elementOrigin, elementPayment, readElementSession } from "@/lib/payment-element-server";
export async function GET(request: NextRequest) {
  try {
    elementOrigin(request);
    const session = await readElementSession(request);
    if (!session) return NextResponse.json({ error: "Payment session unavailable" }, { status: 404 });
    if (!session.payment_id) return NextResponse.json({ status: session.reserved ? "unknown" : "ready", clientSecret: null }, {
      headers: { "Cache-Control": "no-store", Vary: "Cookie" },
    });
    const payment = await elementApi(`payments/${encodeURIComponent(session.payment_id)}`);
    return NextResponse.json(elementPayment(session, payment), { headers: { "Cache-Control": "no-store", Vary: "Cookie" } });
  } catch { return NextResponse.json({ error: "Payment status unavailable" }, { status: 503 }); }
}
