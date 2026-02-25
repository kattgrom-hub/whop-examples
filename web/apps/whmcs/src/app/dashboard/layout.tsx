export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Dashboard Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">
            <img src="/images/logos/whmcs-co-brand-logo.svg" alt="WHMCS" className="navbar-logo-img" />
          </a>
          <ul className="navbar-nav">
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/dashboard/clients">Clients</a></li>
            <li><a href="/dashboard/billing">Billing</a></li>
            <li><a href="/dashboard/support">Support</a></li>
            <li><a href="/dashboard/services">Services</a></li>
          </ul>
        </div>
      </nav>
      {children}
    </>
  );
}
