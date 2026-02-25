"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutInner() {
  const params = useSearchParams();
  const talentName = params.get("name") || "Creator";
  const talentId = params.get("talent") || "unknown";
  const rate = Number(params.get("rate")) || 5000;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  // Check for return from external payment
  useEffect(() => {
    if (params.get("status") === "success") {
      setCompleted(true);
    }
  }, [params]);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      // Step 1: Ensure connected account exists for this talent
      const acctRes = await fetch("/api/connected-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ talentId, talentName }),
      });
      if (!acctRes.ok) throw new Error("Failed to create connected account");
      const acctData = await acctRes.json();

      // Step 2: Create checkout on the connected account
      const res = await fetch("/api/checkout-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          talentId,
          talentName,
          amount: rate,
          connectedAccountId: acctData.companyId,
        }),
      });
      if (!res.ok) throw new Error("Failed to create checkout");
      const data = await res.json();

      if (data.purchaseUrl) {
        const url = new URL(data.purchaseUrl);
        url.searchParams.set("setupFutureUsage", "off_session");
        window.location.href = url.toString();
      } else {
        setSessionId(data.sessionId);
      }
    } catch {
      setError("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">GRAIL</a>
          <ul className="navbar-nav">
            <li><a href="/browse">Browse</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/browse" className="btn-nav">Book Talent</a></li>
          </ul>
        </div>
      </nav>

      <section className="onboarding-hero">
        <div className="container">
          <h1>Book {talentName}</h1>
          <p>Complete payment to confirm your campaign booking.</p>
        </div>
      </section>

      <section className="onboarding-body">
        <div className="container">
          <div className="onboarding-layout">
            {/* Sidebar - booking summary */}
            <div className="onboarding-sidebar">
              <h3>Booking Summary</h3>
              <div className="sidebar-item">
                <span className="sidebar-icon">&#x1F464;</span>
                <div>
                  <strong>{talentName}</strong>
                  <p>1 campaign collaboration</p>
                </div>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-icon">&#x1F4B0;</span>
                <div>
                  <strong>${rate.toLocaleString()}</strong>
                  <p>One-time campaign fee</p>
                </div>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-icon">&#x1F4B3;</span>
                <div>
                  <strong>Card Auto-Saved</strong>
                  <p>Your payment method will be saved for future bookings automatically.</p>
                </div>
              </div>

              <div className="sidebar-note">
                <strong>What&apos;s included:</strong>
                <ol>
                  <li>Campaign strategy call</li>
                  <li>Content creation &amp; delivery</li>
                  <li>Performance analytics report</li>
                </ol>
              </div>
            </div>

            {/* Main */}
            <div className="onboarding-main">
              <div className="whop-annotation">
                <div className="whop-annotation-badge">
                  <span className="whop-annotation-dot" />
                  Whop Checkout + Save Payment Method
                </div>
                <span className="whop-annotation-desc">
                  Charges for the campaign and auto-saves the payment method via setupFutureUsage
                </span>
              </div>

              <div className="save-pm-card">
                {completed ? (
                  <div className="save-pm-done">
                    <div className="save-pm-done-icon">{"\u2713"}</div>
                    <h3>Booking Confirmed</h3>
                    <p>Your campaign with {talentName} is booked. Payment method saved for future bookings.</p>
                    <div style={{ display: "flex", gap: 12 }}>
                      <a href="/dashboard" className="btn-primary">View Dashboard</a>
                      <a href="/browse" className="btn-primary" style={{ background: "var(--gray-200)", color: "var(--black)" }}>Browse More</a>
                    </div>
                  </div>
                ) : (
                  <div className="save-pm-prompt">
                    <div className="save-pm-prompt-icon">&#x1F4B3;</div>
                    <h3>Pay ${rate.toLocaleString()} &amp; Save Card</h3>
                    <p>
                      Clicking below opens Whop&apos;s checkout to pay for this campaign.
                      Your payment method will be automatically saved for future bookings.
                    </p>
                    <button
                      className="btn-primary btn-large"
                      onClick={handleCheckout}
                      disabled={loading}
                    >
                      {loading ? "Setting up..." : `Pay $${rate.toLocaleString()}`}
                    </button>
                    {error && (
                      <p className="env-hint" style={{ color: "#e53e3e" }}>{error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
      <CheckoutInner />
    </Suspense>
  );
}
