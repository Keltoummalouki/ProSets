"use client";

import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { useEffect, useRef } from "react";

/* ─── data ─── */
const TICKER_ITEMS = [
  "3D Models", "Code Snippets", "Notion Templates", "UI Kits",
  "Shaders", "Motion Presets", "Design Systems",
  "3D Models", "Code Snippets", "Notion Templates", "UI Kits",
  "Shaders", "Motion Presets", "Design Systems",
];

const MARQUEE_ITEMS = [
  "Secure Downloads", "Instant Access", "Stripe Protected",
  "Presigned URLs", "No Watermarks", "Creator First",
  "Secure Downloads", "Instant Access", "Stripe Protected",
  "Presigned URLs", "No Watermarks", "Creator First",
];

const TAG_CLOUD = [
  { label: "3D Models", color: "#00ffff", size: "text-2xl", x: "10%", y: "12%", delay: "0s", dur: "8s" },
  { label: "React", color: "#F59E0B", size: "text-sm", x: "65%", y: "8%", delay: "1.2s", dur: "10s" },
  { label: "Notion", color: "#a855f7", size: "text-lg", x: "35%", y: "45%", delay: "0.5s", dur: "9s" },
  { label: "Shaders", color: "#00ffff", size: "text-xs", x: "75%", y: "50%", delay: "2s", dur: "11s" },
  { label: "UI Kits", color: "#F59E0B", size: "text-xl", x: "20%", y: "75%", delay: "0.8s", dur: "7.5s" },
  { label: "TypeScript", color: "#00ffff", size: "text-sm", x: "58%", y: "72%", delay: "1.5s", dur: "9.5s" },
  { label: "Blender", color: "#a855f7", size: "text-xs", x: "80%", y: "25%", delay: "3s", dur: "8.5s" },
  { label: "Templates", color: "#F59E0B", size: "text-base", x: "5%", y: "48%", delay: "0.3s", dur: "10.5s" },
  { label: "Motion", color: "#00ffff", size: "text-sm", x: "42%", y: "18%", delay: "2.5s", dur: "12s" },
  { label: "SVG", color: "#a855f7", size: "text-xs", x: "88%", y: "65%", delay: "1.8s", dur: "7s" },
  { label: "NestJS", color: "#F59E0B", size: "text-xs", x: "15%", y: "30%", delay: "4s", dur: "9s" },
  { label: "Figma", color: "#00ffff", size: "text-sm", x: "50%", y: "85%", delay: "0.7s", dur: "11s" },
];

const CATEGORIES = [
  { num: "01", icon: "fa-solid fa-cube", name: "3D Models", count: "328 assets", color: "#00ffff" },
  { num: "02", icon: "fa-solid fa-terminal", name: "Code Snippets", count: "512 assets", color: "#F59E0B" },
  { num: "03", icon: "fa-regular fa-file-lines", name: "Notion Templates", count: "194 assets", color: "#a855f7" },
];

const FEATURED = [
  { icon: "fa-solid fa-cube", badge: "New", badgeColor: "bg-[#F59E0B] text-[#050505]", category: "3D Model", name: "Isometric City Block Collection", price: "$42", color: "#00ffff", image: "/preview-3d-city.png" },
  { icon: "fa-solid fa-code", badge: "Hot", badgeColor: "bg-[#ef4444] text-white", category: "Code", name: "NestJS Microservices Starter", price: "$29", color: "#F59E0B", image: "/preview-code-snippet.png" },
  { icon: "fa-regular fa-file-lines", badge: null, badgeColor: "", category: "Template", name: "Second Brain Notion OS", price: "$19", color: "#a855f7", image: "/preview-notion-template.png" },
  { icon: "fa-solid fa-shapes", badge: "New", badgeColor: "bg-[#F59E0B] text-[#050505]", category: "3D Model", name: "Fluid Organic Sculpture Pack", price: "$55", color: "#00ffff", image: "/preview-3d-sculpture.png" },
];

const STEPS = [
  { num: "01", icon: "fa-solid fa-magnifying-glass", title: "Browse & Discover", desc: "Filter by category, price, or search by name. Find exactly what your project needs." },
  { num: "02", icon: "fa-solid fa-eye", title: "Preview First", desc: "Check galleries, demo videos, and detailed specs. No surprises after checkout." },
  { num: "03", icon: "fa-solid fa-dollar-sign", title: "Pay via Stripe", desc: "Card payments through Stripe. Your data never touches our servers." },
  { num: "04", icon: "fa-solid fa-bolt", title: "Instant Download", desc: "Get a time-limited presigned link. No waiting, no friction. Just your file." },
];

