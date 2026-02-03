import Link from "next/link";
import type { Pick } from "@/lib/data";
import { analysts } from "@/lib/data";

interface PickCardProps {
  pick: Pick;
  showAnalyst?: boolean;
}

export function PickCard({ pick, showAnalyst = true }: PickCardProps) {
  const analyst = analysts.find((a) => a.id === pick.analystId);

  const resultStyles = {
    win: "bg-green-500/20 text-green-500 border-green-500/50",
    loss: "bg-red-500/20 text-red-500 border-red-500/50",
    push: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
    pending: "bg-gray-700/50 text-gray-300 border-gray-600",
  };

  const unitStars = Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={i < pick.units ? "text-yellow-500" : "text-gray-600"}
    >
      ★
    </span>
  ));

  const sportEmojis: Record<string, string> = {
    NFL: "🏈",
    NBA: "🏀",
    MLB: "⚾",
    NHL: "🏒",
    Soccer: "⚽",
    Tennis: "🎾",
  };

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      {showAnalyst && analyst && (
        <Link
          href={`/analyst/${analyst.id}`}
          className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700"
        >
          <img
            src={analyst.avatar}
            alt={analyst.name}
            className="w-10 h-10 rounded-full bg-gray-700"
          />
          <div>
            <p className="font-medium text-white hover:text-green-400 transition-colors">
              {analyst.name}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(pick.createdAt).toLocaleDateString()} at{" "}
              {new Date(pick.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </Link>
      )}

      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{sportEmojis[pick.sport] || "🎯"}</span>
            <span className="text-sm text-gray-400">{pick.league}</span>
          </div>
          <h3 className="text-lg font-semibold text-white">{pick.matchup}</h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${
            resultStyles[pick.result || "pending"]
          }`}
        >
          {pick.result === "pending" || !pick.result
            ? "Live"
            : pick.result.charAt(0).toUpperCase() + pick.result.slice(1)}
        </span>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">{pick.pickType}</span>
          <span className="text-sm">{unitStars}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">{pick.pick}</span>
          <span className="text-lg font-semibold text-green-500">
            {pick.odds}
          </span>
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed">{pick.analysis}</p>

      <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          Game: {new Date(pick.gameTime).toLocaleDateString()} at{" "}
          {new Date(pick.gameTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
        <span className="text-gray-500">
          {pick.units} unit{pick.units !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
