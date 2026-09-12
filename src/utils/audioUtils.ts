/**
 * Audio Link Processing and Streaming Utilities
 * Handles Google Drive, Dropbox, Internet Archive, OneDrive, and direct audio files.
 */

export interface AudioAnalysisResult {
  provider: 'google_drive' | 'dropbox' | 'archive_org' | 'direct_mp3' | 'onedrive' | 'unknown';
  fileId?: string;
  isDirectAudio: boolean;
  playableUrl: string;
  embedUrl?: string;
  notes: string;
  recommendedAction?: string;
}

/**
 * Extracts Google Drive file ID from various sharing, view, and export URLs
 */
export function extractGoogleDriveFileId(url: string | undefined | null): string | null {
  if (!url) return null;
  const cleaned = url.trim();
  
  // Format 1: /file/d/FILE_ID/view or /file/d/FILE_ID
  const match1 = cleaned.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1 && match1[1]) return match1[1];

  // Format 2: id=FILE_ID
  const match2 = cleaned.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2 && match2[1]) return match2[1];

  // Format 3: /d/FILE_ID
  const match3 = cleaned.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match3 && match3[1]) return match3[1];

  // Format 4: drive.google.com/open?id=FILE_ID
  const match4 = cleaned.match(/open\?id=([a-zA-Z0-9_-]+)/);
  if (match4 && match4[1]) return match4[1];

  return null;
}

/**
 * Returns the Google Drive official embed preview URL for iframe players
 */
export function getGoogleDriveEmbedUrl(url: string | undefined | null): string | null {
  const fileId = extractGoogleDriveFileId(url);
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Returns a direct client-side streamable Google Drive URL
 */
export function getDirectGoogleDriveStreamUrl(fileId: string): string {
  if (!fileId) return '';
  return `https://docs.google.com/uc?export=download&id=${fileId}`;
}

/**
 * Transforms external audio links into direct playable audio streaming URLs.
 */
export function getPlayableAudioUrl(url: string | undefined | null): string {
  if (!url) return '';
  let cleaned = url.trim();

  // Handle data URLs or local blob URLs directly
  if (cleaned.startsWith('data:') || cleaned.startsWith('blob:')) {
    return cleaned;
  }

  // 1. Google Drive view/share link conversion via server proxy or direct stream URL
  if (cleaned.includes('drive.google.com') || cleaned.includes('docs.google.com')) {
    const fileId = extractGoogleDriveFileId(cleaned);
    if (fileId) {
      // If running on local server with proxy support:
      return `/api/audio-proxy?url=${encodeURIComponent(cleaned)}&fileId=${fileId}`;
    }
    return `/api/audio-proxy?url=${encodeURIComponent(cleaned)}`;
  }

  // 2. Dropbox share link conversion (Direct client streaming with ?raw=1)
  if (cleaned.includes('dropbox.com')) {
    let directDropbox = cleaned
      .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
      .replace('?dl=0', '?raw=1')
      .replace('&dl=0', '&raw=1');
    if (!directDropbox.includes('raw=1') && !directDropbox.includes('dl=1')) {
      directDropbox += directDropbox.includes('?') ? '&raw=1' : '?raw=1';
    }
    return directDropbox;
  }

  // 3. OneDrive / Box conversion
  if (cleaned.includes('onedrive.live.com') || cleaned.includes('1drv.ms')) {
    return cleaned.replace('embed', 'download');
  }

  return cleaned;
}

/**
 * Analyzes an audio URL and provides user-friendly diagnostic information.
 */
export function analyzeAudioUrl(url: string | undefined | null): AudioAnalysisResult {
  if (!url || !url.trim()) {
    return {
      provider: 'unknown',
      isDirectAudio: false,
      playableUrl: '',
      notes: 'No URL provided'
    };
  }

  const cleaned = url.trim();
  const lower = cleaned.toLowerCase();

  // 1. Google Drive
  if (lower.includes('drive.google.com') || lower.includes('docs.google.com')) {
    const fileId = extractGoogleDriveFileId(cleaned);
    const embedUrl = fileId ? `https://drive.google.com/file/d/${fileId}/preview` : undefined;
    return {
      provider: 'google_drive',
      fileId: fileId || undefined,
      isDirectAudio: false,
      playableUrl: getPlayableAudioUrl(cleaned),
      embedUrl,
      notes: fileId 
        ? `Detected Google Drive File ID: ${fileId}. CRITICAL: Ensure access is set to 'Anyone with the link can view'.`
        : 'Google Drive URL recognized, but File ID could not be determined. Check the link format.',
      recommendedAction: 'Ensure Google Drive sharing is set to "Anyone with the link". If Google blocks direct streaming, use the built-in Google Drive Player toggle or Dropbox.'
    };
  }

  // 2. Dropbox
  if (lower.includes('dropbox.com')) {
    const directUrl = getPlayableAudioUrl(cleaned);
    return {
      provider: 'dropbox',
      isDirectAudio: true,
      playableUrl: directUrl,
      notes: 'Dropbox link detected. Automatically converted to direct stream format (?raw=1).',
      recommendedAction: 'Excellent format for instant, uninterrupted audio streaming across all browsers.'
    };
  }

  // 3. Internet Archive
  if (lower.includes('archive.org')) {
    return {
      provider: 'archive_org',
      isDirectAudio: lower.endsWith('.mp3') || lower.endsWith('.m4a') || lower.includes('/items/'),
      playableUrl: cleaned,
      notes: 'Internet Archive link detected. Unlimited free public audio hosting.',
      recommendedAction: 'Ensure you copy the direct download MP3 link from the Archive page.'
    };
  }

  // 4. Local Ministry Server Uploads
  if (lower.startsWith('/audio-uploads/') || lower.includes('/audio-uploads/')) {
    return {
      provider: 'direct_mp3',
      isDirectAudio: true,
      playableUrl: cleaned,
      notes: 'Directly hosted on ministry server. High-speed streaming without restrictions.',
      recommendedAction: 'Ready to stream immediately across all devices.'
    };
  }

  // 5. Direct Audio File (.mp3, .m4a, .aac, .wav, .ogg)
  if (/\.(mp3|m4a|aac|wav|ogg)(\?.*)?$/i.test(cleaned)) {
    return {
      provider: 'direct_mp3',
      isDirectAudio: true,
      playableUrl: cleaned,
      notes: 'Direct audio file URL detected. Streams natively in all web browsers.',
      recommendedAction: 'Ready to play directly without conversion.'
    };
  }

  return {
    provider: 'unknown',
    isDirectAudio: false,
    playableUrl: cleaned,
    notes: 'Generic web link. Web audio player will attempt standard HTML5 streaming.',
    recommendedAction: 'Ensure the link points to a publicly accessible audio stream (MIME type audio/mpeg).'
  };
}

