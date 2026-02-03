import { mockPayouts, mockEarnings } from "@/lib/dashboard-data";

export default function PayoutsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Payouts</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Available for Withdrawal</p>
          <p className="text-3xl font-bold text-green-500">
            ${mockEarnings.availableBalance}
          </p>
          <button className="mt-4 w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Withdraw
          </button>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Pending Clearance</p>
          <p className="text-3xl font-bold">${mockEarnings.pendingBalance}</p>
          <p className="text-sm text-gray-500 mt-2">From active jobs</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Earned</p>
          <p className="text-3xl font-bold">${mockEarnings.totalEarned}</p>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </div>
      </div>

      {/* Payout Method */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Payout Method</h2>
          <button className="text-sm text-purple-500 hover:text-purple-400">
            Add New
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏦</span>
              </div>
              <div>
                <p className="font-medium">Bank Account</p>
                <p className="text-sm text-gray-400">****4242</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
              Default
            </span>
          </div>

          {/* Payouts Note */}
          <div className="mt-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <p className="text-sm text-purple-300">
              Funds are released automatically when milestones are completed.
            </p>
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
                <th className="px-6 py-4 text-gray-400 font-medium">
                  Description
                </th>
                <th className="px-6 py-4 text-gray-400 font-medium">Method</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Amount</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {mockPayouts.map((payout) => (
                <tr key={payout.id}>
                  <td className="px-6 py-4 text-gray-400">{payout.date}</td>
                  <td className="px-6 py-4">
                    <span className="font-medium">
                      {payout.gigTitle || "Withdrawal"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{payout.method}</td>
                  <td className="px-6 py-4">
                    <span className="text-green-500 font-semibold">
                      ${payout.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payout.status === "completed"
                          ? "bg-green-500/20 text-green-500"
                          : payout.status === "processing"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {payout.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-4">This Month</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Earned</span>
              <span className="font-semibold">${mockEarnings.thisMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Platform Fee (15%)</span>
              <span className="text-red-400">
                -${Math.round(mockEarnings.thisMonth * 0.15)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-700">
              <span className="text-gray-400">Net Earnings</span>
              <span className="font-bold text-green-500">
                ${Math.round(mockEarnings.thisMonth * 0.85)}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="font-semibold mb-4">Last Month</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Earned</span>
              <span className="font-semibold">${mockEarnings.lastMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Platform Fee (15%)</span>
              <span className="text-red-400">
                -${Math.round(mockEarnings.lastMonth * 0.15)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-700">
              <span className="text-gray-400">Net Earnings</span>
              <span className="font-bold text-green-500">
                ${Math.round(mockEarnings.lastMonth * 0.85)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
