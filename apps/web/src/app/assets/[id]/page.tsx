'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchAssetById } from '@/lib/api';

interface Asset {
  id: string;
  name: string;
  description: string;
  price: number;
  previewUrls: string[];
  seller: { id: string; name: string };
  category: { id: string; name: string; slug: string };
}

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    const loadAsset = async () => {
      try {
        const data = await fetchAssetById(params.id);
        setAsset(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load asset');
      } finally {
        setLoading(false);
      }
    };

    loadAsset();
  }, [params.id]);

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
            userId: 'user-1', // Mock user ID for now
          }),
        }
      );

      if (!response.ok) throw new Error('Failed to create checkout session');

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Checkout failed');
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">Loading asset...</p>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bebas tracking-wider">
              PROSETS
            </Link>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <p className="text-red-400">{error || 'Asset not found'}</p>
          <Link href="/catalogue" className="text-white hover:underline mt-4 inline-block">
            Back to Catalogue
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bebas tracking-wider">
            PROSETS
          </Link>
          <Link
            href="/catalogue"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Back to Catalogue
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-900 border border-gray-800 rounded overflow-hidden">
              {asset.previewUrls.length > 0 ? (
                <img
                  src={asset.previewUrls[currentImageIndex]}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23374151" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3ENo Preview%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  No Preview
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {asset.previewUrls.length > 1 && (
              <div className="flex gap-2">
                {asset.previewUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 rounded border transition ${
                      currentImageIndex === idx
                        ? 'border-white'
                        : 'border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"%3E%3Crect fill="%23374151" width="80" height="80"/%3E%3C/svg%3E';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <span className="text-xs font-dm-mono uppercase tracking-wider text-gray-500">
                {asset.category.name}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-5xl font-bebas tracking-wider mb-2">
                {asset.name}
              </h1>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-300 leading-relaxed">{asset.description}</p>
            </div>

            {/* Seller */}
            <div className="border-t border-b border-gray-800 py-4">
              <p className="text-sm text-gray-400 mb-1">Seller</p>
              <p className="text-lg font-fraunces">{asset.seller.name}</p>
            </div>

            {/* Price & CTA */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bebas tracking-wider">
                  ${asset.price.toFixed(2)}
                </span>
                <span className="text-gray-500 text-sm">USD</span>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={isCheckingOut}
                className="w-full px-6 py-4 bg-white text-black font-bebas text-lg tracking-wider rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isCheckingOut ? 'Processing...' : 'BUY NOW'}
              </button>
            </div>

            {/* Info */}
            <div className="bg-gray-900 border border-gray-800 rounded p-4 space-y-2 text-sm">
              <p className="text-gray-400">
                ✓ Secure payment via Stripe
              </p>
              <p className="text-gray-400">
                ✓ Instant download after purchase
              </p>
              <p className="text-gray-400">
                ✓ Lifetime access to your files
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
