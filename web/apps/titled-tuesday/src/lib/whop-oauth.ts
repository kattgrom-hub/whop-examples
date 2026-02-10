import { whopConfig, WHOP_OAUTH_SCOPES } from "./whop-sdk";

const TOKEN_KEY = "whop_tokens";
const USER_KEY = "whop_user";
const PKCE_KEY = "whop_pkce_verifier";

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

function generateCodeVerifier(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function generateNonce(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function startWhopOAuth(redirectPath?: string): Promise<void> {
  const verifier = generateCodeVerifier();
  const challenge = await generateCodeChallenge(verifier);
  localStorage.setItem(PKCE_KEY, verifier);

  const params = new URLSearchParams({
    client_id: whopConfig.appId,
    redirect_uri: whopConfig.redirectUri,
    response_type: "code",
    scope: WHOP_OAUTH_SCOPES.join(" "),
    code_challenge: challenge,
    code_challenge_method: "S256",
    nonce: generateNonce(),
    ...(redirectPath && { state: btoa(JSON.stringify({ redirect: redirectPath })) }),
  });
  window.location.href = `https://api.whop.com/oauth/authorize?${params}`;
}

export async function exchangeCodeForTokens(code: string): Promise<WhopTokens> {
  const verifier = localStorage.getItem(PKCE_KEY);
  const res = await fetch("/api/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, codeVerifier: verifier }),
  });
  if (!res.ok) throw new Error((await res.json()).error || "Token exchange failed");
  localStorage.removeItem(PKCE_KEY);
  return res.json();
}

export async function getUserInfo(accessToken: string): Promise<WhopUserInfo> {
  const res = await fetch("https://api.whop.com/oauth/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`Failed to get user info: ${res.status}`);
  const data = await res.json();
  return { id: data.sub, username: data.username || data.name || "", email: data.email || "", profile_pic_url: data.picture, name: data.name };
}

export const storeTokens = (t: WhopTokens) => localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
export const getTokens = (): WhopTokens | null => { const s = localStorage.getItem(TOKEN_KEY); return s ? JSON.parse(s) : null; };
export const storeUser = (u: WhopUserInfo) => localStorage.setItem(USER_KEY, JSON.stringify(u));
export const getStoredUser = (): WhopUserInfo | null => { const s = localStorage.getItem(USER_KEY); return s ? JSON.parse(s) : null; };
export const clearAuthData = () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); localStorage.removeItem(PKCE_KEY); };
export const isTokenExpired = (t: WhopTokens) => t.expires_at ? Date.now() >= t.expires_at * 1000 : false;
