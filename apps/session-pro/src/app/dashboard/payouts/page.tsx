import { mockEarnings, mockPayouts } from "@/lib/coach-data";

export default function PayoutsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Payouts</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Available to Withdraw</p>
          <p className="text-3xl font-bold text-green-500">
            ${mockEarnings.availableBalance}
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Pending Clearance</p>
          <p className="text-3xl font-bold">${mockEarnings.pendingBalance}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Paid Out</p>
          <p className="text-3xl font-bold">
            ${mockPayouts.reduce((sum, p) => sum + p.amount, 0)}
          </p>
        </div>
      </div>

      {/* Whop Payouts Integration Placeholder */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Withdraw Funds</h2>
        </div>
        <div className="p-6">
          {/* This is where Whop Embedded Payouts components would go */}
          <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-lg font-semibold mb-2">
              Whop Embedded Payouts
            </h3>
            <p className="text-gray-400 mb-4 max-w-md mx-auto">
              This is where the Whop Payouts component will be embedded. Coaches
              can set up their payout method and withdraw funds directly.
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Set Up Payout Method
              </button>
              <button
                disabled
                className="px-6 py-3 bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
              >
                Withdraw ${mockEarnings.availableBalance}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Supports bank transfers, PayPal, and more
            </p>
          </div>
        </div>
      </div>

      {/* Payout Method */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Payout Method</h2>
          <button className="text-sm text-blue-500 hover:text-blue-400">
            Change
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
              🏦
            </div>
            <div>
              <p className="font-medium">Bank Account</p>
              <p className="text-gray-400 text-sm">••••4242 · Chase Bank</p>
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
                  <td className="px-6 py-4 font-medium">${payout.amount}</td>
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
    </div>
  );
}
