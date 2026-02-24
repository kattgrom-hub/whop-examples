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

  const companyId = request.nextUrl.searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json(
      { error: "companyId is required" },
      { status: 400 }
    );
  }

  try {
    const whop = new Whop({ apiKey });
    const channels: { id: string; name: string }[] = [];

    for await (const ch of whop.chatChannels.list({
      company_id: companyId,
    })) {
      channels.push({ id: ch.id, name: ch.experience.name });
    }

    return NextResponse.json({ channels });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 }
    );
  }
}
