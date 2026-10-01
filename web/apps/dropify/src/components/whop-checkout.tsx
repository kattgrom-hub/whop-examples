"use client";
import { useEffect, useRef, useState } from "react";
import { getWhopEnvironment } from "@/lib/checkout-config";

type Completion = { result: "payment"; paymentId: string; sessionId: string } |
  { result: "setup"; setupIntentId: string; sessionId: string } |
  { result: "waitlist_entry"; entryId: string; sessionId: string };
type ElementHandle = { mount(target: HTMLElement): void; destroy(): void };
type CheckoutHandle = { create(name: "checkout", options?: { onError?: (event: { code?: string }) => void }): ElementHandle; destroy(): void };
type ElementsConstructor = (options: { environment: "sandbox" | "production" }) => {
  checkout: { create(options: { checkoutConfiguration?: string; plan?: string; returnUrl: string; onComplete(event: Completion): void }): CheckoutHandle };
};
declare global { interface Window { WhopElements?: ElementsConstructor } }
let scriptPromise: Promise<ElementsConstructor> | null = null;
function loadElements(): Promise<ElementsConstructor> {
  if (window.WhopElements) return Promise.resolve(window.WhopElements);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<ElementsConstructor>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-whop-elements]");
    const script = existing || document.createElement("script");
    const cleanup = () => { clearTimeout(timeout); script.removeEventListener("load", loaded); script.removeEventListener("error", failed); };
    const loaded = () => {
      cleanup();
      if (window.WhopElements) resolve(window.WhopElements);
      else { script.remove(); reject(new Error("Checkout did not initialize")); }
    };
    const failed = () => { cleanup(); script.remove(); reject(new Error("Checkout could not load")); };
    const timeout = setTimeout(failed, 15000);
    script.addEventListener("load", loaded);
    script.addEventListener("error", failed);
    if (!existing) {
      script.src = "https://cdn.whop.com/elements/amber/elements.js";
      script.async = true;
      script.dataset.whopElements = "";
      document.head.appendChild(script);
    }
  }).catch(error => { scriptPromise = null; throw error; });
  return scriptPromise;
}

export function WhopEmbeddedCheckout({ orderId, checkoutConfigurationId, planId, onPaymentComplete }: {
  orderId: string; checkoutConfigurationId: string | null; planId: string | null;
  onPaymentComplete: (paymentId: string, sessionId: string) => void;
}) {
  const target = useRef<HTMLDivElement>(null);
  const complete = useRef(onPaymentComplete);
  complete.current = onPaymentComplete;
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let checkout: CheckoutHandle | undefined;
    setError(null);
    void loadElements().then(Elements => {
      if (cancelled || !target.current) return;
      const restore = new URL("/checkout", window.location.origin);
      restore.searchParams.set("orderId", orderId);
      checkout = Elements({ environment: getWhopEnvironment() }).checkout.create({
        ...(checkoutConfigurationId ? { checkoutConfiguration: checkoutConfigurationId } : { plan: planId || undefined }),
        returnUrl: restore.toString(),
        onComplete: event => {
          if (cancelled) return;
          if (event.result === "payment" && /^pay_[a-zA-Z0-9]+$/.test(event.paymentId) && event.sessionId) {
            complete.current(event.paymentId, event.sessionId);
          } else {
            setError("This checkout did not complete a payment. No order has been confirmed.");
          }
        },
      });
      checkout.create("checkout", { onError: () => {
        if (!cancelled) setError("Checkout is unavailable. Please retry.");
      } }).mount(target.current);
    }).catch(() => { if (!cancelled) setError("Checkout could not load. Please retry."); });
    return () => { cancelled = true; checkout?.destroy(); };
  }, [orderId, checkoutConfigurationId, planId, attempt]);
  return <div>
    {error && <div role="alert" className="mb-4 text-sm text-red-700">
      <p>{error}</p><button type="button" onClick={() => setAttempt(n => n + 1)} className="underline mt-2">Retry checkout</button>
    </div>}
    <div ref={target} className="min-h-[360px] w-full" aria-label="Whop checkout" />
  </div>;
}
