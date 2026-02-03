import Link from "next/link";
import { mockCreatedContests } from "@/lib/creator-data";

export default function ContestsManagementPage() {
  const statusColors = {
    draft: "bg-gray-500/20 text-gray-400",
    open: "bg-green-500/20 text-green-500",
    live: "bg-yellow-500/20 text-yellow-500",
    completed: "bg-blue-500/20 text-blue-400",
  };

  const typeLabels = {
    daily: "Daily Fantasy",
    survivor: "Survivor",
    pickem: "Pick'em",
    season: "Season Long",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Contests</h1>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
          Create New Contest
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Open", "Live", "Completed", "Draft"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded-lg transition-colors ${
              status === "All"
                ? "bg-green-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Contests Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="px-6 py-4 text-gray-400 font-medium">Contest</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Type</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Entry Fee</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Entries</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Revenue</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {mockCreatedContests.map((contest) => (
                <tr key={contest.id} className="hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-sm font-bold">
                        {contest.sport.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium">{contest.name}</p>
                        <p className="text-sm text-gray-500">{contest.sport}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {typeLabels[contest.type]}
                  </td>
                  <td className="px-6 py-4">${contest.entryFee}</td>
                  <td className="px-6 py-4">
                    {contest.totalEntries.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-green-500">
                    ${contest.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contest.status]}`}
                    >
                      {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/contest/${contest.id}`}
                        className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                      >
                        View
                      </Link>
                      {contest.status === "draft" && (
                        <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                          Publish
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Contest CTA */}
      <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Ready to launch a new contest?</h3>
            <p className="text-gray-400">
              Create daily fantasy, survivor pools, or pick&apos;em contests with custom rules and prize structures.
            </p>
          </div>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap">
            Create Contest
          </button>
        </div>
      </div>
    </div>
  );
}
