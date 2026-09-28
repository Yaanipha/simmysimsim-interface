import React, { useState } from 'react';
import { EconomicEvent } from '../types/market';
import { X, Calendar, Filter } from 'lucide-react';
import { CALENDAR_EVENTS } from '../data/mockMarketData';

interface EconomicCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent?: EconomicEvent | null;
}

export const EconomicCalendarModal: React.FC<EconomicCalendarModalProps> = ({
  isOpen,
  onClose,
  selectedEvent,
}) => {
  const [impactFilter, setImpactFilter] = useState<'All' | 'High Impact' | 'Med Impact' | 'Earnings'>('All');
  const [countryFilter, setCountryFilter] = useState<'All' | 'United States' | 'European Union'>('All');

  if (!isOpen) return null;

  const filteredEvents = CALENDAR_EVENTS.filter((e) => {
    const matchesImpact = impactFilter === 'All' || e.impact === impactFilter;
    const matchesCountry = countryFilter === 'All' || e.country === countryFilter;
    return matchesImpact && matchesCountry;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white dark:bg-[#1e222d] rounded-2xl shadow-2xl border border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-[#2962ff]" />
            <div>
              <h2 className="text-lg font-bold text-[#131722] dark:text-white">
                Economic &amp; Corporate Earnings Calendar
              </h2>
              <p className="text-xs text-[#6a6d78] dark:text-[#787b86]">
                Global macroeconomic releases &amp; volatility catalysts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6a6d78] hover:text-[#131722] dark:hover:text-white rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="px-5 py-3 border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-[#fafbfe] dark:bg-[#181c27] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#6a6d78]" />
            <span className="font-semibold text-[#6a6d78] dark:text-[#787b86]">Impact:</span>
            {(['All', 'High Impact', 'Med Impact', 'Earnings'] as const).map((imp) => (
              <button
                key={imp}
                onClick={() => setImpactFilter(imp)}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                  impactFilter === imp
                    ? 'bg-[#131722] text-white dark:bg-white dark:text-[#131722]'
                    : 'bg-[#f0f3fa] dark:bg-[#2a2e39] text-[#6a6d78] dark:text-[#787b86] hover:bg-[#e4e7ee]'
                }`}
              >
                {imp}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#6a6d78] dark:text-[#787b86]">Region:</span>
            {(['All', 'United States', 'European Union'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCountryFilter(c)}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
                  countryFilter === c
                    ? 'bg-[#2962ff] text-white'
                    : 'bg-[#f0f3fa] dark:bg-[#2a2e39] text-[#6a6d78] dark:text-[#787b86] hover:bg-[#e4e7ee]'
                }`}
              >
                {c === 'United States' ? '🇺🇸 US' : c === 'European Union' ? '🇪🇺 EU' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Events Table */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="divide-y divide-[#e0e3eb] dark:divide-[#2a2e39] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl overflow-hidden">
            {filteredEvents.map((event) => {
              const isHigh = event.impact === 'High Impact';
              const isEarnings = event.impact === 'Earnings';
              const isTargeted = selectedEvent?.id === event.id;

              return (
                <div
                  key={event.id}
                  className={`p-4 transition-colors ${
                    isTargeted
                      ? 'bg-blue-50/80 dark:bg-blue-950/30'
                      : 'hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{event.countryFlag || '🌐'}</span>
                      <span className="font-bold text-sm text-[#131722] dark:text-white">
                        {event.title}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          isHigh
                            ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                            : isEarnings
                            ? 'bg-blue-100 text-[#2962ff] dark:bg-blue-950/40 dark:text-[#3871ff]'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        }`}
                      >
                        {event.impact}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#6a6d78] dark:text-[#787b86]">
                      {event.dayLabel}
                    </span>
                  </div>

                  <p className="text-xs text-[#6a6d78] dark:text-[#787b86] mb-3">
                    {event.details}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono tabular-nums">
                    {event.actual && (
                      <div className="bg-[#e7f7f3] dark:bg-[#089981]/20 px-2.5 py-1 rounded">
                        <span className="text-[#6a6d78] dark:text-[#787b86] mr-1.5 font-sans">Actual:</span>
                        <strong className="text-[#089981] font-bold">{event.actual}</strong>
                      </div>
                    )}
                    {event.forecast && (
                      <div className="bg-[#f0f3fa] dark:bg-[#2a2e39] px-2.5 py-1 rounded">
                        <span className="text-[#6a6d78] dark:text-[#787b86] mr-1.5 font-sans">Forecast:</span>
                        <strong className="text-[#131722] dark:text-white">{event.forecast}</strong>
                      </div>
                    )}
                    {event.prior && (
                      <div className="bg-[#f0f3fa] dark:bg-[#2a2e39] px-2.5 py-1 rounded">
                        <span className="text-[#6a6d78] dark:text-[#787b86] mr-1.5 font-sans">Prior:</span>
                        <strong className="text-[#131722] dark:text-white">{event.prior}</strong>
                      </div>
                    )}
                    {event.epsEst && (
                      <div className="bg-[#f0f3fa] dark:bg-[#2a2e39] px-2.5 py-1 rounded">
                        <span className="text-[#6a6d78] dark:text-[#787b86] mr-1.5 font-sans">EPS Est:</span>
                        <strong className="text-[#131722] dark:text-white">{event.epsEst}</strong>
                      </div>
                    )}
                    {event.revEst && (
                      <div className="bg-[#f0f3fa] dark:bg-[#2a2e39] px-2.5 py-1 rounded">
                        <span className="text-[#6a6d78] dark:text-[#787b86] mr-1.5 font-sans">Rev Est:</span>
                        <strong className="text-[#131722] dark:text-white">{event.revEst}</strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-[#e0e3eb] dark:border-[#2a2e39] bg-[#fafbfe] dark:bg-[#181c27] flex items-center justify-between text-xs text-[#6a6d78] dark:text-[#787b86]">
          <span>Source: ICE Data Services &amp; Central Banks</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#131722] text-white dark:bg-white dark:text-[#131722] font-semibold rounded-lg hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
