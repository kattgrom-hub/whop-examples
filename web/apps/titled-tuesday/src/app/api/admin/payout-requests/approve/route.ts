import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getPayoutRequest, approvePayoutRequest } from "@/lib/db";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function POST(request: NextRequest) {
  try {
    const { requestId, adminUserId } = await request.json();
    if (!requestId) return NextResponse.json({ error: "requestId required" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const payoutRequest = await getPayoutRequest(requestId);
    if (!payoutRequest) return NextResponse.json({ error: "Request not found" }, { status: 404 });
    if (payoutRequest.status !== "pending") {
      return NextResponse.json({ error: "Request already resolved" }, { status: 400 });
    }

    const client = getWhopApi();

    // Hard gate 1: Check KYC / verification status via ledger account
    const ledgerAccount = await client.ledgerAccounts.retrieve(payoutRequest.requester_company_id);

    const verificationStatus = ledgerAccount.payout_account_details?.latest_verification?.status;
    const approvalStatus = ledgerAccount.payments_approval_status;

    if (approvalStatus === "rejected") {
      return NextResponse.json(
        { error: "User's account has been rejected. They cannot receive payouts." },
        { status: 400 }
      );
    }

    if (approvalStatus === "pending") {
      return NextResponse.json(
        { error: "User's account is pending approval. They must complete onboarding first." },
        { status: 400 }
      );
    }

    if (verificationStatus && !["verified", "approved"].includes(verificationStatus)) {
      return NextResponse.json(
        { error: `User's KYC verification status is "${verificationStatus}". They must complete verification before payout.` },
        { status: 400 }
      );
    }

    // Hard gate 2: User MUST have a default payout method
    const seen = new Set<string>();
    const methods = [];
    for await (const method of await client.payoutMethods.list({
      company_id: payoutRequest.requester_company_id,
    })) {
      if (!seen.has(method.id)) {
        seen.add(method.id);
        methods.push(method);
      }
    }
    const defaultMethod = methods.find((m) => m.is_default);

    if (!defaultMethod) {
      return NextResponse.json(
        { error: "User has no payout method set up. They must add a payout method before approval." },
        { status: 400 }
      );
    }

    // Hard gate 3: Check platform balance
    try {
      const platformLedger = await client.ledgerAccounts.retrieve(PLATFORM_COMPANY_ID);
      const usdBalance = platformLedger.balances?.find((b) => b.currency === "usd");
      const available = usdBalance?.balance ?? 0;
      if (available < payoutRequest.amount) {
        return NextResponse.json({ error: "Insufficient platform balance" }, { status: 400 });
      }
    } catch (balanceError) {
      console.warn("Could not check platform balance:", balanceError);
    }

    // Step 1: Transfer funds from platform to user's ledger
    const transfer = await client.transfers.create({
      amount: payoutRequest.amount,
      currency: "usd",
      origin_id: PLATFORM_COMPANY_ID,
      destination_id: payoutRequest.requester_company_id,
      metadata: {
        request_id: requestId,
        tournament_id: payoutRequest.tournament_id || "",
        type: payoutRequest.reason || "",
      },
      notes: `${payoutRequest.tournament_title || "Tournament"} - ${payoutRequest.reason}`.slice(0, 50),
      idempotence_key: requestId,
    });

    // Step 2: Mark approved in DB immediately so retries won't re-trigger the flow
    await approvePayoutRequest(requestId, transfer.id, adminUserId);

    // Step 3: Create withdrawal to user's default payout method
    // Amount in major units (dollars) for withdrawals API
    const amountDollars = payoutRequest.amount / 100;

    const withdrawal = await client.withdrawals.create({
      company_id: payoutRequest.requester_company_id,
      amount: amountDollars,
      currency: "usd",
      payout_method_id: defaultMethod.id,
    });

    return NextResponse.json({
      success: true,
      transfer: { id: transfer.id },
      withdrawal: { id: withdrawal.id },
    });
  } catch (error) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` },
      { status: 500 }
    );
  }
}
