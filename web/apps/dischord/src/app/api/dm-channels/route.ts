import Whop from "@whop/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.WHOP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "No API key configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { userIds, companyId } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    const whop = new Whop({ apiKey });
    const dmChannel = await whop.dmChannels.create({
      with_user_ids: userIds,
      ...(companyId ? { company_id: companyId } : {}),
    });

    return NextResponse.json({
      channelId: dmChannel.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create DM channel" },
      { status: 500 }
    );
  }
}
