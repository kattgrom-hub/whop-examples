import Link from "next/link";
import { dashboardEarnings, dashboardStats, weeklyPerformance } from "@/lib/dashboard-data";
import { getRecentPicks } from "@/lib/data";

export default function DashboardPage() {
  const recentPicks = getRecentPicks(5);
  const pendingPicks = recentPicks.filter((p) => p.result === "pending");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-green-500">
            ${dashboardEarnings.availableBalance.toLocaleString()}
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
          <p className="text-3xl font-bold">${dashboardEarnings.pendingBalance.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-2">Clearing in 2-3 days</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold">${dashboardEarnings.thisMonth.toLocaleString()}</p>
          <p className="text-sm text-green-500 mt-2">
            +{Math.round(((dashboardEarnings.thisMonth - dashboardEarnings.lastMonth) / dashboardEarnings.lastMonth) * 100)}% vs last month
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Subscribers</p>
          <p className="text-3xl font-bold">{dashboardEarnings.subscriberCount}</p>
          <p className="text-sm text-gray-500 mt-2">{dashboardEarnings.activeSubscriptions} active</p>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-2xl font-bold text-green-500">{dashboardStats.winRate}%</p>
          <p className="text-sm text-gray-400">Win Rate</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-2xl font-bold text-green-500">+{dashboardStats.roi}%</p>
          <p className="text-sm text-gray-400">ROI</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className={`text-2xl font-bold ${dashboardStats.currentStreak > 0 ? "text-green-500" : "text-red-500"}`}>
            {dashboardStats.currentStreak > 0 ? `W${dashboardStats.currentStreak}` : `L${Math.abs(dashboardStats.currentStreak)}`}
          </p>
          <p className="text-sm text-gray-400">Streak</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-2xl font-bold">+{dashboardStats.totalUnitsWon}</p>
          <p className="text-sm text-gray-400">Units Won</p>
        </div>
      </div>

      {/* This Month Record */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">This Month</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-500">{dashboardStats.thisMonthRecord.wins}</p>
              <p className="text-gray-400">Wins</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-red-500">{dashboardStats.thisMonthRecord.losses}</p>
              <p className="text-gray-400">Losses</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-gray-400">{dashboardStats.thisMonthRecord.pushes}</p>
              <p className="text-gray-400">Pushes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Performance */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Weekly Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {weeklyPerformance.map((day) => (
              <div key={day.day} className="text-center">
                <p className="text-sm text-gray-400 mb-2">{day.day}</p>
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-sm font-medium">
                    <span className="text-green-500">{day.wins}</span>
                    <span className="text-gray-500">-</span>
                    <span className="text-red-500">{day.losses}</span>
                  </p>
                  <p className={`text-xs mt-1 ${day.units >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {day.units >= 0 ? "+" : ""}{day.units}u
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Picks */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Pending Picks ({pendingPicks.length})</h2>
          <Link
            href="/dashboard/picks"
            className="text-sm text-green-500 hover:text-green-400"
          >
            View all
          </Link>
        </div>
        {pendingPicks.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No pending picks
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {pendingPicks.map((pick) => (
              <div
                key={pick.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-lg">
                    {pick.sport === "NFL" && "🏈"}
                    {pick.sport === "NBA" && "🏀"}
                    {pick.sport === "MLB" && "⚾"}
                    {pick.sport === "NHL" && "🏒"}
                    {pick.sport === "Soccer" && "⚽"}
                    {pick.sport === "Tennis" && "🎾"}
                  </div>
                  <div>
                    <p className="font-medium">{pick.matchup}</p>
                    <p className="text-sm text-gray-400">
                      {pick.pick} ({pick.odds})
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">
                    {new Date(pick.gameTime).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-yellow-500">{pick.units} units</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
