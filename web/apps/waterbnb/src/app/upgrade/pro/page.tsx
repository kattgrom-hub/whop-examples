"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

type Status = "loading" | "error";

export default function UpgradeProPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/auth/login?redirect=/upgrade/pro");
      return;
    }

    let cancelled = false;

    async function redirectToCheckout() {
      try {
        const checkoutRes = await fetch("/api/host-plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: "pro", billing: "monthly" }),
        });

        if (!checkoutRes.ok) {
          throw new Error("Failed to get checkout URL");
        }

        const data = await checkoutRes.json();
        if (!data.checkoutUrl) {
          throw new Error("No checkout URL returned");
        }

        if (cancelled) return;

        window.location.href = data.checkoutUrl;
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      }
    }

    redirectToCheckout();
    return () => { cancelled = true; };
  }, [user?.id, authLoading, isAuthenticated, router]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#222222] mb-2">Something went wrong</h1>
          <p className="text-[#717171] mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setStatus("loading");
                setError("");
                window.location.reload();
              }}
              className="px-4 py-2 bg-[#FF385C] text-white rounded-lg hover:bg-[#D70466] transition-colors text-sm font-semibold"
            >
              Try Again
            </button>
            <Link
              href="/dashboard"
              className="px-4 py-2 bg-[#F7F7F7] text-[#222222] rounded-lg hover:bg-[#EBEBEB] transition-colors text-sm font-medium border border-[#DDDDDD]"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-8 h-8 border-2 spinner-airbnb rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#717171]">Setting up your Pro account...</p>
      </div>
    </div>
  );
}
