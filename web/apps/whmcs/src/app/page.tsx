export default function Home() {
  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement">
        WHMCS 9.0 Now in General Availability — 20th January 2026 — <a href="https://www.whmcs.com/whats-new" target="_blank" rel="noopener noreferrer">Learn more &raquo;</a>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">
            <img src="/images/logos/whmcs-co-brand-logo.svg" alt="WHMCS" className="navbar-logo-img" />
          </a>
          <ul className="navbar-nav">
            <li><a href="https://www.whmcs.com/tour" target="_blank" rel="noopener noreferrer">Product</a></li>
            <li><a href="https://www.whmcs.com/addons" target="_blank" rel="noopener noreferrer">Addons</a></li>
            <li><a href="https://www.whmcs.com/integrations" target="_blank" rel="noopener noreferrer">Integrations</a></li>
            <li><a href="https://www.whmcs.com/services" target="_blank" rel="noopener noreferrer">Services</a></li>
            <li><a href="https://www.whmcs.com/pricing" target="_blank" rel="noopener noreferrer">Pricing</a></li>
            <li><a href="https://www.whmcs.com/about" target="_blank" rel="noopener noreferrer">Company</a></li>
            <li><a href="https://www.whmcs.com/contact" target="_blank" rel="noopener noreferrer">Contact</a></li>
            <li><a href="/dashboard">Log In</a></li>
            <li><a href="/get-started" className="btn-nav">Get Started</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>Web Hosting Automation Made Easy</h1>
          <p>All the tools you need to start a web hosting business today.</p>
          <div className="hero-screenshot">
            <img src="/images/screenshots/whmcs-admin-home.png" alt="WHMCS Admin Dashboard" className="hero-screenshot-img" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2>Let WHMCS automate your business</h2>
          <p className="subtitle">
            Simplify and automate daily tasks and operations with the #1 choice in Web Hosting Automation
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><img src="/images/home/automation.png" alt="" /></div>
              <h3>Save Time</h3>
              <p>WHMCS takes care of automating things so you don&apos;t have to, saving you time and money while letting you focus on growing your business.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src="/images/home/billing.png" alt="" /></div>
              <h3>Automate Billing</h3>
              <p>Sending invoices, collecting payments, taxes, reminders and more. WHMCS handles the complete billing lifecycle automatically.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src="/images/home/domains.png" alt="" /></div>
              <h3>Web &amp; Domains</h3>
              <p>Integrated with all the leading web hosting control panels and domain registrars for seamless provisioning and management.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src="/images/home/support.png" alt="" /></div>
              <h3>Support Tools</h3>
              <p>Integrated support tools give you a client portal complete with ticketing, knowledgebase, announcements and more.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src="/images/home/customisation.png" alt="" /></div>
              <h3>Developer Friendly</h3>
              <p>Modular, extensible, well documented APIs and ORM all make developing for and integrating with WHMCS easy.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><img src="/images/home/security.png" alt="" /></div>
              <h3>Secure &amp; Scalable</h3>
              <p>WHMCS is a secure, dependable and scalable solution designed to grow with your business from day one.</p>
            </div>
          </div>

          <a href="https://www.whmcs.com/tour" target="_blank" rel="noopener noreferrer" className="cta-link">Take the Tour &rarr;</a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="testimonials-grid">
            <div className="testimonial">
              <blockquote>&ldquo;WHMCS has been a game changer for our hosting business. The automation saves us countless hours every month and our clients love the self-service portal.&rdquo;</blockquote>
              <cite>Matt Parkinson, <span>VooServers Limited</span></cite>
            </div>
            <div className="testimonial">
              <blockquote>&ldquo;We switched to WHMCS three years ago and haven&apos;t looked back. The billing automation alone has paid for itself many times over.&rdquo;</blockquote>
              <cite>Steve Amstad, <span>FlexiHost Limited</span></cite>
            </div>
            <div className="testimonial">
              <blockquote>&ldquo;The integration with cPanel and domain registrars makes provisioning completely hands-off. Our team can focus on support instead of setup.&rdquo;</blockquote>
              <cite>Phil Williams, <span>OM Hosting</span></cite>
            </div>
            <div className="testimonial">
              <blockquote>&ldquo;WHMCS gives us everything we need in one place. Billing, support, domain management — it&apos;s the backbone of our operation.&rdquo;</blockquote>
              <cite>Nick Lea, <span>Molten-Servers</span></cite>
            </div>
          </div>

          <p className="trust-statement">Trusted by over 35,000 customers in over 200 countries</p>
          <p className="trust-sub">From solo entrepreneurs to enterprise hosting providers</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4>Product</h4>
              <ul>
                <li><a href="https://www.whmcs.com/tour" target="_blank" rel="noopener noreferrer">Tour</a></li>
                <li><a href="https://www.whmcs.com/services" target="_blank" rel="noopener noreferrer">Services</a></li>
                <li><a href="https://www.whmcs.com/integrations" target="_blank" rel="noopener noreferrer">Integrations</a></li>
                <li><a href="https://www.whmcs.com/whats-new" target="_blank" rel="noopener noreferrer">What&apos;s New</a></li>
                <li><a href="https://www.whmcs.com/pricing" target="_blank" rel="noopener noreferrer">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4>Uses</h4>
              <ul>
                <li><a href="https://www.whmcs.com/web-hosting" target="_blank" rel="noopener noreferrer">Web Hosting</a></li>
                <li><a href="https://www.whmcs.com/domain-registrars" target="_blank" rel="noopener noreferrer">Domain Registrars</a></li>
                <li><a href="https://www.whmcs.com/software-developers" target="_blank" rel="noopener noreferrer">Software Developers</a></li>
                <li><a href="https://www.whmcs.com/cloud-hosting" target="_blank" rel="noopener noreferrer">Cloud Hosting</a></li>
                <li><a href="https://www.whmcs.com/isp-billing" target="_blank" rel="noopener noreferrer">ISP Billing</a></li>
              </ul>
            </div>
            <div>
              <h4>Support</h4>
              <ul>
                <li><a href="https://www.whmcs.com/support" target="_blank" rel="noopener noreferrer">Technical Support</a></li>
                <li><a href="https://whmcs.community" target="_blank" rel="noopener noreferrer">Community Forums</a></li>
                <li><a href="https://docs.whmcs.com" target="_blank" rel="noopener noreferrer">Documentation</a></li>
                <li><a href="https://www.whmcs.com/contact" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4>Company</h4>
              <ul>
                <li><a href="https://www.whmcs.com/about" target="_blank" rel="noopener noreferrer">About Us</a></li>
                <li><a href="https://www.whmcs.com/blog" target="_blank" rel="noopener noreferrer">Blog</a></li>
                <li><a href="https://www.whmcs.com/customers" target="_blank" rel="noopener noreferrer">Customers</a></li>
                <li><a href="https://www.whmcs.com/jobs" target="_blank" rel="noopener noreferrer">Jobs</a></li>
              </ul>
            </div>
            <div>
              <h4>Resources</h4>
              <ul>
                <li><a href="https://marketplace.whmcs.com" target="_blank" rel="noopener noreferrer">Marketplace</a></li>
                <li><a href="https://www.whmcs.com/partners" target="_blank" rel="noopener noreferrer">Partners</a></li>
                <li><a href="https://www.whmcs.com/download" target="_blank" rel="noopener noreferrer">Download</a></li>
                <li><a href="https://developers.whmcs.com" target="_blank" rel="noopener noreferrer">Developer Portal</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2026 WHMCS Limited. All rights reserved. Registered in England &amp; Wales #6265962</p>
            <div className="footer-bottom-links">
              <a href="https://www.whmcs.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              <a href="https://www.whmcs.com/terms-of-service" target="_blank" rel="noopener noreferrer">Terms of Service</a>
              <a href="https://www.whmcs.com/legal" target="_blank" rel="noopener noreferrer">Legal</a>
              <a href="https://www.whmcs.com/contact" target="_blank" rel="noopener noreferrer">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
