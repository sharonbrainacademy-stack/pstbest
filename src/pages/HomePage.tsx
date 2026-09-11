import React, { useState, useEffect } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { DailyScriptureCard } from '../components/DailyScriptureCard';
import { WordCafeArticle, Sermon } from '../types';
import { 
  Headphones, 
  Play, 
  Pause, 
  MessageCircle, 
  Calendar, 
  ChevronRight, 
  Coffee, 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
  onOpenArticle: (article: WordCafeArticle) => void;
  onOpenPrayerModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab, onOpenArticle, onOpenPrayerModal }) => {
  const { 
    config, 
    sermons, 
    articles, 
    events, 
    books, 
    playSermon, 
    currentSermon, 
    isPlaying, 
    togglePlay, 
    isDarkMode 
  } = useMinistry();

  // Next Featured Event Countdown calculation
  const featuredEvent = events.find(e => e.isFeatured) || events[0];
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!featuredEvent) return;

    const target = new Date(`${featuredEvent.startDate}T17:00:00`).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [featuredEvent]);

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. Clean Full-Bleed Hero Banner */}
      <section className="relative w-full overflow-hidden bg-[#0A2342] shadow-2xl">
        <img
          src={config.heroImageUrl}
          alt="Pastor Eghosa Best IGBINOVIA Banner"
          className="w-full h-auto max-h-[75vh] sm:max-h-[85vh] object-cover object-top"
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* 2. Daily Prophetic Scripture of the Day Card */}
        <section id="daily-scripture-section">
          <DailyScriptureCard />
        </section>

        {/* 3. Upcoming Event Countdown Banner */}
        {featuredEvent && (
          <section className="relative overflow-hidden rounded-3xl p-6 sm:p-10 border border-amber-500/40 text-white shadow-2xl bg-[#0A2342]" style={{ backgroundColor: '#0A2342' }}>
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              
              <div className="space-y-3 max-w-xl text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-600/90 text-white">
                  <Flame className="w-3.5 h-3.5 text-amber-300" />
                  <span>Upcoming Prophetic Encounter</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif-royal font-bold text-white">
                  {featuredEvent.title}
                </h2>
                <p className="text-sm sm:text-base text-amber-300 font-serif-royal italic">
                  {featuredEvent.theme}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    {featuredEvent.startDate} {featuredEvent.endDate ? `— ${featuredEvent.endDate}` : ''}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {featuredEvent.time}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Venue: {featuredEvent.venue}
                </p>
              </div>

              {/* Countdown Clocks */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  Countdown to Divine Visitation
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {[
                    { label: 'Days', val: timeLeft.days },
                    { label: 'Hours', val: timeLeft.hours },
                    { label: 'Mins', val: timeLeft.minutes },
                    { label: 'Secs', val: timeLeft.seconds }
                  ].map((unit, idx) => (
                    <div 
                      key={idx} 
                      className="w-16 sm:w-20 p-3 rounded-2xl border text-center shadow-md"
                      style={{ 
                        backgroundColor: '#051329', 
                        border: '1px solid rgba(255, 255, 255, 0.2)' 
                      }}
                    >
                      <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-300 block">
                        {unit.val.toString().padStart(2, '0')}
                      </span>
                      <span className="text-[10px] text-slate-300 uppercase tracking-widest block mt-0.5 font-medium">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('events')}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                  style={{ backgroundColor: config.accentColor }}
                >
                  <span>View Full Ministry Itinerary</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </section>
        )}

        {/* 4. Latest Audio Sermons Section */}
        <section className="space-y-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mb-1">
                <Headphones className="w-4 h-4" />
                <span>Prophetic Word Library</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-royal font-bold text-slate-900 dark:text-white">
                Latest Audio Sermons & Teachings
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Listen and soak in the revelation of grace, prophetic authority, and prevailing prayer.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('sermons')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-amber-400 hover:underline shrink-0"
            >
              <span>Explore All Audio Sermons</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sermons.slice(0, 3).map(sermon => {
              const isThisPlaying = currentSermon?.id === sermon.id && isPlaying;
              return (
                <div
                  key={sermon.id}
                  className="rounded-2xl p-5 border transition-all duration-300 hover:shadow-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        {sermon.category}
                      </span>
                      <span className="text-slate-600 dark:text-slate-300 font-mono text-[11px] font-medium">
                        {sermon.duration}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                      {sermon.title}
                    </h3>

                    <p className="text-xs text-amber-700 dark:text-amber-400 font-serif-royal font-semibold">
                      Anchor: {sermon.scripture}
                    </p>

                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {sermon.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      {sermon.playsCount.toLocaleString()} plays
                    </span>

                    <button
                      onClick={() => {
                        if (isThisPlaying) {
                          togglePlay();
                        } else {
                          playSermon(sermon);
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isThisPlaying
                          ? 'bg-rose-600 text-white shadow-md'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-600 hover:text-white text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. "Word Café" Spotlight Section ("Sip. Study. Soak. Transform.") */}
        <section className="relative rounded-3xl overflow-hidden p-6 sm:p-10 border border-amber-500/30 bg-white dark:bg-[#0A2342] shadow-xl text-left">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                <span>Word Café Ministry</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-royal font-bold text-slate-900 dark:text-white">
                “Sip. Study. Soak. Transform.”
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 max-w-xl leading-relaxed">
                Take a quiet moment with the Word of God. Deep biblical dissertations and prophetic insight authored by Pastor Eghosa Best for spiritual maturity.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('sermons')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md hover:opacity-90 transition-all shrink-0"
              style={{ backgroundColor: config.primaryColor }}
            >
              <span>View All Teachings</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Featured Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            {articles.slice(0, 3).map(article => (
              <div
                key={article.id}
                onClick={() => onOpenArticle(article)}
                className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-amber-500/50 transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-xs">
                    {article.readTime}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block mb-1">
                      {article.scriptureRef}
                    </span>
                    <h3 className="text-base sm:text-lg font-serif-royal font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-amber-300 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3 mt-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-rose-700 dark:text-amber-400">
                    <span>Read Article</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Pastor Best Books Showcase */}
        <section className="space-y-8 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Literary Outreach</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-royal font-bold text-slate-900 dark:text-white">
                Publications by Pastor Best Eghosa
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                Anointed spiritual manuals that have transformed thousands of lives globally.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('books')}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-amber-400 hover:underline shrink-0"
            >
              <span>Explore Book Catalog</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {books.map(book => (
              <div
                key={book.id}
                onClick={() => setActiveTab('books')}
                className="group cursor-pointer rounded-2xl p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left"
              >
                <div className="relative h-60 rounded-xl overflow-hidden shadow-md mb-4">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                    <span className="text-xs font-bold text-amber-300 font-serif-royal">
                      ₦{book.priceNgn.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  <h3 className="text-sm sm:text-base font-serif-royal font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                    {book.subtitle}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-amber-400">
                  <span>View Details</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Core Spiritual Pillars Banner */}
        <section 
          className="rounded-3xl p-8 sm:p-12 text-white border border-amber-500/40 text-left shadow-2xl bg-[#0A2342]"
          style={{ backgroundColor: '#0A2342' }}
        >
          <div className="max-w-2xl mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>The Apostolic Mandate</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-royal font-bold text-white">
              The Four Pillars of Champions of Grace
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              Foundational spiritual dynamics anchoring the ministry of Pastor Eghosa Best IGBINOVIA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'The Mandate of Faith',
                scripture: 'Hebrews 11:6',
                desc: 'Unyielding confidence in the integrity of God’s Word that speaks light into chaos and relocates mountains.'
              },
              {
                title: 'Uncommon Grace',
                scripture: '2 Corinthians 12:9',
                desc: 'The divine advantage that silences human struggle and crowns human effort with effortless favor and speed.'
              },
              {
                title: 'Righteousness & Truth',
                scripture: 'Proverbs 14:34',
                desc: 'Living consecrated lives that reflect the holy nature of Christ, standing uncorrupted in a generation of compromise.'
              },
              {
                title: 'Prophetic Deliverance',
                scripture: 'Obadiah 1:17',
                desc: 'Dismantling ancestral covenants, breaking evil altars, and establishing total liberty for families and destinies.'
              }
            ].map((pillar, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl transition-all space-y-2.5 shadow-md hover:scale-[1.02]"
                style={{ 
                  backgroundColor: '#051329', 
                  border: '1px solid rgba(245, 158, 11, 0.35)' 
                }}
              >
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-mono font-bold text-amber-300 bg-amber-400/20 border border-amber-400/40">
                  {pillar.scripture}
                </span>
                <h4 className="text-base font-serif-royal font-bold text-white">{pillar.title}</h4>
                <p className="text-xs text-slate-200 leading-relaxed font-normal">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
