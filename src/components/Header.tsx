import React, { useState } from 'react';
import { Search, Globe, User, Moon, Sun, Star, Activity, Check } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenProfile: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  isLiveSimulating: boolean;
  onToggleLiveSimulation: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenProfile,
  onOpenWatchlist,
  watchlistCount,
  isDark,
  onToggleTheme,
  isLiveSimulating,
  onToggleLiveSimulation,
}) => {
  const [activeNav, setActiveNav] = useState('Markets');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'ES', name: 'Español' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#131722] border-b border-[#e0e3eb] dark:border-[#2a2e39] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between gap-4">
        {/* Brand & Search Left Container */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* TradingView Iconic Poly-shape Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="TradingView Home"
            className="flex items-center gap-1.5 focus:outline-none cursor-pointer group"
          >
            <svg
              className="w-9 h-7 fill-current text-[#131722] dark:text-white group-hover:text-[#2962ff] transition-colors"
              viewBox="0 0 36 28"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M7.05882 17.5V28H0V0H7.05882V17.5ZM21.1765 7H14.1176V28H21.1765V7ZM28.2353 14H35.2941V28H28.2353V14Z" />
            </svg>
          </button>

          {/* Search Bar with Shortcut */}
          <button
            onClick={onOpenSearch}
            className="relative w-44 sm:w-64 md:w-72 lg:w-80 flex items-center bg-[#f0f3fa] dark:bg-[#1e222d] hover:bg-[#e8ebf2] dark:hover:bg-[#2a2e39] transition-colors rounded-full px-3.5 py-1.5 cursor-pointer text-[#6a6d78] dark:text-[#787b86] text-sm text-left focus:outline-none focus:ring-2 focus:ring-[#2962ff]/40"
            data-purpose="header-search"
          >
            <Search className="w-4 h-4 mr-2.5 text-[#6a6d78] dark:text-[#787b86] shrink-0" />
            <span className="text-sm truncate">Search (Ctrl+K)</span>
            <span className="hidden sm:inline-block ml-auto text-[10px] font-mono border border-[#e0e3eb] dark:border-[#2a2e39] rounded px-1.5 py-0.5 text-[#9598a1] dark:text-[#787b86]">
              ⌘K
            </span>
          </button>
        </div>

        {/* Center Primary Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden lg:flex items-center gap-7 text-[15px] font-semibold tracking-tight"
        >
          {['Products', 'Community', 'Markets', 'Brokers', 'More'].map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`py-5 transition-colors cursor-pointer relative ${
                  isActive
                    ? 'text-[#2962ff] dark:text-[#3871ff]'
                    : 'text-[#6a6d78] dark:text-[#787b86] hover:text-[#131722] dark:hover:text-white'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2962ff] dark:bg-[#3871ff]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Simulation Pulse Toggle */}
          <button
            onClick={onToggleLiveSimulation}
            title={isLiveSimulating ? 'Live Market Ticks Active' : 'Market Ticks Paused'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isLiveSimulating
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                : 'bg-[#f0f3fa] dark:bg-[#1e222d] text-[#6a6d78] dark:text-[#787b86] border-transparent'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${isLiveSimulating ? 'animate-pulse text-emerald-600' : ''}`} />
            <span>{isLiveSimulating ? 'Live' : 'Static'}</span>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={onOpenWatchlist}
            className="relative p-1.5 text-[#6a6d78] dark:text-[#787b86] hover:text-[#2962ff] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] rounded-full transition-colors"
            title="Open Watchlist"
          >
            <Star className="w-5 h-5" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2962ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 text-[#6a6d78] dark:text-[#787b86] hover:text-[#2962ff] dark:hover:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] rounded-full transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1.5 text-[#131722] dark:text-[#d1d4dc] hover:text-[#2962ff] px-2 py-1.5 rounded-md text-sm font-semibold transition-colors hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d]"
              title="Change Language"
              type="button"
            >
              <Globe className="w-4 h-4 text-[#6a6d78] dark:text-[#787b86]" />
              <span className="text-xs uppercase tracking-wider">{selectedLang}</span>
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl shadow-xl py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9598a1] dark:text-[#787b86]">
                  Select Region / Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      setShowLangMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs flex items-center justify-between text-[#131722] dark:text-[#d1d4dc] hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors"
                  >
                    <span>{lang.name}</span>
                    {selectedLang === lang.code && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Icon */}
          <button
            onClick={onOpenProfile}
            className="text-[#131722] dark:text-[#d1d4dc] hover:text-[#2962ff] p-1.5 rounded-full hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] transition-colors"
            title="Account Profile & Settings"
            type="button"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Primary CTA Button */}
          <button
            onClick={onOpenProfile}
            className="tv-btn-gradient text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 rounded-full transition-all duration-150 whitespace-nowrap shadow-sm cursor-pointer"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
