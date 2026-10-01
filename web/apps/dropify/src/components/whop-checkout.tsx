"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type WhopEnvironment = "sandbox" | "production";

type CheckoutHandle = {
  create: (name: "checkout") => {
    mount: (target: string | HTMLElement) => void;
  };
  destroy?: () => void;
};

type WhopElementsRoot = {
  checkout: {
    create: (options: {
      plan?: string;
      checkoutConfiguration?: string;
      returnUrl: string;
      onComplete?: () => void;
    }) => CheckoutHandle;
  };
};

declare global {
  interface Window {
    WhopElements?: (options?: {
      environment?: WhopEnvironment;
    }) => WhopElementsRoot;
  }
}

interface WhopEmbeddedCheckoutProps {
  planId?: string;
  checkoutConfigurationId?: string;
  redirectUrl?: string;
}

const WHOP_ELEMENTS_SRC = "https://cdn.whop.com/elements/amber/elements.js";

export function WhopEmbeddedCheckout({
  planId,
  checkoutConfigurationId,
  redirectUrl = "/checkout?status=success",
}: WhopEmbeddedCheckoutProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const environment =
    (process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT as WhopEnvironment) ||
    "production";

  useEffect(() => {
    if (!planId && !checkoutConfigurationId) return;

    let cancelled = false;
    let checkout: CheckoutHandle | null = null;

    const mountCheckout = () => {
      if (cancelled) return;

      const createWhop = window.WhopElements;
      const target = document.getElementById("whop-elements-checkout");

      if (!createWhop || !target) {
        setError("Whop Elements could not be loaded. Please refresh and try again.");
        return;
      }

      try {
        const restoreUrl = new URL("/checkout", window.location.origin);
        if (checkoutConfigurationId) {
          restoreUrl.searchParams.set(
            "checkoutConfigurationId",
            checkoutConfigurationId
          );
        } else if (planId) {
          restoreUrl.searchParams.set("planId", planId);
        }

        const whop = createWhop({ environment });

        checkout = whop.checkout.create({
          ...(checkoutConfigurationId
            ? { checkoutConfiguration: checkoutConfigurationId }
            : { plan: planId }),
          returnUrl: restoreUrl.toString(),
          onComplete: () => {
            const destination = new URL(redirectUrl, window.location.origin);
            router.replace(
              `${destination.pathname}${destination.search}${destination.hash}`
            );
          },
        });

        checkout.create("checkout").mount(target);
      } catch (checkoutError) {
        console.error("Failed to mount Whop Elements checkout:", checkoutError);
        setError("Checkout is temporarily unavailable. Please try again.");
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      "script[data-whop-elements]"
    );

    if (window.WhopElements) {
      mountCheckout();
    } else if (existingScript) {
      existingScript.addEventListener("load", mountCheckout, { once: true });
      existingScript.addEventListener(
        "error",
        () => setError("Whop Elements failed to load. Please try again."),
        { once: true }
      );
    } else {
      const script = document.createElement("script");
      script.src = WHOP_ELEMENTS_SRC;
      script.async = true;
      script.setAttribute("data-whop-elements", "");
      script.addEventListener("load", mountCheckout, { once: true });
      script.addEventListener(
        "error",
        () => setError("Whop Elements failed to load. Please try again."),
        { once: true }
      );
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      checkout?.destroy?.();
    };
  }, [checkoutConfigurationId, environment, planId, redirectUrl, router]);

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-sm border border-red-200 bg-red-50 px-4 py-4 text-sm font-light text-red-700"
      >
        {error}
      </div>
    );
  }

  return (
    <div
      id="whop-elements-checkout"
      className="min-h-[360px] w-full"
      aria-label="Whop checkout"
    />
  );
}
