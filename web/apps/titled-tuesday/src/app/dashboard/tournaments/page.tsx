"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface Tournament {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  entryFee: number;
  maxPlayers: number;
  currentPlayers: number;
  status: string;
  results: unknown;
}

interface ConnectedAccount {
  id: string;
  title: string;
  metadata: Record<string, string>;
}

export default function ManageTournamentsPage() {
  const { user } = useAuth();
  const [connectedAccount, setConnectedAccount] = useState<ConnectedAccount | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create form state
  const [title, setTitle] = useState("Weekly Blitz Arena");
  const [description, setDescription] = useState("11-round Swiss blitz (5+0). Open to all titled players. Top 3 paid.");
  const [date, setDate] = useState("2026-02-14");
  const [time, setTime] = useState("06:00");
  const [entryFee, setEntryFee] = useState("50");
  const [maxPlayers, setMaxPlayers] = useState("8");

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    fetch(`/api/connected-account?userId=${user.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.company) return;
        setConnectedAccount(data.company);

        return fetch(`/api/organizer/tournaments?organizerId=${data.company.id}`)
          .then((r) => r.json())
          .then((tData) => setTournaments(tData.tournaments || []));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectedAccount || !user) return;
    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/organizer/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizerId: connectedAccount.id,
          organizerName: connectedAccount.title || user.name || user.username,
          title,
          description,
          date,
          time,
          entryFee: parseFloat(entryFee),
          maxPlayers: maxPlayers ? parseInt(maxPlayers) : 0,
          prizeStructure: { "1st": 50, "2nd": 30, "3rd": 20 },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setTournaments((prev) => [data.tournament, ...prev]);
      setShowCreate(false);
      setTitle(""); setDescription(""); setDate(""); setTime(""); setEntryFee(""); setMaxPlayers("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tournament");
    } finally {
      setCreating(false);
    }
  };

  const handleStatusChange = async (tournamentId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/organizer/tournaments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tournamentId, status: newStatus }),
      });
      if (!res.ok) throw new Error((await res.json()).error);

      setTournaments((prev) =>
        prev.map((t) => t.id === tournamentId ? { ...t, status: newStatus } : t)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-display italic text-2xl text-text-primary mb-8">My Tournaments</h1>
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display italic text-2xl text-text-primary">My Tournaments</h1>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className={showCreate
            ? "px-4 py-2 bg-transparent border border-border-default text-text-primary rounded-xl hover:bg-surface-overlay hover:border-border-strong transition-all duration-200 font-medium"
            : "px-4 py-2 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-medium hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          }
        >
          {showCreate ? "Cancel" : "Create Tournament"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-3 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Create Form */}
      {showCreate && (
        <div className="card p-6 mb-8 animate-fade-up">
          <h2 className="font-display italic text-lg text-text-primary mb-4">Create Tournament</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Tournament Name</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Weekly Blitz Arena"
                className="w-full px-4 py-3 bg-surface-base border border-border-default rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tournament details..."
                rows={3}
                className="w-full px-4 py-3 bg-surface-base border border-border-default rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-surface-base border border-border-default rounded-xl text-text-primary focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-surface-base border border-border-default rounded-xl text-text-primary focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1">Entry Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={entryFee}
                  onChange={(e) => setEntryFee(e.target.value)}
                  required
                  placeholder="50"
                  className="w-full px-4 py-3 bg-surface-base border border-border-default rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                />
              </div>
              <div>
                <label className="block text-sm text-text-secondary mb-1">Max Players (0 = unlimited)</label>
                <input
                  type="number"
                  min="0"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(e.target.value)}
                  placeholder="64"
                  className="w-full px-4 py-3 bg-surface-base border border-border-default rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-3 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Tournament"}
            </button>
          </form>
        </div>
      )}

      {/* Tournament List */}
      {tournaments.length === 0 ? (
        <div className="card p-12 text-center">
          <h2 className="font-display italic text-xl text-text-primary mb-2">No tournaments yet</h2>
          <p className="text-text-secondary">Create your first tournament to get started.</p>
        </div>
      ) : (
        <div className="space-y-4 stagger-children">
          {tournaments.map((t) => (
            <div key={t.id} className="card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-text-primary">{t.title}</h3>
                  <p className="text-sm text-text-secondary">{t.date} at {t.time}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${
                    t.status === "upcoming" ? "bg-teal-900 text-teal-400" :
                    t.status === "in_progress" ? "bg-yellow-900/30 text-yellow-400" :
                    t.status === "completed" ? "bg-surface-overlay text-text-tertiary" :
                    "bg-red-900/30 text-red-400"
                  }`}>
                    {t.status}
                  </span>
                  <p className="text-sm text-text-secondary mt-1">{t.currentPlayers}/{t.maxPlayers || "~"} players</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <span className="text-text-secondary">Entry fee: <span className="font-display text-amber-400">${t.entryFee}</span></span>
                <span className="text-text-secondary">Prize pool: <span className="font-display text-amber-400">${t.entryFee * t.currentPlayers}</span></span>
              </div>

              {/* Status transition buttons */}
              <div className="flex gap-2 mt-4">
                {t.status === "upcoming" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(t.id, "in_progress")}
                      className="px-3 py-1.5 bg-yellow-900/30 text-yellow-400 rounded-xl text-sm hover:bg-yellow-900/50 transition-colors"
                    >
                      Start Tournament
                    </button>
                    <button
                      onClick={() => handleStatusChange(t.id, "cancelled")}
                      className="px-3 py-1.5 bg-red-900/30 text-red-400 border border-red-800/30 rounded-xl text-sm hover:bg-red-900/50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {t.status === "in_progress" && (
                  <button
                    onClick={() => handleStatusChange(t.id, "completed")}
                    className="px-3 py-1.5 bg-amber-600 text-text-inverse rounded-xl text-sm hover:bg-amber-500 transition-all duration-200 font-medium"
                  >
                    Complete & Record Results
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
