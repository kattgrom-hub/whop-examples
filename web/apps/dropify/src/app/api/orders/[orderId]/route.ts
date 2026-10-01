import { NextRequest, NextResponse } from "next/server";
import { getOrder, hasOrderAccess, orderCookieName } from "@/lib/order-store";
import { getWhopCompanyId, getWhopEnvironment } from "@/lib/checkout-config";

export async function GET(request: NextRequest, context: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await context.params;
    const order = await getOrder(orderId);
    if (!order || !hasOrderAccess(order, request.cookies.get(orderCookieName(orderId))?.value) ||
        order.environment !== getWhopEnvironment() || order.company_id !== getWhopCompanyId()) {
      return NextResponse.json({ error: "This browser cannot access that order. Contact support if you have paid." }, { status: 404 });
    }
    return NextResponse.json({ orderId: order.id, status: order.status, paymentId: order.payment_id,
      planId: order.plan_id, checkoutConfigurationId: order.checkout_configuration_id,
    }, { headers: { "Cache-Control": "no-store", "Vary": "Cookie" } });
  } catch {
    return NextResponse.json({ error: "Order status is temporarily unavailable" }, { status: 503 });
  }
}
