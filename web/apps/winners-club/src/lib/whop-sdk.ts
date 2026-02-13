import Whop from "@whop/sdk";

/**
 * Whop SDK Configuration
 *
 * Environment variables required:
 * - WHOP_API_KEY: Your Whop API key (from dashboard)
 * - NEXT_PUBLIC_WHOP_APP_ID: Your Whop App ID (client_id for OAuth)
 * - NEXT_PUBLIC_WHOP_COMPANY_ID: Your Whop Company ID
 */

// Lazy-loaded server-side SDK instance (only use in server components/API routes)
let _whopApi: Whop | null = null;

export function getWhopApi(): Whop {
  if (!_whopApi) {
    if (!process.env.WHOP_API_KEY) {
      throw new Error("WHOP_API_KEY environment variable is required");
    }
    _whopApi = new Whop({
      apiKey: process.env.WHOP_API_KEY,
    });
  }
  return _whopApi;
}

// Client-side configuration (safe to use anywhere)
export const whopConfig = {
  appId: process.env.NEXT_PUBLIC_WHOP_APP_ID || "",
  companyId: process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "",
  redirectUri:
    (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003") + "/auth/callback",
};

// OAuth scopes needed for the app
export const WHOP_OAUTH_SCOPES = ["openid", "profile", "email"];
