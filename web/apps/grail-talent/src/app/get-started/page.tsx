"use client";

import { useState } from "react";

const COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3457";

export default function GetStartedPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSavePaymentMethod() {
    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: `brand-${Date.now()}` }),
      });

      if (!res.ok) throw new Error("Failed to create checkout session");

      const { sessionId: sid, purchaseUrl } = await res.json();

      if (purchaseUrl) {
        // Redirect to Whop hosted checkout for setup mode
        window.location.href = purchaseUrl;
      } else {
        setSessionId(sid);
      }
    } catch {
      setError("Failed to start payment setup. Please try again.");
    } finally {
      setIsCreating(false);
    }
  }

  // Check if returning from successful save
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") === "success" && !saved) {
      setSaved(true);
    }
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">GRAIL</a>
          <ul className="navbar-nav">
            <li><a href="/">Talent</a></li>
            <li><a href="/">Brands</a></li>
            <li><a href="/get-started" className="btn-nav">Connect</a></li>
          </ul>
        </div>
      </nav>

      {/* Header */}
      <section className="onboarding-hero">
        <div className="container">
          <h1>Set Up Payments</h1>
          <p>Save a payment method to seamlessly book talent and manage campaigns.</p>
        </div>
      </section>

      {/* Main */}
      <section className="onboarding-body">
        <div className="container">
          <div className="onboarding-layout">
            {/* Sidebar */}
            <div className="onboarding-sidebar">
              <h3>Why save a payment method?</h3>
              <div className="sidebar-item">
                <span className="sidebar-icon">&#x26A1;</span>
                <div>
                  <strong>Instant Booking</strong>
                  <p>Book creators for campaigns without re-entering payment details every time.</p>
                </div>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-icon">&#x1F504;</span>
                <div>
                  <strong>Recurring Payments</strong>
                  <p>Set up automatic billing for ongoing creator partnerships.</p>
                </div>
              </div>
              <div className="sidebar-item">
                <span className="sidebar-icon">&#x1F512;</span>
                <div>
                  <strong>Secure &amp; Compliant</strong>
                  <p>Payment details are encrypted and PCI-compliant. We never store raw card numbers.</p>
                </div>
              </div>

              <div className="sidebar-note">
                <strong>How it works:</strong>
                <ol>
                  <li>Enter your card or bank details</li>
                  <li>Whop securely tokenizes your payment method</li>
                  <li>You&apos;re ready to book talent instantly</li>
                </ol>
                <p>No charge is made until you book a campaign.</p>
              </div>
            </div>

            {/* Main card */}
            <div className="onboarding-main">
              {/* Annotation */}
              <div className="whop-annotation">
                <div className="whop-annotation-badge">
                  <span className="whop-annotation-dot" />
                  Whop Save Payment Method
                </div>
                <span className="whop-annotation-desc">
                  Redirects to Whop&apos;s hosted checkout in setup mode &mdash; saves payment details without charging
                </span>
              </div>

              <div className="save-pm-card">
                {saved ? (
                  <div className="save-pm-done">
                    <div className="save-pm-done-icon">{"\u2713"}</div>
                    <h3>Payment Method Saved</h3>
                    <p>You&apos;re all set. Your payment method is on file and ready for booking campaigns.</p>
                    <a href="/dashboard" className="btn-primary">Go to Dashboard</a>
                  </div>
                ) : (
                  <div className="save-pm-prompt">
                    <div className="save-pm-prompt-icon">&#x1F4B3;</div>
                    <h3>Add a Payment Method</h3>
                    <p>
                      Clicking below redirects to Whop&apos;s secure checkout to save your
                      card or bank details. No charges will be made.
                    </p>
                    <button
                      className="btn-primary btn-large"
                      onClick={handleSavePaymentMethod}
                      disabled={isCreating}
                    >
                      {isCreating ? "Setting up..." : "Save Payment Method"}
                    </button>
                    {error && (
                      <p className="env-hint" style={{ color: "#e53e3e" }}>{error}</p>
                    )}
                    {!COMPANY_ID && (
                      <p className="env-hint">
                        Set <code>WHOP_API_KEY</code> + <code>NEXT_PUBLIC_WHOP_COMPANY_ID</code> for live checkout
                      </p>
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
