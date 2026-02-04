/**
 * Mock OAuth Implementation
 *
 * This is a demo version that simulates an OAuth flow.
 * In production, this would connect to your OAuth provider.
 */

const TOKEN_KEY = "auth_tokens";
const USER_KEY = "auth_user";
const PKCE_KEY = "auth_pkce_verifier";

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  token_type: string;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  profile_pic_url?: string;
  name?: string;
}

// Mock user data
const MOCK_USER: UserInfo = {
  id: "user_demo_12345",
  username: "demo_coach",
  email: "demo@example.com",
  name: "Demo User",
  profile_pic_url: "https://api.dicebear.com/9.x/notionists/svg?seed=demo",
};

// Mock tokens
const MOCK_TOKENS: AuthTokens = {
  access_token: "demo_access_token_xyz789",
  refresh_token: "demo_refresh_token_abc123",
  expires_at: Math.floor(Date.now() / 1000) + 86400, // 24 hours from now
  token_type: "Bearer",
};

export async function startOAuth(redirectPath?: string): Promise<void> {
  console.log("🔐 Demo mode: Simulating OAuth flow");

  // Store a mock verifier for the flow
  sessionStorage.setItem(PKCE_KEY, "demo_verifier");

  // Build the callback URL with demo code
  const callbackUrl = new URL("/auth/callback", window.location.origin);
  callbackUrl.searchParams.set("code", "demo_code_" + Date.now());

  if (redirectPath) {
    callbackUrl.searchParams.set("state", btoa(JSON.stringify({ redirect: redirectPath })));
  }

  // Redirect to the callback (simulating OAuth flow completion)
  window.location.href = callbackUrl.toString();
}

export async function exchangeCodeForTokens(code: string): Promise<AuthTokens> {
  console.log("🔄 Exchanging code for tokens (demo mode)");

  // Call our mock API endpoint
  const res = await fetch("/api/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, codeVerifier: sessionStorage.getItem(PKCE_KEY) }),
  });

  if (!res.ok) {
    throw new Error((await res.json()).error || "Token exchange failed");
  }

  sessionStorage.removeItem(PKCE_KEY);
  return res.json();
}

export async function getUserInfo(accessToken: string): Promise<UserInfo> {
  console.log("👤 Fetching user info (demo mode)");

  // Return mock user directly (no API call needed in demo)
  return MOCK_USER;
}

export async function handleAuthCallback(code: string) {
  const tokens = await exchangeCodeForTokens(code);
  const user = await getUserInfo(tokens.access_token);
  return { tokens, user };
}

// Storage helpers - these work the same in demo mode
export const storeTokens = (t: AuthTokens) => localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
export const getTokens = (): AuthTokens | null => {
  const s = localStorage.getItem(TOKEN_KEY);
  return s ? JSON.parse(s) : null;
};
export const storeUser = (u: UserInfo) => localStorage.setItem(USER_KEY, JSON.stringify(u));
export const getStoredUser = (): UserInfo | null => {
  const s = localStorage.getItem(USER_KEY);
  return s ? JSON.parse(s) : null;
};
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(PKCE_KEY);
};
export const isTokenExpired = (t: AuthTokens) => t.expires_at ? Date.now() >= t.expires_at * 1000 : false;
export const logout = () => {
  clearAuthData();
  window.location.href = "/";
};

// Export mock data for use elsewhere
export { MOCK_USER, MOCK_TOKENS };
