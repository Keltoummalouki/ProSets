'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NeonButton } from './neon-button';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 border-b border-[rgba(255,255,255,0.06)] backdrop-blur-xl bg-[rgba(5,5,5,0.85)]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-1 no-underline">
        <span className="font-[family-name:var(--font-syne)] text-2xl font-extrabold tracking-[3px] text-[#f0f0f0]">
          PRO<span className="text-[#00ffff]">.</span>SETS
        </span>
      </Link>

      {/* Desktop Links */}
      <ul className="hidden md:flex items-center gap-8 list-none">
        <li>
          <Link href="/catalogue" className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[2.5px] uppercase text-[rgba(240,240,240,0.45)] hover:text-[#f0f0f0] transition-colors no-underline">
            Catalogue
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[2.5px] uppercase text-[rgba(240,240,240,0.45)] hover:text-[#f0f0f0] transition-colors no-underline">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/seller" className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[2.5px] uppercase text-[rgba(240,240,240,0.45)] hover:text-[#f0f0f0] transition-colors no-underline">
            Sell
          </Link>
        </li>
        <li>
          <Link href="/seller">
            <NeonButton variant="primary" size="xs">
              Start Selling
            </NeonButton>
          </Link>
        </li>
      </ul>

      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden w-10 h-10 flex items-center justify-center border border-[rgba(255,255,255,0.08)] rounded-[3px] text-[rgba(240,240,240,0.5)] hover:text-[#00ffff] hover:border-[rgba(0,255,255,0.3)] transition-all bg-transparent cursor-pointer"
      >
        <i className={`fa-solid ${mobileOpen ? 'fa-xmark' : 'fa-bars'} text-sm`} />
      </button>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 bg-[rgba(5,5,5,0.95)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] md:hidden">
          <div className="flex flex-col p-6 gap-4">
            <Link href="/catalogue" onClick={() => setMobileOpen(false)} className="text-[11px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.5)] hover:text-[#f0f0f0] transition-colors py-2 border-b border-[rgba(255,255,255,0.04)] no-underline">
              Catalogue
            </Link>
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-[11px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.5)] hover:text-[#f0f0f0] transition-colors py-2 border-b border-[rgba(255,255,255,0.04)] no-underline">
              Dashboard
            </Link>
            <Link href="/seller" onClick={() => setMobileOpen(false)} className="text-[11px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.5)] hover:text-[#f0f0f0] transition-colors py-2 border-b border-[rgba(255,255,255,0.04)] no-underline">
              Sell
            </Link>
            <Link href="/seller" onClick={() => setMobileOpen(false)}>
              <NeonButton variant="primary" size="sm" className="w-full mt-2">
                Start Selling
              </NeonButton>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
