import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { InvalidCartError, priceCart } from "@/lib/checkout-cart";
import { getAppOrigin, getWhopCompanyId, getWhopEnvironment } from "@/lib/checkout-config";
import { attachCheckout, checkoutClientKey, createOrder, hashAccess, newOrderAccess, orderCookieName, requireOrderStore } from "@/lib/order-store";
import { getWhopApi } from "@/lib/whop-sdk";

export async function POST(request: NextRequest) {
  try {
    const environment = getWhopEnvironment();
    const companyId = getWhopCompanyId();
    const appOrigin = getAppOrigin(request.url);
    if (request.headers.get("origin") !== new URL(request.url).origin ||
        request.headers.get("sec-fetch-site") === "cross-site") {
      return NextResponse.json({ error: "Use checkout from this website" }, { status: 403 });
    }
    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json({ error: "Expected JSON" }, { status: 415 });
    }
    const raw = await request.text();
    if (raw.length > 16384) return NextResponse.json({ error: "Cart is too large" }, { status: 413 });
    let body;
    try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
    const { items, totalMinor, currency } = priceCart(body?.items);
    // No charge can be created until a real delivery system has been connected.
    if (process.env.DROPIFY_DIGITAL_DELIVERY_READY !== "true") {
      return NextResponse.json({ error: "Sales are paused while digital product delivery is completed." }, { status: 503 });
    }
    requireOrderStore();
    const client = getWhopApi();
    const orderId = randomUUID();
    const access = newOrderAccess();
    const order = await createOrder({ id: orderId, access_hash: hashAccess(access), environment,
      company_id: companyId, total_minor: totalMinor, currency, items }, checkoutClientKey(request));
    if (!order) return NextResponse.json({ error: "Too many checkout attempts. Please wait a minute." }, { status: 429 });
    const returnUrl = `${appOrigin}/checkout?orderId=${orderId}`;
    const checkout = await client.checkoutConfigurations.create({
      mode: "payment", redirect_url: returnUrl,
      metadata: { type: "dropify_order", order_id: orderId, environment },
      plan: { company_id: companyId, currency, initial_price: totalMinor / 100,
        plan_type: "one_time", visibility: "hidden", release_method: "buy_now",
        product: { external_identifier: `dropify-${orderId}`, title: "Kattassie digital creator kits", collect_shipping_address: false },
      },
    });
    if (!checkout.plan?.id || !checkout.id) throw new Error("Checkout target missing");
    await attachCheckout(orderId, checkout.plan.id, checkout.id);
    const response = NextResponse.json({ orderId, planId: checkout.plan.id, checkoutConfigurationId: checkout.id }, {
      headers: { "Cache-Control": "no-store" },
    });
    response.cookies.set(orderCookieName(orderId), access, {
      httpOnly: true, secure: new URL(request.url).protocol === "https:", sameSite: "lax",
      path: "/api/orders", maxAge: 7 * 24 * 60 * 60,
    });
    return response;
  } catch (error) {
    if (error instanceof InvalidCartError) return NextResponse.json({ error: error.message }, { status: 400 });
    console.error("Dropify checkout creation failed", { type: error instanceof Error ? error.name : "unknown" });
    return NextResponse.json({ error: "Checkout is unavailable. Please try again later." }, { status: 503 });
  }
}
