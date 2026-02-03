import Link from "next/link";
import { mockUserBids, getActiveBids, getBidHistory } from "@/lib/bids-data";
import { formatCurrency, getTimeRemaining } from "@/lib/data";

function TimeDisplay({ endTime }: { endTime: string }) {
  const time = getTimeRemaining(endTime);

  if (time.isEnded) return <span className="text-gray-500">Ended</span>;

  if (time.days > 0) return <span>{time.days}d {time.hours}h left</span>;
  if (time.hours > 0) return <span className="text-amber-400">{time.hours}h {time.minutes}m left</span>;
  return <span className="text-red-400 animate-pulse">{time.minutes}m left</span>;
}

export default function BidsPage() {
  const activeBids = getActiveBids();
  const bidHistory = getBidHistory();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">My Bids</h1>

      {/* Active Bids */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Active Bids</h2>
        {activeBids.length === 0 ? (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 text-center text-gray-400">
            <p>No active bids</p>
            <Link href="/auctions" className="text-purple-500 hover:text-purple-400 mt-2 inline-block">
              Browse auctions
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBids.map((bid) => (
              <Link
                key={bid.id}
                href={`/auction/${bid.auctionId}`}
                className="block bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={bid.auctionImage}
                      alt={bid.auctionTitle}
                      className="w-16 h-16 rounded-lg bg-gray-700 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-lg">{bid.auctionTitle}</p>
                      <p className="text-gray-400">
                        <TimeDisplay endTime={bid.endTime} />
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Your Bid</p>
                      <p className="text-xl font-bold">{formatCurrency(bid.amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Current High</p>
                      <p className="text-xl font-bold text-amber-500">
                        {formatCurrency(bid.currentHighBid)}
                      </p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        bid.status === "winning"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {bid.status === "winning" ? "Winning" : "Outbid"}
                    </span>
                  </div>
                </div>

                {bid.status === "outbid" && (
                  <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                    <p className="text-amber-400 text-sm">
                      You have been outbid! Increase your bid to stay in the lead.
                    </p>
                    <span className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
                      Bid Again
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bid History */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Bid History</h2>
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 text-left">
                <th className="px-6 py-4 text-gray-400 font-medium">Item</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Your Bid</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Winning Bid</th>
                <th className="px-6 py-4 text-gray-400 font-medium">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {bidHistory.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={bid.auctionImage}
                        alt={bid.auctionTitle}
                        className="w-10 h-10 rounded-lg bg-gray-700 object-cover"
                      />
                      <span className="line-clamp-1">{bid.auctionTitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{formatCurrency(bid.amount)}</td>
                  <td className="px-6 py-4 text-amber-500">
                    {formatCurrency(bid.currentHighBid)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        bid.status === "won"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {bid.status === "won" ? "Won" : "Lost"}
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
