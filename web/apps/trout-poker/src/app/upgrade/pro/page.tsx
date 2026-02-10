"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function UpgradeContent() {
  const searchParams = useSearchParams();
  const billing = searchParams.get("billing") || "monthly";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/organizer/plans?billing=${billing}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [billing]);

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="font-display italic text-xl text-red-400 mb-2">Error</h1>
          <p className="text-text-secondary">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="spinner-lg spinner mx-auto mb-4"></div>
        <h1 className="font-display italic text-xl text-text-primary mb-2">Redirecting to Whop Checkout...</h1>
        <p className="text-text-secondary">Upgrading to Pro ({billing})</p>
      </div>
    </div>
  );
}

export default function UpgradeProPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="spinner" />
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  );
}
