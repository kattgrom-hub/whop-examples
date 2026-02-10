"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function Nav() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (pathname.startsWith("/auth") || pathname.startsWith("/admin")) return null;

  return (
    <nav className="border-b border-border-subtle bg-surface-base/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-baseline gap-0.5">
            <span className="font-display font-bold text-amber-400 text-2xl tracking-tight">Titled</span>
            <span className="font-display italic text-text-primary text-2xl tracking-tight">Tuesday</span>
          </Link>
          <Link
            href="/tournaments"
            className={`nav-link hidden md:block text-sm font-medium transition-colors ${
              pathname.startsWith("/tournaments")
                ? "text-text-primary nav-link-active"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Tournaments
          </Link>
        </div>
        <div className="flex items-center gap-5">
          {isLoading ? (
            <div className="spinner" style={{ width: "1.5rem", height: "1.5rem", borderWidth: "2px" }} />
          ) : isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className={`nav-link text-sm font-medium transition-colors ${
                  pathname.startsWith("/dashboard")
                    ? "text-text-primary nav-link-active"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Dashboard
              </Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-text-inverse text-sm font-semibold">
                {user.name?.[0] || user.username?.[0] || "U"}
              </div>
              <button onClick={logout} className="text-text-tertiary hover:text-text-primary transition-colors text-sm">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="nav-link text-text-secondary hover:text-text-primary transition-colors text-sm font-medium">
                Log in
              </Link>
              <Link
                href="/become-organizer"
                className="px-4 py-2.5 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 text-sm font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
              >
                Become an Organizer
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
