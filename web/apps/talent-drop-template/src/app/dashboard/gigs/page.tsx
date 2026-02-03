import Link from "next/link";
import { mockPostedGigs } from "@/lib/dashboard-data";

export default function ClientGigsPage() {
  const openGigs = mockPostedGigs.filter((g) => g.status === "open");
  const inProgressGigs = mockPostedGigs.filter((g) => g.status === "in_progress");
  const completedGigs = mockPostedGigs.filter((g) => g.status === "completed");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Gigs</h1>
        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          Post New Gig
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Open</p>
          <p className="text-2xl font-bold">{openGigs.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">In Progress</p>
          <p className="text-2xl font-bold">{inProgressGigs.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold">{completedGigs.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Applications</p>
          <p className="text-2xl font-bold">
            {mockPostedGigs.reduce((sum, g) => sum + g.applications, 0)}
          </p>
        </div>
      </div>

      {/* Open Gigs */}
      {openGigs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Open Gigs</h2>
          <div className="space-y-4">
            {openGigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{gig.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Posted {gig.createdAt} · Deadline: {gig.deadline}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
                    Open
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-6">
                  <div>
                    <p className="text-sm text-gray-400">Budget</p>
                    <p className="font-semibold">
                      ${gig.budget.min} - ${gig.budget.max}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Applications</p>
                    <p className="font-semibold text-purple-400">
                      {gig.applications}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700 flex gap-3">
                  <Link
                    href="/dashboard/applications"
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
                  >
                    Review Applications
                  </Link>
                  <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-gray-700 text-red-400 rounded-lg hover:bg-gray-600 transition-colors">
                    Close
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress Gigs */}
      {inProgressGigs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">In Progress</h2>
          <div className="space-y-4">
            {inProgressGigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{gig.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Deadline: {gig.deadline}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                    In Progress
                  </span>
                </div>

                {gig.hiredTalent && (
                  <div className="mt-4 flex items-center gap-4 p-4 bg-gray-700/50 rounded-xl">
                    <img
                      src={gig.hiredTalent.avatar}
                      alt={gig.hiredTalent.name}
                      className="w-12 h-12 rounded-full bg-gray-600"
                    />
                    <div>
                      <p className="font-medium">{gig.hiredTalent.name}</p>
                      <p className="text-sm text-gray-400">Hired Talent</p>
                    </div>
                    <Link
                      href="/messages"
                      className="ml-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      Message
                    </Link>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700 flex gap-3">
                  <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    View Progress
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Release Payment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Gigs */}
      {completedGigs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Completed</h2>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="px-6 py-4 text-gray-400 font-medium">Gig</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Talent</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Budget</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {completedGigs.map((gig) => (
                  <tr key={gig.id}>
                    <td className="px-6 py-4">
                      <span className="font-medium">{gig.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      {gig.hiredTalent && (
                        <div className="flex items-center gap-3">
                          <img
                            src={gig.hiredTalent.avatar}
                            alt={gig.hiredTalent.name}
                            className="w-8 h-8 rounded-full bg-gray-700"
                          />
                          <span className="text-gray-400">
                            {gig.hiredTalent.name}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      ${gig.budget.min} - ${gig.budget.max}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-400">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Post Gig CTA */}
      <div className="mt-8 p-8 bg-gray-800 rounded-xl border border-dashed border-gray-600 text-center">
        <h3 className="text-xl font-semibold mb-2">Need to hire talent?</h3>
        <p className="text-gray-400 mb-4">
          Post a gig and receive applications from top creators
        </p>
        <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
          Post New Gig
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Secure checkout powered by Secure checkout
        </p>
      </div>
    </div>
  );
}
