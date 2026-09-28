import React from 'react';
import { CryptoItem, CommodityOrForexItem } from '../types/market';

interface CryptoAndCommoditiesProps {
  cryptoItems: CryptoItem[];
  commoditiesAndForex: CommodityOrForexItem[];
  onSelectCrypto: (crypto: CryptoItem) => void;
  onSelectCommodityOrForex: (item: CommodityOrForexItem) => void;
  onViewAllCrypto: () => void;
  flashTicker?: string | null;
  flashDirection?: 'up' | 'down' | null;
}

export const CryptoAndCommodities: React.FC<CryptoAndCommoditiesProps> = ({
  cryptoItems,
  commoditiesAndForex,
  onSelectCrypto,
  onSelectCommodityOrForex,
  onViewAllCrypto,
  flashTicker,
  flashDirection,
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-purpose="crypto-and-forex-summary">
      {/* Crypto Panel */}
      <div className="rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-5 bg-white dark:bg-[#1e222d] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#089981] animate-pulse" />
            <h2 className="text-xl font-bold text-[#131722] dark:text-white">Cryptocurrency</h2>
          </div>
          <button
            onClick={onViewAllCrypto}
            className="text-xs font-bold text-[#2962ff] dark:text-[#3871ff] hover:underline cursor-pointer"
          >
            All coins →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-[#6a6d78] dark:text-[#787b86] border-b border-[#e0e3eb] dark:border-[#2a2e39]">
                <th className="pb-2 font-medium">Asset</th>
                <th className="pb-2 font-medium text-right">Price</th>
                <th className="pb-2 font-medium text-right">24h Change</th>
                <th className="pb-2 font-medium text-right">Market Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3eb] dark:divide-[#2a2e39] text-sm">
              {cryptoItems.map((item) => {
                const isUp = item.changePercent >= 0;
                const isFlashing = flashTicker === item.ticker;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectCrypto(item)}
                    className={`hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors cursor-pointer group ${
                      isFlashing && flashDirection === 'up'
                        ? 'flash-up'
                        : isFlashing && flashDirection === 'down'
                        ? 'flash-down'
                        : ''
                    }`}
                  >
                    <td className="py-3 flex items-center gap-2.5 font-bold text-[#131722] dark:text-white">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs shrink-0"
                        style={{
                          backgroundColor: item.badgeBg,
                          color: item.badgeColor,
                        }}
                      >
                        {item.symbol}
                      </span>
                      <span className="group-hover:text-[#2962ff] dark:group-hover:text-[#3871ff] transition-colors">
                        {item.name}
                      </span>
                      <span className="text-xs font-normal text-[#6a6d78] dark:text-[#787b86]">
                        {item.ticker}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-[#131722] dark:text-white tabular-nums">
                      ${item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: item.price < 1 ? 4 : 2,
                      })}
                    </td>
                    <td
                      className={`py-3 text-right font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </td>
                    <td className="py-3 text-right text-xs text-[#6a6d78] dark:text-[#787b86] tabular-nums">
                      {item.marketCap}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commodities & Currencies Panel */}
      <div className="rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-5 bg-white dark:bg-[#1e222d] transition-colors">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#131722] dark:text-white">
            Commodities & Currencies
          </h2>
          <div className="flex gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f0f3fa] dark:bg-[#2a2e39] text-[#6a6d78] dark:text-[#787b86]">
              Live
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs text-[#6a6d78] dark:text-[#787b86] border-b border-[#e0e3eb] dark:border-[#2a2e39]">
                <th className="pb-2 font-medium">Asset</th>
                <th className="pb-2 font-medium text-right">Price</th>
                <th className="pb-2 font-medium text-right">Change</th>
                <th className="pb-2 font-medium text-right">High / Low</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3eb] dark:divide-[#2a2e39] text-sm">
              {commoditiesAndForex.map((item) => {
                const isUp = item.changePercent >= 0;
                const isFlashing = flashTicker === item.name;

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectCommodityOrForex(item)}
                    className={`hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors cursor-pointer group ${
                      isFlashing && flashDirection === 'up'
                        ? 'flash-up'
                        : isFlashing && flashDirection === 'down'
                        ? 'flash-down'
                        : ''
                    }`}
                  >
                    <td className="py-3 font-bold text-[#131722] dark:text-white">
                      <span className="group-hover:text-[#2962ff] dark:group-hover:text-[#3871ff] transition-colors">
                        {item.name}
                      </span>{' '}
                      <span className="text-xs font-normal text-[#6a6d78] dark:text-[#787b86]">
                        {item.ticker}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-[#131722] dark:text-white tabular-nums">
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: item.price < 2 ? 4 : 2,
                      })}
                    </td>
                    <td
                      className={`py-3 text-right font-bold tabular-nums ${
                        isUp ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isUp ? `+${item.changePercent.toFixed(2)}%` : `${item.changePercent.toFixed(2)}%`}
                    </td>
                    <td className="py-3 text-right text-xs text-[#6a6d78] dark:text-[#787b86] tabular-nums">
                      {item.high.toLocaleString()} / {item.low.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
