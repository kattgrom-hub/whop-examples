"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Nav() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (pathname.startsWith("/auth")) return null;

  return (
    <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-white">
            Session<span className="text-blue-500">Pro</span>
          </Link>
          <Link
            href="/browse"
            className={`hidden md:block transition-colors ${
              pathname === "/browse" ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Browse
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          ) : isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className={`transition-colors ${
                  pathname.startsWith("/dashboard") ? "text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {user.name?.[0] || user.username?.[0] || "U"}
              </div>
              <button onClick={logout} className="text-gray-400 hover:text-white transition-colors text-sm">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                href="/become-a-coach"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Become a Coach
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
