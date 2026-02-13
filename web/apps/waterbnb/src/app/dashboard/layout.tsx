"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/listings", label: "Boats", icon: "⛵" },
  { href: "/dashboard/payouts", label: "Payouts", icon: "💰" },
  { href: "/messages", label: "Messages", icon: "💬" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="rounded-xl p-4 border border-[#DDDDDD] sticky top-24 bg-white">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#EBEBEB]">
                <img
                  src="https://api.dicebear.com/9.x/notionists/svg?seed=host"
                  alt="Host"
                  className="w-12 h-12 rounded-full bg-[#EBEBEB]"
                />
                <div>
                  <p className="font-semibold text-[#222222]">Your Dashboard</p>
                  <p className="text-sm text-[#717171]">Host Portal</p>
                </div>
              </div>
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
                          ? "bg-[#F7F7F7] text-[#222222] font-medium"
                          : "text-[#717171] hover:bg-[#F7F7F7] hover:text-[#222222]"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
