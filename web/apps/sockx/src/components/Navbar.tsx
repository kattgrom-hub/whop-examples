"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@whop-examples/auth/client";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="font-heading text-2xl text-sockx-primary tracking-tight">
              SockX
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for socks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm font-body text-sockx-text placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-sockx-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="hidden sm:block text-sm font-body font-medium text-sockx-text hover:text-sockx-primary transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/sell"
              className="hidden sm:block text-sm font-body font-medium text-sockx-text hover:text-sockx-primary transition-colors"
            >
              Sell
            </Link>
            {isAuthenticated && user ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-purple-100 text-sockx-primary text-sm font-body font-semibold rounded-lg hover:bg-purple-200 transition-colors"
              >
                {user.name || user.username || "Account"}
              </button>
            ) : (
              <a
                href="/api/auth/signin"
                className="px-4 py-2 bg-sockx-primary text-white text-sm font-body font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
