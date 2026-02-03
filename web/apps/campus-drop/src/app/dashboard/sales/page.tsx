import Link from "next/link";
import { mockSales, mockEarnings } from "@/lib/dashboard-data";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  paid: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function SalesPage() {
  const activeSales = mockSales.filter((s) => s.status !== "completed" && s.status !== "cancelled");
  const completedSales = mockSales.filter((s) => s.status === "completed" || s.status === "cancelled");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">My Sales</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">This Month</p>
          <p className="text-3xl font-bold text-green-500">${mockEarnings.thisMonth}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Earned</p>
          <p className="text-3xl font-bold">${mockEarnings.totalEarned}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Pending Payout</p>
          <p className="text-3xl font-bold">${mockEarnings.pendingBalance}</p>
          <Link
            href="/dashboard/payouts"
            className="text-sm text-green-500 hover:text-green-400 mt-1 inline-block"
          >
            View payouts &rarr;
          </Link>
        </div>
      </div>

      {/* Active Sales */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Awaiting Completion ({activeSales.length})</h2>
        </div>
        {activeSales.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No pending sales.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {activeSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 flex items-center gap-4"
              >
                <img
                  src={sale.listingImage}
                  alt={sale.listingTitle}
                  className="w-20 h-20 rounded-lg bg-gray-700 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1 line-clamp-1">{sale.listingTitle}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={sale.buyerAvatar}
                      alt={sale.buyerName}
                      className="w-5 h-5 rounded-full bg-gray-700"
                    />
                    <span className="text-sm text-gray-400">
                      Sold to {sale.buyerName}
                    </span>
                  </div>
                  {sale.meetupLocation && (
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Meetup:</span> {sale.meetupLocation}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-green-500 mb-2">+${sale.price}</p>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[sale.status]}`}>
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Sales */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Completed Sales ({completedSales.length})</h2>
        </div>
        {completedSales.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No completed sales yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {completedSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 flex items-center gap-4"
              >
                <img
                  src={sale.listingImage}
                  alt={sale.listingTitle}
                  className="w-20 h-20 rounded-lg bg-gray-700 object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1 line-clamp-1">{sale.listingTitle}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={sale.buyerAvatar}
                      alt={sale.buyerName}
                      className="w-5 h-5 rounded-full bg-gray-700"
                    />
                    <span className="text-sm text-gray-400">
                      Sold to {sale.buyerName}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Completed on {sale.createdAt}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-green-500">+${sale.price}</p>
                  <span className={`text-xs px-2 py-1 rounded capitalize ${statusColors[sale.status]}`}>
                    {sale.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Platform Fee Notice */}
      <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
        <p className="text-gray-400 text-sm">
          <strong className="text-white">Platform fee:</strong> 10% of each sale goes to CampusDrop for payment processing and platform maintenance.
          You keep 90% of every sale.
        </p>
      </div>
    </div>
  );
}
