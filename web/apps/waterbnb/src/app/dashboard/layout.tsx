"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useMode } from "@/lib/mode-context";

const hostingTabs = [
  { href: "/dashboard", label: "Today", exact: true },
  { href: "/dashboard/listings", label: "Listings" },
  { href: "/dashboard/payouts", label: "Earnings" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/messages", label: "Messages" },
];

const travelingTabs = [
  { href: "/dashboard", label: "Browse", exact: true },
  { href: "/dashboard/reservations", label: "My Reservations" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/messages", label: "Messages" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { mode, toggleMode } = useMode();

  const displayName = user?.name || user?.username || "Host";
  const firstName = displayName.split(" ")[0];

  const tabs = mode === "hosting" ? hostingTabs : travelingTabs;

  // When mode changes, redirect to the first tab if the current path
  // doesn't match any tab in the new mode
  useEffect(() => {
    const isValidTab = tabs.some((tab) =>
      tab.exact ? pathname === tab.href : pathname.startsWith(tab.href)
    );
    if (!isValidTab) {
      router.replace(tabs[0].href);
    }
  }, [mode, pathname, tabs, router]);

  return (
    <div className="min-h-screen">
      {/* Dashboard header with tabs */}
      <div className="border-b border-[#DDDDDD] bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between pt-6 pb-2">
            <h1 className="text-2xl font-bold">
              Welcome, {firstName}
            </h1>
            <button
              onClick={toggleMode}
              className="px-4 py-2 text-sm font-medium border border-[#222222] rounded-full hover:bg-[#222222] hover:text-white transition-colors"
            >
              Switch to {mode === "hosting" ? "Traveling" : "Hosting"}
            </button>
          </div>
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = tab.exact
                ? pathname === tab.href
                : pathname.startsWith(tab.href);
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-white text-[#222222]"
                      : "border-transparent text-[#717171] hover:text-[#222222] hover:border-gray-600"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
