import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, DollarSign, Globe } from 'lucide-react';
import {
  INDICES_DATA,
  MOST_ACTIVE_STOCKS,
  TOP_GAINERS,
  TOP_LOSERS,
  CRYPTO_DATA,
  COMMODITIES_AND_FOREX,
} from '../data/mockMarketData';

interface SearchResultItem {
  id: string;
  ticker: string;
  name: string;
  category: 'Stock' | 'Index' | 'Crypto' | 'Forex' | 'Commodity';
  exchange: string;
  price: number;
  changePercent: number;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSymbol: (ticker: string, name: string, price: number, changePercent: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSymbol,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compile full search items database
  const allItems: SearchResultItem[] = [
    ...MOST_ACTIVE_STOCKS.map((s) => ({
      id: s.id,
      ticker: s.ticker,
      name: s.name,
      category: 'Stock' as const,
      exchange: s.exchange,
      price: s.price,
      changePercent: s.changePercent,
    })),
    ...TOP_GAINERS.map((s) => ({
      id: s.id,
      ticker: s.ticker,
      name: s.name,
      category: 'Stock' as const,
      exchange: s.exchange,
      price: s.price,
      changePercent: s.changePercent,
    })),
    ...TOP_LOSERS.map((s) => ({
      id: s.id,
      ticker: s.ticker,
      name: s.name,
      category: 'Stock' as const,
      exchange: s.exchange,
      price: s.price,
      changePercent: s.changePercent,
    })),
    ...INDICES_DATA.map((i) => ({
      id: i.id,
      ticker: i.code,
      name: i.name,
      category: 'Index' as const,
      exchange: i.exchange,
      price: i.price,
      changePercent: i.changePercent,
    })),
    ...CRYPTO_DATA.map((c) => ({
      id: c.id,
      ticker: c.ticker,
      name: c.name,
      category: 'Crypto' as const,
      exchange: 'Crypto',
      price: c.price,
      changePercent: c.changePercent,
    })),
    ...COMMODITIES_AND_FOREX.map((cf) => ({
      id: cf.id,
      ticker: cf.ticker,
      name: cf.name,
      category: cf.isCommodity ? ('Commodity' as const) : ('Forex' as const),
      exchange: cf.categoryName,
      price: cf.price,
      changePercent: cf.changePercent,
    })),
  ];

  // Remove duplicates based on ticker
  const uniqueItems = allItems.filter(
    (item, index, self) => index === self.findIndex((t) => t.ticker === item.ticker)
  );

  // Filter items
  const filtered = uniqueItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'All' ||
      (activeCategory === 'Stocks' && item.category === 'Stock') ||
      (activeCategory === 'Indices' && item.category === 'Index') ||
      (activeCategory === 'Crypto' && item.category === 'Crypto') ||
      (activeCategory === 'Forex & Commodities' &&
        (item.category === 'Forex' || item.category === 'Commodity'));

    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.ticker.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      item.exchange.toLowerCase().includes(q);

    return matchesCategory && matchesQuery;
  });

  // Focus input on open & keyboard listeners
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
          e.preventDefault();
          // let parent open search
        }
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          const item = filtered[selectedIndex];
          onSelectSymbol(item.ticker, item.name, item.price, item.changePercent);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filtered, onClose, onSelectSymbol]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1e222d] rounded-2xl shadow-2xl border border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e0e3eb] dark:border-[#2a2e39] gap-3">
          <Search className="w-5 h-5 text-[#6a6d78] dark:text-[#787b86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search markets, symbols, or companies (e.g. NVDA, Apple, S&P, BTC)..."
            className="w-full bg-transparent text-[#131722] dark:text-white placeholder-[#9598a1] dark:placeholder-[#787b86] text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#9598a1] hover:text-[#131722] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-[#f0f3fa] dark:bg-[#2a2e39] text-[#6a6d78] dark:text-[#787b86] hover:bg-[#e4e7ee]"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#e0e3eb] dark:border-[#2a2e39] overflow-x-auto no-scrollbar bg-[#fafbfe] dark:bg-[#181c27]">
          {['All', 'Stocks', 'Indices', 'Crypto', 'Forex & Commodities'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#131722] text-white dark:bg-white dark:text-[#131722]'
                  : 'text-[#6a6d78] dark:text-[#787b86] hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 divide-y divide-[#e0e3eb] dark:divide-[#2a2e39] max-h-96">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#6a6d78] dark:text-[#787b86]">
              <p className="text-sm font-medium">No symbols found matching "{query}"</p>
              <p className="text-xs mt-1">Try searching for tickers like NVDA, AAPL, BTC, or SPX</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = selectedIndex === idx;
              const isUp = item.changePercent >= 0;

              return (
                <div
                  key={item.id + item.ticker}
                  onClick={() => {
                    onSelectSymbol(item.ticker, item.name, item.price, item.changePercent);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[#2962ff]'
                      : 'hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f0f3fa] dark:bg-[#2a2e39] flex items-center justify-center font-bold text-xs text-[#131722] dark:text-white shrink-0">
                      {item.category === 'Crypto' ? (
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                      ) : item.category === 'Index' ? (
                        <TrendingUp className="w-4 h-4 text-[#2962ff]" />
                      ) : (
                        <Globe className="w-4 h-4 text-indigo-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#131722] dark:text-white">
                          {item.ticker}
                        </span>
                        <span className="text-xs text-[#6a6d78] dark:text-[#787b86]">
                          {item.exchange}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#6a6d78] dark:text-[#787b86] truncate max-w-sm">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
                      ${item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: item.price < 2 ? 4 : 2,
                      })}
                    </p>
                    <p
                      className={`text-xs font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 bg-[#f0f3fa] dark:bg-[#131722] border-t border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between text-[11px] text-[#6a6d78] dark:text-[#787b86]">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <span>TradingView Global Search</span>
        </div>
      </div>
    </div>
  );
};
