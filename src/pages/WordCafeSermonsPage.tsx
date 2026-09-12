import React, { useState } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { WordCafeArticle, Sermon } from '../types';
import { 
  Coffee, 
  Headphones, 
  ExternalLink,
  Search, 
  Sparkles, 
  ChevronRight, 
  Flame, 
  Clock, 
  BookOpen, 
  Radio 
} from 'lucide-react';

interface WordCafeSermonsPageProps {
  onOpenArticle: (article: WordCafeArticle) => void;
}

export const WordCafeSermonsPage: React.FC<WordCafeSermonsPageProps> = ({ onOpenArticle }) => {
  const { 
    sermons, 
    articles, 
    config 
  } = useMinistry();

  const [sermonSearch, setSermonSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeSubTab, setActiveSubTab] = useState<'sermons' | 'wordcafe'>('sermons');

  const categories = ['All', 'Prophetic', 'Grace', 'Deliverance', 'Prayer', 'Kingdom Wealth', 'Faith'];

  const filteredSermons = sermons.filter(s => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.title.toLowerCase().includes(sermonSearch.toLowerCase()) ||
                          s.scripture.toLowerCase().includes(sermonSearch.toLowerCase()) ||
                          s.description.toLowerCase().includes(sermonSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 text-left">
      
      {/* Header Banner */}
      <div 
        className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-white shadow-2xl border border-amber-500/40 bg-[#0A2342]"
        style={{ backgroundColor: '#0A2342' }}
      >
        <div className="absolute inset-0 z-0">
          <img
            src={config.wordCafeBannerUrl}
            alt="Word Cafe Teaching & Sermons"
            className="w-full h-full object-cover filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2342]/95 via-[#0A2342]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500 text-slate-950">
            <Coffee className="w-3.5 h-3.5" />
            <span>Word Café & Spiritual Repository</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif-royal font-bold leading-tight">
            Word Café & Prophetic Sermons
          </h1>

          <p className="text-base sm:text-xl font-serif-royal italic text-amber-300">
            “Sip. Study. Soak. Transform.”
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Feast on life-transforming apostolic teachings, midnight warfare prayers, and prophetic decrees ministered by Pastor Eghosa Best IGBINOVIA.
          </p>

          {/* Sub-Tabs Switcher */}
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => setActiveSubTab('sermons')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeSubTab === 'sermons'
                  ? 'bg-rose-600 text-white shadow-lg'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Headphones className="w-4 h-4" />
              <span>Audio Sermons ({sermons.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('wordcafe')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                activeSubTab === 'wordcafe'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>Word Café Articles ({articles.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. AUDIO SERMONS VIEW */}
      {activeSubTab === 'sermons' && (
        <div className="space-y-8">
          
          {/* Search and Category Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-sm">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={sermonSearch}
                onChange={e => setSermonSearch(e.target.value)}
                placeholder="Search by title, scripture or topic..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm focus:outline-none focus:border-amber-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Sermons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSermons.map(sermon => {
              return (
                <div
                  key={sermon.id}
                  className="rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between group bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        {sermon.category}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300 font-mono text-xs flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {sermon.duration}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-amber-400 transition-colors">
                      {sermon.title}
                    </h3>

                    <p className="text-xs text-amber-700 dark:text-amber-400 font-serif-royal font-semibold">
                      Scriptural Text: {sermon.scripture}
                    </p>

                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {sermon.description}
                    </p>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                      Series: <span className="font-semibold text-slate-800 dark:text-slate-200">{sermon.series}</span>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      <span className="font-bold text-slate-600 dark:text-slate-300">Sermon Recording</span>
                    </div>

                    {sermon.audioUrl ? (
                      <a
                        href={sermon.audioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 transition-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Sermon Link</span>
                      </a>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Audio Available
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSermons.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Radio className="w-12 h-12 mx-auto text-slate-500 mb-3" />
              <h4 className="text-base font-bold font-serif-royal">No sermons match your query</h4>
              <p className="text-xs mt-1">Try resetting the category filter or searching a different prophetic keyword.</p>
            </div>
          )}
        </div>
      )}

      {/* 2. WORD CAFE ARTICLES VIEW */}
      {activeSubTab === 'wordcafe' && (
        <div className="space-y-8">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-serif-royal font-bold text-slate-900 dark:text-white">
              Word Café Teaching Dissertations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Deep, transformative essays breaking down spiritual laws and divine principles for triumphant living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map(article => (
              <div
                key={article.id}
                onClick={() => onOpenArticle(article)}
                className="group cursor-pointer rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-amber-500/50 flex flex-col justify-between"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <span className="font-semibold text-amber-300 font-mono">
                      {article.scriptureRef}
                    </span>
                    <span className="bg-black/50 px-2 py-0.5 rounded text-[11px] backdrop-blur-xs">
                      {article.readTime}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-amber-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 italic mt-1 font-medium">
                      {article.subtitle}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 mt-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      By {article.author}
                    </span>
                    <span className="text-xs font-bold text-rose-600 dark:text-amber-400 flex items-center gap-1">
                      <span>Read Teaching</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
