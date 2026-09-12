import React, { useState } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  MessageCircle, 
  ShieldCheck, 
  Headphones, 
  BookOpen, 
  Calendar, 
  Heart, 
  Mail, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPrayerModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenPrayerModal }) => {
  const { config, isDarkMode, toggleDarkMode, isAdminLoggedIn, isPlaying, togglePlay, currentSermon } = useMinistry();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', fullLabel: 'Home' },
    { id: 'about', label: 'About', fullLabel: 'About Pastor Best' },
    { id: 'sermons', label: 'Sermons', fullLabel: 'Word Café & Sermons' },
    { id: 'books', label: 'Books', fullLabel: 'Books' },
    { id: 'events', label: 'Events', fullLabel: 'Events' },
    { id: 'giving', label: 'Giving', fullLabel: 'Giving' },
    { id: 'booking', label: 'Contact', fullLabel: 'Contact & Booking' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Top Quick Actions Header Bar */}
      <div 
        className="w-full py-1.5 px-3 sm:px-6 text-xs text-white shadow-xs border-b border-amber-500/20 overflow-x-auto no-scrollbar"
        style={{ backgroundColor: config.primaryColor }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 min-w-max sm:min-w-0">
          
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1. Listen to Sermon */}
            <button
              onClick={() => handleNavClick('sermons')}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 hover:bg-amber-400/35 text-amber-200 hover:text-white font-bold transition-all border border-amber-400/50 text-[11px] whitespace-nowrap"
            >
              <Headphones className="w-3 h-3 text-amber-300 shrink-0" />
              <span>Listen to Sermon</span>
            </button>

            {/* 2. Book for Ministration */}
            <button
              onClick={() => handleNavClick('booking')}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold transition-all border border-white/30 text-[11px] whitespace-nowrap"
            >
              <Calendar className="w-3 h-3 text-amber-300 shrink-0" />
              <span>Book for Ministration</span>
            </button>

            {/* 3. Join WhatsApp Prayer Channel */}
            <a
              href={config.whatsappPrayerChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold transition-all border border-emerald-300/50 text-[11px] whitespace-nowrap"
            >
              <MessageCircle className="w-3 h-3 text-emerald-200 shrink-0" />
              <span>Join WhatsApp Prayer Channel</span>
            </a>
          </div>

          {/* Right Side: Send Prayer Request */}
          <button
            onClick={onOpenPrayerModal}
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-amber-100 hover:text-white font-semibold transition-colors text-[11px] whitespace-nowrap"
          >
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            <span>Send Prayer Request</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav 
        className="border-b transition-colors duration-200 bg-white dark:bg-[#0A2342] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 shadow-md"
        style={{ backgroundColor: isDarkMode ? '#0A2342' : '#ffffff' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* Logo and Brand Identity */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group select-none shrink-0"
            >
              <div 
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-serif-royal text-lg sm:text-xl font-bold shadow-md transition-transform group-hover:scale-105 border border-amber-300/40 shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${config.primaryColor} 0%, #6e0015 100%)`
                }}
              >
                <span className="text-amber-300 font-bold">PBE</span>
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-serif-royal font-bold text-base sm:text-lg lg:text-xl tracking-tight text-slate-950 dark:text-white whitespace-nowrap">
                    PST BEST EGHOSA
                  </span>
                  <span 
                    className="hidden md:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded text-amber-900 dark:text-amber-200 bg-amber-400/25 dark:bg-amber-400/20 border border-amber-500/40 whitespace-nowrap"
                  >
                    Grace Chapel
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300 font-medium truncate max-w-[180px] sm:max-w-xs">
                  {config.churchName || 'Champions of Grace Assembly, Incorporated'}
                </span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="hidden lg:flex items-center space-x-0.5 xl:space-x-1.5 shrink-0">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-2 py-1.5 xl:px-3 xl:py-2 rounded-lg text-[11px] xl:text-xs font-bold uppercase tracking-wider transition-all duration-200 relative whitespace-nowrap ${
                      isActive
                        ? 'text-rose-700 bg-rose-50 dark:text-amber-300 dark:bg-white/10 shadow-xs'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 dark:text-slate-200 dark:hover:text-white dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="hidden xl:inline">{item.fullLabel}</span>
                    <span className="xl:hidden">{item.label}</span>

                    {isActive && (
                      <span 
                        className="absolute bottom-0 left-1.5 right-1.5 h-0.5 rounded-full"
                        style={{ backgroundColor: config.primaryColor }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Action Utilities */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Admin Portal Quick Access */}
              <button
                id="header-admin-btn"
                onClick={() => handleNavClick('admin')}
                className={`px-2.5 py-2 sm:px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  activeTab === 'admin'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-400 dark:text-amber-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:border-amber-400'
                }`}
                title="Admin Portal Login"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span className="hidden sm:inline">Admin</span>
                {isAdminLoggedIn && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                )}
              </button>

              {/* Theme Toggle Button */}
              <button
                id="theme-toggle-btn"
                onClick={toggleDarkMode}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-500 hover:border-amber-400 transition-colors"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-2 pb-6 border-t border-slate-200 dark:border-slate-800 space-y-1 bg-white dark:bg-[#0A2342] shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="py-2 px-3 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
              Navigation Menu
            </div>
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-900 dark:bg-white/10 dark:text-amber-400'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.id === 'home' && <Sparkles className="w-4 h-4 text-amber-500" />}
                    {item.id === 'about' && <ShieldCheck className="w-4 h-4 text-rose-500" />}
                    {item.id === 'sermons' && <Headphones className="w-4 h-4 text-emerald-500" />}
                    {item.id === 'books' && <BookOpen className="w-4 h-4 text-blue-500" />}
                    {item.id === 'events' && <Calendar className="w-4 h-4 text-purple-500" />}
                    {item.id === 'giving' && <Heart className="w-4 h-4 text-rose-500" />}
                    {item.id === 'booking' && <Mail className="w-4 h-4 text-amber-500" />}
                    {item.id === 'admin' && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                    <span>{item.fullLabel}</span>
                  </div>

                  {isActive && <ChevronRight className="w-4 h-4 text-amber-500" />}
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenPrayerModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-amber-500/40 text-amber-600 dark:text-amber-300 text-sm font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Prayer Petition</span>
              </button>

              <a
                href={config.whatsappPrayerChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Prayer Channel</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
