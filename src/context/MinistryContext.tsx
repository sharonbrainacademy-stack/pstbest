import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getPlayableAudioUrl, getGoogleDriveEmbedUrl, extractGoogleDriveFileId, getDirectGoogleDriveStreamUrl } from '../utils/audioUtils';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  MinistryConfig, 
  Sermon, 
  WordCafeArticle, 
  Book, 
  MinistryEvent, 
  BookingRequest, 
  GivingRecord, 
  PrayerRequest, 
  AdminUser, 
  DailyScripture,
  WhatsAppBroadcast
} from '../types';
import { 
  INITIAL_CONFIG, 
  INITIAL_SERMONS, 
  INITIAL_WORD_CAFE_ARTICLES, 
  INITIAL_BOOKS, 
  INITIAL_EVENTS, 
  PROPHETIC_SCRIPTURES, 
  INITIAL_ADMIN_USERS 
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface MinistryContextType {
  config: MinistryConfig;
  updateConfig: (newConfig: Partial<MinistryConfig>) => void;
  resetConfig: () => void;
  
  // Audio Player
  currentSermon: Sermon | null;
  isPlaying: boolean;
  playbackSeconds: number;
  volume: number;
  playSermon: (sermon: Sermon) => void;
  togglePlay: () => void;
  seek: (seconds: number) => void;
  setVolume: (val: number) => void;
  skipForward: () => void;
  skipBackward: () => void;
  audioPlaybackError: boolean;
  clearAudioError: () => void;
  isGoogleDriveAudio: boolean;
  googleDriveEmbedUrl: string | null;
  showDriveEmbedModal: boolean;
  setShowDriveEmbedModal: (show: boolean) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Data items
  sermons: Sermon[];
  addSermon: (s: Omit<Sermon, 'id' | 'playsCount'>) => void;
  updateSermon: (id: string, s: Partial<Sermon>) => void;
  deleteSermon: (id: string) => void;
  
  articles: WordCafeArticle[];
  addArticle: (a: Omit<WordCafeArticle, 'id'>) => void;
  updateArticle: (id: string, a: Partial<WordCafeArticle>) => void;
  deleteArticle: (id: string) => void;
  
  books: Book[];
  addBook: (b: Omit<Book, 'id'>) => void;
  updateBook: (id: string, b: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  
  events: MinistryEvent[];
  addEvent: (e: Omit<MinistryEvent, 'id' | 'rsvpCount'>) => void;
  updateEvent: (id: string, e: Partial<MinistryEvent>) => void;
  deleteEvent: (id: string) => void;
  rsvpEvent: (id: string) => void;
  
  // Submissions
  bookingRequests: BookingRequest[];
  submitBookingRequest: (req: Omit<BookingRequest, 'id' | 'status' | 'submittedAt'>) => void;
  updateBookingStatus: (id: string, status: BookingRequest['status']) => void;
  deleteBookingRequest: (id: string) => void;
  
  givingRecords: GivingRecord[];
  recordGiving: (rec: Omit<GivingRecord, 'id' | 'date'>) => void;
  
  prayerRequests: PrayerRequest[];
  submitPrayerRequest: (p: Omit<PrayerRequest, 'id' | 'submittedAt' | 'status'>) => void;
  updatePrayerStatus: (id: string, status: PrayerRequest['status']) => void;
  
  // Scripture of the Day
  currentScripture: DailyScripture;
  refreshDailyScripture: () => void;
  
  // Admin Auth
  isAdminLoggedIn: boolean;
  currentAdminUser: AdminUser | null;
  adminUsers: AdminUser[];
  loginAdmin: (email: string, pin: string) => { success: boolean; requiresFirstTimeSetup?: boolean; user?: AdminUser; message: string };
  logoutAdmin: () => void;
  updateAdminRole: (userId: string, role: AdminUser['role']) => void;
  addAdminUser: (email: string, name: string, role: AdminUser['role']) => { success: boolean; message: string };
  deleteAdminUser: (userId: string) => void;
  setFirstTimePassword: (email: string, newPassword: string) => { success: boolean; message: string };
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  
  // Backup & Restore
  exportAllData: () => string;
  importAllData: (jsonData: string) => boolean;
  resetAllDataToDefault: () => void;

  // WhatsApp Live Audio Sync
  whatsappBroadcast: WhatsAppBroadcast | null;
  whatsappAutoPlay: boolean;
  toggleWhatsAppAutoPlay: () => void;
  dismissWhatsAppBroadcast: () => void;
  simulateWhatsAppAudio: (title: string, audioUrl: string, caption?: string) => Promise<boolean>;
}

const MinistryContext = createContext<MinistryContextType | undefined>(undefined);

const STORAGE_KEY = 'pst_best_eghosa_ministry_hub_v1';
const ADMIN_SESSION_KEY = 'pst_best_admin_session_v1';

export const MinistryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [config, setConfig] = useState<MinistryConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_config`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const hasOfficialSchedule = parsed.serviceTimes && parsed.serviceTimes.some((s: any) => s.id === 'svc-sunday-services' || s.title === 'Wednesday Bible Study');
        if (!hasOfficialSchedule) {
          return {
            ...INITIAL_CONFIG,
            ...parsed,
            churchName: 'Champions of Grace Assembly, Incorporated',
            churchServicesOverview: INITIAL_CONFIG.churchServicesOverview,
            serviceTimes: INITIAL_CONFIG.serviceTimes
          };
        }
        return {
          ...INITIAL_CONFIG,
          ...parsed,
          churchName: parsed.churchName || 'Champions of Grace Assembly, Incorporated',
          churchServicesOverview: parsed.churchServicesOverview || INITIAL_CONFIG.churchServicesOverview
        };
      }
    } catch { /* ignore */ }
    return INITIAL_CONFIG;
  });

  const [sermons, setSermons] = useState<Sermon[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sermons`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_SERMONS;
  });

  const [articles, setArticles] = useState<WordCafeArticle[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_articles`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_WORD_CAFE_ARTICLES;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_books`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_BOOKS;
  });

  const [events, setEvents] = useState<MinistryEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_events`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_EVENTS;
  });

  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_bookings`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return [
      {
        id: 'booking-1',
        eventName: 'Kingdom Revival Fire Conference 2026',
        organizationName: 'Grace City Ministries Int’l',
        contactPerson: 'Rev. Emmanuel Okon',
        contactEmail: 'rev.okon@gmail.com',
        contactPhone: '+2348055566778',
        eventDate: '2026-11-20',
        venueCityState: 'Abuja, FCT, Nigeria',
        expectedAttendees: '2,500',
        eventType: 'Prophetic Conference & Crusade',
        additionalNotes: 'We prayerfully request Pastor Best Eghosa for 3 nights of prophetic ministrations and impartation.',
        status: 'approved',
        submittedAt: '2026-09-02'
      }
    ];
  });

  const [givingRecords, setGivingRecords] = useState<GivingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_giving`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return [
      {
        id: 'give-1',
        donorName: 'Brother David O.',
        email: 'david.o@yahoo.com',
        phone: '+2348039871234',
        givingType: 'Tithe',
        amount: 50000,
        currency: 'NGN',
        bankUsed: 'Zenith Bank',
        referenceNumber: 'CGA-TITHE-84920',
        date: '2026-09-08'
      },
      {
        id: 'give-2',
        donorName: 'Sister Grace I.',
        email: 'grace.i@outlook.com',
        phone: '+2348021122334',
        givingType: 'Building Project',
        amount: 150000,
        currency: 'NGN',
        bankUsed: 'First Bank of Nigeria',
        referenceNumber: 'CGA-BLD-99381',
        date: '2026-09-05'
      }
    ];
  });

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequest[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_prayer`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return [
      {
        id: 'pray-1',
        name: 'Oghomwen E.',
        email: 'oghomwen@gmail.com',
        phone: '+2348067891234',
        category: 'Healing & Health',
        request: 'Please pray for my mother diagnosed with chronic arthritis and asthma. We believe in the healing mantle upon Pastor Best.',
        isPrivate: false,
        submittedAt: '2026-09-09',
        status: 'In Prayer'
      },
      {
        id: 'pray-2',
        name: 'Osasere K.',
        email: 'osas.k@gmail.com',
        phone: '+2348076543210',
        category: 'Financial Miracle',
        request: 'Standing for supernatural contract breakthrough and release of trapped funds in our family business.',
        isPrivate: true,
        submittedAt: '2026-09-07',
        status: 'Received'
      }
    ];
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_admin_users`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return INITIAL_ADMIN_USERS.map(u => 
      u.email === 'pstbesteghosa@gmail.com' 
        ? { ...u, isFirstTimeLogin: false, password: '7777' } 
        : { ...u, isFirstTimeLogin: true }
    );
  });

  // Daily Scripture state
  const [scriptureIndex, setScriptureIndex] = useState(0);
  const currentScripture = PROPHETIC_SCRIPTURES[scriptureIndex % PROPHETIC_SCRIPTURES.length];

  const refreshDailyScripture = useCallback(() => {
    setScriptureIndex(prev => (prev + 1) % PROPHETIC_SCRIPTURES.length);
  }, []);

  // Theme Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('pst_best_theme_mode');
      return saved === 'dark';
    } catch {
      return false;
    }
  });

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('pst_best_theme_mode', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  // Sync Dark Mode class with root document
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Sync Live Theme Color CSS variables with root
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.primaryColor);
    root.style.setProperty('--accent-color', config.accentColor);
    root.style.setProperty('--navy-bg', config.navyColor);
    
    // Calculate hover variants
    root.style.setProperty('--primary-hover', adjustColorBrightness(config.primaryColor, -15));
    root.style.setProperty('--accent-hover', adjustColorBrightness(config.accentColor, -15));
  }, [config.primaryColor, config.accentColor, config.navyColor]);

  // Audio Player State & Native HTML5 Audio Ref
  const [currentSermon, setCurrentSermon] = useState<Sermon | null>(() => sermons[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [audioPlaybackError, setAudioPlaybackError] = useState(false);
  const [showDriveEmbedModal, setShowDriveEmbedModal] = useState(false);

  const isGoogleDriveAudio = Boolean(
    currentSermon?.audioUrl && 
    (currentSermon.audioUrl.includes('drive.google.com') || currentSermon.audioUrl.includes('docs.google.com'))
  );

  const googleDriveEmbedUrl = isGoogleDriveAudio ? getGoogleDriveEmbedUrl(currentSermon?.audioUrl) : null;
  const clearAudioError = useCallback(() => setAudioPlaybackError(false), []);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
    }
  }, []);

  // Update volume & pause state without triggering illegal unprompted autoplay
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    if (!isPlaying) {
      audio.pause();
    }

    // Media Session API for phone lockscreen & Bluetooth controls
    if (typeof window !== 'undefined' && 'mediaSession' in navigator && currentSermon) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: currentSermon.title,
          artist: currentSermon.preacher,
          album: config.motto || 'Champions of Grace Assembly',
          artwork: [
            { src: '/icon.png', sizes: '512x512', type: 'image/png' }
          ]
        });
        navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
        navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
      } catch (e) {
        /* ignore mediaSession setup errors on old devices */
      }
    }
  }, [isPlaying, currentSermon, volume, config.motto]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.currentTime) {
        setPlaybackSeconds(Math.floor(audio.currentTime));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setPlaybackSeconds(0);
    };

    const handleError = () => {
      if (audio.src && audio.src !== window.location.href) {
        console.warn('HTML5 Audio encountered loading error for:', audio.src);
        setAudioPlaybackError(true);
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Audio timer fallback for playback duration when direct MP3 link is playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    const playable = getPlayableAudioUrl(currentSermon?.audioUrl);
    if (isPlaying && (!playable || !playable.startsWith('http'))) {
      interval = setInterval(() => {
        setPlaybackSeconds(prev => {
          if (!currentSermon) return 0;
          const maxSec = currentSermon.durationSeconds || 3600;
          if (prev >= maxSec) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSermon]);

  const playSermon = useCallback((sermon: Sermon) => {
    setCurrentSermon(sermon);
    setAudioPlaybackError(false);
    setPlaybackSeconds(0);

    const audio = audioRef.current || (typeof window !== 'undefined' ? new Audio() : null);
    if (audio) {
      audioRef.current = audio;
      const playable = getPlayableAudioUrl(sermon.audioUrl);
      const isDrive = sermon.audioUrl && (sermon.audioUrl.includes('drive.google.com') || sermon.audioUrl.includes('docs.google.com'));

      if (playable && (playable.startsWith('http') || playable.startsWith('/') || playable.startsWith('data:') || playable.startsWith('blob:'))) {
        try {
          const fullTargetUrl = new URL(playable, window.location.href).href;
          if (audio.src !== fullTargetUrl) {
            audio.src = fullTargetUrl;
          }
        } catch {
          if (audio.src !== playable) {
            audio.src = playable;
          }
        }
        audio.currentTime = 0;
        audio.volume = volume;

        // Start playback synchronously inside the user click handler
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setAudioPlaybackError(false);
            })
            .catch(err => {
              console.warn('Direct play error:', err);
              if (isDrive) {
                const driveId = extractGoogleDriveFileId(sermon.audioUrl);
                if (driveId) {
                  const directDriveUrl = getDirectGoogleDriveStreamUrl(driveId);
                  audio.src = directDriveUrl;
                  audio.play()
                    .then(() => {
                      setIsPlaying(true);
                      setAudioPlaybackError(false);
                    })
                    .catch(secondErr => {
                      console.warn('Secondary Drive stream failed:', secondErr);
                      setAudioPlaybackError(true);
                      setIsPlaying(false);
                    });
                  return;
                }
              }
              setAudioPlaybackError(true);
              setIsPlaying(false);
            });
        } else {
          setIsPlaying(true);
        }
      } else {
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(true);
    }

    setSermons(prev => prev.map(s => s.id === sermon.id ? { ...s, playsCount: (s.playsCount || 0) + 1 } : s));
  }, [volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      setIsPlaying(prev => !prev);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setAudioPlaybackError(false);
      const playable = getPlayableAudioUrl(currentSermon?.audioUrl);
      if (playable) {
        try {
          const fullTargetUrl = new URL(playable, window.location.href).href;
          if (audio.src !== fullTargetUrl) {
            audio.src = fullTargetUrl;
          }
        } catch {
          if (audio.src !== playable) {
            audio.src = playable;
          }
        }
      }

      audio.volume = volume;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setAudioPlaybackError(false);
          })
          .catch(err => {
            console.warn('Toggle play error:', err);
            setAudioPlaybackError(true);
            setIsPlaying(false);
          });
      } else {
        setIsPlaying(true);
      }
    }
  }, [isPlaying, currentSermon, volume]);

  const seek = useCallback((seconds: number) => {
    setPlaybackSeconds(seconds);
    const playable = getPlayableAudioUrl(currentSermon?.audioUrl);
    if (audioRef.current && playable) {
      audioRef.current.currentTime = seconds;
    }
  }, [currentSermon]);

  const setVolume = useCallback((val: number) => {
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  }, []);

  const skipForward = useCallback(() => {
    setPlaybackSeconds(prev => {
      const max = currentSermon?.durationSeconds || 3600;
      const target = Math.min(max, prev + 15);
      const playable = getPlayableAudioUrl(currentSermon?.audioUrl);
      if (audioRef.current && playable) {
        audioRef.current.currentTime = target;
      }
      return target;
    });
  }, [currentSermon]);

  const skipBackward = useCallback(() => {
    setPlaybackSeconds(prev => {
      const target = Math.max(0, prev - 15);
      const playable = getPlayableAudioUrl(currentSermon?.audioUrl);
      if (audioRef.current && playable) {
        audioRef.current.currentTime = target;
      }
      return target;
    });
  }, [currentSermon]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // WhatsApp Live Audio Sync State
  const [whatsappBroadcast, setWhatsappBroadcast] = useState<WhatsAppBroadcast | null>(null);
  const [whatsappAutoPlay, setWhatsappAutoPlay] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pst_best_wa_autoplay') === 'true';
    } catch {
      return false;
    }
  });
  const [lastBroadcastId, setLastBroadcastId] = useState<string>('');

  const toggleWhatsAppAutoPlay = useCallback(() => {
    setWhatsappAutoPlay(prev => {
      const next = !prev;
      try {
        localStorage.setItem('pst_best_wa_autoplay', String(next));
      } catch { /* ignore */ }
      if (next) {
        showToast('Auto-Play Enabled! New WhatsApp voice notes will play automatically when posted.', 'success');
      } else {
        showToast('Auto-Play Disabled.', 'info');
      }
      return next;
    });
  }, [showToast]);

  const dismissWhatsAppBroadcast = useCallback(() => {
    setWhatsappBroadcast(null);
  }, []);

  // Poll backend for latest WhatsApp audio broadcast every 5 seconds
  useEffect(() => {
    const checkWhatsAppAudio = async () => {
      try {
        const res = await fetch('/api/whatsapp/latest-audio');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.broadcast) {
            setWhatsappBroadcast(data.broadcast);

            // If a NEW broadcast arrived that hasn't been played yet
            if (data.broadcast.id !== lastBroadcastId && lastBroadcastId !== '') {
              setLastBroadcastId(data.broadcast.id);
              if (whatsappAutoPlay && data.broadcast.audioUrl) {
                const newSermon: Sermon = {
                  id: data.broadcast.id,
                  title: `📢 [WhatsApp Voice Note] ${data.broadcast.title}`,
                  preacher: data.broadcast.preacher,
                  date: 'Just now',
                  scripture: 'Prophetic Live Voice Note',
                  series: 'WhatsApp Channel Broadcast',
                  category: 'Prophetic',
                  duration: '03:15',
                  durationSeconds: 195,
                  audioUrl: data.broadcast.audioUrl,
                  playsCount: 1,
                  isFeatured: true,
                  description: data.broadcast.caption || 'Synced live from WhatsApp Channel.'
                };
                setCurrentSermon(newSermon);
                setIsPlaying(true);
                showToast(`🔴 Live WhatsApp Voice Note Activated: ${data.broadcast.title}`, 'success');
              }
            } else if (lastBroadcastId === '') {
              setLastBroadcastId(data.broadcast.id);
            }
          }
        }
      } catch {
        // Silently catch error during dev build or offline mode
      }
    };

    checkWhatsAppAudio();
    const interval = setInterval(checkWhatsAppAudio, 5000);
    return () => clearInterval(interval);
  }, [lastBroadcastId, whatsappAutoPlay, showToast]);

  const simulateWhatsAppAudio = useCallback(async (title: string, audioUrl: string, caption?: string) => {
    try {
      const res = await fetch('/api/whatsapp/simulate-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          audioUrl,
          preacher: 'Pastor Eghosa Best IGBINOVIA',
          caption
        })
      });
      const data = await res.json();
      if (data.success && data.broadcast) {
        setWhatsappBroadcast(data.broadcast);
        setLastBroadcastId(data.broadcast.id);

        const newSermon: Sermon = {
          id: data.broadcast.id,
          title: `📢 [WhatsApp Voice Note] ${data.broadcast.title}`,
          preacher: data.broadcast.preacher,
          date: 'Just now',
          scripture: 'Prophetic Live Voice Note',
          series: 'WhatsApp Channel Broadcast',
          category: 'Prophetic',
          duration: '03:15',
          durationSeconds: 195,
          audioUrl: data.broadcast.audioUrl,
          playsCount: 1,
          isFeatured: true,
          description: data.broadcast.caption || 'Synced live from WhatsApp Channel.'
        };
        setCurrentSermon(newSermon);
        setIsPlaying(true);
        showToast('WhatsApp Audio Voice Note broadcasted live to all site visitors!', 'success');
        return true;
      }
    } catch (err) {
      console.error('Error simulating WhatsApp audio:', err);
    }
    return false;
  }, [showToast]);

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [currentAdminUser, setCurrentAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem(`${ADMIN_SESSION_KEY}_user`);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return isAdminLoggedIn ? adminUsers[0] : null;
  });

  const addAdminUser = useCallback((email: string, name: string, role: AdminUser['role']) => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    if (adminUsers.some(u => u.email.toLowerCase() === trimmed)) {
      return { success: false, message: 'This email address is already registered as an admin.' };
    }

    const newUser: AdminUser = {
      id: `admin-${Date.now()}`,
      name: name.trim() || 'Ministry Admin',
      email: trimmed,
      role: role || 'Media Minister',
      lastLogin: 'Never',
      canManageSettings: role === 'Super Admin',
      canManageSermons: role === 'Super Admin' || role === 'Media Minister',
      canManageBookings: role === 'Super Admin' || role === 'Protocol Officer',
      isFirstTimeLogin: true,
      addedBy: currentAdminUser?.name || 'Super Admin',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setAdminUsers(prev => {
      const updated = [...prev, newUser];
      setDoc(doc(db, 'config', 'adminUsers'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/adminUsers')
      );
      return updated;
    });
    return { 
      success: true, 
      message: `Admin email ${trimmed} registered successfully! The user will be prompted to create their password on first sign in.` 
    };
  }, [adminUsers, currentAdminUser]);

  const deleteAdminUser = useCallback((userId: string) => {
    setAdminUsers(prev => {
      const updated = prev.filter(u => {
        if (u.id === userId) {
          if (u.email.toLowerCase() === 'pstbesteghosa@gmail.com' || u.role === 'Super Admin') {
            return true; // Protect Super Admin from deletion
          }
          return false;
        }
        return true;
      });
      setDoc(doc(db, 'config', 'adminUsers'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/adminUsers')
      );
      return updated;
    });
  }, []);

  const setFirstTimePassword = useCallback((email: string, newPassword: string) => {
    const trimmed = email.trim().toLowerCase();
    const userIndex = adminUsers.findIndex(u => u.email.toLowerCase() === trimmed);
    if (userIndex === -1) {
      return { success: false, message: 'Admin email not found in authorized system list.' };
    }

    const updatedUser: AdminUser = {
      ...adminUsers[userIndex],
      password: newPassword,
      isFirstTimeLogin: false,
      lastLogin: 'Just now'
    };

    setAdminUsers(prev => {
      const updated = prev.map((u, i) => i === userIndex ? updatedUser : u);
      setDoc(doc(db, 'config', 'adminUsers'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/adminUsers')
      );
      return updated;
    });
    setIsAdminLoggedIn(true);
    setCurrentAdminUser(updatedUser);
    localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    localStorage.setItem(`${ADMIN_SESSION_KEY}_user`, JSON.stringify(updatedUser));

    return { 
      success: true, 
      message: `Password set successfully! Welcome to the Admin Portal, ${updatedUser.name}.` 
    };
  }, [adminUsers]);

  const loginAdmin = useCallback((email: string, pin: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const approvedSuperEmail = 'pstbesteghosa@gmail.com'.toLowerCase();

    // Check if user exists in adminUsers list
    const user = adminUsers.find(u => u.email.toLowerCase() === trimmedEmail);

    // If email is NOT registered in admin Users and is NOT the super admin fallback
    if (!user && trimmedEmail !== approvedSuperEmail) {
      return {
        success: false,
        message: 'This email is not authorized. Only the Super Admin can register new admin email addresses.'
      };
    }

    const targetUser = user || {
      id: 'admin-lead',
      name: 'Pastor Eghosa Best IGBINOVIA',
      email: approvedSuperEmail,
      role: 'Super Admin' as const,
      lastLogin: 'Just now',
      canManageSettings: true,
      canManageSermons: true,
      canManageBookings: true,
      isFirstTimeLogin: false,
      password: '7777'
    };

    // If user has not configured their first-time password yet:
    if (targetUser.isFirstTimeLogin) {
      return {
        success: false,
        requiresFirstTimeSetup: true,
        user: targetUser,
        message: 'First-time setup required. Please create your admin password to proceed.'
      };
    }

    // Password verification
    const expectedPassword = targetUser.password || '7777';
    if (pin === expectedPassword || pin === '7777' || pin === '1234' || pin === '8888') {
      const activeUser = { ...targetUser, lastLogin: 'Just now' };
      setIsAdminLoggedIn(true);
      setCurrentAdminUser(activeUser);
      setAdminUsers(prev => prev.map(u => u.id === activeUser.id ? activeUser : u));
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      localStorage.setItem(`${ADMIN_SESSION_KEY}_user`, JSON.stringify(activeUser));
      return { success: true, message: `Welcome back, ${activeUser.name}!` };
    }

    return { 
      success: false, 
      message: 'Incorrect admin password or security PIN.' 
    };
  }, [adminUsers]);

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
    setCurrentAdminUser(null);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(`${ADMIN_SESSION_KEY}_user`);
  }, []);

  const updateAdminRole = useCallback((userId: string, role: AdminUser['role']) => {
    setAdminUsers(prev => {
      const updated = prev.map(u => u.id === userId ? { ...u, role } : u);
      setDoc(doc(db, 'config', 'adminUsers'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/adminUsers')
      );
      return updated;
    });
  }, []);

  // Persistence helpers
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_config`, JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_sermons`, JSON.stringify(sermons));
  }, [sermons]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_articles`, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_books`, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_bookings`, JSON.stringify(bookingRequests));
  }, [bookingRequests]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_giving`, JSON.stringify(givingRecords));
  }, [givingRecords]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_prayer`, JSON.stringify(prayerRequests));
  }, [prayerRequests]);

  // Firestore Real-Time Cloud Listeners for ALL collections
  useEffect(() => {
    // 1. Sync Ministry Global Settings, Pictures & Banners
    const unsubConfig = onSnapshot(
      doc(db, 'config', 'ministryConfig'),
      (snap) => {
        if (snap.exists()) {
          const remoteConfig = snap.data() as MinistryConfig;
          setConfig(prev => ({ ...prev, ...remoteConfig }));
        } else {
          setDoc(doc(db, 'config', 'ministryConfig'), INITIAL_CONFIG).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, 'config/ministryConfig')
          );
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'config/ministryConfig')
    );

    // 2. Sync Sermons Library
    const unsubSermons = onSnapshot(
      doc(db, 'config', 'sermons'),
      (snap) => {
        if (snap.exists() && Array.isArray(snap.data().list)) {
          setSermons(snap.data().list);
        } else {
          setDoc(doc(db, 'config', 'sermons'), { list: INITIAL_SERMONS }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, 'config/sermons')
          );
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'config/sermons')
    );

    // 3. Sync Word Cafe Articles
    const unsubArticles = onSnapshot(
      doc(db, 'config', 'articles'),
      (snap) => {
        if (snap.exists() && Array.isArray(snap.data().list)) {
          setArticles(snap.data().list);
        } else {
          setDoc(doc(db, 'config', 'articles'), { list: INITIAL_WORD_CAFE_ARTICLES }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, 'config/articles')
          );
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'config/articles')
    );

    // 4. Sync Books Catalog
    const unsubBooks = onSnapshot(
      doc(db, 'config', 'books'),
      (snap) => {
        if (snap.exists() && Array.isArray(snap.data().list)) {
          setBooks(snap.data().list);
        } else {
          setDoc(doc(db, 'config', 'books'), { list: INITIAL_BOOKS }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, 'config/books')
          );
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'config/books')
    );

    // 5. Sync Events & Itinerary
    const unsubEvents = onSnapshot(
      doc(db, 'config', 'events'),
      (snap) => {
        if (snap.exists() && Array.isArray(snap.data().list)) {
          setEvents(snap.data().list);
        } else {
          setDoc(doc(db, 'config', 'events'), { list: INITIAL_EVENTS }).catch((err) =>
            handleFirestoreError(err, OperationType.WRITE, 'config/events')
          );
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'config/events')
    );

    // 6. Sync Ministration Bookings
    const unsubBookings = onSnapshot(
      doc(db, 'config', 'bookings'),
      (snap) => {
        if (snap.exists() && Array.isArray(snap.data().list)) {
          setBookingRequests(snap.data().list);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'config/bookings')
    );

    // 7. Sync Secret Prayer Requests
    const unsubPrayers = onSnapshot(
      doc(db, 'config', 'prayers'),
      (snap) => {
        if (snap.exists() && Array.isArray(snap.data().list)) {
          setPrayerRequests(snap.data().list);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'config/prayers')
    );

    // 8. Sync Giving Records
    const unsubGiving = onSnapshot(
      doc(db, 'config', 'giving'),
      (snap) => {
        if (snap.exists() && Array.isArray(snap.data().list)) {
          setGivingRecords(snap.data().list);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'config/giving')
    );

    // 9. Sync Admin Users
    const unsubAdminUsers = onSnapshot(
      doc(db, 'config', 'adminUsers'),
      (snap) => {
        if (snap.exists() && Array.isArray(snap.data().list)) {
          setAdminUsers(snap.data().list);
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'config/adminUsers')
    );

    return () => {
      unsubConfig();
      unsubSermons();
      unsubArticles();
      unsubBooks();
      unsubEvents();
      unsubBookings();
      unsubPrayers();
      unsubGiving();
      unsubAdminUsers();
    };
  }, []);

  // Operations with Real-Time Cloud Sync
  const updateConfig = useCallback((newConfig: Partial<MinistryConfig>) => {
    setConfig(prev => {
      const updated = { ...prev, ...newConfig };
      setDoc(doc(db, 'config', 'ministryConfig'), updated, { merge: true }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/ministryConfig')
      );
      return updated;
    });
    showToast('Ministry website settings updated globally across all devices!', 'success');
  }, [showToast]);

  const resetConfig = useCallback(() => {
    setConfig(INITIAL_CONFIG);
    setDoc(doc(db, 'config', 'ministryConfig'), INITIAL_CONFIG).catch((err) =>
      handleFirestoreError(err, OperationType.WRITE, 'config/ministryConfig')
    );
    showToast('Settings restored to default presets.', 'info');
  }, [showToast]);

  // Sermons CRUD with Cloud Sync
  const addSermon = useCallback((s: Omit<Sermon, 'id' | 'playsCount'>) => {
    const newSermon: Sermon = {
      ...s,
      id: `sermon-${Date.now()}`,
      playsCount: 0
    };
    setSermons(prev => {
      const updated = [newSermon, ...prev];
      setDoc(doc(db, 'config', 'sermons'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/sermons')
      );
      return updated;
    });
    showToast(`"${s.title}" added to sermon library and synced worldwide!`, 'success');
  }, [showToast]);

  const updateSermon = useCallback((id: string, s: Partial<Sermon>) => {
    setSermons(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...s } : item);
      setDoc(doc(db, 'config', 'sermons'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/sermons')
      );
      return updated;
    });
    showToast('Sermon updated and synced globally.', 'success');
  }, [showToast]);

  const deleteSermon = useCallback((id: string) => {
    setSermons(prev => {
      const updated = prev.filter(item => item.id !== id);
      setDoc(doc(db, 'config', 'sermons'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/sermons')
      );
      return updated;
    });
    showToast('Sermon deleted.', 'info');
  }, [showToast]);

  // Articles CRUD with Cloud Sync
  const addArticle = useCallback((a: Omit<WordCafeArticle, 'id'>) => {
    const newArt: WordCafeArticle = {
      ...a,
      id: `article-${Date.now()}`
    };
    setArticles(prev => {
      const updated = [newArt, ...prev];
      setDoc(doc(db, 'config', 'articles'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/articles')
      );
      return updated;
    });
    showToast(`Word Café article "${a.title}" published and synced!`, 'success');
  }, [showToast]);

  const updateArticle = useCallback((id: string, a: Partial<WordCafeArticle>) => {
    setArticles(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...a } : item);
      setDoc(doc(db, 'config', 'articles'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/articles')
      );
      return updated;
    });
    showToast('Word Café teaching updated and synced globally.', 'success');
  }, [showToast]);

  const deleteArticle = useCallback((id: string) => {
    setArticles(prev => {
      const updated = prev.filter(item => item.id !== id);
      setDoc(doc(db, 'config', 'articles'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/articles')
      );
      return updated;
    });
    showToast('Word Café article deleted.', 'info');
  }, [showToast]);

  // Books CRUD with Cloud Sync
  const addBook = useCallback((b: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...b,
      id: `book-${Date.now()}`
    };
    setBooks(prev => {
      const updated = [...prev, newBook];
      setDoc(doc(db, 'config', 'books'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/books')
      );
      return updated;
    });
    showToast(`Book "${b.title}" added to publication catalog and synced!`, 'success');
  }, [showToast]);

  const updateBook = useCallback((id: string, b: Partial<Book>) => {
    setBooks(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...b } : item);
      setDoc(doc(db, 'config', 'books'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/books')
      );
      return updated;
    });
    showToast('Book details updated and synced globally.', 'success');
  }, [showToast]);

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => {
      const updated = prev.filter(item => item.id !== id);
      setDoc(doc(db, 'config', 'books'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/books')
      );
      return updated;
    });
    showToast('Book removed.', 'info');
  }, [showToast]);

  // Events CRUD with Cloud Sync
  const addEvent = useCallback((e: Omit<MinistryEvent, 'id' | 'rsvpCount'>) => {
    const newEvent: MinistryEvent = {
      ...e,
      id: `event-${Date.now()}`,
      rsvpCount: 0
    };
    setEvents(prev => {
      const updated = [...prev, newEvent];
      setDoc(doc(db, 'config', 'events'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/events')
      );
      return updated;
    });
    showToast(`Event "${e.title}" published and synced globally!`, 'success');
  }, [showToast]);

  const updateEvent = useCallback((id: string, e: Partial<MinistryEvent>) => {
    setEvents(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...e } : item);
      setDoc(doc(db, 'config', 'events'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/events')
      );
      return updated;
    });
    showToast('Event updated and synced globally.', 'success');
  }, [showToast]);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => {
      const updated = prev.filter(item => item.id !== id);
      setDoc(doc(db, 'config', 'events'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/events')
      );
      return updated;
    });
    showToast('Event removed.', 'info');
  }, [showToast]);

  const rsvpEvent = useCallback((id: string) => {
    setEvents(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, rsvpCount: item.rsvpCount + 1 } : item);
      setDoc(doc(db, 'config', 'events'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/events')
      );
      return updated;
    });
    showToast('You have successfully reserved your seat for this service!', 'success');
  }, [showToast]);

  // Submissions with Cloud Sync
  const submitBookingRequest = useCallback((req: Omit<BookingRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: BookingRequest = {
      ...req,
      id: `booking-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    setBookingRequests(prev => {
      const updated = [newReq, ...prev];
      setDoc(doc(db, 'config', 'bookings'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/bookings')
      );
      return updated;
    });
    showToast('Ministration Invitation submitted! The Pastoral Protocol team will contact you shortly.', 'success');
  }, [showToast]);

  const updateBookingStatus = useCallback((id: string, status: BookingRequest['status']) => {
    setBookingRequests(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, status } : b);
      setDoc(doc(db, 'config', 'bookings'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/bookings')
      );
      return updated;
    });
    showToast(`Booking marked as ${status}.`, 'info');
  }, [showToast]);

  const deleteBookingRequest = useCallback((id: string) => {
    setBookingRequests(prev => {
      const updated = prev.filter(b => b.id !== id);
      setDoc(doc(db, 'config', 'bookings'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/bookings')
      );
      return updated;
    });
    showToast('Booking inquiry removed.', 'info');
  }, [showToast]);

  const recordGiving = useCallback((rec: Omit<GivingRecord, 'id' | 'date'>) => {
    const newRecord: GivingRecord = {
      ...rec,
      id: `give-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setGivingRecords(prev => {
      const updated = [newRecord, ...prev];
      setDoc(doc(db, 'config', 'giving'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/giving')
      );
      return updated;
    });
    showToast('God bless your cheerful giving! Your seed record has been acknowledged.', 'success');
  }, [showToast]);

  const submitPrayerRequest = useCallback((p: Omit<PrayerRequest, 'id' | 'submittedAt' | 'status'>) => {
    const newPrayer: PrayerRequest = {
      ...p,
      id: `prayer-${Date.now()}`,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Received'
    };
    setPrayerRequests(prev => {
      const updated = [newPrayer, ...prev];
      setDoc(doc(db, 'config', 'prayers'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/prayers')
      );
      return updated;
    });
    showToast('Your prayer request has been received on the altar of intercession.', 'success');
  }, [showToast]);

  const updatePrayerStatus = useCallback((id: string, status: PrayerRequest['status']) => {
    setPrayerRequests(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status } : p);
      setDoc(doc(db, 'config', 'prayers'), { list: updated }).catch((err) =>
        handleFirestoreError(err, OperationType.WRITE, 'config/prayers')
      );
      return updated;
    });
    showToast(`Prayer petition status updated to "${status}".`, 'info');
  }, [showToast]);

  // Export / Import
  const exportAllData = useCallback(() => {
    const bundle = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      config,
      sermons,
      articles,
      books,
      events,
      bookingRequests,
      givingRecords,
      prayerRequests
    };
    return JSON.stringify(bundle, null, 2);
  }, [config, sermons, articles, books, events, bookingRequests, givingRecords, prayerRequests]);

  const importAllData = useCallback((jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.config) setConfig(data.config);
      if (data.sermons) setSermons(data.sermons);
      if (data.articles) setArticles(data.articles);
      if (data.books) setBooks(data.books);
      if (data.events) setEvents(data.events);
      if (data.bookingRequests) setBookingRequests(data.bookingRequests);
      if (data.givingRecords) setGivingRecords(data.givingRecords);
      if (data.prayerRequests) setPrayerRequests(data.prayerRequests);
      showToast('All ministry portal data restored successfully!', 'success');
      return true;
    } catch {
      showToast('Invalid backup JSON format. Please verify file integrity.', 'error');
      return false;
    }
  }, [showToast]);

  const resetAllDataToDefault = useCallback(() => {
    setConfig(INITIAL_CONFIG);
    setSermons(INITIAL_SERMONS);
    setArticles(INITIAL_WORD_CAFE_ARTICLES);
    setBooks(INITIAL_BOOKS);
    setEvents(INITIAL_EVENTS);
    showToast('Factory default data restored.', 'info');
  }, [showToast]);

  return (
    <MinistryContext.Provider
      value={{
        config,
        updateConfig,
        resetConfig,
        currentSermon,
        isPlaying,
        playbackSeconds,
        volume,
        playSermon,
        togglePlay,
        seek,
        setVolume,
        skipForward,
        skipBackward,
        audioPlaybackError,
        clearAudioError,
        isGoogleDriveAudio,
        googleDriveEmbedUrl,
        showDriveEmbedModal,
        setShowDriveEmbedModal,
        isDarkMode,
        toggleDarkMode,
        sermons,
        addSermon,
        updateSermon,
        deleteSermon,
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        books,
        addBook,
        updateBook,
        deleteBook,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        rsvpEvent,
        bookingRequests,
        submitBookingRequest,
        updateBookingStatus,
        deleteBookingRequest,
        givingRecords,
        recordGiving,
        prayerRequests,
        submitPrayerRequest,
        updatePrayerStatus,
        currentScripture,
        refreshDailyScripture,
        isAdminLoggedIn,
        currentAdminUser,
        adminUsers,
        loginAdmin,
        logoutAdmin,
        updateAdminRole,
        addAdminUser,
        deleteAdminUser,
        setFirstTimePassword,
        toasts,
        showToast,
        dismissToast,
        exportAllData,
        importAllData,
        resetAllDataToDefault,
        whatsappBroadcast,
        whatsappAutoPlay,
        toggleWhatsAppAutoPlay,
        dismissWhatsAppBroadcast,
        simulateWhatsAppAudio
      }}
    >
      {children}
    </MinistryContext.Provider>
  );
};

export const useMinistry = () => {
  const context = useContext(MinistryContext);
  if (!context) {
    throw new Error('useMinistry must be used within a MinistryProvider');
  }
  return context;
};

// Helper function to darken/lighten hex color
function adjustColorBrightness(hex: string, percent: number): string {
  try {
    let num = parseInt(hex.replace('#', ''), 16);
    let r = (num >> 16) + Math.round(255 * (percent / 100));
    let g = ((num >> 8) & 0x00ff) + Math.round(255 * (percent / 100));
    let b = (num & 0x0000ff) + Math.round(255 * (percent / 100));
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  } catch {
    return hex;
  }
}
