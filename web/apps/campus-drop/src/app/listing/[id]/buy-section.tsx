"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Listing } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";

interface BuySectionProps {
  listing: Listing;
}

export function BuySection({ listing }: BuySectionProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (listing.status !== "active") {
      setError("This listing is no longer available");
      return;
    }

    setIsPurchasing(true);
    setError(null);

    // Simulate purchase
    setTimeout(() => {
      setIsPurchasing(false);
      router.push("/dashboard/orders");
    }, 1500);
  };

  if (listing.status === "sold") {
    return (
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <p className="text-center text-gray-400">This item has been sold.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleBuyNow}
        disabled={isPurchasing}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
          isPurchasing
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isPurchasing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Processing...
          </span>
        ) : (
          `Buy Now - $${listing.price}`
        )}
      </button>

      <button
        className="w-full py-3 rounded-lg font-medium bg-gray-800 text-white hover:bg-gray-700 transition-colors border border-gray-700"
      >
        Make an Offer
      </button>

      <p className="text-gray-500 text-sm text-center">
        Secure checkout
      </p>
    </div>
  );
}
