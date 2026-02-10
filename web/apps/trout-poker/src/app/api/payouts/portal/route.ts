import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

export async function GET(request: NextRequest) {
  const companyId = request.nextUrl.searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json(
      { error: "companyId is required" },
      { status: 400 }
    );
  }

  try {
    const client = getWhopApi();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003";

    const portalResponse = await client.accountLinks.create({
      company_id: companyId,
      refresh_url: `${appUrl}/dashboard/withdrawals`,
      return_url: `${appUrl}/dashboard/withdrawals`,
      use_case: "payouts_portal",
    });

    return NextResponse.json({
      url: portalResponse.url,
    });
  } catch (error) {
    console.error("Failed to create payout portal URL:", error);
    return NextResponse.json(
      { error: "Failed to generate portal URL" },
      { status: 500 }
    );
  }
}
