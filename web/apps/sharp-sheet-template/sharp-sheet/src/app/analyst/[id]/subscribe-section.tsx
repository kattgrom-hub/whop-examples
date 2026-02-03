"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import type { Analyst } from "@/lib/data";

interface SubscribeSectionProps {
  analyst: Analyst;
}

export function SubscribeSection({ analyst }: SubscribeSectionProps) {
  const { isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "annual">("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const monthlyPrice = analyst.monthlyPrice;
  const annualPrice = Math.round(analyst.monthlyPrice * 10); // 2 months free

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      window.location.href = "/";
      return;
    }

    setIsLoading(true);

    // Simulate subscription
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
    }, 1500);
  };

  if (isSubscribed) {
    return (
      <div className="mt-8 bg-green-500/20 border border-green-500/50 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">✓</div>
        <h3 className="text-xl font-semibold text-green-400">Subscribed!</h3>
        <p className="text-gray-400 mt-2">You now have access to {analyst.name}'s picks.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-4">Subscribe to {analyst.name}</h2>

      {/* Plan Selection */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setSelectedPlan("monthly")}
          className={`p-4 rounded-lg border-2 transition-colors ${
            selectedPlan === "monthly"
              ? "border-green-500 bg-green-500/10"
              : "border-gray-700 hover:border-gray-600"
          }`}
        >
          <p className="font-semibold">Monthly</p>
          <p className="text-2xl font-bold mt-1">
            ${monthlyPrice}
            <span className="text-gray-400 text-sm font-normal">/mo</span>
          </p>
        </button>
        <button
          onClick={() => setSelectedPlan("annual")}
          className={`p-4 rounded-lg border-2 transition-colors relative ${
            selectedPlan === "annual"
              ? "border-green-500 bg-green-500/10"
              : "border-gray-700 hover:border-gray-600"
          }`}
        >
          <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-xs font-medium rounded-full">
            Save 17%
          </span>
          <p className="font-semibold">Annual</p>
          <p className="text-2xl font-bold mt-1">
            ${annualPrice}
            <span className="text-gray-400 text-sm font-normal">/yr</span>
          </p>
        </button>
      </div>

      {/* Features */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>All picks with detailed analysis</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Real-time notifications</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Direct messaging with analyst</span>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span>Cancel anytime</span>
        </div>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isLoading}
        className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </span>
        ) : (
          `Subscribe - $${selectedPlan === "monthly" ? monthlyPrice : annualPrice}/${selectedPlan === "monthly" ? "mo" : "yr"}`
        )}
      </button>
    </div>
  );
}
