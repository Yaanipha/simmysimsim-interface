import React from 'react';
import { IndexData } from '../types/market';
import { ChevronRight } from 'lucide-react';

interface IndicesCarouselProps {
  indices: IndexData[];
  selectedTicker: string;
  onSelectIndex: (index: IndexData) => void;
  flashTicker?: string | null;
  flashDirection?: 'up' | 'down' | null;
}

export const IndicesCarousel: React.FC<IndicesCarouselProps> = ({
  indices,
  selectedTicker,
  onSelectIndex,
  flashTicker,
  flashDirection,
}) => {
  return (
    <section data-purpose="indices-overview" className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => {}}
          className="group inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#131722] dark:text-white hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer"
        >
          <span>Indices</span>
          <ChevronRight className="w-5 h-5 text-[#6a6d78] dark:text-[#787b86] group-hover:translate-x-1 group-hover:text-[#2962ff] transition-all" strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-medium text-[#6a6d78] dark:text-[#787b86]">Regular trading hours</span>
        </div>
      </div>

      {/* Quick Ticker Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {indices.map((idx) => {
          const isUp = idx.changePercent >= 0;
          const isSelected = selectedTicker === idx.code;
          const isFlashing = flashTicker === idx.code;

          return (
            <div
              key={idx.id}
              onClick={() => onSelectIndex(idx)}
              className={`p-4 rounded-xl border transition-all duration-200 bg-white dark:bg-[#1e222d] cursor-pointer group hover:shadow-md ${
                isSelected
                  ? 'border-[#2962ff] ring-2 ring-[#2962ff]/20 shadow-sm'
                  : 'border-[#e0e3eb] dark:border-[#2a2e39] hover:border-[#b2b5be] dark:hover:border-[#434651]'
              } ${
                isFlashing && flashDirection === 'up'
                  ? 'flash-up'
                  : isFlashing && flashDirection === 'down'
                  ? 'flash-down'
                  : ''
              }`}
              data-purpose="index-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-8 h-8 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs"
                    style={{ backgroundColor: idx.badgeBg }}
                  >
                    {idx.badgeText}
                  </span>
                  <div className="truncate">
                    <p className="font-bold text-sm text-[#131722] dark:text-white group-hover:text-[#2962ff] dark:group-hover:text-[#3871ff] transition-colors truncate">
                      {idx.name}
                    </p>
                    <p className="text-xs text-[#6a6d78] dark:text-[#787b86]">
                      {idx.code} • {idx.exchange}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded whitespace-nowrap ${
                    isUp
                      ? 'bg-[#e7f7f3] text-[#089981] dark:bg-[#089981]/20 dark:text-[#089981]'
                      : 'bg-[#fdecee] text-[#f23645] dark:bg-[#f23645]/20 dark:text-[#f23645]'
                  }`}
                >
                  {isUp ? `+${idx.changePercent.toFixed(2)}%` : `${idx.changePercent.toFixed(2)}%`}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold tracking-tight text-[#131722] dark:text-white tabular-nums">
                  {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className={`text-xs font-medium tabular-nums ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? `+${idx.change.toFixed(2)}` : idx.change.toFixed(2)}
                </span>
              </div>

              {/* Sparkline representation */}
              <div className="mt-3 h-9 w-full">
                <svg
                  className={`w-full h-full ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}
                  fill="none"
                  viewBox="0 0 120 30"
                  preserveAspectRatio="none"
                >
                  {isUp ? (
                    <>
                      <path
                        d="M0,25 Q20,20 40,22 T80,10 T120,4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M0,25 Q20,20 40,22 T80,10 T120,4 L120,30 L0,30 Z"
                        fill="currentColor"
                        fillOpacity="0.08"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M0,8 Q30,12 60,18 T100,22 T120,27"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M0,8 Q30,12 60,18 T100,22 T120,27 L120,30 L0,30 Z"
                        fill="currentColor"
                        fillOpacity="0.08"
                      />
                    </>
                  )}
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
