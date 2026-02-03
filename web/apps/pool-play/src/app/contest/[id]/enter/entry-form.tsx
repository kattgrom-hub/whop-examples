"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Contest } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";

// Mock players for lineup selection
const MOCK_PLAYERS = {
  NFL: [
    { id: "p1", name: "J. Allen", position: "QB", team: "BUF", salary: 8500 },
    { id: "p2", name: "P. Mahomes", position: "QB", team: "KC", salary: 8200 },
    { id: "p3", name: "L. Jackson", position: "QB", team: "BAL", salary: 7900 },
    { id: "p4", name: "D. Henry", position: "RB", team: "TEN", salary: 7500 },
    { id: "p5", name: "C. McCaffrey", position: "RB", team: "SF", salary: 9000 },
    { id: "p6", name: "J. Jefferson", position: "WR", team: "MIN", salary: 8700 },
    { id: "p7", name: "T. Hill", position: "WR", team: "MIA", salary: 8400 },
    { id: "p8", name: "G. Kittle", position: "TE", team: "SF", salary: 6500 },
  ],
  NBA: [
    { id: "p1", name: "L. James", position: "SF", team: "LAL", salary: 10000 },
    { id: "p2", name: "S. Curry", position: "PG", team: "GSW", salary: 9500 },
    { id: "p3", name: "K. Durant", position: "SF", team: "PHX", salary: 9200 },
    { id: "p4", name: "J. Tatum", position: "SF", team: "BOS", salary: 8800 },
    { id: "p5", name: "G. Antetokounmpo", position: "PF", team: "MIL", salary: 10200 },
    { id: "p6", name: "L. Doncic", position: "PG", team: "DAL", salary: 9800 },
  ],
  default: [
    { id: "p1", name: "Player 1", position: "UTIL", team: "Team A", salary: 5000 },
    { id: "p2", name: "Player 2", position: "UTIL", team: "Team B", salary: 4500 },
    { id: "p3", name: "Player 3", position: "UTIL", team: "Team C", salary: 4000 },
    { id: "p4", name: "Player 4", position: "UTIL", team: "Team D", salary: 3500 },
  ],
};

// Mock teams for survivor pools
const MOCK_TEAMS = ["Chiefs", "Eagles", "Bills", "49ers", "Cowboys", "Ravens", "Lions", "Dolphins"];

interface EntryFormProps {
  contest: Contest;
}

export function EntryForm({ contest }: EntryFormProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedPicks, setSelectedPicks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const players = MOCK_PLAYERS[contest.sport as keyof typeof MOCK_PLAYERS] || MOCK_PLAYERS.default;
  const isSurvivor = contest.type === "survivor";
  const maxPicks = isSurvivor ? 1 : contest.type === "daily" ? 6 : 4;

  const togglePick = (pick: string) => {
    if (selectedPicks.includes(pick)) {
      setSelectedPicks(selectedPicks.filter((p) => p !== pick));
    } else if (selectedPicks.length < maxPicks) {
      setSelectedPicks([...selectedPicks, pick]);
    }
  };

  const handleEnterContest = async () => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (selectedPicks.length === 0) {
      setError("Please make at least one pick");
      return;
    }

    if (selectedPicks.length < maxPicks && !isSurvivor) {
      setError(`Please select ${maxPicks} picks`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Simulate entry submission
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/lobby");
    }, 1500);
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-semibold">
          {isSurvivor ? "Select Your Team" : "Build Your Lineup"}
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {isSurvivor
            ? "Pick one team to win this week"
            : `Select ${maxPicks} players for your lineup`}
        </p>
      </div>

      <div className="p-6">
        {/* Picks Selection */}
        {isSurvivor ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {MOCK_TEAMS.map((team) => (
              <button
                key={team}
                onClick={() => togglePick(team)}
                className={`p-4 rounded-lg transition-colors text-center ${
                  selectedPicks.includes(team)
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {team}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2 mb-6 max-h-80 overflow-y-auto">
            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => togglePick(player.name)}
                disabled={
                  selectedPicks.length >= maxPicks && !selectedPicks.includes(player.name)
                }
                className={`w-full p-3 rounded-lg transition-colors flex items-center justify-between ${
                  selectedPicks.includes(player.name)
                    ? "bg-green-600 text-white"
                    : selectedPicks.length >= maxPicks
                      ? "bg-gray-700/50 text-gray-500 cursor-not-allowed"
                      : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">
                    {player.position}
                  </span>
                  <div className="text-left">
                    <p className="font-medium">{player.name}</p>
                    <p className="text-xs text-gray-400">{player.team}</p>
                  </div>
                </div>
                <span className="text-sm">${player.salary.toLocaleString()}</span>
              </button>
            ))}
          </div>
        )}

        {/* Selected Picks Summary */}
        <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Selected</span>
            <span className="font-medium">
              {selectedPicks.length} / {maxPicks}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedPicks.map((pick) => (
              <span
                key={pick}
                className="px-3 py-1 bg-green-600/20 text-green-500 rounded-full text-sm"
              >
                {pick}
              </span>
            ))}
            {selectedPicks.length === 0 && (
              <span className="text-gray-500 text-sm">No picks selected</span>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleEnterContest}
          disabled={isSubmitting || selectedPicks.length === 0}
          className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
            isSubmitting || selectedPicks.length === 0
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              Processing...
            </span>
          ) : (
            `Enter Contest - $${contest.entryFee}`
          )}
        </button>

        <p className="text-gray-500 text-sm text-center mt-3">
          Secure checkout
        </p>
      </div>
    </div>
  );
}
