"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const tabs = [
  { href: "/dashboard", label: "Today", exact: true },
  { href: "/dashboard/listings", label: "Listings" },
  { href: "/dashboard/payouts", label: "Earnings" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/messages", label: "Messages" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const displayName = user?.name || user?.username || "Host";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="min-h-screen">
      {/* Dashboard header with tabs */}
      <div className="border-b border-[#DDDDDD] bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between pt-6 pb-2">
            <h1 className="text-2xl font-bold">
              Welcome, {firstName}
            </h1>
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
