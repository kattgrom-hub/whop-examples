import Link from "next/link";
import { mockJobs } from "@/lib/dashboard-data";

export default function JobsPage() {
  const activeJobs = mockJobs.filter((j) => j.status === "active");
  const completedJobs = mockJobs.filter((j) => j.status === "completed");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <Link
          href="/gigs"
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Browse Gigs
        </Link>
      </div>

      {/* Active Jobs */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Active Jobs</h2>
        {activeJobs.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">
            No active jobs. Browse gigs to find work.
          </div>
        ) : (
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-800 rounded-xl border border-gray-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={job.clientAvatar}
                      alt={job.clientName}
                      className="w-12 h-12 rounded-xl bg-gray-700"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{job.gigTitle}</h3>
                      <p className="text-gray-400">{job.clientName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${job.amount}</p>
                    <p className="text-sm text-gray-400">
                      Due {job.deadline}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{job.progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-sm text-gray-400 mb-3">Milestones</p>
                  <div className="space-y-2">
                    {job.milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center gap-3"
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            milestone.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {milestone.completed ? "✓" : ""}
                        </span>
                        <span
                          className={
                            milestone.completed
                              ? "text-gray-400 line-through"
                              : "text-white"
                          }
                        >
                          {milestone.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                  <button className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Submit Deliverable
                  </button>
                  <Link
                    href="/messages"
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Message Client
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Jobs */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Completed</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="px-6 py-4 text-gray-400 font-medium">Project</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Client</th>
                <th className="px-6 py-4 text-gray-400 font-medium">
                  Completed
                </th>
                <th className="px-6 py-4 text-gray-400 font-medium">Amount</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {completedJobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4">
                    <span className="font-medium">{job.gigTitle}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={job.clientAvatar}
                        alt={job.clientName}
                        className="w-8 h-8 rounded-lg bg-gray-700"
                      />
                      <span className="text-gray-400">{job.clientName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{job.deadline}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-500 font-semibold">
                      ${job.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
