import { commerceReadiness } from "@/lib/commerce-readiness";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(commerceReadiness(), {
    headers: { "Cache-Control": "no-store" },
  });
}
