import { NextRequest, NextResponse } from "next/server";
import { whopConfig } from "@/lib/whop-sdk";

export async function POST(request: NextRequest) {
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

    const tokenResponse = await fetch("https://api.whop.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: whopConfig.appId,
        code,
        code_verifier: codeVerifier,
        redirect_uri: whopConfig.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text();
      console.error("Token exchange failed:", tokenResponse.status, errorBody);
      console.error("Request params:", {
        client_id: whopConfig.appId,
        redirect_uri: whopConfig.redirectUri,
        grant_type: "authorization_code",
      });
      return NextResponse.json(
        { error: `Token exchange failed: ${errorBody}` },
        { status: 400 }
      );
    }

    const tokens = await tokenResponse.json();

    if (tokens.expires_in && !tokens.expires_at) {
      tokens.expires_at = Math.floor(Date.now() / 1000) + tokens.expires_in;
    }

    return NextResponse.json(tokens);
  } catch (error) {
    console.error("Token exchange error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
