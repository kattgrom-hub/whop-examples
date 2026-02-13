"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WhopEmbeddedCheckout } from "@/components/whop-checkout";

interface BoatItem {
  id: string;
  title: string;
  description: string;
  location: string;
  capacity: number;
  boatType: string;
  pricePerTrip: number;
  availableDates: string[];
  hostId?: string;
  hostName?: string;
  hostAvatar?: string;
}

const BOAT_GRADIENTS: Record<string, string> = {
  sailboat: "from-blue-900 via-cyan-800 to-teal-700",
  yacht: "from-indigo-900 via-purple-800 to-blue-700",
  pontoon: "from-emerald-900 via-teal-800 to-cyan-700",
  speedboat: "from-red-900 via-orange-800 to-amber-700",
  "fishing boat": "from-slate-800 via-blue-900 to-slate-700",
  kayak: "from-green-900 via-emerald-800 to-teal-700",
};

function getGradient(boatType: string): string {
  return (
    BOAT_GRADIENTS[boatType.toLowerCase()] ||
    "from-blue-900 via-slate-800 to-cyan-900"
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatDateRange(dates: string[]): string {
  if (dates.length === 0) return "";
  const sorted = [...dates].sort();
  if (sorted.length === 1) return formatDate(sorted[0]);
  return `${formatDate(sorted[0])} - ${formatDate(sorted[sorted.length - 1])}`;
}

export function BoatCard({ boat }: { boat: BoatItem }) {
  const router = useRouter();
  const [planId, setPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [liked, setLiked] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);

  const hostId = boat.hostId || "";
  const hostName = boat.hostName || "";
  const sortedDates = [...(boat.availableDates || [])].sort();

  // Generate pseudo-image variations from boat data
  const imageCount = Math.min(Math.max(sortedDates.length, 1), 5);

  const handleReserve = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostId,
          hostName,
          price: boat.pricePerTrip,
          reservationDate: selectedDate,
          boatId: boat.id,
          boatTitle: boat.title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      setPlanId(data.planId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckoutSuccess = () => {
    router.push(`/dashboard/listings?success=true`);
  };

  const handleCloseCheckout = () => {
    setPlanId(null);
  };

  return (
    <>
      {/* Checkout Modal */}
      {planId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#DDDDDD] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-[#DDDDDD] flex-shrink-0">
              <div>
                <h3 className="font-semibold">{boat.title}</h3>
                <p className="text-sm text-[#717171]">
                  {formatDate(selectedDate)} &middot; ${boat.pricePerTrip}
                </p>
              </div>
              <button
                onClick={handleCloseCheckout}
                className="p-2 rounded-lg hover:bg-[#EBEBEB] transition-colors text-[#717171]"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 5l10 10M15 5l-10 10" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto flex-1">
              <WhopEmbeddedCheckout
                planId={planId}
                onSuccess={handleCheckoutSuccess}
                onClose={handleCloseCheckout}
              />
            </div>
          </div>
        </div>
      )}

      {/* Airbnb-style Card */}
      <div className="group cursor-pointer">
        {/* Image area */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
          {/* Gradient background as image placeholder */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getGradient(boat.boatType)} transition-transform duration-300 group-hover:scale-105`}
          >
            {/* Decorative boat illustration */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <BoatIllustration type={boat.boatType} />
            </div>
            {/* Wave pattern overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 opacity-10">
              <svg
                viewBox="0 0 400 80"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 40 Q50 10 100 40 T200 40 T300 40 T400 40 V80 H0Z"
                  fill="white"
                />
                <path
                  d="M0 55 Q50 30 100 55 T200 55 T300 55 T400 55 V80 H0Z"
                  fill="white"
                  opacity="0.5"
                />
              </svg>
            </div>
            {/* Boat type label */}
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-[#222222] text-xs font-medium rounded-full border border-[#DDDDDD]">
                {boat.boatType}
              </span>
            </div>
          </div>

          {/* Heart button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="absolute top-3 right-3 z-10"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={liked ? "#FF385C" : "rgba(0,0,0,0.5)"}
              stroke="white"
              strokeWidth="1.5"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {/* Carousel dots */}
          {imageCount > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {Array.from({ length: imageCount }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === imageIdx ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Carousel arrows (show on hover) */}
          {imageCount > 1 && (
            <>
              {imageIdx > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageIdx((prev) => Math.max(0, prev - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="#222"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M8 1L3 6l5 5" />
                  </svg>
                </button>
              )}
              {imageIdx < imageCount - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageIdx((prev) =>
                      Math.min(imageCount - 1, prev + 1)
                    );
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-md"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="#222"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M4 1l5 5-5 5" />
                  </svg>
                </button>
              )}
            </>
          )}
        </div>

        {/* Card info */}
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-[15px] text-[#222222] leading-tight">
              {boat.location}
            </h3>
            <div className="flex items-center gap-1 text-sm text-[#222222] flex-shrink-0 ml-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
              >
                <path d="M6 0l1.76 3.77L12 4.24 8.88 7.17l.74 4.56L6 9.75 2.38 11.73l.74-4.56L0 4.24l4.24-.47L6 0z" />
              </svg>
              <span>{(4 + (boat.capacity % 10) / 10).toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-[#717171]">{boat.title}</p>
          <p className="text-sm text-[#717171]">
            Hosted by {boat.hostName || "Host"} &middot; Up to {boat.capacity}{" "}
            guests
          </p>
          {sortedDates.length > 0 && (
            <p className="text-sm text-[#717171]">
              {formatDateRange(sortedDates)}
            </p>
          )}
          <div className="pt-1">
            <span className="font-semibold text-[15px] text-[#222222]">
              {boat.pricePerTrip === 0 ? "Free" : `$${boat.pricePerTrip}`}
            </span>
            {boat.pricePerTrip > 0 && (
              <span className="text-sm text-[#717171]"> trip</span>
            )}
          </div>
        </div>

        {/* Reserve section - appears on hover */}
        <div className="mt-3 overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-300">
          {sortedDates.length > 0 && (
            <div className="space-y-2">
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 bg-[#F7F7F7] border border-[#DDDDDD] rounded-lg text-[#222222] text-sm focus:outline-none focus:border-[#FF385C]"
              >
                <option value="">Select a date</option>
                {sortedDates.map((d) => (
                  <option key={d} value={d}>
                    {formatDate(d)}
                  </option>
                ))}
              </select>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <button
                onClick={handleReserve}
                disabled={isLoading || !selectedDate}
                className="w-full py-2.5 bg-[#FF385C] text-[#222222] rounded-lg hover:bg-[#D70466] transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Reserve"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* Boat type illustrations for the image placeholder */
function BoatIllustration({ type }: { type: string }) {
  const size = 120;
  switch (type.toLowerCase()) {
    case "sailboat":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="white"
          strokeWidth="0"
        >
          <path d="M60 10v70M60 10L30 65h60L60 10z" />
          <path d="M20 85c10-5 20-5 30 0s20 5 30 0 20-5 30 0" fill="none" stroke="white" strokeWidth="3" />
          <path d="M25 80h70l-5 10H30l-5-10z" />
        </svg>
      );
    case "yacht":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="white"
          strokeWidth="0"
        >
          <path d="M15 75h90l-10-20H35l-20 20z" />
          <rect x="40" y="45" width="40" height="10" rx="2" />
          <rect x="50" y="35" width="20" height="10" rx="2" />
          <path d="M20 85c10-5 20-5 30 0s20 5 30 0 20-5 30 0" fill="none" stroke="white" strokeWidth="3" />
        </svg>
      );
    case "kayak":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="white"
          strokeWidth="0"
        >
          <ellipse cx="60" cy="65" rx="50" ry="8" />
          <path d="M60 40v20" stroke="white" strokeWidth="3" fill="none" />
          <path d="M45 35l15 10 15-10" stroke="white" strokeWidth="3" fill="none" />
          <path d="M20 85c10-5 20-5 30 0s20 5 30 0" fill="none" stroke="white" strokeWidth="3" />
        </svg>
      );
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="white"
          strokeWidth="0"
        >
          <path d="M20 75h80l-10-20H30L20 75z" />
          <path d="M40 55V40h40v15" fill="none" stroke="white" strokeWidth="3" />
          <path d="M20 85c10-5 20-5 30 0s20 5 30 0 20-5 30 0" fill="none" stroke="white" strokeWidth="3" />
        </svg>
      );
  }
}
