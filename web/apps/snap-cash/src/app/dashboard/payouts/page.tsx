"use client";

import { mockEarnings, mockPayouts } from "@/lib/data";

export default function PayoutsPage() {
  const totalPaidOut = mockPayouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Payouts</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Available to Withdraw</p>
          <p className="text-3xl font-bold text-green-500">
            ${mockEarnings.availableBalance.toFixed(2)}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Pending Clearance</p>
          <p className="text-3xl font-bold">${mockEarnings.pendingBalance.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Paid Out</p>
          <p className="text-3xl font-bold">${totalPaidOut.toFixed(2)}</p>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Withdraw Funds</h2>
          <button className="text-sm text-green-500 hover:text-green-400">
            Manage Payouts
          </button>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
            <div>
              <p className="text-sm text-gray-400">Available to withdraw</p>
              <p className="text-2xl font-bold text-green-500">
                ${mockEarnings.availableBalance.toFixed(2)}
              </p>
            </div>
            <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors">
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Payout Method */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Payout Method</h2>
          <button className="text-sm text-green-500 hover:text-green-400">
            Change
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
              🏦
            </div>
            <div>
              <p className="font-medium">Bank Account</p>
              <p className="text-gray-400 text-sm">****4242 - Chase Bank</p>
            </div>
            <span className="ml-auto px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
              Verified
            </span>
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
              {mockPayouts.map((payout) => (
                <tr key={payout.id}>
                  <td className="px-6 py-4 text-gray-400">{payout.date}</td>
                  <td className="px-6 py-4 font-medium">${payout.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-400">{payout.method}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        payout.status === "completed"
                          ? "bg-green-500/20 text-green-500"
                          : payout.status === "processing"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-gray-500/20 text-gray-500"
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

      {/* Minimum Payout Info */}
      <div className="mt-8 bg-gray-800/50 rounded-xl border border-gray-700 p-6">
        <h3 className="font-semibold mb-2">Payout Information</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Minimum payout: $25.00
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Processing time: 2-3 business days
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            No fees for standard bank transfers
          </li>
          <li className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Express payout available (1% fee)
          </li>
        </ul>
      </div>
    </div>
  );
}
