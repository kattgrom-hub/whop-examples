import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getUser, getUserRole, setUserRole, upsertUser } from "@/lib/db";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

async function findAccountByList(client: ReturnType<typeof getWhopApi>, userId: string) {
  const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
  for await (const account of accounts) {
    const meta = account.metadata as Record<string, string> | undefined;
    if (account.owner_user?.id === userId || meta?.user_id === userId) return account;
  }
  return null;
}

async function enrichWithRole(account: Record<string, unknown>, userId: string) {
  const role = await getUserRole(userId);
  const meta = (account.metadata as Record<string, string>) || {};
  return { ...account, metadata: { ...meta, role } };
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();
    const user = await getUser(userId);

    // Fast path: blob has whop_company_id, use direct retrieve
    if (user?.whop_company_id) {
      const company = await client.companies.retrieve(user.whop_company_id);
      return NextResponse.json({ company: await enrichWithRole(company as unknown as Record<string, unknown>, userId) });
    }

    // Slow path: fall back to list scan to find the account
    try {
      const account = await findAccountByList(client, userId);
      if (account) {
        await upsertUser({
          id: userId,
          username: user?.username || `user_${userId.slice(-6)}`,
          email: user?.email || "",
          whop_company_id: account.id,
        });
        return NextResponse.json({ company: await enrichWithRole(account as unknown as Record<string, unknown>, userId) });
      }
    } catch {
      // companies.list may be rate-limited or unavailable; treat as not found
    }

    return NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, email, name, role, username } = await request.json();
    if (!userId || !email) return NextResponse.json({ error: "userId and email required" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const client = getWhopApi();
    const user = await getUser(userId);
    const displayName = username || name || `user_${userId.slice(-6)}`;

    // Fast path: blob has whop_company_id
    if (user?.whop_company_id) {
      const company = await client.companies.retrieve(user.whop_company_id);
      if (role) await setUserRole(userId, role);
      return NextResponse.json({ company: await enrichWithRole(company as unknown as Record<string, unknown>, userId), created: false });
    }

    // Slow path: list scan to find existing account
    let existing = null;
    try {
      existing = await findAccountByList(client, userId);
    } catch {
      // companies.list may be rate-limited or unavailable
    }
    if (existing) {
      await upsertUser({
        id: userId,
        username: displayName,
        email,
        name,
        role: role || undefined,
        whop_company_id: existing.id,
      });
      if (role) await setUserRole(userId, role);
      return NextResponse.json({ company: await enrichWithRole(existing as unknown as Record<string, unknown>, userId), created: false });
    }

    // No existing account — create one
    try {
      const newAccount = await client.companies.create({
        email,
        parent_company_id: PLATFORM_COMPANY_ID,
        title: name || `Player ${userId.slice(-6)}`,
        metadata: { user_id: userId, email },
      });

      await upsertUser({
        id: userId,
        username: displayName,
        email,
        name,
        role: role || undefined,
        whop_company_id: newAccount.id,
      });

      return NextResponse.json({ company: await enrichWithRole(newAccount as unknown as Record<string, unknown>, userId), created: true });
    } catch (createError) {
      const msg = createError instanceof Error ? createError.message : String(createError);
      // Company already exists but we couldn't find it (rate limited list).
      // Return 409 so the frontend knows to retry later instead of looping.
      if (msg.includes("already") && msg.includes("same name")) {
        return NextResponse.json({ error: "Company exists but lookup is rate-limited. Retry shortly." }, { status: 409 });
      }
      throw createError;
    }
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
    const user = await getUser(userId);

    let account;
    if (user?.whop_company_id) {
      account = await client.companies.retrieve(user.whop_company_id);
    } else {
      try {
        account = await findAccountByList(client, userId);
      } catch {
        // companies.list may be rate-limited or unavailable
      }
      if (account) {
        await upsertUser({
          id: userId,
          username: user?.username || `user_${userId.slice(-6)}`,
          email: user?.email || "",
          whop_company_id: account.id,
        });
      }
    }

    if (!account) return NextResponse.json({ error: "Account not found" }, { status: 404 });

    if (role) await setUserRole(userId, role);

    return NextResponse.json({ success: true, company: await enrichWithRole(account as unknown as Record<string, unknown>, userId) });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}
