"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Nav() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (pathname.startsWith("/auth")) return null;

  return (
    <nav className="border-b border-[#DDDDDD] bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-[#FF385C]">
            Waterbnb
          </Link>
          <Link
            href="/browse"
            className={`hidden md:block transition-colors ${
              pathname === "/browse" ? "text-[#222222] font-medium" : "text-[#717171] hover:text-[#222222]"
            }`}
          >
            Browse
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 border-2 spinner-airbnb rounded-full animate-spin" />
          ) : isAuthenticated && user ? (
            <>
              <Link
                href="/messages"
                className={`transition-colors ${
                  pathname === "/messages" ? "text-[#222222] font-medium" : "text-[#717171] hover:text-[#222222]"
                }`}
              >
                Messages
              </Link>
              <Link
                href="/dashboard"
                className={`transition-colors ${
                  pathname.startsWith("/dashboard") ? "text-[#222222] font-medium" : "text-[#717171] hover:text-[#222222]"
                }`}
              >
                Dashboard
              </Link>
              <div className="w-8 h-8 rounded-full bg-[#222222] flex items-center justify-center text-white text-sm font-medium">
                {user.name?.[0] || user.username?.[0] || "U"}
              </div>
              <button onClick={logout} className="text-[#717171] hover:text-[#222222] transition-colors text-sm">
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors font-semibold"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
