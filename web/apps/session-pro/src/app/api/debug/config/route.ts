import { NextResponse } from "next/server";
import { whopConfig } from "@/lib/whop-sdk";

/**
 * Debug endpoint to check OAuth configuration
 * GET /api/debug/config
 */
export async function GET() {
  return NextResponse.json({
    appId: whopConfig.appId || "(empty)",
    appIdLength: whopConfig.appId?.length || 0,
    companyId: whopConfig.companyId || "(empty)",
    redirectUri: whopConfig.redirectUri,
    hasApiKey: !!process.env.WHOP_API_KEY,
    // Raw env vars for debugging
    env: {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "(not set)",
      NEXT_PUBLIC_WHOP_APP_ID: process.env.NEXT_PUBLIC_WHOP_APP_ID || "(not set)",
    },
  });
}
