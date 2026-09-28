import React from 'react';
import { EconomicEvent } from '../types/market';

interface EconomicCalendarProps {
  events: EconomicEvent[];
  onOpenFullCalendar: () => void;
  onSelectEvent: (event: EconomicEvent) => void;
}

export const EconomicCalendar: React.FC<EconomicCalendarProps> = ({
  events,
  onOpenFullCalendar,
  onSelectEvent,
}) => {
  return (
    <section className="rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-5 sm:p-6 bg-white dark:bg-[#1e222d] transition-colors" data-purpose="economic-calendar-preview">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#131722] dark:text-white">
            Economic &amp; Earnings Calendar
          </h2>
          <p className="text-xs text-[#6a6d78] dark:text-[#787b86]">
            Key global events driving current volatility
          </p>
        </div>
        <button
          onClick={onOpenFullCalendar}
          className="text-sm font-semibold text-[#2962ff] dark:text-[#3871ff] hover:underline cursor-pointer"
        >
          Full calendar →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {events.slice(0, 4).map((event) => (
          <div
            key={event.id}
            onClick={() => onSelectEvent(event)}
            className="p-3.5 rounded-lg bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] hover:border-[#b2b5be] dark:hover:border-[#434651] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-[#6a6d78] dark:text-[#787b86] mb-1.5">
              <span className="font-bold text-[#131722] dark:text-white flex items-center gap-1.5">
                {event.countryFlag && <span>{event.countryFlag}</span>}
                {event.dayLabel}
              </span>
              <span
                className={`font-bold ${
                  event.impact === 'High Impact'
                    ? 'text-red-600 dark:text-red-400'
                    : event.impact === 'Med Impact'
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-[#2962ff] dark:text-[#3871ff]'
                }`}
              >
                {event.impact}
              </span>
            </div>

            <p className="font-semibold text-sm text-[#131722] dark:text-white leading-snug group-hover:text-[#2962ff] dark:group-hover:text-[#3871ff] transition-colors">
              {event.title}
            </p>

            {event.impact === 'Earnings' ? (
              <div className="mt-2 text-xs flex justify-between text-[#6a6d78] dark:text-[#787b86] tabular-nums">
                <span>
                  EPS Est: <strong className="text-[#131722] dark:text-white">{event.epsEst}</strong>
                </span>
                <span>
                  Rev Est: <strong className="text-[#131722] dark:text-white">{event.revEst}</strong>
                </span>
              </div>
            ) : event.actual || event.forecast ? (
              <div className="mt-2 text-xs flex justify-between text-[#6a6d78] dark:text-[#787b86] tabular-nums">
                {event.actual && (
                  <span>
                    Actual: <strong className="text-[#089981] font-bold">{event.actual}</strong>
                  </span>
                )}
                {event.forecast && (
                  <span>
                    Forecast: <strong className="text-[#131722] dark:text-white">{event.forecast}</strong>
                  </span>
                )}
                {event.prior && (
                  <span>
                    Prior: <strong className="text-[#131722] dark:text-white">{event.prior}</strong>
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-2 text-xs text-[#6a6d78] dark:text-[#787b86] line-clamp-1">
                {event.details}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
