import Link from "next/link";
import type { Coach } from "@/lib/data";

export function CoachCard({ coach }: { coach: Coach }) {
  return (
    <Link
      href={`/coach/${coach.id}`}
      className="block bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
    >
      <div className="flex items-start gap-4">
        <img
          src={coach.avatar}
          alt={coach.name}
          className="w-16 h-16 rounded-full bg-gray-700"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate">
            {coach.name}
          </h3>
          <p className="text-gray-400 text-sm">{coach.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500">★</span>
            <span className="text-white text-sm">{coach.rating}</span>
            <span className="text-gray-500 text-sm">
              ({coach.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
          {coach.category}
        </span>
        <span className="text-white font-semibold">
          ${coach.hourlyRate}
          <span className="text-gray-400 font-normal">/hr</span>
        </span>
      </div>
    </Link>
  );
}
