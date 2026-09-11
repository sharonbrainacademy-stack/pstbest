import React from 'react';
import { useMinistry } from '../context/MinistryContext';
import { MessageCircle, Flame } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { config } = useMinistry();

  return (
    <div className="fixed bottom-24 sm:bottom-28 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 group animate-fade-in-up">
      {/* Tooltip bubble on hover */}
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-xl border border-emerald-500/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
        <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span>Join WhatsApp Prayer Altar</span>
      </div>

      <a
        href={config.whatsappPrayerChannelUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="floating-whatsapp-btn"
        className="relative flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-2xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 border-2 border-emerald-300/60"
        style={{
          backgroundColor: '#059669',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25), 0 0 16px rgba(16, 185, 129, 0.4)'
        }}
        aria-label="Join Pastor Best Eghosa WhatsApp Prayer Channel"
      >
        {/* Glowing pulse ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-30 animate-ping pointer-events-none" />

        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white text-emerald-600" />
        </div>

        <div className="flex flex-col items-start leading-tight">
          <span className="text-[10px] uppercase font-semibold text-emerald-100 tracking-wider">
            WhatsApp Channel
          </span>
          <span className="font-bold text-white whitespace-nowrap">
            Prayer Fire Network
          </span>
        </div>
      </a>
    </div>
  );
};
