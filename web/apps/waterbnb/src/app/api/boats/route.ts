import { NextRequest, NextResponse } from "next/server";
import {
  readBoatsIndex,
  type BoatIndexEntry,
} from "@/lib/blob/boats-index";

/**
 * Boats List API
 *
 * Lists all available boats across all hosts.
 * Reads from the boats index blob instead of making N+1 Whop API calls.
 */

export interface BoatListItem {
  id: string;
  title: string;
  description: string;
  location: string;
  capacity: number;
  boatType: string;
  pricePerTrip: number;
  availableDates: string[];
  hostId: string;
  hostName: string;
  hostAvatar: string;
  categories: string[];
}

function toListItem(entry: BoatIndexEntry): BoatListItem {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    location: entry.location,
    capacity: entry.capacity,
    boatType: entry.boatType,
    pricePerTrip: entry.pricePerTrip,
    availableDates: entry.availableDates,
    hostId: entry.companyId,
    hostName: entry.hostName,
    hostAvatar:
      entry.hostLogo ||
      `https://api.dicebear.com/9.x/notionists/svg?seed=${entry.companyId}`,
    categories: entry.categories,
  };
}

export async function GET(request: NextRequest) {
  try {
    const index = await readBoatsIndex();

    if (!index) {
      return NextResponse.json({ boats: [], total: 0 });
    }

    // Filter to visible boats with available dates
    let boats = index.boats
      .filter((b) => b.visibility === "visible" && b.availableDates.length > 0)
      .map(toListItem);

    // Optional category/boatType filter
    const category = request.nextUrl.searchParams.get("category");
    if (category) {
      const lower = category.toLowerCase();
      boats = boats.filter((b) =>
        b.boatType.toLowerCase() === lower ||
        b.categories.some((c) => c.toLowerCase() === lower),
      );
    }

    // Sort by next available date (earliest first)
    boats.sort((a, b) => {
      const dateA = a.availableDates[0] || "";
      const dateB = b.availableDates[0] || "";
      return dateA.localeCompare(dateB);
    });

    return NextResponse.json({
      boats,
      total: boats.length,
    });
  } catch (error) {
    console.error("Failed to list boats:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to list boats: ${errorMessage}` },
      { status: 500 },
    );
  }
}
