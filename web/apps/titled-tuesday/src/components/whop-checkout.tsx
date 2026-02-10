"use client";

import { useRouter } from "next/navigation";
import { WhopCheckoutEmbed } from "@whop/checkout/react";

interface WhopEmbeddedCheckoutProps {
  planId: string;
  onSuccess?: () => void;
  onClose?: () => void;
  redirectUrl?: string;
}

export function WhopEmbeddedCheckout({
  planId,
  onSuccess,
  onClose,
  redirectUrl,
}: WhopEmbeddedCheckoutProps) {
  const router = useRouter();

  const handleComplete = (completedPlanId: string, receiptId?: string) => {
    console.log("Checkout complete:", { planId: completedPlanId, receiptId });
    onSuccess?.();
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  return (
    <div>
      <WhopCheckoutEmbed
        planId={planId}
        onComplete={handleComplete}
        theme="dark"
        skipRedirect={true}
        themeOptions={{
          accentColor: "gold",
          highContrast: false,
        }}
      />
    </div>
  );
}
