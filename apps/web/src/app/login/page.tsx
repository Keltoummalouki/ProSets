'use client';

import Link from 'next/link';
import { useState } from 'react';

/* ── style helpers ─────────────────────────────────────── */
const syne = 'font-[family-name:var(--font-syne)]';
const jb = 'font-[family-name:var(--font-jetbrains)]';

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#050505] text-white">

      {/* ═══════ LEFT — branding panel (hidden on mobile) ═══════ */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12 border-r border-[rgba(255,255,255,0.04)]">
        {/* subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,255,255,.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,.2) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Ambient glow */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[radial-gradient(circle,rgba(0,255,255,0.04),transparent_70%)]" />

        {/* logo */}
        <Link href="/" className="relative z-10 no-underline">
          <span className={`${syne} text-3xl font-extrabold tracking-[3px] text-[#f0f0f0]`}>
            PRO<span className="text-[#00ffff]">.</span>SETS
          </span>
        </Link>

        {/* tagline */}
        <div className="relative z-10 space-y-4 max-w-sm">
          <h2 className={`${syne} text-4xl font-bold leading-tight`}>
            Premium Digital&nbsp;Assets,&nbsp;
            <span className="text-glow-cyan">Delivered Instantly</span>
          </h2>
          <p className={`${jb} text-xs text-[rgba(240,240,240,0.15)] leading-relaxed`}>
            3D models, code snippets and Notion templates — curated for builders who ship fast.
          </p>
        </div>

        {/* trust */}
        <div className="relative z-10 flex items-center gap-6">
          {[
            { n: '2k+', l: 'Assets' },
            { n: '800+', l: 'Creators' },
            { n: '12k+', l: 'Downloads' },
          ].map((s) => (
            <div key={s.l}>
              <p className={`${syne} text-xl font-bold text-[#00ffff]`}>{s.n}</p>
              <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.15)] uppercase tracking-wider`}>{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════ RIGHT — login form ═══════ */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-10 animate-[fadeInUp_.5s_ease_both]">

          {/* mobile logo */}
          <div className="lg:hidden text-center">
            <Link href="/" className="no-underline">
              <span className={`${syne} text-2xl font-extrabold tracking-[3px] text-[#f0f0f0]`}>
                PRO<span className="text-[#00ffff]">.</span>SETS
              </span>
            </Link>
          </div>

          {/* Sign In / Sign Up toggle */}
          <div className="space-y-4">
            <div className="flex bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-1">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 rounded-[2px] text-[11px] ${jb} tracking-[2px] uppercase transition-all ${mode === 'signin'
                    ? 'bg-[rgba(0,255,255,0.1)] text-[#00ffff] border border-[rgba(0,255,255,0.3)]'
                    : 'text-[rgba(240,240,240,0.25)] hover:text-[#f0f0f0]'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 rounded-[2px] text-[11px] ${jb} tracking-[2px] uppercase transition-all ${mode === 'signup'
                    ? 'bg-[rgba(0,255,255,0.1)] text-[#00ffff] border border-[rgba(0,255,255,0.3)]'
                    : 'text-[rgba(240,240,240,0.25)] hover:text-[#f0f0f0]'
                  }`}
              >
                Sign Up
              </button>
            </div>
            <p className={`${jb} text-xs text-[rgba(240,240,240,0.15)]`}>
              {mode === 'signin' ? 'Sign in to your account to continue' : 'Create a new account to start buying or selling'}
            </p>
          </div>

          {/* ── social buttons ────────────── */}
          <div className="space-y-3">
            <a
              href="/api/auth/login"
              className={`flex items-center justify-center gap-3 w-full py-3 rounded-[3px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.12)] transition-all ${jb} text-xs text-white no-underline`}
            >
              <i className="fa-brands fa-google text-sm" />
              Continue with Google
            </a>

            <a
              href="/api/auth/login"
              className={`flex items-center justify-center gap-3 w-full py-3 rounded-[3px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.12)] transition-all ${jb} text-xs text-white no-underline`}
            >
              <i className="fa-brands fa-github text-sm" />
              Continue with GitHub
            </a>
          </div>

          {/* divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]" />
            <span className={`${jb} text-[10px] uppercase tracking-[.2em] text-[rgba(240,240,240,0.12)]`}>or</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.04)]" />
          </div>

          {/* ── email / password form ─────── */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = '/api/auth/login';
            }}
            className="space-y-4"
          >
            {/* Name field (signup only) */}
            {mode === 'signup' && (
              <div>
                <label className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.12)] block mb-2`}>
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  className={`w-full bg-[rgba(10,10,10,0.8)] border border-[rgba(255,255,255,0.06)] rounded-[3px] px-4 py-2.5 text-sm text-white placeholder:text-[rgba(240,240,240,0.12)] ${jb} focus:border-[rgba(0,255,255,0.4)] focus:outline-none transition`}
                />
              </div>
            )}

            <div>
              <label className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.12)] block mb-2`}>
                Email
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className={`w-full bg-[rgba(10,10,10,0.8)] border border-[rgba(255,255,255,0.06)] rounded-[3px] px-4 py-2.5 text-sm text-white placeholder:text-[rgba(240,240,240,0.12)] ${jb} focus:border-[rgba(0,255,255,0.4)] focus:outline-none transition`}
              />
            </div>

            <div>
              <label className={`${jb} text-[10px] uppercase tracking-[.15em] text-[rgba(240,240,240,0.12)] block mb-2`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-[rgba(10,10,10,0.8)] border border-[rgba(255,255,255,0.06)] rounded-[3px] px-4 py-2.5 pr-10 text-sm text-white placeholder:text-[rgba(240,240,240,0.12)] ${jb} focus:border-[rgba(0,255,255,0.4)] focus:outline-none transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(240,240,240,0.2)] hover:text-[#00ffff] transition-colors"
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-[3px] bg-[#00ffff] text-[#050505] ${syne} text-sm font-bold tracking-wider hover:shadow-[0_0_24px_rgba(0,255,255,.35)] transition-shadow cursor-pointer`}
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* footer links */}
          <div className="space-y-3 text-center">
            <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.15)]`}>
              {mode === 'signin' ? (
                <>Don&rsquo;t have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-[#00ffff] hover:underline bg-transparent border-none cursor-pointer">
                    Sign up
                  </button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={() => setMode('signin')} className="text-[#00ffff] hover:underline bg-transparent border-none cursor-pointer">
                    Sign in
                  </button>
                </>
              )}
            </p>
            <div className="flex items-center justify-center gap-2">
              <i className="fa-solid fa-shield-halved text-[10px] text-[rgba(240,240,240,0.1)]" />
              <p className={`${jb} text-[10px] text-[rgba(240,240,240,0.1)]`}>
                Secured by <span className="text-[rgba(240,240,240,0.2)]">Auth0</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
