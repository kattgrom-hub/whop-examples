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
    const { talentId, talentName } = (await request.json()) as {
      talentId: string;
      talentName: string;
    };

    if (!talentId) {
      return NextResponse.json(
        { error: "talentId is required" },
        { status: 400 }
      );
    }

    const client = getWhopApi();

    // Check if connected account already exists for this talent
    const existing = await client.companies.list({
      parent_company_id: PLATFORM_COMPANY_ID,
    });

    const found = existing.data.find(
      (c) => c.metadata?.talent_id === talentId
    );

    if (found) {
      return NextResponse.json({
        companyId: found.id,
        title: found.title,
        created: false,
      });
    }

    // Create new connected account for the talent
    const company = await client.companies.create({
      email: `${talentId}@grail-talent.demo`,
      parent_company_id: PLATFORM_COMPANY_ID,
      title: talentName || `Talent ${talentId}`,
      metadata: {
        talent_id: talentId,
      },
    });

    return NextResponse.json({
      companyId: company.id,
      title: company.title,
      created: true,
    });
  } catch (error) {
    console.error("Failed to create connected account:", error);
    return NextResponse.json(
      { error: "Failed to create connected account" },
      { status: 500 }
    );
  }
}
