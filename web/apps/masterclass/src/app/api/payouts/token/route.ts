import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getWhopApi } from "@/lib/whop-sdk";

/**
 * Generate an access token for the embedded payout portal.
 * This token grants temporary access to the payout portal for a specific company (instructor's connected account).
 */
export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const companyId = (session.user as unknown as { companyId?: string })?.companyId;

  if (!companyId) {
    return NextResponse.json(
      { error: "No connected account found" },
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
