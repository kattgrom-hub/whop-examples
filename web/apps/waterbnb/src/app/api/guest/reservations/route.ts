import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { readHostsIndex } from "@/lib/blob/hosts-index";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();
    const reservations: {
      id: string;
      title: string;
      hostName: string;
      hostId: string;
      hostAvatar: string;
      date: string;
      location: string;
      status: "upcoming" | "completed" | "cancelled";
    }[] = [];

    const now = new Date();

    // Try blob index first for the list of host company IDs
    const hostsIndex = await readHostsIndex();
    let companyEntries: { id: string; name: string }[];

    if (hostsIndex && Object.keys(hostsIndex.hosts).length > 0) {
      companyEntries = Object.entries(hostsIndex.hosts).map(
        ([id, entry]) => ({ id, name: entry.name })
      );
    } else {
      companyEntries = [];
      const companies = await client.companies.list({ parent_company_id: PLATFORM_COMPANY_ID });
      for await (const company of companies) {
        companyEntries.push({ id: company.id, name: company.title || "Host" });
      }
    }

    for (const company of companyEntries) {
      try {
        const memberships = await client.memberships.list({
          company_id: company.id,
          user_ids: [userId],
        });

        for await (const m of memberships) {
          const meta = (m.metadata || {}) as Record<string, string>;
          const reservationDate = meta.reservation_date || "";
          const productTitle = m.product?.title || meta.title || "Boat";
          const dt = reservationDate
            ? new Date(reservationDate + "T12:00:00")
            : new Date(m.created_at);

          const status = m.canceled_at
            ? "cancelled"
            : dt < now
              ? "completed"
              : "upcoming";

          reservations.push({
            id: m.id,
            title: productTitle,
            hostName: meta.host_name || company.name || "Host",
            hostId: meta.host_id || company.id,
            hostAvatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${meta.host_id || company.id}`,
            date: reservationDate || new Date(m.created_at).toLocaleDateString(),
            location: meta.location || "",
            status,
          });
        }
      } catch {
        continue;
      }
    }

    // Sort: upcoming first (ascending date), then past (descending date)
    reservations.sort((a, b) => {
      if (a.status === "upcoming" && b.status !== "upcoming") return -1;
      if (a.status !== "upcoming" && b.status === "upcoming") return 1;
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      if (a.status === "upcoming") return dateA - dateB;
      return dateB - dateA;
    });

    const upcoming = reservations.filter((r) => r.status === "upcoming").length;
    const completed = reservations.filter((r) => r.status === "completed").length;

    return NextResponse.json({
      reservations,
      total: reservations.length,
      upcoming,
      completed,
    });
  } catch (error) {
    return NextResponse.json({ error: `Failed: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}
