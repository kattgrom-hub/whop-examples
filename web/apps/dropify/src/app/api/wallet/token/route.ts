import { NextResponse, type NextRequest } from "next/server";
import { getWalletCredential } from "@/lib/wallet-auth";
import { getWhopEnvironment } from "@/lib/checkout-config";

const headers = { "Cache-Control": "no-store" };

export async function GET(request: NextRequest) {
  if (process.env.WHOP_WALLET_ENABLED !== "true") {
    return NextResponse.json({ error: "Wallet access is awaiting authorized validation." }, { status: 503, headers });
  }
  let environment: "sandbox" | "production";
  try { environment = getWhopEnvironment(); } catch {
    return NextResponse.json({ error: "Wallet environment is not configured correctly." }, { status: 503, headers });
  }
  const scopes = (process.env.WHOP_WALLET_OAUTH_SCOPES || "").split(",").map(s => s.trim()).filter(Boolean);
  if (!scopes.length || scopes.some(s => !/^[A-Za-z0-9_:.-]+$/.test(s))) {
    return NextResponse.json({ error: "Configure approved wallet permissions." }, { status: 503, headers });
  }
  const session = await getWalletCredential(request);
  if (!session?.id || typeof session.accessToken !== "string" || !session.accessToken) {
    return NextResponse.json({ error: "Sign in to Whop to open your wallet." }, { status: 401, headers });
  }
  if (!/^user_[A-Za-z0-9]+$/.test(session.id as string)) {
    return NextResponse.json({ error: "Your Whop account could not be verified." }, { status: 403, headers });
  }

  if (session.walletEnvironment !== environment) {
    return NextResponse.json({ error: "Whop OAuth and wallet environments do not match." }, { status: 403, headers });
  }
  if (typeof session.walletExpiresAt !== "number" || session.walletExpiresAt * 1000 <= Date.now()) {
    return NextResponse.json({ error: "Your Whop session expired. Please sign in again." }, { status: 401, headers });
  }
  const granted = typeof session.walletScopes === "string" ? session.walletScopes.split(/\s+/) : [];
  if (!scopes.every(scope => granted.includes(scope))) {
    return NextResponse.json({ error: "Sign in again and grant the approved wallet permissions." }, { status: 403, headers });
  }

  try {
    const expiresAt = new Date(Math.min(Date.now() + 15 * 60 * 1000, session.walletExpiresAt * 1000)).toISOString();
    const response = await fetch(
      `${environment === "sandbox" ? "https://sandbox-api.whop.com" : "https://api.whop.com"}/api/v1/access_tokens`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json" },
        // OAuth derives the user. Never use an API key or accept a client-supplied account ID.
        // Explicitly narrow the embedded token to configured, viewer-granted permissions.
        body: JSON.stringify({ expires_at: expiresAt, scoped_actions: scopes }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );
    if (!response.ok) {
      return NextResponse.json(
        { error: response.status === 401 ? "Your Whop session expired. Please sign in again." : "Whop could not authorize your wallet. Check your app's wallet permissions." },
        { status: response.status === 401 ? 401 : 502, headers }
      );
    }
    const data = await response.json();
    if (typeof data.token !== "string" || !data.token || !Number.isFinite(Date.parse(data.expires_at)) || Date.parse(data.expires_at) <= Date.now()) {
      throw new Error("Invalid wallet token response");
    }
    return NextResponse.json({ token: data.token, expiresAt: data.expires_at, accountId: session.id as string }, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to connect to Whop. Please try again." }, { status: 502, headers });
  }
}
