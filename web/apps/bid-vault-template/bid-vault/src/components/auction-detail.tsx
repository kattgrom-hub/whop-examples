"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BidHistory } from "@/components/bid-history";
import type { Auction } from "@/lib/data";
import { formatCurrency, getTimeRemaining } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";

export function AuctionDetail({ auction }: { auction: Auction }) {
  const { isAuthenticated } = useAuth();

  const [selectedImage, setSelectedImage] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(auction.endTime));
  const [showBidConfirm, setShowBidConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(auction.endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  const minBid = auction.currentBid + Math.ceil(auction.currentBid * 0.01);
  const isEndingSoon = !timeLeft.isEnded && timeLeft.days === 0 && timeLeft.hours < 6;

  const handlePlaceBid = () => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }

    const amount = parseFloat(bidAmount);
    if (amount >= minBid) {
      setShowBidConfirm(true);
    }
  };

  const confirmBid = () => {
    // In production, this would call the API to place the bid
    setShowBidConfirm(false);
    setBidAmount("");
    alert("Bid placed successfully! (Demo)");
  };

  return (
    <main className="py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <Link href="/auctions" className="text-gray-400 hover:text-white transition-colors">
            Auctions
          </Link>
          <span className="mx-2 text-gray-600">/</span>
          <span className="text-gray-300">{auction.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden mb-4 border border-gray-700">
              <img
                src={auction.images[selectedImage]}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {auction.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? "border-purple-500"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${auction.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            {/* Title & Seller */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {auction.authenticity.verified && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified Authentic
                  </span>
                )}
                {auction.featured && (
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded">
                    Featured
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold mb-4">{auction.title}</h1>

              <Link
                href="#"
                className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <img
                  src={auction.seller.avatar}
                  alt={auction.seller.name}
                  className="w-10 h-10 rounded-full bg-gray-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{auction.seller.name}</span>
                    {auction.seller.verified && (
                      <svg
                        className="w-4 h-4 text-purple-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-amber-400">{"*".repeat(Math.round(auction.seller.rating))}</span>
                    <span>{auction.seller.rating} rating</span>
                  </div>
                </div>
                <span className="text-purple-400 text-sm">Contact Seller</span>
              </Link>
            </div>

            {/* Countdown & Current Bid */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    {timeLeft.isEnded ? "Auction Ended" : "Time Remaining"}
                  </p>
                  <div className={`text-2xl font-mono font-bold ${isEndingSoon && !timeLeft.isEnded ? "text-red-400 animate-pulse" : ""}`}>
                    {timeLeft.isEnded ? (
                      "Ended"
                    ) : (
                      <>
                        {timeLeft.days > 0 && `${timeLeft.days}d `}
                        {String(timeLeft.hours).padStart(2, "0")}:
                        {String(timeLeft.minutes).padStart(2, "0")}:
                        {String(timeLeft.seconds).padStart(2, "0")}
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">Current Bid</p>
                  <p className="text-3xl font-bold text-amber-500">
                    {formatCurrency(auction.currentBid)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                <span>{auction.bidCount} bids</span>
                <span>{auction.watchers} watching</span>
              </div>

              {!timeLeft.isEnded && (
                <>
                  {/* Place Bid Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Your Bid (minimum: {formatCurrency(minBid)})
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder={minBid.toLocaleString()}
                          className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-lg"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handlePlaceBid}
                      disabled={!bidAmount || parseFloat(bidAmount) < minBid}
                      className="w-full py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Place Bid
                    </button>
                  </div>

                  {auction.buyNowPrice && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <button className="w-full py-4 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-semibold">
                        Buy Now for {formatCurrency(auction.buyNowPrice)}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Item Details */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 mb-6">
              <div className="p-4 border-b border-gray-700">
                <h2 className="font-semibold">Item Details</h2>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Condition</span>
                  <span className="capitalize font-medium">{auction.condition.replace("-", " ")}</span>
                </div>
                {auction.authenticity.certificateId && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Certificate ID</span>
                    <span className="font-mono text-sm">{auction.authenticity.certificateId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Starting Bid</span>
                  <span>{formatCurrency(auction.startingBid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping (Domestic)</span>
                  <span>{auction.shipping.domestic === 0 ? "Free" : formatCurrency(auction.shipping.domestic)}</span>
                </div>
                {auction.shipping.international && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Shipping (International)</span>
                    <span>{formatCurrency(auction.shipping.international)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Description</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
              {auction.description}
            </p>
          </div>
        </div>

        {/* Bid History */}
        <div className="mt-8 bg-gray-800 rounded-xl border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Bid History ({auction.bidCount} bids)</h2>
          </div>
          <BidHistory bids={auction.bids} showAll />
        </div>
      </div>

      {/* Bid Confirmation Modal */}
      {showBidConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold mb-4">Confirm Your Bid</h3>
            <p className="text-gray-400 mb-6">
              You are about to place a bid of{" "}
              <span className="text-amber-500 font-bold">
                {formatCurrency(parseFloat(bidAmount))}
              </span>{" "}
              on this item. This bid is binding.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowBidConfirm(false)}
                className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBid}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Confirm Bid
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
