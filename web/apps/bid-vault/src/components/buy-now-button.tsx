"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/data";

interface BuyNowButtonProps {
  auctionId: string;
  auctionTitle: string;
  price: number;
  sellerId: string;
  disabled?: boolean;
}

export function BuyNowButton({
  auctionId,
  auctionTitle,
  price,
  sellerId,
  disabled,
}: BuyNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuyNow = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auctionId,
          auctionTitle,
          price,
          sellerId,
          type: "buy_now",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      // Redirect to Whop checkout
      if (data.checkoutUrl) {
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
        onClick={handleBuyNow}
        disabled={isLoading || disabled}
        className="w-full py-4 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Creating checkout..." : `Buy Now for ${formatCurrency(price)}`}
      </button>
      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
      <p className="text-gray-500 text-xs text-center mt-2">
        Secure payment powered by Whop
      </p>
    </div>
  );
}
