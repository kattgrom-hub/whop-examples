import Link from "next/link";
import type { Contest } from "@/lib/data";

export function ContestCard({ contest }: { contest: Contest }) {
  const fillPercentage = Math.round(
    (contest.currentEntries / contest.maxEntries) * 100
  );
  const isAlmostFull = fillPercentage >= 80;

  const typeLabels = {
    daily: "Daily Fantasy",
    survivor: "Survivor",
    pickem: "Pick'em",
    season: "Season Long",
  };

  const statusColors = {
    open: "bg-green-500/20 text-green-500",
    live: "bg-yellow-500/20 text-yellow-500",
    completed: "bg-gray-500/20 text-gray-400",
  };

  return (
    <Link
      href={`/contest/${contest.id}`}
      className="block bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
              {contest.sport}
            </span>
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
              {typeLabels[contest.type]}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">{contest.name}</h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contest.status]}`}
        >
          {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-sm">Entry Fee</p>
          <p className="text-white font-semibold">${contest.entryFee}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Prize Pool</p>
          <p className="text-green-500 font-semibold">
            ${contest.prizePool.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Fill Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-gray-400">
            {contest.currentEntries.toLocaleString()} /{" "}
            {contest.maxEntries.toLocaleString()} entries
          </span>
          <span className={isAlmostFull ? "text-orange-400" : "text-gray-400"}>
            {fillPercentage}% full
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isAlmostFull ? "bg-orange-500" : "bg-green-500"
            }`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
      </div>

      {/* Start Time */}
      <div className="text-sm text-gray-400">
        {contest.status === "open" ? (
          <>Starts {new Date(contest.startTime).toLocaleDateString()}</>
        ) : contest.status === "live" ? (
          <span className="text-yellow-500">In Progress</span>
        ) : (
          <span className="text-gray-500">Completed</span>
        )}
      </div>
    </Link>
  );
}
