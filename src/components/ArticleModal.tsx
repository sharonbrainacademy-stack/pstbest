import React from 'react';
import { WordCafeArticle } from '../types';
import { useMinistry } from '../context/MinistryContext';
import { X, Coffee, BookOpen, Sparkles, Share2 } from 'lucide-react';

interface ArticleModalProps {
  article: WordCafeArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const { config, showToast } = useMinistry();

  if (!article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Word Café Teaching: "${article.title}" by ${article.author} — ${window.location.href}`);
      showToast('Article link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] my-8 rounded-3xl bg-white dark:bg-[#0A2342] text-slate-900 dark:text-white shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col">
        
        {/* Cover Header Banner */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden shrink-0">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2342] via-black/40 to-black/20" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-xs"
            aria-label="Close article modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-slate-950 flex items-center gap-1">
                <Coffee className="w-3 h-3" />
                Word Café
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-xs text-white">
                {article.readTime}
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-xs text-amber-300">
                {article.scriptureRef}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif-royal font-bold text-white leading-tight">
              {article.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 italic mt-1">
              {article.subtitle}
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
          
          {/* Metadata bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div>
              Author: <span className="font-semibold text-slate-800 dark:text-slate-200">{article.author}</span> • {article.date}
            </div>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 hover:text-amber-500 transition-colors text-slate-700 dark:text-slate-300"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Scripture Anchor */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Scriptural Foundation
              </span>
              <p className="text-sm font-semibold font-serif-royal text-slate-800 dark:text-amber-100">
                {article.scriptureRef}
              </p>
            </div>
          </div>

          {/* Article Text */}
          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 font-sans-body">
            {article.content.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          {/* Prayer Declaration Box */}
          <div 
            className="p-5 rounded-2xl border text-white shadow-lg space-y-2"
            style={{ 
              background: `linear-gradient(135deg, ${config.primaryColor} 0%, #0A2342 100%)`,
              borderColor: config.accentColor
            }}
          >
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Prophetic Decree & Activation</span>
            </div>
            <p className="text-sm sm:text-base font-serif-royal italic leading-relaxed text-amber-100">
              "{article.prayerDeclaration}"
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-xs text-slate-400 font-semibold mr-1">Tags:</span>
            {article.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
          <span>Word Café — Sip. Study. Soak. Transform.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-slate-800 dark:text-slate-100 transition-colors"
          >
            Close Reader
          </button>
        </div>
      </div>
    </div>
  );
};
