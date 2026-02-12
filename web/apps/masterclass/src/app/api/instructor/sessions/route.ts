import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getInstructorEntry } from "@/lib/blob/instructors-index";
import {
  upsertClass,
  removeClass,
  readClassesIndex,
  type ClassIndexEntry,
} from "@/lib/blob/classes-index";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function POST(request: NextRequest) {
  try {
    const { companyId, userName, userAvatar, title, description, date, time, duration, price } = await request.json();
    if (!companyId || !title || !date || !time) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

    const instructorCompanyId = companyId;

    const client = getWhopApi();
    const metadata = { type: "masterclass", title, description: description || "", date, time, duration: String(duration || 60), price: String(price || 0) };
    const product = await client.products.create({ company_id: instructorCompanyId, title, description: JSON.stringify(metadata), visibility: "visible" });
    await client.plans.create({ company_id: instructorCompanyId, product_id: product.id, plan_type: "one_time", initial_price: (price || 0), visibility: "visible", release_method: "buy_now" });

    // Get instructor info from blob (user profile), not from the Whop company
    const instructor = await getInstructorEntry(instructorCompanyId);
    const blobEntry: ClassIndexEntry = {
      id: product.id,
      companyId: instructorCompanyId,
      instructorName: userName || instructor?.name || "Instructor",
      instructorLogo: userAvatar || instructor?.avatarUrl || "",
      title,
      description: description || "",
      date,
      time,
      duration: duration || 60,
      price: price || 0,
      categories: instructor?.categories || [],
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
    const { sessionId, title, description, date, time, duration, price, companyId, userName, userAvatar } = await request.json();
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const client = getWhopApi();
    const metadata = { type: "masterclass", title, description: description || "", date, time, duration: String(duration || 60), price: String(price || 0) };
    await client.products.update(sessionId, { title, description: JSON.stringify(metadata) });

    // Update classes index blob with user profile info
    if (companyId) {
      const instructor = await getInstructorEntry(companyId);
      const blobEntry: ClassIndexEntry = {
        id: sessionId,
        companyId,
        instructorName: userName || instructor?.name || "Instructor",
        instructorLogo: userAvatar || instructor?.avatarUrl || "",
        title,
        description: description || "",
        date,
        time,
        duration: duration || 60,
        price: price || 0,
        categories: instructor?.categories || [],
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

    await removeClass(sessionId).catch((err) =>
      console.error("Failed to update classes index blob:", err),
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const companyIdParam = request.nextUrl.searchParams.get("companyId") || request.nextUrl.searchParams.get("instructorId") || request.nextUrl.searchParams.get("coachId");
  if (!companyIdParam) return NextResponse.json({ error: "companyId required" }, { status: 400 });
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();
    const instructorCompanyId = companyIdParam;

    // Get available classes from blob cache (avoids N+1 Whop API calls)
    const classesIndex = await readClassesIndex();
    const availableSessions = (classesIndex?.classes ?? [])
      .filter((c) => c.companyId === instructorCompanyId && c.visibility === "visible")
      .map((c) => ({
        id: c.id,
        title: c.title,
        description: c.description,
        date: c.date,
        time: c.time,
        duration: c.duration,
        price: c.price,
        status: "available" as const,
      }))
      .sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());

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
