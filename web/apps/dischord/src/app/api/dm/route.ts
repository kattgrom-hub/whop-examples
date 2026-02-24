import Whop from "@whop/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.WHOP_API_KEY;
  const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key configured" },
      { status: 500 }
    );
  }

  try {
    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "At least one user ID is required" },
        { status: 400 }
      );
    }

    const whop = new Whop({ apiKey });
    const channel = await whop.dmChannels.create({
      with_user_ids: userIds,
      ...(companyId ? { company_id: companyId } : {}),
    });

    return NextResponse.json({
      channelId: channel.id,
    });
  } catch (error) {
    console.error("DM creation error:", error);
    return NextResponse.json(
      { error: "Failed to create DM channel" },
      { status: 500 }
    );
  }
}
