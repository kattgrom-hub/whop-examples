"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const talentNavItems = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/jobs", label: "My Jobs", icon: "💼" },
  { href: "/dashboard/payouts", label: "Payouts", icon: "💰" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

const clientNavItems = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/gigs", label: "My Gigs", icon: "📋" },
  { href: "/dashboard/applications", label: "Applications", icon: "👥" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [role, setRole] = useState<"talent" | "client">("talent");

  const navItems = role === "talent" ? talentNavItems : clientNavItems;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 sticky top-24">
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                <img
                  src="https://api.dicebear.com/9.x/notionists/svg?seed=user"
                  alt="User"
                  className="w-12 h-12 rounded-full bg-gray-700"
                />
                <div>
                  <p className="font-semibold">Demo User</p>
                  <p className="text-sm text-gray-400 capitalize">{role}</p>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="mb-4 pb-4 border-b border-gray-700">
                <label className="text-xs text-gray-500 mb-2 block">
                  View as:
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRole("talent")}
                    className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                      role === "talent"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-400 hover:text-white"
                    }`}
                  >
                    Talent
                  </button>
                  <button
                    onClick={() => setRole("client")}
                    className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                      role === "client"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-400 hover:text-white"
                    }`}
                  >
                    Client
                  </button>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-purple-600 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Messages Link */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <Link
                  href="/messages"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  <span>💬</span>
                  <span>Messages</span>
                  <span className="ml-auto w-5 h-5 bg-purple-600 rounded-full text-xs flex items-center justify-center text-white">
                    3
                  </span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
