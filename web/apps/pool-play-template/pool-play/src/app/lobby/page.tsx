import Link from "next/link";
import { mockUserEntries, mockWinnings, mockPlayerStats } from "@/lib/entries-data";

export default function LobbyPage() {
  const activeEntries = mockUserEntries.filter(
    (e) => e.status === "active"
  );
  const completedEntries = mockUserEntries.filter(
    (e) => e.status === "won" || e.status === "lost"
  );

  const statusColors = {
    active: "bg-green-500/20 text-green-500",
    eliminated: "bg-red-500/20 text-red-500",
    won: "bg-yellow-500/20 text-yellow-500",
    lost: "bg-gray-500/20 text-gray-400",
  };

  return (
    <main className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Lobby</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Active Entries</p>
            <p className="text-3xl font-bold">{mockPlayerStats.activEntries}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Winnings</p>
            <p className="text-3xl font-bold text-green-500">
              ${mockPlayerStats.totalWinnings.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Win Rate</p>
            <p className="text-3xl font-bold">{mockPlayerStats.winRate}%</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Contests Entered</p>
            <p className="text-3xl font-bold">{mockPlayerStats.contestsEntered}</p>
          </div>
        </div>

        {/* Active Entries */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Entries</h2>
            <Link
              href="/contests"
              className="text-sm text-green-500 hover:text-green-400"
            >
              Enter More Contests
            </Link>
          </div>
          {activeEntries.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <p className="mb-4">No active entries</p>
              <Link
                href="/contests"
                className="inline-block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Browse Contests
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {activeEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/contest/${entry.contestId}`}
                  className="block p-4 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-lg font-bold">
                        {entry.sport.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{entry.contestName}</p>
                        <p className="text-sm text-gray-400">
                          Rank #{entry.currentRank} of {entry.totalEntries.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{entry.points} pts</p>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColors[entry.status]}`}
                      >
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {entry.picks.slice(0, 4).map((pick) => (
                      <span
                        key={pick}
                        className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
                      >
                        {pick}
                      </span>
                    ))}
                    {entry.picks.length > 4 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{entry.picks.length - 4} more
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Results */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Recent Results</h2>
          </div>
          {completedEntries.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No completed contests yet
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {completedEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-lg font-bold">
                      {entry.sport.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{entry.contestName}</p>
                      <p className="text-sm text-gray-400">
                        Finished #{entry.currentRank} of {entry.totalEntries.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {entry.status === "won" ? (
                      <p className="font-semibold text-green-500">
                        +${entry.potentialWinnings.toLocaleString()}
                      </p>
                    ) : (
                      <p className="font-semibold text-gray-400">-${entry.entryFee}</p>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${statusColors[entry.status]}`}
                    >
                      {entry.status === "won" ? "Winner" : "Finished"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Winnings History */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Winning History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="px-6 py-4 text-gray-400 font-medium">Contest</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Sport</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Place</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Prize</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockWinnings.map((win) => (
                  <tr key={win.id}>
                    <td className="px-6 py-4 font-medium">{win.contestName}</td>
                    <td className="px-6 py-4 text-gray-400">{win.sport}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold border ${
                          win.place === 1
                            ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                            : win.place === 2
                              ? "bg-gray-300/20 text-gray-300 border-gray-300/50"
                              : win.place === 3
                                ? "bg-orange-600/20 text-orange-500 border-orange-500/50"
                                : "bg-gray-700 text-gray-400 border-gray-600"
                        }`}
                      >
                        {win.place}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-green-500">
                      ${win.prize.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-400">{win.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
