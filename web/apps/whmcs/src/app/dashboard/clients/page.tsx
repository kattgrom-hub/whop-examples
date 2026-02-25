export default function ClientsPage() {
  return (
    <section className="dash">
      <div className="container">
        <div className="dash-header">
          <div>
            <h1>Clients</h1>
            <p className="dash-welcome">Manage your hosting clients and their accounts.</p>
          </div>
        </div>

        <div className="dash-stats">
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Total Clients</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Active</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Inactive</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Overdue</div>
          </div>
        </div>

        <div className="dash-card">
          <h2>Client List</h2>
          <div className="dash-empty">
            <p>No clients yet. Clients will appear here once they sign up through your storefront.</p>
            <a href="/dashboard" className="btn-primary">Back to Dashboard</a>
          </div>
        </div>
      </div>
    </section>
  );
}
