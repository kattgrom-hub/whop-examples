import { NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function GET() {
  if (!PLATFORM_COMPANY_ID) {
    return NextResponse.json({ error: "Platform not configured" }, { status: 500 });
  }

  try {
    const client = getWhopApi();
    const ledger = await client.ledgerAccounts.retrieve(PLATFORM_COMPANY_ID);

    return NextResponse.json({
      balances: ledger.balances || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
