"use client";

import { useState } from "react";
import Link from "next/link";
import { BoatCard } from "@/components/boat-card";

interface BoatItem {
  id: string;
  title: string;
  description: string;
  location: string;
  capacity: number;
  boatType: string;
  pricePerTrip: number;
  availableDates: string[];
  hostId: string;
  hostName: string;
  hostAvatar: string;
}

const CATEGORIES = [
  { label: "All", icon: BoatAllIcon },
  { label: "Sailboat", icon: SailboatIcon },
  { label: "Yacht", icon: YachtIcon },
  { label: "Pontoon", icon: PontoonIcon },
  { label: "Speedboat", icon: SpeedboatIcon },
  { label: "Fishing Boat", icon: FishingIcon },
  { label: "Kayak", icon: KayakIcon },
];

export function BrowseGrid({ boats }: { boats: BoatItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? boats
      : boats.filter(
          (b) => b.boatType.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <>
      {/* Category filter bar - sticky below nav */}
      <div className="sticky top-[65px] z-40 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-[2520px] mx-auto px-6 md:px-10 xl:px-20">
          <div className="flex items-center gap-8 overflow-x-auto py-4 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`flex flex-col items-center gap-2 min-w-fit pb-2 border-b-2 transition-all ${
                    active
                      ? "border-white text-white"
                      : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <cat.icon active={active} />
                  <span className="text-xs font-medium whitespace-nowrap">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Listing grid */}
      <div className="max-w-[2520px] mx-auto px-6 md:px-10 xl:px-20 pt-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">
              No boats found
              {activeCategory !== "All" && ` in "${activeCategory}"`}.
            </p>
            <p className="text-gray-500 text-sm">
              {activeCategory !== "All" ? (
                <button
                  onClick={() => setActiveCategory("All")}
                  className="text-[#0077B6] hover:underline"
                >
                  View all boats
                </button>
              ) : (
                <>
                  Be the first to list a boat!{" "}
                  <Link
                    href="/dashboard/listings"
                    className="text-[#0077B6] hover:underline"
                  >
                    Create one
                  </Link>
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-6 gap-y-10">
            {filtered.map((boat) => (
              <BoatCard key={boat.id} boat={boat} />
            ))}
          </div>
        )}
      </div>

      {/* Show map button - floating at bottom center */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button className="flex items-center gap-2 px-5 py-3 bg-[#1A1A1A] text-white text-sm font-semibold rounded-full border border-[#2A2A2A] hover:bg-[#222222] transition-colors shadow-lg shadow-black/40">
          Show map
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M1 3.5v10l4.5-2.5 5 2.5 4.5-2.5v-10l-4.5 2.5-5-2.5L1 3.5z" />
            <path d="M5.5 1v10M10.5 3v10" />
          </svg>
        </button>
      </div>
    </>
  );
}

/* Category Icons - simple SVG icons matching Airbnb's icon style */

function BoatAllIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20l2-2h16l2 2" />
      <path d="M4 18l-1-5h18l-1 5" />
      <path d="M12 3v10" />
      <path d="M7 8l5-5 5 5" />
    </svg>
  );
}

function SailboatIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v17" />
      <path d="M4 19l8-14 8 14" />
      <path d="M2 21h20" />
    </svg>
  );
}

function YachtIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 18h18" />
      <path d="M5 18l1-6h12l1 6" />
      <path d="M8 12V8h8v4" />
      <path d="M10 8V5h4v3" />
      <path d="M2 21h20" />
    </svg>
  );
}

function PontoonIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="10" width="16" height="4" rx="1" />
      <path d="M6 14v3" />
      <path d="M18 14v3" />
      <ellipse cx="6" cy="18" rx="2" ry="1" />
      <ellipse cx="18" cy="18" rx="2" ry="1" />
      <path d="M8 10V8h8v2" />
      <path d="M2 21h20" />
    </svg>
  );
}

function SpeedboatIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 17h18l-3-5H8l-2 2H3v3z" />
      <path d="M15 12l-1-4h-4l-1 4" />
      <path d="M2 20h20" />
    </svg>
  );
}

function FishingIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 18l16-2-3-4H7l-3 6z" />
      <path d="M17 7V2l3 3-3 3" />
      <path d="M17 7v5" />
      <path d="M2 21h20" />
    </svg>
  );
}

function KayakIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="16" rx="10" ry="2" />
      <path d="M12 10v4" />
      <path d="M8 6l4 4 4-4" />
      <path d="M2 20h20" />
    </svg>
  );
}
