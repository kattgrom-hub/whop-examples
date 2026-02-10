"use client";

import { useState } from "react";

interface HostedPayoutButtonProps {
  companyId: string;
  useCase?: "payouts_portal" | "account_onboarding";
  children: React.ReactNode;
  className?: string;
}

export function HostedPayoutButton({
  companyId,
  useCase = "payouts_portal",
  children,
  className = "",
}: HostedPayoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/payouts/portal?companyId=${companyId}&useCase=${useCase}`
      );
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Failed to get portal URL:", data.error);
        setError(data.error || "Failed to open payout portal. Please try again.");
      }
    } catch (err) {
      console.error("Error opening portal:", err);
      setError("Failed to open payout portal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleClick} disabled={loading} className={className}>
        {loading ? "Opening..." : children}
      </button>
      {error && (
        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
