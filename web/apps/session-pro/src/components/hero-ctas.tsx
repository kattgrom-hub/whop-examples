"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function HeroCTAs() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex gap-4 justify-center">
      <Link
        href="/browse"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Find a Coach
      </Link>
      {!isAuthenticated && (
        <Link
          href="/become-a-coach"
          className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700"
        >
          Become a Coach
        </Link>
      )}
    </div>
  );
}
