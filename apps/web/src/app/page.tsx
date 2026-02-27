"use client";

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav>
        <a href="#" className="nav-logo">
          Pro<span>.</span>sets
        </a>
        <ul className="nav-links">
          <li>
            <a href="/catalogue">Catalogue</a>
          </li>
          <li>
            <a href="#">Categories</a>
          </li>
          <li>
            <a href="#">Sellers</a>
          </li>
          <li>
            <a href="#">Pricing</a>
          </li>
          <li>
            <a href="#" className="nav-cta">
              Start Selling
            </a>
          </li>
        </ul>
      </nav>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[
            "3D Models",
            "Code Snippets",
            "Notion Templates",
            "UI Kits",
            "Shaders",
            "Motion Presets",
            "Design Systems",
            "3D Models",
            "Code Snippets",
            "Notion Templates",
            "UI Kits",
            "Shaders",
            "Motion Presets",
            "Design Systems",
          ].map((item, i) => (
            <span className="ticker-item" key={i}>
              <span className="ticker-dot" /> {item}
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-label">Digital Asset Marketplace</div>
          <h1 className="hero-title">
            <span className="line">
              <span>Buy.</span>
            </span>
            <span className="line">
              <span>Sell.</span>
            </span>
            <span className="line">
              <span>Build</span>
            </span>
            <span className="line">
              <span>Faster.</span>
            </span>
          </h1>
          <p className="hero-sub">
            Premium digital assets — 3D models, code snippets, Notion templates
            — bought, sold, and delivered securely. No middlemen. Instant access
            after payment.
          </p>
          <div className="hero-actions">
            <a href="/catalogue" className="btn-primary">
              <i className="fa-solid fa-arrow-right" />
              Browse Catalogue
            </a>
            <a href="#" className="btn-ghost">
              Sell Your Work
            </a>
          </div>
          <div className="hero-stats">
            <div>
              <span className="stat-num">2.4K</span>
              <span className="stat-label">Assets Listed</span>
            </div>
            <div>
              <span className="stat-num">840</span>
              <span className="stat-label">Creators</span>
            </div>
            <div>
              <span className="stat-num">99%</span>
              <span className="stat-label">Secure Delivery</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-grid">
            <div className="hero-card featured">
              <div className="card-icon">
                <i className="fa-solid fa-cube" />
              </div>
              <div>
                <div className="card-tag">Featured Drop</div>
                <div className="card-name">Brutalist Architecture Pack</div>
                <div className="card-meta">12 models · by @rawform</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <div className="card-price">$49</div>
              </div>
            </div>
            <div className="hero-card">
              <div className="card-tag">3D</div>
              <div className="card-icon">
                <i className="fa-solid fa-shapes" />
              </div>
              <div className="card-name">Geo Primitives Vol.2</div>
              <div className="card-price">$18</div>
              <div className="hero-card-visual">
                <i className="fa-solid fa-shapes" />
              </div>
            </div>
            <div className="hero-card">
              <div className="card-tag">Template</div>
              <div className="card-icon">N</div>
              <div className="card-name">Ops HQ Notion Kit</div>
              <div className="card-price">$24</div>
              <div className="hero-card-visual">
                <i className="fa-regular fa-file" />
              </div>
            </div>
            <div className="hero-card">
              <div className="card-tag">Code</div>
              <div className="card-icon">
                <i className="fa-solid fa-code" />
              </div>
              <div className="card-name">Auth Boilerplate NestJS</div>
              <div className="card-price">$12</div>
              <div className="hero-card-visual">
                <i className="fa-solid fa-code" />
              </div>
            </div>
            <div className="hero-card">
              <div className="card-tag">3D</div>
              <div className="card-icon">
                <i className="fa-solid fa-mountain" />
              </div>
              <div className="card-name">Terrain Generator</div>
              <div className="card-price">$35</div>
              <div className="hero-card-visual">
                <i className="fa-solid fa-mountain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[
            "Secure Downloads",
            "Instant Access",
            "Stripe Protected",
            "Presigned URLs",
            "No Watermarks",
            "Creator First",
            "Secure Downloads",
            "Instant Access",
            "Stripe Protected",
            "Presigned URLs",
            "No Watermarks",
            "Creator First",
          ].map((item, i) => (
            <span className="marquee-item" key={i}>
              {item}{" "}
              <span className="marquee-star">
                <i className="fa-solid fa-star" />
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section reveal">
        <div className="section-header">
          <div>
            <div className="section-label">Browse by type</div>
            <h2 className="section-title">
              What are you
              <br />
              <em>building?</em>
            </h2>
          </div>
          <a href="/catalogue" className="see-all">
            All Categories <i className="fa-solid fa-arrow-right" />
          </a>
        </div>

        <div className="cat-grid">
          {[
            { num: "01", icon: "fa-solid fa-cube", name: "3D Models", count: "328 assets" },
            { num: "02", icon: "fa-solid fa-terminal", name: "Code Snippets", count: "512 assets" },
            { num: "03", icon: "fa-regular fa-file-lines", name: "Notion Templates", count: "194 assets" },
          ].map((cat) => (
            <a href="#" className="cat-item" key={cat.num}>
              <div className="cat-num">{cat.num}</div>
              <div className="cat-icon-wrap">
                <i className={cat.icon} />
              </div>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">{cat.count}</div>
              <div className="cat-arrow">
                <i className="fa-solid fa-arrow-up-right" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FEATURED ASSETS */}
      <section className="section reveal" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div>
            <div className="section-label">Handpicked this week</div>
            <h2 className="section-title">
              Featured
              <br />
              <em>Drops</em>
            </h2>
          </div>
          <a href="/catalogue" className="see-all">
            View All <i className="fa-solid fa-arrow-right" />
          </a>
        </div>

        <div className="assets-grid">
          {[
            {
              icon: "fa-solid fa-cube",
              badge: "New",
              badgeClass: "badge-new",
              category: "3D Model",
              name: "Isometric City Block Collection",
              price: "$42",
            },
            {
              icon: "fa-solid fa-code",
              badge: "Hot",
              badgeClass: "badge-hot",
              category: "Code",
              name: "NestJS Microservices Starter",
              price: "$29",
            },
            {
              icon: "fa-regular fa-file-lines",
              badge: null,
              badgeClass: "",
              category: "Template",
              name: "Second Brain Notion OS",
              price: "$19",
            },
            {
              icon: "fa-solid fa-shapes",
              badge: "New",
              badgeClass: "badge-new",
              category: "3D Model",
              name: "Fluid Organic Sculpture Pack",
              price: "$55",
            },
          ].map((asset, i) => (
            <a href="#" className="asset-card" key={i}>
              <div className="asset-thumb-wrap">
                <div className="asset-thumb-placeholder">
                  <i className={asset.icon} />
                </div>
                {asset.badge && (
                  <span className={`asset-badge ${asset.badgeClass}`}>
                    {asset.badge}
                  </span>
                )}
              </div>
              <div className="asset-info">
                <div className="asset-category">{asset.category}</div>
                <div className="asset-name">{asset.name}</div>
                <div className="asset-footer">
                  <div className="asset-price">{asset.price}</div>
                  <div className="asset-buy">
                    <i className="fa-solid fa-plus" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section how-section reveal">
        <div className="section-header">
          <div>
            <div className="section-label">The process</div>
            <h2 className="section-title">
              Dead simple
              <br />
              <em>workflow</em>
            </h2>
          </div>
        </div>

        <div className="steps-grid">
          {[
            {
              num: "01",
              icon: "fa-solid fa-magnifying-glass",
              title: "Browse & Discover",
              desc: "Filter by category, price, or search by name. Find exactly what your project needs.",
            },
            {
              num: "02",
              icon: "fa-solid fa-eye",
              title: "Preview Before Buying",
              desc: "Check galleries, demo videos, and detailed specs. No surprises after checkout.",
            },
            {
              num: "03",
              icon: "fa-solid fa-dollar-sign",
              title: "Pay Securely via Stripe",
              desc: "Card payments through Stripe. Your data never touches our servers.",
            },
            {
              num: "04",
              icon: "fa-solid fa-bolt",
              title: "Instant Secure Download",
              desc: "Get a time-limited presigned link. No waiting, no friction. Just your file.",
            },
          ].map((step) => (
            <div className="step" key={step.num}>
              <div className="step-num">{step.num}</div>
              <div className="step-icon">
                <i className={step.icon} />
              </div>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND */}
      <div className="cta-band reveal">
        <div className="cta-title">
          Ready to
          <br />
          sell your
          <br />
          <em>work?</em>
        </div>
        <div className="cta-right">
          <p className="cta-sub">
            Join 840+ creators already selling on Prosets. Upload once, earn
            forever.
          </p>
          <a href="#" className="btn-dark">
            <i className="fa-solid fa-arrow-right" />
            Create Seller Account
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              Pro<span>.</span>sets
            </div>
            <p className="footer-desc">
              The marketplace for premium digital assets. Secure, fast, and
              built for creators who mean business.
            </p>
          </div>
          <div className="footer-col">
            <h4>Marketplace</h4>
            <ul>
              <li>
                <a href="#">Browse All</a>
              </li>
              <li>
                <a href="#">3D Models</a>
              </li>
              <li>
                <a href="#">Code Snippets</a>
              </li>
              <li>
                <a href="#">Templates</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Sellers</h4>
            <ul>
              <li>
                <a href="#">Start Selling</a>
              </li>
              <li>
                <a href="#">Seller Dashboard</a>
              </li>
              <li>
                <a href="#">Pricing & Fees</a>
              </li>
              <li>
                <a href="#">Guidelines</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Support</a>
              </li>
              <li>
                <a href="#">Privacy</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">
            © 2025 Prosets. All rights reserved.
          </span>
          <div className="footer-socials">
            <a href="#" className="social-link">
              <i className="fa-brands fa-x-twitter" />
            </a>
            <a href="#" className="social-link">
              <i className="fa-brands fa-github" />
            </a>
            <a href="#" className="social-link">
              <i className="fa-brands fa-discord" />
            </a>
            <a href="#" className="social-link">
              <i className="fa-brands fa-instagram" />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
