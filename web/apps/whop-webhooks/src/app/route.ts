export function GET() {
  return Response.json({ service: "whop-webhooks", status: "online" }, { headers: { "Cache-Control": "no-store" } });
}
