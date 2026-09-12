import React, { useState, useEffect } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  KeyRound, 
  LogOut, 
  Settings, 
  Headphones, 
  Calendar, 
  BookOpen, 
  Inbox, 
  Heart, 
  Database, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  AlertCircle, 
  Palette, 
  RefreshCw, 
  Download, 
  Upload, 
  FileText,
  Phone,
  MessageCircle,
  Clock,
  ChevronRight,
  ExternalLink,
  Radio,
  Volume2,
  X,
  Globe,
  ArrowLeft,
  Image as ImageIcon,
  HelpCircle,
  Play,
  Pause,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileAudio
} from 'lucide-react';
import { Sermon, MinistryEvent, Book, WordCafeArticle, BookingRequest, AdminUser, MinistryHeroBanner } from '../types';
import { HomeBannerManager } from '../components/HomeBannerManager';
import { analyzeAudioUrl, getPlayableAudioUrl, extractGoogleDriveFileId, getGoogleDriveEmbedUrl } from '../utils/audioUtils';
import { AudioConversionModal } from '../components/AudioConversionModal';

interface AdminPortalProps {
  setActiveTab?: (tab: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ setActiveTab }) => {
  const { 
    isAdminLoggedIn, 
    currentAdminUser, 
    loginAdmin, 
    logoutAdmin, 
    config, 
    updateConfig, 
    resetConfig,
    sermons,
    addSermon,
    updateSermon,
    deleteSermon,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    books,
    addBook,
    updateBook,
    deleteBook,
    articles,
    addArticle,
    updateArticle,
    deleteArticle,
    bookingRequests,
    updateBookingStatus,
    deleteBookingRequest,
    prayerRequests,
    updatePrayerStatus,
    givingRecords,
    adminUsers,
    updateAdminRole,
    addAdminUser,
    deleteAdminUser,
    setFirstTimePassword,
    exportAllData,
    importAllData,
    resetAllDataToDefault,
    showToast,
    whatsappBroadcast,
    whatsappAutoPlay,
    toggleWhatsAppAutoPlay,
    simulateWhatsAppAudio
  } = useMinistry();

  // Login Form State
  const [emailInput, setEmailInput] = useState('pstbesteghosa@gmail.com');
  const [pinInput, setPinInput] = useState('7777');
  const [loginError, setLoginError] = useState('');

  // First time login setup state
  const [isFirstTimeSetupMode, setIsFirstTimeSetupMode] = useState(false);
  const [firstTimeUser, setFirstTimeUser] = useState<AdminUser | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [firstTimeError, setFirstTimeError] = useState('');

  // Super Admin Add New Admin Email Form state
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    role: 'Media Minister' as AdminUser['role']
  });

  // Active Admin Sub-Tab
  const [activeAdminTab, setActiveAdminTab] = useState<
    'settings' | 'banners' | 'sermons' | 'events' | 'publications' | 'bookings' | 'prayers' | 'backup' | 'users' | 'whatsapp'
  >('settings');

  // WhatsApp Broadcast Simulator State
  const [waSimTitle, setWaSimTitle] = useState('Prophetic Morning Voice Note');
  const [waSimUrl, setWaSimUrl] = useState('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3');
  const [waSimCaption, setWaSimCaption] = useState('Anointing for breaking covenants & financial expansion.');

  // Website Settings Local Edit State
  const [settingsForm, setSettingsForm] = useState(config);

  useEffect(() => {
    setSettingsForm(config);
  }, [config]);

  // New Sermon Modal / Form State
  const [showAddSermon, setShowAddSermon] = useState(false);
  const [sermonForm, setSermonForm] = useState({
    title: '',
    scripture: '',
    series: '',
    duration: '1h 10m',
    durationSeconds: 4200,
    date: 'October 2026',
    preacher: 'Pastor Eghosa Best IGBINOVIA',
    category: 'Prophetic' as Sermon['category'],
    description: '',
    audioUrl: '',
    videoUrl: ''
  });

  // Edit Sermon Modal / State
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [sermonEditForm, setSermonEditForm] = useState<Sermon | null>(null);

  // Audio Conversion Modal & Direct Audio Upload State
  const [showMp3ConvertModal, setShowMp3ConvertModal] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'sermonNew' | 'sermonEdit' | 'whatsapp' | 'tester'>('sermonNew');
  const directAudioInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleDirectAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAudio(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        let finalAudioUrl = '';
        const base64Data = reader.result as string;

        try {
          const res = await fetch('/api/upload-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data,
              mimeType: file.type || 'audio/mpeg'
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.ok && data.url) {
              finalAudioUrl = data.url;
              showToast(`Audio uploaded successfully to server: ${file.name} (${data.sizeMb} MB)!`, 'success');
            }
          }
        } catch {
          // Fallback if backend API is not available (Netlify static build)
        }

        if (!finalAudioUrl) {
          finalAudioUrl = base64Data;
          showToast(`Audio attached successfully: ${file.name}! Ready to stream.`, 'success');
        }

        if (uploadTarget === 'sermonNew') {
          setSermonForm(prev => ({ ...prev, audioUrl: finalAudioUrl }));
        } else if (uploadTarget === 'sermonEdit') {
          setSermonEditForm(prev => (prev ? { ...prev, audioUrl: finalAudioUrl } : null));
        } else if (uploadTarget === 'whatsapp') {
          setWaSimUrl(finalAudioUrl);
        } else {
          setAudioTesterUrl(finalAudioUrl);
        }

        setIsUploadingAudio(false);
        if (directAudioInputRef.current) directAudioInputRef.current.value = '';
      };

      reader.onerror = () => {
        showToast('Failed to read file from disk', 'error');
        setIsUploadingAudio(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      showToast(`Upload error: ${err.message}`, 'error');
      setIsUploadingAudio(false);
    }
  };

  // Audio Tester State
  const [audioTesterUrl, setAudioTesterUrl] = useState('');
  const [isTestingAudio, setIsTestingAudio] = useState(false);
  const [testAudioPlaying, setTestAudioPlaying] = useState(false);
  const [audioTestFeedback, setAudioTestFeedback] = useState<{
    ok: boolean;
    provider: string;
    message: string;
    recommendation?: string;
  } | null>(null);
  const adminTestAudioRef = React.useRef<HTMLAudioElement | null>(null);

  // New Event Modal / Form State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    theme: '',
    startDate: '2026-11-12',
    endDate: '2026-11-15',
    time: '5:00 PM Daily',
    venue: 'Grace Chapel Headquarters, Igue-Iheya, Benin City',
    minister: 'Pastor Eghosa Best IGBINOVIA',
    description: '',
    isFeatured: false,
    category: 'Crusade' as MinistryEvent['category']
  });

  // New Book Form State
  const [showAddBook, setShowAddBook] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    subtitle: '',
    author: 'Pastor Eghosa Best IGBINOVIA',
    pages: 220,
    year: '2026',
    format: 'Paperback & Digital eBook',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    description: '',
    keyRevelations: ['Prophetic victory over demonic delay.', 'The mystery of spiritual timing.'],
    chapters: ['Chapter 1: The Call of Faith', 'Chapter 2: Walking in Dominion'],
    featuredQuote: '“Faith does not question the storm; faith commands peace.”',
    priceNgn: 4500
  });

  // New Word Cafe Article State
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [articleForm, setArticleForm] = useState({
    title: '',
    subtitle: '',
    author: 'Pastor Eghosa Best IGBINOVIA',
    date: 'October 2026',
    readTime: '7 min read',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    scriptureRef: 'Isaiah 40:29-31',
    tags: ['Prophetic', 'Grace', 'Dominion'],
    excerpt: '',
    content: '',
    prayerDeclaration: 'Father, renew my strength like the eagles!'
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    const res = loginAdmin(emailInput, pinInput);
    if (res.requiresFirstTimeSetup && res.user) {
      setIsFirstTimeSetupMode(true);
      setFirstTimeUser(res.user);
    } else if (!res.success) {
      setLoginError(res.message);
    }
  };

  const handleSetFirstTimePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFirstTimeError('');
    if (newPasswordInput.length < 3) {
      setFirstTimeError('Password must be at least 3 characters long.');
      return;
    }
    if (newPasswordInput !== confirmPasswordInput) {
      setFirstTimeError('Passwords do not match. Please verify and re-enter.');
      return;
    }
    if (firstTimeUser) {
      const res = setFirstTimePassword(firstTimeUser.email, newPasswordInput);
      if (!res.success) {
        setFirstTimeError(res.message);
      } else {
        setIsFirstTimeSetupMode(false);
        setNewPasswordInput('');
        setConfirmPasswordInput('');
      }
    }
  };

  const handleCreateAdminEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addAdminUser(newAdminForm.email, newAdminForm.name, newAdminForm.role);
    if (res.success) {
      showToast(res.message, 'success');
      setNewAdminForm({ name: '', email: '', role: 'Media Minister' });
      setShowAddAdminModal(false);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(settingsForm);
  };

  const handleExportBackup = () => {
    const dataStr = exportAllData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PST_BEST_EGHOSA_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Database backup JSON exported successfully!', 'success');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        importAllData(content);
      }
    };
    reader.readAsText(file);
  };

  // 1. If Not Logged In, Show Regal Administrator Security Gate
  if (!isAdminLoggedIn) {
    if (isFirstTimeSetupMode && firstTimeUser) {
      return (
        <div className="max-w-md mx-auto my-16 px-4">
          <div className="rounded-3xl p-8 bg-white dark:bg-[#0A2342] border-2 border-amber-500/40 shadow-2xl space-y-6 text-left">
            
            <div className="flex flex-col items-center text-center space-y-2">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-serif-royal text-2xl font-bold shadow-lg border border-amber-400/40"
                style={{ backgroundColor: config.primaryColor }}
              >
                <KeyRound className="w-8 h-8 text-amber-300" />
              </div>
              <h1 className="text-2xl font-serif-royal font-bold text-slate-900 dark:text-white">
                First-Time Password Setup
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Welcome, <strong>{firstTimeUser.name}</strong>! Your email has been authorized by Super Admin. Please create your sign-in password below.
              </p>
            </div>

            {firstTimeError && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{firstTimeError}</span>
              </div>
            )}

            <form onSubmit={handleSetFirstTimePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Authorized Admin Email (Locked)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    readOnly
                    disabled
                    value={firstTimeUser.email}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-sm font-semibold cursor-not-allowed"
                  />
                </div>
                <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">
                  🔒 Admin email is set by Super Admin and cannot be modified.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Create First-Time Admin Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={3}
                    value={newPasswordInput}
                    onChange={e => setNewPasswordInput(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Confirm First-Time Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    minLength={3}
                    value={confirmPasswordInput}
                    onChange={e => setConfirmPasswordInput(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="save-first-time-password-btn"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Lock className="w-4 h-4" />
                <span>Save Password & Activate Account</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsFirstTimeSetupMode(false);
                  setFirstTimeUser(null);
                }}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-center block"
              >
                ← Back to Login Screen
              </button>
            </form>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto my-12 px-4 relative">
        <div className="rounded-3xl p-8 bg-white dark:bg-[#0A2342] border-2 border-amber-500/40 shadow-2xl space-y-6 text-left relative">
          
          {/* Close Button at Top Right */}
          <button
            onClick={() => setActiveTab?.('home')}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Close Admin Gateway & Return to Website"
            aria-label="Close Admin Gateway"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-2 pt-2">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-serif-royal text-2xl font-bold shadow-lg border border-amber-400/40"
              style={{ backgroundColor: config.primaryColor }}
            >
              <ShieldCheck className="w-8 h-8 text-amber-300" />
            </div>
            <h1 className="text-2xl font-serif-royal font-bold text-slate-900 dark:text-white">
              Administrative Gateway
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authorized backend management hub for Champions of Grace Assembly & Best Eghosa World Outreach.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Authorized Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="pstbesteghosa@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Security Passcode PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={pinInput}
                  onChange={e => setPinInput(e.target.value)}
                  placeholder="Default PIN: 7777"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm tracking-widest focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Master Security Key default: <strong>7777</strong>
              </p>
            </div>

            <button
              type="submit"
              id="admin-login-submit"
              className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all"
              style={{ backgroundColor: config.primaryColor }}
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate & Enter Hub</span>
            </button>
          </form>

          {/* 1-Click Demo Fill Assistant */}
          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setEmailInput('pstbesteghosa@gmail.com');
                setPinInput('7777');
                loginAdmin('pstbesteghosa@gmail.com', '7777');
              }}
              className="w-full py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Quick Login as Pastor Best (Lead Admin)</span>
            </button>

            <button
              onClick={() => setActiveTab?.('home')}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Website</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Hub
  const isSuperAdmin = currentAdminUser?.role === 'Super Admin' || currentAdminUser?.email.toLowerCase() === 'pstbesteghosa@gmail.com';

  const visibleAdminUsers = isSuperAdmin
    ? adminUsers
    : adminUsers.filter(u => u.role !== 'Super Admin' && u.email.toLowerCase() !== 'pstbesteghosa@gmail.com');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-serif-royal font-bold text-xl shadow-md border border-amber-400/40"
            style={{ backgroundColor: config.primaryColor }}
          >
            <ShieldCheck className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white">
                Administrative Central Hub
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40">
                {currentAdminUser?.role || 'Super Admin'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Logged in as <strong className="text-slate-800 dark:text-slate-200">{currentAdminUser?.name}</strong> ({currentAdminUser?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setActiveTab?.('home')}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
            title="Exit Admin Hub and Return to Main Public Website"
          >
            <Globe className="w-4 h-4" />
            <span>Return to Public View</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'settings', label: 'Website Settings', icon: Settings },
          { id: 'banners', label: `Home Top Banner (${(config.heroBanners || []).length || 1})`, icon: ImageIcon },
          { id: 'sermons', label: `Sermons (${sermons.length})`, icon: Headphones },
          { id: 'events', label: `Events (${events.length})`, icon: Calendar },
          { id: 'publications', label: 'Books & Word Café', icon: BookOpen },
          { id: 'bookings', label: `Bookings (${bookingRequests.length})`, icon: Inbox },
          { id: 'prayers', label: `Prayers (${prayerRequests.length})`, icon: Heart },
          { id: 'backup', label: 'Backup & Restore', icon: Database },
          { id: 'users', label: `Users (${visibleAdminUsers.length})`, icon: Users },
          { id: 'whatsapp', label: 'WhatsApp Live Sync', icon: Radio },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as typeof activeAdminTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 0: HOME TOP BANNER & PICTURE MANAGER                 */}
      {/* ========================================================= */}
      {activeAdminTab === 'banners' && (
        <HomeBannerManager />
      )}

      {/* ========================================================= */}
      {/* TAB 1: WEBSITE SETTINGS & BRAND COLOR CUSTOMIZATION      */}
      {/* ========================================================= */}
      {activeAdminTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {/* Quick Access Card: Home Page Top Banner Picture */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-12 rounded-xl overflow-hidden bg-slate-950 border border-amber-500/40 flex-shrink-0 shadow-inner">
                <img
                  src={config.heroImageUrl}
                  alt="Top Banner Thumbnail"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h4 className="font-serif-royal font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-500" />
                  <span>Home Page First Top Space Picture / Banner</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage the flyer, portrait, or rotating carousel pictures at the top of the home page.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveAdminTab('banners')}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Manage Top Banner</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {/* Brand Colors Customization with LIVE PREVIEW */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-800">
              <Palette className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white">
                  Live Brand Colors & Dynamic Theme Styling
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Changing colors here immediately alters the global CSS variables (--primary-color and --accent-color) across the entire portal.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Primary Color Picker */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Primary Color (Crimson Red)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settingsForm.primaryColor}
                    onChange={e => {
                      const col = e.target.value;
                      setSettingsForm({ ...settingsForm, primaryColor: col });
                      document.documentElement.style.setProperty('--primary-color', col);
                    }}
                    className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <div>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white uppercase block">
                      {settingsForm.primaryColor}
                    </span>
                    <span className="text-[11px] text-slate-400">Default: #C8102E</span>
                  </div>
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Accent Color (Royal Gold)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settingsForm.accentColor}
                    onChange={e => {
                      const col = e.target.value;
                      setSettingsForm({ ...settingsForm, accentColor: col });
                      document.documentElement.style.setProperty('--accent-color', col);
                    }}
                    className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <div>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white uppercase block">
                      {settingsForm.accentColor}
                    </span>
                    <span className="text-[11px] text-slate-400">Default: #D4AF37</span>
                  </div>
                </div>
              </div>

              {/* Navy Mode Background Picker */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Dark Canvas (Regal Navy)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settingsForm.navyColor}
                    onChange={e => {
                      const col = e.target.value;
                      setSettingsForm({ ...settingsForm, navyColor: col });
                      document.documentElement.style.setProperty('--navy-bg', col);
                    }}
                    className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <div>
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white uppercase block">
                      {settingsForm.navyColor}
                    </span>
                    <span className="text-[11px] text-slate-400">Default: #0A2342</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Announcement Banner & Ministry Info */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white border-b pb-3 dark:border-slate-800">
              Announcement Ticker & Core Identity
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Announcement Banner Text
              </label>
              <input
                type="text"
                value={settingsForm.announcementBanner}
                onChange={e => setSettingsForm({ ...settingsForm, announcementBanner: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Church / Ministry Legal Name
                </label>
                <input
                  type="text"
                  value={settingsForm.churchName}
                  onChange={e => setSettingsForm({ ...settingsForm, churchName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Pastor Name
                </label>
                <input
                  type="text"
                  value={settingsForm.pastorName}
                  onChange={e => setSettingsForm({ ...settingsForm, pastorName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Church Services & Programmes Overview Statement
              </label>
              <textarea
                rows={2}
                value={settingsForm.churchServicesOverview || ''}
                onChange={e => setSettingsForm({ ...settingsForm, churchServicesOverview: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                placeholder="Champions of Grace Assembly, Incorporated, holds regular services, fellowships, prayer meetings..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Ministry Motto
                </label>
                <input
                  type="text"
                  value={settingsForm.motto}
                  onChange={e => setSettingsForm({ ...settingsForm, motto: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Headquarters Address
                </label>
                <input
                  type="text"
                  value={settingsForm.branchHeadquarters}
                  onChange={e => setSettingsForm({ ...settingsForm, branchHeadquarters: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp Prayer Channel URL
                </label>
                <input
                  type="url"
                  value={settingsForm.whatsappPrayerChannelUrl}
                  onChange={e => setSettingsForm({ ...settingsForm, whatsappPrayerChannelUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  WhatsApp Ministry Line
                </label>
                <input
                  type="text"
                  value={settingsForm.whatsappMinistryLine}
                  onChange={e => setSettingsForm({ ...settingsForm, whatsappMinistryLine: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Church Services & Programmes Schedule Editor */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  <span>Church Services & Programmes Schedule</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update timings, frequencies, and service descriptions for Champions of Grace Assembly, Incorporated.
                </p>
              </div>

              <span className="text-xs font-mono font-semibold px-3 py-1 bg-amber-400/20 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-400/30">
                {settingsForm.serviceTimes.length} Programmes Active
              </span>
            </div>

            <div className="space-y-4">
              {settingsForm.serviceTimes.map((service, idx) => (
                <div 
                  key={service.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-amber-400">
                      Programme #{idx + 1}: {service.category || 'Regular Gathering'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {service.frequency || service.day}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Service Title
                      </label>
                      <input
                        type="text"
                        value={service.title}
                        onChange={e => {
                          const updated = [...settingsForm.serviceTimes];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setSettingsForm({ ...settingsForm, serviceTimes: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Day / Frequency
                      </label>
                      <input
                        type="text"
                        value={service.frequency || service.day}
                        onChange={e => {
                          const updated = [...settingsForm.serviceTimes];
                          updated[idx] = { ...updated[idx], day: e.target.value, frequency: e.target.value };
                          setSettingsForm({ ...settingsForm, serviceTimes: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Time
                      </label>
                      <input
                        type="text"
                        value={service.time}
                        onChange={e => {
                          const updated = [...settingsForm.serviceTimes];
                          updated[idx] = { ...updated[idx], time: e.target.value };
                          setSettingsForm({ ...settingsForm, serviceTimes: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-rose-600 dark:text-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Description & Spiritual Focus
                    </label>
                    <textarea
                      rows={2}
                      value={service.description}
                      onChange={e => {
                        const updated = [...settingsForm.serviceTimes];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setSettingsForm({ ...settingsForm, serviceTimes: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs leading-relaxed"
                    />
                  </div>

                  {service.subServices && service.subServices.length > 0 && (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Sub-Schedule Segments ({service.subServices.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {service.subServices.map((sub, sIdx) => (
                          <div key={sIdx} className="text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                            <div className="font-bold text-slate-900 dark:text-white">{sub.title}</div>
                            <div className="font-mono text-[11px] text-amber-500 font-semibold">{sub.time}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{sub.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:opacity-90"
              style={{ backgroundColor: config.primaryColor }}
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Settings</span>
            </button>

            <button
              type="button"
              onClick={resetConfig}
              className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SERMONS MANAGER                                   */}
      {/* ========================================================= */}
      {activeAdminTab === 'sermons' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white">
                Manage Sermons & Audio Teachings
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Upload prophetic audio files, set scriptures, and connect Google Drive or Dropbox links.
              </p>
            </div>

            <button
              onClick={() => {
                setShowAddSermon(true);
                setEditingSermon(null);
              }}
              className="px-4 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 hover:opacity-90 self-start sm:self-auto"
              style={{ backgroundColor: config.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Add New Sermon</span>
            </button>
          </div>

          {/* Audio Linking Procedure & Diagnostics Card */}
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 dark:bg-amber-950/20 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-500/20 pb-3">
              <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-300 font-bold text-sm">
                <HelpCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Audio Streaming & Google Drive Guide</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMp3ConvertModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>How to Convert to MP3</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadTarget('tester');
                    directAudioInputRef.current?.click();
                  }}
                  disabled={isUploadingAudio}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingAudio ? 'Uploading...' : 'Upload Audio Directly'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20 space-y-1">
                <div className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-bold">1</span>
                  Set Permissions
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  In Google Drive, right-click your MP3 &gt; <strong>Share</strong> &gt; set General Access to <strong>"Anyone with the link"</strong> (Viewer). If set to "Restricted", the link will fail!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20 space-y-1">
                <div className="font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-sky-500 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  Copy & Paste Link
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  Click <strong>Copy link</strong> and paste it directly into the <em>Audio File URL</em> field. Our system automatically extracts the File ID and prepares direct audio streaming.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20 space-y-1">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  Dropbox or MP3 Alternative
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                  For 100% instant seekable streaming, Dropbox links or direct <code>.mp3</code> URLs (Archive.org) stream directly without Google's anti-hotlinking limitations.
                </p>
              </div>
            </div>

            {/* Quick Audio URL Tester */}
            <div className="pt-2 border-t border-amber-500/20 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={audioTesterUrl}
                  onChange={e => {
                    setAudioTesterUrl(e.target.value);
                    setAudioTestFeedback(null);
                  }}
                  placeholder="Paste any Google Drive or audio link to verify immediately..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={!audioTesterUrl.trim() || isTestingAudio}
                  onClick={async () => {
                    if (!audioTesterUrl.trim()) return;
                    setIsTestingAudio(true);
                    setAudioTestFeedback(null);
                    try {
                      const analysis = analyzeAudioUrl(audioTesterUrl);
                      const res = await fetch(`/api/audio-check?url=${encodeURIComponent(audioTesterUrl)}`);
                      const data = await res.json();
                      setAudioTestFeedback({
                        ok: data.ok,
                        provider: analysis.provider,
                        message: data.message || analysis.notes,
                        recommendation: data.recommendation || analysis.recommendedAction
                      });
                    } catch (err: any) {
                      const fallback = analyzeAudioUrl(audioTesterUrl);
                      setAudioTestFeedback({
                        ok: false,
                        provider: fallback.provider,
                        message: `Diagnostic check failed: ${err.message}`,
                        recommendation: fallback.recommendedAction
                      });
                    } finally {
                      setIsTestingAudio(false);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 disabled:opacity-50 transition-colors whitespace-nowrap"
                >
                  {isTestingAudio ? 'Checking...' : 'Verify Link'}
                </button>

                {audioTesterUrl.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      if (testAudioPlaying && adminTestAudioRef.current) {
                        adminTestAudioRef.current.pause();
                        setTestAudioPlaying(false);
                      } else {
                        const playable = getPlayableAudioUrl(audioTesterUrl);
                        if (!adminTestAudioRef.current) {
                          adminTestAudioRef.current = new Audio();
                        }
                        adminTestAudioRef.current.src = playable;
                        adminTestAudioRef.current.play()
                          .then(() => setTestAudioPlaying(true))
                          .catch((e) => {
                            showToast(`Audio playback failed: ${e.message}. If Google Drive, ensure link is set to "Anyone with link".`, 'error');
                            setTestAudioPlaying(false);
                          });
                        adminTestAudioRef.current.onended = () => setTestAudioPlaying(false);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs flex items-center gap-1 hover:opacity-90 transition-opacity whitespace-nowrap"
                  >
                    {testAudioPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                    <span>{testAudioPlaying ? 'Pause Test' : 'Test Sound'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Test Results Display */}
            {audioTestFeedback && (
              <div className={`p-3 rounded-xl text-xs space-y-1 ${
                audioTestFeedback.ok 
                  ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30' 
                  : 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30'
              }`}>
                <div className="font-bold flex items-center gap-1.5">
                  {audioTestFeedback.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  <span>Provider: {audioTestFeedback.provider.toUpperCase()}</span>
                </div>
                <p className="text-[11px]">{audioTestFeedback.message}</p>
                {audioTestFeedback.recommendation && (
                  <p className="text-[11px] opacity-90 font-medium">💡 Tip: {audioTestFeedback.recommendation}</p>
                )}
              </div>
            )}
          </div>

          {/* Add Sermon Form Modal */}
          {showAddSermon && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-serif-royal font-bold text-slate-900 dark:text-white">
                  Add New Prophetic Sermon
                </h4>
                <button
                  onClick={() => setShowAddSermon(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={sermonForm.title}
                    onChange={e => setSermonForm({ ...sermonForm, title: e.target.value })}
                    placeholder="e.g. Breaking Generational Barriers"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Scriptural Anchor</label>
                  <input
                    type="text"
                    required
                    value={sermonForm.scripture}
                    onChange={e => setSermonForm({ ...sermonForm, scripture: e.target.value })}
                    placeholder="e.g. Isaiah 45:1-3"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={sermonForm.category}
                    onChange={e => setSermonForm({ ...sermonForm, category: e.target.value as Sermon['category'] })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  >
                    <option value="Prophetic">Prophetic</option>
                    <option value="Grace">Grace</option>
                    <option value="Deliverance">Deliverance</option>
                    <option value="Prayer">Prayer</option>
                    <option value="Kingdom Wealth">Kingdom Wealth</option>
                    <option value="Faith">Faith</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Duration & Series</label>
                  <input
                    type="text"
                    value={sermonForm.duration}
                    onChange={e => setSermonForm({ ...sermonForm, duration: e.target.value })}
                    placeholder="e.g. 1h 15m"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                {/* Audio URL Input with Live Detection and Direct Upload */}
                <div className="sm:col-span-2 space-y-2 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Audio Source (Direct Server Upload, Google Drive, or MP3 Link)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadTarget('sermonNew');
                          directAudioInputRef.current?.click();
                        }}
                        disabled={isUploadingAudio}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 hover:bg-amber-400 transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{isUploadingAudio && uploadTarget === 'sermonNew' ? 'Uploading...' : 'Upload File'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMp3ConvertModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Convert to MP3</span>
                      </button>
                      {sermonForm.audioUrl && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {analyzeAudioUrl(sermonForm.audioUrl).provider.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    type="url"
                    value={sermonForm.audioUrl}
                    onChange={e => setSermonForm({ ...sermonForm, audioUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing, or click 'Upload File'"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  {sermonForm.audioUrl && sermonForm.audioUrl.startsWith('/audio-uploads/') ? (
                    <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>✅ Directly hosted on ministry server — ready for immediate high-speed streaming!</span>
                      <audio controls src={sermonForm.audioUrl} className="h-6 w-48" />
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      💡 Tip: Click <strong>Upload File</strong> to upload MP3, M4A, or WAV straight from your computer or phone, or use <strong>Convert to MP3</strong> to fix WhatsApp voice notes.
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={sermonForm.description}
                    onChange={e => setSermonForm({ ...sermonForm, description: e.target.value })}
                    placeholder="Brief summary of the sermon revelation..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!sermonForm.title || !sermonForm.scripture) return;
                  addSermon({
                    ...sermonForm,
                    audioUrl: sermonForm.audioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89b7e7c8e.mp3?filename=ambient-piano-amp-strings-10711.mp3'
                  });
                  setSermonForm({
                    title: '',
                    scripture: '',
                    series: '',
                    duration: '1h 10m',
                    durationSeconds: 4200,
                    date: 'October 2026',
                    preacher: 'Pastor Eghosa Best IGBINOVIA',
                    category: 'Prophetic',
                    description: '',
                    audioUrl: '',
                    videoUrl: ''
                  });
                  setShowAddSermon(false);
                  showToast('Sermon published successfully!', 'success');
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 transition-colors"
              >
                Publish Sermon
              </button>
            </div>
          )}

          {/* Edit Sermon Modal */}
          {editingSermon && sermonEditForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 text-left shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h4 className="text-base font-serif-royal font-bold text-slate-900 dark:text-white">
                    Edit Sermon Details & Audio URL
                  </h4>
                  <button
                    onClick={() => {
                      setEditingSermon(null);
                      setSermonEditForm(null);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={sermonEditForm.title}
                      onChange={e => setSermonEditForm({ ...sermonEditForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Scripture</label>
                    <input
                      type="text"
                      value={sermonEditForm.scripture}
                      onChange={e => setSermonEditForm({ ...sermonEditForm, scripture: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                    <select
                      value={sermonEditForm.category}
                      onChange={e => setSermonEditForm({ ...sermonEditForm, category: e.target.value as Sermon['category'] })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    >
                      <option value="Prophetic">Prophetic</option>
                      <option value="Grace">Grace</option>
                      <option value="Deliverance">Deliverance</option>
                      <option value="Prayer">Prayer</option>
                      <option value="Kingdom Wealth">Kingdom Wealth</option>
                      <option value="Faith">Faith</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                    <input
                      type="text"
                      value={sermonEditForm.duration}
                      onChange={e => setSermonEditForm({ ...sermonEditForm, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>

                  {/* Audio URL in Edit Form */}
                  <div className="sm:col-span-2 space-y-2 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-300 text-xs">
                        Audio Source (Direct Server Upload, Google Drive, or MP3 Link)
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setUploadTarget('sermonEdit');
                            directAudioInputRef.current?.click();
                          }}
                          disabled={isUploadingAudio}
                          className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] flex items-center gap-1 hover:bg-amber-400 transition-colors"
                        >
                          <Upload className="w-3 h-3" />
                          <span>{isUploadingAudio && uploadTarget === 'sermonEdit' ? 'Uploading...' : 'Upload File'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowMp3ConvertModal(true)}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>Convert to MP3</span>
                        </button>
                        {sermonEditForm.audioUrl && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {analyzeAudioUrl(sermonEditForm.audioUrl).provider.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type="url"
                      value={sermonEditForm.audioUrl || ''}
                      onChange={e => setSermonEditForm({ ...sermonEditForm, audioUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/d/.../view?usp=sharing or click 'Upload File'"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                    />
                    {sermonEditForm.audioUrl && sermonEditForm.audioUrl.startsWith('/audio-uploads/') ? (
                      <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <span>✅ Directly hosted on ministry server — ready for immediate high-speed streaming!</span>
                        <audio controls src={sermonEditForm.audioUrl} className="h-6 w-48" />
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        💡 Tip: Click <strong>Upload File</strong> to upload directly without Google Drive, or click <strong>Convert to MP3</strong> to convert WhatsApp audio.
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={sermonEditForm.description}
                      onChange={e => setSermonEditForm({ ...sermonEditForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setEditingSermon(null);
                      setSermonEditForm(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!sermonEditForm.title) return;
                      updateSermon(editingSermon.id, sermonEditForm);
                      setEditingSermon(null);
                      setSermonEditForm(null);
                      showToast('Sermon updated successfully!', 'success');
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sermons List Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0A2342]">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-4">Title & Category</th>
                  <th className="p-4">Scripture</th>
                  <th className="p-4">Audio Source</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Plays</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {sermons.map(sermon => {
                  const audioAnalysis = analyzeAudioUrl(sermon.audioUrl);
                  return (
                    <tr key={sermon.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-4">
                        <span className="font-bold text-slate-900 dark:text-white block">{sermon.title}</span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-semibold">{sermon.category}</span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{sermon.scripture}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          audioAnalysis.provider === 'google_drive'
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                            : audioAnalysis.provider === 'dropbox'
                            ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        }`}>
                          {audioAnalysis.provider === 'google_drive' ? 'Google Drive' : audioAnalysis.provider === 'dropbox' ? 'Dropbox' : 'Direct Audio'}
                        </span>
                      </td>
                      <td className="p-4 font-mono">{sermon.duration}</td>
                      <td className="p-4 font-mono">{sermon.playsCount.toLocaleString()}</td>
                      <td className="p-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setEditingSermon(sermon);
                            setSermonEditForm({ ...sermon });
                          }}
                          className="p-1.5 rounded-lg text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                          title="Edit sermon & audio link"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSermon(sermon.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          title="Delete sermon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: EVENTS MANAGER                                    */}
      {/* ========================================================= */}
      {activeAdminTab === 'events' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white">
              Manage Crusades & Conferences
            </h3>

            <button
              onClick={() => setShowAddEvent(true)}
              className="px-4 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 hover:opacity-90"
              style={{ backgroundColor: config.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          </div>

          {showAddEvent && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-amber-500/40 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={e => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Theme</label>
                  <input
                    type="text"
                    value={eventForm.theme}
                    onChange={e => setEventForm({ ...eventForm, theme: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={eventForm.startDate}
                    onChange={e => setEventForm({ ...eventForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">Time & Venue</label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={e => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (!eventForm.title) return;
                    addEvent(eventForm);
                    setShowAddEvent(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase"
                >
                  Publish Event
                </button>
                <button
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 rounded-xl border text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(event => (
              <div key={event.id} className="p-5 rounded-2xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 flex justify-between items-start gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400">{event.category}</span>
                  <h4 className="font-bold font-serif-royal text-base text-slate-900 dark:text-white">{event.title}</h4>
                  <p className="text-xs text-slate-500">{event.startDate} • {event.time}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">{event.rsvpCount} RSVPs</p>
                </div>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Remove event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: PUBLICATIONS & WORD CAFE TEACHINGS                 */}
      {/* ========================================================= */}
      {activeAdminTab === 'publications' && (
        <div className="space-y-8">
          
          {/* Books Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white">
                Pastor's Published Books ({books.length})
              </h3>
              <button
                onClick={() => setShowAddBook(!showAddBook)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase"
              >
                + Add Book
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {books.map(b => (
                <div key={b.id} className="p-4 rounded-2xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="h-36 rounded-xl overflow-hidden mb-2">
                    <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="text-xs font-bold font-serif-royal text-slate-900 dark:text-white line-clamp-1">{b.title}</h4>
                  <p className="text-[11px] text-amber-600 font-mono font-bold">₦{b.priceNgn.toLocaleString()}</p>
                  <button
                    onClick={() => deleteBook(b.id)}
                    className="w-full py-1 text-[11px] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  >
                    Delete Book
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Word Cafe Articles Management */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white">
                Word Café Teaching Articles ({articles.length})
              </h3>
            </div>

            <div className="space-y-3">
              {articles.map(art => (
                <div key={art.id} className="p-4 rounded-2xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{art.title}</h4>
                    <p className="text-xs text-slate-500">{art.scriptureRef} • {art.readTime}</p>
                  </div>
                  <button
                    onClick={() => deleteArticle(art.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: MINISTRATION BOOKING INQUIRIES                    */}
      {/* ========================================================= */}
      {activeAdminTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white">
              Ministration Booking Inquiries ({bookingRequests.length})
            </h3>
          </div>

          <div className="space-y-4">
            {bookingRequests.map(booking => (
              <div
                key={booking.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                      {booking.eventType}
                    </span>
                    <h4 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white">
                      {booking.eventName}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Host: {booking.organizationName} • Contact: {booking.contactPerson} ({booking.contactPhone} / {booking.contactEmail})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={booking.status}
                      onChange={e => updateBookingStatus(booking.id, e.target.value as BookingRequest['status'])}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                        booking.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : booking.status === 'declined'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="pending">Pending Review</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="approved">Approved & Scheduled</option>
                      <option value="declined">Declined</option>
                    </select>

                    <button
                      onClick={() => deleteBookingRequest(booking.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                      title="Delete request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <div>Date: <strong>{booking.eventDate}</strong> • Venue: <strong>{booking.venueCityState}</strong> • Attendance: <strong>{booking.expectedAttendees}</strong></div>
                  {booking.additionalNotes && (
                    <p className="italic text-slate-500">“{booking.additionalNotes}”</p>
                  )}
                </div>
              </div>
            ))}

            {bookingRequests.length === 0 && (
              <div className="py-12 text-center text-slate-400">
                No booking requests received yet.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: PRAYER REQUESTS & GIVING LOG                      */}
      {/* ========================================================= */}
      {activeAdminTab === 'prayers' && (
        <div className="space-y-8">
          
          {/* Prayer Petitions */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white">
              Prayer Petitions Placed on the Altar ({prayerRequests.length})
            </h3>

            <div className="space-y-3">
              {prayerRequests.map(prayer => (
                <div key={prayer.id} className="p-5 rounded-2xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {prayer.category}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{prayer.name}</span>
                      <span className="text-xs text-slate-400">({prayer.phone})</span>
                    </div>

                    <select
                      value={prayer.status}
                      onChange={e => updatePrayerStatus(prayer.id, e.target.value as typeof prayer.status)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      <option value="Received">Received</option>
                      <option value="In Prayer">Under Prayer Watch</option>
                      <option value="Answered">Answered Testimony</option>
                    </select>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic">
                    “{prayer.request}”
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Seed Faith Records */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white">
              Logged Seed Faith & Tithes ({givingRecords.length})
            </h3>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-[#0A2342]">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-bold">
                  <tr>
                    <th className="p-4">Donor Name</th>
                    <th className="p-4">Purpose</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Bank Ref</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {givingRecords.map(give => (
                    <tr key={give.id}>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{give.donorName}</td>
                      <td className="p-4 text-amber-600 dark:text-amber-400 font-semibold">{give.givingType}</td>
                      <td className="p-4 font-mono font-bold text-emerald-600">₦{give.amount.toLocaleString()}</td>
                      <td className="p-4 font-mono text-slate-400">{give.referenceNumber}</td>
                      <td className="p-4 text-slate-500">{give.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: DATA BACKUP & RESTORE                             */}
      {/* ========================================================= */}
      {activeAdminTab === 'backup' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h3 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white">
                Portal Data Backup, JSON Export & Disaster Recovery
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Preserve all church sermons, booking inquiries, prayer petitions, book catalogs, and website settings in a portable JSON file.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Export Box */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-300 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="font-serif-royal font-bold text-base text-slate-900 dark:text-white">
                  Export Full Backup (.json)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Download a snapshot of the current state including sermons, articles, bookings, and custom brand colors.
                </p>
                <button
                  onClick={handleExportBackup}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Backup JSON</span>
                </button>
              </div>

              {/* Import Box */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="font-serif-royal font-bold text-base text-slate-900 dark:text-white">
                  Restore from JSON File
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upload a previously exported backup file to restore all settings and database entries.
                </p>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Select JSON to Restore</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>

            </div>

            {/* Factory Reset Danger Zone */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  Reset Portal to Initial Ministry Presets
                </h4>
                <p className="text-xs text-slate-400">
                  Restores default settings, initial sermons, books, and event calendars.
                </p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to restore default ministry presets?')) {
                    resetAllDataToDefault();
                  }
                }}
                className="px-4 py-2 rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 hover:bg-rose-50 text-xs font-bold uppercase"
              >
                Reset Defaults
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 8: USER MANAGEMENT & ROLES                           */}
      {/* ========================================================= */}
      {activeAdminTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white">
                Administrator Directory & Role Management
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isSuperAdmin 
                  ? 'Super Admin Hub: Authorize new admin emails, assign roles, and manage credentials.'
                  : 'Authorized Ministry Team Directory.'
                }
              </p>
            </div>

            {isSuperAdmin && (
              <button
                onClick={() => setShowAddAdminModal(prev => !prev)}
                className="px-4 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 hover:opacity-90 transition-all self-start sm:self-auto"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Plus className="w-4 h-4" />
                <span>{showAddAdminModal ? 'Close Form' : 'Authorize New Admin Email'}</span>
              </button>
            )}
          </div>

          {/* Super Admin Add New Admin Email Form */}
          {showAddAdminModal && isSuperAdmin && (
            <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <h4 className="font-serif-royal font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                  <span>Register & Authorize New Admin Email</span>
                </h4>
                <span className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                  Assigned emails cannot be changed by regular admins
                </span>
              </div>

              <form onSubmit={handleCreateAdminEmailSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Admin Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminForm.name}
                    onChange={e => setNewAdminForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Deaconess Mary John"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Admin Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={newAdminForm.email}
                    onChange={e => setNewAdminForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="e.g. media@cgagracechapel.org"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">Assigned email is locked and set permanently.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Assign System Role
                  </label>
                  <select
                    value={newAdminForm.role}
                    onChange={e => setNewAdminForm(prev => ({ ...prev, role: e.target.value as AdminUser['role'] }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Media Minister">Media Minister (Sermons & Articles)</option>
                    <option value="Protocol Officer">Protocol Officer (Bookings & Itinerary)</option>
                    <option value="Super Admin">Super Admin (Full System Control)</option>
                  </select>
                </div>

                <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAdminModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    Authorize Email & Register
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* User Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleAdminUsers.map(user => (
              <div
                key={user.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>

                  {user.isFirstTimeLogin ? (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pending Setup
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Password Active
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white font-serif-royal">{user.name}</h4>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs text-slate-500 font-mono truncate">{user.email}</p>
                    <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded shrink-0">
                      Locked Email
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    Assigned Role
                  </label>
                  {isSuperAdmin ? (
                    <select
                      value={user.role}
                      onChange={e => updateAdminRole(user.id, e.target.value as AdminUser['role'])}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    >
                      <option value="Super Admin">Super Admin (Full Control)</option>
                      <option value="Media Minister">Media Minister (Sermons & Articles)</option>
                      <option value="Protocol Officer">Protocol Officer (Bookings & Itinerary)</option>
                    </select>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {user.role}
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Last Active:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{user.lastLogin}</span>
                  </div>
                  {user.addedBy && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Authorized By:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{user.addedBy}</span>
                    </div>
                  )}
                </div>

                {isSuperAdmin && user.email.toLowerCase() !== 'pstbesteghosa@gmail.com' && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        if (confirm(`Reset password requirement for ${user.email}? They will set a new password on their next sign in.`)) {
                          setFirstTimePassword(user.email, ''); // Forces isFirstTimeLogin reset or password reset
                          showToast(`Password setup requirement reset for ${user.email}.`, 'info');
                        }
                      }}
                      className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      Reset Password
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Remove admin privileges for ${user.email}?`)) {
                          deleteAdminUser(user.id);
                          showToast(`Admin ${user.email} removed.`, 'info');
                        }
                      }}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Remove Admin"
                    >
                      <Trash2 className="w-4 h-4 text-rose-500" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. WHATSAPP LIVE AUDIO SYNC PANEL                         */}
      {/* ========================================================= */}
      {activeAdminTab === 'whatsapp' && (
        <div className="space-y-8">
          
          {/* Header & Status Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0A2342] to-slate-900 border-2 border-emerald-500/40 text-white shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-serif-royal font-bold text-white flex items-center gap-2">
                    <span>WhatsApp Live Audio Sync Hub</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider border border-emerald-400/40">
                      Webhook Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Synchronize voice notes posted in your official WhatsApp channel directly to the screen audio of this website.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-auto">
                <button
                  onClick={toggleWhatsAppAutoPlay}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
                    whatsappAutoPlay
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{whatsappAutoPlay ? 'Auto-Play Active' : 'Enable Auto-Play'}</span>
                </button>
              </div>
            </div>

            {whatsappBroadcast && (
              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">Currently Synced Broadcast:</span>
                  <span className="font-bold text-white text-sm">{whatsappBroadcast.title}</span>
                  <span className="text-slate-400 block text-[11px]">{whatsappBroadcast.caption}</span>
                </div>
                <div className="shrink-0 text-slate-300 font-mono text-[11px] bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-500/40">
                  {whatsappBroadcast.postedAt}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. Direct Voice Note Broadcast Simulator / Manual Post */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <h4 className="font-serif-royal font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-500" />
                  <span>Instant Audio Broadcast Test</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Simulation</span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Test how a WhatsApp audio message immediately pops up and plays on visitors' screens in real-time.
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!waSimUrl.trim()) return;
                  const ok = await simulateWhatsAppAudio(waSimTitle, waSimUrl, waSimCaption);
                  if (ok) {
                    showToast('Voice note broadcast activated successfully!', 'success');
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Voice Note Title / Theme
                  </label>
                  <input
                    type="text"
                    required
                    value={waSimTitle}
                    onChange={e => setWaSimTitle(e.target.value)}
                    placeholder="e.g. Prophetic Morning Audio Declaration"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                      Audio Source (Direct Upload, Google Drive, or MP3 Link)
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadTarget('whatsapp');
                          directAudioInputRef.current?.click();
                        }}
                        disabled={isUploadingAudio}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 hover:bg-emerald-500 transition-colors"
                      >
                        <Upload className="w-3 h-3" />
                        <span>{isUploadingAudio && uploadTarget === 'whatsapp' ? 'Uploading...' : 'Upload File'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowMp3ConvertModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>Convert to MP3</span>
                      </button>
                      {waSimUrl && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {analyzeAudioUrl(waSimUrl).provider.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <input
                    type="url"
                    required
                    value={waSimUrl}
                    onChange={e => setWaSimUrl(e.target.value)}
                    placeholder="e.g. https://drive.google.com/file/d/.../view?usp=sharing or click 'Upload File'"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  {waSimUrl && waSimUrl.startsWith('/audio-uploads/') ? (
                    <div className="flex items-center justify-between text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>✅ Directly hosted on ministry server — ready to broadcast!</span>
                      <audio controls src={waSimUrl} className="h-6 w-48" />
                    </div>
                  ) : waSimUrl ? (
                    <p className={`text-[11px] font-medium ${
                      analyzeAudioUrl(waSimUrl).provider === 'google_drive' 
                        ? 'text-amber-600 dark:text-amber-400' 
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}>
                      💡 {analyzeAudioUrl(waSimUrl).notes}
                    </p>
                  ) : (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                      💡 <strong>WhatsApp Voice Note Tip:</strong> If your recording is in <code>.opus</code> or from iPhone, click <strong>Convert to MP3</strong> to convert it instantly, or upload directly!
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                    Caption / Summary Note
                  </label>
                  <input
                    type="text"
                    value={waSimCaption}
                    onChange={e => setWaSimCaption(e.target.value)}
                    placeholder="e.g. Prophetic declaration for breaking barriers."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                  style={{ backgroundColor: config.accentColor || '#D4AF37' }}
                >
                  <Radio className="w-4 h-4" />
                  <span>Broadcast Voice Note Live Now</span>
                </button>
              </form>
            </div>

            {/* 2. WhatsApp Cloud API / Webhook Technical Setup Guide */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                <h4 className="font-serif-royal font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>WhatsApp Cloud API Webhook Details</span>
                </h4>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Ready to Connect</span>
              </div>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    1. Webhook Endpoint URL
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-800 select-all break-all">
                    {window.location.origin}/api/whatsapp/webhook
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
                    2. Webhook Verification Token
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-[11px] text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-slate-800 select-all">
                    pst_best_eghosa_wa_token
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-[11px] text-amber-900 dark:text-amber-200">
                  <p className="font-bold">💡 How Meta Webhook Sync Works:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Add the Webhook URL and Verification Token in Meta for Developers (WhatsApp Cloud API) or Zapier / Make.</li>
                    <li>Subscribe to <code className="font-mono bg-amber-200 dark:bg-amber-900 px-1 rounded">messages</code> events.</li>
                    <li>When a voice note is posted to your WhatsApp Business channel, it automatically triggers your website's audio banner!</li>
                  </ol>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Global Hidden Audio File Input for Direct Device Uploads */}
      <input
        ref={directAudioInputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg,.opus,.flac"
        onChange={handleDirectAudioUpload}
        className="hidden"
      />

      {/* Audio Conversion and Linking Guide Modal */}
      <AudioConversionModal
        isOpen={showMp3ConvertModal}
        onClose={() => setShowMp3ConvertModal(false)}
        onAudioUploaded={(uploadedUrl, fileName) => {
          showToast(`Uploaded ${fileName} directly to website!`, 'success');
          if (uploadTarget === 'sermonNew') {
            setSermonForm(prev => ({ ...prev, audioUrl: uploadedUrl }));
          } else if (uploadTarget === 'sermonEdit') {
            setSermonEditForm(prev => prev ? ({ ...prev, audioUrl: uploadedUrl }) : null);
          } else if (uploadTarget === 'whatsapp') {
            setWaSimUrl(uploadedUrl);
          } else {
            setAudioTesterUrl(uploadedUrl);
          }
        }}
      />

    </div>
  );
};
