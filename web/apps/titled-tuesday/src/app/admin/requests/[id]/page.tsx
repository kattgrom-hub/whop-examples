"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface PayoutRequest {
  id: string;
  requesterId: string;
  requesterCompanyId: string;
  requesterName: string;
  amount: number;
  currency: string;
  reason: string;
  tournamentId: string;
  tournamentTitle: string;
  place: number | null;
  status: string;
  transferId: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
  denialReason: string | null;
  createdAt: string;
}

interface Balance {
  currency: string;
  balance: number;
  pending_balance: number;
}

export default function AdminRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [request, setRequest] = useState<PayoutRequest | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [denyReason, setDenyReason] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/payout-requests/${id}`).then((r) => r.json()),
      fetch("/api/admin/balance").then((r) => r.json()),
    ])
      .then(([reqData, balanceData]) => {
        setRequest(reqData.request || null);
        setBalances(balanceData.balances || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    if (!request) return;
    setActing(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/payout-requests/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: request.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setActing(false);
    }
  };

  const handleDeny = async () => {
    if (!request) return;
    setActing(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/payout-requests/deny", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: request.id, reason: denyReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to deny");
    } finally {
      setActing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Request not found.</p>
        <Link href="/admin" className="text-amber-500 hover:text-amber-400 mt-4 inline-block">
          Back to Queue
        </Link>
      </div>
    );
  }

  const usdBalance = balances.find((b) => b.currency === "usd");

  return (
    <div>
      <Link href="/admin" className="group text-text-secondary hover:text-text-primary transition-colors mb-6 inline-flex items-center gap-1">
        <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Queue
      </Link>

      <h1 className="font-display italic text-2xl text-text-primary mb-6">Payout Request</h1>

      {/* Request Details */}
      <div className="card p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-text-tertiary">Requester</p>
            <p className="font-medium text-text-primary">{request.requesterName}</p>
          </div>
          <div>
            <p className="text-sm text-text-tertiary">Amount</p>
            <p className="font-display text-amber-400 font-semibold">${(request.amount / 100).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-text-tertiary">Reason</p>
            <p className="text-text-primary">{request.reason === "tournament_prize" ? "Tournament Prize" : "Organizer Revenue"}</p>
          </div>
          <div>
            <p className="text-sm text-text-tertiary">Tournament</p>
            <p className="text-text-primary">{request.tournamentTitle || "N/A"}</p>
          </div>
          {request.place && (
            <div>
              <p className="text-sm text-text-tertiary">Place</p>
              <p className="text-text-primary">{request.place}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-text-tertiary">Status</p>
            <span className={`badge ${
              request.status === "pending" ? "bg-yellow-900/30 text-yellow-400" :
              request.status === "approved" ? "bg-green-900/30 text-green-400" :
              "bg-red-900/30 text-red-400"
            }`}>
              {request.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-text-tertiary">Submitted</p>
            <p className="text-sm text-text-primary">{new Date(request.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-text-tertiary">Destination Account</p>
            <p className="text-sm font-mono text-text-secondary">{request.requesterCompanyId}</p>
          </div>
        </div>
      </div>

      {/* Platform Balance */}
      {usdBalance && (
        <div className="card p-6 mb-6">
          <p className="text-sm text-text-tertiary mb-1">Platform Balance (USD)</p>
          <p className="font-display text-amber-400 text-2xl font-bold">${(usdBalance.balance / 100).toFixed(2)}</p>
          {usdBalance.pending_balance > 0 && (
            <p className="text-sm text-text-tertiary">Pending: ${(usdBalance.pending_balance / 100).toFixed(2)}</p>
          )}
        </div>
      )}

      {/* Actions */}
      {request.status === "pending" && (
        <div className="space-y-4">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleApprove}
            disabled={acting}
            className="w-full py-3 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] disabled:opacity-50"
          >
            {acting ? "Processing..." : `Approve & Transfer $${(request.amount / 100).toFixed(2)}`}
          </button>

          <div className="flex gap-3">
            <input
              type="text"
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              placeholder="Reason for denial (optional)"
              className="flex-1 px-4 py-3 bg-surface-base border border-border-default rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
            />
            <button
              onClick={handleDeny}
              disabled={acting}
              className="px-6 py-3 bg-red-900/30 text-red-400 border border-red-800/30 rounded-xl hover:bg-red-900/50 transition-colors font-medium disabled:opacity-50"
            >
              Deny
            </button>
          </div>
        </div>
      )}

      {/* Resolution Info */}
      {request.status !== "pending" && (
        <div className="card p-6">
          <p className="text-sm text-text-tertiary mb-2">Resolution</p>
          <p className="font-medium text-text-primary capitalize">{request.status}</p>
          {request.resolvedAt && (
            <p className="text-sm text-text-secondary">{new Date(request.resolvedAt).toLocaleString()}</p>
          )}
          {request.transferId && (
            <p className="text-sm text-text-secondary mt-1">Transfer: <span className="font-mono">{request.transferId}</span></p>
          )}
          {request.denialReason && (
            <p className="text-sm text-red-400 mt-1">Reason: {request.denialReason}</p>
          )}
        </div>
      )}
    </div>
  );
}
