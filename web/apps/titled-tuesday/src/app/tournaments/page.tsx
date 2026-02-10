"use client";

import { useEffect, useState } from "react";
import { TournamentCard, type Tournament } from "@/components/tournament-card";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tournaments")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTournaments(data.tournaments || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-up">
      <div className="mb-10">
        <h1 className="font-display italic text-4xl md:text-5xl mb-3 text-text-primary">Tournaments</h1>
        <p className="text-text-secondary text-lg">Browse and enter upcoming chess tournaments</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="spinner-lg" />
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800/30 rounded-2xl p-6 text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && tournaments.length === 0 && (
        <div className="card p-12 text-center">
          <h2 className="font-display italic text-2xl mb-2 text-text-primary">No tournaments yet</h2>
          <p className="text-text-secondary">Check back soon for upcoming tournaments.</p>
        </div>
      )}

      {!loading && !error && tournaments.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      )}
    </div>
  );
}
