"use client";

import { useState } from "react";

interface BookingButtonProps {
  coachId: string;
  coachName: string;
  price: number;
  selectedSlot?: string;
}

export function BookingButton({
  coachId,
  coachName,
  price,
  selectedSlot,
}: BookingButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coachId,
          coachName,
          price,
          timeSlot: selectedSlot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      // Redirect to Whop checkout
      if (data.checkoutUrl) {
        // purchase_url is already a full URL, use it directly
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleBooking}
        disabled={isLoading}
        className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating checkout..." : `Book for $${price}`}
      </button>
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
      <p className="text-gray-500 text-sm text-center mt-3">
        Secure payment powered by Whop
      </p>
    </div>
  );
}
