"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Auction } from "@/lib/data";
import { formatCurrency, getTimeRemaining } from "@/lib/data";

export function AuctionCard({ auction }: { auction: Auction }) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(auction.endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(auction.endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  const formatTime = () => {
    if (timeLeft.isEnded) return "Ended";
    if (timeLeft.days > 0) {
      return `${timeLeft.days}d ${timeLeft.hours}h`;
    }
    if (timeLeft.hours > 0) {
      return `${timeLeft.hours}h ${timeLeft.minutes}m`;
    }
    return `${timeLeft.minutes}m ${timeLeft.seconds}s`;
  };

  const isEndingSoon = !timeLeft.isEnded && timeLeft.days === 0 && timeLeft.hours < 6;

  return (
    <Link
      href={`/auction/${auction.id}`}
      className="block bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600 group"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-900">
        <img
          src={auction.images[0]}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {auction.featured && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-black text-xs font-semibold rounded">
            Featured
          </span>
        )}
        {auction.authenticity.verified && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-green-500/90 text-white text-xs font-semibold rounded flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </span>
        )}
        {/* Countdown timer */}
        <div
          className={`absolute bottom-3 left-3 right-3 px-3 py-2 rounded-lg backdrop-blur-sm ${
            timeLeft.isEnded
              ? "bg-gray-900/90 text-gray-400"
              : isEndingSoon
                ? "bg-red-500/90 text-white"
                : "bg-gray-900/90 text-white"
          }`}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              {timeLeft.isEnded ? "Auction Ended" : "Time Left"}
            </span>
            <span className={`font-mono font-bold ${isEndingSoon && !timeLeft.isEnded ? "animate-pulse" : ""}`}>
              {formatTime()}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-semibold text-white line-clamp-2 mb-2 group-hover:text-purple-400 transition-colors">
          {auction.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <img
            src={auction.seller.avatar}
            alt={auction.seller.name}
            className="w-5 h-5 rounded-full bg-gray-700"
          />
          <span className="text-gray-400 text-sm truncate">
            {auction.seller.name}
          </span>
          {auction.seller.verified && (
            <svg
              className="w-4 h-4 text-purple-500 flex-shrink-0"
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

        <div className="flex items-end justify-between">
          <div>
            <p className="text-gray-400 text-xs">Current Bid</p>
            <p className="text-xl font-bold text-amber-500">
              {formatCurrency(auction.currentBid)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">{auction.bidCount} bids</p>
            <p className="text-gray-400 text-xs">{auction.watchers} watching</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
