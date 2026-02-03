"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import {
  BalanceElement,
  Elements,
  PayoutsSession,
  WithdrawButtonElement,
  WithdrawalsElement,
} from "@whop/embedded-components-react-js";
import { loadWhopElements } from "@whop/embedded-components-vanilla-js";

const elements = loadWhopElements();

const appearance = {
  theme: {
    appearance: "dark" as const,
    grayColor: "slate" as const,
  },
};

interface ConnectedAccount {
  id: string;
  title: string;
  route: string;
}

export default function PayoutsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [connectedAccount, setConnectedAccount] = useState<ConnectedAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Success - show embedded payout components
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payouts</h1>

      <Elements appearance={appearance} elements={elements}>
        <PayoutsSession
          token={() =>
            fetch(`/api/payouts/token?companyId=${connectedAccount.id}`)
              .then((res) => res.json())
              .then((data) => data.token)
          }
          companyId={connectedAccount.id}
          redirectUrl={`${appUrl}/dashboard/payouts`}
        >
          <div className="space-y-4">
            <BalanceElement
              fallback={
                <div className="flex items-center justify-center h-[100px]">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            />

            <WithdrawButtonElement
              fallback={
                <div className="flex items-center justify-center h-[50px]">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            />

            <WithdrawalsElement
              fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              }
            />
          </div>
        </PayoutsSession>
      </Elements>
    </div>
  );
}
