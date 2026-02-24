"use client";

import { useRouter } from "next/navigation";
import { WhopCheckoutEmbed } from "@whop/checkout/react";

interface WhopEmbeddedCheckoutProps {
  planId: string;
  onSuccess?: () => void;
  onClose?: () => void;
  redirectUrl?: string;
}

/**
 * Whop Embedded Checkout Component
 *
 * Renders the Whop checkout form directly on the page using the official React component
 */
export function WhopEmbeddedCheckout({
  planId,
  onSuccess,
  onClose,
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
    <div>
      <WhopCheckoutEmbed
        planId={planId}
        onComplete={handleComplete}
        environment={environment}
        theme="dark"
        skipRedirect={true}
        themeOptions={{
          accentColor: "blue",
          highContrast: false,
        }}
      />
    </div>
  );
}
