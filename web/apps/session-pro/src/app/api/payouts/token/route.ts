import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

/**
 * Generate an access token for the embedded payout portal.
 * This token grants temporary access to the payout portal for a specific company (coach's connected account).
 */
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

    // Create an access token for the connected account's payout portal
    const tokenResponse = await client.accessTokens.create({
      company_id: companyId,
    });

    return NextResponse.json({
      token: tokenResponse.token,
      expiresAt: tokenResponse.expires_at,
    });
  } catch (error) {
    console.error("Failed to create payout access token:", error);
    return NextResponse.json(
      { error: "Failed to generate access token" },
      { status: 500 }
    );
  }
}
