'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { fetchAssetById } from '@/lib/api';
import { NeonButton } from '@/components/ui/neon-button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';

interface Asset {
  id: string;
  name: string;
  description: string;
  price: number;
  previewUrls: string[];
  seller: { id: string; name: string };
  category: { id: string; name: string; slug: string };
}

const syne = 'font-[family-name:var(--font-syne)]';
const jb = 'font-[family-name:var(--font-jetbrains)]';

const catVariant = (name: string) => {
  if (name === '3D Models') return 'cyan' as const;
  if (name === 'Code Snippets') return 'amber' as const;
  if (name === 'Notion Templates') return 'purple' as const;
  return 'cyan' as const;
};

/* ── Mock related assets ── */
const RELATED = [
  { id: 'r1', name: 'Brutalist Architecture Pack', price: 49, category: '3D Model', image: '/preview-3d-city.png' },
  { id: 'r2', name: 'API Boilerplate NestJS', price: 12, category: 'Code', image: '/preview-code-snippet.png' },
  { id: 'r3', name: 'Ops HQ Notion Kit', price: 24, category: 'Template', image: '/preview-notion-template.png' },
];

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const loadAsset = async () => {
      try { setAsset(await fetchAssetById(resolvedParams.id)); }
      catch (err) { setError(err instanceof Error ? err.message : 'Failed to load asset'); }
      finally { setLoading(false); }
    };
    loadAsset();
  }, [resolvedParams.id]);

  const handleBuyNow = async () => {
    if (!asset) return;
    setIsCheckingOut(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/checkout`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: asset.id, userId: 'user-1' }),
      });
      if (!response.ok) throw new Error('Failed to create checkout session');
      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Checkout Error', text: err instanceof Error ? err.message : 'Checkout failed', confirmButtonColor: '#0FF' });
      setIsCheckingOut(false);
    }
  };

  const prevImage = () => {
    if (!asset) return;
    setCurrentImageIndex((prev) => (prev === 0 ? asset.previewUrls.length - 1 : prev - 1));
  };
  const nextImage = () => {
    if (!asset) return;
    setCurrentImageIndex((prev) => (prev === asset.previewUrls.length - 1 ? 0 : prev + 1));
  };

  /* ─── Loading / Error states ─── */
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#050505] text-[#f0f0f0] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#00ffff] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className={`text-[rgba(240,240,240,0.3)] ${jb} text-sm`}>Loading asset...</p>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="w-full min-h-screen bg-[#050505] text-[#f0f0f0] flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-16 pt-[calc(65px+4rem)]">
          <p className="text-[#ef4444] mb-4">{error || 'Asset not found'}</p>
          <Link href="/catalogue" className={`text-[#00ffff] ${jb} text-sm hover:underline`}>
            <i className="fa-solid fa-arrow-left mr-2" />Back to Catalogue
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#f0f0f0] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-16 w-full pt-[calc(65px+4rem)]">
        {/* Back */}
        <Link href="/catalogue" className={`inline-flex items-center gap-2 text-[11px] ${jb} tracking-[2px] uppercase text-[rgba(240,240,240,0.3)] hover:text-[#00ffff] transition-colors mb-10`}>
          <i className="fa-solid fa-arrow-left text-[10px]" /> Back to Catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          {/* ── Media ── */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] overflow-hidden group">
              {asset.previewUrls.length > 0 ? (
                <img
                  src={asset.previewUrls[currentImageIndex]}
                  alt={asset.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450"%3E%3Crect fill="%230a0a0a" width="600" height="450"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%23333" text-anchor="middle" dominant-baseline="middle"%3EAsset Preview%3C/text%3E%3C/svg%3E'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[rgba(240,240,240,0.1)]">
                  <i className="fa-solid fa-image text-4xl" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,5,0.4)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Carousel Arrows */}
              {asset.previewUrls.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[3px] bg-[rgba(0,0,0,0.6)] backdrop-blur border border-[rgba(255,255,255,0.1)] text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[rgba(0,255,255,0.15)] hover:border-[rgba(0,255,255,0.3)]"
                  >
                    <i className="fa-solid fa-chevron-left" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-[3px] bg-[rgba(0,0,0,0.6)] backdrop-blur border border-[rgba(255,255,255,0.1)] text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[rgba(0,255,255,0.15)] hover:border-[rgba(0,255,255,0.3)]"
                  >
                    <i className="fa-solid fa-chevron-right" />
                  </button>
                  {/* Image counter */}
                  <div className="absolute bottom-3 right-3 bg-[rgba(0,0,0,0.6)] backdrop-blur px-2 py-1 rounded-[2px]">
                    <span className={`${jb} text-[10px] text-white`}>{currentImageIndex + 1} / {asset.previewUrls.length}</span>
                  </div>
                </>
              )}
            </div>

            {asset.previewUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {asset.previewUrls.map((url, idx) => (
                  <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`shrink-0 w-20 h-20 rounded-[3px] border overflow-hidden transition-all ${currentImageIndex === idx ? 'border-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.3)]' : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)]'}`}>
                    <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%230a0a0a" width="100" height="100"/%3E%3C/svg%3E'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details Panel ── */}
          <div className="space-y-6">
            <Badge variant={catVariant(asset.category.name)}>{asset.category.name}</Badge>

            <h1 className={`${syne} text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.1]`}>{asset.name}</h1>

            {/* Price */}
            <div className="space-y-1">
              <span className={`text-[9px] ${jb} tracking-[3px] uppercase text-[rgba(240,240,240,0.2)]`}>Price</span>
              <p className={`${syne} text-5xl font-extrabold text-[#00ffff]`}>${asset.price.toFixed(2)}</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <span className={`text-[9px] ${jb} tracking-[3px] uppercase text-[rgba(240,240,240,0.2)]`}>About</span>
              <p className={`text-[13px] ${jb} leading-[1.8] text-[rgba(240,240,240,0.4)]`}>{asset.description}</p>
            </div>

            {/* Seller */}
            <div className="border-t border-[rgba(255,255,255,0.06)] pt-5">
              <span className={`text-[9px] ${jb} tracking-[3px] uppercase text-[rgba(240,240,240,0.2)] block mb-1`}>Seller</span>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[3px] bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center">
                  <i className="fa-solid fa-user text-[10px] text-[#F59E0B]" />
                </div>
                <p className={`${syne} text-base font-bold text-[#f0f0f0]`}>{asset.seller.name}</p>
              </div>
            </div>

            {/* What You Get — Extended */}
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-5 space-y-4">
              <span className={`text-[9px] ${jb} tracking-[3px] uppercase text-[rgba(240,240,240,0.2)]`}>What You Get</span>
              <ul className="space-y-2.5">
                {[
                  { icon: 'fa-download', text: 'Instant download access' },
                  { icon: 'fa-infinity', text: 'Lifetime license' },
                  { icon: 'fa-building', text: 'Commercial use allowed' },
                  { icon: 'fa-lock', text: 'Secure Stripe checkout' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5">
                    <i className={`fa-solid ${item.icon} text-[#00ffff] text-[10px] mt-1`} />
                    <span className={`text-[12px] ${jb} text-[rgba(240,240,240,0.4)]`}>{item.text}</span>
                  </li>
                ))}
              </ul>

              {/* File specs */}
              <div className="border-t border-[rgba(255,255,255,0.04)] pt-3 grid grid-cols-2 gap-3">
                {[
                  { label: 'Format', value: 'ZIP Archive' },
                  { label: 'Size', value: '~24 MB' },
                  { label: 'License', value: 'Commercial' },
                  { label: 'Updates', value: 'Lifetime' },
                ].map((spec) => (
                  <div key={spec.label}>
                    <span className={`text-[8px] ${jb} tracking-[2px] uppercase text-[rgba(240,240,240,0.15)]`}>{spec.label}</span>
                    <p className={`text-[11px] ${jb} text-[rgba(240,240,240,0.5)] mt-0.5`}>{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Download functionality coming soon */}
            <div className="bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)] rounded-[3px] p-4 flex items-start gap-3">
              <i className="fa-solid fa-hourglass-end text-[#F59E0B] text-sm mt-0.5 flex-shrink-0" />
              <div>
                <p className={`text-[11px] ${jb} tracking-[1px] uppercase text-[#F59E0B] font-semibold mb-1`}>Coming Soon</p>
                <p className={`text-[12px] ${jb} text-[rgba(240,240,240,0.4)] leading-[1.5]`}>Download asset functionality will be available after purchase. Direct file access is coming in the next update.</p>
              </div>
            </div>

            {/* CTA */}
            <NeonButton variant="primary" size="lg" onClick={handleBuyNow} disabled={isCheckingOut} className="w-full" glow>
              {isCheckingOut ? 'Processing...' : `Buy Now — ${asset.price.toFixed(2)}`}
            </NeonButton>

            {/* Trust badges with glow icons */}
            <div className="flex items-center justify-center gap-6">
              {[
                { icon: 'fa-solid fa-lock', text: 'Stripe Secured' },
                { icon: 'fa-solid fa-bolt', text: 'Instant Delivery' },
                { icon: 'fa-solid fa-shield-halved', text: 'Auth0 Protected' },
              ].map((b) => (
                <span key={b.text} className={`flex items-center gap-1.5 text-[10px] ${jb} text-[rgba(240,240,240,0.2)]`}>
                  <i className={`${b.icon} text-[8px] text-[#00ffff]`} style={{ textShadow: '0 0 8px rgba(0,255,255,0.4)' }} /> {b.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related Assets ── */}
        <section className="mt-24">
          <div className="border-t border-[rgba(255,255,255,0.06)] pt-12 mb-8">
            <h2 className={`${syne} text-2xl font-extrabold`}>You Might Also <span className="text-[#F59E0B]">Like</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1px] bg-[rgba(255,255,255,0.06)] rounded-[3px] overflow-hidden">
            {RELATED.map((item) => (
              <Link
                key={item.id}
                href="/catalogue"
                className="group block bg-[rgba(10,10,10,0.8)] overflow-hidden no-underline transition-all duration-[350ms] hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,255,255,0.08)]"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,5,5,0.7)] to-transparent" />
                </div>
                <div className="p-5">
                  <p className={`text-[9px] ${jb} tracking-[2px] uppercase text-[rgba(240,240,240,0.25)] mb-2`}>{item.category}</p>
                  <p className={`${syne} text-[15px] font-bold text-[#f0f0f0] mb-3 group-hover:text-[#00ffff] transition-colors`}>{item.name}</p>
                  <span className={`${syne} text-xl font-extrabold text-[#00ffff]`}>${item.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
