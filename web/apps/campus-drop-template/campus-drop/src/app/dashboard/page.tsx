import Link from "next/link";
import { mockEarnings, mockStats, mockUserListings, mockSales } from "@/lib/dashboard-data";

export default function DashboardPage() {
  const recentSales = mockSales.filter((s) => s.status !== "cancelled").slice(0, 3);
  const activeListings = mockUserListings.filter((l) => l.status === "active");

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
            className="text-sm text-green-500 hover:text-green-400 mt-2 inline-block"
          >
            Withdraw &rarr;
          </Link>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Active Listings</p>
          <p className="text-3xl font-bold">{mockStats.activeListings}</p>
          <Link
            href="/dashboard/listings"
            className="text-sm text-gray-500 hover:text-gray-400 mt-2 inline-block"
          >
            Manage &rarr;
          </Link>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Sales</p>
          <p className="text-3xl font-bold">{mockStats.totalSales}</p>
          <p className="text-sm text-gray-500 mt-2">All time</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Total Earned</p>
          <p className="text-3xl font-bold">${mockEarnings.totalEarned}</p>
          <p className="text-sm text-green-500 mt-2">
            +${mockEarnings.thisMonth} this month
          </p>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
            eye
          </div>
          <div>
            <p className="text-2xl font-bold">{mockStats.totalViews}</p>
            <p className="text-gray-400 text-sm">Total Views</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
          <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center text-pink-400">
            heart
          </div>
          <div>
            <p className="text-2xl font-bold">{mockStats.totalSaves}</p>
            <p className="text-gray-400 text-sm">Total Saves</p>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
            check
          </div>
          <div>
            <p className="text-2xl font-bold">{mockStats.totalOrders}</p>
            <p className="text-gray-400 text-sm">Orders Made</p>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Sales</h2>
          <Link
            href="/dashboard/sales"
            className="text-sm text-green-500 hover:text-green-400"
          >
            View all &rarr;
          </Link>
        </div>
        {recentSales.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No sales yet. List something to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {recentSales.map((sale) => (
              <div
                key={sale.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={sale.listingImage}
                    alt={sale.listingTitle}
                    className="w-12 h-12 rounded-lg bg-gray-700 object-cover"
                  />
                  <div>
                    <p className="font-medium line-clamp-1">{sale.listingTitle}</p>
                    <p className="text-sm text-gray-400">
                      Sold to {sale.buyerName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-500">+${sale.price}</p>
                  <p className="text-sm text-gray-400 capitalize">{sale.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Listings */}
      <div className="bg-gray-800 rounded-xl border border-gray-700">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Listings</h2>
          <Link
            href="/dashboard/listings"
            className="text-sm text-green-500 hover:text-green-400"
          >
            Manage all &rarr;
          </Link>
        </div>
        {activeListings.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No active listings.{" "}
            <Link href="/dashboard/create" className="text-green-500 hover:text-green-400">
              Create one
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {activeListings.map((listing) => (
              <div
                key={listing.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-12 h-12 rounded-lg bg-gray-700 object-cover"
                  />
                  <div>
                    <p className="font-medium line-clamp-1">{listing.title}</p>
                    <p className="text-sm text-gray-400">
                      {listing.views} views &middot; {listing.saves} saves
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${listing.price}</p>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
