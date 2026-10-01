"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { WhopElementsCheckout } from "@/components/whop-checkout";
import { useCart } from "@/components/CartContext";

function VerifiedSuccess({
  paymentId,
  orderToken,
}: {
  paymentId: string;
  orderToken: string;
}) {
  const { clearCart } = useCart();
  const [state, setState] = useState<"checking" | "paid" | "error">("checking");

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      try {
        const response = await fetch("/api/payments/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentId, orderToken }),
        });

        const data = await response.json();

        if (!cancelled && response.ok && data.status === "succeeded") {
          clearCart();
          sessionStorage.removeItem(`dropify:payment:${paymentId}`);
          setState("paid");
          return;
        }

        if (!cancelled) setState("error");
      } catch {
        if (!cancelled) setState("error");
      }
    };

    void verify();

    return () => {
      cancelled = true;
    };
  }, [clearCart, orderToken, paymentId]);

  if (state === "checking") {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <Loader2 size={30} className="animate-spin text-gold mb-5" />
        <h1 className="text-2xl font-extralight tracking-tight text-primary">
          Verifying your payment
        </h1>
        <p className="mt-3 text-sm font-light text-secondary">
          We&apos;re confirming the payment with Whop.
        </p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <h1 className="text-2xl font-extralight tracking-tight text-primary">
          Payment not verified
        </h1>
        <p className="mt-3 text-sm font-light text-secondary max-w-md">
          We couldn&apos;t verify this payment as completed. Your cart has not
          been cleared.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 text-sm font-light text-secondary transition-colors duration-400 hover:text-primary"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
      <CheckCircle2
        size={48}
        strokeWidth={1}
        className="text-gold mb-6"
      />
      <h1 className="text-2xl font-extralight tracking-tight text-primary">
        Thank you for your order
      </h1>
      <p className="mt-3 text-sm font-light text-secondary max-w-md">
        Your payment has been verified. You&apos;ll receive your Whop payment
        confirmation separately.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 text-sm font-light text-secondary transition-colors duration-400 hover:text-primary"
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Continue shopping
      </Link>
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const planId = searchParams.get("planId");
  const paymentId = searchParams.get("paymentId");
  const [orderToken, setOrderToken] = useState<string | null>(null);

  useEffect(() => {
    if (paymentId) {
      setOrderToken(sessionStorage.getItem(`dropify:payment:${paymentId}`));
      return;
    }

    if (planId) {
      setOrderToken(sessionStorage.getItem(`dropify:checkout:${planId}`));
    }
  }, [paymentId, planId]);

  if (paymentId) {
    if (!orderToken) {
      return (
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <h1 className="text-2xl font-extralight tracking-tight text-primary">
            Unable to verify this order
          </h1>
          <p className="mt-3 text-sm font-light text-secondary">
            This browser does not have the checkout verification token.
          </p>
        </div>
      );
    }

    return <VerifiedSuccess paymentId={paymentId} orderToken={orderToken} />;
  }

  if (!planId) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
        <h1 className="text-2xl font-extralight tracking-tight text-primary">
          No checkout in progress
        </h1>
        <p className="mt-3 text-sm font-light text-secondary">
          Add items to your cart to begin checkout.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center gap-2 text-sm font-light text-secondary transition-colors duration-400 hover:text-primary"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to shop
        </Link>
      </div>
    );
  }

  if (!orderToken) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-sm font-light text-secondary">
          Loading secure checkout...
        </div>
      </div>
    );
  }

  const accountId = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID;

  if (!accountId) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-sm font-light text-red-500">
          Checkout is not configured.
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 py-12 md:py-20">
      <div className="mx-auto max-w-lg">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-light text-secondary transition-colors duration-400 hover:text-primary mb-8"
        >
          <ArrowLeft size={14} strokeWidth={1.5} />
          Back to shop
        </Link>

        <h1 className="text-2xl font-extralight tracking-tight text-primary mb-8">
          Complete your order
        </h1>

        <WhopElementsCheckout
          planId={planId}
          accountId={accountId}
          orderToken={orderToken}
          onSuccess={(verifiedPaymentId) => {
            sessionStorage.removeItem(`dropify:checkout:${planId}`);
            router.replace(
              `/checkout?paymentId=${encodeURIComponent(verifiedPaymentId)}`
            );
          }}
        />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-32">
          <div className="text-sm font-light text-secondary">
            Loading checkout...
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
