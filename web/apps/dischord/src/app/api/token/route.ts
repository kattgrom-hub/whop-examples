import Whop from "@whop/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiKey = process.env.WHOP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key configured" },
      { status: 500 }
    );
  }

  // Accept companyId from query params for business-scoped tokens
  const companyId =
    request.nextUrl.searchParams.get("companyId") ||
    process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

  if (!companyId) {
    return NextResponse.json(
      { error: "No company ID provided" },
      { status: 400 }
    );
  }

  try {
    const whop = new Whop({ apiKey });
    const tokenResponse = await whop.accessTokens.create({
      company_id: companyId,
    });
    return NextResponse.json({ token: tokenResponse.token });
  } catch {
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    );
  }
}
