"use client";

import { useState, useEffect } from "react";

interface PaymentMethod {
  id: string;
  type?: string;
  payment_method_type?: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  is_default?: boolean;
  created_at?: string;
}

const COMPANY_ID = process.env.NEXT_PUBLIC_WHOP_COMPANY_ID || "";

export default function DashboardPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPaymentMethods() {
      try {
        const res = await fetch(`/api/payment-methods?companyId=${COMPANY_ID}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const { data } = await res.json();
        setPaymentMethods(data || []);
      } catch {
        setError("Could not load payment methods.");
      } finally {
        setLoading(false);
      }
    }
    fetchPaymentMethods();
  }, []);

  function cardIcon(brand: string) {
    switch (brand?.toLowerCase()) {
      case "visa": return "\uD83C\uDFE6";
      case "mastercard": return "\uD83D\uDCB3";
      case "amex": return "\uD83D\uDCB3";
      default: return "\uD83D\uDCB3";
    }
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">GRAIL</a>
          <ul className="navbar-nav">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/get-started">Add Payment</a></li>
            <li><a href="/" className="btn-nav">Home</a></li>
          </ul>
        </div>
      </nav>

      {/* Header */}
      <section className="dash-hero">
        <div className="container">
          <h1>Brand Dashboard</h1>
          <p>Manage your payment methods and campaign bookings.</p>
        </div>
      </section>

      {/* Body */}
      <section className="dash-body">
        <div className="container">
          <div className="dash-grid">
            {/* Payment Methods */}
            <div className="dash-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Payment Methods</h3>
                {/* Annotation */}
                <div className="whop-annotation-badge" style={{ fontSize: 11 }}>
                  <span className="whop-annotation-dot" />
                  Whop List Payment Methods
                </div>
              </div>

              {loading ? (
                <div className="loading-spinner">Loading payment methods...</div>
              ) : error ? (
                <div className="pm-empty">{error}</div>
              ) : paymentMethods.length === 0 ? (
                <div className="pm-empty">
                  <p>No payment methods on file.</p>
                  <a href="/get-started" className="btn-primary" style={{ marginTop: 16 }}>
                    Add Payment Method
                  </a>
                </div>
              ) : (
                <div className="pm-list">
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="pm-item">
                      <div className="pm-icon">{cardIcon(pm.card?.brand || "")}</div>
                      <div className="pm-details">
                        <div className="pm-brand">{pm.card?.brand || pm.type || "Card"}</div>
                        <div className="pm-last4">
                          {pm.card ? `•••• ${pm.card.last4} · Exp ${pm.card.exp_month}/${pm.card.exp_year}` : pm.id}
                        </div>
                      </div>
                      {pm.is_default && <span className="pm-badge">Default</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Account Summary */}
            <div className="dash-stat-card">
              <h3>Account Summary</h3>
              <div className="dash-stat-row">
                <span className="dash-stat-label">Status</span>
                <span className="dash-stat-value" style={{ color: "#22c55e" }}>Active</span>
              </div>
              <div className="dash-stat-row">
                <span className="dash-stat-label">Payment Methods</span>
                <span className="dash-stat-value">{loading ? "..." : paymentMethods.length}</span>
              </div>
              <div className="dash-stat-row">
                <span className="dash-stat-label">Active Campaigns</span>
                <span className="dash-stat-value">0</span>
              </div>
              <div className="dash-stat-row">
                <span className="dash-stat-label">Total Spend</span>
                <span className="dash-stat-value">$0.00</span>
              </div>
            </div>
          </div>

          <a href="/get-started" className="btn-primary">Add Another Payment Method</a>
        </div>
      </section>
    </>
  );
}
