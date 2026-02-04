import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Payout Portal API
 *
 * In production, this generates a hosted portal URL for the payout dashboard.
 * This demo version returns a mock portal URL.
 */

export async function GET(request: NextRequest) {
  console.log("🏦 [Demo] Opening payout portal");

  const companyId = request.nextUrl.searchParams.get("companyId");
  const useCase = request.nextUrl.searchParams.get("useCase") || "payouts_portal";

  if (!companyId) {
    return NextResponse.json(
      { error: "companyId is required" },
      { status: 400 }
    );
  }

  console.log(`📋 [Demo] Portal for company: ${companyId}`);
  console.log(`📋 [Demo] Use case: ${useCase}`);

  // For demo, return a mock URL
  const mockUrl = `/dashboard/payouts`;

  return NextResponse.json({
    url: mockUrl,
    expiresAt: Math.floor(Date.now() / 1000) + 3600,
    isDirectLink: true,
  });
}
