"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Checkout,
  CheckoutElement,
  WhopElements,
} from "@whop/elements-react";
import { loadWhop } from "@whop/elements";

interface WhopEmbeddedCheckoutProps {
  planId: string;
  environment?: "production" | "sandbox";
  onSuccess?: () => void;
  onClose?: () => void;
  redirectUrl?: string;
}

function isPlanId(value: string): boolean {
  return /^plan_[A-Za-z0-9]+$/.test(value);
}

function resolveReturnUrl(value: string, origin: string): string {
  const url = new URL(value, origin);
  const isLocalHttp = url.protocol === "http:" &&
    (url.hostname === "localhost" || url.hostname === "127.0.0.1");

  if (url.protocol !== "https:" && !isLocalHttp) {
    throw new Error("Checkout return URLs must use HTTPS (HTTP is allowed on localhost).");
  }

  return url.toString();
}

/**
 * Hosted Whop Elements checkout. The plan ID selects Whop's server-priced plan;
 * card details stay in Whop's PCI-isolated fields. Fulfill purchases from a
 * verified Whop webhook, never from this browser callback.
 */
export function WhopEmbeddedCheckout({
  planId,
  environment = "sandbox",
  onSuccess,
  onClose,
  redirectUrl,
}: WhopEmbeddedCheckoutProps) {
  const elements = useMemo(() => loadWhop(), []);
  const [returnUrlState, setReturnUrlState] = useState<{
    source: string;
    url?: string;
    error?: string;
  } | null>(null);
  const resolvedReturn = redirectUrl && returnUrlState?.source === redirectUrl
    ? returnUrlState
    : null;
  const returnUrl = resolvedReturn?.url;

  useEffect(() => {
    if (!redirectUrl) {
      setReturnUrlState(null);
      return;
    }

    try {
      setReturnUrlState({
        source: redirectUrl,
        url: resolveReturnUrl(redirectUrl, window.location.origin),
      });
    } catch (error) {
      setReturnUrlState({
        source: redirectUrl,
        error: error instanceof Error ? error.message : "Invalid return URL.",
      });
    }
  }, [redirectUrl]);

  if (!isPlanId(planId)) {
    return <p role="alert">Checkout is unavailable: configure a valid Whop plan ID.</p>;
  }

  if (resolvedReturn?.error) {
    return <p role="alert">{resolvedReturn.error}</p>;
  }

  // Do not mount with a partial config; Checkout options are fixed when its
  // session is created. Waiting also keeps relative return URLs same-origin.
  if (redirectUrl && !resolvedReturn) {
    return <p role="status">Preparing secure checkout…</p>;
  }

  return (
    <section aria-label="Secure checkout" className="space-y-4">
      {onClose && (
        <button type="button" onClick={onClose} className="text-sm underline">
          Close checkout
        </button>
      )}
      <WhopElements elements={elements} environment={environment}>
        <Checkout
          key={`${planId}:${returnUrl ?? ""}`}
          plan={planId}
          {...(returnUrl ? { returnUrl } : {})}
          onComplete={(completion) => {
            if (completion.result === "payment") onSuccess?.();
          }}
        >
          <CheckoutElement />
        </Checkout>
      </WhopElements>
    </section>
  );
}
