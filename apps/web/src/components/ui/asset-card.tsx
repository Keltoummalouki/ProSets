'use client';

import Link from 'next/link';
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

const categoryConfig: Record<string, { color: string; icon: string }> = {
  '3D Models':          { color: 'text-[#00ffff] border-[rgba(0,255,255,0.3)] bg-[rgba(0,255,255,0.08)]', icon: 'fa-solid fa-cube' },
  'Code Snippets':      { color: 'text-[#F59E0B] border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.08)]', icon: 'fa-solid fa-code' },
  'Notion Templates':   { color: 'text-[#a855f7] border-[rgba(168,85,247,0.3)] bg-[rgba(168,85,247,0.08)]', icon: 'fa-regular fa-file-lines' },
  'UI Kits':            { color: 'text-[#ec4899] border-[rgba(236,72,153,0.3)] bg-[rgba(236,72,153,0.08)]', icon: 'fa-solid fa-palette' },
};

export function AssetCard({
  id,
  title,
  description,
  price,
  category,
  previewUrl,
  seller,
}: AssetCardProps) {
  const [imgError, setImgError] = useState(false);
  const cat = categoryConfig[category] || { color: 'text-gray-400 border-gray-700 bg-gray-800/50', icon: 'fa-solid fa-file' };

  return (
    <Link
      href={`/assets/${id}`}
      className="group block relative bg-[rgba(10,10,10,0.7)] backdrop-blur-md border border-[rgba(255,255,255,0.06)] rounded-[3px] overflow-hidden transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[rgba(0,255,255,0.35)] hover:shadow-[0_0_40px_rgba(0,255,255,0.12),inset_0_1px_0_rgba(255,255,255,0.04)] hover:-translate-y-1"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-[#0a0a0a] overflow-hidden">
        {!imgError && previewUrl ? (
          <img
            src={previewUrl}
            alt={title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[rgba(0,255,255,0.04)] to-[rgba(245,158,11,0.02)]">
            <i className={`${cat.icon} text-4xl text-[rgba(255,255,255,0.06)]`} />
          </div>
        )}
        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
        {/* Quick preview on hover */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <span className="flex-1 text-center py-1.5 text-[9px] font-[family-name:var(--font-jetbrains)] uppercase tracking-[2px] bg-[rgba(0,0,0,0.7)] backdrop-blur border border-[rgba(255,255,255,0.1)] text-white rounded-[2px]">
            Preview
          </span>
          <span className="flex-1 text-center py-1.5 text-[9px] font-[family-name:var(--font-jetbrains)] uppercase tracking-[2px] bg-[#00ffff] text-[#050505] font-semibold rounded-[2px]">
            Buy Now
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <span className={`inline-block text-[9px] font-[family-name:var(--font-jetbrains)] font-semibold tracking-[2px] uppercase px-2 py-0.5 border rounded-[2px] ${cat.color}`}>
          {category}
        </span>

        {/* Title */}
        <h3 className="font-[family-name:var(--font-syne)] font-bold text-[15px] text-[#f0f0f0] leading-snug line-clamp-2 group-hover:text-[#00ffff] transition-colors duration-200">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[11px] text-[rgba(240,240,240,0.4)] leading-relaxed line-clamp-2 font-[family-name:var(--font-jetbrains)]">
          {description}
        </p>

        {/* Seller */}
        <p className="text-[10px] text-[rgba(240,240,240,0.25)] font-[family-name:var(--font-jetbrains)] tracking-wider">
          by {seller}
        </p>

        {/* Price row */}
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(255,255,255,0.06)]">
          <span className="font-[family-name:var(--font-syne)] font-extrabold text-xl text-[#00ffff]">
            ${price.toFixed(2)}
          </span>
          <div className="w-8 h-8 border border-[rgba(0,255,255,0.3)] rounded-[2px] flex items-center justify-center text-[#00ffff] text-xs transition-all duration-300 group-hover:bg-[#00ffff] group-hover:text-[#050505] group-hover:border-[#00ffff] group-hover:shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            <i className="fa-solid fa-arrow-right" />
          </div>
        </div>
      </div>
    </Link>
  );
}
