"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { TournamentCard, type Tournament } from "@/components/tournament-card";
import Link from "next/link";

export default function TournamentDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const justEntered = searchParams.get("entered") === "true";

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/tournaments/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setTournament(data.tournament);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center py-20">
          <div className="spinner-lg" />
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-red-900/20 border border-red-800/30 rounded-2xl p-6 text-center">
          <p className="text-red-400">{error || "Tournament not found"}</p>
          <Link href="/tournaments" className="text-amber-500 hover:text-amber-400 mt-4 inline-block">
            Back to Tournaments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-up">
      <Link href="/tournaments" className="group text-text-secondary hover:text-text-primary transition-colors mb-6 inline-flex items-center gap-1.5">
        <span className="inline-block transition-transform group-hover:-translate-x-1">&larr;</span>
        All Tournaments
      </Link>

      {justEntered && (
        <div className="bg-teal-900/30 border border-teal-700/30 rounded-2xl p-4 mb-6 animate-fade-in">
          <p className="text-teal-400 font-medium">You&apos;re in! You&apos;ve successfully entered this tournament.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Details */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl mb-2 text-text-primary">{tournament.title}</h1>
          <p className="text-text-secondary mb-8">{tournament.description}</p>

          <div className="space-y-0">
            {[
              { label: "Entry Fee", value: <span className="font-display text-amber-400">${tournament.entryFee}</span> },
              { label: "Date", value: `${tournament.date} at ${tournament.time}` },
              { label: "Players", value: `${tournament.currentPlayers}/${tournament.maxPlayers || "Unlimited"}` },
              { label: "Prize Pool", value: <span className="font-display text-amber-400 text-xl">${tournament.entryFee * tournament.currentPlayers}</span> },
              { label: "Organizer", value: tournament.organizerName },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-3.5 border-b border-border-subtle">
                <span className="text-text-tertiary text-sm uppercase tracking-wider font-medium">{row.label}</span>
                <span className="text-text-primary">{row.value}</span>
              </div>
            ))}
          </div>

          {/* Prize Structure */}
          {tournament.prizeStructure && Object.keys(tournament.prizeStructure).length > 0 && (
            <div className="mt-8">
              <h3 className="font-semibold mb-3 text-text-primary">Prize Structure</h3>
              <div className="bg-surface-raised rounded-2xl p-5 space-y-3 border border-border-subtle">
                {Object.entries(tournament.prizeStructure).map(([place, pct]) => (
                  <div key={place} className="flex justify-between text-sm">
                    <span className="text-text-secondary">{place}</span>
                    <span className="font-display text-amber-400">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Entry Card */}
        <div>
          <TournamentCard tournament={tournament} />
        </div>
      </div>
    </div>
  );
}
