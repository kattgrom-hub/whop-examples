"use client";

import { useState } from "react";
import {
  AddressElement,
  BrandingElement,
  EmailElement,
  PaymentElement,
  Payments,
  WhopElements,
  usePayments,
} from "@whop/elements-react";
import { loadWhop } from "@whop/elements";

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

function PaymentForm({
  planId,
  accountId,
  orderToken,
  onSuccess,
}: WhopElementsCheckoutProps) {
  const payments = usePayments();
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <Payments
      accountId={accountId}
      plan={planId}
      returnUrl={
        typeof window === "undefined"
          ? undefined
          : `${window.location.origin}/checkout?planId=${encodeURIComponent(
              planId
            )}`
      }
    >
      <div className="space-y-5">
        <EmailElement />
        <AddressElement />
        <PaymentElement
          onChange={(state) => setReady(Boolean(state.complete))}
        />
        <BrandingElement />

        {error && (
          <p className="text-center text-xs font-light text-red-500">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!ready || submitting}
          className="w-full bg-gold py-3.5 text-sm font-medium tracking-wide text-primary rounded-sm transition-all duration-500 hover:bg-gold-hover disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Confirming payment..." : "Pay securely"}
        </button>
      </div>
    </Payments>
  );
}

export function WhopElementsCheckout(props: WhopElementsCheckoutProps) {
  const elements = typeof window === "undefined" ? null : loadWhop();
  const environment =
    (process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT as "sandbox" | "production") ||
    "production";

  return (
    <WhopElements
      elements={elements}
      environment={environment}
      locale="en"
      appearance={{
        theme: {
          appearance: "light",
          accentColor: "yellow",
        },
      }}
    >
      <PaymentForm {...props} />
    </WhopElements>
  );
}
