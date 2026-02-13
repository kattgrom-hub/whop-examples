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

  if (isLoading) return <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
          <p className="text-gray-400 text-sm mb-1">Upcoming</p>
          <p className="text-3xl font-bold text-[#0077B6]">{upcoming.length}</p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-[#0077B6]">{completed.length}</p>
        </div>
        <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#2A2A2A]">
          <p className="text-gray-400 text-sm mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-[#0077B6]">${totalEarned}</p>
          <Link href="/dashboard/payouts" className="text-sm text-[#0077B6] hover:text-[#023E8A] mt-2 inline-block">Withdraw →</Link>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A]">
        <div className="p-6 border-b border-[#2A2A2A] flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Reservations</h2>
          <Link href="/dashboard/listings" className="text-sm text-[#0077B6] hover:text-[#023E8A]">View all →</Link>
        </div>
        {upcoming.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No upcoming reservations</div>
        ) : (
          <div className="divide-y divide-[#2A2A2A]">
            {upcoming.slice(0, 5).map((s) => (
              <div key={s.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={s.guestAvatar} alt="" className="w-10 h-10 rounded-full bg-[#2A2A2A]" />
                  <div>
                    <p className="font-medium">{s.guestName}</p>
                    <p className="text-sm text-gray-400">{formatDate(s.date)} · {s.location}</p>
                  </div>
                </div>
                <p className="font-semibold text-[#0077B6]">{s.amount === 0 ? "Free" : `$${s.amount}`}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
