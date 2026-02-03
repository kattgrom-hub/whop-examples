import Link from "next/link";
import type { Talent } from "@/lib/data";

export function TalentCard({ talent }: { talent: Talent }) {
  return (
    <Link
      href={`/talent/${talent.id}`}
      className="block bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
    >
      <div className="flex items-start gap-4">
        <img
          src={talent.avatar}
          alt={talent.name}
          className="w-16 h-16 rounded-full bg-gray-700"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white truncate">
              {talent.name}
            </h3>
            {talent.verified && (
              <span className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                ✓
              </span>
            )}
            {talent.isPremium && (
              <span className="flex-shrink-0 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                PRO
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">{talent.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500">★</span>
            <span className="text-white text-sm">{talent.rating}</span>
            <span className="text-gray-500 text-sm">
              ({talent.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mt-4 flex flex-wrap gap-2">
        {talent.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
          >
            {skill}
          </span>
        ))}
        {talent.skills.length > 3 && (
          <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
            +{talent.skills.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-700">
        <span className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300">
          {talent.category}
        </span>
        <div className="text-right">
          <span className="text-white font-semibold">
            ${talent.hourlyRate}
            <span className="text-gray-400 font-normal">/hr</span>
          </span>
          <p className="text-xs text-gray-500">
            Min ${talent.projectMinimum} project
          </p>
        </div>
      </div>
    </Link>
  );
}
