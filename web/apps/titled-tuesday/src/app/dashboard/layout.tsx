"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

const playerNavItems = [
  { href: "/dashboard", label: "Overview", icon: "~" },
  { href: "/dashboard/history", label: "History", icon: "#" },
  { href: "/dashboard/payouts", label: "Payouts", icon: "$" },
];

const organizerNavItems = [
  { href: "/dashboard/tournaments", label: "My Tournaments", icon: "+" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [role, setRole] = useState<string>("player");

  useEffect(() => {
    if (!user) return;
    fetch(`/api/connected-account?userId=${user.id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.company?.metadata) {
          const meta = data.company.metadata as Record<string, string>;
          setRole(meta.role || "player");
        }
      })
      .catch(() => {});
  }, [user]);

  const navItems = role === "organizer"
    ? [...playerNavItems.slice(0, 1), ...organizerNavItems, ...playerNavItems.slice(1)]
    : playerNavItems;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="card sticky top-24 p-4">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border-subtle">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-text-inverse text-lg font-bold">
                  {user?.name?.[0] || user?.username?.[0] || "U"}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{user?.name || user?.username || "Dashboard"}</p>
                  <p className="text-sm text-text-secondary capitalize">{role}</p>
                </div>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-amber-600/10 text-amber-400 border-l-2 border-amber-500"
                          : "text-text-secondary hover:bg-surface-overlay hover:text-text-primary"
                      }`}
                    >
                      <span className="w-5 text-center font-mono">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {role === "player" && (
                <div className="mt-6 pt-4 border-t border-border-subtle">
                  <Link
                    href="/become-organizer"
                    className="block text-center px-4 py-2 bg-surface-overlay text-amber-400 rounded-xl hover:bg-surface-elevated transition-colors text-sm"
                  >
                    Become an Organizer
                  </Link>
                </div>
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
