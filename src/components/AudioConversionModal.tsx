import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  FileAudio, 
  Smartphone, 
  MessageSquare, 
  HardDrive, 
  CheckCircle2, 
  Sparkles, 
  Upload,
  ArrowRight,
  Info
} from 'lucide-react';

interface AudioConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAudioUploaded?: (url: string, fileName: string) => void;
}

export const AudioConversionModal: React.FC<AudioConversionModalProps> = ({
  isOpen,
  onClose,
  onAudioUploaded
}) => {
  const [activeTab, setActiveTab] = useState<'online' | 'whatsapp' | 'iphone' | 'upload'>('online');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(20);
    setUploadError(null);

    try {
      // Read file as base64 data URL
      const reader = new FileReader();
      reader.onprogress = (pe) => {
        if (pe.lengthComputable) {
          const pct = Math.round((pe.loaded / pe.total) * 60);
          setUploadProgress(20 + pct);
        }
      };

      reader.onload = async () => {
        try {
          setUploadProgress(85);
          const base64Data = reader.result as string;

          const response = await fetch('/api/upload-audio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileData: base64Data,
              mimeType: file.type || 'audio/mpeg'
            })
          });

          const result = await response.json();
          if (result.ok && result.url) {
            setUploadProgress(100);
            setUploadedUrl(result.url);
            if (onAudioUploaded) {
              onAudioUploaded(result.url, file.name);
            }
          } else {
            throw new Error(result.message || 'Upload failed');
          }
        } catch (err: any) {
          setUploadError(err.message || 'Upload failed');
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setUploadError('Failed to read file from disk');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err.message || 'Unexpected upload error');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileAudio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif-royal text-slate-900 dark:text-white">
                How to Convert Your Audio to MP3
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Turn WhatsApp voice notes, phone recordings, and restricted files into universal MP3s.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('online')}
            className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'online'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Online Converters (Free)</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Directly to Website</span>
          </button>

          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'whatsapp'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Voice Notes (.opus)</span>
          </button>

          <button
            onClick={() => setActiveTab('iphone')}
            className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'iphone'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone Voice Memos (.m4a)</span>
          </button>
        </div>

        {/* Tab 1: Fast Online Converters */}
        {activeTab === 'online' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300">
              <strong>Why MP3?</strong> MP3 is the global standard format supported by 100% of browsers, Android, iPhone, Windows, and smart speakers. Converting any audio file to MP3 guarantees it plays instantly without restriction.
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              3 Best Free Online Converters (No App or Signup Needed):
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Tool 1 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">CloudConvert</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Best overall. Converts WhatsApp voice notes, Google Drive files, M4A, WAV, or AAC directly into crystal-clear MP3.
                  </p>
                </div>
                <a
                  href="https://cloudconvert.com/audio-converter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-400 transition-colors"
                >
                  <span>Open CloudConvert</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tool 2 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">Online Audio Converter</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    By 123apps. Allows you to open files directly from your device or paste a Google Drive link to convert on the fly.
                  </p>
                </div>
                <a
                  href="https://online-audio-converter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 px-3.5 py-2 rounded-xl bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-sky-400 transition-colors"
                >
                  <span>Open 123apps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Tool 3 */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-2 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">Convertio</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Specialized in converting WhatsApp <code>.opus</code> recordings and phone voice notes into universal MP3.
                  </p>
                </div>
                <a
                  href="https://convertio.co/audio-converter/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-500 transition-colors"
                >
                  <span>Open Convertio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick 3-step instruction */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <div className="font-bold text-slate-900 dark:text-white">How to use them in 30 seconds:</div>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Click any converter link above.</li>
                <li>Tap <strong>Select File</strong> and choose your audio file (or select directly from Google Drive).</li>
                <li>Make sure output is set to <strong>MP3</strong>, click <strong>Convert</strong>, then <strong>Download</strong>!</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 2: Upload Directly to Website */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero Third-Party Dependency</span>
              </div>
              <p>
                You can upload any MP3, M4A, or WAV audio file directly to this website's server. It produces an instant direct audio link that streams worldwide without Google Drive permission errors.
              </p>
            </div>

            <div className="p-6 border-2 border-dashed border-amber-500/40 rounded-3xl text-center space-y-3 bg-amber-500/5">
              <Upload className="w-8 h-8 text-amber-500 mx-auto" />
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Select Audio File From Your Device
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Supports MP3, M4A, WAV, AAC, and OGG files up to 100MB
                </p>
              </div>

              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer hover:bg-amber-400 transition-colors shadow-md">
                <span>{isUploading ? 'Uploading Audio...' : 'Choose Audio File'}</span>
                <input
                  type="file"
                  accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg,.opus"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {isUploading && (
                <div className="w-full max-w-xs mx-auto space-y-1 pt-2">
                  <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Uploading... {uploadProgress}%
                  </span>
                </div>
              )}

              {uploadError && (
                <p className="text-xs font-semibold text-rose-500 pt-2">
                  ❌ {uploadError}
                </p>
              )}

              {uploadedUrl && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2 mt-2">
                  <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Upload Successful! Audio is ready to stream.</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 font-mono text-[11px] break-all border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    {uploadedUrl}
                  </div>
                  <audio controls src={uploadedUrl} className="w-full h-8 pt-1" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: WhatsApp Voice Notes */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800 space-y-2">
              <div className="font-bold text-sky-900 dark:text-sky-300 flex items-center gap-1.5 text-sm">
                <Info className="w-4 h-4" />
                <span>Why WhatsApp Voice Notes Fail on Websites</span>
              </div>
              <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                When you record or send a voice note on WhatsApp, it is saved in a special compressed format called <strong>.opus</strong> or <strong>.ogg</strong>. Most web browsers and standard media players cannot stream raw opus files directly.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Step-by-Step: Converting WhatsApp Voice Notes to MP3:
              </h4>

              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-bold">1</span>
                  Export from WhatsApp
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-6">
                  In WhatsApp, press and hold the voice note &gt; tap <strong>Share</strong> (or forward) &gt; select <strong>Save to Files</strong> (iPhone) or share to your file manager (Android). Alternatively, open WhatsApp Web on your computer and click the arrow on the voice message &gt; <strong>Download</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-bold">2</span>
                  Convert on Convertio or CloudConvert
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-6">
                  Open <a href="https://convertio.co/opus-mp3/" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 underline font-bold">Convertio (OPUS to MP3)</a>. Upload the voice note and click <strong>Convert</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-bold">3</span>
                  Upload or Link the MP3
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-6">
                  Save the resulting MP3, then click the <strong>Upload Audio File</strong> tab right here or paste the link into the Admin portal!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: iPhone Voice Memos */}
        {activeTab === 'iphone' && (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 space-y-2">
              <div className="font-bold text-slate-900 dark:text-white text-sm">
                How to convert Apple Voice Memos (.m4a) to MP3:
              </div>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                iPhones record audio using Apple's <strong>.m4a</strong> container. While Safari can play it, converting it to MP3 ensures Android users and Google Chrome play it without any glitch.
              </p>
            </div>

            <ol className="list-decimal pl-5 space-y-2">
              <li>Open the <strong>Voice Memos</strong> app on your iPhone.</li>
              <li>Tap on the recording you want to use.</li>
              <li>Tap the three dots icon <strong>(...)</strong> and select <strong>Save to Files</strong> (or Share).</li>
              <li>Open Safari and visit <a href="https://cloudconvert.com/m4a-to-mp3" target="_blank" rel="noopener noreferrer" className="text-amber-600 dark:text-amber-400 font-bold underline">cloudconvert.com/m4a-to-mp3</a>.</li>
              <li>Select the memo from your Files, convert to MP3, and download it!</li>
            </ol>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Need help? Upload directly using the second tab above.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
