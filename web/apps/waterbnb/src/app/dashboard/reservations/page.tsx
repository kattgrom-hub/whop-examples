"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

interface Reservation {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  date: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
  channelId?: string;
}

const formatDate = (d: string) =>
  d
    ? new Date(d + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

export default function DashboardReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return setIsLoading(false);
    fetch(`/api/guest/reservations?userId=${user.id}`)
      .then((res) => (res.ok ? res.json() : { reservations: [] }))
      .then((data) => setReservations(data.reservations || []))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  const upcoming = reservations.filter((r) => r.status === "upcoming");
  const past = reservations.filter((r) => r.status !== "upcoming");

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Upcoming */}
      <section>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#FF385C] rounded-full" />
          Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-8 text-center text-[#717171]">
            <p className="mb-4">No upcoming reservations</p>
            <Link href="/browse" className="text-[#FF385C] hover:text-[#D70466] underline">
              Browse boats
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((r) => (
              <div key={r.id} className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={r.hostAvatar} alt="" className="w-12 h-12 rounded-full bg-[#EBEBEB]" />
                  <div>
                    <p className="font-semibold">{r.title}</p>
                    <p className="text-[#484848]">{r.hostName}</p>
                    <p className="text-[#717171] text-sm">
                      {formatDate(r.date)} &middot; {r.location}
                    </p>
                  </div>
                </div>
                <Link
                  href={r.channelId ? `/messages?channel=${r.channelId}` : "/messages"}
                  className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] font-semibold text-sm"
                >
                  Message Host
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Past</h2>
        {past.length === 0 ? (
          <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-8 text-center text-[#717171]">
            No past reservations yet
          </div>
        ) : (
          <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#DDDDDD] text-left text-[#717171]">
                  <th className="px-6 py-4">Boat</th>
                  <th className="px-6 py-4">Host</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBEBEB]">
                {past.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-4 font-medium">{r.title}</td>
                    <td className="px-6 py-4 text-[#484848]">
                      <div className="flex items-center gap-3">
                        <img src={r.hostAvatar} alt="" className="w-8 h-8 rounded-full bg-[#EBEBEB]" />
                        {r.hostName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#717171]">{formatDate(r.date)}</td>
                    <td className="px-6 py-4 text-[#717171]">{r.location}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          r.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {r.status}
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
