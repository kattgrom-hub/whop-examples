"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BecomeACoachPage() {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const proPrice = isYearly ? 13 : 19;
  const proOriginalPrice = isYearly ? 19 : 29;

  const handleSelectPlan = async (plan: "core" | "pro") => {
    setIsLoading(plan);
    setError(null);

    try {
      const response = await fetch("/api/coach-plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          billing: isYearly ? "yearly" : "monthly",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout");
      }

      // Redirect to Whop checkout or login for free plan
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="text-center pt-16 pb-12">
        <div className="text-4xl mb-4">🏷️</div>
        <h1 className="text-4xl font-bold text-white mb-4">Pricing</h1>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Choose the plan that fits your coaching journey
        </p>

        {/* Monthly/Yearly Toggle */}
        <div className="inline-flex items-center gap-3 bg-gray-900 rounded-full p-1.5">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !isYearly
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
              isYearly
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Yearly
            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
              Save 33%
            </span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-5xl mx-auto px-6 mb-6">
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center">
            {error}
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Core Plan */}
          <div className="relative bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400">
              Most popular
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">👑</span>
                <h2 className="text-2xl font-bold text-white">Core</h2>
              </div>

              <p className="text-gray-400 mb-6">
                Everything you need to get started—no monthly fees, only pay 8%
                on what you earn.
              </p>

              <div className="flex items-baseline gap-3 mb-6">
                <div>
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-gray-400 ml-1">per month</span>
                </div>
                <span className="text-gray-500">+</span>
                <div>
                  <span className="text-3xl font-bold text-white">8%</span>
                  <span className="text-gray-400 ml-1">of your earnings</span>
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan("core")}
                disabled={isLoading !== null}
                className="block w-full py-3 bg-gray-800 text-white text-center rounded-lg font-medium hover:bg-gray-700 transition-colors mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading === "core" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Get Started Free"
                )}
              </button>

              <div className="space-y-4 mb-8">
                <Feature
                  title="Sell free & paid Sessions"
                  subtitle="Replaces Fiverr, Calendly"
                />
                <Feature
                  title="Sell free & paid Courses"
                  subtitle="Replaces Kajabi, Teachable"
                />
                <Feature
                  title="Create free & paid Groups"
                  subtitle="Replaces Patreon, Discord"
                />
                <Feature
                  title="Built-in scheduling & payments"
                  subtitle="No extra tools needed"
                />
              </div>

              <div className="border-t border-gray-800 pt-6">
                <p className="text-white font-medium mb-3">
                  Go <span className="text-blue-400">Core</span> when...
                </p>
                <div className="flex gap-3">
                  <span className="text-xl">🚀</span>
                  <div>
                    <p className="text-white font-medium">
                      You're just starting your coaching journey
                    </p>
                    <p className="text-gray-400 text-sm">
                      No monthly fees, simply pay as you earn with a convenient
                      revenue share model.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-gray-900 rounded-2xl border border-purple-500/50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm text-white font-medium">
              Recommended for full-time coaches
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">👑</span>
                <h2 className="text-2xl font-bold text-white">Pro</h2>
              </div>

              <p className="text-gray-400 mb-6">
                Unlock your full earning potential. Grow with a fixed monthly
                cost!
              </p>

              <div className="flex items-baseline gap-3 mb-6">
                <div>
                  <span className="text-2xl text-gray-500 line-through mr-2">
                    ${proOriginalPrice}
                  </span>
                  <span className="text-4xl font-bold text-purple-400">
                    ${proPrice}
                  </span>
                  <span className="text-gray-400 ml-1">per month</span>
                </div>
                <span className="text-gray-500">+</span>
                <div>
                  <span className="text-3xl font-bold text-green-400">0%</span>
                  <span className="text-gray-400 ml-1">of your earnings</span>
                </div>
              </div>

              <button
                onClick={() => handleSelectPlan("pro")}
                disabled={isLoading !== null}
                className="block w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-colors mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading === "pro" ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Upgrade to Pro"
                )}
              </button>

              <div className="mb-8">
                <p className="text-white font-medium mb-4">
                  Everything in Core, plus:
                </p>
                <div className="space-y-4">
                  <Feature
                    title="Keep everything you earn, no additional fees"
                    highlight
                  />
                  <Feature title="Priority support" />
                  <Feature title="Advanced analytics dashboard" />
                  <Feature title="Custom branding options" />
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <p className="text-white font-medium mb-3">
                  Go <span className="text-purple-400">Pro</span> when...
                </p>
                <div className="flex gap-3">
                  <span className="text-xl">💰</span>
                  <div>
                    <p className="text-white font-medium">
                      100% sounds better than 92%
                    </p>
                    <p className="text-gray-400 text-sm">
                      Your success, your money - all of it. Maximize your
                      income, minimize your costs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            📊 By the numbers
          </h2>
          <p className="text-gray-400 mb-8">
            We've already helped coaches earn over $1M, and we're just getting
            started.
          </p>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-gray-400 text-sm">Active Coaches</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-gray-400 text-sm">Sessions Booked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">$1M+</p>
              <p className="text-gray-400 text-sm">Paid to Coaches</p>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Feature({
  title,
  subtitle,
  highlight,
}: {
  title: string;
  subtitle?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <svg
        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
          highlight ? "text-green-400" : "text-blue-400"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
      <div>
        <p className={`${highlight ? "text-green-400" : "text-white"}`}>
          {title}
        </p>
        {subtitle && <p className="text-gray-500 text-sm">{subtitle}</p>}
      </div>
    </div>
  );
}
