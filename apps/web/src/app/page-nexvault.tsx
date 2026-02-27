'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AssetCard } from '@/components/ui/asset-card';
import { NeonButton } from '@/components/ui/neon-button';
import { fetchAssets } from '@/lib/api';

interface Asset {
  id: string;
  name: string;
  description: string;
  price: number;
  previewUrls: string[];
  seller: { name: string };
  category: { name: string };
}

const ASSET_TYPES = ['3D Models', 'Code Snippets', 'Notion Templates', 'UI Kits'];
const PRICE_RANGES = [
  { label: 'Under $20', min: 0, max: 20 },
  { label: '$20 - $50', min: 20, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100+', min: 100, max: Infinity },
];

export default function NexVaultHomepage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await fetchAssets({});
        // Handle both array and object responses
        const assetsArray = Array.isArray(data) ? data : data?.assets || data?.data || [];
        setAssets(assetsArray);
      } catch (error) {
        console.error('Failed to load assets:', error);
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, []);

  const filteredAssets = assets.filter((asset) => {
    const matchesCategory = !selectedCategory || asset.category.name === selectedCategory;
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesPrice = true;
    if (selectedPrice) {
      const range = PRICE_RANGES.find((r) => r.label === selectedPrice);
      if (range) {
        matchesPrice = asset.price >= range.min && asset.price <= range.max;
      }
    }

    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-syne font-black text-2xl tracking-wider">
            NEX<span className="text-cyan-400">VAULT</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <NeonButton variant="ghost" size="sm">
                Dashboard
              </NeonButton>
            </Link>
            <Link href="/seller">
              <NeonButton variant="ghost" size="sm">
                Sell
              </NeonButton>
            </Link>
            <Link href="/admin">
              <NeonButton variant="ghost" size="sm">
                Admin
              </NeonButton>
            </Link>
            <Link href="/auth/login">
              <NeonButton variant="secondary" size="sm">
                Sign In
              </NeonButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(0deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 255, 0.05) 25%, rgba(0, 255, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 255, 0.05) 75%, rgba(0, 255, 255, 0.05) 76%, transparent 77%, transparent)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h1 className="font-syne font-black text-6xl md:text-7xl tracking-tighter leading-tight">
            Premium Digital Assets
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400">
              Engineered for Creators
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover curated 3D models, code snippets, Notion templates, and UI kits from the world's
            top creators. Instant access. Secure checkout. Zero friction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/catalogue">
              <NeonButton variant="primary" size="lg">
                Explore Catalog
              </NeonButton>
            </Link>
            <Link href="/seller">
              <NeonButton variant="secondary" size="lg">
                Become a Seller
              </NeonButton>
            </Link>
          </div>

          {/* Asset type tags */}
          <div className="flex flex-wrap justify-center gap-2 pt-8">
            {ASSET_TYPES.map((type) => (
              <span
                key={type}
                className="px-3 py-1 text-sm font-mono border border-gray-700 rounded-sm text-gray-400 hover:text-cyan-300 hover:border-cyan-500 transition-colors cursor-pointer"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Featured Assets Preview */}
          <div className="mb-12">
            <h2 className="text-4xl font-syne font-bold tracking-wide mb-2">Featured Assets</h2>
            <p className="text-gray-400">Handpicked selections from our top creators</p>
          </div>

          {/* Search & Filters */}
          <div className="mb-12 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search assets by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all"
              />
              <span className="absolute right-4 top-3.5 text-gray-500">🔍</span>
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div className="space-y-3">
                <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-gray-400">
                  Category
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-sm transition-all ${
                      selectedCategory === null
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All Categories
                  </button>
                  {ASSET_TYPES.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-sm transition-all ${
                        selectedCategory === category
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-gray-400">
                  Price Range
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedPrice(null)}
                    className={`block w-full text-left px-3 py-2 rounded-sm transition-all ${
                      selectedPrice === null
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    All Prices
                  </button>
                  {PRICE_RANGES.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPrice(range.label)}
                      className={`block w-full text-left px-3 py-2 rounded-sm transition-all ${
                        selectedPrice === range.label
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results count */}
            <p className="text-sm text-gray-500 font-mono">
              Showing {filteredAssets.length} of {assets.length} assets
            </p>
          </div>

          {/* Asset Grid - Limited to 6 items */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-900/50 border border-gray-800 rounded-sm h-80 animate-pulse"
                />
              ))}
            </div>
          ) : filteredAssets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredAssets.slice(0, 6).map((asset) => (
                  <AssetCard
                    key={asset.id}
                    id={asset.id}
                    title={asset.name}
                    description={asset.description}
                    price={asset.price}
                    category={asset.category.name}
                    previewUrl={asset.previewUrls[0] || '/placeholder.jpg'}
                    seller={asset.seller.name}
                  />
                ))}
              </div>

              {/* View All CTA */}
              <div className="text-center">
                <Link href="/catalogue">
                  <NeonButton variant="secondary" size="lg">
                    View All Assets ({assets.length})
                  </NeonButton>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No assets found matching your filters.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2026 NexVault. Premium digital assets for creators.</p>
          <p className="mt-2">Secured by Auth0 • Powered by Stripe</p>
        </div>
      </footer>
    </div>
  );
}
