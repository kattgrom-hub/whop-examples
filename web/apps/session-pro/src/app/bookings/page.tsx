"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

interface Booking {
  id: string;
  title: string;
  coachName: string;
  coachId: string;
  coachAvatar: string;
  date: string;
  time: string;
  duration: number;
  status: "upcoming" | "completed" | "cancelled";
}

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";
const formatTime = (t: string) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  if (isNaN(hour)) return t;
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};

function BookingsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) return setIsLoading(false);
      try {
        const res = await fetch(`/api/student/bookings?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setBookings(data.bookings || []);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user]);

  const upcoming = bookings.filter((b) => b.status === "upcoming");
  const past = bookings.filter((b) => b.status !== "upcoming");

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">My Bookings</h1>

      {/* Upcoming Bookings */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">
            <p className="mb-4">No upcoming bookings</p>
            <Link href="/browse" className="text-blue-400 hover:text-blue-300 underline">Browse coaches</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((b) => (
              <div key={b.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={b.coachAvatar} alt="" className="w-12 h-12 rounded-full bg-gray-700" />
                  <div>
                    <p className="font-semibold">{b.title}</p>
                    <p className="text-gray-300">{b.coachName}</p>
                    <p className="text-gray-400 text-sm">{formatDate(b.date)} at {formatTime(b.time)} · {b.duration} min</p>
                  </div>
                </div>
                <button
                  onClick={() => alert("Join link will be available when the session starts.")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Sessions */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Past</h2>
        {past.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">No past sessions yet</div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-gray-700 text-left text-gray-400">
                <th className="px-6 py-4">Session</th>
                <th className="px-6 py-4">Coach</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-700">
                {past.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-medium">{b.title}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={b.coachAvatar} alt="" className="w-8 h-8 rounded-full bg-gray-700" />
                      {b.coachName}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{formatDate(b.date)}</td>
                    <td className="px-6 py-4 text-gray-400">{b.duration} min</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${b.status === "completed" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default function BookingsPage() {
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}><BookingsContent /></Suspense>;
}
