import React, { useState } from 'react';
import { MarketCategory } from '../types/market';
import { ChevronDown, Check } from 'lucide-react';

interface HeroSectionProps {
  activeCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  selectedMarketView: string;
  onSelectMarketView: (view: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeCategory,
  onSelectCategory,
  selectedMarketView,
  onSelectMarketView,
}) => {
  const [showViewMenu, setShowViewMenu] = useState(false);

  const categories: MarketCategory[] = [
    'Indices',
    'US stocks',
    'World stocks',
    'Crypto',
    'Futures & commodities',
    'Forex & currencies',
    'Bonds',
    'ETFs',
    'Economy',
  ];

  const marketViews = [
    'Markets, everywhere',
    'US Markets Focus',
    'European Exchanges',
    'Asia-Pacific Session',
    'Crypto & Web3 Pulse',
  ];

  return (
    <section className="pt-6 sm:pt-8 pb-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#131722] transition-colors" data-purpose="markets-hero">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        {/* Title Dropdown Header */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowViewMenu(!showViewMenu)}
            className="flex items-center gap-2 sm:gap-3 text-3xl sm:text-5xl font-black tracking-tight text-[#131722] dark:text-white select-none group text-left cursor-pointer focus:outline-none"
          >
            <span>{selectedMarketView}</span>
            <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-[#131722] dark:text-white group-hover:translate-y-0.5 transition-transform mt-1 shrink-0" strokeWidth={3} />
          </button>

          {showViewMenu && (
            <div className="absolute left-0 mt-3 w-64 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl shadow-xl py-2 z-30">
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9598a1] dark:text-[#787b86]">
                Market Perspective
              </div>
              {marketViews.map((view) => (
                <button
                  key={view}
                  onClick={() => {
                    onSelectMarketView(view);
                    setShowViewMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm font-semibold flex items-center justify-between text-[#131722] dark:text-[#d1d4dc] hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors"
                >
                  <span>{view}</span>
                  {selectedMarketView === view && <Check className="w-4 h-4 text-[#2962ff]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Horizontal Pills Sub-Navigation */}
        <nav
          aria-label="Markets category filters"
          className="flex items-center gap-2 mt-5 sm:mt-6 overflow-x-auto no-scrollbar pb-2"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-full shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#131722] text-white dark:bg-white dark:text-[#131722] shadow-sm'
                    : 'bg-[#f0f3fa] dark:bg-[#1e222d] text-[#6a6d78] dark:text-[#787b86] hover:bg-[#e4e7ee] dark:hover:bg-[#2a2e39] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
};
