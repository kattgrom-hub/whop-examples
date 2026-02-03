"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "chart" },
  { href: "/dashboard/listings", label: "My Listings", icon: "tag" },
  { href: "/dashboard/orders", label: "Purchases", icon: "bag" },
  { href: "/dashboard/sales", label: "Sales", icon: "cash" },
  { href: "/dashboard/payouts", label: "Payouts", icon: "wallet" },
  { href: "/dashboard/settings", label: "Settings", icon: "gear" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
                <img
                  src="https://api.dicebear.com/9.x/notionists/svg?seed=currentuser"
                  alt="User"
                  className="w-12 h-12 rounded-full bg-gray-700"
                />
                <div>
                  <p className="font-semibold">Your Dashboard</p>
                  <p className="text-sm text-gray-400">Seller Portal</p>
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
                          ? "bg-green-600 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <span className="text-sm">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <Link
                  href="/dashboard/create"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <span>+</span>
                  <span>Create Listing</span>
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
