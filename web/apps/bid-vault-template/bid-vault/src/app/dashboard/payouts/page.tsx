"use client";

import { mockSellerEarnings, mockSellerPayouts } from "@/lib/seller-data";

export default function PayoutsPage() {
  const earnings = mockSellerEarnings;
  const payouts = mockSellerPayouts;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Payouts</h1>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-green-500">
            ${earnings.availableBalance.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Pending</p>
          <p className="text-3xl font-bold">
            ${earnings.pendingBalance.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">From active auctions</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold">
            ${earnings.thisMonth.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-amber-500">
            ${earnings.totalEarned.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Withdraw Section */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Withdraw Funds</h2>
          <p className="text-sm text-gray-400 mt-1">
            Request a payout to your connected account
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-700/50 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">Available to withdraw</p>
                <p className="text-2xl font-bold text-green-500">
                  ${earnings.availableBalance.toLocaleString()}
                </p>
              </div>
              <button className="px-6 py-2 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-400 transition-colors">
                Withdraw
              </button>
            </div>
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
                <th className="px-6 py-4 text-gray-400 font-medium">Item</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Method</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(payout.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${payout.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {payout.auctionTitle ? (
                      <span className="text-gray-300 line-clamp-1">
                        {payout.auctionTitle}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{payout.method}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        payout.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : payout.status === "processing"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-amber-500/20 text-amber-400"
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
      </div>

      {/* Fee Info */}
      <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <h3 className="font-semibold mb-2">Platform Fees</h3>
        <p className="text-gray-400 text-sm">
          BidVault charges a {(earnings.platformFee * 100).toFixed(0)}% platform fee on successful sales.
          Payouts are processed within 2-3 business days after the buyer completes payment.
        </p>
      </div>
    </div>
  );
}
