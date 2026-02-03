import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

/**
 * Generate a hosted portal URL for payouts.
 * This creates a temporary URL that redirects the user to Whop's hosted payout portal.
 */
export async function GET(request: NextRequest) {
  const companyId = request.nextUrl.searchParams.get("companyId");
  const useCase = request.nextUrl.searchParams.get("useCase") || "payouts_portal";

  if (!companyId) {
    return NextResponse.json(
      { error: "companyId is required" },
      { status: 400 }
    );
  }

  // Build return and refresh URLs - must be HTTPS for Whop
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
  const isLocalhost = appUrl.includes("localhost") || appUrl.startsWith("http://");

  // For localhost, use the Whop dashboard directly since account links require HTTPS
  if (isLocalhost) {
    return NextResponse.json({
      url: `https://whop.com/dashboard/biz/${companyId}/settings/payouts`,
      isDirectLink: true,
    });
  }

  const returnUrl = `${appUrl}/dashboard/payouts`;
  const refreshUrl = `${appUrl}/dashboard/payouts`;

  try {
    const client = getWhopApi();

    // Create an account link for the connected account
    const accountLink = await client.accountLinks.create({
      company_id: companyId,
      use_case: useCase as "payouts_portal" | "account_onboarding",
      return_url: returnUrl,
      refresh_url: refreshUrl,
    });

    return NextResponse.json({
      url: accountLink.url,
      expiresAt: accountLink.expires_at,
    });
  } catch (error) {
    console.error("Failed to create payout portal:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to create payout portal: ${errorMessage}` },
      { status: 500 }
    );
  }
}
