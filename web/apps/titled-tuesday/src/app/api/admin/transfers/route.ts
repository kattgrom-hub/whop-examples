import { NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

export async function GET() {
  try {
    const client = getWhopApi();
    const transfers: Array<Record<string, unknown>> = [];

    for await (const transfer of await client.transfers.list()) {
      transfers.push({
        id: transfer.id,
        amount: transfer.amount,
        currency: transfer.currency,
        origin_ledger_account_id: transfer.origin_ledger_account_id,
        destination_ledger_account_id: transfer.destination_ledger_account_id,
        fee_amount: transfer.fee_amount,
        metadata: transfer.metadata,
        notes: transfer.notes,
        created_at: transfer.created_at,
      });
    }

    transfers.sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime());

    return NextResponse.json({ transfers });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
