"use client";

import { useState } from "react";
import { PickCard } from "@/components/pick-card";
import { getRecentPicks, sports, getPendingPicks } from "@/lib/data";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export default function FeedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedSport, setSelectedSport] = useState("All");
  const [showPending, setShowPending] = useState(false);

  const allPicks = showPending ? getPendingPicks() : getRecentPicks(20);
  const filteredPicks =
    selectedSport === "All"
      ? allPicks
      : allPicks.filter((pick) => pick.sport === selectedSport);

  if (isLoading) {
    return (
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-3xl font-bold mb-4">Your Pick Feed</h1>
          <p className="text-gray-400 mb-8">
            Sign in to see picks from analysts you follow.
          </p>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium inline-block"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Feed</h1>
            <p className="text-gray-400 mt-1">
              Latest picks from analysts you follow
            </p>
          </div>
          <Link
            href="/analysts"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
          >
            Find Analysts
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedSport("All")}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedSport === "All"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All
            </button>
            {sports.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSport(s.name)}
                className={`px-4 py-2 rounded-full transition-colors flex items-center gap-2 ${
                  selectedSport === s.name
                    ? "bg-green-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span>{s.emoji}</span>
                <span className="hidden sm:inline">{s.name}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowPending(false)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                !showPending
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All Picks
            </button>
            <button
              onClick={() => setShowPending(true)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                showPending
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Picks List */}
        {filteredPicks.length > 0 ? (
          <div className="space-y-4">
            {filteredPicks.map((pick) => (
              <PickCard key={pick.id} pick={pick} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-xl border border-gray-700">
            <p className="text-gray-400 mb-4">
              {showPending
                ? "No pending picks at the moment."
                : "No picks to show. Follow some analysts to see their picks here."}
            </p>
            <Link
              href="/analysts"
              className="text-green-500 hover:text-green-400"
            >
              Browse Analysts
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
