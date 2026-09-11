import React from 'react';
import { useMinistry } from '../context/MinistryContext';
import { Radio, Volume2, VolumeX, Play, Pause, X, MessageSquare, Sparkles } from 'lucide-react';

export const WhatsAppLiveAudioBanner: React.FC = () => {
  const {
    whatsappBroadcast,
    whatsappAutoPlay,
    toggleWhatsAppAutoPlay,
    dismissWhatsAppBroadcast,
    playSermon,
    isPlaying,
    currentSermon,
    togglePlay,
    config
  } = useMinistry();

  if (!whatsappBroadcast) return null;

  const isCurrentPlaying = isPlaying && currentSermon?.id === whatsappBroadcast.id;

  const handlePlayClick = () => {
    if (currentSermon?.id === whatsappBroadcast.id) {
      togglePlay();
    } else {
      playSermon({
        id: whatsappBroadcast.id,
        title: `📢 [WhatsApp Voice Note] ${whatsappBroadcast.title}`,
        preacher: whatsappBroadcast.preacher,
        date: 'Just now',
        scripture: 'Prophetic Live Voice Note',
        category: 'Prophetic',
        duration: '03:15',
        durationSeconds: 195,
        audioUrl: whatsappBroadcast.audioUrl,
        isPopular: true,
        summary: whatsappBroadcast.caption || 'Synced live from WhatsApp Channel.'
      });
    }
  };

  return (
    <div 
      className="bg-gradient-to-r from-emerald-950 via-slate-900 to-[#0A2342] border-b-2 border-emerald-500/50 text-white shadow-xl relative z-30 transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left: Live Status & Meta Info */}
          <div className="flex items-center gap-3 min-w-0 w-full md:w-auto">
            <div className="flex items-center gap-1.5 shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider animate-pulse">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Live Audio</span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-300 truncate font-serif-royal">
                  {whatsappBroadcast.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  • {whatsappBroadcast.postedAt}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate">
                {whatsappBroadcast.caption || 'Synced live from WhatsApp Channel'}
              </p>
            </div>
          </div>

          {/* Right: Controls & Auto-Play Toggle */}
          <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 border-slate-800 pt-2 md:pt-0">
            
            {/* Auto-Play Toggle Button */}
            <button
              onClick={toggleWhatsAppAutoPlay}
              title={whatsappAutoPlay ? 'Auto-Play is ON (New voice notes play automatically)' : 'Click to enable automatic audio playback for new broadcasts'}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                whatsappAutoPlay
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-400/50'
              }`}
            >
              {whatsappAutoPlay ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
              <span>{whatsappAutoPlay ? 'Auto-Play ON' : 'Enable Auto-Play'}</span>
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={handlePlayClick}
              className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 text-slate-950 transition-all transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: config.accentColor || '#D4AF37' }}
            >
              {isCurrentPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isCurrentPlaying ? 'Pause Broadcast' : 'Listen Now'}</span>
            </button>

            {/* Dismiss Button */}
            <button
              onClick={dismissWhatsAppBroadcast}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
