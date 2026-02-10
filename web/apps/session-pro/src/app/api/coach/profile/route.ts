import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { upsertCoachEntry } from "@/lib/blob/coaches-index";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

async function findAccountByUserId(client: ReturnType<typeof getWhopApi>, userId: string) {
  const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
  for await (const account of accounts) {
    const meta = account.metadata as Record<string, string> | undefined;
    if (account.owner_user?.id === userId || meta?.user_id === userId) return account;
  }
  return null;
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();
    const account = await findAccountByUserId(client, userId);
    if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const company = await client.companies.retrieve(account.id);
    const meta = company.metadata as Record<string, string> | undefined;

    let categories: string[] = [];
    try {
      if (meta?.categories) categories = JSON.parse(meta.categories);
    } catch {}

    // Opportunistically sync to blob
    await upsertCoachEntry(company.id, {
      name: company.title || "",
      plan: (meta?.plan as "core" | "pro") || "core",
      categories,
    }).catch(() => {});

    return NextResponse.json({
      profile: {
        companyId: company.id,
        name: company.title || "",
        bio: meta?.bio || "",
        categories,
        logoUrl: company.logo?.url || "",
        plan: meta?.plan || "core",
        createdAt: company.created_at,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, name, bio, categories } = await request.json();
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const client = getWhopApi();
    const account = await findAccountByUserId(client, userId);
    if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const company = await client.companies.retrieve(account.id);
    const existingMeta = (company.metadata as Record<string, string> | undefined) || {};

    const updatedMeta: Record<string, string> = { ...existingMeta };
    if (bio !== undefined) updatedMeta.bio = bio;
    if (categories !== undefined) updatedMeta.categories = JSON.stringify(categories);

    const updatePayload: Record<string, unknown> = { metadata: updatedMeta };
    if (name !== undefined) updatePayload.title = name;

    await (client.companies.update as Function)(account.id, updatePayload);

    let parsedCategories: string[] = [];
    try {
      if (updatedMeta.categories) parsedCategories = JSON.parse(updatedMeta.categories);
    } catch {}

    // Update blob index with new profile data
    await upsertCoachEntry(account.id, {
      name: name !== undefined ? name : company.title || "",
      plan: (updatedMeta.plan as "core" | "pro") || "core",
      categories: parsedCategories,
    }).catch(() => {});

    return NextResponse.json({
      profile: {
        companyId: account.id,
        name: name !== undefined ? name : company.title || "",
        bio: updatedMeta.bio || "",
        categories: parsedCategories,
        logoUrl: company.logo?.url || "",
        plan: updatedMeta.plan || "core",
        createdAt: company.created_at,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}
