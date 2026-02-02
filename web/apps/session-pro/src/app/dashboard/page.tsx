import Link from "next/link";
import { mockSessions, mockEarnings } from "@/lib/coach-data";

export default function DashboardPage() {
  const upcomingSessions = mockSessions.filter((s) => s.status === "upcoming");
  const completedSessions = mockSessions.filter((s) => s.status === "completed");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-green-500">
            ${mockEarnings.availableBalance}
          </p>
          <Link
            href="/dashboard/payouts"
            className="text-sm text-blue-500 hover:text-blue-400 mt-2 inline-block"
          >
            Withdraw →
          </Link>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-3xl font-bold">${mockEarnings.pendingBalance}</p>
          <p className="text-sm text-gray-500 mt-2">Clearing in 2-3 days</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold">${mockEarnings.thisMonth}</p>
          <p className="text-sm text-green-500 mt-2">
            +{Math.round(((mockEarnings.thisMonth - mockEarnings.lastMonth) / mockEarnings.lastMonth) * 100)}% vs last month
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Earned</p>
          <p className="text-3xl font-bold">${mockEarnings.totalEarned}</p>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
          <Link
            href="/dashboard/sessions"
            className="text-sm text-blue-500 hover:text-blue-400"
          >
            View all →
          </Link>
        </div>
        {upcomingSessions.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No upcoming sessions
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={session.studentAvatar}
                    alt={session.studentName}
                    className="w-10 h-10 rounded-full bg-gray-700"
                  />
                  <div>
                    <p className="font-medium">{session.studentName}</p>
                    <p className="text-sm text-gray-400">
                      {session.date} at {session.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${session.amount}</p>
                  <p className="text-sm text-gray-400">
                    {session.duration} min
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Recent Sessions</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {completedSessions.slice(0, 3).map((session) => (
            <div
              key={session.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={session.studentAvatar}
                  alt={session.studentName}
                  className="w-10 h-10 rounded-full bg-gray-700"
                />
                <div>
                  <p className="font-medium">{session.studentName}</p>
                  <p className="text-sm text-gray-400">{session.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-500">+${session.amount}</p>
                <p className="text-sm text-gray-400">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
