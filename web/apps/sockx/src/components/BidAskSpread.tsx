interface BidAskSpreadProps {
  lowestAsk: number;
  highestBid: number;
  lastSale: number;
}

export default function BidAskSpread({
  lowestAsk,
  highestBid,
  lastSale,
}: BidAskSpreadProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
        <p className="text-xs font-body text-purple-400 uppercase tracking-wide mb-1">
          Lowest Ask
        </p>
        <p className="font-body font-bold text-xl text-sockx-primary">
          ${lowestAsk}
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-xs font-body text-green-500 uppercase tracking-wide mb-1">
          Highest Bid
        </p>
        <p className="font-body font-bold text-xl text-sockx-cta">
          ${highestBid}
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
        <p className="text-xs font-body text-gray-400 uppercase tracking-wide mb-1">
          Last Sale
        </p>
        <p className="font-body font-bold text-xl text-sockx-text">
          ${lastSale}
        </p>
      </div>
    </div>
  );
}
