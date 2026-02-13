"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function HeroCTAs() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex gap-4 justify-center">
      <Link
        href="/browse"
        className="px-6 py-3 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold"
      >
        Find a Boat
      </Link>
      {!isAuthenticated && (
        <Link
          href="/become-a-host"
          className="px-6 py-3 bg-white text-[#222222] rounded-lg hover:bg-[#F7F7F7] transition-colors font-medium border border-[#DDDDDD] hover:border-[#222222]"
        >
          Become a Host
        </Link>
      )}
    </div>
  );
}
