import { NextResponse } from "next/server";
// Superseded by the full hosted Checkout controller. Do not retain a second charge-creation path.
export async function POST() {
  return NextResponse.json({ error: "Start a new checkout from your cart" }, { status: 410 });
}
