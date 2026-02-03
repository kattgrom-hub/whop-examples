import Link from "next/link";
import type { Analyst } from "@/lib/data";

export function AnalystCard({ analyst }: { analyst: Analyst }) {
  const winRate = Math.round(
    (analyst.record.wins /
      (analyst.record.wins + analyst.record.losses + analyst.record.pushes)) *
      100
  );

  return (
    <Link
      href={`/analyst/${analyst.id}`}
      className="block bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          <img
            src={analyst.avatar}
            alt={analyst.name}
            className="w-16 h-16 rounded-full bg-gray-700"
          />
          {analyst.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
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
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            {analyst.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {analyst.sports.map((sport) => (
              <span
                key={sport}
                className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300"
              >
                {sport}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-green-500 font-medium">{winRate}% Win</span>
            <span className="text-gray-400">
              {analyst.record.wins}-{analyst.record.losses}-{analyst.record.pushes}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xl font-bold text-green-500">+{analyst.roi}%</p>
          <p className="text-xs text-gray-500">ROI</p>
        </div>
        <div>
          <p
            className={`text-xl font-bold ${
              analyst.streak > 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {analyst.streak > 0 ? `W${analyst.streak}` : `L${Math.abs(analyst.streak)}`}
          </p>
          <p className="text-xs text-gray-500">Streak</p>
        </div>
        <div>
          <p className="text-xl font-bold text-white">
            {analyst.subscriberCount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Subs</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-700">
        <span className="text-white font-semibold">
          ${analyst.monthlyPrice}
          <span className="text-gray-400 font-normal">/mo</span>
        </span>
        <span className="text-green-500 text-sm font-medium">
          Subscribe →
        </span>
      </div>
    </Link>
  );
}
