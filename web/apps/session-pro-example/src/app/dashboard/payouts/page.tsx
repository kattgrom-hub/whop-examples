"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

/**
 * Mock Payouts Page
 *
 * In production, this page shows real payout data including:
 * - Current balance
 * - Withdraw button
 * - Withdrawal history
 *
 * This demo version shows mock payout data.
 */

interface ConnectedAccount {
  id: string;
  title: string;
  route: string;
}

// Mock withdrawal history
const MOCK_WITHDRAWALS = [
  {
    id: "w_1",
    amount: 450.0,
    status: "completed",
    date: "2025-01-28",
    method: "Bank Transfer",
  },
  {
    id: "w_2",
    amount: 325.5,
    status: "completed",
    date: "2025-01-15",
    method: "Bank Transfer",
  },
  {
    id: "w_3",
    amount: 200.0,
    status: "completed",
    date: "2025-01-02",
    method: "Bank Transfer",
  },
];

export default function PayoutsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [connectedAccount, setConnectedAccount] = useState<ConnectedAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Mock balance
  const mockBalance = 1234.56;

  useEffect(() => {
    async function fetchConnectedAccount() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // First try to get existing connected account
        const getResponse = await fetch(`/api/coach/connected-account?userId=${user.id}`);

        if (getResponse.ok) {
          const data = await getResponse.json();
          setConnectedAccount(data.company);
          setLoading(false);
          return;
        }

        // If not found (404), create one
        if (getResponse.status === 404) {
          const createResponse = await fetch("/api/coach/connected-account", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              email: user.email,
              name: user.name || user.username,
            }),
          });

          if (createResponse.ok) {
            const data = await createResponse.json();
            setConnectedAccount(data.company);
          } else {
            const errorData = await createResponse.json();
            setError(errorData.error || "Failed to create payout account");
          }
        } else {
          const errorData = await getResponse.json();
          setError(errorData.error || "Failed to fetch payout account");
        }
      } catch (err) {
        console.error("Error fetching connected account:", err);
        setError("Failed to load payout information");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchConnectedAccount();
    }
  }, [user, authLoading]);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    console.log("💸 [Demo] Initiating withdrawal...");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    alert("Demo mode: Withdrawal would be processed through the payment system!");
    setIsWithdrawing(false);
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">Payouts</h1>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">Payouts</h1>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-gray-400 mb-6">
              Please sign in to access your payout dashboard.
            </p>
            <Link
              href="/auth/login?redirect=/dashboard/payouts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">Payouts</h1>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2 text-red-400">Error</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No connected account (shouldn't happen if creation succeeded)
  if (!connectedAccount) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">Payouts</h1>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="text-xl font-semibold mb-2">Setting Up Payouts</h2>
            <p className="text-gray-400 mb-6">
              We&apos;re setting up your payout account. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success - show mock payout dashboard
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payouts</h1>

      {/* Demo Mode Banner */}
      <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 text-green-300">
          <span className="text-xl">💰</span>
          <span className="font-medium">Demo Mode</span>
        </div>
        <p className="text-sm text-gray-400 mt-1">
          This is demo data. In production, coaches can track and withdraw their actual earnings here.
        </p>
      </div>

      <div className="space-y-4">
        {/* Balance Card */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Available Balance</p>
              <p className="text-4xl font-bold text-green-400">
                ${mockBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Demo data
              </p>
            </div>
            <div className="text-6xl">💵</div>
          </div>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={isWithdrawing}
          className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isWithdrawing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <span>🏦</span>
              Withdraw Funds (Demo)
            </>
          )}
        </button>

        {/* Withdrawal History */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>📋</span>
            Withdrawal History
          </h2>

          <div className="space-y-3">
            {MOCK_WITHDRAWALS.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"
              >
                <div>
                  <p className="font-medium text-white">
                    ${withdrawal.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-gray-500">{withdrawal.date}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                    {withdrawal.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">{withdrawal.method}</p>
                </div>
              </div>
            ))}
          </div>

          {MOCK_WITHDRAWALS.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No withdrawals yet</p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
          <p className="text-sm text-gray-500 text-center">
            🔒 In production, this handles secure payouts to your bank account or PayPal.
          </p>
        </div>
      </div>
    </div>
  );
}
