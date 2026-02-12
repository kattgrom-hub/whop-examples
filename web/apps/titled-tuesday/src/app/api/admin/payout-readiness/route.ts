import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

export async function GET(request: NextRequest) {
  const companyId = request.nextUrl.searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }

  try {
    const client = getWhopApi();

    // Get ledger account for KYC/verification status
    const ledger = await client.ledgerAccounts.retrieve(companyId);
    const verification = ledger.payout_account_details?.latest_verification;
    const approvalStatus = ledger.payments_approval_status;

    // Get payout methods
    const methods = [];
    for await (const method of await client.payoutMethods.list({ company_id: companyId })) {
      methods.push({
        id: method.id,
        is_default: method.is_default,
        institution_name: method.institution_name,
        account_reference: method.account_reference,
        destination: method.destination,
      });
    }
    const defaultMethod = methods.find((m) => m.is_default);

    return NextResponse.json({
      approvalStatus,
      verification: verification
        ? { status: verification.status, errorCode: verification.last_error_code, errorReason: verification.last_error_reason }
        : null,
      hasPayoutMethod: methods.length > 0,
      defaultMethod: defaultMethod || null,
    });
  } catch (error) {
    console.error("Error checking payout readiness:", error);
    return NextResponse.json({ error: "Failed to check readiness" }, { status: 500 });
  }
}
