"use client";

import { dashboardEarnings, recentPayouts } from "@/lib/dashboard-data";

export default function PayoutsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Payouts</h1>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-green-500">
            ${dashboardEarnings.availableBalance.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">Ready to withdraw</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-3xl font-bold">
            ${dashboardEarnings.pendingBalance.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">Clearing in 2-3 days</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Earned</p>
          <p className="text-3xl font-bold">
            ${dashboardEarnings.totalEarned.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Withdraw Funds</h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Available to withdraw</p>
              <p className="text-2xl font-bold text-green-500">
                ${dashboardEarnings.availableBalance.toLocaleString()}
              </p>
            </div>
            <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Payout History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="px-6 py-4 text-gray-400 font-medium">Date</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Amount</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Method</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentPayouts.map((payout) => (
                <tr key={payout.id}>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(payout.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${payout.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{payout.method}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payout.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : payout.status === "processing"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentPayouts.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            No payouts yet
          </div>
        )}
      </div>
    </div>
  );
}
