import React, { useState } from 'react';
import { DetailedSymbol, Timeframe, ChartType } from '../types/market';
import { X, Star, Bell, Share2, TrendingUp, BarChart2, CandlestickChart, Check } from 'lucide-react';

interface SuperChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: DetailedSymbol;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
}

export const SuperChartModal: React.FC<SuperChartModalProps> = ({
  isOpen,
  onClose,
  symbol,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [alertSet, setAlertSet] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const points = symbol.chartHistory[timeframe] || symbol.chartHistory['1D'] || [];
  const isUp = symbol.changePercent >= 0;
  const strokeColor = isUp ? '#089981' : '#f23645';

  const prices = points.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) * 0.998 : symbol.price * 0.98;
  const maxPrice = prices.length ? Math.max(...prices) * 1.002 : symbol.price * 1.02;
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 1000;
  const svgHeight = 280;
  const paddingBottom = 25;
  const paddingTop = 25;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const coords = points.map((p, idx) => {
    const x = (idx / (points.length - 1 || 1)) * svgWidth;
    const y = paddingTop + chartHeight - ((p.price - minPrice) / priceRange) * chartHeight;
    return { x, y, point: p };
  });

  let pathD = '';
  if (coords.length > 0) {
    pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      pathD += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
  }

  const areaD = coords.length > 0 ? `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z` : '';

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-5xl bg-white dark:bg-[#1e222d] rounded-2xl shadow-2xl border border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white font-black text-xs flex items-center justify-center shadow-xs">
              {symbol.ticker.slice(0, 4)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#131722] dark:text-white">
                  {symbol.name}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#f0f3fa] dark:bg-[#2a2e39] text-[#6a6d78] dark:text-[#787b86]">
                  {symbol.exchange}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-[#2962ff] dark:text-[#3871ff]">
                  {symbol.marketSession}
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-[#131722] dark:text-white tabular-nums">
                  ${symbol.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span
                  className={`text-sm font-bold tabular-nums ${
                    isUp ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isUp ? `+${symbol.change.toFixed(2)} (+${symbol.changePercent.toFixed(2)}%)` : `${symbol.change.toFixed(2)} (${symbol.changePercent.toFixed(2)}%)`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleWatchlist}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                isWatchlisted
                  ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#6a6d78] dark:text-[#787b86] hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]'
              }`}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
              <span className="hidden sm:inline">{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
            </button>

            <button
              onClick={() => setAlertSet(!alertSet)}
              className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                alertSet
                  ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                  : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#6a6d78] dark:text-[#787b86] hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">{alertSet ? 'Alert Active' : 'Set Alert'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] text-[#6a6d78] dark:text-[#787b86] hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors"
              title="Share Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#6a6d78] hover:text-[#131722] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Scrollable */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {/* Chart Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#fafbfe] dark:bg-[#181c27] p-2 rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39]">
            <div className="inline-flex bg-[#f0f3fa] dark:bg-[#1e222d] p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setChartType('area')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  chartType === 'area'
                    ? 'bg-white dark:bg-[#2a2e39] text-[#131722] dark:text-white shadow-xs'
                    : 'text-[#6a6d78] dark:text-[#787b86]'
                }`}
                title="Area View"
              >
                <TrendingUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('line')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  chartType === 'line'
                    ? 'bg-white dark:bg-[#2a2e39] text-[#131722] dark:text-white shadow-xs'
                    : 'text-[#6a6d78] dark:text-[#787b86]'
                }`}
                title="Line View"
              >
                <BarChart2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`p-1.5 rounded transition-all cursor-pointer ${
                  chartType === 'candles'
                    ? 'bg-white dark:bg-[#2a2e39] text-[#131722] dark:text-white shadow-xs'
                    : 'text-[#6a6d78] dark:text-[#787b86]'
                }`}
                title="Candlestick View"
              >
                <CandlestickChart className="w-4 h-4" />
              </button>
            </div>

            <div className="inline-flex bg-[#f0f3fa] dark:bg-[#1e222d] p-1 rounded-lg text-xs font-medium">
              {(['1D', '5D', '1M', '6M', 'YTD', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white dark:bg-[#2a2e39] text-[#131722] dark:text-white font-bold shadow-xs'
                      : 'text-[#6a6d78] dark:text-[#787b86] hover:text-[#131722] dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Large Interactive SVG Chart */}
          <div className="h-72 w-full relative bg-[#ffffff] dark:bg-[#131722] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-2">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
              <defs>
                <linearGradient id="superChartGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[50, 110, 170, 230].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2={svgWidth}
                  y1={y}
                  y2={y}
                  stroke="#f0f3fa"
                  className="dark:stroke-[#2a2e39]"
                  strokeDasharray="4"
                  strokeWidth="1"
                />
              ))}

              {chartType === 'candles' ? (
                coords.map((c, i) => {
                  const candle = c.point;
                  const open = candle.open || candle.price;
                  const close = candle.close || candle.price;
                  const high = candle.high || candle.price;
                  const low = candle.low || candle.price;
                  const candleUp = close >= open;
                  const cColor = candleUp ? '#089981' : '#f23645';

                  const yHigh = paddingTop + chartHeight - ((high - minPrice) / priceRange) * chartHeight;
                  const yLow = paddingTop + chartHeight - ((low - minPrice) / priceRange) * chartHeight;
                  const yOpen = paddingTop + chartHeight - ((open - minPrice) / priceRange) * chartHeight;
                  const yClose = paddingTop + chartHeight - ((close - minPrice) / priceRange) * chartHeight;
                  const candleTop = Math.min(yOpen, yClose);
                  const candleH = Math.max(3, Math.abs(yClose - yOpen));
                  const width = Math.max(6, (svgWidth / points.length) * 0.6);

                  return (
                    <g key={i}>
                      <line x1={c.x} y1={yHigh} x2={c.x} y2={yLow} stroke={cColor} strokeWidth="1.5" />
                      <rect x={c.x - width / 2} y={candleTop} width={width} height={candleH} fill={cColor} rx="1" />
                    </g>
                  );
                })
              ) : (
                <>
                  {chartType === 'area' && <path d={areaD} fill="url(#superChartGradient)" />}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {coords.length > 0 && (
                    <circle
                      cx={coords[coords.length - 1].x}
                      cy={coords[coords.length - 1].y}
                      fill={strokeColor}
                      r="5"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                  )}
                </>
              )}
            </svg>
          </div>

          {/* Technical Analysis Section & Key Stats in 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Analysis Gauge Card */}
            <div className="p-4 rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] bg-[#fafbfe] dark:bg-[#181c27]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-[#131722] dark:text-white">
                  Technical Analysis Summary
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-[#089981]">
                  {symbol.technicalRecommendation}
                </span>
              </div>

              {/* Gauge Meter Representation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#6a6d78] dark:text-[#787b86]">
                  <span>Strong Sell</span>
                  <span>Sell</span>
                  <span>Neutral</span>
                  <span>Buy</span>
                  <span className="font-bold text-[#089981]">Strong Buy</span>
                </div>
                <div className="h-2.5 w-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 rounded-full relative">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#131722] rounded-full shadow"
                    style={{
                      left: symbol.technicalRecommendation === 'Strong Buy' ? '88%' : symbol.technicalRecommendation === 'Buy' ? '70%' : symbol.technicalRecommendation === 'Neutral' ? '50%' : '20%',
                    }}
                  />
                </div>

                <div className="pt-3 border-t border-[#e0e3eb] dark:border-[#2a2e39] text-xs space-y-1.5 text-[#6a6d78] dark:text-[#787b86]">
                  <div className="flex justify-between">
                    <span>Oscillators:</span>
                    <strong className="text-[#131722] dark:text-white">{symbol.oscillatorScore}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Moving Averages:</span>
                    <strong className="text-[#131722] dark:text-white">{symbol.movingAverageScore}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>RSI (14):</span>
                    <strong className="text-[#131722] dark:text-white">61.4 (Neutral)</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Statistics Grid */}
            <div className="p-4 rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] bg-[#fafbfe] dark:bg-[#181c27]">
              <h3 className="font-bold text-sm text-[#131722] dark:text-white mb-3">
                Key Financial Metrics
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[#6a6d78] dark:text-[#787b86]">Market Cap</span>
                  <p className="font-bold text-[#131722] dark:text-white tabular-nums">{symbol.marketCap}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#6a6d78] dark:text-[#787b86]">P/E Ratio</span>
                  <p className="font-bold text-[#131722] dark:text-white tabular-nums">{symbol.peRatio || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#6a6d78] dark:text-[#787b86]">52-Week Range</span>
                  <p className="font-bold text-[#131722] dark:text-white tabular-nums">
                    ${symbol.week52Low} - ${symbol.week52High}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#6a6d78] dark:text-[#787b86]">Day Range</span>
                  <p className="font-bold text-[#131722] dark:text-white tabular-nums">
                    ${symbol.dayLow} - ${symbol.dayHigh}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#6a6d78] dark:text-[#787b86]">Beta</span>
                  <p className="font-bold text-[#131722] dark:text-white tabular-nums">{symbol.beta || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[#6a6d78] dark:text-[#787b86]">Dividend Yield</span>
                  <p className="font-bold text-[#131722] dark:text-white tabular-nums">{symbol.divYield || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* About Company */}
          <div className="p-4 rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#1e222d]">
            <h3 className="font-bold text-sm text-[#131722] dark:text-white mb-2">
              About {symbol.name}
            </h3>
            <p className="text-xs text-[#6a6d78] dark:text-[#787b86] leading-relaxed">
              {symbol.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
