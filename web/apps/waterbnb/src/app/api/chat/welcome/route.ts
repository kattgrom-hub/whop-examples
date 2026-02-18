import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getWhopApi } from "@/lib/whop-sdk";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

/**
 * Send a welcome message in a DM channel after a booking.
 *
 * 1. Uses the API key to create/get a DM channel between the guest and host owner
 *    (idempotent — returns existing channel if one already exists).
 * 2. Uses the guest's OAuth token to send a message as the guest.
 */
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.accessToken || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { hostCompanyId, message } = await request.json();

    if (!hostCompanyId || !message) {
      return NextResponse.json(
        { error: "hostCompanyId and message required" },
        { status: 400 }
      );
    }

    const client = getWhopApi();

    // Look up host owner user ID from the host's connected account
    const hostCompany = await client.companies.retrieve(hostCompanyId);
    const hostOwnerUserId = hostCompany.owner_user?.id;

    if (!hostOwnerUserId) {
      return NextResponse.json(
        { error: "Could not find host owner" },
        { status: 404 }
      );
    }

    // Create/get DM channel between guest and host, scoped to the platform company
    const dmChannel = await client.dmChannels.create({
      with_user_ids: [session.user.id, hostOwnerUserId],
      company_id: PLATFORM_COMPANY_ID,
    });

    // Send the message as the guest using their OAuth token
    const msgRes = await fetch("https://api.whop.com/api/v1/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel_id: dmChannel.id,
        content: message,
      }),
    });

    if (!msgRes.ok) {
      const err = await msgRes.text();
      console.error("[chat/welcome] Failed to send message:", msgRes.status, err);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: msgRes.status }
      );
    }

    return NextResponse.json({ channelId: dmChannel.id });
  } catch (error) {
    console.error("[chat/welcome] Error:", error);
    return NextResponse.json(
      { error: "Failed to send welcome message" },
      { status: 500 }
    );
  }
}
