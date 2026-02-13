import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

/**
 * Generate an access token for embedded chat.
 * Uses user_id to create a chat-scoped token.
 */
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  try {
    const client = getWhopApi();

    const tokenResponse = await client.accessTokens.create({
      user_id: userId,
    });

    return NextResponse.json({
      token: tokenResponse.token,
      expiresAt: tokenResponse.expires_at,
    });
  } catch (error) {
    console.error("Failed to create chat access token:", error);
    return NextResponse.json(
      { error: "Failed to generate access token" },
      { status: 500 }
    );
  }
}
