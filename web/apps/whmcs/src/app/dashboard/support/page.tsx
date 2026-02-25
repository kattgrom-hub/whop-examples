export default function SupportPage() {
  return (
    <section className="dash">
      <div className="container">
        <div className="dash-header">
          <div>
            <h1>Support</h1>
            <p className="dash-welcome">Client tickets and knowledgebase management.</p>
          </div>
        </div>

        <div className="dash-stats">
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Open Tickets</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Awaiting Reply</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Closed Today</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">--</div>
            <div className="dash-stat-label">Avg Response</div>
          </div>
        </div>

        <div className="dash-card">
          <h2>Support Tickets</h2>
          <div className="dash-empty">
            <p>No tickets yet. Client support requests will appear here.</p>
            <a href="/dashboard" className="btn-primary">Back to Dashboard</a>
          </div>
        </div>
      </div>
    </section>
  );
}
