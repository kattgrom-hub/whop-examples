import { mockEarnings, mockUploads, categories } from "@/lib/data";

export default function EarningsPage() {
  // Calculate earnings by category
  const earningsByCategory = categories.map((cat) => {
    const categoryUploads = mockUploads.filter((u) => u.category === cat.name);
    const totalEarnings = categoryUploads.reduce((sum, u) => sum + u.earnings, 0);
    const totalLicenses = categoryUploads.reduce((sum, u) => sum + u.licenses, 0);
    return {
      ...cat,
      earnings: totalEarnings,
      licenses: totalLicenses,
      uploads: categoryUploads.length,
    };
  }).filter((c) => c.earnings > 0).sort((a, b) => b.earnings - a.earnings);

  // Recent earnings transactions
  const recentTransactions = mockUploads
    .filter((u) => u.status === "approved" && u.earnings > 0)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 10);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Earnings</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-green-500">
            ${mockEarnings.totalEarned.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold">${mockEarnings.thisMonth.toFixed(2)}</p>
          <p className="text-sm text-green-500 mt-2">
            +{Math.round(((mockEarnings.thisMonth - mockEarnings.lastMonth) / mockEarnings.lastMonth) * 100)}% vs last month
          </p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Last Month</p>
          <p className="text-3xl font-bold">${mockEarnings.lastMonth.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-2">Previous 30 days</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Avg Per License</p>
          <p className="text-3xl font-bold">
            ${(mockEarnings.totalEarned / mockEarnings.totalLicenses).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {mockEarnings.totalLicenses} total licenses
          </p>
        </div>
      </div>

      {/* Earnings by Category */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Earnings by Category</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {earningsByCategory.map((category) => {
              const percentage = (category.earnings / mockEarnings.totalEarned) * 100;
              return (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-gray-400">
                        {category.uploads} uploads, {category.licenses} licenses
                      </span>
                    </div>
                    <span className="font-semibold text-green-500">
                      ${category.earnings.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Recent Earnings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="px-6 py-4 text-gray-400 font-medium">Content</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Category</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Quality</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Licenses</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Earnings</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={transaction.thumbnail}
                        alt={transaction.category}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="text-sm capitalize">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{transaction.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.quality === "premium"
                          ? "bg-purple-500/20 text-purple-400"
                          : transaction.quality === "high"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {transaction.quality}
                    </span>
                  </td>
                  <td className="px-6 py-4">{transaction.licenses}</td>
                  <td className="px-6 py-4 font-semibold text-green-500">
                    +${transaction.earnings.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{transaction.uploadedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-green-500 mb-1">Maximize Your Earnings</h3>
            <p className="text-gray-400 text-sm">
              Your top category is <strong>{mockEarnings.topCategory}</strong>. Content in the <strong>Actions</strong> category currently has the highest demand and earns up to $0.40 per license. Consider uploading more video content of activities and movements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
