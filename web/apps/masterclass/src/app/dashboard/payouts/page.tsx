"use client";

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

export default function PayoutsPage() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">Payouts</h1>
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6">
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 spinner-red rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">Payouts</h1>
        <div className="bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-6">
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
            <p className="text-gray-400 mb-6">
              Please sign in to access your payout dashboard.
            </p>
            <Link
              href="/auth/login?redirect=/dashboard/payouts"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E53935] text-white rounded-lg hover:bg-[#C62828] transition-colors font-semibold"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payouts</h1>

      <Elements appearance={appearance} elements={elements}>
        <PayoutsSession
          token={() =>
            fetch(`/api/payouts/token?companyId=${user.companyId}`)
              .then((res) => res.json())
              .then((data) => data.token)
          }
          companyId={user.companyId}
          redirectUrl={`${appUrl}/dashboard/payouts`}
        >
          <div className="space-y-4">
            <BalanceElement
              fallback={
                <div className="flex items-center justify-center h-[100px]">
                  <div className="w-6 h-6 border-2 spinner-red rounded-full animate-spin" />
                </div>
              }
            />

            <WithdrawButtonElement
              fallback={
                <div className="flex items-center justify-center h-[50px]">
                  <div className="w-6 h-6 border-2 spinner-red rounded-full animate-spin" />
                </div>
              }
            />

            <WithdrawalsElement
              fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 spinner-red rounded-full animate-spin" />
                </div>
              }
            />
          </div>
        </PayoutsSession>
      </Elements>
    </div>
  );
}
