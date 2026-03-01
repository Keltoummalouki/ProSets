'use client';

import Link from 'next/link';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { NeonButton } from '@/components/ui/neon-button';

/* ── style helpers ─────────────────────────────────────── */
const syne = 'font-[family-name:var(--font-syne)]';
const jb   = 'font-[family-name:var(--font-jetbrains)]';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-0)] text-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-lg space-y-10 animate-[fadeInUp_.5s_ease_both]">

          {/* ── cancel icon ──────────────────── */}
          <div className="flex justify-center">
            <div className="relative w-28 h-28 rounded-full border border-[var(--color-neon-amber)]/40 bg-[var(--color-neon-amber)]/5 flex items-center justify-center">
              <i className="fa-solid fa-xmark text-4xl text-[var(--color-neon-amber)] drop-shadow-[0_0_12px_var(--color-neon-amber)]" />
            </div>
          </div>

          {/* ── heading ──────────────────────── */}
          <div className="text-center space-y-2">
            <h1 className={`${syne} text-4xl sm:text-5xl font-bold tracking-tight`}>
              Payment&nbsp;<span className="text-glow-amber">Cancelled</span>
            </h1>
            <p className={`${jb} text-sm text-[var(--color-text-muted)]`}>
              Your payment was cancelled. No charges were made.
            </p>
          </div>

          {/* ── info card ────────────────────── */}
          <div className="glass-card p-6 space-y-4">
            <p className={`${jb} text-xs text-[var(--color-text-secondary)]`}>
              If you encountered any issues during checkout, try again or contact support.
            </p>
            <ul className={`${jb} text-xs text-[var(--color-text-muted)] space-y-2`}>
              {[
                'Your cart items are still saved',
                'No payment was processed',
                'You can retry checkout anytime',
              ].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <i className="fa-solid fa-circle-check text-[var(--color-neon-amber)] text-[10px]" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* ── actions ──────────────────────── */}
          <div className="space-y-3">
            <Link href="/catalogue">
              <NeonButton variant="primary" size="lg" className="w-full">
                Back to Catalogue
              </NeonButton>
            </Link>
            <Link href="/">
              <NeonButton variant="secondary" size="lg" className="w-full mt-2">
                Back to Home
              </NeonButton>
            </Link>
          </div>

          {/* ── support ──────────────────────── */}
          <p className={`${jb} text-[10px] text-center text-[var(--color-text-muted)]`}>
            Need help?&nbsp;
            <a href="mailto:support@prosets.io" className="text-[var(--color-neon-cyan)] hover:underline">
              support@prosets.io
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
