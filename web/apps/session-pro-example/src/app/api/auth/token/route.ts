import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Token Exchange API
 *
 * In production, this exchanges an OAuth authorization code for access tokens.
 * This demo version returns mock tokens immediately.
 */

// Mock tokens that match our mock OAuth flow
const MOCK_TOKENS = {
  access_token: "demo_access_token_xyz789",
  refresh_token: "demo_refresh_token_abc123",
  expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
  token_type: "Bearer",
};

export async function POST(request: NextRequest) {
  console.log("🔐 [Demo] Token exchange endpoint called");

  try {
    const { code, codeVerifier } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    if (!codeVerifier) {
      return NextResponse.json(
        { error: "Code verifier is required for PKCE" },
        { status: 400 }
      );
    }

    console.log("📝 [Demo] Received code:", code);

    // In demo mode, just return mock tokens
    return NextResponse.json(MOCK_TOKENS);
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
