export type MarketCategory =
  | 'Indices'
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures & commodities'
  | 'Forex & currencies'
  | 'Bonds'
  | 'ETFs'
  | 'Economy';

export type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | 'ALL';

export type ChartType = 'area' | 'line' | 'candles';

export interface ChartPoint {
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface IndexData {
  id: string;
  name: string;
  code: string;
  exchange: string;
  badgeText: string;
  badgeBg: string;
  badgeColor: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
  category: MarketCategory;
}

export interface StockMover {
  id: string;
  ticker: string;
  name: string;
  badgeChar: string;
  badgeBg: string;
  badgeColor?: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap?: string;
  exchange: string;
  type: 'active' | 'gainer' | 'loser';
}

export interface CryptoItem {
  id: string;
  name: string;
  ticker: string;
  symbol: string;
  badgeBg: string;
  badgeColor: string;
  price: number;
  changePercent: number;
  marketCap: string;
  sparkline?: number[];
}

export interface CommodityOrForexItem {
  id: string;
  name: string;
  ticker: string;
  categoryName: string;
  price: number;
  changePercent: number;
  high: number;
  low: number;
  isCommodity?: boolean;
}

export interface EconomicEvent {
  id: string;
  time: string;
  dayLabel: string;
  title: string;
  country: string;
  countryFlag?: string;
  impact: 'High Impact' | 'Med Impact' | 'Earnings';
  impactColor: string;
  actual?: string;
  forecast?: string;
  prior?: string;
  details?: string;
  epsEst?: string;
  revEst?: string;
}

export interface DetailedSymbol {
  ticker: string;
  name: string;
  exchange: string;
  category: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  marketSession: string;
  volume: string;
  avgVolume: string;
  marketCap: string;
  peRatio?: string;
  week52High: number;
  week52Low: number;
  dayHigh: number;
  dayLow: number;
  beta?: string;
  divYield?: string;
  revenue?: string;
  eps?: string;
  description: string;
  technicalRecommendation: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  oscillatorScore: string;
  movingAverageScore: string;
  chartHistory: Record<Timeframe, ChartPoint[]>;
}
