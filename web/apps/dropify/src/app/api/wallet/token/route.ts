import { NextResponse } from "next/server";
import { auth } from "@/auth";

const headers = { "Cache-Control": "no-store" };

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !session.accessToken) {
    return NextResponse.json({ error: "Sign in to Whop to open your wallet." }, { status: 401, headers });
  }
  if (!/^user_[A-Za-z0-9]+$/.test(session.user.id)) {
    return NextResponse.json({ error: "Your Whop account could not be verified." }, { status: 403, headers });
  }

  const environment = process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT || "production";
  if (environment !== "production" && environment !== "sandbox") {
    return NextResponse.json({ error: "Wallet environment is not configured correctly." }, { status: 503, headers });
  }

  try {
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const response = await fetch(
      `${environment === "sandbox" ? "https://sandbox-api.whop.com" : "https://api.whop.com"}/api/v1/access_tokens`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}`, "Content-Type": "application/json" },
        // OAuth derives the user. Never use an API key or accept a client-supplied account ID.
        // Inherit only the permissions this viewer authorized through Whop OAuth.
        body: JSON.stringify({ expires_at: expiresAt }),
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
    return NextResponse.json({ token: data.token, expiresAt: data.expires_at, accountId: session.user.id }, { headers });
  } catch {
    return NextResponse.json({ error: "Unable to connect to Whop. Please try again." }, { status: 502, headers });
  }
}
