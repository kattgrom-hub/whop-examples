import { NextRequest, NextResponse } from "next/server";
import { createElementSession, elementConfig, elementCookie, elementOrigin, readElementSession } from "@/lib/payment-element-server";
export async function POST(request: NextRequest) {
  try {
    elementOrigin(request, true);
    const config = elementConfig();
    const existing = await readElementSession(request);
    const created = existing ? null : await createElementSession(request);
    const session = existing || created?.session;
    if (!session) return NextResponse.json({ error: "Too many attempts. Please wait a minute." }, { status: 429 });
    const response = NextResponse.json({ sessionId: session.id, ...config, reserved: session.reserved }, {
      headers: { "Cache-Control": "no-store", Vary: "Cookie" },
    });
    if (created) response.cookies.set(elementCookie, created.cookie, { httpOnly: true, sameSite: "lax",
      secure: new URL(request.url).protocol === "https:", path: "/api/payment-element", maxAge: 7 * 86400 });
    return response;
  } catch { return NextResponse.json({ error: "Sandbox payment form is unavailable." }, { status: 503 }); }
}
