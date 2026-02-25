import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3457";

export async function POST(request: NextRequest) {
  if (!PLATFORM_COMPANY_ID) {
    return NextResponse.json(
      { error: "Company not configured" },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as {
      customerId?: string;
      talentId?: string;
      talentName?: string;
      amount?: number;
      connectedAccountId?: string;
    };

    const client = getWhopApi();

    if (body.amount) {
      // Direct charge on the connected account
      const config = await client.checkoutConfigurations.create({
        plan: {
          company_id: body.connectedAccountId || PLATFORM_COMPANY_ID,
          initial_price: body.amount,
          currency: "usd",
          plan_type: "one_time",
          application_fee_amount: Math.round(body.amount * 0.1), // 10% platform fee
        },
        redirect_url: `${APP_URL}/checkout?talent=${body.talentId}&name=${encodeURIComponent(body.talentName || "Creator")}&rate=${body.amount}&status=success`,
        metadata: {
          talent_id: body.talentId || "unknown",
          talent_name: body.talentName || "Creator",
        },
      });

      return NextResponse.json({
        sessionId: config.id,
        purchaseUrl: config.purchase_url,
      });
    } else {
      const config = await client.checkoutConfigurations.create({
        company_id: PLATFORM_COMPANY_ID,
        mode: "setup",
        redirect_url: `${APP_URL}/get-started?status=success`,
        metadata: { customer_id: body.customerId || `demo-${Date.now()}` },
      });

      return NextResponse.json({
        sessionId: config.id,
        purchaseUrl: config.purchase_url,
      });
    }
  } catch (error) {
    console.error("Failed to create checkout config:", error);
    return NextResponse.json(
      { error: "Failed to create checkout configuration" },
      { status: 500 }
    );
  }
}
