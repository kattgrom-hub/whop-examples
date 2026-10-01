"use client";

import { useEffect, useRef, useState } from "react";

interface WhopElementsCheckoutProps {
  planId: string;
  accountId: string;
  orderToken: string;
  onSuccess: (paymentId: string) => void;
}

type PaymentState =
  | "requires_confirmation"
  | "requires_action"
  | "requires_capture"
  | "confirming"
  | "processing"
  | "succeeded"
  | "canceled";

import { loadWhopElements, type PaymentsHandle, type MountedElement } from "@/lib/whop-elements";

export function WhopElementsCheckout({
  planId,
  accountId,
  orderToken,
  onSuccess,
}: WhopElementsCheckoutProps) {
  const paymentsRef = useRef<PaymentsHandle | null>(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let payments: PaymentsHandle | null = null;
    const mounted: MountedElement[] = [];

    const boot = async () => {
      try {
        const WhopElements = await loadWhopElements();
        if (cancelled) return;

        const environment =
          (process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT as
            | "sandbox"
            | "production") || "production";

        const whop = WhopElements({
          environment,
          locale: "en",
          appearance: {
            theme: {
              appearance: "light",
              accentColor: "yellow",
            },
          },
        });

        payments = whop.payments.create({
          accountId,
          plan: planId,
          returnUrl: `${window.location.origin}/checkout?planId=${encodeURIComponent(
            planId
          )}`,
        });

        const email = payments.create("email");
        const address = payments.create("address");
        const payment = payments.create("payment", {
          onChange: (state: { complete?: boolean }) => {
            setReady(Boolean(state.complete));
          },
        });
        const branding = payments.create("branding");

        email.mount("#whop-email");
        address.mount("#whop-address");
        payment.mount("#whop-payment");
        branding.mount("#whop-branding");

        mounted.push(email, address, payment, branding);
        paymentsRef.current = payments;
        setLoaded(true);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load secure payment form"
          );
        }
      }
    };

    void boot();

    return () => {
      cancelled = true;
      paymentsRef.current = null;
      for (const element of mounted) element.destroy?.();
      payments?.destroy?.();
    };
  }, [accountId, planId]);

  const getStatus = async (paymentId: string) => {
    const response = await fetch("/api/payments/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId, orderToken }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Unable to verify payment");
    }

    return data.status as PaymentState;
  };

  const waitForResult = async (paymentId: string) => {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const status = await getStatus(paymentId);

      if (status === "succeeded") return true;
      if (status === "canceled" || status === "requires_confirmation") {
        return false;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error(
      "Your payment is still processing. Please check again in a moment."
    );
  };

  const handleSubmit = async () => {
    const payments = paymentsRef.current;
    if (!payments || !ready || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const token = await payments.createConfirmationToken();

      const response = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmationToken: token.confirmationToken,
          orderToken,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to confirm payment");
      }

      let status = data.status as PaymentState;

      if (status === "requires_action") {
        if (!data.clientSecret) {
          throw new Error("Payment needs additional verification");
        }

        await payments.handleNextAction({
          clientSecret: data.clientSecret,
        });

        status = await getStatus(data.paymentId);
      }

      if (status === "succeeded" || (await waitForResult(data.paymentId))) {
        sessionStorage.setItem(
          `dropify:payment:${data.paymentId}`,
          orderToken
        );
        onSuccess(data.paymentId);
        return;
      }

      throw new Error("Payment was not completed. Please try again.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment could not be completed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div id="whop-email" />
      <div id="whop-address" />
      <div id="whop-payment" />
      <div id="whop-branding" />

      {!loaded && !error && (
        <p className="text-center text-xs font-light text-secondary">
          Loading secure payment form...
        </p>
      )}

      {error && (
        <p className="text-center text-xs font-light text-red-500">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!loaded || !ready || submitting}
        className="w-full bg-gold py-3.5 text-sm font-medium tracking-wide text-primary rounded-sm transition-all duration-500 hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Confirming payment..." : "Pay securely"}
      </button>
    </div>
  );
}
