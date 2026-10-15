const { unwrapWebhook } = require("@whop/sdk/helpers");

class WebhookRequestError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

async function readWhopWebhook(request) {
  const secret = process.env.WHOP_WEBHOOK_SECRET;
  if (!secret || secret.includes("xxxxx")) {
    throw new WebhookRequestError("Webhook is not configured", 503);
  }
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > 1048576) {
    throw new WebhookRequestError("Payload too large", 413);
  }
  let body;
  try {
    body = unwrapWebhook(raw, {
      headers: Object.fromEntries(request.headers), key: secret,
    });
  } catch {
    throw new WebhookRequestError("Invalid signature", 401);
  }
  // Never infer a legacy envelope or normalize arbitrary event names.
  if (!body || body.api_version !== "v1" || typeof body.type !== "string" ||
      !/^[a-z_]+\.[a-z_]+$/.test(body.type) ||
      typeof body.id !== "string" || body.id !== request.headers.get("webhook-id") ||
      !body.data || typeof body.data !== "object" || Array.isArray(body.data)) {
    throw new WebhookRequestError("Malformed v1 event", 400);
  }
  return body;
}

module.exports = { readWhopWebhook, WebhookRequestError };
