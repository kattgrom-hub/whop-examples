import { readWhopWebhook, WebhookRequestError, type WhopWebhook } from "@whop-examples/webhooks";

export const topic = "whop-reconcile";
export const businessEvents = new Set(["payment.succeeded", "refund.created", "refund.updated", "dispute.created", "dispute.updated"]);
export function reconciliationConfigured() {
  return process.env.WHOP_WEBHOOK_RECONCILIATION_ENABLED === "true" &&
    ["WHOP_API_KEY", "DROPIFY_SUPABASE_URL", "DROPIFY_SUPABASE_SERVICE_ROLE_KEY", "NEXT_PUBLIC_WHOP_COMPANY_ID"]
      .every(key => Boolean(process.env[key]?.trim()) && !process.env[key]!.includes("xxxxx")) &&
    ["sandbox", "production"].includes(process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT || "");
}
// Queue only reconciliation references; retrieve authoritative payment details in
// the worker rather than persisting customer email/address payloads in the broker.
function paymentReference(value: Record<string, any> | null | undefined) {
  if (!value) return undefined;
  return { id: value.id, metadata: { type: value.metadata?.type, order_id: value.metadata?.order_id } };
}
export function reconciliationMessage(event: WhopWebhook): WhopWebhook {
  const payment = paymentReference(event.data);
  return { id: event.id, type: event.type, api_version: "v1", data: {
    ...payment, ...(event.data.payment ? { payment: paymentReference(event.data.payment) } : {}),
  } };
}
export type Publish = (topic: string, message: WhopWebhook, options: { idempotencyKey: string; retentionSeconds: number }) => Promise<unknown>;

export function createIngress(publish: Publish) {
  return async function POST(request: Request) {
    try {
      const event = await readWhopWebhook(request);
      // Real reconciliation stays closed until this dedicated service has its own
      // approved account, environment, signing key and durable order credentials.
      if (businessEvents.has(event.type) && !reconciliationConfigured()) {
        return Response.json({ error: "Payment reconciliation is not configured" }, { status: 503 });
      }
      // Race only the durable publish, never acknowledge an uncommitted message.
      // A publish that completes after the timeout is safe to receive again.
      let timeout: ReturnType<typeof setTimeout> | undefined;
      try {
        await Promise.race([
          publish(topic, reconciliationMessage(event), { idempotencyKey: event.id, retentionSeconds: 604800 }),
          new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error("Queue timeout")), 3000); }),
        ]);
      } finally { if (timeout) clearTimeout(timeout); }
      return Response.json({ received: true }, { status: 202 });
    } catch (error) {
      const status = error instanceof WebhookRequestError ? error.status : 503;
      return Response.json({ error: error instanceof WebhookRequestError ? error.message : "Durable acceptance unavailable" }, { status });
    }
  };
}
