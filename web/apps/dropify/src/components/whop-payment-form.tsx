"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadWhop, type Whop } from "@whop/elements";
import type { PaymentsHandle } from "@whop/elements/payments";

type Session = { sessionId: string; companyId: string; planId: string; reserved: boolean };
type PaymentState = { status: string; clientSecret: string | null };
export function WhopPaymentForm() {
  const paymentTarget = useRef<HTMLDivElement>(null), brandingTarget = useRef<HTMLDivElement>(null);
  const payments = useRef<PaymentsHandle | null>(null), whop = useRef<Whop | null>(null);
  const inFlight = useRef(false);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [complete, setComplete] = useState(false), [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false), [busy, setBusy] = useState(false);
  const [state, setState] = useState<PaymentState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [sessionAttempt, setSessionAttempt] = useState(0);
  const [sessionLoading, setSessionLoading] = useState(true);
  const checkStatus = useCallback(async () => {
    const response = await fetch("/api/payment-element/status", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to check payment status");
    setState(data); setLocked(data.status !== "ready");
    return data as PaymentState;
  }, []);
  useEffect(() => {
    // Redirect parameters are hints only. Verify using the HttpOnly session, and
    // remove scoped secrets from the address bar before subsequent navigation.
    window.history.replaceState(null, "", window.location.pathname);
    let canceled = false;
    setSessionLoading(true); setError(null);
    void fetch("/api/payment-element/session", { method: "POST" }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not start sandbox checkout");
      if (canceled) return;
      setSession(data); setLocked(data.reserved);
      if (data.reserved) await checkStatus();
    }).catch(e => { if (!canceled) setError(e.message); })
      .finally(() => { if (!canceled) setSessionLoading(false); });
    return () => { canceled = true; };
  }, [checkStatus, sessionAttempt]);
  useEffect(() => {
    if (!session || locked) return;
    let canceled = false;
    let handle: PaymentsHandle | null = null;
    setError(null); setLoading(true); setComplete(false);
    const sdk = loadWhop();
    void (retry ? sdk.retry() : sdk).then(Elements => {
      if (canceled || !paymentTarget.current || !brandingTarget.current) return;
      const instance = Elements({ environment: "sandbox" });
      whop.current = instance;
      handle = instance.payments.create({ accountId: session.companyId, plan: session.planId,
        returnUrl: new URL("/payment-element", window.location.origin).toString(),
        onLoadingChange: value => { if (!canceled) setLoading(value); },
      });
      payments.current = handle;
      handle.create("payment", { fields: { billingDetails: "full" },
        onChange: event => { if (!canceled) setComplete(event.complete); },
        onError: () => { if (!canceled) { setComplete(false); setError("The payment form could not load. Retry loading the form."); } },
      }).mount(paymentTarget.current);
      handle.create("branding").mount(brandingTarget.current);
    }).catch(() => { if (!canceled) setError("The payment form could not load. Retry loading the form."); });
    return () => { canceled = true; handle?.destroy(); payments.current = null; };
  }, [session, locked, retry]);
  const pay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current || locked || loading || !complete || !payments.current) return;
    inFlight.current = true; setBusy(true); setError(null);
    let sent = false;
    try {
      // Call from the activation handler so wallet sheets retain user activation.
      const token = await payments.current.createConfirmationToken({ billingDetails: { email } });
      sent = true;
      const response = await fetch("/api/payment-element/confirm", { method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmationToken: token.confirmationToken, email }),
      });
      setLocked(true);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Check payment status before trying again");
      if (data.clientSecret) await whop.current!.payments.handleNextAction({ clientSecret: data.clientSecret });
      await checkStatus();
    } catch (e) {
      if (sent) setLocked(true);
      setError(e instanceof Error ? e.message : "Payment could not be confirmed");
    } finally { inFlight.current = false; setBusy(false); }
  };
  const refresh = async (continueAction = false) => {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(null);
    try {
      const latest = await checkStatus();
      if (continueAction && latest.status === "pending" && latest.clientSecret) {
        const Elements = await loadWhop();
        await Elements({ environment: "sandbox" }).payments.handleNextAction({ clientSecret: latest.clientSecret });
        await checkStatus();
      }
    } catch (e) { setError(e instanceof Error ? e.message : "Status unavailable"); }
    finally { inFlight.current = false; setBusy(false); }
  };
  return <div>
    {error && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
    {!session ? <div aria-live="polite">
      {sessionLoading ? <p>Starting secure checkout…</p> : <button type="button" onClick={() => setSessionAttempt(n => n + 1)} className="underline">Retry checkout</button>}
    </div> : locked ? <div aria-live="polite">
      <p>{state?.status === "succeeded" ? "Sandbox payment verified. No kit has been delivered." :
        state?.status === "failed" || state?.status === "canceled" ? "The sandbox payment did not complete." :
        state?.status === "unknown" ? "The attempt needs a status review. Do not submit another payment." :
        "Checking the existing attempt. Do not submit another payment."}</p>
      <button disabled={busy} onClick={() => void refresh()} className="underline mt-4">Check payment status</button>
      {state?.status === "pending" && state.clientSecret && <button disabled={busy} onClick={() => void refresh(true)} className="underline mt-4 ml-4">Continue verification</button>}
    </div> : <form onSubmit={pay}>
      <label htmlFor="payment-email" className="block mb-2 text-sm">Email</label>
      <input id="payment-email" type="email" autoComplete="email" required maxLength={254} value={email}
        onChange={e => setEmail(e.target.value)} className="border rounded w-full p-3 mb-6" />
      <div ref={paymentTarget} aria-label="Payment methods" className="min-h-[200px]" />
      <div ref={brandingTarget} className="my-4" />
      <button type="submit" disabled={!session || loading || !complete || busy || !email}
        className="rounded bg-primary text-white p-3 w-full disabled:opacity-50">
        {busy ? "Confirming…" : "Pay in sandbox"}
      </button>
      {error && <button type="button" onClick={() => setRetry(n => n + 1)} className="underline mt-4">Reload payment form</button>}
    </form>}
  </div>;
}
