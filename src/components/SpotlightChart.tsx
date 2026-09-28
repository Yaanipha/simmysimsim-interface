import React, { useState, useRef } from 'react';
import { DetailedSymbol, Timeframe, ChartType } from '../types/market';
import { ArrowRight, Star, BarChart2, TrendingUp, CandlestickChart } from 'lucide-react';

interface SpotlightChartProps {
  symbol: DetailedSymbol;
  timeframe: Timeframe;
  onChangeTimeframe: (tf: Timeframe) => void;
  onOpenSuperChart: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
}

export const SpotlightChart: React.FC<SpotlightChartProps> = ({
  symbol,
  timeframe,
  onChangeTimeframe,
  onOpenSuperChart,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const points = symbol.chartHistory[timeframe] || symbol.chartHistory['1D'] || [];
  const isUp = symbol.changePercent >= 0;
  const strokeColor = isUp ? '#089981' : '#f23645';
  const fillColor = isUp ? '#089981' : '#f23645';

  const hoveredPoint = hoverIndex !== null && points[hoverIndex] ? points[hoverIndex] : null;
  const displayPrice = hoveredPoint ? hoveredPoint.price : symbol.price;
  const displayTime = hoveredPoint ? hoveredPoint.time : 'Latest Quote';

  // Calculate min & max for normalized SVG coords
  const prices = points.map((p) => p.price);
  const minPrice = prices.length ? Math.min(...prices) * 0.998 : symbol.price * 0.98;
  const maxPrice = prices.length ? Math.max(...prices) * 1.002 : symbol.price * 1.02;
  const priceRange = maxPrice - minPrice || 1;

  const svgWidth = 1000;
  const svgHeight = 240;
  const paddingBottom = 20;
  const paddingTop = 20;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Build SVG path
  const coords = points.map((p, idx) => {
    const x = (idx / (points.length - 1 || 1)) * svgWidth;
    const y = paddingTop + chartHeight - ((p.price - minPrice) / priceRange) * chartHeight;
    return { x, y, point: p };
  });

  // Smooth bezier curve or simple line path
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || points.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clientX / rect.width));
    const index = Math.round(percent * (points.length - 1));
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Get initial badge style
  const getBadgeStyle = () => {
    if (symbol.ticker === 'NVDA') return 'bg-black text-white';
    if (symbol.ticker === 'TSLA') return 'bg-[#e82127] text-white';
    if (symbol.ticker === 'AAPL') return 'bg-[#1f2937] text-white';
    if (symbol.ticker === 'BTC') return 'bg-[#f7931a] text-white';
    if (symbol.ticker === 'ETH') return 'bg-[#627eea] text-white';
    if (symbol.ticker === 'SPX') return 'bg-[#f23645] text-white';
    return 'bg-[#2962ff] text-white';
  };

  return (
    <section
      className="rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-4 sm:p-5 bg-white dark:bg-[#1e222d] shadow-xs transition-colors"
      data-purpose="interactive-chart-spotlight"
    >
      {/* Top Header: Symbol Info & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] gap-4">
        {/* Asset Title & Stats */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-4">
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-sm sm:text-base font-black tracking-tight shrink-0 shadow-xs ${getBadgeStyle()}`}
          >
            {symbol.ticker.slice(0, 4)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-[#131722] dark:text-white leading-tight">
                {symbol.name}
              </h2>
              <span className="text-xs font-medium text-[#6a6d78] dark:text-[#787b86]">
                {symbol.exchange}
              </span>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-[#2962ff] dark:text-[#3871ff] text-[11px] font-semibold px-2 py-0.5 rounded">
                {symbol.marketSession}
              </span>
              <button
                onClick={onToggleWatchlist}
                className="p-1 text-[#6a6d78] dark:text-[#787b86] hover:text-amber-500 transition-colors cursor-pointer"
                title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Star
                  className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400 text-amber-400' : ''}`}
                />
              </button>
            </div>
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-[#131722] dark:text-white tracking-tight tabular-nums">
                {displayPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                className={`text-sm font-semibold tabular-nums ${
                  isUp ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {isUp ? `+${symbol.change.toFixed(2)} (+${symbol.changePercent.toFixed(2)}%)` : `${symbol.change.toFixed(2)} (${symbol.changePercent.toFixed(2)}%)`}
              </span>
              <span className="text-xs text-[#6a6d78] dark:text-[#787b86]">
                {symbol.currency} • Volume {symbol.volume}
              </span>
              {hoveredPoint && (
                <span className="text-xs font-medium text-[#2962ff] dark:text-[#3871ff] bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded">
                  Inspecting: {displayTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chart Controls & Timeframe Selector */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Chart Type Selector */}
          <div className="inline-flex bg-[#f0f3fa] dark:bg-[#131722] p-1 rounded-lg text-xs font-medium mr-1">
            <button
              onClick={() => setChartType('area')}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                chartType === 'area'
                  ? 'bg-white dark:bg-[#2a2e39] text-[#131722] dark:text-white shadow-xs'
                  : 'text-[#6a6d78] dark:text-[#787b86] hover:text-[#131722] dark:hover:text-white'
              }`}
              title="Area Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                chartType === 'line'
                  ? 'bg-white dark:bg-[#2a2e39] text-[#131722] dark:text-white shadow-xs'
                  : 'text-[#6a6d78] dark:text-[#787b86] hover:text-[#131722] dark:hover:text-white'
              }`}
              title="Line Chart"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('candles')}
              className={`p-1.5 rounded transition-all cursor-pointer ${
                chartType === 'candles'
                  ? 'bg-white dark:bg-[#2a2e39] text-[#131722] dark:text-white shadow-xs'
                  : 'text-[#6a6d78] dark:text-[#787b86] hover:text-[#131722] dark:hover:text-white'
              }`}
              title="Candlestick Chart"
            >
              <CandlestickChart className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Timeframe Buttons */}
          <div className="inline-flex bg-[#f0f3fa] dark:bg-[#131722] p-1 rounded-lg text-xs font-medium">
            {(['1D', '5D', '1M', '6M', 'YTD', '1Y', 'ALL'] as Timeframe[]).map((tf) => {
              const active = timeframe === tf;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => onChangeTimeframe(tf)}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-[#2a2e39] text-[#131722] dark:text-white font-bold shadow-xs'
                      : 'text-[#6a6d78] dark:text-[#787b86] hover:text-[#131722] dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>

          {/* Full chart CTA */}
          <button
            onClick={onOpenSuperChart}
            className="text-[#2962ff] dark:text-[#3871ff] hover:text-[#1e53e5] text-xs font-semibold flex items-center gap-1 sm:ml-2 px-3 py-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
          >
            <span>See more on SuperCharts</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Chart Visual Canvas SVG */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="h-64 sm:h-72 w-full pt-4 relative select-none cursor-crosshair"
      >
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <defs>
            <linearGradient id="chartSpotlightGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={fillColor} stopOpacity="0.32" />
              <stop offset="85%" stopColor={fillColor} stopOpacity="0.04" />
              <stop offset="100%" stopColor={fillColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          <line stroke="#f0f3fa" className="dark:stroke-[#2a2e39]" strokeDasharray="4" strokeWidth="1" x1="0" x2={svgWidth} y1="40" y2="40" />
          <line stroke="#f0f3fa" className="dark:stroke-[#2a2e39]" strokeDasharray="4" strokeWidth="1" x1="0" x2={svgWidth} y1="90" y2="90" />
          <line stroke="#f0f3fa" className="dark:stroke-[#2a2e39]" strokeDasharray="4" strokeWidth="1" x1="0" x2={svgWidth} y1="140" y2="140" />
          <line stroke="#f0f3fa" className="dark:stroke-[#2a2e39]" strokeDasharray="4" strokeWidth="1" x1="0" x2={svgWidth} y1="190" y2="190" />

          {chartType === 'candles' ? (
            /* Candlestick Rendering */
            coords.map((c, i) => {
              const candle = c.point;
              const open = candle.open || candle.price;
              const close = candle.close || candle.price;
              const high = candle.high || candle.price;
              const low = candle.low || candle.price;
              const candleUp = close >= open;
              const candleColor = candleUp ? '#089981' : '#f23645';

              const yHigh = paddingTop + chartHeight - ((high - minPrice) / priceRange) * chartHeight;
              const yLow = paddingTop + chartHeight - ((low - minPrice) / priceRange) * chartHeight;
              const yOpen = paddingTop + chartHeight - ((open - minPrice) / priceRange) * chartHeight;
              const yClose = paddingTop + chartHeight - ((close - minPrice) / priceRange) * chartHeight;
              const candleTop = Math.min(yOpen, yClose);
              const candleHeight = Math.max(3, Math.abs(yClose - yOpen));
              const width = Math.max(6, (svgWidth / points.length) * 0.6);

              return (
                <g key={i}>
                  {/* Wick */}
                  <line x1={c.x} y1={yHigh} x2={c.x} y2={yLow} stroke={candleColor} strokeWidth="1.5" />
                  {/* Body */}
                  <rect
                    x={c.x - width / 2}
                    y={candleTop}
                    width={width}
                    height={candleHeight}
                    fill={candleColor}
                    rx="1"
                  />
                </g>
              );
            })
          ) : (
            <>
              {/* Area Fill */}
              {chartType === 'area' && <path d={areaD} fill="url(#chartSpotlightGradient)" />}

              {/* Main Trend Line */}
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Last Point Marker */}
              {coords.length > 0 && (
                <circle
                  cx={coords[coords.length - 1].x}
                  cy={coords[coords.length - 1].y}
                  fill={strokeColor}
                  r="4.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              )}
            </>
          )}

          {/* Interactive Hover Crosshair */}
          {hoverIndex !== null && coords[hoverIndex] && (
            <g>
              {/* Vertical line */}
              <line
                x1={coords[hoverIndex].x}
                y1="0"
                x2={coords[hoverIndex].x}
                y2={svgHeight}
                stroke="#6a6d78"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              {/* Horizontal line */}
              <line
                x1="0"
                y1={coords[hoverIndex].y}
                x2={svgWidth}
                y2={coords[hoverIndex].y}
                stroke="#6a6d78"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              {/* Cursor point circle */}
              <circle
                cx={coords[hoverIndex].x}
                cy={coords[hoverIndex].y}
                r="5"
                fill={strokeColor}
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Current / Hover Price Label Bubble */}
        <div
          className={`absolute right-0 top-3 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm tabular-nums transition-colors ${
            isUp ? 'bg-[#089981]' : 'bg-[#f23645]'
          }`}
        >
          {displayPrice.toFixed(2)}
        </div>

        {/* Hover inspection box */}
        {hoveredPoint && (
          <div
            className="absolute top-2 left-3 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-xs border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg px-2.5 py-1.5 text-xs shadow-md pointer-events-none"
          >
            <div className="font-semibold text-[#131722] dark:text-white tabular-nums">
              ${hoveredPoint.price.toFixed(2)}
            </div>
            <div className="text-[10px] text-[#6a6d78] dark:text-[#787b86]">
              {hoveredPoint.time} • Vol: {(hoveredPoint.volume || 120000).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Time Axis */}
      <div className="flex justify-between text-[11px] text-[#9598a1] dark:text-[#787b86] pt-2 border-t border-[#e0e3eb] dark:border-[#2a2e39]">
        <span>09:30 AM</span>
        <span>11:00 AM</span>
        <span>12:30 PM</span>
        <span>02:00 PM</span>
        <span>03:30 PM</span>
        <span>04:00 PM</span>
      </div>
    </section>
  );
};
