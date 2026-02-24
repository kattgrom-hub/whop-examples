"use client";

import { useState, useEffect } from "react";
import { Compass, Users, ExternalLink } from "lucide-react";

interface Plan {
  id: string;
  name: string | null;
  price: number;
  purchaseUrl: string;
  planType: string;
}

interface Community {
  id: string;
  name: string;
  plans: Plan[];
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatPrice(price: number): string {
  if (price === 0) return "Free";
  return `$${price.toFixed(2)}`;
}

function formatPlanType(planType: string): string {
  if (planType === "one_time") return "one-time";
  if (planType === "renewal") return "/mo";
  return "";
}

export default function DiscoverPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/discover");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setCommunities(data.communities ?? []);
      } catch {
        setError("Failed to load communities.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#0F0F23]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4338CA] border-t-transparent" />
        <p className="mt-4 text-gray-400">Loading communities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-[#0F0F23]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[#0F0F23] overflow-hidden">
      {/* Header */}
      <div className="flex h-12 items-center border-b border-[#1E1B4B] px-6 shadow-sm">
        <Compass size={20} className="text-gray-500" />
        <h3 className="ml-2 font-semibold text-white">Discover</h3>
        <div className="mx-3 h-6 w-px bg-[#1E1B4B]" />
        <p className="text-sm text-gray-500">
          Find communities to join
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {communities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1E1B4B]">
              <Compass size={40} className="text-[#4338CA]" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-white">
              No communities yet
            </h2>
            <p className="mt-2 max-w-sm text-gray-400">
              Communities will appear here when they are created. Check back
              later!
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-1 text-2xl font-bold text-white">
              Explore Communities
            </h2>
            <p className="mb-6 text-gray-400">
              Browse and join communities on Dischord
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {communities.map((community) => {
                const cheapestPlan = community.plans.length > 0
                  ? community.plans.reduce((min, p) =>
                      p.price < min.price ? p : min
                    )
                  : null;

                return (
                  <div
                    key={community.id}
                    className="flex flex-col rounded-lg border border-[#1E1B4B] bg-[#12122a] overflow-hidden transition-colors hover:border-[#4338CA]/50"
                  >
                    {/* Banner */}
                    <div className="h-24 bg-gradient-to-br from-[#4338CA] to-[#6366F1]" />

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4 -mt-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1E1B4B] text-sm font-bold text-white ring-4 ring-[#12122a]">
                        {getInitials(community.name)}
                      </div>

                      <h3 className="mt-3 font-semibold text-white truncate">
                        {community.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <Users size={12} />
                        <span>Community</span>
                      </div>

                      <div className="mt-auto pt-4">
                        {cheapestPlan ? (
                          <a
                            href={cheapestPlan.purchaseUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#4338CA] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#5346db]"
                          >
                            Join {formatPrice(cheapestPlan.price)}
                            {cheapestPlan.price > 0 && (
                              <span className="text-white/70">
                                {formatPlanType(cheapestPlan.planType)}
                              </span>
                            )}
                            <ExternalLink size={14} />
                          </a>
                        ) : (
                          <button
                            disabled
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#1E1B4B] px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed"
                          >
                            No plans available
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
