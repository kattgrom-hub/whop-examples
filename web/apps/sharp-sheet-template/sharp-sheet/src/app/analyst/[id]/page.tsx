import { notFound } from "next/navigation";
import Link from "next/link";
import { getAnalyst, analysts, getPicksByAnalyst } from "@/lib/data";
import { PickCard } from "@/components/pick-card";
import { SubscribeSection } from "./subscribe-section";

export function generateStaticParams() {
  return analysts.map((analyst) => ({
    id: analyst.id,
  }));
}

export default async function AnalystPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const analyst = getAnalyst(id);

  if (!analyst) {
    notFound();
  }

  const picks = getPicksByAnalyst(analyst.id);
  const winRate = Math.round(
    (analyst.record.wins /
      (analyst.record.wins + analyst.record.losses + analyst.record.pushes)) *
      100
  );

  return (
    <main className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/analysts"
          className="text-gray-400 hover:text-white transition-colors mb-8 inline-block"
        >
          Back to analysts
        </Link>

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative">
              <img
                src={analyst.avatar}
                alt={analyst.name}
                className="w-32 h-32 rounded-full bg-gray-700"
              />
              {analyst.verified && (
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold">{analyst.name}</h1>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {analyst.sports.map((sport) => (
                      <span
                        key={sport}
                        className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                      >
                        {sport}
                      </span>
                    ))}
                    {analyst.verified && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    ${analyst.monthlyPrice}
                    <span className="text-gray-400 text-lg font-normal">
                      /mo
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {analyst.subscriberCount.toLocaleString()} subscribers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <p className="text-2xl font-bold text-green-500">{winRate}%</p>
            <p className="text-sm text-gray-400">Win Rate</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <p className="text-2xl font-bold text-green-500">+{analyst.roi}%</p>
            <p className="text-sm text-gray-400">ROI</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <p className="text-2xl font-bold">
              {analyst.record.wins}-{analyst.record.losses}-{analyst.record.pushes}
            </p>
            <p className="text-sm text-gray-400">Record</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
            <p
              className={`text-2xl font-bold ${
                analyst.streak > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {analyst.streak > 0 ? `W${analyst.streak}` : `L${Math.abs(analyst.streak)}`}
            </p>
            <p className="text-sm text-gray-400">Streak</p>
          </div>
        </div>

        {/* About */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-300 leading-relaxed">{analyst.bio}</p>
        </div>

        {/* Subscribe Section */}
        <SubscribeSection analyst={analyst} />

        {/* Recent Picks */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-6">Recent Picks</h2>
          {picks.length > 0 ? (
            <div className="space-y-4">
              {picks.slice(0, 5).map((pick) => (
                <PickCard key={pick.id} pick={pick} showAnalyst={false} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center text-gray-400">
              No picks available yet. Subscribe to get notified when new picks are posted.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
