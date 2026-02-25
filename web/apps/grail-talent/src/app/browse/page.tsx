const TALENT = [
  { id: "maya-chen", name: "Maya Chen", handle: "@mayachen", category: "Fashion & Beauty", followers: "2.1M", rate: 5000, img: "https://grail-talent.com/home-hero-1-poster.jpg" },
  { id: "jordan-lee", name: "Jordan Lee", handle: "@jordanlee", category: "Lifestyle", followers: "890K", rate: 3000, img: "https://grail-talent.com/home-hero-2-poster.jpg" },
  { id: "alex-rivera", name: "Alex Rivera", handle: "@alexrivera", category: "Food & Beverage", followers: "1.5M", rate: 4000, img: "https://grail-talent.com/home-hero-3-poster.jpg" },
  { id: "sam-taylor", name: "Sam Taylor", handle: "@samtaylor", category: "Tech & Gaming", followers: "3.2M", rate: 7500, img: "https://grail-talent.com/home-hero-4-poster.jpg" },
  { id: "nina-park", name: "Nina Park", handle: "@ninapark", category: "Fitness & Wellness", followers: "1.8M", rate: 4500, img: "https://grail-talent.com/home-hero-5-poster.jpg" },
  { id: "chris-wu", name: "Chris Wu", handle: "@chriswu", category: "Fashion & Beauty", followers: "950K", rate: 3500, img: "https://grail-talent.com/home-hero-1-poster.jpg" },
];

export default function BrowsePage() {
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

      <section className="browse-hero">
        <div className="container">
          <h1>Browse Talent</h1>
          <p>Find the perfect creator for your next campaign. Book instantly with saved payment methods.</p>
        </div>
      </section>

      <section className="browse-body">
        <div className="container">
          <div className="talent-grid">
            {TALENT.map(t => (
              <div key={t.id} className="talent-card">
                <div className="talent-img">
                  <img src={t.img} alt={t.name} />
                </div>
                <div className="talent-info">
                  <div className="talent-name">{t.name}</div>
                  <div className="talent-handle">{t.handle}</div>
                  <div className="talent-meta">
                    <span className="talent-category">{t.category}</span>
                    <span className="talent-followers">{t.followers} followers</span>
                  </div>
                  <div className="talent-footer">
                    <div className="talent-rate">${t.rate.toLocaleString()}<span>/campaign</span></div>
                    <a
                      href={`/checkout?talent=${t.id}&name=${encodeURIComponent(t.name)}&rate=${t.rate}`}
                      className="btn-primary btn-book"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
