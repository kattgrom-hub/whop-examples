"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

interface Subscription {
  id: string;
  title: string;
  instructorName: string;
  instructorId: string;
  instructorAvatar: string;
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

function SubscriptionsContent() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) return setIsLoading(false);
      try {
        const res = await fetch(`/api/learner/bookings?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setSubscriptions(data.bookings || []);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user]);

  const active = subscriptions.filter((s) => s.status === "upcoming");
  const past = subscriptions.filter((s) => s.status !== "upcoming");

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-gold rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">My Subscriptions</h1>

      {/* Active Subscriptions */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#F59E0B] rounded-full" />Active
        </h2>
        {active.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8 text-center text-gray-400">
            <p className="mb-4">No active subscriptions</p>
            <Link href="/browse" className="text-[#F59E0B] hover:text-[#D97706] underline">Browse tipsters</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {active.map((s) => (
              <div key={s.id} className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={s.instructorAvatar} alt="" className="w-12 h-12 rounded-full bg-[#2A2A2A]" />
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-gray-300">{s.instructorName}</p>
                    <p className="text-gray-400 text-sm">{formatDate(s.date)} at {formatTime(s.time)} · {s.duration} picks</p>
                  </div>
                </div>
                <button
                  onClick={() => alert("Picks will be available when the package is released.")}
                  className="px-4 py-2 bg-[#F59E0B] text-[#0A0A0A] rounded-lg hover:bg-[#D97706] font-bold"
                >
                  View Picks
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Subscriptions */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Past</h2>
        {past.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8 text-center text-gray-400">No past subscriptions yet</div>
        ) : (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-[#2A2A2A] text-left text-gray-400">
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Tipster</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Picks</th>
                <th className="px-6 py-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {past.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 font-medium">{s.title}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={s.instructorAvatar} alt="" className="w-8 h-8 rounded-full bg-[#2A2A2A]" />
                      {s.instructorName}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{formatDate(s.date)}</td>
                    <td className="px-6 py-4 text-gray-400">{s.duration}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${s.status === "completed" ? "bg-[#F59E0B]/20 text-[#F59E0B]" : "bg-red-500/20 text-red-500"}`}>
                        {s.status}
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

export default function SubscriptionsPage() {
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-gold rounded-full animate-spin" /></div>}><SubscriptionsContent /></Suspense>;
}
