"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Nav() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Don't show nav on auth pages
  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-white">
            Bid<span className="text-purple-500">Vault</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/auctions"
              className={`transition-colors ${
                pathname === "/auctions"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Auctions
            </Link>
            <Link
              href="/community"
              className={`transition-colors ${
                pathname.startsWith("/community")
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Community
            </Link>
            {isAuthenticated && (
              <Link
                href="/messages"
                className={`transition-colors ${
                  pathname === "/messages"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Messages
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
          ) : isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className={`transition-colors ${
                  pathname.startsWith("/dashboard")
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                {user.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name || "User"}
                    className="w-8 h-8 rounded-full bg-gray-700"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-medium">
                    {(user.name || user.preferred_username || "U")[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden md:block text-sm text-gray-300">
                  {user.name || user.preferred_username || "User"}
                </span>
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/login?role=seller"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Start Selling
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
