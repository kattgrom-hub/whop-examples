"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface Session {
  id: string;
  studentName: string;
  studentAvatar: string;
  date: string;
  time: string;
  duration: number;
  amount: number;
  status: "upcoming" | "completed" | "cancelled";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return setIsLoading(false);
    fetch(`/api/coach/sessions?userId=${user.id}`)
      .then((res) => res.ok ? res.json() : { bookedSessions: [] })
      .then((data) => setSessions(data.bookedSessions || []))
      .finally(() => setIsLoading(false));
  }, [user]);

  const upcoming = sessions.filter((s) => s.status === "upcoming");
  const completed = sessions.filter((s) => s.status === "completed");
  const totalEarned = completed.reduce((sum, s) => sum + (s.amount || 0), 0);

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Upcoming</p>
          <p className="text-3xl font-bold">{upcoming.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold">{completed.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-green-500">${totalEarned}</p>
          <Link href="/dashboard/payouts" className="text-sm text-blue-500 hover:text-blue-400 mt-2 inline-block">Withdraw →</Link>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
          <Link href="/dashboard/sessions" className="text-sm text-blue-500 hover:text-blue-400">View all →</Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No upcoming sessions</div>
        ) : (
          <div className="divide-y divide-gray-700">
            {upcoming.slice(0, 5).map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={s.studentAvatar} alt="" className="w-10 h-10 rounded-full bg-gray-700" />
                  <div>
                    <p className="font-medium">{s.studentName}</p>
                    <p className="text-sm text-gray-400">{s.date} at {s.time}</p>
                  </div>
                </div>
                <p className="font-semibold">{s.amount === 0 ? "Free" : `$${s.amount}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
