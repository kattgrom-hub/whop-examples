import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { upsertInstructorEntry } from "@/lib/blob/instructors-index";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function GET(request: NextRequest) {
  const companyId = request.nextUrl.searchParams.get("companyId");
  if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 });
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();
    const company = await client.companies.retrieve(companyId);
    const meta = company.metadata as Record<string, string> | undefined;

    let categories: string[] = [];
    try {
      if (meta?.categories) categories = JSON.parse(meta.categories);
    } catch {}

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
    const { companyId, userId, name, bio, categories } = await request.json();
    if (!companyId) return NextResponse.json({ error: "companyId required" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const client = getWhopApi();
    const company = await client.companies.retrieve(companyId);
    const existingMeta = (company.metadata as Record<string, string> | undefined) || {};

    const updatedMeta: Record<string, string> = { ...existingMeta };
    if (bio !== undefined) updatedMeta.bio = bio;
    if (categories !== undefined) updatedMeta.categories = JSON.stringify(categories);

    const updatePayload: Record<string, unknown> = { metadata: updatedMeta };
    if (name !== undefined) updatePayload.title = name;

    await (client.companies.update as Function)(companyId, updatePayload);

    let parsedCategories: string[] = [];
    try {
      if (updatedMeta.categories) parsedCategories = JSON.parse(updatedMeta.categories);
    } catch {}

    // Sync blob with updated profile
    await upsertInstructorEntry(companyId, {
      name: name !== undefined ? name : company.title || "",
      avatarUrl: company.logo?.url || "",
      plan: (updatedMeta.plan as "core" | "pro") || "core",
      categories: parsedCategories,
    }, userId || undefined).catch(() => {});

    return NextResponse.json({
      profile: {
        companyId,
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
