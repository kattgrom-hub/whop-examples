"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

interface Reservation {
  id: string;
  title: string;
  hostName: string;
  hostId: string;
  hostAvatar: string;
  date: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  channelId?: string;
}

const formatDate = (d: string) => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";

function ReservationsContent() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user?.id) return setIsLoading(false);
      try {
        const res = await fetch(`/api/guest/reservations?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          setReservations(data.reservations || []);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user]);

  const upcoming = reservations.filter((b) => b.status === "upcoming");
  const past = reservations.filter((b) => b.status !== "upcoming");

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8">My Reservations</h1>

      {/* Upcoming Reservations */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#0077B6] rounded-full" />Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8 text-center text-gray-400">
            <p className="mb-4">No upcoming reservations</p>
            <Link href="/browse" className="text-[#0077B6] hover:text-[#023E8A] underline">Browse boats</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((b) => (
              <div key={b.id} className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={b.hostAvatar} alt="" className="w-12 h-12 rounded-full bg-[#2A2A2A]" />
                  <div>
                    <p className="font-semibold">{b.title}</p>
                    <p className="text-gray-300">{b.hostName}</p>
                    <p className="text-gray-400 text-sm">{formatDate(b.date)} · {b.location}</p>
                  </div>
                </div>
                <Link
                  href="/messages"
                  className="px-4 py-2 bg-[#0077B6] text-white rounded-lg hover:bg-[#023E8A] font-semibold"
                >
                  Message Host
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past Reservations */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Past</h2>
        {past.length === 0 ? (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-8 text-center text-gray-400">No past reservations yet</div>
        ) : (
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-[#2A2A2A] text-left text-gray-400">
                <th className="px-6 py-4">Boat</th>
                <th className="px-6 py-4">Host</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#2A2A2A]">
                {past.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-medium">{b.title}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={b.hostAvatar} alt="" className="w-8 h-8 rounded-full bg-[#2A2A2A]" />
                      {b.hostName}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{formatDate(b.date)}</td>
                    <td className="px-6 py-4 text-gray-400">{b.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${b.status === "completed" ? "bg-[#0077B6]/20 text-[#00B4D8]" : "bg-red-500/20 text-red-500"}`}>
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

export default function ReservationsPage() {
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" /></div>}><ReservationsContent /></Suspense>;
}
