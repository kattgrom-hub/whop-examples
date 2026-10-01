"use client";

import { useEffect, useRef, useState } from "react";
import { loadWhopElements, type WalletHandle } from "@/lib/whop-elements";

export function WhopWallet() {
  const target = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let cancelled = false;
    let wallet: WalletHandle | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const abort = new AbortController();
    setLoading(true);
    setError(null);
    setNotice("");

    const getToken = async () => {
      const response = await fetch("/api/wallet/token", { cache: "no-store", signal: abort.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to authorize your wallet.");
      if (!data.token || !data.accountId || !Number.isFinite(Date.parse(data.expiresAt))) {
        throw new Error("Unable to authorize your wallet.");
      }
      return data as { token: string; expiresAt: string; accountId: string };
    };
    const fail = (message: string) => {
      if (cancelled) return;
      clearTimeout(timer);
      wallet?.destroy();
      wallet = undefined;
      setLoading(false);
      setError(message);
    };
    const refreshAt = (expiresAt: string) => {
      timer = setTimeout(async () => {
        try {
          const data = await getToken();
          if (cancelled) return;
          wallet?.update({ accessToken: data.token });
          refreshAt(data.expiresAt);
        } catch (err) {
          fail(err instanceof Error ? err.message : "Your wallet session expired.");
        }
      }, Math.max(1000, Date.parse(expiresAt) - Date.now() - 60000));
    };

    void (async () => {
      try {
        const data = await getToken();
        const WhopElements = await loadWhopElements();
        if (cancelled || !target.current) return;
        wallet = WhopElements({
          environment: process.env.NEXT_PUBLIC_WHOP_ENVIRONMENT || "production",
          locale: "en",
          appearance: { theme: { appearance: "light", accentColor: "yellow" } },
        }).wallet.create({
          accountId: data.accountId,
          accessToken: data.token,
          onIdentityVerificationRequested: () => {
            if (!cancelled) setNotice("Complete identity verification in your Whop account before continuing.");
          },
        });
        wallet.create("actions", {
          showWithdraw: true,
          onReady: () => { if (!cancelled) setLoading(false); },
          onError: () => fail("Whop could not load your wallet. Check your connection and wallet permissions, then retry."),
          onDepositRequested: () => { if (!cancelled) setNotice("Deposit form opened."); },
          onAcceptRequested: () => { if (!cancelled) setNotice("Whop payment setup opened."); },
          onSendRequested: () => { if (!cancelled) setNotice("Send form opened."); },
          onWithdrawRequested: () => { if (!cancelled) setNotice("Withdrawal form opened."); },
          onConvertRequested: () => { if (!cancelled) setNotice("Conversion form opened."); },
        }).mount(target.current);
        refreshAt(data.expiresAt);
      } catch (err) {
        fail(err instanceof Error ? err.message : "Unable to open your wallet.");
      }
    })();

    return () => {
      cancelled = true;
      abort.abort();
      clearTimeout(timer);
      wallet?.destroy();
    };
  }, [attempt]);

  return (
    <div className="space-y-4">
      {loading && <p role="status" className="text-secondary">Loading your wallet…</p>}
      <div ref={target} />
      {notice && <p role="status" className="text-sm text-secondary">{notice}</p>}
      {notice.includes("identity") && <a href="https://whop.com" target="_blank" rel="noopener noreferrer" className="underline">Open Whop</a>}
      {error && <div role="alert" className="space-y-3">
        <p className="text-red-600">{error}</p>
        <button type="button" onClick={() => setAttempt((value) => value + 1)} className="rounded-sm bg-gold px-4 py-2">Retry</button>
        <a href="/api/auth/signin/whop?callbackUrl=%2Fwallet" className="ml-4 underline">Sign in again</a>
      </div>}
    </div>
  );
}
