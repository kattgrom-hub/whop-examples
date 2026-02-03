import type { Entry } from "@/lib/data";

interface LeaderboardProps {
  entries: Entry[];
  showRank?: boolean;
  maxDisplay?: number;
}

export function Leaderboard({
  entries,
  showRank = true,
  maxDisplay = 10,
}: LeaderboardProps) {
  const sortedEntries = [...entries]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, maxDisplay);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
    if (rank === 2) return "bg-gray-300/20 text-gray-300 border-gray-300/50";
    if (rank === 3) return "bg-orange-600/20 text-orange-500 border-orange-500/50";
    return "bg-gray-700 text-gray-400 border-gray-600";
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "1st";
    if (rank === 2) return "2nd";
    if (rank === 3) return "3rd";
    return `${rank}th`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-left">
            {showRank && (
              <th className="px-4 py-3 text-gray-400 font-medium w-16">Rank</th>
            )}
            <th className="px-4 py-3 text-gray-400 font-medium">Player</th>
            <th className="px-4 py-3 text-gray-400 font-medium text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {sortedEntries.map((entry) => (
            <tr
              key={entry.id}
              className={entry.rank <= 3 ? "bg-gray-800/50" : ""}
            >
              {showRank && (
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold border ${getRankStyle(entry.rank)}`}
                  >
                    {entry.rank <= 3 ? getRankBadge(entry.rank).slice(0, 1) : entry.rank}
                  </span>
                </td>
              )}
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={entry.userAvatar}
                    alt={entry.userName}
                    className="w-8 h-8 rounded-full bg-gray-700"
                  />
                  <div>
                    <p className="font-medium text-white">{entry.userName}</p>
                    <p className="text-xs text-gray-500">
                      {entry.picks.slice(0, 3).join(", ")}
                      {entry.picks.length > 3 && "..."}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={`font-semibold ${
                    entry.rank <= 3 ? "text-green-500" : "text-white"
                  }`}
                >
                  {entry.points.toFixed(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
