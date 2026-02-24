'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAssets, fetchCategories } from '@/lib/api';

interface Asset {
  id: string;
  name: string;
  description: string;
  price: number;
  previewUrls: string[];
  seller: { id: string; name: string };
  category: { id: string; name: string; slug: string };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PaginationData {
  assets: Asset[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function CataloguePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Load assets with filters
  useEffect(() => {
    const loadAssets = async () => {
      setLoading(true);
      setError(null);
      try {
        const data: PaginationData = await fetchAssets({
          category: selectedCategory,
          search: searchQuery,
          page: currentPage,
          limit: 12,
        });
        setAssets(data.assets);
        setPagination(data.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assets');
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [selectedCategory, searchQuery, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug === selectedCategory ? '' : slug);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bebas tracking-wider">
            PROSETS
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-5xl font-bebas tracking-wider mb-2">CATALOGUE</h1>
          <p className="text-gray-400">Discover premium digital assets</p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-white transition"
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-dm-mono uppercase tracking-wider mb-3 text-gray-400">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('')}
                className={`px-4 py-2 rounded text-sm font-dm-mono transition ${
                  selectedCategory === ''
                    ? 'bg-white text-black'
                    : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-white'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-4 py-2 rounded text-sm font-dm-mono transition ${
                    selectedCategory === cat.slug
                      ? 'bg-white text-black'
                      : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading assets...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No assets found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {assets.map((asset) => (
                <Link
                  key={asset.id}
                  href={`/assets/${asset.id}`}
                  className="group cursor-pointer"
                >
                  <div className="bg-gray-900 border border-gray-800 rounded overflow-hidden hover:border-white transition">
                    {/* Preview Image */}
                    <div className="aspect-video bg-gray-800 overflow-hidden relative">
                      {asset.previewUrls.length > 0 ? (
                        <img
                          src={asset.previewUrls[0]}
                          alt={asset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23374151" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-size="24" fill="%239CA3AF" text-anchor="middle" dominant-baseline="middle"%3ENo Preview%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          No Preview
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs font-dm-mono uppercase tracking-wider text-gray-500">
                          {asset.category.name}
                        </span>
                      </div>
                      <h3 className="text-lg font-fraunces mb-2 line-clamp-2 group-hover:text-white transition">
                        {asset.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                        {asset.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bebas tracking-wider">
                          ${asset.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500">
                          by {asset.seller.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-white transition"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded text-sm transition ${
                          currentPage === page
                            ? 'bg-white text-black'
                            : 'bg-gray-900 border border-gray-700 hover:border-white'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(pagination.pages, currentPage + 1))
                  }
                  disabled={currentPage === pagination.pages}
                  className="px-4 py-2 bg-gray-900 border border-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-white transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
