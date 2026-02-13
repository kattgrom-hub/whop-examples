"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
  const router = useRouter();
  const [where, setWhere] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (where.trim()) params.set("where", where.trim());
    if (date.trim()) params.set("date", date.trim());
    if (guests.trim()) params.set("guests", guests.trim());
    const qs = params.toString();
    router.push(qs ? `/browse?${qs}` : "/browse");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="max-w-3xl mx-auto bg-white border border-[#DDDDDD] rounded-full flex items-center shadow-lg hover:shadow-xl transition-shadow"
    >
      <div className="flex-1 px-6 py-3 border-r border-[#EBEBEB]">
        <label className="block text-xs font-semibold text-[#222222]">Where</label>
        <input
          type="text"
          placeholder="Search destinations"
          value={where}
          onChange={(e) => setWhere(e.target.value)}
          className="w-full bg-transparent text-sm text-[#484848] placeholder-[#717171] focus:outline-none"
        />
      </div>
      <div className="px-6 py-3 border-r border-[#EBEBEB]">
        <label className="block text-xs font-semibold text-[#222222]">Date</label>
        <input
          type="text"
          placeholder="Add dates"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full bg-transparent text-sm text-[#484848] placeholder-[#717171] focus:outline-none"
        />
      </div>
      <div className="px-6 py-3">
        <label className="block text-xs font-semibold text-[#222222]">Guests</label>
        <input
          type="text"
          placeholder="Add guests"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="w-full bg-transparent text-sm text-[#484848] placeholder-[#717171] focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="m-2 p-3 bg-[#FF385C] rounded-full hover:bg-[#D70466] transition-colors flex-shrink-0"
        aria-label="Search"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}
