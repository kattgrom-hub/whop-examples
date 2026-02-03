import Link from "next/link";
import { mockCreatedContests, mockEarnings, getCreatorStats } from "@/lib/creator-data";

export default function DashboardPage() {
  const stats = getCreatorStats();
  const activeContests = mockCreatedContests.filter(
    (c) => c.status === "open" || c.status === "live"
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-green-500">
            ${mockEarnings.availableBalance.toLocaleString()}
          </p>
          <Link
            href="/dashboard/payouts"
            className="text-sm text-green-500 hover:text-green-400 mt-2 inline-block"
          >
            Withdraw
          </Link>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-3xl font-bold">${mockEarnings.pendingBalance.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">From active contests</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold">${mockEarnings.thisMonth.toLocaleString()}</p>
          <p className="text-sm text-green-500 mt-2">
            +{Math.round(((mockEarnings.thisMonth - mockEarnings.lastMonth) / mockEarnings.lastMonth) * 100)}% vs last month
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">{stats.totalEntries.toLocaleString()} total entries</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-2xl font-bold">{stats.totalContests}</p>
          <p className="text-gray-400 text-sm">Total Contests</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.activeContests}</p>
          <p className="text-gray-400 text-sm">Active</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-2xl font-bold">{stats.totalEntries.toLocaleString()}</p>
          <p className="text-gray-400 text-sm">Total Entries</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-2xl font-bold">{(mockEarnings.platformFeeRate * 100)}%</p>
          <p className="text-gray-400 text-sm">Platform Fee</p>
        </div>
      </div>

      {/* Active Contests */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Contests</h2>
          <Link
            href="/dashboard/contests"
            className="text-sm text-green-500 hover:text-green-400"
          >
            View all
          </Link>
        </div>
        {activeContests.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No active contests
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {activeContests.map((contest) => (
              <div
                key={contest.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-lg font-bold">
                    {contest.sport.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium">{contest.name}</p>
                    <p className="text-sm text-gray-400">
                      {contest.totalEntries.toLocaleString()} entries
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-500">
                    ${contest.revenue.toLocaleString()}
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      contest.status === "open"
                        ? "bg-green-500/20 text-green-500"
                        : "bg-yellow-500/20 text-yellow-500"
                    }`}
                  >
                    {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Revenue Overview</h2>
        </div>
        <div className="p-6">
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg text-gray-500">
            Revenue chart visualization
          </div>
          <div className="grid grid-cols-4 gap-4 mt-6 text-center">
            {["Jan", "Feb", "Mar", "Apr"].map((month) => (
              <div key={month}>
                <p className="text-gray-400 text-sm">{month}</p>
                <p className="font-semibold">${Math.floor(30000 + Math.random() * 15000).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
