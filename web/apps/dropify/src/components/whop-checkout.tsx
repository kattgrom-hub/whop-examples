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

  const environment =
    (process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT as "sandbox" | "production") ||
    "production";

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
      environment={environment}
      theme="light"
      skipRedirect={true}
      themeOptions={{
        accentColor: "yellow",
        highContrast: false,
      }}
    />
  );
}
