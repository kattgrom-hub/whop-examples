import Link from "next/link";
import { mockUserBids, getActiveBids, getWonAuctions } from "@/lib/bids-data";
import { mockSellerEarnings, getActiveListings } from "@/lib/seller-data";
import { formatCurrency } from "@/lib/data";

export default function DashboardPage() {
  const activeBids = getActiveBids();
  const wonAuctions = getWonAuctions();
  const activeListings = getActiveListings();
  const earnings = mockSellerEarnings;

  const winningBids = activeBids.filter((b) => b.status === "winning");
  const outbidBids = activeBids.filter((b) => b.status === "outbid");

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Active Bids</p>
          <p className="text-3xl font-bold">{activeBids.length}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-green-500 text-sm">{winningBids.length} winning</span>
            <span className="text-gray-600">|</span>
            <span className="text-amber-500 text-sm">{outbidBids.length} outbid</span>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Won Auctions</p>
          <p className="text-3xl font-bold text-amber-500">{wonAuctions.length}</p>
          <Link
            href="/dashboard/won"
            className="text-sm text-purple-500 hover:text-purple-400 mt-2 inline-block"
          >
            View all
          </Link>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-green-500">
            {formatCurrency(earnings.availableBalance)}
          </p>
          <Link
            href="/dashboard/payouts"
            className="text-sm text-purple-500 hover:text-purple-400 mt-2 inline-block"
          >
            Withdraw
          </Link>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <p className="text-gray-400 text-sm mb-1">Active Listings</p>
          <p className="text-3xl font-bold">{activeListings.length}</p>
          <Link
            href="/dashboard/create"
            className="text-sm text-purple-500 hover:text-purple-400 mt-2 inline-block"
          >
            Create new
          </Link>
        </div>
      </div>

      {/* Active Bids */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Active Bids</h2>
          <Link
            href="/dashboard/bids"
            className="text-sm text-purple-500 hover:text-purple-400"
          >
            View all
          </Link>
        </div>
        {activeBids.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <p>No active bids</p>
            <Link href="/auctions" className="text-purple-500 hover:text-purple-400 mt-2 inline-block">
              Browse auctions
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {activeBids.slice(0, 4).map((bid) => (
              <Link
                key={bid.id}
                href={`/auction/${bid.auctionId}`}
                className="p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={bid.auctionImage}
                    alt={bid.auctionTitle}
                    className="w-12 h-12 rounded-lg bg-gray-700 object-cover"
                  />
                  <div>
                    <p className="font-medium line-clamp-1">{bid.auctionTitle}</p>
                    <p className="text-sm text-gray-400">
                      Your bid: {formatCurrency(bid.amount)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      bid.status === "winning"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {bid.status === "winning" ? "Winning" : "Outbid"}
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    High: {formatCurrency(bid.currentHighBid)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Won */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recently Won</h2>
          <Link
            href="/dashboard/won"
            className="text-sm text-purple-500 hover:text-purple-400"
          >
            View all
          </Link>
        </div>
        {wonAuctions.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            No won auctions yet
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {wonAuctions.slice(0, 3).map((won) => (
              <div
                key={won.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={won.auctionImage}
                    alt={won.auctionTitle}
                    className="w-12 h-12 rounded-lg bg-gray-700 object-cover"
                  />
                  <div>
                    <p className="font-medium line-clamp-1">{won.auctionTitle}</p>
                    <p className="text-sm text-gray-400">
                      Seller: {won.seller.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-500">
                    {formatCurrency(won.winningBid)}
                  </p>
                  <span
                    className={`text-xs ${
                      won.paymentStatus === "delivered"
                        ? "text-green-400"
                        : won.paymentStatus === "shipped"
                        ? "text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {won.paymentStatus.charAt(0).toUpperCase() + won.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/auctions"
          className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors text-center"
        >
          <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="font-semibold">Browse Auctions</p>
          <p className="text-sm text-gray-400">Find your next collectible</p>
        </Link>
        <Link
          href="/dashboard/create"
          className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors text-center"
        >
          <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <p className="font-semibold">Create Listing</p>
          <p className="text-sm text-gray-400">Sell your collectibles</p>
        </Link>
        <Link
          href="/messages"
          className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors text-center"
        >
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="font-semibold">Messages</p>
          <p className="text-sm text-gray-400">Chat with sellers</p>
        </Link>
      </div>
    </div>
  );
}
