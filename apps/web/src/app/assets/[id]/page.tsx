'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { fetchAssetById } from '@/lib/api';
import { NeonButton } from '@/components/ui/neon-button';

interface Asset {
  id: string;
  name: string;
  description: string;
  price: number;
  previewUrls: string[];
  seller: { id: string; name: string };
  category: { id: string; name: string; slug: string };
}

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const loadAsset = async () => {
      try {
        const data = await fetchAssetById(resolvedParams.id);
        setAsset(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load asset');
      } finally {
        setLoading(false);
      }
    };

    loadAsset();
  }, [resolvedParams.id]);

  const handleBuyNow = async () => {
    if (!asset) return;

    setIsCheckingOut(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assetId: asset.id,
            userId: 'user-1',
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Checkout Error',
        text: err instanceof Error ? err.message : 'Checkout failed',
        confirmButtonColor: '#0FF',
      });
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading asset...</p>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="w-full h-screen bg-black text-white flex flex-col">
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-syne font-bold tracking-wider">
              NEXVAULT
            </Link>
          </div>
        </header>
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full overflow-hidden">
          <p className="text-red-400">{error || 'Asset not found'}</p>
          <Link href="/catalogue" className="text-cyan-400 hover:text-cyan-300 mt-4 inline-block">
            ← Back to Catalogue
          </Link>
        </main>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    '3D Models': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    'Code Snippets': 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    'Notion Templates': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    'UI Kits': 'bg-pink-500/20 text-pink-300 border-pink-500/50',
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-syne font-bold tracking-wider">
            NEXVAULT
          </Link>
          <Link
            href="/catalogue"
            className="text-sm text-gray-400 hover:text-cyan-400 transition"
          >
            ← Back to Catalogue
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Media Preview - Full Width Left */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-950 border border-gray-800 rounded-sm overflow-hidden group">
              {asset.previewUrls.length > 0 ? (
                <img
                  src={asset.previewUrls[currentImageIndex]}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"%3E%3Crect fill="%231a1a2e" width="600" height="600"/%3E%3Ctext x="50%25" y="50%25" font-size="32" fill="%23666" text-anchor="middle" dominant-baseline="middle"%3EAsset Preview%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  No Preview Available
                </div>
              )}
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
            </div>

            {/* Thumbnails */}
            {asset.previewUrls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {asset.previewUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-24 h-24 rounded-sm border transition ${
                      currentImageIndex === idx
                        ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover rounded-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3C/svg%3E';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Panel - Right Sidebar */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span
                className={`text-xs font-mono font-bold px-3 py-1.5 border rounded-sm inline-block ${
                  categoryColors[asset.category.name] ||
                  'bg-gray-700/50 text-gray-300 border-gray-600'
                }`}
              >
                {asset.category.name}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-4xl font-syne font-bold tracking-wide leading-tight">
                {asset.name}
              </h1>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">Price</p>
              <p className="text-5xl font-syne font-bold text-cyan-400">
                ${asset.price.toFixed(2)}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-sm text-gray-500 font-mono uppercase tracking-wider">About</p>
              <p className="text-gray-300 leading-relaxed text-sm">{asset.description}</p>
            </div>

            {/* Seller Info */}
            <div className="border-t border-gray-800 pt-4">
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">
                Seller
              </p>
              <p className="text-lg font-syne font-bold text-white">{asset.seller.name}</p>
            </div>

            {/* What You Get */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-4 space-y-3">
              <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                What You Get
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>Instant download access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>Lifetime license</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>Commercial use allowed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>Secure Stripe checkout</span>
                </li>
              </ul>
            </div>

            {/* CTA Button */}
            <NeonButton
              variant="primary"
              size="lg"
              onClick={handleBuyNow}
              disabled={isCheckingOut}
              className="w-full"
            >
              {isCheckingOut ? 'Processing...' : 'Buy Now'}
            </NeonButton>

            {/* Trust Badges */}
            <div className="space-y-2 text-xs text-gray-500 text-center">
              <p>🔒 Secured by Stripe</p>
              <p>⚡ Instant delivery</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
