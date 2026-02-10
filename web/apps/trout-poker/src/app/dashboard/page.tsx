"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

interface Tournament {
  id: string;
  title: string;
  date: string;
  time: string;
  entryFee: number;
  status: string;
  currentPlayers: number;
  maxPlayers: number;
}

interface PayoutRequest {
  id: string;
  amount: number;
  status: string;
  reason: string;
  tournamentTitle: string;
  createdAt: string;
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [connectedAccount, setConnectedAccount] = useState<Record<string, unknown> | null>(null);
  const [recentRequests, setRecentRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    async function init() {
      try {
        let accountData = null;
        const getRes = await fetch(`/api/connected-account?userId=${user!.id}`);

        if (getRes.ok) {
          accountData = await getRes.json();
        } else if (getRes.status === 404) {
          const createRes = await fetch("/api/connected-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user!.id,
              email: user!.email,
              name: user!.name || user!.username,
            }),
          });
          if (createRes.ok) accountData = await createRes.json();
        }

        if (accountData?.company) setConnectedAccount(accountData.company);

        const reqRes = await fetch(`/api/payout-requests?userId=${user!.id}`);
        const reqData = reqRes.ok ? await reqRes.json() : { requests: [] };
        setRecentRequests((reqData.requests || []).slice(0, 5));
      } catch (err) {
        console.error("Error initializing dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="font-display italic text-2xl text-text-primary mb-4">Dashboard</h1>
        <p className="text-text-secondary mb-6">Sign in to access your dashboard.</p>
        <Link href="/auth/login?redirect=/dashboard" className="px-6 py-3 bg-creek-600 text-text-inverse rounded-xl hover:bg-creek-500 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
          Sign In
        </Link>
      </div>
    );
  }

  const meta = (connectedAccount?.metadata || {}) as Record<string, string>;
  const role = meta.role || "angler";

  return (
    <div>
      <h1 className="font-display italic text-2xl text-text-primary mb-6">Dashboard</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 stagger-children">
        <div className="card p-5">
          <p className="text-sm text-text-secondary mb-1">Role</p>
          <p className="text-lg font-semibold text-text-primary capitalize">{role}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-text-secondary mb-1">Plan</p>
          <p className="text-lg font-semibold text-text-primary capitalize">{meta.plan || "Core"}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-text-secondary mb-1">Pending Requests</p>
          <p className="text-lg font-semibold text-text-primary">{recentRequests.filter((r) => r.status === "pending").length}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 stagger-children">
        <Link href="/tournaments" className="card card-lift p-5">
          <h3 className="font-semibold text-text-primary mb-1"><span className="text-creek-500">&#8226;</span> Browse Tournaments</h3>
          <p className="text-sm text-text-secondary">Find and enter upcoming tournaments</p>
        </Link>
        <Link href="/dashboard/payouts" className="card card-lift p-5">
          <h3 className="font-semibold text-text-primary mb-1"><span className="text-creek-500">&#8226;</span> Payout Requests</h3>
          <p className="text-sm text-text-secondary">View and submit payout requests</p>
        </Link>
        {role === "organizer" && (
          <Link href="/dashboard/tournaments" className="card card-lift p-5">
            <h3 className="font-semibold text-text-primary mb-1"><span className="text-creek-500">&#8226;</span> Manage Tournaments</h3>
            <p className="text-sm text-text-secondary">Create and manage your tournaments</p>
          </Link>
        )}
        <Link href="/dashboard/withdrawals" className="card card-lift p-5">
          <h3 className="font-semibold text-text-primary mb-1"><span className="text-creek-500">&#8226;</span> Withdrawals</h3>
          <p className="text-sm text-text-secondary">Withdraw your balance to bank</p>
        </Link>
      </div>

      {/* Recent Requests */}
      {recentRequests.length > 0 && (
        <div>
          <h2 className="font-display italic text-lg text-text-primary mb-4">Recent Payout Requests</h2>
          <div className="space-y-3 stagger-children">
            {recentRequests.map((req) => (
              <div key={req.id} className="card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{req.tournamentTitle || "Tournament"}</p>
                  <p className="text-sm text-text-secondary">{req.reason === "tournament_prize" ? "Prize" : "Revenue"}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-creek-400 font-semibold">${(req.amount / 100).toFixed(2)}</p>
                  <span className={`badge ${
                    req.status === "pending" ? "bg-yellow-900/30 text-yellow-400" :
                    req.status === "approved" ? "bg-green-900/30 text-green-400" :
                    "bg-red-900/30 text-red-400"
                  }`}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
