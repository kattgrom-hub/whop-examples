import Whop from "@whop/sdk";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.WHOP_API_KEY;
  const companyId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

  if (!apiKey || !companyId) {
    return NextResponse.json(
      { error: "Missing configuration" },
      { status: 500 }
    );
  }

  const whop = new Whop({ apiKey });

  try {
    const members: Array<{
      id: string;
      userId: string;
      userName: string;
      profilePicUrl: string | null;
    }> = [];

    for await (const membership of whop.memberships.list({
      company_id: companyId,
      first: 50,
    })) {
      if (membership.user) {
        members.push({
          id: membership.id,
          userId: membership.user.id,
          userName:
            membership.user.username ??
            membership.user.name ??
            membership.user.id,
          profilePicUrl: null,
        });
      }
    }

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Members error:", error);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 }
    );
  }
}
