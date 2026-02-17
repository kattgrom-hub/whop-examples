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
    appearance: "light" as const,
    grayColor: "slate" as const,
  },
};

export default function PayoutsPage() {
  const { user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 spinner-ocean rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>Sign in required</h2>
          <p className="text-[#717171] mb-6">
            Please sign in to access your earnings dashboard.
          </p>
          <Link
            href="/auth/login?redirect=/dashboard/payouts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF385C] text-[#222222] rounded-lg hover:bg-[#D70466] transition-colors font-semibold"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:5002";

  return (
    <div className="space-y-6">
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
            <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-6">
              <BalanceElement
                fallback={
                  <div className="flex items-center justify-center h-[100px]">
                    <div className="w-6 h-6 border-2 spinner-ocean rounded-full animate-spin" />
                  </div>
                }
              />
            </div>

            <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-6">
              <WithdrawButtonElement
                fallback={
                  <div className="flex items-center justify-center h-[50px]">
                    <div className="w-6 h-6 border-2 spinner-ocean rounded-full animate-spin" />
                  </div>
                }
              />
            </div>

            <div className="bg-[#F7F7F7] rounded-xl border border-[#DDDDDD] p-6">
              <h3 className="text-sm font-medium text-[#717171] uppercase tracking-wide mb-4">Withdrawal history</h3>
              <WithdrawalsElement
                fallback={
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 spinner-ocean rounded-full animate-spin" />
                  </div>
                }
              />
            </div>
          </div>
        </PayoutsSession>
      </Elements>
    </div>
  );
}
