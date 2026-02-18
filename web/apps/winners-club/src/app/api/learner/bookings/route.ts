import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { readInstructorsIndex } from "@/lib/blob/instructors-index";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();
    const bookings: {
      id: string;
      title: string;
      instructorName: string;
      instructorId: string;
      instructorAvatar: string;
      date: string;
      time: string;
      duration: number;
      status: "upcoming" | "completed" | "cancelled";
    }[] = [];

    const now = new Date();

    // Try blob index first for the list of instructor company IDs
    const instructorsIndex = await readInstructorsIndex();
    let companyEntries: { id: string; name: string }[];

    if (instructorsIndex && Object.keys(instructorsIndex.instructors).length > 0) {
      // Use blob -- no need to list all companies from Whop API
      companyEntries = Object.entries(instructorsIndex.instructors).map(
        ([id, entry]) => ({ id, name: entry.name })
      );
    } else {
      // Fallback to Whop API if blob is empty/missing
      companyEntries = [];
      const companies = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
      for await (const company of companies) {
        companyEntries.push({ id: company.id, name: company.title || "Instructor" });
      }
    }

    for (const company of companyEntries) {
      try {
        const memberships = await client.memberships.list({
          company_id: company.id,
          user_ids: [userId],
        });

        for await (const m of memberships) {
          const meta = m.metadata as Record<string, string> | undefined;
          if (!meta || meta.type !== "masterclass") continue;

          const created = new Date(m.created_at);
          const dt = meta.date && meta.time
            ? new Date(`${meta.date} ${meta.time}`)
            : meta.time_slot
              ? new Date(meta.time_slot)
              : created;

          const status = m.canceled_at
            ? "cancelled"
            : dt < now
              ? "completed"
              : "upcoming";

          bookings.push({
            id: m.id,
            title: meta.title || "Class",
            instructorName: meta.instructor_name || company.name || "Instructor",
            instructorId: meta.instructor_id || company.id,
            instructorAvatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${meta.instructor_id || company.id}`,
            date: meta.date || created.toLocaleDateString(),
            time: meta.time || meta.time_slot || created.toLocaleTimeString(),
            duration: parseInt(meta.duration || "60"),
            status,
          });
        }
      } catch {
        // Skip companies where membership listing fails
        continue;
      }
    }

    // Sort: upcoming first (ascending date), then past (descending date)
    bookings.sort((a, b) => {
      if (a.status === "upcoming" && b.status !== "upcoming") return -1;
      if (a.status !== "upcoming" && b.status === "upcoming") return 1;
      const dateA = new Date(`${a.date} ${a.time}`).getTime() || 0;
      const dateB = new Date(`${b.date} ${b.time}`).getTime() || 0;
      if (a.status === "upcoming") return dateA - dateB;
      return dateB - dateA;
    });

    const upcoming = bookings.filter((b) => b.status === "upcoming").length;
    const completed = bookings.filter((b) => b.status === "completed").length;

    return NextResponse.json({
      bookings,
      total: bookings.length,
      upcoming,
      completed,
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}
