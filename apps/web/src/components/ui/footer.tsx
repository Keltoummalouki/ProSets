import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[rgba(255,255,255,0.06)] px-6 md:px-12 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="font-[family-name:var(--font-syne)] text-2xl font-extrabold tracking-[3px] text-[#f0f0f0] mb-4">
              PRO<span className="text-[#00ffff]">.</span>SETS
            </div>
            <p className="text-[12px] font-[family-name:var(--font-jetbrains)] leading-[1.8] text-[rgba(240,240,240,0.3)] max-w-[280px]">
              The marketplace for premium digital assets. Secure, fast, and built for creators who mean business.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: 'fa-brands fa-x-twitter', href: '#' },
                { icon: 'fa-brands fa-github', href: '#' },
                { icon: 'fa-brands fa-discord', href: '#' },
              ].map((s) => (
                <a
                  key={s.icon}
                  href={s.href}
                  className="w-9 h-9 border border-[rgba(255,255,255,0.06)] rounded-[3px] flex items-center justify-center text-[rgba(240,240,240,0.25)] text-xs hover:border-[rgba(0,255,255,0.3)] hover:text-[#00ffff] transition-all no-underline"
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {[
            { title: 'Marketplace', links: [{ label: 'Browse All', href: '/catalogue' }, { label: '3D Models', href: '/catalogue' }, { label: 'Code Snippets', href: '/catalogue' }, { label: 'Templates', href: '/catalogue' }] },
            { title: 'Sellers', links: [{ label: 'Start Selling', href: '/seller' }, { label: 'Seller Dashboard', href: '/seller' }, { label: 'Pricing & Fees', href: '#' }, { label: 'Guidelines', href: '#' }] },
            { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Support', href: '#' }, { label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[3px] uppercase text-[rgba(240,240,240,0.25)] mb-5">
                {col.title}
              </h4>
              <ul className="space-y-2.5 list-none p-0">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[12px] font-[family-name:var(--font-jetbrains)] text-[rgba(240,240,240,0.4)] hover:text-[#f0f0f0] transition-colors no-underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-[rgba(255,255,255,0.04)]">
          <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[rgba(240,240,240,0.15)] tracking-wider">
            © 2026 Prosets. All rights reserved.
          </span>
          <span className="text-[10px] font-[family-name:var(--font-jetbrains)] text-[rgba(240,240,240,0.15)] tracking-wider flex items-center gap-3">
            <span>Secured by Auth0</span>
            <span className="w-1 h-1 rounded-full bg-[rgba(0,255,255,0.3)]" />
            <span>Powered by Stripe</span>
            <span className="w-1 h-1 rounded-full bg-[rgba(0,255,255,0.3)]" />
            <span>Hosted on AWS</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
