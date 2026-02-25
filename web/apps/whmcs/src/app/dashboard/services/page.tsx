export default function ServicesPage() {
  return (
    <section className="dash">
      <div className="container">
        <div className="dash-header">
          <div>
            <h1>Services</h1>
            <p className="dash-welcome">Hosting plans, domains, and provisioned services.</p>
          </div>
        </div>

        <div className="dash-stats">
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Active Services</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Domains</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">SSL Certs</div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat-value">0</div>
            <div className="dash-stat-label">Pending Setup</div>
          </div>
        </div>

        <div className="dash-grid">
          <div className="dash-card">
            <h2>Hosting Plans</h2>
            <div className="dash-empty">
              <p>No hosting plans configured. Set up your plans to start selling.</p>
            </div>
          </div>
          <div className="dash-card">
            <h2>Server Integrations</h2>
            <div className="dash-feature-list">
              <div className="dash-feature">
                <div className="dash-feature-status dash-feature-enabled" />
                <div>
                  <strong>cPanel / WHM</strong>
                  <p>Auto-provision shared hosting accounts.</p>
                </div>
              </div>
              <div className="dash-feature">
                <div className="dash-feature-status dash-feature-enabled" />
                <div>
                  <strong>Plesk</strong>
                  <p>Manage Plesk hosting servers and plans.</p>
                </div>
              </div>
              <div className="dash-feature">
                <div className="dash-feature-status dash-feature-enabled" />
                <div>
                  <strong>DirectAdmin</strong>
                  <p>DirectAdmin server provisioning support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
