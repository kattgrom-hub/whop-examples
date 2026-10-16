import { send } from "@vercel/queue";
import { createIngress, reconciliationConfigured } from "@ingress/lib/ingress";
export const runtime = "nodejs";
export const POST = createIngress(send);
export function GET() {
  return Response.json({ service: "whop-webhooks", signatureConfigured: Boolean(process.env.WHOP_WEBHOOK_SECRET), reconciliationEnabled: reconciliationConfigured() }, { headers: { "Cache-Control": "no-store" } });
}
