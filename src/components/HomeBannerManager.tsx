import React, { useState } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { MinistryHeroBanner } from '../types';
import { 
  Image as ImageIcon, 
  Upload, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Check, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  ExternalLink, 
  X,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Copy,
  HelpCircle
} from 'lucide-react';

const PRESET_BANNERS = [
  {
    name: 'Official Pastor Best Executive Banner',
    url: 'https://i.postimg.cc/1zJvWQv9/9623BAC8-75C6-4928-A7F8-8E2930DC25CD.jpg',
    description: 'Current full-bleed ministry portrait banner'
  },
  {
    name: 'Prophetic Night of Fire & Deliverance',
    url: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?auto=format&fit=crop&w=1600&q=80',
    description: 'Atmosphere of spiritual warfare and high glory'
  },
  {
    name: 'Sunday Celebration & Grace Encounter',
    url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=80',
    description: 'Atmosphere of high praise and apostolic worship'
  },
  {
    name: 'Grace Chapel Fellowship & Word Ministration',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
    description: 'Deep study, prayer, and revelation of grace'
  }
];

export const HomeBannerManager: React.FC = () => {
  const { config, updateConfig, showToast } = useMinistry();

  // Current primary hero image local state
  const [heroInputUrl, setHeroInputUrl] = useState(config.heroImageUrl || '');
  const [previewHeroUrl, setPreviewHeroUrl] = useState(config.heroImageUrl || '');

  // Add / Edit Multi-Banner Modal state
  const [showModal, setShowModal] = useState(false);
  const [showDeployGuide, setShowDeployGuide] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<MinistryHeroBanner>({
    id: '',
    imageUrl: '',
    title: '',
    subtitle: '',
    linkUrl: 'events',
    linkText: 'Explore More',
    isActive: true
  });

  const heroBanners = config.heroBanners || [
    {
      id: 'default-banner-1',
      imageUrl: config.heroImageUrl,
      title: config.pastorName,
      subtitle: `${config.churchName} — ${config.branchHeadquarters}`,
      linkUrl: 'events',
      linkText: 'Upcoming Prophetic Encounter',
      isActive: true
    }
  ];

  // Handle uploading image from user's device (phone, laptop, tablet)
  const handleDeviceImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Selected image file is larger than 5MB. Please choose an optimized image.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onComplete(dataUrl);
        showToast('Image uploaded from device successfully!', 'success');
      }
    };
    reader.onerror = () => {
      showToast('Failed to read image file from device.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Save Primary Hero Banner Image
  const handleSavePrimaryHero = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!heroInputUrl.trim()) {
      showToast('Please enter or upload an image URL.', 'warning');
      return;
    }

    // Also update or add to heroBanners list
    const updatedBanners = [...heroBanners];
    if (updatedBanners.length > 0) {
      updatedBanners[0] = {
        ...updatedBanners[0],
        imageUrl: heroInputUrl.trim()
      };
    } else {
      updatedBanners.push({
        id: `banner-${Date.now()}`,
        imageUrl: heroInputUrl.trim(),
        title: config.pastorName,
        subtitle: config.churchName,
        isActive: true
      });
    }

    updateConfig({
      heroImageUrl: heroInputUrl.trim(),
      heroBanners: updatedBanners
    });
    setPreviewHeroUrl(heroInputUrl.trim());
    showToast('Top banner on home page updated successfully!', 'success');
  };

  // Open modal for creating new banner
  const handleOpenAddModal = () => {
    setEditingBannerId(null);
    setBannerForm({
      id: `banner-${Date.now()}`,
      imageUrl: '',
      title: '',
      subtitle: '',
      linkUrl: 'events',
      linkText: 'Join Encounter',
      isActive: true
    });
    setShowModal(true);
  };

  // Open modal for editing existing banner
  const handleOpenEditModal = (banner: MinistryHeroBanner) => {
    setEditingBannerId(banner.id);
    setBannerForm({ ...banner });
    setShowModal(true);
  };

  // Save Banner in Multi-Banner Modal
  const handleSaveBannerModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.imageUrl.trim()) {
      showToast('Please specify a banner image URL or upload an image file.', 'warning');
      return;
    }

    let updatedBanners: MinistryHeroBanner[];
    if (editingBannerId) {
      updatedBanners = heroBanners.map(b => b.id === editingBannerId ? { ...bannerForm } : b);
      showToast('Banner updated in carousel.', 'success');
    } else {
      const newBanner: MinistryHeroBanner = {
        ...bannerForm,
        id: bannerForm.id || `banner-${Date.now()}`
      };
      updatedBanners = [...heroBanners, newBanner];
      showToast('New picture/banner added to home page top space!', 'success');
    }

    // If first banner changed or if heroImageUrl was empty, sync primary image
    const primaryImg = updatedBanners.length > 0 ? updatedBanners[0].imageUrl : bannerForm.imageUrl;

    updateConfig({
      heroBanners: updatedBanners,
      heroImageUrl: primaryImg
    });
    setHeroInputUrl(primaryImg);
    setPreviewHeroUrl(primaryImg);
    setShowModal(false);
  };

  // Delete Banner
  const handleDeleteBanner = (bannerId: string) => {
    if (heroBanners.length <= 1) {
      showToast('You must keep at least one banner picture for the home page.', 'warning');
      return;
    }
    const updated = heroBanners.filter(b => b.id !== bannerId);
    updateConfig({
      heroBanners: updated,
      heroImageUrl: updated[0].imageUrl
    });
    setHeroInputUrl(updated[0].imageUrl);
    setPreviewHeroUrl(updated[0].imageUrl);
    showToast('Banner removed from home page.', 'info');
  };

  // Toggle Active status
  const handleToggleActive = (bannerId: string) => {
    const updated = heroBanners.map(b => {
      if (b.id === bannerId) {
        return { ...b, isActive: b.isActive === false ? true : false };
      }
      return b;
    });
    updateConfig({ heroBanners: updated });
    showToast('Banner visibility toggled.', 'info');
  };

  // Move banner up/down in carousel order
  const handleMoveBanner = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= heroBanners.length) return;

    const reordered = [...heroBanners];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    updateConfig({
      heroBanners: reordered,
      heroImageUrl: reordered[0].imageUrl
    });
    setHeroInputUrl(reordered[0].imageUrl);
    setPreviewHeroUrl(reordered[0].imageUrl);
    showToast('Banner sequence updated.', 'info');
  };

  // Quick set as primary
  const handleSetAsPrimary = (banner: MinistryHeroBanner) => {
    const filtered = heroBanners.filter(b => b.id !== banner.id);
    const reordered = [banner, ...filtered];
    updateConfig({
      heroImageUrl: banner.imageUrl,
      heroBanners: reordered
    });
    setHeroInputUrl(banner.imageUrl);
    setPreviewHeroUrl(banner.imageUrl);
    showToast(`"${banner.title || 'Selected banner'}" set as primary home page banner!`, 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner Explanation */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0A2342] to-slate-900 text-white border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-400 text-slate-950">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Home Page Top Space Manager</span>
            </div>
            <button
              type="button"
              onClick={() => setShowDeployGuide(!showDeployGuide)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>{showDeployGuide ? 'Hide Netlify & GitHub Guide' : 'Why Banner Changes Need Code Sync on Netlify?'}</span>
            </button>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif-royal font-bold text-white">
            Top Banner & Picture Customization
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Customize the prominent picture and banner at the very top of your home page. You can upload a flyer or portrait directly from your phone/computer, paste an image link from Google Drive or PostImages, or create multiple rotating banners with clickable call-to-action buttons.
          </p>
        </div>
      </div>

      {/* GitHub & Netlify Deployment Explanation Card */}
      {showDeployGuide && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/40 dark:bg-amber-950/20 space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
              <span>How Banners Work on GitHub & Netlify</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const codeSnippet = `heroImageUrl: '${config.heroImageUrl}',\nheroBanners: ${JSON.stringify(heroBanners, null, 2)}`;
                navigator.clipboard.writeText(codeSnippet);
                showToast('Banner code copied! Paste into src/data/initialData.ts', 'success');
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Banner Config for Git</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-amber-500/20 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">1</span>
                <span>Local Browser vs Netlify</span>
              </div>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                When you change banners in this Admin Portal, changes are saved in your browser's <code>localStorage</code>. Netlify builds fresh from GitHub code in <code>src/data/initialData.ts</code>, where initial defaults reside.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-amber-500/20 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">2</span>
                <span>Image Hotlink Protection</span>
              </div>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Certain free image hosts (PostImages, Imgur) block requests coming from Netlify domains unless <code>referrerPolicy="no-referrer"</code> is configured. We have added this attribute and an automatic fallback so your banners will not break.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-amber-500/20 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">3</span>
                <span>Permanent GitHub Sync</span>
              </div>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                To make any banner permanent for every visitor on Netlify without needing an Admin login, click <strong>Copy Banner Config for Git</strong> above, and save it in <code>src/data/initialData.ts</code>, or log into Admin on Netlify once.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: Primary Top Banner Quick Update */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 dark:border-slate-800">
          <div>
            <h4 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Primary Home Page Top Banner</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The primary image displayed full-bleed at the top of the home page.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-500" />
              <span>Upload from Device</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleDeviceImageUpload(e, (url) => {
                  setHeroInputUrl(url);
                  setPreviewHeroUrl(url);
                })}
              />
            </label>
          </div>
        </div>

        {/* Live Visual Preview of Primary Hero Banner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Live Picture Preview</span>
            <span className="text-emerald-500 font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Active on Public Website
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border-2 border-amber-500/30 shadow-inner group">
            {previewHeroUrl ? (
              <img
                src={previewHeroUrl}
                alt="Primary Top Banner Preview"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="w-full h-48 sm:h-72 object-cover object-top transition-transform duration-500 group-hover:scale-[1.01]"
                onError={() => showToast('Failed to load image preview. Please check URL.', 'error')}
              />
            ) : (
              <div className="h-48 flex items-center justify-center text-slate-500 text-xs">
                No banner picture configured
              </div>
            )}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-white/10 uppercase tracking-wider">
              Top Space: Position #1
            </div>
          </div>
        </div>

        {/* URL Input Form */}
        <form onSubmit={handleSavePrimaryHero} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Banner Image URL or Base64 Data
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                required
                value={heroInputUrl}
                onChange={e => {
                  setHeroInputUrl(e.target.value);
                  setPreviewHeroUrl(e.target.value);
                }}
                placeholder="Paste image link e.g. https://... or click 'Upload from Device' above"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 hover:opacity-95 whitespace-nowrap"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Save className="w-4 h-4" />
                <span>Save Banner</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
              Tip: Supports direct JPEG/PNG links, Unsplash, Imgur, PostImages, Google Drive public links, or direct uploads from your gallery.
            </p>
          </div>
        </form>

        {/* Presets Gallery */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Quick 1-Click Banner Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PRESET_BANNERS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setHeroInputUrl(preset.url);
                  setPreviewHeroUrl(preset.url);
                  showToast(`Selected "${preset.name}". Click "Save Banner" to apply.`, 'info');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all group hover:border-amber-400 ${
                  previewHeroUrl === preset.url
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-full h-20 object-cover rounded-lg mb-2 group-hover:opacity-90"
                />
                <span className="block text-xs font-bold text-slate-900 dark:text-white truncate">
                  {preset.name}
                </span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {preset.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: Rotating Pictures & Multi-Banner Carousel Manager */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 dark:border-slate-800">
          <div>
            <h4 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Multi-Banner Carousel & Picture Library ({heroBanners.length})</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When 2 or more banners are active, the top home page automatically rotates between them with smooth carousel transitions.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 hover:opacity-90"
            style={{ backgroundColor: config.primaryColor }}
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner Picture</span>
          </button>
        </div>

        {/* Existing Banners List */}
        <div className="space-y-4">
          {heroBanners.map((banner, index) => (
            <div
              key={banner.id || index}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                banner.isActive !== false
                  ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  : 'bg-slate-100/50 dark:bg-slate-950/40 border-dashed border-slate-300 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative flex-shrink-0 w-28 h-16 rounded-xl overflow-hidden bg-slate-950 border border-slate-300 dark:border-slate-700">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || 'Banner Picture'}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover object-top"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-white">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {banner.title || 'Pure Picture Banner'}
                      </span>
                      {index === 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold uppercase tracking-wider">
                          Primary
                        </span>
                      )}
                      {banner.isActive === false ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-500 text-[10px] font-bold uppercase tracking-wider">
                          Hidden
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-bold uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>

                    {banner.subtitle && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                        {banner.subtitle}
                      </p>
                    )}

                    {banner.linkUrl && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-500 font-medium">
                        <ExternalLink className="w-3 h-3" />
                        <span>Action: {banner.linkText || 'Visit'} → {banner.linkUrl}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap self-end md:self-center">
                  
                  {/* Reorder Buttons */}
                  <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveBanner(index, 'up')}
                      className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30"
                      title="Move Banner Up in Rotation"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === heroBanners.length - 1}
                      onClick={() => handleMoveBanner(index, 'down')}
                      className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 border-l border-slate-200 dark:border-slate-800"
                      title="Move Banner Down in Rotation"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Set As Primary Button */}
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetAsPrimary(banner)}
                      className="px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-500 hover:bg-amber-500/10 text-xs font-bold transition-colors"
                      title="Make this the first main banner"
                    >
                      Set Primary
                    </button>
                  )}

                  {/* Toggle Active */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(banner.id)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition-colors"
                  >
                    {banner.isActive === false ? 'Show' : 'Hide'}
                  </button>

                  {/* Edit Banner */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(banner)}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Banner Details"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Banner */}
                  <button
                    type="button"
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: ADD / EDIT BANNER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-500" />
                <h4 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white">
                  {editingBannerId ? 'Edit Home Top Banner Picture' : 'Add New Top Banner Picture'}
                </h4>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBannerModal} className="space-y-4">
              
              {/* Image URL & Upload button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Banner Picture URL or Device Upload *
                  </label>
                  <label className="cursor-pointer text-xs font-bold text-amber-500 hover:underline flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleDeviceImageUpload(e, (url) => {
                        setBannerForm({ ...bannerForm, imageUrl: url });
                      })}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  required
                  value={bannerForm.imageUrl}
                  onChange={e => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  placeholder="e.g. https://... or upload from your device"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Live Modal Thumbnail Preview */}
              {bannerForm.imageUrl && (
                <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-700 h-40">
                  <img
                    src={bannerForm.imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              )}

              {/* Title / Headline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Banner Headline / Title (Optional)
                </label>
                <input
                  type="text"
                  value={bannerForm.title || ''}
                  onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="e.g. Prophetic Miracle Service or leave blank for pure picture"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Subtitle / Tagline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Subtitle / Theme (Optional)
                </label>
                <input
                  type="text"
                  value={bannerForm.subtitle || ''}
                  onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. Dismantling altars & entering divine expansion"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Call to Action Button Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Button Destination Action
                  </label>
                  <select
                    value={bannerForm.linkUrl || ''}
                    onChange={e => setBannerForm({ ...bannerForm, linkUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="">No Button (Pure Picture Banner)</option>
                    <option value="events">Upcoming Events & Crusades</option>
                    <option value="sermons">Sermons & Audio Teachings</option>
                    <option value="publications">Books & Word Café</option>
                    <option value="giving">Giving / Kingdom Seed Offering</option>
                    <option value="booking">Book Pastor Best for Ministration</option>
                    <option value="about">About Pastor Best & Headquarters</option>
                    <option value={config.whatsappPrayerChannelUrl}>WhatsApp Prayer Channel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={bannerForm.linkText || ''}
                    onChange={e => setBannerForm({ ...bannerForm, linkText: e.target.value })}
                    placeholder="e.g. Join Next Encounter"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="bannerIsActive"
                  checked={bannerForm.isActive !== false}
                  onChange={e => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="bannerIsActive" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Make this banner visible in the home page rotation immediately
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 hover:opacity-90"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBannerId ? 'Update Banner' : 'Add to Top Space'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
