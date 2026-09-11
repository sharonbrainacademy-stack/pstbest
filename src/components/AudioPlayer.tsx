import React, { useState } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown, 
  Music2, 
  Radio, 
  Share2 
} from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const { 
    currentSermon, 
    isPlaying, 
    togglePlay, 
    playbackSeconds, 
    seek, 
    volume, 
    setVolume, 
    skipForward, 
    skipBackward,
    config,
    showToast
  } = useMinistry();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVol, setPrevVol] = useState(volume);

  if (!currentSermon) return null;

  const totalDuration = currentSermon.durationSeconds || 3600;
  const progressPercent = Math.min(100, Math.max(0, (playbackSeconds / totalDuration) * 100));

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = Math.floor(secs % 60);
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = parseFloat(e.target.value);
    const targetSeconds = Math.round((newPercent / 100) * totalDuration);
    seek(targetSeconds);
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(prevVol || 0.8);
      setIsMuted(false);
    } else {
      setPrevVol(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleShareSermon = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Listen to "${currentSermon.title}" by ${currentSermon.preacher} on ${config.motto} - ${window.location.href}`
      );
      showToast('Sermon link copied to clipboard! Share the blessing.', 'info');
    }
  };

  return (
    <aside 
      aria-label="Audio Sermon Player"
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out border-t shadow-2xl ${
        isMinimized ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
      } bg-[#0A2342] border-amber-500/40 text-white`}
      style={{ backgroundColor: '#0A2342' }}
    >
      {/* Minimize / Expand Bar Tab */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute -top-6 right-8 px-4 py-1 rounded-t-lg bg-[#0A2342] border-t border-x border-amber-500/40 text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1 hover:text-white transition-colors"
        style={{ backgroundColor: '#0A2342' }}
        aria-label={isMinimized ? 'Expand sermon player' : 'Minimize sermon player'}
      >
        <Radio className="w-3 h-3 text-amber-400 animate-pulse" />
        <span>{isMinimized ? 'Expand Sermon Player' : 'Hide Player'}</span>
        {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Seeker Progress Bar */}
      <div className="relative w-full h-1.5 bg-slate-800 cursor-pointer group">
        <div 
          className="h-full relative transition-all"
          style={{ 
            width: `${progressPercent}%`,
            backgroundColor: config.accentColor || '#D4AF37'
          }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md transform scale-0 group-hover:scale-100 transition-transform" />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={progressPercent}
          onChange={handleSeekChange}
          aria-label="Seek sermon audio playback"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Left: Track Information */}
          <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
            <div 
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border border-amber-400/40 shadow-inner relative overflow-hidden"
              style={{ backgroundColor: config.primaryColor }}
            >
              <Music2 className="w-5 h-5 text-amber-200" />
              {isPlaying && (
                <div className="absolute inset-0 flex items-end justify-center gap-0.5 pb-1.5 bg-black/20">
                  <span className="w-1 bg-amber-300 rounded-full animate-bounce h-3" />
                  <span className="w-1 bg-amber-300 rounded-full animate-bounce h-5 [animation-delay:150ms]" />
                  <span className="w-1 bg-amber-300 rounded-full animate-bounce h-2 [animation-delay:300ms]" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {currentSermon.category}
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  {currentSermon.scripture}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white truncate mt-0.5 font-serif-royal">
                {currentSermon.title}
              </h3>
              <p className="text-xs text-amber-200/90 truncate">
                {currentSermon.preacher}
              </p>
            </div>
          </div>

          {/* Center: Controls & Timers */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3 gap-1">
            <div className="flex items-center gap-4">
              <button
                onClick={skipBackward}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Rewind 15 seconds"
                aria-label="Rewind 15 seconds"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                id="floating-audio-play-toggle"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-slate-950 font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 border border-amber-200"
                style={{ backgroundColor: config.accentColor || '#D4AF37' }}
                aria-label={isPlaying ? 'Pause sermon audio' : 'Play sermon audio'}
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-0.5" />}
              </button>

              <button
                onClick={skipForward}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Forward 15 seconds"
                aria-label="Forward 15 seconds"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
              <span>{formatTime(playbackSeconds)}</span>
              <span>/</span>
              <span>{currentSermon.duration}</span>
            </div>
          </div>

          {/* Right: Volume & Share Actions */}
          <div className="hidden md:flex items-center justify-end gap-4 w-1/3">
            <button
              onClick={handleShareSermon}
              className="p-2 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
              title="Share Sermon Link"
              aria-label="Share Sermon Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMuteToggle}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={e => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                aria-label="Adjust volume"
              />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
