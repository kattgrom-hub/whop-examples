import { whopConfig, WHOP_OAUTH_SCOPES } from "./whop-sdk";

const TOKEN_STORAGE_KEY = "whop_tokens";
const USER_STORAGE_KEY = "whop_user";
const PKCE_VERIFIER_KEY = "whop_pkce_verifier";

export interface WhopTokens {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
  token_type: string;
}

export interface WhopUserInfo {
  id: string;
  username: string;
  email: string;
  profile_pic_url?: string;
  name?: string;
}

/**
 * Generate a random string for PKCE code verifier
 */
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate code challenge from verifier using SHA-256
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(digest)));
  // Convert to base64url
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Generate a random nonce
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate the Whop OAuth authorization URL
 */
export async function getWhopAuthUrl(state?: string): Promise<string> {
  // Generate PKCE values
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const nonce = generateNonce();

  // Store verifier for later use in token exchange
  if (typeof window !== "undefined") {
    sessionStorage.setItem(PKCE_VERIFIER_KEY, codeVerifier);
  }

  const params = new URLSearchParams({
    client_id: whopConfig.appId,
    redirect_uri: whopConfig.redirectUri,
    response_type: "code",
    scope: WHOP_OAUTH_SCOPES.join(" "),
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    nonce,
    ...(state && { state }),
  });

  return `https://api.whop.com/oauth/authorize?${params.toString()}`;
}

/**
 * Start the Whop OAuth flow
 */
export async function startWhopOAuth(redirectPath?: string): Promise<void> {
  const state = redirectPath
    ? btoa(JSON.stringify({ redirect: redirectPath }))
    : undefined;
  const authUrl = await getWhopAuthUrl(state);
  window.location.href = authUrl;
}

/**
 * Exchange authorization code for tokens (call from callback page)
 */
export async function exchangeCodeForTokens(
  code: string
): Promise<WhopTokens> {
  // Get the stored code verifier
  const codeVerifier = typeof window !== "undefined"
    ? sessionStorage.getItem(PKCE_VERIFIER_KEY)
    : null;

  const response = await fetch("/api/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, codeVerifier }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to exchange code for tokens");
  }

  // Clear the verifier after use
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(PKCE_VERIFIER_KEY);
  }

  const tokens = await response.json();
  return tokens;
}

/**
 * Handle the OAuth callback - exchange code and get user info
 */
export async function handleWhopCallback(code: string): Promise<{
  tokens: WhopTokens;
  user: WhopUserInfo;
}> {
  const tokens = await exchangeCodeForTokens(code);
  const user = await getUserInfo(tokens.access_token);
  return { tokens, user };
}

/**
 * Get user info from Whop API (OAuth userinfo endpoint)
 */
export async function getUserInfo(accessToken: string): Promise<WhopUserInfo> {
  const response = await fetch("https://api.whop.com/oauth/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("User info fetch failed:", response.status, errorText);
    throw new Error(`Failed to get user info: ${response.status}`);
  }

  const data = await response.json();

  // Map OIDC userinfo fields to our WhopUserInfo interface
  return {
    id: data.sub,
    username: data.username || data.name || "",
    email: data.email || "",
    profile_pic_url: data.picture,
    name: data.name,
  };
}

/**
 * Store tokens in localStorage
 */
export function storeTokens(tokens: WhopTokens): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  }
}

/**
 * Get stored tokens
 */
export function getTokens(): WhopTokens | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Store user info in localStorage
 */
export function storeUser(user: WhopUserInfo): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

/**
 * Get stored user
 */
export function getStoredUser(): WhopUserInfo | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

/**
 * Clear all auth data (logout)
 */
export function clearAuthData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    sessionStorage.removeItem(PKCE_VERIFIER_KEY);
  }
}

/**
 * Check if tokens are expired
 */
export function isTokenExpired(tokens: WhopTokens): boolean {
  if (!tokens.expires_at) return false;
  return Date.now() >= tokens.expires_at * 1000;
}

/**
 * Logout - clear tokens and redirect
 */
export function logout(): void {
  clearAuthData();
  window.location.href = "/";
}
