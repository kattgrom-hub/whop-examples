"use client";

import { useRouter } from "next/navigation";
import { WhopCheckoutEmbed } from "@whop/checkout/react";

interface WhopEmbeddedCheckoutProps {
  planId: string;
  onSuccess?: () => void;
  redirectUrl?: string;
}

export function WhopEmbeddedCheckout({
  planId,
  onSuccess,
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
    <WhopCheckoutEmbed
      planId={planId}
      onComplete={handleComplete}
      theme="light"
      skipRedirect={true}
      themeOptions={{
        accentColor: "yellow",
        highContrast: false,
      }}
    />
  );
}
