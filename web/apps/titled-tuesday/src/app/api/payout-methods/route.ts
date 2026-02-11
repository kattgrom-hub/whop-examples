import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

export async function GET(request: NextRequest) {
  const companyId = request.nextUrl.searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }

  try {
    const client = getWhopApi();
    const methods = [];
    for await (const method of await client.payoutMethods.list({ company_id: companyId })) {
      methods.push(method);
    }
    return NextResponse.json({ methods });
  } catch (error) {
    console.error("Error listing payout methods:", error);
    return NextResponse.json({ error: "Failed to list payout methods" }, { status: 500 });
  }
}
