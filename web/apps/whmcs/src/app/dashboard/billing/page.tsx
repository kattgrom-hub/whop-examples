export default function BillingPage() {
  return (
    <section className="dash">
      <div className="container">
        <div className="dash-header">
          <div>
            <h1>Billing</h1>
            <p className="dash-welcome">Invoices, payments, and revenue tracking.</p>
          </div>
          <div className="dash-verified-badge">
            <span className="dash-verified-dot" />
            Payouts Enabled
          </div>
        </div>

        <div className="dash-stats">
          <div className="dash-stat">
            <div className="dash-stat-value">$0.00</div>
            <div className="dash-stat-label">Revenue (MTD)</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Invoices Sent</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Paid</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Overdue</div>
          </div>
        </div>

        <div className="dash-grid">
          <div className="dash-card">
            <h2>Recent Invoices</h2>
            <div className="dash-empty">
              <p>No invoices yet. Invoices are generated automatically when clients place orders.</p>
            </div>
          </div>
          <div className="dash-card">
            <h2>Payment Methods</h2>
            <div className="dash-feature-list">
              <div className="dash-feature">
                <div className="dash-feature-status dash-feature-enabled" />
                <div>
                  <strong>Credit Card (Stripe)</strong>
                  <p>Accept Visa, Mastercard, Amex via Stripe integration.</p>
                </div>
              </div>
              <div className="dash-feature">
                <div className="dash-feature-status dash-feature-enabled" />
                <div>
                  <strong>PayPal</strong>
                  <p>Accept PayPal payments and subscriptions.</p>
                </div>
              </div>
              <div className="dash-feature">
                <div className="dash-feature-status dash-feature-enabled" />
                <div>
                  <strong>Bank Transfer</strong>
                  <p>Accept direct bank transfers with auto-matching.</p>
                </div>
              </div>
            </div>
            <div className="dash-whop-callout">
              <span className="dash-whop-callout-badge">Powered by Whop</span>
              Payment processing enabled by Whop VerifyElement KYC.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
