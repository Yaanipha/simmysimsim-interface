import React from 'react';
import { StockMover } from '../types/market';
import { Star } from 'lucide-react';

interface MarketMoversProps {
  mostActive: StockMover[];
  topGainers: StockMover[];
  topLosers: StockMover[];
  selectedTicker: string;
  onSelectStock: (stock: StockMover) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
  onViewAllStocks: () => void;
  flashTicker?: string | null;
  flashDirection?: 'up' | 'down' | null;
}

export const MarketMovers: React.FC<MarketMoversProps> = ({
  mostActive,
  topGainers,
  topLosers,
  selectedTicker,
  onSelectStock,
  watchlist,
  onToggleWatchlist,
  onViewAllStocks,
  flashTicker,
  flashDirection,
}) => {
  const renderStockRow = (stock: StockMover) => {
    const isUp = stock.changePercent >= 0;
    const isSelected = selectedTicker === stock.ticker;
    const isWatchlisted = watchlist.includes(stock.ticker);
    const isFlashing = flashTicker === stock.ticker;

    return (
      <div
        key={stock.id}
        onClick={() => onSelectStock(stock)}
        className={`py-3 flex items-center justify-between px-2 rounded-lg transition-all cursor-pointer group ${
          isSelected
            ? 'bg-[#f0f3fa] dark:bg-[#2a2e39] font-medium'
            : 'hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]'
        } ${
          isFlashing && flashDirection === 'up'
            ? 'flash-up'
            : isFlashing && flashDirection === 'down'
            ? 'flash-down'
            : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
            style={{
              backgroundColor: stock.badgeBg,
              color: stock.badgeColor || '#ffffff',
            }}
          >
            {stock.badgeChar}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-sm text-[#131722] dark:text-white leading-tight group-hover:text-[#2962ff] dark:group-hover:text-[#3871ff] transition-colors">
                {stock.ticker}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(stock.ticker);
                }}
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 ${
                  isWatchlisted ? '!opacity-100 text-amber-500' : 'text-[#9598a1] hover:text-amber-500'
                }`}
                title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Star className={`w-3.5 h-3.5 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-[#6a6d78] dark:text-[#787b86] truncate max-w-[130px] sm:max-w-[160px]">
              {stock.name}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
            {stock.price.toFixed(2)}
          </p>
          <div className="mt-0.5">
            {stock.type === 'gainer' ? (
              <span className="inline-block text-xs font-bold text-[#089981] bg-[#e7f7f3] dark:bg-[#089981]/20 px-2 py-0.5 rounded tabular-nums">
                +{stock.changePercent.toFixed(2)}%
              </span>
            ) : stock.type === 'loser' ? (
              <span className="inline-block text-xs font-bold text-[#f23645] bg-[#fdecee] dark:bg-[#f23645]/20 px-2 py-0.5 rounded tabular-nums">
                {stock.changePercent.toFixed(2)}%
              </span>
            ) : (
              <p
                className={`text-xs font-semibold tabular-nums ${
                  isUp ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isUp ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section data-purpose="market-movers-grid" className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-[#131722] dark:text-white">
          US Market Movers
        </h2>
        <button
          onClick={onViewAllStocks}
          className="text-sm font-semibold text-[#2962ff] dark:text-[#3871ff] hover:underline cursor-pointer"
        >
          View all US stocks →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Most Active / Highest Volume */}
        <div className="rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 bg-white dark:bg-[#1e222d] transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e3eb] dark:border-[#2a2e39]">
            <h3 className="font-bold text-base text-[#131722] dark:text-white">Most active stocks</h3>
            <span className="text-xs text-[#6a6d78] dark:text-[#787b86]">By Volume</span>
          </div>
          <div className="divide-y divide-[#e0e3eb] dark:divide-[#2a2e39]">
            {mostActive.map(renderStockRow)}
          </div>
        </div>

        {/* Column 2: Top Gainers */}
        <div className="rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 bg-white dark:bg-[#1e222d] transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e3eb] dark:border-[#2a2e39]">
            <h3 className="font-bold text-base text-[#131722] dark:text-white">Top stock gainers</h3>
            <span className="text-xs font-medium text-[#089981] flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#089981]" />
              +5.00% or more
            </span>
          </div>
          <div className="divide-y divide-[#e0e3eb] dark:divide-[#2a2e39]">
            {topGainers.map(renderStockRow)}
          </div>
        </div>

        {/* Column 3: Top Losers */}
        <div className="rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 bg-white dark:bg-[#1e222d] transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-[#e0e3eb] dark:border-[#2a2e39]">
            <h3 className="font-bold text-base text-[#131722] dark:text-white">Top stock losers</h3>
            <span className="text-xs font-medium text-[#f23645] flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#f23645]" />
              -3.00% or worse
            </span>
          </div>
          <div className="divide-y divide-[#e0e3eb] dark:divide-[#2a2e39]">
            {topLosers.map(renderStockRow)}
          </div>
        </div>
      </div>
    </section>
  );
};
