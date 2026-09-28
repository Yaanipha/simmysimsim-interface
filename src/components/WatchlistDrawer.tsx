import React from 'react';
import { X, Trash2, ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import { SYMBOLS_REGISTRY, getOrCreateSymbol } from '../data/mockMarketData';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: string[];
  onRemoveFromWatchlist: (ticker: string) => void;
  onSelectSymbol: (ticker: string) => void;
  onClearAll: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRemoveFromWatchlist,
  onSelectSymbol,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-[#1e222d] h-full shadow-2xl border-l border-[#e0e3eb] dark:border-[#2a2e39] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-base text-[#131722] dark:text-white">
              My Watchlist ({watchlist.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {watchlist.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-[#6a6d78] hover:text-red-500 transition-colors p-1"
                title="Clear Watchlist"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-[#6a6d78] hover:text-[#131722] dark:hover:text-white rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Watchlist Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#e0e3eb] dark:divide-[#2a2e39]">
          {watchlist.length === 0 ? (
            <div className="p-8 text-center text-[#6a6d78] dark:text-[#787b86]">
              <Star className="w-8 h-8 mx-auto text-amber-400 mb-2 stroke-1" />
              <p className="font-semibold text-sm text-[#131722] dark:text-white">Your watchlist is empty</p>
              <p className="text-xs mt-1">Star any stock, index, or cryptocurrency to track it live here.</p>
            </div>
          ) : (
            watchlist.map((ticker) => {
              const item = SYMBOLS_REGISTRY[ticker] || getOrCreateSymbol(ticker);
              const isUp = item.changePercent >= 0;

              return (
                <div
                  key={ticker}
                  onClick={() => {
                    onSelectSymbol(ticker);
                    onClose();
                  }}
                  className="px-4 py-3 flex items-center justify-between hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#f0f3fa] dark:bg-[#131722] flex items-center justify-center font-bold text-xs text-[#131722] dark:text-white">
                      {ticker.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962ff] dark:group-hover:text-[#3871ff] transition-colors">
                          {ticker}
                        </span>
                        <span className="text-[11px] text-[#6a6d78] dark:text-[#787b86]">
                          {item.exchange}
                        </span>
                      </div>
                      <p className="text-xs text-[#6a6d78] dark:text-[#787b86] truncate max-w-[140px]">
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#131722] dark:text-white tabular-nums">
                        ${item.price.toFixed(2)}
                      </p>
                      <p
                        className={`text-xs font-semibold flex items-center justify-end tabular-nums ${
                          isUp ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isUp ? (
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        )}
                        {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(ticker);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#6a6d78] hover:text-red-500 transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e0e3eb] dark:border-[#2a2e39] bg-[#fafbfe] dark:bg-[#181c27] text-xs text-[#6a6d78] dark:text-[#787b86]">
          Quotes update in real-time. Star items across markets to monitor performance.
        </div>
      </div>
    </div>
  );
};
