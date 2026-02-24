import { NextRequest, NextResponse } from "next/server";
import { getWhopApi } from "@/lib/whop-sdk";
import { getHostEntry } from "@/lib/blob/hosts-index";
import {
  upsertBoat,
  removeBoat,
  readBoatsIndex,
  addBoatDates,
  type BoatIndexEntry,
} from "@/lib/blob/boats-index";
import { readChatsIndex } from "@/lib/blob/chats-index";

const PLATFORM_COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export async function POST(request: NextRequest) {
  try {
    const { companyId, userName, userAvatar, title, description, location, boatType, capacity, pricePerTrip, availableDates } = await request.json();
    if (!companyId || !title || !location) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });
    if (title.length > 40) return NextResponse.json({ error: "Boat name must be 40 characters or fewer" }, { status: 400 });

    const hostCompanyId = companyId;

    const client = getWhopApi();
    const metadata = { type: "waterbnb", title, description: description || "", location, boatType: boatType || "Sailboat", capacity: String(capacity || 6), pricePerTrip: String(pricePerTrip || 0) };
    const product = await client.products.create({ company_id: hostCompanyId, title, description: JSON.stringify(metadata), visibility: "visible" });
    await client.plans.create({ company_id: hostCompanyId, product_id: product.id, plan_type: "one_time", initial_price: (pricePerTrip || 0), visibility: "visible", release_method: "buy_now" });

    const host = await getHostEntry(hostCompanyId);
    const blobEntry: BoatIndexEntry = {
      id: product.id,
      companyId: hostCompanyId,
      hostName: userName || host?.name || "Host",
      hostLogo: userAvatar || host?.avatarUrl || "",
      title,
      description: description || "",
      location,
      capacity: capacity || 6,
      boatType: boatType || "Sailboat",
      pricePerTrip: pricePerTrip || 0,
      availableDates: availableDates || [],
      categories: host?.categories || [],
      visibility: "visible",
    };
    await upsertBoat(blobEntry);

    return NextResponse.json({ success: true, listing: { id: product.id, title, description: description || "", location, boatType: boatType || "Sailboat", capacity: capacity || 6, pricePerTrip: pricePerTrip || 0, availableDates: availableDates || [], status: "available" } });
  } catch (error) {
    return NextResponse.json({ error: `Failed to create listing: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { listingId, title, description, location, boatType, capacity, pricePerTrip, availableDates, companyId, userName, userAvatar, addDates } = await request.json();
    if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });

    // If just adding dates
    if (addDates && addDates.length > 0) {
      await addBoatDates(listingId, addDates);
      return NextResponse.json({ success: true });
    }

    const client = getWhopApi();
    const metadata = { type: "waterbnb", title, description: description || "", location, boatType: boatType || "Sailboat", capacity: String(capacity || 6), pricePerTrip: String(pricePerTrip || 0) };
    await client.products.update(listingId, { title, description: JSON.stringify(metadata) });

    if (companyId) {
      const host = await getHostEntry(companyId);
      const blobEntry: BoatIndexEntry = {
        id: listingId,
        companyId,
        hostName: userName || host?.name || "Host",
        hostLogo: userAvatar || host?.avatarUrl || "",
        title,
        description: description || "",
        location,
        capacity: capacity || 6,
        boatType: boatType || "Sailboat",
        pricePerTrip: pricePerTrip || 0,
        availableDates: availableDates || [],
        categories: host?.categories || [],
        visibility: "visible",
      };
      await upsertBoat(blobEntry);
    }

    return NextResponse.json({ success: true, listing: { id: listingId, title, description: description || "", location, boatType: boatType || "Sailboat", capacity: capacity || 6, pricePerTrip: pricePerTrip || 0, availableDates: availableDates || [], status: "available" } });
  } catch (error) {
    return NextResponse.json({ error: `Failed to update: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const listingId = new URL(request.url).searchParams.get("listingId");
    if (!listingId) return NextResponse.json({ error: "listingId required" }, { status: 400 });
    await getWhopApi().products.update(listingId, { visibility: "hidden" });

    await removeBoat(listingId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: `Failed to delete: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const companyIdParam = request.nextUrl.searchParams.get("companyId") || request.nextUrl.searchParams.get("hostId");
  if (!companyIdParam) return NextResponse.json({ error: "companyId required" }, { status: 400 });
  if (!PLATFORM_COMPANY_ID) return NextResponse.json({ error: "Platform not configured" }, { status: 500 });

  try {
    const client = getWhopApi();
    const hostCompanyId = companyIdParam;

    // Get available listings from blob cache
    const boatsIndex = await readBoatsIndex();
    const availableListings = (boatsIndex?.boats ?? [])
      .filter((b) => b.companyId === hostCompanyId && b.visibility === "visible")
      .map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        location: b.location,
        boatType: b.boatType,
        capacity: b.capacity,
        pricePerTrip: b.pricePerTrip,
        availableDates: b.availableDates,
        status: "available" as const,
      }));

    // Get booked reservations
    const bookedSessions: { id: string; boatId: string; title: string; guestName: string; guestEmail: string; guestAvatar: string; date: string; location: string; amount: number; status: "upcoming" | "completed" | "cancelled"; channelId?: string }[] = [];
    const now = new Date();

    // Build a membership -> channelId lookup from the chats index
    const chatsIndex = await readChatsIndex();
    const channelByMembership = new Map<string, string>();
    if (chatsIndex) {
      for (const chat of chatsIndex.chats) {
        channelByMembership.set(chat.membershipId, chat.channelId);
      }
    }

    for await (const m of await client.memberships.list({ company_id: hostCompanyId })) {
      const meta = (m.metadata || {}) as Record<string, string>;
      const reservationDate = meta.reservation_date || "";
      const productTitle = m.product?.title || meta.title || "Boat";
      const dt = reservationDate ? new Date(reservationDate + "T12:00:00") : new Date(m.created_at);
      const status = m.canceled_at ? "cancelled" : dt < now ? "completed" : "upcoming";
      bookedSessions.push({
        id: m.id, boatId: m.product?.id || meta.boat_plan_id || "", title: productTitle, guestName: m.user?.name || m.user?.username || "Anonymous", guestEmail: m.user?.email || "",
        guestAvatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${m.user?.id || m.id}`,
        date: reservationDate || new Date(m.created_at).toISOString().split("T")[0],
        location: meta.location || "",
        amount: 0, status,
        channelId: channelByMembership.get(m.id),
      });
    }
    bookedSessions.sort((a, b) => (a.status === "upcoming" ? -1 : 1) - (b.status === "upcoming" ? -1 : 1));

    return NextResponse.json({ availableListings, bookedSessions, hostCompanyId });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch: ${error instanceof Error ? error.message : "Unknown"}` }, { status: 500 });
  }
}
