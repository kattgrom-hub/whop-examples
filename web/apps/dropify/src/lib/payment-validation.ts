import type { Order } from "./order-store";
export interface OrderPayment {
  id: string;
  status: string | null;
  substatus?: string | null;
  subtotal: number | null;
  currency: string;
  company?: { id: string } | null;
  plan?: { id: string } | null;
  checkout_configuration_id?: string | null;
  metadata?: Record<string, unknown> | null;
  shipping_address?: Record<string, unknown> | null;
  user?: { email?: string | null } | null;
}
export function validateOrderIdentity(order: Order, payment: OrderPayment) {
  if (!/^pay_[a-zA-Z0-9]+$/.test(payment.id) || payment.company?.id !== order.company_id ||
      payment.plan?.id !== order.plan_id || payment.checkout_configuration_id !== order.checkout_configuration_id ||
      payment.metadata?.type !== "dropify_order" || payment.metadata?.order_id !== order.id ||
      payment.metadata?.environment !== order.environment || payment.currency !== order.currency ||
      typeof payment.subtotal !== "number" || !Number.isFinite(payment.subtotal) ||
      Math.abs(payment.subtotal * 100 - order.total_minor) > 0.001) {
    throw new Error("Payment does not match the recorded order");
  }
}
export function validateOrderPayment(order: Order, payment: OrderPayment) {
  validateOrderIdentity(order, payment);
  if (payment.status !== "paid" || payment.substatus !== "succeeded") throw new Error("Payment is not an undisputed successful payment");
  // Do not dispatch physical goods without a usable shipping address.
  const shipping = payment.shipping_address;
  return !!shipping && ["name", "line1", "city", "postal_code", "country"].every(key =>
    typeof shipping[key] === "string" && (shipping[key] as string).trim().length > 0);
}
