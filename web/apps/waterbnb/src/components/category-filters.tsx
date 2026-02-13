"use client";

import { useState } from "react";

const CATEGORIES = [
  {
    name: "Sailboat",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L12 20" />
        <path d="M12 5L4 18H20L12 5Z" />
        <path d="M3 21H21" />
      </svg>
    ),
  },
  {
    name: "Yacht",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20L6 16H18L22 20" />
        <path d="M6 16V10C6 10 9 8 12 8C15 8 18 10 18 10V16" />
        <path d="M12 8V4" />
        <path d="M10 4H14" />
      </svg>
    ),
  },
  {
    name: "Pontoon",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="10" width="16" height="4" rx="1" />
        <path d="M6 14V18" />
        <path d="M18 14V18" />
        <path d="M4 18C4 18 8 20 12 20C16 20 20 18 20 18" />
        <path d="M8 10V8H16V10" />
      </svg>
    ),
  },
  {
    name: "Speedboat",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17L5 13H19L21 17" />
        <path d="M5 13L7 9H15L19 13" />
        <path d="M2 20C2 20 7 18 12 18C17 18 22 20 22 20" />
      </svg>
    ),
  },
  {
    name: "Fishing Boat",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18L6 14H18L21 18" />
        <path d="M6 14V11C6 11 9 9 12 9C15 9 18 11 18 11V14" />
        <path d="M12 9V3" />
        <path d="M12 3L16 6" />
        <path d="M2 21C2 21 7 19 12 19C17 19 22 21 22 21" />
      </svg>
    ),
  },
  {
    name: "Kayak",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="14" rx="10" ry="3" />
        <path d="M2 14C2 14 5 11 12 11C19 11 22 14 22 14" />
        <path d="M8 11L5 5" />
        <path d="M16 11L19 5" />
      </svg>
    ),
  },
  {
    name: "Canoe",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 16C2 16 5 12 12 12C19 12 22 16 22 16" />
        <path d="M2 16C2 18 6 19 12 19C18 19 22 18 22 16" />
        <path d="M9 12L7 6" />
        <path d="M15 12L17 6" />
      </svg>
    ),
  },
  {
    name: "Catamaran",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18L6 14H18L20 18" />
        <path d="M8 14V10H16V14" />
        <path d="M12 10V4" />
        <path d="M12 4L17 10" />
        <path d="M3 21H21" />
      </svg>
    ),
  },
  {
    name: "Houseboat",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 18L5 14H19L21 18" />
        <rect x="7" y="8" width="10" height="6" rx="1" />
        <path d="M12 8V5L16 8" />
        <rect x="10" y="10" width="4" height="4" />
        <path d="M2 21C2 21 7 19 12 19C17 19 22 21 22 21" />
      </svg>
    ),
  },
  {
    name: "Jet Ski",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 16L6 13H14L18 16" />
        <path d="M8 13C8 13 9 9 12 9C14 9 14 13 14 13" />
        <path d="M18 16L21 15" />
        <path d="M2 19C2 19 7 17 12 17C17 17 22 19 22 19" />
      </svg>
    ),
  },
];

export function CategoryFilters() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActive(active === cat.name ? null : cat.name)}
            className={`flex flex-col items-center gap-2 min-w-fit pb-2 border-b-2 transition-all ${
              active === cat.name
                ? "border-[#222222] text-[#222222]"
                : "border-transparent text-[#717171] hover:text-[#222222] hover:border-[#DDDDDD]"
            }`}
          >
            <span className="opacity-70">{cat.icon}</span>
            <span className="text-xs font-medium whitespace-nowrap">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
