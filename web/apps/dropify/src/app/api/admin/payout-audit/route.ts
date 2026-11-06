import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getWhopPayoutAudit } from "@/lib/payout-audit";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const adminEmail = process.env.WHOP_AUDIT_ADMIN_EMAIL?.trim().toLowerCase();
  const sessionEmail = session?.user?.email?.trim().toLowerCase();

  if (!adminEmail || !sessionEmail || sessionEmail !== adminEmail) {
    return NextResponse.json({ error: "Not authorised" }, {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  try {
    const audit = await getWhopPayoutAudit();
    return NextResponse.json(audit, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payout audit unavailable";
    console.error("Whop payout audit failed", { message });
    return NextResponse.json({ error: "Payout audit unavailable. Check server configuration and Whop read permissions." }, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
