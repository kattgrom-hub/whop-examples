import Link from "next/link";
import type { Gig } from "@/lib/data";

export function GigCard({ gig }: { gig: Gig }) {
  return (
    <Link
      href={`/gig/${gig.id}`}
      className="block bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <img
          src={gig.clientAvatar}
          alt={gig.clientName}
          className="w-10 h-10 rounded-lg bg-gray-700"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-400">{gig.clientName}</p>
          <h3 className="font-semibold text-white line-clamp-2">{gig.title}</h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 text-sm line-clamp-2 mb-4">
        {gig.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {gig.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300"
          >
            {skill}
          </span>
        ))}
        {gig.skills.length > 3 && (
          <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
            +{gig.skills.length - 3}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div>
          <p className="text-white font-semibold">
            ${gig.budget.min.toLocaleString()} - $
            {gig.budget.max.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">{gig.duration}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">{gig.applications} applicants</p>
          <p className="text-xs text-gray-500">Due {gig.deadline}</p>
        </div>
      </div>
    </Link>
  );
}
