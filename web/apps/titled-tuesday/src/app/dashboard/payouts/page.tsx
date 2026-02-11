"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface PayoutRequest {
  id: string;
  amount: number;
  reason: string;
  tournamentId: string;
  tournamentTitle: string;
  place: number | null;
  status: string;
  transferId: string | null;
  denialReason: string | null;
  createdAt: string;
}

interface ConnectedAccount {
  id: string;
  metadata: Record<string, string>;
}

interface PayoutMethod {
  id: string;
  nickname: string | null;
  currency: string;
  is_default: boolean;
  account_reference: string | null;
  institution_name: string | null;
  destination: {
    category: string;
    country_code: string;
    name: string;
  } | null;
}

const categoryLabels: Record<string, string> = {
  crypto: "Crypto",
  rtp: "Instant Transfer",
  next_day_bank: "Bank (Next Day)",
  bank_wire: "Bank Wire",
  digital_wallet: "Digital Wallet",
};

export default function PayoutsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [connectedAccount, setConnectedAccount] = useState<ConnectedAccount | null>(null);
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state for new request
  const [amount, setAmount] = useState("");
  const [tournamentTitle, setTournamentTitle] = useState("");

  const fetchPayoutMethods = useCallback(async (companyId: string) => {
    try {
      const res = await fetch(`/api/payout-methods?companyId=${companyId}`);
      if (res.ok) {
        const data = await res.json();
        setPayoutMethods(data.methods || []);
      }
    } catch {
      // payout methods may not be available yet
    }
  }, []);

  useEffect(() => {
    if (!user || authLoading) { setLoading(false); return; }

    async function init() {
      try {
        const getRes = await fetch(`/api/connected-account?userId=${user!.id}`);

        let accountData = null;
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
          if (createRes.ok) {
            accountData = await createRes.json();
          }
        }

        if (accountData?.company) {
          setConnectedAccount(accountData.company);
          await fetchPayoutMethods(accountData.company.id);
        }

        const reqRes = await fetch(`/api/payout-requests?userId=${user!.id}`);
        const reqData = reqRes.ok ? await reqRes.json() : { requests: [] };
        setRequests(reqData.requests || []);
      } catch (err) {
        console.error("Error initializing payouts page:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [user, authLoading, fetchPayoutMethods]);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !connectedAccount) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const amountCents = Math.round(parseFloat(amount) * 100);
      if (isNaN(amountCents) || amountCents <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const res = await fetch("/api/payout-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterId: user.id,
          requesterCompanyId: connectedAccount.id,
          requesterName: user.name || user.username,
          amount: amountCents,
          reason: "payout",
          tournamentTitle: tournamentTitle || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess("Payout request submitted! An admin will review it shortly.");
      setAmount("");
      setTournamentTitle("");

      const updated = await fetch(`/api/payout-requests?userId=${user.id}`).then((r) => r.json());
      setRequests(updated.requests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div>
        <h1 className="font-display italic text-2xl text-text-primary mb-8">Payouts</h1>
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h1 className="font-display italic text-2xl text-text-primary mb-8">Payouts</h1>
        <div className="card p-8 text-center">
          <p className="text-text-secondary">Sign in to manage payouts.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display italic text-2xl text-text-primary mb-8">Payouts</h1>

      {/* Payout Methods */}
      {connectedAccount && (
        <div className="card p-6 mb-8">
          <h2 className="font-display italic text-lg text-text-primary mb-4">Your Payout Methods</h2>

          {payoutMethods.length > 0 ? (
            <div className="space-y-3 mb-6">
              {payoutMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-surface-overlay rounded-xl border border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-base flex items-center justify-center text-text-tertiary text-lg">
                      {method.destination?.category === "crypto" ? "\u20BF" :
                       method.destination?.category === "digital_wallet" ? "\u26A1" : "\u{1F3E6}"}
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {method.institution_name || method.nickname || categoryLabels[method.destination?.category || ""] || "Payout Method"}
                      </p>
                      <p className="text-sm text-text-tertiary">
                        {method.account_reference && `\u2022\u2022\u2022\u2022 ${method.account_reference}`}
                        {!method.account_reference && (categoryLabels[method.destination?.category || ""] || method.destination?.category)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {method.is_default && (
                      <span className="badge bg-amber-900/30 text-amber-400 border border-amber-700/30">Default</span>
                    )}
                    <p className="text-xs text-text-tertiary mt-1 uppercase">{method.currency}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-text-tertiary mb-3">No payout methods added yet.</p>
              <button
                onClick={async () => {
                  const res = await fetch(`/api/payouts/portal?companyId=${connectedAccount.id}`);
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                }}
                className="px-5 py-2.5 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
              >
                Manage Payouts
              </button>
            </div>
          )}

        </div>
      )}

      {/* Submit Payout Request */}
      <div className="card p-6 mb-8">
        <h2 className="font-display italic text-lg text-text-primary mb-4">Submit Payout Request</h2>

        {!connectedAccount ? (
          <p className="text-text-secondary">Setting up your account... Please refresh the page.</p>
        ) : (
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">Amount (USD)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full px-4 py-3 bg-surface-base border border-border-default rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
              />
            </div>
            <div>
              <label className="block text-sm text-text-secondary mb-1">Tournament Name (optional)</label>
              <input
                type="text"
                value={tournamentTitle}
                onChange={(e) => setTournamentTitle(e.target.value)}
                placeholder="e.g. Weekly Blitz Arena"
                className="w-full px-4 py-3 bg-surface-base border border-border-default rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/30"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-amber-400 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-amber-600 text-text-inverse rounded-xl hover:bg-amber-500 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>

      {/* Request History */}
      <h2 className="font-display italic text-lg text-text-primary mb-4">Your Requests</h2>
      {requests.length === 0 ? (
        <p className="text-text-tertiary">No payout requests yet.</p>
      ) : (
        <div className="space-y-3 stagger-children">
          {requests.map((req) => (
            <div key={req.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">{req.tournamentTitle || "Tournament"}</p>
                  {req.place && <p className="text-sm text-text-secondary">{req.place} place</p>}
                  <p className="text-xs text-text-tertiary">{new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-amber-400 font-semibold">${(req.amount / 100).toFixed(2)}</p>
                  <span className={`badge ${
                    req.status === "pending" ? "bg-yellow-900/30 text-yellow-400" :
                    req.status === "approved" ? "bg-green-900/30 text-green-400" :
                    "bg-red-900/30 text-red-400"
                  }`}>
                    {req.status}
                  </span>
                  {req.denialReason && (
                    <p className="text-xs text-red-400 mt-1">{req.denialReason}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
