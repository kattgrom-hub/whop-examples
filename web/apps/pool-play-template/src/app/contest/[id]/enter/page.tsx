import { notFound } from "next/navigation";
import Link from "next/link";
import { getContest, contests } from "@/lib/data";
import { EntryForm } from "./entry-form";

export function generateStaticParams() {
  return contests.map((contest) => ({
    id: contest.id,
  }));
}

export default async function ContestEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contest = getContest(id);

  if (!contest) {
    notFound();
  }

  if (contest.status !== "open") {
    return (
      <main className="py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <h1 className="text-2xl font-bold mb-4">Contest Not Available</h1>
            <p className="text-gray-400 mb-6">
              This contest is no longer accepting entries.
            </p>
            <Link
              href="/contests"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Other Contests
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const typeLabels = {
    daily: "Daily Fantasy",
    survivor: "Survivor Pool",
    pickem: "Pick'em",
    season: "Season Long",
  };

  return (
    <main className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href={`/contest/${contest.id}`}
          className="text-gray-400 hover:text-white transition-colors mb-8 inline-block"
        >
          &#8592; Back to contest
        </Link>

        {/* Contest Summary */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
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
              <h1 className="text-2xl font-bold">{contest.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Entry Fee</p>
              <p className="text-2xl font-bold">${contest.entryFee}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Prize Pool: ${contest.prizePool.toLocaleString()}</span>
            <span>
              {contest.currentEntries.toLocaleString()} / {contest.maxEntries.toLocaleString()} entries
            </span>
          </div>
        </div>

        {/* Entry Form */}
        <EntryForm contest={contest} />
      </div>
    </main>
  );
}
