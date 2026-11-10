import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { getWhopGrossRevenue, getWhopRevenueAccountIds, parseGrossRevenueQuery } from "@/lib/gross-revenue";

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
    const params = request.nextUrl.searchParams;
    const allAccounts = params.get("account_id") === "all";
    const accountIds = allAccounts
      ? getWhopRevenueAccountIds()
      : [parseGrossRevenueQuery(params).accountId];

    const results = await Promise.all(accountIds.map(async (accountId) => {
      const accountParams = new URLSearchParams(params);
      accountParams.set("account_id", accountId);
      const query = parseGrossRevenueQuery(accountParams);
      try {
        const data = await getWhopGrossRevenue(query);
        return {
          accountId,
          from: query.from,
          to: query.to,
          interval: query.interval,
          currency: query.convertTo.toUpperCase(),
          data,
          ok: true,
        };
      } catch (error) {
        console.error("Whop gross-revenue report failed", {
          accountId,
          message: error instanceof Error ? error.message : "Unknown error",
        });
        return { accountId, ok: false, error: "Revenue unavailable for this business" };
      }
    }));

    const generatedAt = new Date().toISOString();
    if (!allAccounts) {
      const result = results[0];
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, {
          status: 503,
          headers: { "Cache-Control": "no-store" },
        });
      }
      return NextResponse.json({ ...result, generatedAt, readOnly: true }, {
        headers: { "Cache-Control": "no-store" },
      });
    }
    return NextResponse.json({
      results,
      generatedAt,
      readOnly: true,
      partialFailure: results.some((result) => !result.ok),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gross revenue unavailable";
    const isInputError = /must be|cannot exceed|not in WHOP_REVENUE_ACCOUNT_IDS/.test(message);
    console.error("Whop gross-revenue report request failed", { message });
    return NextResponse.json({
      error: isInputError ? message : "Gross revenue report unavailable. Check server configuration and Whop read permissions.",
    }, {
      status: isInputError ? 400 : 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
