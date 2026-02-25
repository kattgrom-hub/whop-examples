import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function GET(request: NextRequest) {
  const companyId = request.nextUrl.searchParams.get("companyId") || COMPANY_ID;

  if (!companyId) {
    return NextResponse.json(
      { error: "Company not configured" },
      { status: 500 }
    );
  }

  try {
    const client = getWhopApi();

    // Payment methods are stored per-member, not per-company.
    // List setup intents to get payment methods with their member context.
    const setupIntents = await client.setupIntents.list({
      company_id: companyId,
    });

    // Deduplicate payment methods by ID (a member may have multiple setup intents
    // but we only want unique payment methods)
    const seen = new Set<string>();
    const paymentMethods = [];
    for (const si of setupIntents.data) {
      if (si.status === "succeeded" && si.payment_method && !seen.has(si.payment_method.id)) {
        seen.add(si.payment_method.id);
        paymentMethods.push(si.payment_method);
      }
    }

    return NextResponse.json({ data: paymentMethods });
  } catch (error) {
    console.error("Failed to list payment methods:", error);
    return NextResponse.json(
      { error: "Failed to list payment methods" },
      { status: 500 }
    );
  }
}
