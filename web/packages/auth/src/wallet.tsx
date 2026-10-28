"use client";

// Keep the current and legacy Whop SDK globals in separate documents. Existing
// withdrawal widgets still use the legacy SDK on the payout pages.
export function WalletBalance() {
  return <iframe title="Whop wallet balance" src="/api/wallet/view"
    style={{ width: "100%", height: 450, border: 0 }} />;
}
