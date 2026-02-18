import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Generate a short-lived access token for embedded chat components.
 * Uses the user's OAuth token to call accessTokens.create(),
 * which returns a fresh token the embedded components can use.
 */
export async function GET() {
  const session = await auth();

  if (!session?.accessToken) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

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
    console.error("[chat/token] access_tokens API error:", res.status, err);
    return NextResponse.json(
      { error: "Failed to generate access token" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json({ token: data.token });
}
