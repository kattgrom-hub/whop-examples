import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Payout Token API
 *
 * In production, this generates an access token for the embedded payout portal.
 * This demo version returns a mock token.
 */

export async function GET(request: NextRequest) {
  console.log("💸 [Demo] Generating payout access token");

  const companyId = request.nextUrl.searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json(
      { error: "companyId is required" },
      { status: 400 }
    );
  }

  console.log(`📋 [Demo] Generating token for company: ${companyId}`);

  const mockToken = `demo_payout_token_${Date.now()}`;
  const expiresAt = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

  return NextResponse.json({
    token: mockToken,
    expiresAt: expiresAt,
  });
}
