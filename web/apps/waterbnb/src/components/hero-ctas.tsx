"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function HeroCTAs() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex gap-4 justify-center">
      <Link
        href="/browse"
        className="px-6 py-3 bg-[#0077B6] text-white rounded-lg hover:bg-[#023E8A] transition-colors font-semibold"
      >
        Find a Boat
      </Link>
      {!isAuthenticated && (
        <Link
          href="/become-a-host"
          className="px-6 py-3 bg-[#1A1A1A]/80 backdrop-blur-sm text-white rounded-lg hover:bg-[#2A2A2A] transition-colors font-medium border border-[#2A2A2A] hover:border-[#0077B6]/30"
        >
          Become a Host
        </Link>
      )}
    </div>
  );
}
