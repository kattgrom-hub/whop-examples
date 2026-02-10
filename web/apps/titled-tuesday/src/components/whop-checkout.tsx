"use client";

import { WhopCheckoutEmbed } from "@whop/checkout/react";

interface WhopEmbeddedCheckoutProps {
  planId: string;
  onSuccess?: () => void;
}

export function WhopEmbeddedCheckout({
  planId,
  onSuccess,
}: WhopEmbeddedCheckoutProps) {
  return (
    <div>
      <WhopCheckoutEmbed
        planId={planId}
        onComplete={() => onSuccess?.()}
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
