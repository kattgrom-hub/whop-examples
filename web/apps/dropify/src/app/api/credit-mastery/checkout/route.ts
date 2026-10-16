import { NextResponse } from "next/server";
import { getAppOrigin } from "@/lib/checkout-config";
import { getCreditMasteryCheckout } from "@/lib/credit-mastery-checkout";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let origin: string;
  try { origin = getAppOrigin(request.url); }
  catch { return NextResponse.json({ error: "Checkout host unavailable" }, { status: 403 }); }
  if (request.headers.get("origin") !== origin) {
    return NextResponse.json({ error: "Checkout origin rejected" }, { status: 403 });
  }
  try {
    const url = await getCreditMasteryCheckout();
    if (url) return new NextResponse(null, { status: 303, headers: { Location: url, "Cache-Control": "no-store" } });
  } catch {
    // No provider response, private release evidence or credentials in the browser.
    console.error("AI Credit Mastery checkout verification unavailable");
  }
  return NextResponse.json({ error: "Purchases currently unavailable." }, {
    status: 503, headers: { "Cache-Control": "no-store" },
  });
}
