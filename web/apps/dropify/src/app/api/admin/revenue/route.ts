import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { getWhopGrossRevenue, parseGrossRevenueQuery } from "@/lib/gross-revenue";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
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
    const query = parseGrossRevenueQuery(request.nextUrl.searchParams);
    const data = await getWhopGrossRevenue(query);
    return NextResponse.json({
      accountId: query.accountId,
      from: query.from,
      to: query.to,
      interval: query.interval,
      currency: query.convertTo.toUpperCase(),
      data,
      generatedAt: new Date().toISOString(),
      readOnly: true,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gross revenue unavailable";
    const isInputError = /must be|cannot exceed|not in WHOP_REVENUE_ACCOUNT_IDS/.test(message);
    console.error("Whop gross-revenue report failed", { message });
    return NextResponse.json({
      error: isInputError ? message : "Gross revenue report unavailable. Check server configuration and Whop read permissions.",
    }, {
      status: isInputError ? 400 : 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
