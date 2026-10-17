import type { WhopWebhook } from "@whop-examples/webhooks";

export function createConsumer(reconcile: (event: WhopWebhook) => Promise<Response>) {
  return async function consume(event: WhopWebhook) {
    // A callback returns only after processing succeeded. Failure must throw so
    // the broker retains and retries the message; an HTTP 503 object is not enough.
    const response = await reconcile(event);
    if (!response.ok) throw new Error(`Reconciliation failed (${response.status})`);
    console.info("Whop queued event processed", { eventId: event.id, type: event.type });
  };
}
