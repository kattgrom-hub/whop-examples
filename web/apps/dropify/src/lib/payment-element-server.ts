import "server-only";
import { randomUUID } from "crypto";
import type { NextRequest } from "next/server";
import { getAppOrigin, getWhopCompanyId, getWhopEnvironment } from "./checkout-config";
import { checkoutClientKey, hashAccess, newOrderAccess, orderRequest } from "./order-store";

export const elementCookie = "dropify_element_session";
export type ElementSession = { id: string; access_hash: string; company_id: string; plan_id: string;
  reserved: boolean; payment_id: string | null };
export function elementConfig() {
  if (process.env.DROPIFY_PAYMENT_ELEMENT_ENABLED !== "true" ||
      getWhopEnvironment() !== "sandbox" || process.env.VERCEL_ENV === "production") {
    throw new Error("PaymentElement is disabled outside sandbox");
  }
  const planId = process.env.DROPIFY_PAYMENT_ELEMENT_PLAN_ID;
  if (!planId || !/^plan_[a-zA-Z0-9]+$/.test(planId) || planId.includes("xxxxx")) throw new Error("Configure a sandbox plan");
  return { companyId: getWhopCompanyId(), planId };
}
export function elementOrigin(request: NextRequest, mutation = false) {
  const origin = getAppOrigin(request.url);
  if (mutation && (request.headers.get("origin") !== origin || request.headers.get("sec-fetch-site") === "cross-site")) {
    throw new Error("Cross-site payment request");
  }
  return origin;
}
export async function readElementSession(request: NextRequest) {
  const config = elementConfig();
  const cookie = request.cookies.get(elementCookie)?.value || "";
  const [id, access] = cookie.split(".");
  if (!/^[0-9a-f-]{36}$/.test(id) || !/^[a-zA-Z0-9_-]{43}$/.test(access || "")) return null;
  const rows = await orderRequest<ElementSession[]>(`dropify_element_sessions?id=eq.${id}&access_hash=eq.${hashAccess(access)}&limit=1`);
  const session = rows[0];
  return session?.company_id === config.companyId && session?.plan_id === config.planId ? session : null;
}
export async function createElementSession(request: NextRequest) {
  const config = elementConfig();
  const id = randomUUID(), access = newOrderAccess();
  const session = await orderRequest<ElementSession | null>("rpc/dropify_create_element_session", "POST", {
    p_id: id, p_access_hash: hashAccess(access), p_company_id: config.companyId,
    p_plan_id: config.planId, p_client_key: checkoutClientKey(request),
  });
  return session ? { session, cookie: `${id}.${access}` } : null;
}
export async function reserveElementSession(id: string) {
  const rows = await orderRequest<ElementSession[]>(`dropify_element_sessions?id=eq.${id}&reserved=eq.false`, "PATCH", { reserved: true });
  return rows.length === 1;
}
export async function attachElementPayment(id: string, paymentId: string) {
  await orderRequest(`dropify_element_sessions?id=eq.${id}`, "PATCH", { payment_id: paymentId });
}
export function requireElementCredentials() {
  elementConfig();
  const key = process.env.WHOP_API_KEY;
  if (!key || key.includes("xxxxx")) throw new Error("Configure sandbox credentials");
  return key;
}
export async function elementApi(path: string, body?: unknown) {
  const key = requireElementCredentials();
  const response = await fetch(`https://sandbox-api.whop.com/api/v1/${path}`, {
    method: body === undefined ? "GET" : "POST", cache: "no-store", signal: AbortSignal.timeout(30000),
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) throw new Error("Sandbox payment request failed");
  return response.json();
}
export function elementPayment(session: ElementSession, payment: {
  id: string; company?: { id: string }; plan?: { id: string }; metadata?: Record<string, unknown>;
  status?: string; substatus?: string; client_secret?: string;
}) {
  if (!/^pay_[a-zA-Z0-9]+$/.test(payment.id) || (session.payment_id && session.payment_id !== payment.id) ||
      payment.company?.id !== session.company_id || payment.plan?.id !== session.plan_id ||
      payment.metadata?.element_session !== session.id || payment.metadata?.type !== "dropify_element_test") {
    throw new Error("Sandbox payment identity mismatch");
  }
  const status = payment.status === "paid" && payment.substatus === "succeeded" ? "succeeded" :
    payment.status === "failed" || payment.substatus === "failed" ? "failed" :
    payment.status === "canceled" || payment.substatus === "canceled" ? "canceled" : "pending";
  return { paymentId: payment.id, status, clientSecret: payment.client_secret || null };
}
