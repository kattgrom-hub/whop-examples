import Link from "next/link";
import { applications, getTalent } from "@/lib/data";

export default function ApplicationsPage() {
  const pendingApplications = applications.filter((a) => a.status === "pending");
  const acceptedApplications = applications.filter((a) => a.status === "accepted");
  const rejectedApplications = applications.filter((a) => a.status === "rejected");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Applications</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-500">
            {pendingApplications.length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Accepted</p>
          <p className="text-2xl font-bold text-green-500">
            {acceptedApplications.length}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-gray-400">
            {rejectedApplications.length}
          </p>
        </div>
      </div>

      {/* Pending Applications */}
      {pendingApplications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Pending Review</h2>
          <div className="space-y-4">
            {pendingApplications.map((app) => {
              const talent = getTalent(app.talentId);
              return (
                <div
                  key={app.id}
                  className="bg-gray-800 rounded-xl border border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Applied to:</p>
                      <h3 className="font-semibold text-lg">{app.gigTitle}</h3>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                      Pending
                    </span>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-700/50 rounded-xl mb-4">
                    <img
                      src={app.talentAvatar}
                      alt={app.talentName}
                      className="w-14 h-14 rounded-full bg-gray-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/talent/${app.talentId}`}
                          className="font-semibold hover:text-purple-400 transition-colors"
                        >
                          {app.talentName}
                        </Link>
                        {talent?.verified && (
                          <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                        {talent?.isPremium && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs">
                            PRO
                          </span>
                        )}
                      </div>
                      {talent && (
                        <div className="flex items-center gap-4 mt-1 text-sm">
                          <span className="text-yellow-500">
                            ★ {talent.rating}
                          </span>
                          <span className="text-gray-400">
                            {talent.completedGigs} gigs completed
                          </span>
                          <span className="text-gray-400">
                            ${talent.hourlyRate}/hr
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Proposed Rate</p>
                      <p className="text-xl font-bold">${app.proposedRate}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Cover Letter</p>
                    <p className="text-gray-300 leading-relaxed">
                      {app.coverLetter}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <button className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Accept
                    </button>
                    <button className="flex-1 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                      Message
                    </button>
                    <button className="flex-1 py-2 bg-gray-700 text-red-400 rounded-lg hover:bg-gray-600 transition-colors">
                      Reject
                    </button>
                    <Link
                      href={`/talent/${app.talentId}`}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Accepted Applications */}
      {acceptedApplications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Accepted</h2>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-left">
                  <th className="px-6 py-4 text-gray-400 font-medium">Talent</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Gig</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Rate</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
                  <th className="px-6 py-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {acceptedApplications.map((app) => (
                  <tr key={app.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={app.talentAvatar}
                          alt={app.talentName}
                          className="w-10 h-10 rounded-full bg-gray-700"
                        />
                        <Link
                          href={`/talent/${app.talentId}`}
                          className="font-medium hover:text-purple-400 transition-colors"
                        >
                          {app.talentName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{app.gigTitle}</td>
                    <td className="px-6 py-4">${app.proposedRate}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                        Accepted
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href="/messages"
                        className="text-purple-400 hover:text-purple-300"
                      >
                        Message
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {applications.length === 0 && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
          <div className="text-4xl mb-4">📭</div>
          <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
          <p className="text-gray-400 mb-6">
            Post a gig to start receiving applications from talented creators
          </p>
          <Link
            href="/dashboard/gigs"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Post a Gig
          </Link>
        </div>
      )}
    </div>
  );
}