export default function Home() {
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 }
    );

    revealRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#f0f0f0] overflow-x-hidden">
      <Navbar />

      {/* ── TICKER ── */}
      <div className="mt-[65px] border-t border-b border-[rgba(255,255,255,0.06)] overflow-hidden py-3 bg-[#0a0a0a]">
        <div className="flex whitespace-nowrap" style={{ animation: "ticker 25s linear infinite" }}>
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-4 px-10 text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[3px] uppercase text-[rgba(240,240,240,0.2)]">
              <span className="w-1 h-1 rounded-full bg-[#00ffff]" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative">
        {/* Cyberpunk grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Scan line */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[rgba(0,255,255,0.15)] to-transparent"
            style={{ animation: "scan-line 6s linear infinite" }}
          />
        </div>

        {/* Left */}
        <div className="px-6 md:px-12 lg:px-16 py-24 lg:py-0 flex flex-col justify-center lg:border-r border-[rgba(255,255,255,0.06)] relative">
          {/* Label */}
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-[1px] bg-[#00ffff]" />
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[4px] uppercase text-[#00ffff]">
              Digital Asset Marketplace
            </span>
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-syne)] text-[clamp(56px,8vw,120px)] font-extrabold leading-[0.92] tracking-tight mb-10 overflow-hidden">
            {["Buy.", "Sell.", "Build", "Faster."].map((word, i) => (
              <span key={i} className="block overflow-hidden">
                <span
                  className={`block ${i === 3 ? "text-[#F59E0B] text-glow-amber" : ""}`}
                  style={{ animation: `slideUp 0.9s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.12}s forwards`, transform: "translateY(110%)" }}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {/* Sub */}
          <p className="text-[13px] font-[family-name:var(--font-jetbrains)] leading-[1.9] text-[rgba(240,240,240,0.45)] max-w-[400px] mb-12 opacity-0" style={{ animation: "fadeInUp 0.8s ease 0.7s forwards" }}>
            Premium digital assets — 3D models, code snippets, Notion templates — bought, sold, and delivered securely. No middlemen. Instant access after payment.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 opacity-0" style={{ animation: "fadeInUp 0.8s ease 0.85s forwards" }}>
            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#00ffff] text-[#050505] font-[family-name:var(--font-jetbrains)] text-[11px] font-semibold tracking-[2px] uppercase rounded-[3px] no-underline transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] hover:-translate-y-[2px]"
            >
              <i className="fa-solid fa-arrow-right text-xs" />
              Browse Catalogue
            </Link>
            <Link
              href="/seller"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-transparent text-[#f0f0f0] border border-[rgba(0,255,255,0.3)] font-[family-name:var(--font-jetbrains)] text-[11px] tracking-[2px] uppercase rounded-[3px] no-underline transition-all duration-300 hover:bg-[rgba(0,255,255,0.06)] hover:border-[#00ffff] hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:-translate-y-[2px]"
            >
              Sell Your Work
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-auto pt-16 pb-12 opacity-0" style={{ animation: "fadeInUp 0.8s ease 1s forwards" }}>
            {[
              { num: "2.4K", label: "Assets Listed" },
              { num: "840", label: "Creators" },
              { num: "99%", label: "Secure Delivery" },
            ].map((s) => (
              <div key={s.label}>
                <span className="block font-[family-name:var(--font-syne)] text-3xl font-extrabold text-[#f0f0f0]">{s.num}</span>
                <span className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.25)]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Animated Tag Cloud */}
        <div className="hidden lg:flex relative bg-[#0a0a0a] overflow-hidden items-center justify-center">
          {/* Grid backdrop */}
          <div
            className="absolute inset-0 opacity-[.03]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(0,255,255,0.12) 0%, transparent 70%)',
            }}
          />
          {/* Ambient glow spots */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[radial-gradient(circle,rgba(0,255,255,0.06),transparent_70%)] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[radial-gradient(circle,rgba(245,158,11,0.05),transparent_70%)]" style={{ animation: "float 4s ease-in-out 1s infinite" }} />

          {/* Tag Cloud */}
          {TAG_CLOUD.map((tag, i) => (
            <span
              key={i}
              className={`absolute font-[family-name:var(--font-syne)] font-bold ${tag.size} select-none pointer-events-none`}
              style={{
                left: tag.x,
                top: tag.y,
                color: tag.color,
                opacity: 0.5,
                animation: `${i % 2 === 0 ? 'orbit' : 'orbit-reverse'} ${tag.dur} ease-in-out ${tag.delay} infinite`,
                textShadow: `0 0 20px ${tag.color}40`,
              }}
            >
              {tag.label}
            </span>
          ))}

          {/* Center element */}
          <div className="relative z-10 w-32 h-32 border border-[rgba(0,255,255,0.15)] rounded-[3px] flex items-center justify-center bg-[rgba(5,5,5,0.6)] backdrop-blur-sm" style={{ animation: "glow-pulse 3s ease-in-out infinite" }}>
            <span className="font-[family-name:var(--font-syne)] text-5xl font-extrabold text-[#00ffff] text-glow-cyan">P</span>
          </div>
        </div>
      </section>

      {/* ── MARQUEE BAND ── */}
      <div className="border-t border-b border-[rgba(255,255,255,0.06)] py-5 overflow-hidden bg-[#00ffff]">
        <div className="flex whitespace-nowrap" style={{ animation: "ticker 18s linear infinite" }}>
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-6 px-8 font-[family-name:var(--font-syne)] text-lg font-bold tracking-[3px] text-[#050505]">
              {item}
              <span className="text-[#F59E0B] text-xs"><i className="fa-solid fa-star" /></span>
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section
        ref={addRevealRef}
        className="px-6 md:px-12 py-24 lg:py-32 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <span className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[4px] uppercase text-[rgba(240,240,240,0.25)] block mb-3">Browse by type</span>
              <h2 className="font-[family-name:var(--font-syne)] text-[clamp(40px,5vw,72px)] font-extrabold leading-[1]">
                What are you<br /><span className="text-[#F59E0B]">building?</span>
              </h2>
            </div>
            <Link href="/catalogue" className="flex items-center gap-2 text-[11px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.35)] hover:text-[#f0f0f0] transition-colors no-underline">
              All Categories <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-[rgba(255,255,255,0.06)] rounded-[3px] overflow-hidden">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.num}
                href="/catalogue"
                className="group bg-[rgba(10,10,10,0.8)] backdrop-blur-md p-10 flex flex-col gap-5 relative overflow-hidden no-underline transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(0,255,255,0.1)]"
              >
                <span className="absolute top-3 right-5 font-[family-name:var(--font-syne)] text-[72px] font-extrabold text-[rgba(255,255,255,0.03)] leading-none">{cat.num}</span>
                <div className="w-12 h-12 border border-[rgba(255,255,255,0.08)] rounded-[3px] flex items-center justify-center text-xl" style={{ color: cat.color }}>
                  <i className={cat.icon} />
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold text-[#f0f0f0]">{cat.name}</h3>
                <p className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.25)]">{cat.count}</p>
                <div className="mt-auto text-sm transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: cat.color }}>
                  <i className="fa-solid fa-arrow-up-right" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,255,255,0.06)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DROPS ── */}
      <section
        ref={addRevealRef}
        className="px-6 md:px-12 pb-24 lg:pb-32 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-16 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <span className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[4px] uppercase text-[rgba(240,240,240,0.25)] block mb-3">Handpicked this week</span>
              <h2 className="font-[family-name:var(--font-syne)] text-[clamp(40px,5vw,72px)] font-extrabold leading-[1]">
                Featured<br /><span className="text-[#F59E0B]">Drops</span>
              </h2>
            </div>
            <Link href="/catalogue" className="flex items-center gap-2 text-[11px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.35)] hover:text-[#f0f0f0] transition-colors no-underline">
              View All <i className="fa-solid fa-arrow-right text-[10px]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[rgba(255,255,255,0.06)] rounded-[3px] overflow-hidden">
            {FEATURED.map((asset, i) => (
              <Link
                key={i}
                href="/catalogue"
                className="group block bg-[rgba(10,10,10,0.8)] backdrop-blur-md overflow-hidden no-underline transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:shadow-[0_0_40px_rgba(0,255,255,0.1)]"
              >
                {/* Thumbnail with generated image */}
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,5,0.8)] via-[rgba(5,5,5,0.2)] to-transparent" />
                  {asset.badge && (
                    <span className={`absolute top-3 left-3 text-[8px] font-[family-name:var(--font-jetbrains)] font-bold tracking-[2px] uppercase px-2 py-0.5 rounded-[2px] ${asset.badgeColor}`}>
                      {asset.badge}
                    </span>
                  )}
                  {/* Hover CTAs */}
                  <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <span className="flex-1 text-center py-1.5 text-[9px] font-[family-name:var(--font-jetbrains)] uppercase tracking-[2px] bg-[rgba(0,0,0,0.7)] backdrop-blur border border-[rgba(255,255,255,0.1)] text-white rounded-[2px]">
                      Preview
                    </span>
                    <span className="flex-1 text-center py-1.5 text-[9px] font-[family-name:var(--font-jetbrains)] uppercase tracking-[2px] bg-[#00ffff] text-[#050505] font-semibold rounded-[2px]">
                      Buy Now
                    </span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-5">
                  <p className="text-[9px] font-[family-name:var(--font-jetbrains)] tracking-[2px] uppercase text-[rgba(240,240,240,0.25)] mb-2">{asset.category}</p>
                  <p className="font-[family-name:var(--font-syne)] text-[15px] font-bold text-[#f0f0f0] leading-snug mb-4 group-hover:text-[#00ffff] transition-colors">{asset.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-[family-name:var(--font-syne)] text-xl font-extrabold" style={{ color: asset.color }}>{asset.price}</span>
                    <div className="w-8 h-8 border border-[rgba(0,255,255,0.25)] rounded-[2px] flex items-center justify-center text-[#00ffff] text-xs transition-all duration-300 group-hover:bg-[#00ffff] group-hover:text-[#050505] group-hover:border-[#00ffff] group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                      <i className="fa-solid fa-plus" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        ref={addRevealRef}
        className="px-6 md:px-12 py-24 lg:py-32 bg-[#0a0a0a] border-t border-[rgba(255,255,255,0.06)] opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 pb-6 border-b border-[rgba(255,255,255,0.06)]">
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[4px] uppercase text-[rgba(240,240,240,0.25)] block mb-3">The process</span>
            <h2 className="font-[family-name:var(--font-syne)] text-[clamp(40px,5vw,72px)] font-extrabold leading-[1]">
              Dead simple<br /><span className="text-[#F59E0B]">workflow</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-[rgba(255,255,255,0.06)] rounded-[3px] overflow-hidden">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`group p-10 relative transition-all duration-300 bg-[rgba(10,10,10,0.7)] hover:bg-[rgba(0,255,255,0.03)] ${i < 3 ? "lg:border-r border-b lg:border-b-0 border-[rgba(255,255,255,0.06)]" : ""} ${i < 2 ? "sm:border-r border-[rgba(255,255,255,0.06)]" : ""}`}
              >
                <span className="absolute top-3 right-5 font-[family-name:var(--font-syne)] text-[72px] font-extrabold text-[rgba(255,255,255,0.025)] leading-none">{step.num}</span>
                <div className="w-11 h-11 border-2 border-[rgba(0,255,255,0.4)] rounded-[3px] flex items-center justify-center text-[#00ffff] text-base mb-6 transition-shadow duration-300 shadow-[0_0_10px_rgba(0,255,255,0.2)] group-hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]">
                  <i className={step.icon} />
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold text-[#f0f0f0] mb-3">{step.title}</h3>
                <p className="text-[11px] font-[family-name:var(--font-jetbrains)] leading-[1.8] text-[rgba(240,240,240,0.35)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section
        ref={addRevealRef}
        className="bg-[#f0f0f0] text-[#050505] px-6 md:px-12 py-20 lg:py-28 opacity-0 translate-y-8 transition-all duration-700"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <h2 className="font-[family-name:var(--font-syne)] text-[clamp(48px,6vw,96px)] font-extrabold leading-[0.95]">
            Ready to<br />sell your<br /><span className="text-[#00ffff]">work?</span>
          </h2>
          <div className="flex flex-col items-start lg:items-end gap-5 max-w-sm">
            <p className="text-[13px] font-[family-name:var(--font-jetbrains)] leading-[1.7] text-[rgba(5,5,5,0.5)] lg:text-right">
              Join 840+ creators already selling on Prosets. Upload once, earn forever.
            </p>
            <Link
              href="/seller"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#050505] text-[#f0f0f0] font-[family-name:var(--font-jetbrains)] text-[11px] font-semibold tracking-[2px] uppercase rounded-[3px] no-underline transition-all duration-300 hover:bg-[#F59E0B] hover:text-[#050505] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-[2px]"
            >
              <i className="fa-solid fa-arrow-right text-xs" />
              Create Seller Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
