import React, { useState } from 'react';
import { X, User, Bell, Check, Shield, Zap } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  isDark,
  onToggleTheme,
}) => {
  const [currency, setCurrency] = useState('USD');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-[#1e222d] rounded-2xl shadow-2xl border border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2962ff] text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#131722] dark:text-white">
                Account &amp; Preferences
              </h3>
              <p className="text-xs text-[#6a6d78] dark:text-[#787b86]">
                TradingView Pro Member
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#6a6d78] hover:text-[#131722] dark:hover:text-white rounded-lg hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-sm">
          {/* Member Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-100 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                <span>SuperCharts Active</span>
              </div>
              <p className="font-bold text-base mt-1">yaanipha.v@gmail.com</p>
              <p className="text-xs text-blue-100 mt-0.5">Real-time ICE exchange data enabled</p>
            </div>
            <div className="bg-white/20 px-2.5 py-1 rounded-full text-xs font-bold">
              PRO+
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#6a6d78] dark:text-[#787b86] uppercase tracking-wider mb-2">
                Display Currency
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['USD', 'EUR', 'GBP', 'JPY'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCurrency(c)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      currency === c
                        ? 'border-[#2962ff] bg-blue-50 dark:bg-blue-950/40 text-[#2962ff]'
                        : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#131722] dark:text-white hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Preference */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-sm text-[#131722] dark:text-white">Dark Theme</p>
                <p className="text-xs text-[#6a6d78] dark:text-[#787b86]">
                  High contrast dark interface for late-night charting
                </p>
              </div>
              <button
                type="button"
                onClick={onToggleTheme}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  isDark ? 'bg-[#2962ff]' : 'bg-[#e0e3eb]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
                    isDark ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Price Alert Notifications */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold text-sm text-[#131722] dark:text-white">Price Alerts</p>
                <p className="text-xs text-[#6a6d78] dark:text-[#787b86]">
                  Browser push alerts on 5% volatility movements
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  alertsEnabled ? 'bg-[#089981]' : 'bg-[#e0e3eb]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform transform shadow-sm ${
                    alertsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-[#e0e3eb] dark:border-[#2a2e39] flex items-center gap-2 text-xs text-[#6a6d78] dark:text-[#787b86]">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>256-bit encrypted connection to global market streams</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 bg-[#fafbfe] dark:bg-[#181c27] border-t border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#6a6d78] hover:text-[#131722] dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="tv-btn-gradient text-white text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
