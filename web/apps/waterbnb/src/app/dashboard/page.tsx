"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useMode } from "@/lib/mode-context";

interface ReservedBoat {
  id: string;
  guestName: string;
  guestAvatar: string;
  date: string;
  location: string;
  amount: number;
  status: "upcoming" | "completed" | "cancelled";
}

interface Listing {
  id: string;
  title: string;
  location: string;
  pricePerTrip: number;
  availableDates: string[];
}

const formatDate = (d: string) =>
  d
    ? new Date(d + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "";

const isToday = (d: string) => {
  const today = new Date().toISOString().split("T")[0];
  return d === today;
};

const isTomorrow = (d: string) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d === tomorrow.toISOString().split("T")[0];
};

const isThisWeek = (d: string) => {
  const date = new Date(d + "T12:00:00");
  const now = new Date();
  const weekEnd = new Date();
  weekEnd.setDate(now.getDate() + 7);
  return date >= now && date <= weekEnd;
};

export default function DashboardPage() {
  const { mode } = useMode();

  if (mode === "traveling") {
    return <TravelingDashboard />;
  }

  return <HostingDashboard />;
}

function HostingDashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservedBoat[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.companyId) return setIsLoading(false);
    fetch(`/api/host/sessions?companyId=${user.companyId}`)
      .then((res) => (res.ok ? res.json() : { bookedSessions: [], availableListings: [] }))
      .then((data) => {
        setReservations(data.bookedSessions || []);
        setListings(data.availableListings || []);
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.companyId]);

  const upcoming = reservations.filter((s) => s.status === "upcoming");
  const completed = reservations.filter((s) => s.status === "completed");
  const totalEarned = completed.reduce((sum, s) => sum + (s.amount || 0), 0);

  // Currently hosting = booking date is today
  // Arriving soon = booking date is in the future
  // Checking out = past date but still "upcoming" status (wrapping up)
  const currentlyHosting = upcoming.filter((s) => isToday(s.date));
  const arrivingSoon = upcoming.filter(
    (s) => new Date(s.date + "T12:00:00") > new Date() && !isToday(s.date)
  );
  const checkingOut = upcoming.filter(
    (s) => new Date(s.date + "T12:00:00") < new Date() && !isToday(s.date)
  );

  // Pending tasks
  const pendingTasks = [];
  if (listings.length === 0) {
    pendingTasks.push({
      icon: "⛵",
      title: "Create your first listing",
      description: "Add a boat to start accepting reservations",
      href: "/dashboard/listings",
    });
  }
  if (upcoming.length > 0) {
    pendingTasks.push({
      icon: "💬",
      title: `Confirm ${upcoming.length} upcoming reservation${upcoming.length !== 1 ? "s" : ""}`,
      description: "Review details and message your guests",
      href: "/messages",
    });
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reservation status cards - Airbnb style */}
      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          Your reservations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReservationStatusCard
            label="Checking out"
            count={checkingOut.length}
            guests={checkingOut}
          />
          <ReservationStatusCard
            label="Currently hosting"
            count={currentlyHosting.length}
            guests={currentlyHosting}
          />
          <ReservationStatusCard
            label="Arriving soon"
            count={arrivingSoon.length}
            guests={arrivingSoon}
          />
        </div>
      </section>

      {/* Pending tasks */}
      {pendingTasks.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            Things to do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingTasks.map((task) => (
              <Link
                key={task.title}
                href={task.href}
                className="flex items-start gap-4 p-5 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] hover:border-[#DDDDDD] transition-colors group"
              >
                <span className="text-2xl">{task.icon}</span>
                <div>
                  <p className="font-medium group-hover:text-[#222222] transition-colors">
                    {task.title}
                  </p>
                  <p className="text-sm text-[#717171] mt-0.5">{task.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Earnings summary */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            Earnings summary
          </h2>
          <Link
            href="/dashboard/payouts"
            className="text-sm text-[#FF385C] hover:underline"
          >
            View details
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
            <p className="text-sm text-[#717171] mb-1">Total earned</p>
            <p className="text-2xl font-semibold">${totalEarned}</p>
          </div>
          <div className="p-5 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
            <p className="text-sm text-[#717171] mb-1">Completed trips</p>
            <p className="text-2xl font-semibold">{completed.length}</p>
          </div>
          <div className="p-5 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
            <p className="text-sm text-[#717171] mb-1">Upcoming trips</p>
            <p className="text-2xl font-semibold">{upcoming.length}</p>
          </div>
        </div>
      </section>

      {/* Upcoming reservations list */}
      {upcoming.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
              Upcoming reservations
            </h2>
            <Link
              href="/dashboard/listings"
              className="text-sm text-[#FF385C] hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] divide-y divide-[#EBEBEB]">
            {upcoming.slice(0, 5).map((s) => (
              <div
                key={s.id}
                className="p-4 flex items-center justify-between hover:bg-[#222222] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={s.guestAvatar}
                    alt=""
                    className="w-10 h-10 rounded-full bg-[#EBEBEB]"
                  />
                  <div>
                    <p className="font-medium">{s.guestName}</p>
                    <p className="text-sm text-[#717171]">
                      {formatDate(s.date)} &middot; {s.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {s.amount === 0 ? "Free" : `$${s.amount}`}
                  </span>
                  <Link
                    href="/messages"
                    className="px-3 py-1.5 text-sm border border-[#DDDDDD] rounded-lg hover:bg-[#EBEBEB] transition-colors"
                  >
                    Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick links */}
      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <QuickLink
            href="/dashboard/listings"
            title="Manage listings"
            description="Add, edit, or remove your boats"
          />
          <QuickLink
            href="/dashboard/payouts"
            title="Withdraw earnings"
            description="Transfer your balance"
          />
          <QuickLink
            href="/dashboard/profile"
            title="Edit profile"
            description="Update your host information"
          />
        </div>
      </section>
    </div>
  );
}

function ReservationStatusCard({
  label,
  count,
  guests,
}: {
  label: string;
  count: number;
  guests: ReservedBoat[];
}) {
  return (
    <div className="p-5 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-[#717171]">{label}</p>
        <span className="text-2xl font-semibold">{count}</span>
      </div>
      {guests.length > 0 ? (
        <div className="space-y-2">
          {guests.slice(0, 2).map((g) => (
            <div key={g.id} className="flex items-center gap-2">
              <img
                src={g.guestAvatar}
                alt=""
                className="w-6 h-6 rounded-full bg-[#EBEBEB]"
              />
              <span className="text-sm text-[#484848] truncate">{g.guestName}</span>
            </div>
          ))}
          {guests.length > 2 && (
            <p className="text-xs text-[#717171]">
              +{guests.length - 2} more
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-[#717171]">No guests</p>
      )}
    </div>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="p-4 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] hover:border-[#DDDDDD] transition-colors group"
    >
      <p className="font-medium group-hover:text-[#222222] transition-colors">{title}</p>
      <p className="text-sm text-[#717171] mt-1">{description}</p>
    </Link>
  );
}

interface TravelReservation {
  id: string;
  title: string;
  hostName: string;
  hostAvatar: string;
  date: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
}

function TravelingDashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<TravelReservation[]>([]);
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
      {/* Browse prompt */}
      <section>
        <Link
          href="/browse"
          className="block p-6 bg-gradient-to-r from-[#FF385C] to-[#D70466] rounded-xl text-white hover:opacity-95 transition-opacity"
        >
          <h2 className="text-xl font-bold mb-1">Find your next adventure</h2>
          <p className="text-white/80 text-sm">Browse boats from local hosts</p>
        </Link>
      </section>

      {/* Upcoming trips */}
      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          Upcoming trips
        </h2>
        {upcoming.length === 0 ? (
          <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-8 text-center">
            <p className="text-[#717171] mb-4">No upcoming trips</p>
            <Link href="/browse" className="text-[#FF385C] hover:text-[#D70466] underline font-medium">
              Browse boats
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((r) => (
              <div key={r.id} className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={r.hostAvatar} alt="" className="w-10 h-10 rounded-full bg-[#EBEBEB]" />
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-[#717171]">
                      {formatDate(r.date)} &middot; {r.location}
                    </p>
                  </div>
                </div>
                <Link
                  href="/messages"
                  className="px-3 py-1.5 text-sm border border-[#DDDDDD] rounded-lg hover:bg-[#EBEBEB] transition-colors"
                >
                  Message Host
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Past trips */}
      {past.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
              Past trips
            </h2>
            <Link href="/dashboard/reservations" className="text-sm text-[#FF385C] hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
              <p className="text-sm text-[#717171] mb-1">Total trips</p>
              <p className="text-2xl font-semibold">{reservations.length}</p>
            </div>
            <div className="p-5 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
              <p className="text-sm text-[#717171] mb-1">Completed</p>
              <p className="text-2xl font-semibold">{past.filter((r) => r.status === "completed").length}</p>
            </div>
            <div className="p-5 bg-[#F7F7F7] rounded-xl border border-[#DDDDDD]">
              <p className="text-sm text-[#717171] mb-1">Upcoming</p>
              <p className="text-2xl font-semibold">{upcoming.length}</p>
            </div>
          </div>
        </section>
      )}

      {/* Quick links */}
      <section>
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
          Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <QuickLink href="/browse" title="Browse boats" description="Find your next boat trip" />
          <QuickLink href="/dashboard/reservations" title="My reservations" description="View all your bookings" />
          <QuickLink href="/dashboard/profile" title="Edit profile" description="Update your information" />
        </div>
      </section>
    </div>
  );
}
