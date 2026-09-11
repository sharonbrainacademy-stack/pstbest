import React, { useState } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { RefreshCw, Sparkles, Copy, Check, Quote, Volume2 } from 'lucide-react';

export const DailyScriptureCard: React.FC = () => {
  const { currentScripture, refreshDailyScripture, config, showToast } = useMinistry();
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const handleRefresh = () => {
    setIsRotating(true);
    refreshDailyScripture();
    setTimeout(() => setIsRotating(false), 500);
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Prophetic Word for Today:\n${currentScripture.verse}\n— ${currentScripture.reference}\n\nDeclaration: ${currentScripture.declaration}\n— Pastor Eghosa Best IGBINOVIA`
      );
      setCopied(true);
      showToast('Prophetic scripture and declaration copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div 
      className="w-full relative overflow-hidden rounded-3xl border border-amber-500/40 bg-[#0A2342] text-white shadow-2xl p-6 sm:p-8"
      style={{ backgroundColor: '#0A2342' }}
    >
      {/* Decorative ambient glowing circles */}
      <div 
        className="absolute -right-16 -top-16 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: config.accentColor }}
      />
      <div 
        className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: config.primaryColor }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-amber-500/30">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-amber-300/50 shadow-inner shrink-0"
            style={{ backgroundColor: config.primaryColor }}
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
              <span>Prophetic Scripture of the Day</span>
            </span>
            <h3 className="text-base sm:text-lg font-serif-royal font-bold text-white">
              {currentScripture.propheticTheme}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
            title="Copy scripture and declaration"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            id="refresh-scripture-btn"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-md"
            style={{ backgroundColor: config.accentColor }}
            title="Receive another prophetic scripture"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
            <span>Refresh Word</span>
          </button>
        </div>
      </div>

      {/* Main Scripture Text */}
      <div className="relative z-10 my-6">
        <Quote className="w-8 h-8 text-amber-400 mb-2 opacity-80" />
        <blockquote className="font-serif-royal text-lg sm:text-2xl text-white leading-relaxed font-bold italic drop-shadow-xs">
          {currentScripture.verse}
        </blockquote>
        <div className="mt-4 flex items-center justify-end">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 border border-amber-400/50 shadow-xs">
            — {currentScripture.reference}
          </span>
        </div>
      </div>

      {/* Pastoral Reflection & Prophetic Declaration */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-amber-500/30">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#051329] border border-amber-500/30 shadow-inner" style={{ backgroundColor: '#051329' }}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-1.5">
            <Volume2 className="w-3 h-3 text-amber-400" />
            <span>Spiritual Insight</span>
          </span>
          <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
            {currentScripture.reflection}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#1d080e] border border-rose-500/40 shadow-inner" style={{ backgroundColor: '#1d080e' }}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Prophetic Declaration</span>
          </span>
          <p className="text-xs sm:text-sm text-amber-200 font-semibold italic leading-relaxed">
            {currentScripture.declaration}
          </p>
        </div>
      </div>
    </div>
  );
};
