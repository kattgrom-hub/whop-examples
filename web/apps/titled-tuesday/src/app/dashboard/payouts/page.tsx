"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  AddPayoutMethodElement,
  Elements,
  PayoutsSession,
  VerifyElement,
} from "@whop/embedded-components-react-js";
import { loadWhopElements } from "@whop/embedded-components-vanilla-js";

const elements = loadWhopElements();

const appearance = {
  theme: {
    appearance: "dark" as const,
    grayColor: "slate" as const,
  },
};

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

interface AccountStatus {
  approvalStatus: string | null;
  verification: {
    status: string;
    errorCode: string | null;
    errorReason: string | null;
  } | null;
  hasPayoutMethod: boolean;
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
  const [connectedAccount, setConnectedAccount] =
    useState<ConnectedAccount | null>(null);
  const [requests, setRequests] = useState<PayoutRequest[]>([]);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fullscreen modal state
  const [showVerify, setShowVerify] = useState(false);
  const [showAddMethod, setShowAddMethod] = useState(false);

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

  const fetchAccountStatus = useCallback(async (companyId: string) => {
    try {
      const res = await fetch(`/api/admin/payout-readiness?companyId=${companyId}`);
      if (res.ok) {
        const data = await res.json();
        setAccountStatus(data);
      }
    } catch {
      // status may not be available yet
    }
  }, []);

