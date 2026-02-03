import Link from "next/link";
import { getWonAuctions } from "@/lib/bids-data";
import { formatCurrency } from "@/lib/data";

export default function WonPage() {
  const wonAuctions = getWonAuctions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-400";
      case "paid":
        return "bg-blue-500/20 text-blue-400";
      case "shipped":
        return "bg-purple-500/20 text-purple-400";
      case "delivered":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Won Auctions</h1>

      {wonAuctions.length === 0 ? (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No won auctions yet</h2>
          <p className="text-gray-400 mb-6">Start bidding to win your first collectible!</p>
          <Link
            href="/auctions"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Browse Auctions
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {wonAuctions.map((won) => (
            <div
              key={won.id}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={won.auctionImage}
                      alt={won.auctionTitle}
                      className="w-20 h-20 rounded-lg bg-gray-700 object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{won.auctionTitle}</h3>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <img
                          src={won.seller.avatar}
                          alt={won.seller.name}
                          className="w-5 h-5 rounded-full bg-gray-700"
                        />
                        <span>Sold by {won.seller.name}</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">
                        Won on {new Date(won.wonAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Winning Bid</p>
                    <p className="text-2xl font-bold text-amber-500">
                      {formatCurrency(won.winningBid)}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        won.paymentStatus
                      )}`}
                    >
                      {won.paymentStatus.charAt(0).toUpperCase() + won.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Details */}
              <div className="px-6 py-4 bg-gray-850 border-t border-gray-700">
                <div className="flex items-center justify-between">
                  {/* Progress Steps */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${
                        ["paid", "shipped", "delivered"].includes(won.paymentStatus)
                          ? "bg-green-500"
                          : "bg-gray-600"
                      }`} />
                      <span className="text-sm text-gray-400">Paid</span>
                    </div>
                    <div className="w-8 h-px bg-gray-600" />
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${
                        ["shipped", "delivered"].includes(won.paymentStatus)
                          ? "bg-green-500"
                          : "bg-gray-600"
                      }`} />
                      <span className="text-sm text-gray-400">Shipped</span>
                    </div>
                    <div className="w-8 h-px bg-gray-600" />
                    <div className="flex items-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${
                        won.paymentStatus === "delivered" ? "bg-green-500" : "bg-gray-600"
                      }`} />
                      <span className="text-sm text-gray-400">Delivered</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {won.trackingNumber && (
                      <span className="text-sm text-gray-400">
                        Tracking: <span className="font-mono text-white">{won.trackingNumber}</span>
                      </span>
                    )}
                    {won.paymentStatus === "pending" && (
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                        Complete Payment
                      </button>
                    )}
                    <Link
                      href="/messages"
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                    >
                      Contact Seller
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
