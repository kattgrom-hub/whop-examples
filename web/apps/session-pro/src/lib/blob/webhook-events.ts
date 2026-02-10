import { put, list } from "@vercel/blob";

/**
 * Webhook Event Persistence
 *
 * Stores Whop webhook events as JSON blobs at:
 *   webhooks/{eventType}/{eventId}.json
 *
 * Only non-PII fields are stored.
 */

export interface WebhookEventRecord {
  eventId: string;
  event: string;
  timestamp: string;
  companyId?: string;
  planId?: string;
  amount?: number;
  failureReason?: string;
}

/**
 * Extract non-PII fields from a webhook event payload.
 */
function extractEventRecord(
  eventType: string,
  data: Record<string, unknown>
): WebhookEventRecord {
  const record: WebhookEventRecord = {
    eventId: (data.id as string) || crypto.randomUUID(),
    event: eventType,
    timestamp: new Date().toISOString(),
  };

  if (data.company_id) record.companyId = data.company_id as string;
  if (data.plan_id) record.planId = data.plan_id as string;

  // Payment/payout amount
  if (data.amount !== undefined) record.amount = Number(data.amount);
  if (data.final_amount !== undefined)
    record.amount = Number(data.final_amount);

  // Failure reason for payment.failed
  if (data.failure_reason) record.failureReason = data.failure_reason as string;
  if (data.failure_message)
    record.failureReason = data.failure_message as string;

  return record;
}

/**
 * Persist a webhook event to Vercel Blob.
 *
 * Stored at: webhooks/{eventType}/{eventId}.json
 * e.g. webhooks/payment.succeeded/evt_abc123.json
 */
export async function persistWebhookEvent(
  eventType: string,
  data: Record<string, unknown>
): Promise<WebhookEventRecord> {
  const record = extractEventRecord(eventType, data);

  // Use dots in event type as-is for the path (e.g., "payment.succeeded")
  const pathname = `webhooks/${eventType}/${record.eventId}.json`;

  await put(pathname, JSON.stringify(record), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return record;
}

/**
 * List recent webhook events of a given type.
 * Returns blob metadata (not content). Caller can fetch content via blob URL.
 */
export async function listWebhookEvents(
  eventType: string,
  limit = 100
): Promise<{ pathname: string; url: string; uploadedAt: Date }[]> {
  const result = await list({
    prefix: `webhooks/${eventType}/`,
    limit,
  });

  return result.blobs.map((b) => ({
    pathname: b.pathname,
    url: b.url,
    uploadedAt: b.uploadedAt,
  }));
}
