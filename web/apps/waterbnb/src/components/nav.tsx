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
          <Link href="/" className="text-xl font-bold text-[#0077B6]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Waterbnb
          </Link>
          <Link
            href="/browse"
            className={`hidden md:block transition-colors ${
              pathname === "/browse" ? "text-[#0077B6]" : "text-gray-400 hover:text-[#0077B6]"
            }`}
          >
            Browse
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="w-8 h-8 border-2 spinner-ocean rounded-full animate-spin" />
          ) : isAuthenticated && user ? (
            <>
              <Link
                href="/messages"
                className={`transition-colors ${
                  pathname === "/messages" ? "text-[#0077B6]" : "text-gray-400 hover:text-[#0077B6]"
                }`}
              >
                Messages
              </Link>
              <Link
                href="/dashboard"
                className={`transition-colors ${
                  pathname.startsWith("/dashboard") ? "text-[#0077B6]" : "text-gray-400 hover:text-[#0077B6]"
                }`}
              >
                Dashboard
              </Link>
              <div className="w-8 h-8 rounded-full bg-[#0077B6] flex items-center justify-center text-white text-sm font-medium">
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
                href="/become-a-host"
                className="px-4 py-2 bg-[#0077B6] text-white rounded-lg hover:bg-[#023E8A] transition-colors font-semibold"
              >
                Become a Host
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
