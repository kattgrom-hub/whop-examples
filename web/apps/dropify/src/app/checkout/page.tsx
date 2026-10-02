"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { WhopEmbeddedCheckout } from "@/components/whop-checkout";
import { useCart } from "@/components/CartContext";

type OrderState = { orderId: string; status: "pending" | "paid" | "review"; paymentId: string | null; planId: string | null; checkoutConfigurationId: string | null };
function CheckoutContent() {
  const search = useSearchParams();
  const orderId = search.get("orderId");
  const outcome = search.get("status");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [returned, setReturned] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [retry, setRetry] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [completion, setCompletion] = useState<{ paymentId: string; sessionId: string } | null>(null);
  const onComplete = useCallback((paymentId: string, sessionId: string) => {
    setCompletion({ paymentId, sessionId });
    setConfirming(true);
    setRefresh(n => n + 1);
  }, []);
  useEffect(() => {
    setOrder(null); setError(null); setRetry(false); setCompletion(null);
    // A return can still be processing or require another provider step.
    // Never reopen payment collection while that attempt may settle.
    setConfirming(outcome !== null && outcome !== "failed" && outcome !== "canceled");
    setReturned(outcome === "failed" || outcome === "canceled");
  }, [orderId, outcome]);
  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    let count = 0;
    const check = async () => {
      try {
        const response = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (cancelled) return;
        if (!response.ok) { setError(data.error || "Could not check your order"); return; }
        setError(null); setOrder(data);
        if (data.status === "pending" && ++count < 30) timer = setTimeout(check, 2000);
      } catch { if (!cancelled) setError("Could not check your order. Please retry."); }
    };
    void check();
    return () => { cancelled = true; clearTimeout(timer); controller.abort(); };
  }, [orderId, refresh]);
  useEffect(() => { if (order?.status === "paid") clearCart(); }, [order?.status, clearCart]);
  if (!orderId) return <Message title="No checkout in progress" text="Choose a kit in the shop and use Buy on Whop to purchase and receive your download." />;
  if (error) return <Message title="Unable to verify this order" text={error}><button onClick={() => setRefresh(n => n + 1)} className="underline mt-4">Check again</button></Message>;
  if (!order) return <Message title="Loading your order" text="Checking your secure order details." />;
  if (order.status === "paid") return <Message title="Thank you for your order" text="Your payment has been verified. Your order reference is available for delivery support." />;
  if (order.status === "review") return <Message title="Your order needs a review" text="A payment was recorded, but the order needs attention before fulfilment. Please contact support with your order reference."><p className="mt-4 text-sm">Order: {orderId}</p></Message>;
  if (confirming) return <Message title="Confirming your payment" text="We’re waiting for secure payment confirmation. Please don’t pay again.">
    <p className="mt-4 text-sm">Order: {orderId}</p>
    {completion && <p className="mt-2 text-xs">Payment reference: {completion.paymentId}</p>}
    <button onClick={() => setRefresh(n => n + 1)} className="underline mt-4">Check again</button>
  </Message>;
  if (returned && !retry) return <Message title={outcome === "canceled" ? "Payment canceled" : "Payment not completed"} text="Your order is not confirmed. You can retry checkout or check for a delayed payment confirmation.">
    <button onClick={() => { setRetry(true); setReturned(false); }} className="underline mt-4">Retry checkout</button>
    <button onClick={() => setRefresh(n => n + 1)} className="underline mt-4 ml-4">Check payment status</button>
  </Message>;
  if (!order.checkoutConfigurationId && !order.planId) return <Message title="Checkout is unavailable" text="Return to your cart and start a new checkout." />;
  return <div className="px-6 py-12"><div className="mx-auto max-w-lg">
    <h1 className="text-2xl font-extralight mb-8">Complete your order</h1>
    <WhopEmbeddedCheckout orderId={orderId} checkoutConfigurationId={order.checkoutConfigurationId} planId={order.planId} onPaymentComplete={onComplete} />
  </div></div>;
}
function Message({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
    <h1 className="text-2xl font-extralight text-primary">{title}</h1>
    <p className="mt-3 text-sm text-secondary max-w-md">{text}</p>{children}
    <Link href="/shop" className="mt-8 text-sm underline">Back to shop</Link>
  </div>;
}
export default function CheckoutPage() { return <Suspense fallback={<p className="p-12 text-center">Loading checkout...</p>}><CheckoutContent /></Suspense>; }
