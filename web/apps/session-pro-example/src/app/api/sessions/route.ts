import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Public Sessions API
 *
 * In production, this lists all available sessions across all coaches.
 * This demo version returns mock session data.
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
}

// Mock sessions from multiple coaches
const MOCK_SESSIONS: SessionListItem[] = [
  {
    id: "sess_1",
    title: "Code Review Session",
    description: "Get expert feedback on your code architecture and best practices",
    date: "2025-02-10",
    time: "10:00 AM",
    duration: 60,
    price: 75,
    coachId: "company_sarah",
    coachName: "Sarah Dev",
    coachAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarah",
  },
  {
    id: "sess_2",
    title: "Career Coaching",
    description: "Navigate your tech career with personalized guidance",
    date: "2025-02-11",
    time: "2:00 PM",
    duration: 45,
    price: 100,
    coachId: "company_mike",
    coachName: "Mike Mentor",
    coachAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=mike",
  },
  {
    id: "sess_3",
    title: "Design Critique",
    description: "Get professional feedback on your UI/UX designs",
    date: "2025-02-12",
    time: "11:00 AM",
    duration: 30,
    price: 50,
    coachId: "company_alex",
    coachName: "Alex Artist",
    coachAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=alex",
  },
  {
    id: "sess_4",
    title: "System Design Interview Prep",
    description: "Ace your next system design interview with mock practice",
    date: "2025-02-13",
    time: "9:00 AM",
    duration: 90,
    price: 150,
    coachId: "company_sarah",
    coachName: "Sarah Dev",
    coachAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=sarah",
  },
  {
    id: "sess_5",
    title: "Startup Pitch Review",
    description: "Get your pitch deck reviewed by an experienced founder",
    date: "2025-02-14",
    time: "4:00 PM",
    duration: 60,
    price: 125,
    coachId: "company_mike",
    coachName: "Mike Mentor",
    coachAvatar: "https://api.dicebear.com/9.x/notionists/svg?seed=mike",
  },
];

export async function GET(request: NextRequest) {
  console.log("🌐 [Demo] Fetching all public sessions");

  return NextResponse.json({
    sessions: MOCK_SESSIONS,
    total: MOCK_SESSIONS.length,
  });
}
