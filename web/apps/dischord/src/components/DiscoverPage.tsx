"use client";

import { useState, useEffect } from "react";
import { Compass, Search, Users, Loader2 } from "lucide-react";

interface Plan {
  id: string;
  price: number;
  currency: string;
  type: string;
  purchaseUrl: string;
  billingPeriodDays: number | null;
  visibility: string;
}

interface Community {
  id: string;
  name: string;
  visibility: string;
  plans: Plan[];
}

function formatPrice(plan: Plan): string {
  const price = plan.price;
  if (price === 0) return "Free";
  const formatted = `$${price.toFixed(2)}`;
  if (plan.type === "renewal" && plan.billingPeriodDays) {
    if (plan.billingPeriodDays <= 7) return `${formatted}/wk`;
    if (plan.billingPeriodDays <= 31) return `${formatted}/mo`;
    if (plan.billingPeriodDays <= 366) return `${formatted}/yr`;
    return `${formatted}/cycle`;
  }
  return plan.type === "one_time" ? `${formatted} once` : formatted;
}

function getCheapestPlan(plans: Plan[]): Plan | null {
  const visible = plans.filter((p) => p.visibility !== "hidden");
  if (visible.length === 0) return plans[0] ?? null;
  return visible.reduce((min, p) => (p.price < min.price ? p : min), visible[0]);
}

export default function DiscoverPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCommunities() {
      try {
        const res = await fetch("/api/discover");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch");
        setCommunities(data.communities ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    fetchCommunities();
  }, []);

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col bg-[#0F0F23] overflow-y-auto">
      {/* Header */}
      <div className="border-b border-[#1E1B4B] bg-[#0a0a1a]/50">
        <div className="mx-auto max-w-4xl px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Compass size={28} className="text-[#22C55E]" />
            <h1 className="text-2xl font-bold text-white">
              Discover Communities
            </h1>
          </div>
          <p className="text-gray-400 mb-6">
            Find and join communities on Dischord
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search communities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md bg-[#1E1B4B]/50 border border-[#1E1B4B] pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#4338CA] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-4xl px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2
              size={32}
              className="text-[#4338CA] animate-spin mb-4"
            />
            <p className="text-gray-400 text-sm">Loading communities...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1E1B4B] mb-4">
              <Users size={28} className="text-gray-500" />
            </div>
            <p className="text-gray-400 text-sm">
              {searchQuery
                ? "No communities match your search"
                : "No communities available yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((community) => {
              const cheapest = getCheapestPlan(community.plans);
              return (
                <CommunityCard
                  key={community.id}
                  community={community}
                  cheapestPlan={cheapest}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityCard({
  community,
  cheapestPlan,
}: {
  community: Community;
  cheapestPlan: Plan | null;
}) {
  const initials = community.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    "bg-[#4338CA]",
    "bg-[#7C3AED]",
    "bg-[#2563EB]",
    "bg-[#059669]",
    "bg-[#D97706]",
    "bg-[#DC2626]",
  ];
  const colorIndex =
    community.name
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % colors.length;

  return (
    <div className="group flex flex-col rounded-lg bg-[#12122a] border border-[#1E1B4B] overflow-hidden transition-all duration-200 hover:border-[#4338CA]/50 hover:shadow-lg hover:shadow-[#4338CA]/5">
      {/* Banner */}
      <div
        className={`h-24 ${colors[colorIndex]} opacity-80 group-hover:opacity-100 transition-opacity`}
      />

      {/* Content */}
      <div className="relative px-4 pb-4">
        {/* Avatar */}
        <div
          className={`absolute -top-6 left-4 flex h-12 w-12 items-center justify-center rounded-2xl ${colors[colorIndex]} border-4 border-[#12122a] text-sm font-bold text-white`}
        >
          {initials}
        </div>

        <div className="pt-8">
          <h3 className="text-sm font-semibold text-white truncate">
            {community.name}
          </h3>

          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            {cheapestPlan && (
              <span className="text-[#22C55E] font-medium">
                {formatPrice(cheapestPlan)}
              </span>
            )}
            {community.plans.length > 1 && (
              <span>
                &middot; {community.plans.length} plan
                {community.plans.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {cheapestPlan ? (
            <a
              href={cheapestPlan.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center rounded-md bg-[#22C55E] px-4 py-1.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#16A34A]"
            >
              Join
            </a>
          ) : (
            <button
              disabled
              className="mt-3 flex w-full items-center justify-center rounded-md bg-[#1E1B4B] px-4 py-1.5 text-sm font-medium text-gray-500 cursor-not-allowed"
            >
              No plans available
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
