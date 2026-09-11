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
  Share2,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  X,
  Sparkles
} from 'lucide-react';
import { AudioConversionModal } from './AudioConversionModal';

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
    showToast,
    audioPlaybackError,
    clearAudioError,
    isGoogleDriveAudio,
    googleDriveEmbedUrl
  } = useMinistry();

  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVol, setPrevVol] = useState(volume);
  const [showDriveEmbed, setShowDriveEmbed] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);

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
    <>
      <aside 
        aria-label="Audio Sermon Player"
        className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out border-t shadow-2xl ${
          isMinimized ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
        } bg-[#0A2342] border-amber-500/40 text-white`}
        style={{ backgroundColor: '#0A2342' }}
      >
        {/* Error / Google Drive Alert Notification Banner */}
        {audioPlaybackError && (
          <div className="bg-amber-500/90 text-slate-950 px-4 py-1.5 text-xs flex items-center justify-between font-medium shadow-inner">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-slate-950" />
              <span>
                {isGoogleDriveAudio 
                  ? 'Google Drive stream restricted or blocked. Use Google Drive Native Player below or verify link sharing.'
                  : 'Audio stream could not be loaded directly. Please check the URL format.'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {isGoogleDriveAudio && (
                <button
                  onClick={() => setShowDriveEmbed(true)}
                  className="px-2.5 py-0.5 rounded bg-slate-950 text-amber-300 text-[11px] font-bold hover:bg-slate-900 transition-colors"
                >
                  Open Google Player
                </button>
              )}
              <button
                onClick={() => setShowConvertModal(true)}
                className="underline text-[11px] font-bold hover:text-white flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Convert to MP3</span>
              </button>
              <button
                onClick={() => setShowHelpModal(true)}
                className="underline text-[11px] font-bold hover:text-white"
              >
                Linking Guide
              </button>
              <button onClick={clearAudioError} className="p-0.5 hover:opacity-75">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

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
                  {isGoogleDriveAudio && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      Drive
                    </span>
                  )}
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

            {/* Right: Volume, Embed Toggle & Help */}
            <div className="hidden md:flex items-center justify-end gap-3 w-1/3">
              {isGoogleDriveAudio && (
                <button
                  onClick={() => setShowDriveEmbed(!showDriveEmbed)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                    showDriveEmbed 
                      ? 'bg-amber-500 text-slate-950 border-amber-400' 
                      : 'bg-white/10 text-amber-300 border-amber-500/30 hover:bg-white/15'
                  }`}
                  title="Open Google Drive Native Player"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Player</span>
                </button>
              )}

              <button
                onClick={() => setShowConvertModal(true)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
                title="How to convert audio or WhatsApp voice notes to MP3"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline">Convert to MP3</span>
              </button>

              <button
                onClick={() => setShowHelpModal(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
                title="Audio Linking Step-by-Step Guide"
                aria-label="Audio Linking Guide"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <button
                onClick={handleShareSermon}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
                title="Share Sermon Link"
                aria-label="Share Sermon Link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
                <button
                  onClick={handleMuteToggle}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
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
                  className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  aria-label="Adjust volume"
                />
              </div>
            </div>
          </div>

          {/* Embedded Google Drive Native Player (Toggleable) */}
          {showDriveEmbed && googleDriveEmbedUrl && (
            <div className="mt-3 pt-3 border-t border-amber-500/30">
              <div className="flex items-center justify-between pb-2 text-xs text-amber-300 font-semibold">
                <div className="flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Google Drive Native Audio Player (100% Direct Playback)</span>
                </div>
                <button
                  onClick={() => setShowDriveEmbed(false)}
                  className="text-slate-400 hover:text-white text-xs underline"
                >
                  Close Frame
                </button>
              </div>
              <iframe
                src={googleDriveEmbedUrl}
                title="Google Drive Audio Stream"
                className="w-full h-28 rounded-xl border border-slate-700 bg-slate-900"
                allow="autoplay"
              />
            </div>
          )}
        </div>
      </aside>

      {/* Audio Linking Procedure Guide Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold font-serif-royal text-slate-900 dark:text-white">
                  Audio Linking: Step-by-Step Procedure
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  How to properly link sermons and voice notes so they play seamlessly on all devices.
                </p>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
              
              {/* Quick Conversion Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 to-emerald-500/15 border border-amber-500/30 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-amber-900 dark:text-amber-300 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Have a WhatsApp Audio (.opus) or Voice Memo (.m4a)?</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    Convert any voice note or recording to a universal MP3 in 30 seconds, or upload directly!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowHelpModal(false);
                    setShowConvertModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shrink-0 shadow-xs"
                >
                  Convert to MP3
                </button>
              </div>

              {/* Method 1: Google Drive */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-bold">1</span>
                  <span>Google Drive (Why it fails & How to fix it)</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-8">
                  <p>
                    <strong>Why your Google Drive link wasn't working:</strong> By default, Google Drive links are set to <em>"Restricted"</em> (only you can see them), and Google's standard <code>/view</code> link is a webpage with Google menus, not a raw audio stream.
                  </p>
                  <p className="font-semibold text-rose-600 dark:text-rose-400">
                    Follow these 4 steps to link a Google Drive file:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Open <strong>Google Drive</strong> and find your uploaded MP3 audio file.</li>
                    <li>Right-click on the file and select <strong>Share &gt; Share</strong>.</li>
                    <li>Under <strong>General Access</strong>, change from <em>Restricted</em> to <strong>"Anyone with the link"</strong> (Role: Viewer). <em>This is required!</em></li>
                    <li>Click <strong>Copy link</strong> and paste it into the sermon URL field.</li>
                  </ol>
                  <p className="pt-1 text-[11px] text-amber-700 dark:text-amber-400">
                    ✨ Our system will automatically proxy the file or provide the built-in Google Drive Player toggle directly in the bar!
                  </p>
                </div>
              </div>

              {/* Method 2: Dropbox (Recommended) */}
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sky-900 dark:text-sky-300">
                  <span className="w-6 h-6 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>Dropbox (Recommended for Best Performance)</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-8">
                  <p>
                    Dropbox is the most reliable cloud hosting for audio streaming because it supports instant seeking and zero restrictions.
                  </p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Upload your audio file to <strong>Dropbox</strong>.</li>
                    <li>Click <strong>Share &gt; Create link</strong> (Anyone with link can view).</li>
                    <li>Copy the link and paste it into our website. Our system automatically converts it into a high-speed direct stream!</li>
                  </ol>
                </div>
              </div>

              {/* Method 3: Internet Archive / Direct MP3 */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span>Internet Archive (Archive.org - 100% Free & Unlimited)</span>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pl-8">
                  <p>
                    Used by churches worldwide for permanent, free sermon audio archiving. Upload your sermons at <span className="font-mono font-semibold">archive.org/upload</span> and copy the direct <code>.mp3</code> file download link.
                  </p>
                </div>
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
              >
                Understood, Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Audio Conversion and MP3 Help Modal */}
      <AudioConversionModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
      />
    </>
  );
};

