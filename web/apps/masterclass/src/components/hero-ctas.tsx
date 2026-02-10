"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function HeroCTAs() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex gap-4 justify-center">
      <Link
        href="/browse"
        className="px-6 py-3 bg-[#E53935] text-white rounded-lg hover:bg-[#C62828] transition-colors font-semibold"
      >
        Find a Class
      </Link>
      {!isAuthenticated && (
        <Link
          href="/become-an-instructor"
          className="px-6 py-3 bg-[#1A1A1A]/80 backdrop-blur-sm text-white rounded-lg hover:bg-[#2A2A2A] transition-colors font-medium border border-[#2A2A2A] hover:border-[#E53935]/30"
        >
          Become an Instructor
        </Link>
      )}
    </div>
  );
}
