import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getUserRole, setUserRole } from "@/lib/user-store";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

async function findAccountByUserId(client: ReturnType<typeof getWhopApi>, userId: string) {
  const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
  for await (const account of accounts) {
    const meta = account.metadata as Record<string, string> | undefined;
    if (account.owner_user?.id === userId || meta?.user_id === userId) return account;
  }
  return null;
}

function enrichWithRole(account: Record<string, unknown>, userId: string) {
  const role = getUserRole(userId);
  const meta = (account.metadata as Record<string, string>) || {};
  return { ...account, metadata: { ...meta, role } };
}

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name, role } = await request.json();
    if (!userId || !email) return NextResponse.json({ error: "userId and email required" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const client = getWhopApi();
    const existing = await findAccountByUserId(client, userId);
    if (existing) {
      if (role) setUserRole(userId, role);
      return NextResponse.json({ company: enrichWithRole(existing as unknown as Record<string, unknown>, userId), created: false });
    }

    if (role) setUserRole(userId, role);

    const newAccount = await client.companies.create({
      email,
      parent_company_id: PLATFORM_COMPANY_ID,
      title: name || `Angler ${userId.slice(-6)}`,
      metadata: { user_id: userId, email },
    });
    return NextResponse.json({ company: enrichWithRole(newAccount as unknown as Record<string, unknown>, userId), created: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown";
    if (msg.includes("already exists")) {
      const client = getWhopApi();
      const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
      for await (const account of accounts) {
        const meta = account.metadata as Record<string, string> | undefined;
        const uid = meta?.user_id || account.owner_user?.id || "";
        return NextResponse.json({ company: enrichWithRole(account as unknown as Record<string, unknown>, uid), created: false });
      }
    }
    return NextResponse.json({ error: `Failed: ${msg}` }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const account = await findAccountByUserId(getWhopApi(), userId);
    if (account) return NextResponse.json({ company: enrichWithRole(account as unknown as Record<string, unknown>, userId) });
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, role } = await request.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const client = getWhopApi();
    const account = await findAccountByUserId(client, userId);
    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    if (role) setUserRole(userId, role);

    return NextResponse.json({ success: true, company: enrichWithRole(account as unknown as Record<string, unknown>, userId) });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}
