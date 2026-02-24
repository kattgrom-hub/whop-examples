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
    const { name, companyId } = body;

    if (!name || !companyId) {
      return NextResponse.json(
        { error: "name and companyId are required" },
        { status: 400 }
      );
    }

    const whop = new Whop({ apiKey });

    // Discover the chat app_id from existing experiences
    let chatAppId: string | null = null;
    for await (const exp of whop.experiences.list({
      company_id: companyId,
    })) {
      if (exp.app.name.toLowerCase() === "chat") {
        chatAppId = exp.app.id;
        break;
      }
    }

    if (!chatAppId) {
      return NextResponse.json(
        { error: "No chat app found on this server. Add a chat experience first via the Whop dashboard." },
        { status: 400 }
      );
    }

    // Create a new chat experience
    const experience = await whop.experiences.create({
      app_id: chatAppId,
      company_id: companyId,
      name,
    });

    // Find the newly created chat channel
    let newChannel: { id: string; name: string } | null = null;
    for await (const ch of whop.chatChannels.list({
      company_id: companyId,
    })) {
      if (ch.experience.id === experience.id) {
        newChannel = { id: ch.id, name: ch.experience.name };
        break;
      }
    }

    return NextResponse.json({
      channel: newChannel ?? { id: experience.id, name: experience.name },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to create channel" },
      { status: 500 }
    );
  }
}
