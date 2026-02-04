import Link from "next/link";
import { SessionCard } from "@/components/session-card";

export const dynamic = "force-dynamic";

interface Session {
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

async function getSessions(): Promise<Session[]> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  try {
    const response = await fetch(`${baseUrl}/api/sessions`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to fetch sessions:", response.status);
      return [];
    }

    const data = await response.json();
    return data.sessions || [];
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
}

export default async function BrowsePage() {
  const sessions = await getSessions();

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Available Sessions</h1>
        <p className="text-gray-400 mb-8">
          Book a 1:1 session with a coach
        </p>

        {/* Results */}
        <p className="text-gray-400 mb-6">
          {sessions.length} session{sessions.length !== 1 && "s"} available
        </p>

        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 mb-2">No sessions available yet.</p>
            <p className="text-gray-500 text-sm">
              Be the first to offer a session!{" "}
              <Link href="/dashboard/sessions" className="text-blue-400 hover:underline">
                Create one →
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
