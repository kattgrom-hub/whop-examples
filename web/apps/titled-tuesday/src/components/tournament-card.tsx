"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WhopEmbeddedCheckout } from "@/components/whop-checkout";

export interface Tournament {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  entryFee: number;
  maxPlayers: number;
  currentPlayers: number;
  organizerId: string;
  organizerName: string;
  prizeStructure: Record<string, number>;
  status: "upcoming" | "in_progress" | "completed" | "cancelled";
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

const statusColors: Record<string, string> = {
  upcoming: "bg-teal-900 text-teal-400 border border-teal-700/30",
  in_progress: "bg-yellow-900/30 text-yellow-400 border border-yellow-700/30",
  completed: "bg-surface-overlay text-text-tertiary border border-border-subtle",
  cancelled: "bg-red-900/30 text-red-400 border border-red-800/30",
};

const statusLabels: Record<string, string> = {
  upcoming: "Open",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  const router = useRouter();
  const [planId, setPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFull = tournament.maxPlayers > 0 && tournament.currentPlayers >= tournament.maxPlayers;
  const canEnter = tournament.status === "upcoming" && !isFull;
  const totalPrizePool = tournament.entryFee * tournament.currentPlayers;
  const capacityPercent = tournament.maxPlayers > 0
    ? Math.min(100, (tournament.currentPlayers / tournament.maxPlayers) * 100)
    : 0;

  const handleEnter = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tournamentId: tournament.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      setPlanId(data.planId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutSuccess = () => {
    router.push(`/tournaments/${tournament.id}?entered=true`);
  };

  if (planId) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-text-primary">{tournament.title}</h3>
            <p className="text-sm text-text-secondary">
              Entry fee: <span className="font-display text-amber-400">${tournament.entryFee}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border border-border-subtle mb-4">
          <WhopEmbeddedCheckout
            planId={planId}
            onSuccess={handleCheckoutSuccess}
          />
        </div>

        <button
          onClick={() => setPlanId(null)}
          className="w-full py-3 text-text-secondary hover:text-text-primary bg-surface-overlay hover:bg-surface-overlay/80 rounded-xl transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="card card-lift p-6">
      <div className="flex items-start justify-between mb-4">
        <span className={`badge ${statusColors[tournament.status]}`}>
          {statusLabels[tournament.status]}
        </span>
        <span className="font-display text-2xl text-amber-400">
          ${tournament.entryFee}
        </span>
      </div>

      <h3 className="font-semibold text-lg mb-1 text-text-primary">{tournament.title}</h3>
      <p className="text-sm text-text-tertiary mb-3">by {tournament.organizerName}</p>

      {tournament.description && (
        <p className="text-text-secondary text-sm mb-4 line-clamp-2">
          {tournament.description}
        </p>
      )}

      <div className="flex items-center gap-4 text-sm text-text-tertiary mb-4">
        <span>{formatDate(tournament.date)}</span>
        <span>{formatTime(tournament.time)}</span>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-text-secondary">
            {tournament.currentPlayers}/{tournament.maxPlayers || "\u221E"} players
          </span>
          {totalPrizePool > 0 && (
            <span className="text-text-secondary">
              Pool: <span className="font-display text-amber-400">${totalPrizePool}</span>
            </span>
          )}
        </div>
        {tournament.maxPlayers > 0 && (
          <div className="w-full h-1.5 bg-surface-overlay rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-400 text-sm mb-3">{error}</p>
      )}

      {canEnter && (
        <button
          onClick={handleEnter}
          disabled={isLoading}
          className="w-full py-3.5 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          {isLoading ? (
            <>
              <div className="spinner" style={{ width: "1rem", height: "1rem", borderWidth: "2px" }} />
              Loading...
            </>
          ) : (
            `Enter Tournament \u2014 $${tournament.entryFee}`
          )}
        </button>
      )}

      {isFull && tournament.status === "upcoming" && (
        <div className="w-full py-3.5 text-center text-text-tertiary bg-surface-overlay/50 rounded-xl font-medium">
          Tournament Full
        </div>
      )}
    </div>
  );
}
