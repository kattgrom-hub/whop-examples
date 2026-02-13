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

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function BoatCard({ boat }: { boat: BoatItem }) {
  const router = useRouter();
  const [planId, setPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const hostId = boat.hostId || "";
  const hostName = boat.hostName || "";
  const hostAvatar = boat.hostAvatar || "";

  const sortedDates = [...(boat.availableDates || [])].sort();
  const nextAvailable = sortedDates[0] || null;

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-[#DDDDDD] w-full max-w-md max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[#DDDDDD] flex-shrink-0">
              <div>
                <h3 className="font-semibold text-[#222222]">{boat.title}</h3>
                <p className="text-sm text-[#717171]">
                  {formatDate(selectedDate)} · ${boat.pricePerTrip}
                </p>
              </div>
              <button
                onClick={handleCloseCheckout}
                className="p-2 rounded-lg hover:bg-[#F7F7F7] transition-colors text-[#717171]"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
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

      {/* Boat Card */}
      <div className="bg-white rounded-xl border border-[#DDDDDD] p-6 transition-all card-border-hover">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={hostAvatar}
              alt={hostName}
              className="w-10 h-10 rounded-full bg-[#EBEBEB]"
            />
            <span className="text-sm text-[#717171]">{hostName}</span>
          </div>
          <span className="text-xl font-bold text-[#222222]">
            {boat.pricePerTrip === 0 ? "Free" : `$${boat.pricePerTrip}`}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2 text-[#222222]">{boat.title}</h3>

        {boat.description && (
          <p className="text-[#717171] text-sm mb-4 line-clamp-2">
            {boat.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-[#717171] mb-2">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M7 1v12M1 7c0-2 3-4 6-4s6 2 6 4" />
            </svg>
            {boat.location}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="7" cy="5" r="2" />
              <path d="M3 12c0-2.2 1.8-4 4-4s4 1.8 4 4" />
            </svg>
            Up to {boat.capacity} guests
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-1 bg-[#F7F7F7] text-[#484848] text-xs rounded-full font-medium border border-[#EBEBEB]">
            {boat.boatType}
          </span>
          {nextAvailable && (
            <span className="text-xs text-[#717171]">
              {sortedDates.length} date{sortedDates.length !== 1 ? "s" : ""} available
            </span>
          )}
        </div>

        {/* Date Selection */}
        {sortedDates.length > 0 ? (
          <div className="mb-4">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#DDDDDD] rounded-lg text-[#222222] text-sm focus:outline-none focus:border-[#222222]"
            >
              <option value="">Select a date</option>
              {sortedDates.map((d) => (
                <option key={d} value={d}>{formatDate(d)}</option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-[#717171] text-sm mb-4">No dates available</p>
        )}

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <button
          onClick={handleReserve}
          disabled={isLoading || !selectedDate}
          className="w-full py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            "Reserve Now"
          )}
        </button>
      </div>
    </>
  );
}
