import { notFound } from "next/navigation";
import Link from "next/link";
import { getContest, contests, getContestEntries } from "@/lib/data";
import { Leaderboard } from "@/components/leaderboard";
import { ContestCountdown } from "./countdown";

export function generateStaticParams() {
  return contests.map((contest) => ({
    id: contest.id,
  }));
}

export default async function ContestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contest = getContest(id);

  if (!contest) {
    notFound();
  }

  const entries = getContestEntries(id);
  const fillPercentage = Math.round(
    (contest.currentEntries / contest.maxEntries) * 100
  );

  const typeLabels = {
    daily: "Daily Fantasy",
    survivor: "Survivor Pool",
    pickem: "Pick'em",
    season: "Season Long",
  };

  const statusColors = {
    open: "bg-green-500/20 text-green-500",
    live: "bg-yellow-500/20 text-yellow-500",
    completed: "bg-gray-500/20 text-gray-400",
  };

  return (
    <main className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/contests"
          className="text-gray-400 hover:text-white transition-colors mb-8 inline-block"
        >
          &#8592; Back to contests
        </Link>

        {/* Contest Header */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                  {contest.sport}
                </span>
                <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                  {typeLabels[contest.type]}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contest.status]}`}
                >
                  {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{contest.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Prize Pool</p>
              <p className="text-3xl font-bold text-green-500">
                ${contest.prizePool.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Entry Fee</p>
              <p className="text-xl font-semibold">${contest.entryFee}</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Entries</p>
              <p className="text-xl font-semibold">
                {contest.currentEntries.toLocaleString()} / {contest.maxEntries.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Fill</p>
              <p className="text-xl font-semibold">{fillPercentage}%</p>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">
                {contest.status === "open" ? "Starts In" : "Status"}
              </p>
              {contest.status === "open" ? (
                <ContestCountdown startTime={contest.startTime} />
              ) : (
                <p className="text-xl font-semibold">
                  {contest.status === "live" ? "In Progress" : "Completed"}
                </p>
              )}
            </div>
          </div>

          {/* Fill Progress */}
          <div className="mb-6">
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  fillPercentage >= 80 ? "bg-orange-500" : "bg-green-500"
                }`}
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>

          {/* Enter Button */}
          {contest.status === "open" && (
            <Link
              href={`/contest/${contest.id}/enter`}
              className="block w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg text-center"
            >
              Enter Contest - ${contest.entryFee}
            </Link>
          )}
        </div>

        {/* Rules */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Rules</h2>
          <p className="text-gray-300 leading-relaxed">{contest.rules}</p>
        </div>

        {/* Prize Structure */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Prize Structure</h2>
          <div className="space-y-3">
            {contest.prizes.map((prize, index) => (
              <div
                key={prize.place}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  index < 3 ? "bg-gray-700/50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border ${
                      prize.place === 1
                        ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
                        : prize.place === 2
                          ? "bg-gray-300/20 text-gray-300 border-gray-300/50"
                          : prize.place === 3
                            ? "bg-orange-600/20 text-orange-500 border-orange-500/50"
                            : "bg-gray-700 text-gray-400 border-gray-600"
                    }`}
                  >
                    {prize.place}
                  </span>
                  <span className="text-gray-300">
                    {prize.place === 1
                      ? "1st Place"
                      : prize.place === 2
                        ? "2nd Place"
                        : prize.place === 3
                          ? "3rd Place"
                          : `${prize.place}th Place`}
                  </span>
                </div>
                <span className={`font-semibold ${index < 3 ? "text-green-500" : "text-white"}`}>
                  ${prize.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        {entries.length > 0 && (
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold">Leaderboard</h2>
            </div>
            <Leaderboard entries={entries} maxDisplay={10} />
          </div>
        )}

        {entries.length === 0 && contest.status === "open" && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <p className="text-gray-400 mb-4">No entries yet. Be the first to enter!</p>
            <Link
              href={`/contest/${contest.id}/enter`}
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Enter Now
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
