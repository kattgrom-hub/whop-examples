import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Connected Account API
 *
 * In production, this creates and manages connected accounts (sub-companies)
 * for each coach. This enables:
 * - Per-coach earnings tracking
 * - Direct payouts to coaches
 * - Multi-vendor marketplace functionality
 *
 * This demo version returns mock account data.
 */

// Mock connected account data
const MOCK_CONNECTED_ACCOUNT = {
  id: "company_demo_abc",
  title: "Demo Coach Inc",
  route: "demo-coach",
  owner_user: {
    id: "user_demo_12345",
  },
  metadata: {
    user_id: "user_demo_12345",
    email: "demo@example.com",
  },
};

export async function POST(request: NextRequest) {
  console.log("🏦 [Demo] Creating connected account");

  try {
    const { userId, email, name } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: "userId and email required" }, { status: 400 });
    }

    console.log("📋 [Demo] New coach account:");
    console.log(`   User ID: ${userId}`);
    console.log(`   Email: ${email}`);
    console.log(`   Name: ${name || "Coach"}`);

    const mockAccount = {
      ...MOCK_CONNECTED_ACCOUNT,
      title: name || `Coach ${userId}`,
      metadata: {
        user_id: userId,
        email: email,
      },
    };

    return NextResponse.json({ company: mockAccount, created: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown";
    return NextResponse.json({ error: `Failed: ${msg}` }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  console.log("🔍 [Demo] Looking up connected account");

  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  // In demo mode, always return the mock account
  return NextResponse.json({ company: MOCK_CONNECTED_ACCOUNT });
}
