/**
 * Transforms external audio links (e.g. Google Drive view links, Dropbox links, etc.)
 * into direct playable audio streaming URLs.
 */
export function getPlayableAudioUrl(url: string | undefined | null): string {
  if (!url) return '';
  let cleaned = url.trim();

  // 1. Google Drive view/share link conversion via server proxy
  if (cleaned.includes('drive.google.com') || cleaned.includes('docs.google.com')) {
    return `/api/audio-proxy?url=${encodeURIComponent(cleaned)}`;
  }

  // 2. Dropbox share link conversion via server proxy
  if (cleaned.includes('dropbox.com')) {
    return `/api/audio-proxy?url=${encodeURIComponent(cleaned)}`;
  }

  // 3. OneDrive / Box conversion
  if (cleaned.includes('onedrive.live.com') || cleaned.includes('1drv.ms')) {
    return cleaned.replace('embed', 'download');
  }

  return cleaned;
}
