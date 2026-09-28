import React, { useState } from 'react';
import { X, Search, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import {
  MOST_ACTIVE_STOCKS,
  TOP_GAINERS,
  TOP_LOSERS,
} from '../data/mockMarketData';
import { StockMover } from '../types/market';

interface AllStocksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStock: (stock: StockMover) => void;
  watchlist: string[];
  onToggleWatchlist: (ticker: string) => void;
}

export const AllStocksModal: React.FC<AllStocksModalProps> = ({
  isOpen,
  onClose,
  onSelectStock,
  watchlist,
  onToggleWatchlist,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'gainers' | 'losers' | 'active'>('all');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const allStocks: StockMover[] = [
    ...MOST_ACTIVE_STOCKS,
    ...TOP_GAINERS,
    ...TOP_LOSERS,
  ].filter((s, idx, self) => idx === self.findIndex((item) => item.ticker === s.ticker));

  const filtered = allStocks.filter((s) => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'gainers' && s.changePercent > 0) ||
      (filterType === 'losers' && s.changePercent < 0) ||
      (filterType === 'active' && s.type === 'active');

    const matchesSearch =
      !search ||
      s.ticker.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white dark:bg-[#1e222d] rounded-2xl shadow-2xl border border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#131722] dark:text-white">
              All US Stocks &amp; Movers
            </h2>
            <p className="text-xs text-[#6a6d78] dark:text-[#787b86]">
              Real-time trading prices, percentage changes, and volume activity
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6a6d78] hover:text-[#131722] dark:hover:text-white rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-5 py-3 border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-[#fafbfe] dark:bg-[#181c27] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-[#f0f3fa] dark:bg-[#131722] px-3 py-1.5 rounded-full border border-[#e0e3eb] dark:border-[#2a2e39] w-64">
            <Search className="w-3.5 h-3.5 text-[#6a6d78]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter ticker or name..."
              className="bg-transparent text-[#131722] dark:text-white placeholder-[#9598a1] focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Stocks' },
              { id: 'gainers', label: 'Top Gainers' },
              { id: 'losers', label: 'Top Losers' },
              { id: 'active', label: 'Most Active' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#131722] text-white dark:bg-white dark:text-[#131722]'
                    : 'bg-[#f0f3fa] dark:bg-[#2a2e39] text-[#6a6d78] dark:text-[#787b86] hover:bg-[#e4e7ee]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-y-auto flex-1 p-5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-[#6a6d78] dark:text-[#787b86] border-b border-[#e0e3eb] dark:border-[#2a2e39]">
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium text-right">Price</th>
                <th className="pb-3 font-medium text-right">Change ($)</th>
                <th className="pb-3 font-medium text-right">Change (%)</th>
                <th className="pb-3 font-medium text-right">Volume</th>
                <th className="pb-3 font-medium text-right">Market Cap</th>
                <th className="pb-3 font-medium text-center">Watch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3eb] dark:divide-[#2a2e39] text-sm">
              {filtered.map((stock) => {
                const isUp = stock.changePercent >= 0;
                const isWatchlisted = watchlist.includes(stock.ticker);

                return (
                  <tr
                    key={stock.id}
                    onClick={() => {
                      onSelectStock(stock);
                      onClose();
                    }}
                    className="hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-md font-bold text-xs flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: stock.badgeBg,
                          color: stock.badgeColor || '#ffffff',
                        }}
                      >
                        {stock.badgeChar}
                      </div>
                      <div>
                        <span className="font-bold text-[#131722] dark:text-white group-hover:text-[#2962ff] dark:group-hover:text-[#3871ff] transition-colors">
                          {stock.ticker}
                        </span>
                        <span className="text-xs text-[#6a6d78] dark:text-[#787b86] ml-2">
                          {stock.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-right font-bold text-[#131722] dark:text-white tabular-nums">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 text-right font-semibold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? `+${stock.change.toFixed(2)}` : stock.change.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 text-right font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      <span className="inline-flex items-center">
                        {isUp ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                        {isUp ? `+${stock.changePercent.toFixed(2)}%` : `${stock.changePercent.toFixed(2)}%`}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs text-[#6a6d78] dark:text-[#787b86] tabular-nums">
                      {stock.volume}
                    </td>
                    <td className="py-3 text-right text-xs text-[#6a6d78] dark:text-[#787b86] tabular-nums">
                      {stock.marketCap || 'N/A'}
                    </td>
                    <td className="py-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleWatchlist(stock.ticker)}
                        className="p-1 text-[#9598a1] hover:text-amber-500 transition-colors"
                      >
                        <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
