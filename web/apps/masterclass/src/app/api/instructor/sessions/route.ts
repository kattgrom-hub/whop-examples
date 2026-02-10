import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { upsertInstructorEntry, getCompanyIdByUserId } from "@/lib/blob/instructors-index";
import {
  upsertClass,
  removeClass,
  type ClassIndexEntry,
} from "@/lib/blob/classes-index";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

async function findInstructorCompanyId(client: ReturnType<typeof getWhopApi>, userId: string): Promise<string | null> {
  // Fast path: check blob index first
  const cached = await getCompanyIdByUserId(userId).catch(() => null);
  if (cached) return cached;

  // Slow path: scan Whop API and sync to blob
  const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
  for await (const account of accounts) {
    const metadata = account.metadata as Record<string, string> | undefined;
    if (account.owner_user?.id === userId || metadata?.user_id === userId) {
      let categories: string[] = [];
      try { if (metadata?.categories) categories = JSON.parse(metadata.categories); } catch {}
      await upsertInstructorEntry(account.id, {
        name: account.title || "",
        plan: (metadata?.plan as "core" | "pro") || "core",
        categories,
      }, userId).catch(() => {}); // sync userId → companyId to blob
      return account.id;
    }
  }
  return null;
}

async function getOrCreateInstructorCompany(client: ReturnType<typeof getWhopApi>, userId: string, userEmail?: string, userName?: string): Promise<string> {
  const companyId = await findInstructorCompanyId(client, userId);
  if (companyId) return companyId;

  // Create directly instead of internal fetch (avoids APP_URL mismatch on Vercel)
  try {
    const newAccount = await client.companies.create({
      email: userEmail || `${userId}@instructor.local`,
      parent_company_id: PLATFORM_COMPANY_ID,
      title: userName || `Instructor ${userId.slice(0, 8)}`,
      metadata: { user_id: userId, email: userEmail || "", plan: "core" },
    });
    await upsertInstructorEntry(newAccount.id, {
      name: newAccount.title || "",
      plan: "core",
      categories: [],
    }, userId).catch(() => {});
    return newAccount.id;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("same name") || msg.includes("already")) {
      const accounts = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
      for await (const account of accounts) {
        const meta = account.metadata as Record<string, string> | undefined;
        if (account.owner_user?.id === userId || meta?.user_id === userId) return account.id;
      }
      const retry = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
      for await (const account of retry) {
        return account.id;
      }
    }
    throw error;
  }
}

