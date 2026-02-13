"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Nav() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (pathname.startsWith("/auth")) return null;

  return (
    <nav className="border-b border-[#2A2A2A] bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-[#F59E0B]" style={{ fontFamily: "'Oswald', Impact, sans-serif", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Winners Club
          </Link>
          <Link
            href="/browse"
            className={`hidden md:block transition-colors ${
              pathname === "/browse" ? "text-[#F59E0B]" : "text-gray-400 hover:text-[#F59E0B]"
            }`}
          >
            Tipsters
          </Link>
          <Link
            href="/community"
            className={`hidden md:block transition-colors ${
              pathname === "/community" ? "text-[#F59E0B]" : "text-gray-400 hover:text-[#F59E0B]"
            }`}
          >
            Community
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 border-2 spinner-gold rounded-full animate-spin" />
          ) : isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className={`transition-colors ${
                  pathname.startsWith("/dashboard") ? "text-[#F59E0B]" : "text-gray-400 hover:text-[#F59E0B]"
                }`}
              >
                Dashboard
              </Link>
              <div className="w-8 h-8 rounded-full bg-[#F59E0B] flex items-center justify-center text-[#0A0A0A] text-sm font-bold">
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
                href="/become-a-tipster"
                className="px-4 py-2 bg-[#F59E0B] text-[#0A0A0A] rounded-lg hover:bg-[#D97706] transition-colors font-bold"
              >
                Become a Tipster
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
