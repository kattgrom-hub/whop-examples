"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { WhopEmbeddedCheckout } from "@/components/whop-checkout";
import { useCart } from "@/components/CartContext";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const checkoutConfigurationId = searchParams.get("checkoutConfigurationId");
  const status = searchParams.get("status");
  const { clearCart } = useCart();

  const paymentSucceeded = status === "success" || status === "succeeded";

  useEffect(() => {
    if (paymentSucceeded) {
      clearCart();
    }
  }, [clearCart, paymentSucceeded]);

  // Success state after Whop confirms checkout completion
  if (paymentSucceeded) {
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
          Your candles are being prepared with care. You&apos;ll receive a
          confirmation email shortly.
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

  // No Whop checkout target — user navigated here directly
  if (!planId && !checkoutConfigurationId) {
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

  // Active checkout
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

        <WhopEmbeddedCheckout
          planId={planId ?? undefined}
          checkoutConfigurationId={checkoutConfigurationId ?? undefined}
          redirectUrl="/checkout?status=success"
        />

        <p className="mt-6 text-center text-[11px] font-light text-neutral-400">
          Payments powered by Whop
        </p>
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
