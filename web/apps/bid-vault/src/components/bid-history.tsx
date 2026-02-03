"use client";

import type { Bid } from "@/lib/data";
import { formatCurrency } from "@/lib/data";

interface BidHistoryProps {
  bids: Bid[];
  showAll?: boolean;
}

export function BidHistory({ bids, showAll = false }: BidHistoryProps) {
  const displayBids = showAll ? bids : bids.slice(0, 5);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (bids.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <p>No bids yet. Be the first to bid!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700 text-left">
            <th className="px-4 py-3 text-gray-400 font-medium text-sm">Bidder</th>
            <th className="px-4 py-3 text-gray-400 font-medium text-sm text-right">Amount</th>
            <th className="px-4 py-3 text-gray-400 font-medium text-sm text-right">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {displayBids.map((bid, index) => (
            <tr
              key={bid.id}
              className={index === 0 ? "bg-purple-500/10" : "hover:bg-gray-750"}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={bid.bidderAvatar}
                    alt={bid.bidderName}
                    className="w-8 h-8 rounded-full bg-gray-700"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">
                      {bid.bidderName}
                    </span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                        Highest
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={`font-semibold ${index === 0 ? "text-amber-500" : "text-white"}`}>
                  {formatCurrency(bid.amount)}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-gray-400 text-sm">
                {formatTimestamp(bid.timestamp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {!showAll && bids.length > 5 && (
        <div className="text-center py-3 border-t border-gray-700">
          <span className="text-sm text-gray-400">
            + {bids.length - 5} more bids
          </span>
        </div>
      )}
    </div>
  );
}
