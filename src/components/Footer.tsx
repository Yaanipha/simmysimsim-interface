import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#131722] mt-12 text-[#6a6d78] dark:text-[#787b86] text-xs transition-colors" data-purpose="site-footer">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
        {/* Navigation Links Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-[#e0e3eb] dark:border-[#2a2e39]">
          <div>
            <h4 className="font-bold text-sm text-[#131722] dark:text-white mb-3">Products</h4>
            <ul className="space-y-2">
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">SuperCharts</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Pine Script™</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Stock Screener</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Forex Screener</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Crypto Screener</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Economic Calendar</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#131722] dark:text-white mb-3">Company</h4>
            <ul className="space-y-2">
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">About</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Features</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Pricing</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Wall of Love</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Blog</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Careers</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#131722] dark:text-white mb-3">Community</h4>
            <ul className="space-y-2">
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Refer a friend</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Ideas</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Scripts</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Streams</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">House Rules</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Moderators</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#131722] dark:text-white mb-3">For Business</h4>
            <ul className="space-y-2">
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Widgets</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Charting libraries</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Brokerage integration</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Advertising</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#131722] dark:text-white mb-3">Download</h4>
            <ul className="space-y-2">
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Desktop App</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Mobile App (iOS)</button></li>
              <li><button onClick={() => {}} className="hover:text-[#2962ff] dark:hover:text-[#3871ff] transition-colors cursor-pointer text-left">Mobile App (Android)</button></li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p>Select market data provided by ICE Data Services, BATS, and other global exchanges.</p>
            <p>© 2024 TradingView, Inc. All rights reserved. Look first / Then leap.</p>
          </div>
          <div className="text-xs text-[#9598a1] dark:text-[#787b86] flex items-center gap-1.5 flex-wrap">
            <span>Made with precision by humans</span>
            <span>•</span>
            <button onClick={() => {}} className="hover:underline text-[#6a6d78] dark:text-[#787b86] cursor-pointer">
              Terms of use
            </button>
            <span>•</span>
            <button onClick={() => {}} className="hover:underline text-[#6a6d78] dark:text-[#787b86] cursor-pointer">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
