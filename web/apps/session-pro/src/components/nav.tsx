"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Mock auth state - will be replaced with Whop OAuth
const mockUser = {
  isLoggedIn: true,
  name: "Demo User",
  avatar: "https://api.dicebear.com/9.x/notionists/svg?seed=demo",
  isCoach: true,
};

export function Nav() {
  const pathname = usePathname();

  // Don't show nav on auth pages
  if (pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <nav className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-white">
            Session<span className="text-blue-500">Pro</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/browse"
              className={`transition-colors ${
                pathname === "/browse"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Browse
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
            {mockUser.isLoggedIn && (
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
          {mockUser.isLoggedIn ? (
            <>
              {mockUser.isCoach && (
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
              )}
              <div className="flex items-center gap-3">
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-8 h-8 rounded-full bg-gray-700"
                />
                <span className="hidden md:block text-sm text-gray-300">
                  {mockUser.name}
                </span>
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
                href="/auth/login?role=coach"
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
