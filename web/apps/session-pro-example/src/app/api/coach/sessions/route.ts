import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Coach Sessions API
 *
 * In production, this manages coaching sessions as products with plans,
 * allowing coaches to create, update, and track their session offerings.
 *
 * This demo version returns mock session data.
 */

// Mock sessions data
const MOCK_AVAILABLE_SESSIONS = [
  {
    id: "sess_1",
    title: "Code Review Session",
    description: "Get expert feedback on your code architecture and best practices",
    date: "2025-02-10",
    time: "10:00 AM",
    duration: 60,
    price: 75,
    status: "available" as const,
  },
  {
    id: "sess_2",
    title: "Career Coaching",
    description: "Navigate your tech career with personalized guidance",
    date: "2025-02-11",
    time: "2:00 PM",
    duration: 45,
    price: 100,
    status: "available" as const,
  },
  {
    id: "sess_3",
    title: "Design Critique",
    description: "Get professional feedback on your UI/UX designs",
    date: "2025-02-12",
    time: "11:00 AM",
    duration: 30,
    price: 50,
    status: "available" as const,
  },
];

const MOCK_BOOKED_SESSIONS = [
  {
    id: "book_1",
    title: "React Performance Deep Dive",
    studentName: "Alex Johnson",
    studentEmail: "alex@example.com",
    studentAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alex",
    date: "2025-02-08",
    time: "3:00 PM",
    duration: 60,
    amount: 85,
    status: "upcoming" as const,
  },
  {
    id: "book_2",
    title: "Portfolio Review",
    studentName: "Jamie Smith",
    studentEmail: "jamie@example.com",
    studentAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=jamie",
    date: "2025-02-05",
    time: "10:00 AM",
    duration: 45,
    amount: 60,
    status: "completed" as const,
  },
];

export async function POST(request: NextRequest) {
  console.log("📅 [Demo] Creating new session");

  try {
    const { userId, userEmail, userName, title, description, date, time, duration, price } = await request.json();

    if (!userId || !title || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("📋 [Demo] New session:");
    console.log(`   Title: ${title}`);
    console.log(`   Date: ${date} at ${time}`);
    console.log(`   Duration: ${duration || 60} minutes`);
    console.log(`   Price: $${price || 0}`);

    const newSession = {
      id: `sess_demo_${Date.now()}`,
      title,
      description: description || "",
      date,
      time,
      duration: duration || 60,
      price: price || 0,
      status: "available" as const,
    };

    return NextResponse.json({ success: true, session: newSession });
  } catch (error) {
    return NextResponse.json({
      error: `Failed to create session: ${error instanceof Error ? error.message : "Unknown"}`,
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  console.log("✏️ [Demo] Updating session");

  try {
    const { sessionId, title, description, date, time, duration, price } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    const updatedSession = {
      id: sessionId,
      title: title || "Updated Session",
      description: description || "",
      date: date || "2025-02-15",
      time: time || "12:00 PM",
      duration: duration || 60,
      price: price || 0,
      status: "available" as const,
    };

    return NextResponse.json({ success: true, session: updatedSession });
  } catch (error) {
    return NextResponse.json({
      error: `Failed to update: ${error instanceof Error ? error.message : "Unknown"}`,
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  console.log("🗑️ [Demo] Deleting session");

  try {
    const sessionId = new URL(request.url).searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "sessionId required" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      error: `Failed to delete: ${error instanceof Error ? error.message : "Unknown"}`,
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  console.log("📅 [Demo] Fetching coach sessions");

  const userId = request.nextUrl.searchParams.get("userId");
  const coachIdParam = request.nextUrl.searchParams.get("coachId");

  if (!userId && !coachIdParam) {
    return NextResponse.json({ error: "userId or coachId required" }, { status: 400 });
  }

  return NextResponse.json({
    availableSessions: MOCK_AVAILABLE_SESSIONS,
    bookedSessions: MOCK_BOOKED_SESSIONS,
    coachCompanyId: "company_demo_abc",
  });
}
