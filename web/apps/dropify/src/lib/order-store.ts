import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import type { WhopEnvironment } from "./checkout-config";

export interface Order {
  id: string;
  access_hash: string;
  environment: WhopEnvironment;
  company_id: string;
  currency: string;
  total_minor: number;
  items: unknown;
  status: "pending" | "paid" | "review";
  plan_id: string | null;
  checkout_configuration_id: string | null;
  payment_id: string | null;
}

export function orderCookieName(id: string) { return `dropify_order_${id}`; }
export function newOrderAccess() { return randomBytes(32).toString("base64url"); }
export function hashAccess(token: string) { return createHash("sha256").update(token).digest("hex"); }
export function hasOrderAccess(order: Order, token?: string) {
  if (!token || token.length > 128) return false;
  const provided = Buffer.from(hashAccess(token));
  const expected = Buffer.from(order.access_hash);
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}
export function requireCheckoutSigningSecret() {
  const secret = process.env.CHECKOUT_SIGNING_SECRET;
  if (!secret || secret.length < 32 || secret.includes("replace-with")) {
    throw new Error("CHECKOUT_SIGNING_SECRET must contain at least 32 random characters");
  }
  return secret;
}
export function checkoutClientKey(request: Request) {
  const secret = requireCheckoutSigningSecret();
  // Trust Vercel's platform header there; do not trust arbitrary forwarded headers locally.
  const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() : "local";
  return createHmac("sha256", secret).update(ip || "unknown").digest("hex");
}

function storeConfiguration() {
  const url = process.env.DROPIFY_SUPABASE_URL;
  const key = process.env.DROPIFY_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || key.includes("xxxxx")) throw new Error("Configure Dropify's durable order database");
  const parsed = new URL(url);
  if (parsed.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(parsed.hostname)) {
    throw new Error("Order database URL must use HTTPS");
  }
  if (parsed.username || parsed.password || parsed.pathname !== "/" || parsed.search || parsed.hash) {
    throw new Error("Invalid order database URL");
  }
  return { url: parsed.origin, key };
}
export function requireOrderStore() { storeConfiguration(); }

export async function orderRequest<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const { url, key } = storeConfiguration();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method, cache: "no-store", signal: AbortSignal.timeout(10000),
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "return=representation" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new Error(`Order database request failed (${response.status})`);
  return response.json() as Promise<T>;
}
export async function createOrder(input: {
  id: string; access_hash: string; environment: WhopEnvironment; company_id: string;
  total_minor: number; currency: string; items: unknown;
}, clientKey: string) {
  return orderRequest<Order>("rpc/dropify_create_order", "POST", { p_order: input, p_client_key: clientKey });
}
export async function getOrder(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  const orders = await orderRequest<Order[]>(`dropify_orders?id=eq.${id}&limit=1`);
  return orders[0] || null;
}
export async function attachCheckout(id: string, planId: string, configurationId: string) {
  await orderRequest(`dropify_orders?id=eq.${id}`, "PATCH", {
    plan_id: planId, checkout_configuration_id: configurationId,
  });
}
export async function recordVerifiedPayment(orderId: string, input: {
  paymentId: string; eventId: string; shippingAddress: unknown; customerEmail: string | null;
}) {
  return orderRequest<string>("rpc/dropify_record_payment", "POST", {
    p_order_id: orderId, p_payment_id: input.paymentId, p_event_id: input.eventId,
    p_shipping_address: input.shippingAddress, p_customer_email: input.customerEmail,
  });
}

export async function holdOrder(orderId: string) {
  return orderRequest<string>("rpc/dropify_hold_order", "POST", { p_order_id: orderId });
}
