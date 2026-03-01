'use client';

import { useState, useEffect } from 'react';
import { AssetCard } from '@/components/ui/asset-card';
import { NeonButton } from '@/components/ui/neon-button';
import { CardSkeleton } from '@/components/ui/skeletons';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
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
      if (range) matchesPrice = asset.price >= range.min && asset.price <= range.max;
    }
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'popular': return Math.random() - 0.5;
      case 'rated': return Math.random() - 0.5;
      default: return 0;
    }
  });

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

  /* ─── filter button helper ─── */
  const filterBtn = (active: boolean) =>
    `block w-full text-left px-3 py-2.5 rounded-[3px] transition-all text-[11px] font-[family-name:var(--font-jetbrains)] tracking-wide ${
      active
        ? 'bg-[rgba(0,255,255,0.08)] text-[#00ffff] border border-[rgba(0,255,255,0.4)]'
        : 'text-[rgba(240,240,240,0.4)] hover:text-[#f0f0f0] hover:bg-[rgba(255,255,255,0.04)]'
    }`;

  return (
    <div className="w-full min-h-screen bg-[#050505] text-[#f0f0f0] flex flex-col">
      <Navbar />

      <main className="flex-1 w-full pt-[65px]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          {/* ── Page Header ── */}
          <div className="mb-14 border-b border-[rgba(255,255,255,0.06)] pb-8">
            <span className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[4px] uppercase text-[rgba(240,240,240,0.25)] block mb-3">
              Browse &amp; Discover
            </span>
            <h1 className="font-[family-name:var(--font-syne)] text-[clamp(40px,5vw,64px)] font-extrabold leading-[1] mb-3">
              Asset <span className="text-[#00ffff]">Catalogue</span>
            </h1>
            <p className="text-[13px] font-[family-name:var(--font-jetbrains)] text-[rgba(240,240,240,0.35)] max-w-lg">
              Premium digital assets from top creators worldwide. Filter, preview, and buy securely.
            </p>
          </div>

          {/* ── Search ── */}
          <div className="mb-10">
            <div className="relative">
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-[rgba(240,240,240,0.25)] text-xs" />
              <input
                type="text"
                placeholder="Search assets by name, creator, or description..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[3px] text-[#f0f0f0] placeholder-[rgba(240,240,240,0.2)] font-[family-name:var(--font-jetbrains)] text-[12px] focus:outline-none focus:border-[rgba(0,255,255,0.4)] focus:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
            {/* ── Sidebar ── */}
            <aside className="hidden lg:block">
              <div className="space-y-6 sticky top-[90px]">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="font-[family-name:var(--font-syne)] font-bold text-base">Filters</h2>
                  {activeFiltersCount > 0 && (
                    <button onClick={handleClearFilters} className="text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[1px] text-[#00ffff] hover:text-[#f0f0f0] transition-colors">
                      Clear ({activeFiltersCount})
                    </button>
                  )}
                </div>

                {/* Category */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-4 space-y-2">
                  <h3 className="font-[family-name:var(--font-syne)] font-bold text-[11px] uppercase tracking-[3px] text-[rgba(240,240,240,0.25)] mb-3">Category</h3>
                  <button onClick={() => { setSelectedCategory(null); setCurrentPage(1); }} className={filterBtn(selectedCategory === null)}>All Categories</button>
                  {ASSET_TYPES.map((cat) => (
                    <button key={cat} onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }} className={filterBtn(selectedCategory === cat)}>{cat}</button>
                  ))}
                </div>

                {/* Price */}
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-4 space-y-2">
                  <h3 className="font-[family-name:var(--font-syne)] font-bold text-[11px] uppercase tracking-[3px] text-[rgba(240,240,240,0.25)] mb-3">Price Range</h3>
                  <button onClick={() => { setSelectedPrice(null); setCurrentPage(1); }} className={filterBtn(selectedPrice === null)}>All Prices</button>
                  {PRICE_RANGES.map((r) => (
                    <button key={r.label} onClick={() => { setSelectedPrice(r.label); setCurrentPage(1); }} className={filterBtn(selectedPrice === r.label)}>{r.label}</button>
                  ))}
                </div>

                {/* Seller CTA */}
                <NeonButton variant="secondary" size="md" className="w-full" onClick={() => window.location.href = '/seller'}>
                  Become a Seller
                </NeonButton>
              </div>
            </aside>

            {/* ── Main Content ── */}
            <div className="space-y-8">
              {/* Controls */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[3px] text-[11px] font-[family-name:var(--font-jetbrains)] text-[rgba(240,240,240,0.5)] hover:text-[#f0f0f0] transition"
                  >
                    <i className="fa-solid fa-sliders mr-2" />Filters
                  </button>
                  <p className="text-[11px] font-[family-name:var(--font-jetbrains)] text-[rgba(240,240,240,0.25)]">
                    {sortedAssets.length} result{sortedAssets.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[3px] text-[11px] font-[family-name:var(--font-jetbrains)] text-[#f0f0f0] focus:border-[rgba(0,255,255,0.4)] focus:outline-none transition appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              {/* Mobile Filters */}
              {showMobileFilters && (
                <div className="lg:hidden space-y-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px] p-5">
                  <div>
                    <h3 className="font-[family-name:var(--font-syne)] font-bold text-[11px] uppercase tracking-[3px] text-[rgba(240,240,240,0.25)] mb-3">Category</h3>
                    <div className="space-y-2">
                      {['All Categories', ...ASSET_TYPES].map((cat) => (
                        <button key={cat} onClick={() => { setSelectedCategory(cat === 'All Categories' ? null : cat); setCurrentPage(1); setShowMobileFilters(false); }} className={filterBtn((cat === 'All Categories' && !selectedCategory) || selectedCategory === cat)}>{cat}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-[family-name:var(--font-syne)] font-bold text-[11px] uppercase tracking-[3px] text-[rgba(240,240,240,0.25)] mb-3">Price</h3>
                    <div className="space-y-2">
                      {['All Prices', ...PRICE_RANGES.map((r) => r.label)].map((p) => (
                        <button key={p} onClick={() => { setSelectedPrice(p === 'All Prices' ? null : p); setCurrentPage(1); setShowMobileFilters(false); }} className={filterBtn((p === 'All Prices' && !selectedPrice) || selectedPrice === p)}>{p}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Asset Grid ── */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
              ) : paginatedAssets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                <div className="text-center py-20 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-[3px]">
                  <i className="fa-solid fa-box-open text-3xl text-[rgba(240,240,240,0.15)] mb-4 block" />
                  <p className="text-[rgba(240,240,240,0.4)] font-[family-name:var(--font-jetbrains)] text-sm mb-5">No assets found matching your filters.</p>
                  <NeonButton variant="secondary" size="md" onClick={handleClearFilters}>Clear Filters</NeonButton>
                </div>
              )}

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[3px] text-[11px] font-[family-name:var(--font-jetbrains)] text-[rgba(240,240,240,0.4)] hover:text-[#f0f0f0] disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    <i className="fa-solid fa-chevron-left mr-1" /> Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      const isNear = Math.abs(page - currentPage) <= 1;
                      const isFirst = page === 1;
                      const isLast = page === totalPages;
                      if (!isNear && !isFirst && !isLast) return null;
                      if (!isNear && (isFirst || isLast)) return <span key={page} className="px-2 text-[rgba(240,240,240,0.15)] text-xs">...</span>;
                      return (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-[3px] text-[11px] font-[family-name:var(--font-jetbrains)] transition-all ${currentPage === page ? 'bg-[rgba(0,255,255,0.1)] text-[#00ffff] border border-[rgba(0,255,255,0.4)]' : 'bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-[rgba(240,240,240,0.4)] hover:text-[#f0f0f0]'}`}>
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[3px] text-[11px] font-[family-name:var(--font-jetbrains)] text-[rgba(240,240,240,0.4)] hover:text-[#f0f0f0] disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    Next <i className="fa-solid fa-chevron-right ml-1" />
                  </button>
                </div>
              )}

              {/* Results info */}
              {sortedAssets.length > 0 && (
                <div className="text-center text-[10px] font-[family-name:var(--font-jetbrains)] tracking-[2px] text-[rgba(240,240,240,0.15)] pb-4">
                  Showing {startIdx + 1}–{Math.min(startIdx + itemsPerPage, sortedAssets.length)} of {sortedAssets.length} assets
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
