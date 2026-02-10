"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PayoutRequest {
  id: string;
  requesterName: string;
  amount: number;
  reason: string;
  tournamentTitle: string;
  status: string;
  createdAt: string;
}

export default function AdminRequestQueuePage() {
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payout-requests?all=true")
      .then((r) => r.json())
      .then((data) => setRequests(data.requests || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const resolvedRequests = requests.filter((r) => r.status !== "pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display italic text-2xl text-text-primary">Payout Requests</h1>
        <Link
          href="/admin/transfers"
          className="px-4 py-2 bg-transparent border border-border-default text-text-primary rounded-xl hover:bg-surface-overlay hover:border-border-strong transition-all duration-200 text-sm"
        >
          Transfer History
        </Link>
      </div>

      {/* Pending */}
      <section className="mb-12">
        <h2 className="font-display italic text-lg mb-4 text-yellow-400">
          Pending ({pendingRequests.length})
        </h2>
        {pendingRequests.length === 0 ? (
          <p className="text-text-tertiary">No pending requests.</p>
        ) : (
          <div className="space-y-3 stagger-children">
            {pendingRequests.map((req) => (
              <Link
                key={req.id}
                href={`/admin/requests/${req.id}`}
                className="card card-lift block p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">{req.requesterName}</p>
                    <p className="text-sm text-text-secondary">
                      {req.reason === "tournament_prize" ? "Prize" : "Revenue"} &middot; {req.tournamentTitle || "Tournament"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-creek-400 font-semibold">${(req.amount / 100).toFixed(2)}</p>
                    <p className="text-xs text-text-tertiary">{new Date(req.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Resolved */}
      <section>
        <h2 className="font-display italic text-lg mb-4 text-text-secondary">
          Resolved ({resolvedRequests.length})
        </h2>
        {resolvedRequests.length === 0 ? (
          <p className="text-text-tertiary">No resolved requests yet.</p>
        ) : (
          <div className="space-y-3 stagger-children">
            {resolvedRequests.map((req) => (
              <div
                key={req.id}
                className="bg-surface-raised/50 rounded-2xl p-4 border border-border-subtle"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-secondary">{req.requesterName}</p>
                    <p className="text-sm text-text-tertiary">
                      {req.reason === "tournament_prize" ? "Prize" : "Revenue"} &middot; {req.tournamentTitle || "Tournament"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-text-secondary font-semibold">${(req.amount / 100).toFixed(2)}</p>
                    <span className={`badge ${
                      req.status === "approved" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
