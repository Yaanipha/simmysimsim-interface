import { useState, useEffect } from 'react';
import { MarketCategory, Timeframe, DetailedSymbol, IndexData, StockMover, CryptoItem, CommodityOrForexItem, EconomicEvent } from './types/market';
import {
  INDICES_DATA,
  MOST_ACTIVE_STOCKS,
  TOP_GAINERS,
  TOP_LOSERS,
  CRYPTO_DATA,
  COMMODITIES_AND_FOREX,
  CALENDAR_EVENTS,
  SYMBOLS_REGISTRY,
  getOrCreateSymbol,
} from './data/mockMarketData';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { IndicesCarousel } from './components/IndicesCarousel';
import { SpotlightChart } from './components/SpotlightChart';
import { MarketMovers } from './components/MarketMovers';
import { CryptoAndCommodities } from './components/CryptoAndCommodities';
import { EconomicCalendar } from './components/EconomicCalendar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { SuperChartModal } from './components/SuperChartModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { EconomicCalendarModal } from './components/EconomicCalendarModal';
import { AllStocksModal } from './components/AllStocksModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tv_theme');
      return saved === 'dark';
    }
    return false;
  });

  // Watchlist state
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tv_watchlist');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore
        }
      }
    }
    return ['NVDA', 'AAPL', 'BTC', 'SPX'];
  });

  // Category and View filters
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('Indices');
  const [selectedMarketView, setSelectedMarketView] = useState('Markets, everywhere');

  // Active Symbol and Timeframe
  const [selectedSymbol, setSelectedSymbol] = useState<DetailedSymbol>(SYMBOLS_REGISTRY['NVDA']);
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [superChartOpen, setSuperChartOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [allStocksOpen, setAllStocksOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedCalendarEvent, setSelectedCalendarEvent] = useState<EconomicEvent | null>(null);

  // Live simulation tick state
  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [flashTicker, setFlashTicker] = useState<string | null>(null);
  const [flashDirection, setFlashDirection] = useState<'up' | 'down' | null>(null);

  // Dynamic live indices data for ticks
  const [indices, setIndices] = useState<IndexData[]>(INDICES_DATA);
  const [mostActive, setMostActive] = useState<StockMover[]>(MOST_ACTIVE_STOCKS);
  const [topGainers, setTopGainers] = useState<StockMover[]>(TOP_GAINERS);
  const [topLosers, setTopLosers] = useState<StockMover[]>(TOP_LOSERS);
  const [cryptoItems, setCryptoItems] = useState<CryptoItem[]>(CRYPTO_DATA);
  const [commoditiesAndForex, setCommoditiesAndForex] = useState<CommodityOrForexItem[]>(COMMODITIES_AND_FOREX);

  // Sync dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('tv_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('tv_theme', 'light');
    }
  }, [isDark]);

  // Persist watchlist
  useEffect(() => {
    localStorage.setItem('tv_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Periodic subtle live tick simulation
  useEffect(() => {
    if (!isLiveSimulating) return;

    const interval = setInterval(() => {
      // Pick random market sector to tick
      const sector = Math.floor(Math.random() * 4);
      const isPositive = Math.random() > 0.45;
      const direction: 'up' | 'down' = isPositive ? 'up' : 'down';

      if (sector === 0 && indices.length > 0) {
        const randIndex = Math.floor(Math.random() * indices.length);
        const target = indices[randIndex];
        const tickDelta = (target.price * (Math.random() * 0.0008)) * (isPositive ? 1 : -1);
        const newPrice = Number((target.price + tickDelta).toFixed(2));
        const newChange = Number((target.change + tickDelta).toFixed(2));
        const newChangePercent = Number(((newChange / (newPrice - newChange)) * 100).toFixed(2));

        setIndices((prev) =>
          prev.map((item, i) =>
            i === randIndex
              ? {
                  ...item,
                  price: newPrice,
                  change: newChange,
                  changePercent: newChangePercent,
                }
              : item
          )
        );

        setFlashTicker(target.code);
        setFlashDirection(direction);
      } else if (sector === 1 && mostActive.length > 0) {
        const randIndex = Math.floor(Math.random() * mostActive.length);
        const target = mostActive[randIndex];
        const delta = (target.price * 0.0006) * (isPositive ? 1 : -1);
        const newPrice = Number((target.price + delta).toFixed(2));

        setMostActive((prev) =>
          prev.map((item, i) =>
            i === randIndex
              ? {
                  ...item,
                  price: newPrice,
                  change: Number((item.change + delta).toFixed(2)),
                  changePercent: Number((item.changePercent + (delta / newPrice) * 100).toFixed(2)),
                }
              : item
          )
        );

        // If currently spotlighted, update symbol price
        if (selectedSymbol.ticker === target.ticker) {
          setSelectedSymbol((prev) => ({
            ...prev,
            price: newPrice,
          }));
        }

        setFlashTicker(target.ticker);
        setFlashDirection(direction);
      } else if (sector === 2 && cryptoItems.length > 0) {
        const randIndex = Math.floor(Math.random() * cryptoItems.length);
        const target = cryptoItems[randIndex];
        const delta = (target.price * 0.001) * (isPositive ? 1 : -1);
        const newPrice = Number((target.price + delta).toFixed(2));

        setCryptoItems((prev) =>
          prev.map((item, i) =>
            i === randIndex
              ? {
                  ...item,
                  price: newPrice,
                  changePercent: Number((item.changePercent + (delta / newPrice) * 100).toFixed(2)),
                }
              : item
          )
        );

        if (selectedSymbol.ticker === target.ticker) {
          setSelectedSymbol((prev) => ({
            ...prev,
            price: newPrice,
          }));
        }

        setFlashTicker(target.ticker);
        setFlashDirection(direction);
      }

      setTimeout(() => {
        setFlashTicker(null);
        setFlashDirection(null);
      }, 1000);
    }, 3800);

    return () => clearInterval(interval);
  }, [isLiveSimulating, indices, mostActive, cryptoItems, selectedSymbol]);

  // Handle Watchlist Toggle
  const handleToggleWatchlist = (ticker: string) => {
    setWatchlist((prev) =>
      prev.includes(ticker) ? prev.filter((t) => t !== ticker) : [...prev, ticker]
    );
  };

  // Category Selection Handler
  const handleSelectCategory = (category: MarketCategory) => {
    setActiveCategory(category);
    if (category === 'Crypto') {
      const btc = getOrCreateSymbol('BTC', 'Bitcoin', 68432.10, 2.45);
      setSelectedSymbol(btc);
    } else if (category === 'Futures & commodities') {
      const gold = getOrCreateSymbol('GOLD', 'Gold Spot', 2721.40, 0.75);
      setSelectedSymbol(gold);
    } else if (category === 'Forex & currencies') {
      const eurusd = getOrCreateSymbol('EURUSD', 'EUR / USD', 1.0824, -0.19);
      setSelectedSymbol(eurusd);
    } else if (category === 'Economy') {
      setCalendarOpen(true);
    } else if (category === 'World stocks') {
      const nikkei = getOrCreateSymbol('NI225', 'Nikkei 225', 38981.75, 1.12);
      setSelectedSymbol(nikkei);
    } else if (category === 'US stocks') {
      setAllStocksOpen(true);
    } else {
      setSelectedSymbol(SYMBOLS_REGISTRY['NVDA']);
    }
  };

  // Switch Spotlight symbol from any click
  const handleSelectIndex = (idx: IndexData) => {
    const symbol = getOrCreateSymbol(idx.code, idx.name, idx.price, idx.changePercent);
    setSelectedSymbol(symbol);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleSelectStock = (stock: StockMover) => {
    const symbol = getOrCreateSymbol(stock.ticker, stock.name, stock.price, stock.changePercent);
    setSelectedSymbol(symbol);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleSelectCrypto = (crypto: CryptoItem) => {
    const symbol = getOrCreateSymbol(crypto.ticker, crypto.name, crypto.price, crypto.changePercent);
    setSelectedSymbol(symbol);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleSelectCommodityOrForex = (item: CommodityOrForexItem) => {
    const symbol = getOrCreateSymbol(
      item.ticker.replace(/[^A-Za-z0-9]/g, '') || item.name,
      item.name,
      item.price,
      item.changePercent
    );
    setSelectedSymbol(symbol);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  const handleSearchSelect = (ticker: string, name: string, price: number, changePercent: number) => {
    const symbol = getOrCreateSymbol(ticker, name, price, changePercent);
    setSelectedSymbol(symbol);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#131722] text-[#131722] dark:text-[#d1d4dc] transition-colors">
      {/* Main Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        onOpenWatchlist={() => setWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isLiveSimulating={isLiveSimulating}
        onToggleLiveSimulation={() => setIsLiveSimulating(!isLiveSimulating)}
      />

      {/* Page Hero Header */}
      <HeroSection
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        selectedMarketView={selectedMarketView}
        onSelectMarketView={setSelectedMarketView}
      />

      {/* Main Content Sections */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-12">
        {/* Section 1: Major Indices Carousel/Cards */}
        <IndicesCarousel
          indices={indices}
          selectedTicker={selectedSymbol.ticker}
          onSelectIndex={handleSelectIndex}
          flashTicker={flashTicker}
          flashDirection={flashDirection}
        />

        {/* Section 2: Interactive Symbol Chart / Spotlight Preview */}
        <SpotlightChart
          symbol={selectedSymbol}
          timeframe={timeframe}
          onChangeTimeframe={setTimeframe}
          onOpenSuperChart={() => setSuperChartOpen(true)}
          isWatchlisted={watchlist.includes(selectedSymbol.ticker)}
          onToggleWatchlist={() => handleToggleWatchlist(selectedSymbol.ticker)}
        />

        {/* Section 3: Market Movers (3-Column Layout: Volume, Gainers, Losers) */}
        <MarketMovers
          mostActive={mostActive}
          topGainers={topGainers}
          topLosers={topLosers}
          selectedTicker={selectedSymbol.ticker}
          onSelectStock={handleSelectStock}
          watchlist={watchlist}
          onToggleWatchlist={handleToggleWatchlist}
          onViewAllStocks={() => setAllStocksOpen(true)}
          flashTicker={flashTicker}
          flashDirection={flashDirection}
        />

        {/* Section 4: Crypto & Commodities/Currencies */}
        <CryptoAndCommodities
          cryptoItems={cryptoItems}
          commoditiesAndForex={commoditiesAndForex}
          onSelectCrypto={handleSelectCrypto}
          onSelectCommodityOrForex={handleSelectCommodityOrForex}
          onViewAllCrypto={() => {
            setActiveCategory('Crypto');
            handleSelectCrypto(cryptoItems[0]);
          }}
          flashTicker={flashTicker}
          flashDirection={flashDirection}
        />

        {/* Section 5: Calendar Strip (Earnings & Macro Economic) */}
        <EconomicCalendar
          events={CALENDAR_EVENTS}
          onOpenFullCalendar={() => setCalendarOpen(true)}
          onSelectEvent={(event) => {
            setSelectedCalendarEvent(event);
            setCalendarOpen(true);
          }}
        />
      </main>

      {/* Main Footer */}
      <Footer />

      {/* Interactive Modals and Drawers */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectSymbol={handleSearchSelect}
      />

      <SuperChartModal
        isOpen={superChartOpen}
        onClose={() => setSuperChartOpen(false)}
        symbol={selectedSymbol}
        isWatchlisted={watchlist.includes(selectedSymbol.ticker)}
        onToggleWatchlist={() => handleToggleWatchlist(selectedSymbol.ticker)}
      />

      <WatchlistDrawer
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        watchlist={watchlist}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onSelectSymbol={(ticker) => {
          const sym = getOrCreateSymbol(ticker);
          setSelectedSymbol(sym);
        }}
        onClearAll={() => setWatchlist([])}
      />

      <EconomicCalendarModal
        isOpen={calendarOpen}
        onClose={() => {
          setCalendarOpen(false);
          setSelectedCalendarEvent(null);
        }}
        selectedEvent={selectedCalendarEvent}
      />

      <AllStocksModal
        isOpen={allStocksOpen}
        onClose={() => setAllStocksOpen(false)}
        onSelectStock={handleSelectStock}
        watchlist={watchlist}
        onToggleWatchlist={handleToggleWatchlist}
      />

      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />
    </div>
  );
}