async function getInstructorInfo(client: ReturnType<typeof getWhopApi>, companyId: string): Promise<{ name: string; logo: string; categories: string[] }> {
  try {
    const company = await client.companies.retrieve(companyId);
    const meta = company.metadata as Record<string, string> | undefined;
    let categories: string[] = [];
    try {
      if (meta?.categories) categories = JSON.parse(meta.categories);
    } catch {}
    return {
      name: company.title || "Instructor",
      logo: company.logo?.url || "",
      categories,
    };
  } catch {
    return { name: "Instructor", logo: "", categories: [] };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, userEmail, userName, title, description, date, time, duration, price } = await request.json();
    if (!userId || !title || !date || !time) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const client = getWhopApi();
    const instructorCompanyId = await getOrCreateInstructorCompany(client, userId, userEmail, userName);

    const metadata = { type: "masterclass", title, description: description || "", date, time, duration: String(duration || 60), price: String(price || 0) };
    const product = await client.products.create({ company_id: instructorCompanyId, title, description: JSON.stringify(metadata), visibility: "visible" });
    await client.plans.create({ company_id: instructorCompanyId, product_id: product.id, plan_type: "one_time", initial_price: (price || 0), visibility: "visible", release_method: "buy_now" });

    // Write to classes index blob
    const instructorInfo = await getInstructorInfo(client, instructorCompanyId);
    const blobEntry: ClassIndexEntry = {
      id: product.id,
      companyId: instructorCompanyId,
      instructorName: instructorInfo.name,
      instructorLogo: instructorInfo.logo,
      title,
      description: description || "",
      date,
      time,
      duration: duration || 60,
      price: price || 0,
      categories: instructorInfo.categories,
      visibility: "visible",
    };
    await upsertClass(blobEntry).catch((err) =>
      console.error("Failed to update classes index blob:", err),
    );

    return NextResponse.json({ success: true, class: { id: product.id, title, description: description || "", date, time, duration: duration || 60, price: price || 0, status: "available" } });
  } catch (error) {
    return NextResponse.json({ error: `Failed to create class: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { sessionId, title, description, date, time, duration, price, companyId } = await request.json();
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const client = getWhopApi();
    const metadata = { type: "masterclass", title, description: description || "", date, time, duration: String(duration || 60), price: String(price || 0) };
    await client.products.update(sessionId, { title, description: JSON.stringify(metadata) });

    // Update classes index blob
    if (companyId) {
      const instructorInfo = await getInstructorInfo(client, companyId);
      const blobEntry: ClassIndexEntry = {
        id: sessionId,
        companyId,
        instructorName: instructorInfo.name,
        instructorLogo: instructorInfo.logo,
        title,
        description: description || "",
        date,
        time,
        duration: duration || 60,
        price: price || 0,
        categories: instructorInfo.categories,
        visibility: "visible",
      };
      await upsertClass(blobEntry).catch((err) =>
        console.error("Failed to update classes index blob:", err),
      );
    }

    return NextResponse.json({ success: true, class: { id: sessionId, title, description: description || "", date, time, duration: duration || 60, price: price || 0, status: "available" } });
  } catch (error) {
    return NextResponse.json({ error: `Failed to update: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = new URL(request.url).searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    await getWhopApi().products.update(sessionId, { visibility: "hidden" });

    // Update classes index blob
    await removeClass(sessionId).catch((err) =>
      console.error("Failed to update classes index blob:", err),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  const instructorIdParam = request.nextUrl.searchParams.get("instructorId") || request.nextUrl.searchParams.get("coachId");
  if (!userId && !instructorIdParam) return NextResponse.json({ error: "userId or instructorId required" }, { status: 400 });
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();
    const instructorCompanyId = instructorIdParam || await findInstructorCompanyId(client, userId!);
    if (!instructorCompanyId) return NextResponse.json({ error: "No connected account" }, { status: 404 });

    // Get available classes
    const availableSessions: { id: string; title: string; description: string; date: string; time: string; duration: number; price: number; status: "available" }[] = [];
    for await (const product of await client.products.list({ company_id: instructorCompanyId })) {
      const full = await client.products.retrieve(product.id);
      if (full.visibility !== "visible" || !full.description?.startsWith('{"type":"masterclass"') && !full.description?.startsWith('{"type":"coaching_session"')) continue;
      try {
        const m = JSON.parse(full.description);
        availableSessions.push({ id: full.id, title: m.title || full.title, description: m.description || "", date: m.date || "", time: m.time || "", duration: parseInt(m.duration || "60"), price: parseFloat(m.price || "0"), status: "available" });
      } catch { continue; }
    }
    availableSessions.sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());

    // Get booked classes
    const bookedSessions: { id: string; title: string; learnerName: string; learnerEmail: string; learnerAvatar: string; date: string; time: string; duration: number; amount: number; status: "upcoming" | "completed" | "cancelled" }[] = [];
    const now = new Date();
    for await (const m of await client.memberships.list({ company_id: instructorCompanyId })) {
      const meta = m.metadata as Record<string, string> | undefined;
      const created = new Date(m.created_at);
      const dt = meta?.date && meta?.time ? new Date(`${meta.date} ${meta.time}`) : meta?.time_slot ? new Date(meta.time_slot) : created;
      const status = m.canceled_at ? "cancelled" : dt < now ? "completed" : "upcoming";
      bookedSessions.push({
        id: m.id, title: meta?.title || "Class", learnerName: m.user?.name || m.user?.username || "Anonymous", learnerEmail: m.user?.email || "",
        learnerAvatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${m.user?.id || m.id}`,
        date: meta?.date || created.toLocaleDateString(), time: meta?.time || meta?.time_slot || created.toLocaleTimeString(),
        duration: parseInt(meta?.duration || "60"), amount: 0, status,
      });
    }
    bookedSessions.sort((a, b) => (a.status === "upcoming" ? -1 : 1) - (b.status === "upcoming" ? -1 : 1));

    return NextResponse.json({ availableSessions, bookedSessions, instructorCompanyId });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}
