import Link from "next/link";
import {
  mockJobs,
  mockEarnings,
  mockPostedGigs,
  clientStats,
} from "@/lib/dashboard-data";

export default function DashboardPage() {
  // Talent view data
  const activeJobs = mockJobs.filter((j) => j.status === "active");
  const completedJobs = mockJobs.filter((j) => j.status === "completed");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Talent Dashboard */}
      <div className="mb-12">
        <h2 className="text-lg font-semibold text-purple-400 mb-4">
          Talent View
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-green-500">
              ${mockEarnings.availableBalance}
            </p>
            <Link
              href="/dashboard/payouts"
              className="text-sm text-purple-500 hover:text-purple-400 mt-2 inline-block"
            >
              Withdraw
            </Link>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold">${mockEarnings.pendingBalance}</p>
            <p className="text-sm text-gray-500 mt-2">From active jobs</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">This Month</p>
            <p className="text-3xl font-bold">${mockEarnings.thisMonth}</p>
            <p className="text-sm text-red-500 mt-2">
              -
              {Math.round(
                ((mockEarnings.lastMonth - mockEarnings.thisMonth) /
                  mockEarnings.lastMonth) *
                  100
              )}
              % vs last month
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Earned</p>
            <p className="text-3xl font-bold">${mockEarnings.totalEarned}</p>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Jobs</h3>
            <Link
              href="/dashboard/jobs"
              className="text-sm text-purple-500 hover:text-purple-400"
            >
              View all
            </Link>
          </div>
          {activeJobs.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No active jobs. Browse gigs to find work.
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={job.clientAvatar}
                      alt={job.clientName}
                      className="w-10 h-10 rounded-lg bg-gray-700"
                    />
                    <div>
                      <p className="font-medium">{job.gigTitle}</p>
                      <p className="text-sm text-gray-400">{job.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-32">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">{job.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${job.amount}</p>
                      <p className="text-sm text-gray-400">
                        Due {job.deadline}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Completed */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Recently Completed</h3>
          </div>
          <div className="divide-y divide-gray-700">
            {completedJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={job.clientAvatar}
                    alt={job.clientName}
                    className="w-10 h-10 rounded-lg bg-gray-700"
                  />
                  <div>
                    <p className="font-medium">{job.gigTitle}</p>
                    <p className="text-sm text-gray-400">{job.clientName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-500">+${job.amount}</p>
                  <p className="text-sm text-gray-400">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-8" />

      {/* Client Dashboard */}
      <div>
        <h2 className="text-lg font-semibold text-purple-400 mb-4">
          Client View
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Active Gigs</p>
            <p className="text-3xl font-bold">{clientStats.activeGigs}</p>
            <Link
              href="/dashboard/gigs"
              className="text-sm text-purple-500 hover:text-purple-400 mt-2 inline-block"
            >
              Manage
            </Link>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Talent Hired</p>
            <p className="text-3xl font-bold">{clientStats.talentHired}</p>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Completed Projects</p>
            <p className="text-3xl font-bold">{clientStats.completedProjects}</p>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Spent</p>
            <p className="text-3xl font-bold">
              ${clientStats.totalSpent.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">All time</p>
          </div>
        </div>

        {/* Posted Gigs */}
        <div className="bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your Gigs</h3>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
              Post New Gig
            </button>
          </div>
          <div className="divide-y divide-gray-700">
            {mockPostedGigs.map((gig) => (
              <div
                key={gig.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{gig.title}</p>
                  <p className="text-sm text-gray-400">
                    Posted {gig.createdAt} ·{" "}
                    <span className="text-purple-400">
                      {gig.applications} applications
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {gig.hiredTalent && (
                    <div className="flex items-center gap-2">
                      <img
                        src={gig.hiredTalent.avatar}
                        alt={gig.hiredTalent.name}
                        className="w-8 h-8 rounded-full bg-gray-700"
                      />
                      <span className="text-sm text-gray-400">
                        {gig.hiredTalent.name}
                      </span>
                    </div>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      gig.status === "open"
                        ? "bg-green-500/20 text-green-500"
                        : gig.status === "in_progress"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {gig.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
