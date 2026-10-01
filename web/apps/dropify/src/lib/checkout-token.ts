import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

export interface SignedOrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface SignedOrder {
  v: 1;
  orderId: string;
  planId: string;
  items: SignedOrderItem[];
  totalPrice: number;
  currency: "usd";
  expiresAt: number;
}

function getSecret() {
  const secret =
    process.env.CHECKOUT_SIGNING_SECRET || process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "CHECKOUT_SIGNING_SECRET (or AUTH_SECRET) must be configured"
    );
  }

  return secret;
}

function signPayload(payload: string) {
  return createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
}

export function createOrderToken(order: SignedOrder) {
  const payload = Buffer.from(JSON.stringify(order), "utf8").toString(
    "base64url"
  );
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifyOrderToken(token: string): SignedOrder {
  const [payload, signature, extra] = token.split(".");

  if (!payload || !signature || extra) {
    throw new Error("Invalid order token");
  }

  const expected = signPayload(payload);
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    providedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(providedBuffer, expectedBuffer)
  ) {
    throw new Error("Invalid order token signature");
  }

  const order = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8")
  ) as SignedOrder;

  if (
    order.v !== 1 ||
    !order.orderId ||
    !order.planId ||
    !Array.isArray(order.items) ||
    order.currency !== "usd" ||
    !Number.isFinite(order.totalPrice) ||
    !Number.isFinite(order.expiresAt)
  ) {
    throw new Error("Malformed order token");
  }

  if (Date.now() > order.expiresAt) {
    throw new Error("Order token expired");
  }

  return order;
}
