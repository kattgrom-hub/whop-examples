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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const upcoming = reservations.filter((b) => b.status === "upcoming");
  const past = reservations.filter((b) => b.status !== "upcoming");

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-airbnb rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-8 text-[#222222]">My Reservations</h1>

      {/* Upcoming Reservations */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#222222]">
          <span className="w-2 h-2 bg-[#FF385C] rounded-full" />Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-8 text-center text-[#717171]">
            <p className="mb-4">No upcoming reservations</p>
            <Link href="/browse" className="text-[#FF385C] hover:text-[#D70466] underline">Browse boats</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((b) => (
              <div key={b.id} className="bg-white rounded-xl border border-[#DDDDDD] p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={b.hostAvatar} alt="" className="w-12 h-12 rounded-full bg-[#EBEBEB]" />
                  <div>
                    <p className="font-semibold text-[#222222]">{b.title}</p>
                    <p className="text-[#484848]">{b.hostName}</p>
                    <p className="text-[#717171] text-sm">{formatDate(b.date)} · {b.location}</p>
                  </div>
                </div>
                <Link
                  href="/messages"
                  className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] font-semibold"
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
        <h2 className="text-lg font-semibold mb-4 text-[#222222]">Past</h2>
        {past.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#DDDDDD] p-8 text-center text-[#717171]">No past reservations yet</div>
        ) : (
          <div className="bg-white rounded-xl border border-[#DDDDDD] overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-[#DDDDDD] text-left text-[#717171]">
                <th className="px-6 py-4">Boat</th>
                <th className="px-6 py-4">Host</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {past.map((b) => (
                  <tr key={b.id}>
                    <td className="px-6 py-4 font-medium text-[#222222]">{b.title}</td>
                    <td className="px-6 py-4 flex items-center gap-3 text-[#484848]">
                      <img src={b.hostAvatar} alt="" className="w-8 h-8 rounded-full bg-[#EBEBEB]" />
                      {b.hostName}
                    </td>
                    <td className="px-6 py-4 text-[#717171]">{formatDate(b.date)}</td>
                    <td className="px-6 py-4 text-[#717171]">{b.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${b.status === "completed" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
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
  return <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-airbnb rounded-full animate-spin" /></div>}><ReservationsContent /></Suspense>;
}
