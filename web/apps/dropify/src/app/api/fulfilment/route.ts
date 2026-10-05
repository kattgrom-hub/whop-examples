import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { orderRequest, getOrder } from "@/lib/order-store";
import { getWhopEnvironment, getWhopCompanyId } from "@/lib/checkout-config";
import { getWhopApi } from "@/lib/whop-sdk";
import { validateOrderPayment, type OrderPayment } from "@/lib/payment-validation";

async function isAdmin() {
  const session = await auth();
  const ids = (process.env.DROPIFY_FULFILMENT_ADMIN_IDS || "").split(",").map(id => id.trim()).filter(Boolean);
  return !!session?.user?.id && ids.includes(session.user.id);
}
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Staff access required" }, { status: 403 });
  try {
    const orders = await orderRequest(`dropify_fulfilment_queue?select=*,dropify_orders!inner(items,environment,company_id)&dropify_orders.environment=eq.${getWhopEnvironment()}&dropify_orders.company_id=eq.${getWhopCompanyId()}&order=created_at.desc&limit=100`);
    return NextResponse.json(orders, { headers: { "Cache-Control": "no-store", Vary: "Cookie" } });
  } catch { return NextResponse.json({ error: "Queue unavailable" }, { status: 503 }); }
}
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Staff access required" }, { status: 403 });
  if (request.headers.get("origin") !== new URL(request.url).origin) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  try {
    const body = await request.json();
    if (typeof body.orderId !== "string" || typeof body.trackingReference !== "string" ||
        body.trackingReference.trim().length < 1 || body.trackingReference.length > 200) {
      return NextResponse.json({ error: "Order and tracking reference required" }, { status: 400 });
    }
    const order = await getOrder(body.orderId);
    if (!order || order.environment !== getWhopEnvironment() || order.status !== "paid" || !order.payment_id) {
      return NextResponse.json({ error: "Order is not ready to ship" }, { status: 409 });
    }
    const payment = await getWhopApi().payments.retrieve(order.payment_id) as unknown as OrderPayment;
    if (!validateOrderPayment(order, payment)) return NextResponse.json({ error: "Shipping address incomplete" }, { status: 409 });
    const rows = await orderRequest<unknown[]>(`dropify_fulfilment_queue?order_id=eq.${order.id}&status=eq.pending`, "PATCH", {
      status: "shipped", shipped_at: new Date().toISOString(), tracking_reference: body.trackingReference.trim(),
    });
    return NextResponse.json({ shipped: rows.length === 1 }, { status: rows.length ? 200 : 409 });
  } catch { return NextResponse.json({ error: "Unable to verify shipment. Do not dispatch until payment is checked." }, { status: 503 }); }
}
