import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Generate an access token for embedded chat.
 * Uses the caller's OAuth access token to create a short-lived
 * component token via the Whop API. The access_tokens endpoint
 * with OAuth auth derives the user from the token automatically.
 */
export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch("https://api.whop.com/api/v1/access_tokens", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[chat/token] Whop access token API error:", res.status, err);
      return NextResponse.json(
        { error: "Failed to generate access token" },
        { status: res.status }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      token: data.token,
      expiresAt: data.expires_at,
    });
  } catch (error) {
    console.error("Failed to create chat access token:", error);
    return NextResponse.json(
      { error: "Failed to generate access token" },
      { status: 500 }
    );
  }
}
