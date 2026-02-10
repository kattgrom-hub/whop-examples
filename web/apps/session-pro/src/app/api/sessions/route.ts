import { NextRequest, NextResponse } from "next/server";
import {
  readSessionsIndex,
  type SessionIndexEntry,
} from "@/lib/blob/sessions-index";

/**
 * Sessions List API
 *
 * Lists all available sessions across all coaches.
 * Reads from the sessions index blob instead of making N+1 Whop API calls.
 */

export interface SessionListItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  coachId: string;
  coachName: string;
  coachAvatar: string;
  categories: string[];
}

function toListItem(entry: SessionIndexEntry): SessionListItem {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    date: entry.date,
    time: entry.time,
    duration: entry.duration,
    price: entry.price,
    coachId: entry.companyId,
    coachName: entry.coachName,
    coachAvatar:
      entry.coachLogo ||
      `https://api.dicebear.com/9.x/notionists/svg?seed=${entry.companyId}`,
    categories: entry.categories,
  };
}

export async function GET(request: NextRequest) {
  try {
    const index = await readSessionsIndex();

    if (!index) {
      return NextResponse.json({ sessions: [], total: 0 });
    }

    // Filter to visible sessions only
    let sessions = index.sessions
      .filter((s) => s.visibility === "visible")
      .map(toListItem);

    // Optional category filter
    const category = request.nextUrl.searchParams.get("category");
    if (category) {
      const lower = category.toLowerCase();
      sessions = sessions.filter((s) =>
        s.categories.some((c) => c.toLowerCase() === lower),
      );
    }

    // Sort by date (earliest first)
    sessions.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json({
      sessions,
      total: sessions.length,
    });
  } catch (error) {
    console.error("Failed to list sessions:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to list sessions: ${errorMessage}` },
      { status: 500 },
    );
  }
}
