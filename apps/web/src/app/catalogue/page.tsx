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

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rated', value: 'rated' },
];

export default function CataloguePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const itemsPerPage = 12;

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

  // Sort assets
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'popular':
        return Math.random() - 0.5; // Placeholder
      case 'rated':
        return Math.random() - 0.5; // Placeholder
      case 'newest':
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedAssets.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = sortedAssets.slice(startIdx, startIdx + itemsPerPage);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedPrice(null);
    setSortBy('newest');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const activeFiltersCount = [selectedCategory, selectedPrice].filter(Boolean).length;

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-syne font-bold tracking-wider">
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
            <Link href="/auth/login">
              <NeonButton variant="secondary" size="sm">
                Sign In
              </NeonButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 h-full flex flex-col">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-5xl font-syne font-bold tracking-wide mb-2">
              Asset Catalogue
            </h1>
            <p className="text-gray-400">
              Discover premium digital assets from top creators worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search assets by name, creator, or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-gray-950 border border-gray-800 rounded-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all"
              />
              <span className="absolute right-4 top-3.5 text-gray-500">🔍</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block overflow-y-auto">
              <div className="space-y-6 sticky top-0">
                {/* Filter Header */}
                <div className="flex items-center justify-between">
                  <h2 className="font-syne font-bold text-lg">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Clear ({activeFiltersCount})
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-4 space-y-3">
                  <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-gray-400">
                    Category
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(null);
                        setCurrentPage(1);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-sm transition-all text-sm ${
                        selectedCategory === null
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      All Categories
                    </button>
                    {ASSET_TYPES.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-sm transition-all text-sm ${
                          selectedCategory === category
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-sm p-4 space-y-3">
                  <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-gray-400">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setSelectedPrice(null);
                        setCurrentPage(1);
                      }}
                      className={`block w-full text-left px-3 py-2 rounded-sm transition-all text-sm ${
                        selectedPrice === null
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                      }`}
                    >
                      All Prices
                    </button>
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => {
                          setSelectedPrice(range.label);
                          setCurrentPage(1);
                        }}
                        className={`block w-full text-left px-3 py-2 rounded-sm transition-all text-sm ${
                          selectedPrice === range.label
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seller CTA */}
                <Link href="/seller">
                  <NeonButton variant="secondary" size="md" className="w-full">
                    Become a Seller
                  </NeonButton>
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8 overflow-y-auto">
              {/* Controls Bar */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden px-3 py-2 bg-gray-900 border border-gray-800 rounded-sm text-sm text-gray-300 hover:text-white transition"
                  >
                    ⚙️ Filters
                  </button>
                  <p className="text-sm text-gray-500 font-mono">
                    {sortedAssets.length} result{sortedAssets.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-gray-950 border border-gray-800 rounded-sm text-sm text-white focus:border-cyan-500 focus:outline-none transition"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Filters */}
              {showMobileFilters && (
                <div className="lg:hidden space-y-4 bg-gray-900/50 border border-gray-800 rounded-sm p-4">
                  <div>
                    <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-gray-400 mb-3">
                      Category
                    </h3>
                    <div className="space-y-2">
                      {['All Categories', ...ASSET_TYPES].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat === 'All Categories' ? null : cat);
                            setCurrentPage(1);
                            setShowMobileFilters(false);
                          }}
                          className={`block w-full text-left px-3 py-2 rounded-sm transition-all text-sm ${
                            (cat === 'All Categories' && selectedCategory === null) ||
                            selectedCategory === cat
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-syne font-bold text-sm uppercase tracking-wider text-gray-400 mb-3">
                      Price
                    </h3>
                    <div className="space-y-2">
                      {['All Prices', ...PRICE_RANGES.map((r) => r.label)].map((price) => (
                        <button
                          key={price}
                          onClick={() => {
                            setSelectedPrice(price === 'All Prices' ? null : price);
                            setCurrentPage(1);
                            setShowMobileFilters(false);
                          }}
                          className={`block w-full text-left px-3 py-2 rounded-sm transition-all text-sm ${
                            (price === 'All Prices' && selectedPrice === null) ||
                            selectedPrice === price
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          {price}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Asset Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-900/50 border border-gray-800 rounded-sm h-80 animate-pulse"
                    />
                  ))}
                </div>
              ) : paginatedAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedAssets.map((asset) => (
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
              ) : (
                <div className="text-center py-16 bg-gray-900/50 border border-gray-800 rounded-sm">
                  <p className="text-gray-400 text-lg mb-4">No assets found matching your filters.</p>
                  <NeonButton
                    variant="secondary"
                    size="md"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </NeonButton>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-sm text-sm text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      const isNear = Math.abs(page - currentPage) <= 1;
                      const isFirst = page === 1;
                      const isLast = page === totalPages;

                      if (!isNear && !isFirst && !isLast) return null;

                      if (!isNear && (isFirst || isLast)) {
                        return (
                          <span key={page} className="px-2 text-gray-500">
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-sm transition-all text-sm ${
                            currentPage === page
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500'
                              : 'bg-gray-900 border border-gray-800 text-gray-300 hover:text-white'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-sm text-sm text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Results Info */}
              <div className="text-center text-sm text-gray-500 font-mono pb-4">
                Showing {startIdx + 1} to {Math.min(startIdx + itemsPerPage, sortedAssets.length)} of{' '}
                {sortedAssets.length} assets
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm space-y-2">
          <p>© 2026 NexVault. Premium digital assets for creators.</p>
          <p>Secured by Auth0 • Powered by Stripe • Hosted on AWS</p>
        </div>
      </footer>
    </div>
  );
}
