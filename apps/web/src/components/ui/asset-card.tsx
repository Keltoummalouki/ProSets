'use client';

import Link from 'next/link';
import { NeonButton } from './neon-button';
import { useState } from 'react';

interface AssetCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  previewUrl: string;
  seller: string;
}

export function AssetCard({
  id,
  title,
  description,
  price,
  category,
  previewUrl,
  seller,
}: AssetCardProps) {
  const [imageError, setImageError] = useState(false);

  const categoryColors: Record<string, string> = {
    '3D Models': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
    'Code Snippets': 'bg-amber-500/20 text-amber-300 border-amber-500/50',
    'Notion Templates': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    'UI Kits': 'bg-pink-500/20 text-pink-300 border-pink-500/50',
  };

  return (
    <div className="group relative bg-gray-900/50 border border-gray-800 rounded-sm overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]">
      {/* Preview Image */}
      <div className="relative h-48 bg-gray-950 overflow-hidden">
        {!imageError ? (
          <img
            src={previewUrl}
            alt={title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <img
            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%231a1a2e' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%23666' text-anchor='middle' dominant-baseline='middle'%3EAsset Preview%3C/text%3E%3C/svg%3E"
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono font-bold px-2 py-1 border rounded-sm ${
              categoryColors[category] || 'bg-gray-700/50 text-gray-300 border-gray-600'
            }`}
          >
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-syne font-bold text-lg text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-2">{description}</p>

        {/* Seller */}
        <p className="text-xs text-gray-500 font-mono">by {seller}</p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <span className="font-syne font-bold text-xl text-cyan-400">${price.toFixed(2)}</span>
          <Link href={`/assets/${id}`}>
            <NeonButton variant="primary" size="sm">
              View
            </NeonButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
