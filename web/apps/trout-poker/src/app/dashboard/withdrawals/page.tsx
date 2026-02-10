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
}

export default function WithdrawalsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [connectedAccount, setConnectedAccount] = useState<ConnectedAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConnectedAccount() {
      if (!user) { setLoading(false); return; }

      try {
        const getResponse = await fetch(`/api/connected-account?userId=${user.id}`);

        if (getResponse.ok) {
          const data = await getResponse.json();
          setConnectedAccount(data.company);
          setLoading(false);
          return;
        }

        if (getResponse.status === 404) {
          const createResponse = await fetch("/api/connected-account", {
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

  if (authLoading || loading) {
    return (
      <div>
        <h1 className="font-display italic text-2xl text-text-primary mb-8">Withdrawals</h1>
        <div className="card p-6">
          <div className="flex items-center justify-center py-12">
            <div className="spinner" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h1 className="font-display italic text-2xl text-text-primary mb-8">Withdrawals</h1>
        <div className="card p-6 text-center py-8">
          <h2 className="font-display italic text-xl text-text-primary mb-2">Sign In Required</h2>
          <p className="text-text-secondary mb-6">Please sign in to access withdrawals.</p>
          <Link
            href="/auth/login?redirect=/dashboard/withdrawals"
            className="inline-flex items-center gap-2 px-6 py-3 bg-creek-600 text-text-inverse rounded-xl hover:bg-creek-500 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="font-display italic text-2xl text-text-primary mb-8">Withdrawals</h1>
        <div className="card p-6 text-center py-8">
          <h2 className="font-display italic text-xl text-red-400 mb-2">Error</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-transparent border border-border-default text-text-primary rounded-xl hover:bg-surface-overlay hover:border-border-strong transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!connectedAccount) {
    return (
      <div>
        <h1 className="font-display italic text-2xl text-text-primary mb-8">Withdrawals</h1>
        <div className="card p-6 text-center py-8">
          <h2 className="font-display italic text-xl text-text-primary mb-2">Setting Up</h2>
          <p className="text-text-secondary mb-6">We&apos;re setting up your payout account. Please refresh.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-creek-600 text-text-inverse rounded-xl hover:bg-creek-500 transition-all duration-200 font-semibold hover:-translate-y-0.5 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3003";

  return (
    <div>
      <h1 className="font-display italic text-2xl text-text-primary mb-6">Withdrawals</h1>

      <Elements appearance={appearance} elements={elements}>
        <PayoutsSession
          token={() =>
            fetch(`/api/payouts/token?companyId=${connectedAccount.id}`)
              .then((res) => res.json())
              .then((data) => data.token)
          }
          companyId={connectedAccount.id}
          redirectUrl={`${appUrl}/dashboard/withdrawals`}
        >
          <div className="space-y-4">
            <BalanceElement
              fallback={
                <div className="flex items-center justify-center h-[100px]">
                  <div className="spinner" />
                </div>
              }
            />

            <WithdrawButtonElement
              fallback={
                <div className="flex items-center justify-center h-[50px]">
                  <div className="spinner" />
                </div>
              }
            />

            <WithdrawalsElement
              fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="spinner" />
                </div>
              }
            />
          </div>
        </PayoutsSession>
      </Elements>
    </div>
  );
}
