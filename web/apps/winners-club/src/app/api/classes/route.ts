import { NextRequest, NextResponse } from "next/server";
import {
  readClassesIndex,
  type ClassIndexEntry,
} from "@/lib/blob/classes-index";

/**
 * Classes List API
 *
 * Lists all available classes across all instructors.
 * Reads from the classes index blob instead of making N+1 Whop API calls.
 */

export interface ClassListItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string;
  categories: string[];
}

function toListItem(entry: ClassIndexEntry): ClassListItem {
  return {
    id: entry.id,
    title: entry.title,
    description: entry.description,
    date: entry.date,
    time: entry.time,
    duration: entry.duration,
    price: entry.price,
    instructorId: entry.companyId,
    instructorName: entry.instructorName,
    instructorAvatar:
      entry.instructorLogo ||
      `https://api.dicebear.com/9.x/notionists/svg?seed=${entry.companyId}`,
    categories: entry.categories,
  };
}

export async function GET(request: NextRequest) {
  try {
    const index = await readClassesIndex();

    if (!index) {
      return NextResponse.json({ sessions: [], total: 0 });
    }

    // Filter to visible classes only
    let classes = index.classes
      .filter((s) => s.visibility === "visible")
      .map(toListItem);

    // Optional category filter
    const category = request.nextUrl.searchParams.get("category");
    if (category) {
      const lower = category.toLowerCase();
      classes = classes.filter((s) =>
        s.categories.some((c) => c.toLowerCase() === lower),
      );
    }

    // Sort by date (earliest first)
    classes.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json({
      sessions: classes,
      total: classes.length,
    });
  } catch (error) {
    console.error("Failed to list classes:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to list classes: ${errorMessage}` },
      { status: 500 },
    );
  }
}
