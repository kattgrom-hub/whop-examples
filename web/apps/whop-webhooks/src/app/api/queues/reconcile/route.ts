import { handleCallback } from "@vercel/queue";
import { reconcileWhopEvent } from "@/lib/webhook-reconciliation";
import { businessEvents, reconciliationConfigured } from "@ingress/lib/ingress";
import { createConsumer } from "@ingress/lib/consumer";
export const runtime = "nodejs";
// Vercel queue-trigger functions are private; callers cannot post trusted events
// directly. The queue SDK retrieves the authenticated broker message.
const callback = handleCallback(createConsumer(async event => {
  if (businessEvents.has(event.type) && !reconciliationConfigured()) {
    throw new Error("Payment reconciliation is disabled or not configured");
  }
  return reconcileWhopEvent(event);
}), {
  retry: (_error, metadata) => ({ afterSeconds: Math.min(3600, 30 * 2 ** Math.min(metadata.deliveryCount, 7)) }),
});

export async function POST(request: Request) {
  return callback(request);
}
