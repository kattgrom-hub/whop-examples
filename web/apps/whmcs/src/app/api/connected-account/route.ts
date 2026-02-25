import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function POST(request: NextRequest) {
  if (!PLATFORM_COMPANY_ID) {
    return NextResponse.json(
      { error: "Platform company not configured" },
      { status: 500 }
    );
  }

  try {
    const { email, name } = (await request.json()) as {
      email: string;
      name?: string;
    };

    if (!email) {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }

    const client = getWhopApi();

    const company = await client.companies.create({
      email,
      parent_company_id: PLATFORM_COMPANY_ID,
      title: name || `WHMCS User ${email.split("@")[0]}`,
    });

    return NextResponse.json({
      companyId: company.id,
      title: company.title,
    });
  } catch (error) {
    console.error("Failed to create connected account:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
