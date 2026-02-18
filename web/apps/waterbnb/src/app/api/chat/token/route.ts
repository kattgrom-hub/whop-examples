import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Return the user's OAuth access token for embedded chat components.
 */
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const token = session.accessToken;
  if (!token) {
    return NextResponse.json(
      { error: "No access token available" },
      { status: 500 }
    );
  }

  return NextResponse.json({ token });
}