  useEffect(() => {
    if (!user || authLoading) {
      setLoading(false);
      return;
    }

    async function init() {
      try {
        const getRes = await fetch(
          `/api/connected-account?userId=${user!.id}`
        );

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
          await Promise.all([
            fetchPayoutMethods(accountData.company.id),
            fetchAccountStatus(accountData.company.id),
          ]);
        }

        const reqRes = await fetch(
          `/api/payout-requests?userId=${user!.id}`
        );
        const reqData = reqRes.ok ? await reqRes.json() : { requests: [] };
        setRequests(reqData.requests || []);
      } catch (err) {
        console.error("Error initializing payouts page:", err);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [user, authLoading, fetchPayoutMethods, fetchAccountStatus]);

  // Poll account status every 5 seconds
  useEffect(() => {
    if (!connectedAccount) return;
    const interval = setInterval(() => {
      fetchAccountStatus(connectedAccount.id);
      fetchPayoutMethods(connectedAccount.id);
    }, 5000);
    return () => clearInterval(interval);
  }, [connectedAccount, fetchAccountStatus, fetchPayoutMethods]);

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

      setSuccess(
        "Payout request submitted! An admin will review it shortly."
      );
      setAmount("");
      setTournamentTitle("");

      const updated = await fetch(
        `/api/payout-requests?userId=${user.id}`
      ).then((r) => r.json());
      setRequests(updated.requests || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div>
        <h1 className="font-display italic text-2xl text-text-primary mb-8">
          Payouts
        </h1>
        <div className="flex items-center justify-center py-20">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h1 className="font-display italic text-2xl text-text-primary mb-8">
          Payouts
        </h1>
        <div className="card p-8 text-center">
          <p className="text-text-secondary">Sign in to manage payouts.</p>
        </div>
      </div>
    );
  }

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5003";

  // Derive KYC status
  const kycOk = accountStatus && (
    accountStatus.approvalStatus === "approved" || accountStatus.approvalStatus === "monitoring"
  ) && (
    !accountStatus.verification || ["verified", "approved"].includes(accountStatus.verification.status)
  );
  const kycStarted = accountStatus && (
    accountStatus.verification || accountStatus.approvalStatus === "pending" ||
    accountStatus.approvalStatus === "approved" || accountStatus.approvalStatus === "monitoring"
  );
  const needsKyc = !kycOk;
  const canAddPayoutMethod = !!kycStarted;
  const kycStatusLabel = (() => {
    if (!accountStatus) return "Loading...";
    if (kycOk) return "Verified";
    if (accountStatus.verification) {
      const s = accountStatus.verification.status;
      if (s === "requires_input" || s === "resubmission_requested") return "Action Required";
      if (s === "processing" || s === "submitted") return "Under Review";
      if (s === "declined" || s === "expired") return "Declined";
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
    if (accountStatus.approvalStatus === "pending") return "Pending";
    if (accountStatus.approvalStatus === "rejected") return "Rejected";
    return "Not Started";
  })();

  return (
    <div>
      <h1 className="font-display italic text-2xl text-text-primary mb-8">
        Payouts
      </h1>

      {connectedAccount ? (
        <Elements appearance={appearance} elements={elements}>
          <PayoutsSession
            token={() =>
              fetch(
                `/api/payouts/token?companyId=${connectedAccount.id}`
              )
                .then((res) => res.json())
                .then((data) => data.token)
            }
            companyId={connectedAccount.id}
            redirectUrl={`${appUrl}/dashboard/payouts`}
          >
            {/* Account Status */}
            <div className="card p-6 mb-6">
              <h2 className="font-display italic text-lg text-text-primary mb-4">
                Account Status
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${kycOk ? "bg-green-400" : "bg-yellow-400"}`} />
                  <div>
                    <p className="font-medium text-text-primary">Identity Verification</p>
                    <p className={`text-sm ${kycOk ? "text-green-400" : "text-yellow-400"}`}>
                      {kycStatusLabel}
                      {accountStatus?.verification?.errorReason && (
                        <span className="text-text-tertiary"> &mdash; {accountStatus.verification.errorReason}</span>
                      )}
                    </p>
                  </div>
                </div>
                {needsKyc && (
                  <button
                    onClick={() => setShowVerify(true)}
                    className="px-4 py-2 bg-amber-600 text-text-inverse rounded-lg hover:bg-amber-500 transition-colors text-sm font-semibold"
                  >
                    Verify Identity
                  </button>
                )}
              </div>
            </div>

            {/* Payout Methods */}
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display italic text-lg text-text-primary">
                  Payout Methods
                </h2>
                <div className="relative group">
                  <button
                    onClick={() => setShowAddMethod(true)}
                    disabled={!canAddPayoutMethod}
                    className="px-4 py-2 bg-surface-overlay text-text-primary border border-border-default rounded-lg hover:bg-surface-elevated hover:border-border-strong transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-surface-overlay disabled:hover:border-border-default"
                  >
                    Add Payout Method
                  </button>
                  {!canAddPayoutMethod && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-surface-elevated border border-border-default rounded-lg text-xs text-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Complete identity verification first
                    </div>
                  )}
                </div>
              </div>
              {payoutMethods.length === 0 ? (
                <p className="text-text-tertiary text-sm">
                  No payout methods yet. Add one to receive payouts.
                </p>
              ) : (
                <div className="space-y-3">
                  {(() => {
                    // Group payout methods by underlying bank account
                    const groups = new Map<string, PayoutMethod[]>();
                    for (const method of payoutMethods) {
                      const key =
                        method.account_reference ||
                        method.institution_name ||
                        method.nickname ||
                        method.id;
                      const group = groups.get(key) || [];
                      group.push(method);
                      groups.set(key, group);
                    }

                    return Array.from(groups.entries()).map(([key, methods]) => {
                      const primary = methods[0];
                      const hasDefault = methods.some((m) => m.is_default);
                      const rails = methods
                        .map((m) => m.destination?.category)
                        .filter((c): c is string => !!c);
                      const isCrypto = rails.length > 0 && rails.every((r) => r === "crypto");
                      const isDigitalWallet = rails.length > 0 && rails.every((r) => r === "digital_wallet");

                      return (
                        <div
                          key={key}
                          className="flex items-center justify-between p-4 bg-surface-overlay rounded-xl border border-border-subtle"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-surface-base flex items-center justify-center text-text-tertiary text-lg">
                              {isCrypto
                                ? "\u20BF"
                                : isDigitalWallet
                                  ? "\u26A1"
                                  : "\u{1F3E6}"}
                            </div>
                            <div>
                              <p className="font-medium text-text-primary">
                                {primary.institution_name ||
                                  primary.nickname ||
                                  categoryLabels[primary.destination?.category || ""] ||
                                  "Payout Method"}
                              </p>
                              <p className="text-sm text-text-tertiary">
                                {primary.account_reference
                                  ? `\u2022\u2022\u2022\u2022 ${primary.account_reference}`
                                  : (categoryLabels[primary.destination?.category || ""] || primary.destination?.category)}
                              </p>
                              {rails.length > 1 && (
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {rails.map((rail) => (
                                    <span
                                      key={rail}
                                      className="text-xs px-2 py-0.5 rounded-md bg-surface-base text-text-tertiary border border-border-subtle"
                                    >
                                      {categoryLabels[rail] || rail}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            {hasDefault && (
                              <span className="badge bg-amber-900/30 text-amber-400 border border-amber-700/30">
                                Default
                              </span>
                            )}
                            <p className="text-xs text-text-tertiary mt-1 uppercase">
                              {primary.currency}
                            </p>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>

            {/* Fullscreen Verify Modal */}
            {showVerify && (
              <div className="fixed inset-0 z-50 bg-surface-base flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-border-subtle shrink-0">
                  <h2 className="font-display italic text-lg text-text-primary">Verify Your Identity</h2>
                  <button
                    onClick={() => setShowVerify(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-overlay transition-colors text-text-tertiary hover:text-text-primary"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="border border-border-default rounded-xl overflow-hidden h-full [&>div]:h-full [&>div>iframe]:h-full">
                    <VerifyElement
                      options={{
                        onVerificationSubmitted: () => {
                          setShowVerify(false);
                          fetchAccountStatus(connectedAccount.id);
                        },
                        onClose: () => {
                          setShowVerify(false);
                        },
                      }}
                      fallback={
                        <div className="flex items-center justify-center h-full">
                          <div className="spinner" />
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Add Payout Method Modal */}
            {showAddMethod && (
              <div className="fixed inset-0 z-50 bg-surface-base flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <div className="h-full [&>div]:h-full [&>div>iframe]:h-full">
                    <AddPayoutMethodElement
                      options={{
                        onComplete: () => {
                          setShowAddMethod(false);
                          fetchPayoutMethods(connectedAccount.id);
                        },
                        onClose: () => {
                          setShowAddMethod(false);
                        },
                      }}
                      fallback={
                        <div className="flex items-center justify-center h-full">
                          <div className="spinner" />
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </PayoutsSession>
        </Elements>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-text-secondary">
            Setting up your account... Please refresh the page.
          </p>
        </div>
      )}

      {/* Request Withdrawal */}
      <div className="card p-6 mb-8">
        <h2 className="font-display italic text-lg text-text-primary mb-4">
          Request a Withdrawal
        </h2>

        {!connectedAccount ? (
          <p className="text-text-secondary">
            Setting up your account... Please refresh the page.
          </p>
        ) : (
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary mb-1">
                Amount (USD)
              </label>
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
              <label className="block text-sm text-text-secondary mb-1">
                Tournament Name (optional)
              </label>
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
      <h2 className="font-display italic text-lg text-text-primary mb-4">
        Your Requests
      </h2>
      {requests.length === 0 ? (
        <p className="text-text-tertiary">No payout requests yet.</p>
      ) : (
        <div className="space-y-3 stagger-children">
          {requests.map((req) => (
            <div key={req.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-text-primary">
                    {req.tournamentTitle || "Tournament"}
                  </p>
                  {req.place && (
                    <p className="text-sm text-text-secondary">
                      {req.place} place
                    </p>
                  )}
                  <p className="text-xs text-text-tertiary">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-amber-400 font-semibold">
                    ${(req.amount / 100).toFixed(2)}
                  </p>
                  <span
                    className={`badge ${
                      req.status === "pending"
                        ? "bg-yellow-900/30 text-yellow-400"
                        : req.status === "approved"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {req.status}
                  </span>
                  {req.denialReason && (
                    <p className="text-xs text-red-400 mt-1">
                      {req.denialReason}
                    </p>
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
