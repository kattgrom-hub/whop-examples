"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface TournamentEntry {
  id: string;
  title: string;
  date: string;
  time: string;
  entryFee: number;
  status: string;
  currentPlayers: number;
  results: {
    placements: Array<{ userId: string; username: string; place: number; prize: number }>;
    totalPrizePool: number;
    completedAt: string;
  } | null;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<TournamentEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all tournaments and filter ones the user has entered
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then((data) => setTournaments(data.tournaments || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="font-display italic text-2xl text-text-primary mb-8">Tournament History</h1>
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  const completedTournaments = tournaments.filter((t) => t.status === "completed");

  return (
    <div>
      <h1 className="font-display italic text-2xl text-text-primary mb-8">Tournament History</h1>

      {completedTournaments.length === 0 ? (
        <div className="card p-12 text-center">
          <h2 className="font-display italic text-xl text-text-primary mb-2">No completed tournaments yet</h2>
          <p className="text-text-secondary">Your tournament history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4 stagger-children">
          {completedTournaments.map((t) => (
            <div key={t.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-text-primary">{t.title}</h3>
                  <p className="text-sm text-text-secondary">{t.date} &middot; {t.currentPlayers} anglers</p>
                </div>
                <span className="badge bg-surface-overlay text-text-tertiary">Completed</span>
              </div>

              {t.results && (
                <div className="mt-4">
                  <p className="text-sm text-text-secondary mb-2">
                    Prize Pool: <span className="font-display text-creek-400 font-semibold">${t.results.totalPrizePool}</span>
                  </p>
                  <div className="space-y-2">
                    {t.results.placements.map((p) => (
                      <div key={p.place} className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">
                          {p.place}. {p.username}
                          {p.userId === user?.id && <span className="text-creek-400 ml-1">(you)</span>}
                        </span>
                        <span className="font-display text-creek-400 font-medium">${p.prize}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
