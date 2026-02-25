export default function HomePage() {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <a href="/" className="navbar-logo">GRAIL</a>
          <ul className="navbar-nav">
            <li><a href="/">Talent</a></li>
            <li><a href="/">Brands</a></li>
            <li><a href="/">Managers</a></li>
            <li><a href="/">Commerce</a></li>
            <li><a href="/browse">Browse</a></li>
            <li><a href="/get-started" className="btn-nav">Connect</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>The Home for Creators</h1>
          <div className="hero-images">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="hero-img">
                <img src={`https://grail-talent.com/home-hero-${i}-poster.jpg`} alt={`Creator ${i}`} />
              </div>
            ))}
          </div>
          <div className="hero-logos">
            {["THE CUT","TEEN VOGUE","PAPER","VICE","VOGUE","BUSINESS INSIDER"].map(name => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mission">
        <div className="container">
          <div className="mission-header">Our mission</div>
          <h2>Grail connects creators with opportunity &mdash; empowering talent to build lasting careers through brand partnerships.</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-card-icon">&#x1F4B3;</div>
              <h3>Getting Paid</h3>
              <p>Over 65,000 of the most sought-after brand collaborations, ensuring creators are fairly compensated for their work.</p>
            </div>
            <div className="mission-card">
              <div className="mission-card-icon">&#x1F91D;</div>
              <h3>A Team You Can Trust</h3>
              <p>150+ team members dedicated to managing and growing creator careers across every major platform.</p>
            </div>
            <div className="mission-card">
              <div className="mission-card-icon">&#x1F680;</div>
              <h3>Above and Beyond</h3>
              <p>From launching brands to TV careers, we go beyond partnerships to accelerate creator growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="case-studies">
        <div className="container">
          <h2>Featured Campaigns</h2>
          <div className="case-grid">
            {[
              { brand: "H&M", desc: "Fall/Winter creator collections" },
              { brand: "Supergoop", desc: "Sunscreen awareness campaign" },
              { brand: "Hulu", desc: "Streaming content promotion" },
              { brand: "Chips Ahoy", desc: "Social-first snack campaign" },
              { brand: "Skims", desc: "Comfort apparel launch" },
              { brand: "Glossier", desc: "Beauty community activation" },
            ].map(c => (
              <div key={c.brand} className="case-card">
                <div className="case-card-bg" />
                <h3>{c.brand}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="partners">
        <div className="container">
          <h2>Trusted by over 3,000 global brands</h2>
          <div className="partner-logos">
            {["Netflix","Nintendo","Adidas","Spotify","Gucci","Amazon","Fenty","Puma","Glossier","Uber","L'Or\u00e9al","A24","Valentino","Est\u00e9e Lauder","Kellogg's","E.L.F.","Skyscanner","Fortnite"].map(name => (
              <div key={name} className="partner-logo">{name}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-icon">&#x1F4C8;</div>
              <div className="stat-num">65,000+</div>
              <div className="stat-label">Brand bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">&#x1F3E2;</div>
              <div className="stat-num">3,000+</div>
              <div className="stat-label">Brand clients</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon">&#x2B50;</div>
              <div className="stat-num">1,000+</div>
              <div className="stat-label">Creators</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>Get in touch</h2>
          <div className="cta-form">
            <select className="cta-select">
              <option>Creator</option>
              <option>Brand</option>
              <option>Manager</option>
              <option>Other</option>
            </select>
            <a href="/browse" className="cta-btn">Browse Talent</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-logo">GRAIL</div>
            <div className="footer-links">
              <a href="/">Talent</a>
              <a href="/">Brands</a>
              <a href="/">Managers</a>
              <a href="/">Commerce</a>
              <a href="https://grail-talent.com" target="_blank" rel="noopener">GrailX</a>
              <a href="https://grail-talent.com/terms" target="_blank" rel="noopener">Terms</a>
              <a href="https://grail-talent.com/privacy" target="_blank" rel="noopener">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
