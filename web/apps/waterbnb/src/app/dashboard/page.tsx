"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface ReservedBoat {
  id: string;
  guestName: string;
  guestAvatar: string;
  date: string;
  location: string;
  amount: number;
  status: "upcoming" | "completed" | "cancelled";
}

const formatDate = (d: string) => d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "";

export default function DashboardPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservedBoat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.companyId) return setIsLoading(false);
    fetch(`/api/host/sessions?companyId=${user.companyId}`)
      .then((res) => res.ok ? res.json() : { bookedSessions: [] })
      .then((data) => setReservations(data.bookedSessions || []))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.companyId]);

  const upcoming = reservations.filter((s) => s.status === "upcoming");
  const completed = reservations.filter((s) => s.status === "completed");
  const totalEarned = completed.reduce((sum, s) => sum + (s.amount || 0), 0);

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-airbnb rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-[#222222]">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
          <p className="text-[#717171] text-sm mb-1">Upcoming</p>
          <p className="text-3xl font-bold text-[#222222]">{upcoming.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
          <p className="text-[#717171] text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-[#222222]">{completed.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-[#DDDDDD]">
          <p className="text-[#717171] text-sm mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-[#222222]">${totalEarned}</p>
          <Link href="/dashboard/payouts" className="text-sm text-[#FF385C] hover:text-[#D70466] mt-2 inline-block">Withdraw →</Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#DDDDDD]">
        <div className="p-6 border-b border-[#EBEBEB] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#222222]">Upcoming Reservations</h2>
          <Link href="/dashboard/listings" className="text-sm text-[#FF385C] hover:text-[#D70466]">View all →</Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="p-6 text-center text-[#717171]">No upcoming reservations</div>
        ) : (
          <div className="divide-y divide-[#EBEBEB]">
            {upcoming.slice(0, 5).map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={s.guestAvatar} alt="" className="w-10 h-10 rounded-full bg-[#EBEBEB]" />
                  <div>
                    <p className="font-medium text-[#222222]">{s.guestName}</p>
                    <p className="text-sm text-[#717171]">{formatDate(s.date)} · {s.location}</p>
                  </div>
                </div>
                <p className="font-semibold text-[#222222]">{s.amount === 0 ? "Free" : `$${s.amount}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
