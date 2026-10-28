import { NextResponse } from "next/server";
import type { Session } from "next-auth";

const headers = { "Cache-Control": "private, no-store" };

export async function createWalletTokenResponse(session: Session | null) {
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to view your balance." }, { status: 401, headers });
  }
  // Account identity comes only from the signed session, never query parameters.
  const companyId = (session.user as { companyId?: string }).companyId;
  const accountId = companyId || session.user.id;
  const business = Boolean(companyId);
  const credential = business ? process.env.WHOP_API_KEY : session.accessToken;
  if (!credential || !(business ? /^biz_/ : /^user_/).test(accountId)) {
    return NextResponse.json({ error: "Wallet access is unavailable. Sign in again or contact support." }, { status: 403, headers });
  }
  try {
    const response = await fetch("https://api.whop.com/api/v1/access_tokens", {
      method: "POST",
      headers: { Authorization: `Bearer ${credential}`, "Content-Type": "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        ...(business ? { account_id: accountId } : {}),
        scoped_actions: business ? ["company:balance:read", "stats:read"] : ["user:balance:read"],
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      }),
    });
    if (!response.ok) throw new Error("Token request failed");
    const data = await response.json();
    if (typeof data.token !== "string" || !Number.isFinite(Date.parse(data.expires_at))) throw new Error("Invalid token response");
    return NextResponse.json({ accountId, token: data.token, expiresAt: data.expires_at }, { headers });
  } catch {
    return NextResponse.json({ error: "Could not load your balance. Try signing in again." }, { status: 502, headers });
  }
}
