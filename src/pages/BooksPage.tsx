import React from 'react';
import { useMinistry } from '../context/MinistryContext';
import { Book } from '../types';
import { BookOpen, Award, Download, ShoppingBag, Check, ChevronRight, Sparkles } from 'lucide-react';

interface BooksPageProps {
  onOpenBookModal: (book: Book) => void;
}

export const BooksPage: React.FC<BooksPageProps> = ({ onOpenBookModal }) => {
  const { books, config } = useMinistry();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-left">
      
      {/* Top Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
          <span>Apostolic Literary Publications</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-royal font-bold text-slate-900 dark:text-white leading-tight">
          Books by Pastor Best Eghosa
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Unlock divine blueprints, prophetic activations, and kingdom wealth strategies through these Holy Ghost inspired literary masterpieces authored by Pastor Eghosa Best IGBINOVIA.
        </p>
      </div>

      {/* Books List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {books.map(book => (
          <div
            key={book.id}
            className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              
              {/* Book Cover Image */}
              <div className="sm:col-span-5 flex flex-col items-center">
                <div className="w-full h-72 sm:h-80 rounded-2xl overflow-hidden shadow-xl border-2 border-amber-500/40 relative">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4 text-white">
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {book.year} Release • {book.pages} Pages
                    </span>
                  </div>
                </div>

                <div className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-xs text-slate-500 dark:text-slate-400 block">Offering Seed</span>
                  <span className="text-lg font-bold font-serif-royal text-rose-600 dark:text-amber-400">
                    ₦{book.priceNgn.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Book Content Details */}
              <div className="sm:col-span-7 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-amber-400">
                  {book.format}
                </span>

                <h2 className="text-xl sm:text-2xl font-serif-royal font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-amber-400 transition-colors">
                  {book.title}
                </h2>

                <p className="text-xs text-slate-600 dark:text-slate-400 italic font-medium">
                  {book.subtitle}
                </p>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">
                  {book.description}
                </p>

                {/* Key takeaway bullet points */}
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                    Prophetic Highlights:
                  </span>
                  {book.keyRevelations.slice(0, 2).map((rev, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-800 dark:text-slate-200">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{rev}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Author: <span className="font-semibold text-slate-900 dark:text-slate-100">{book.author}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenBookModal(book)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Preview & Excerpt</span>
                </button>

                <button
                  onClick={() => onOpenBookModal(book)}
                  className="px-5 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Order Book</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Distribution & Bulk Ministry Order Notice */}
      <section 
        className="rounded-3xl p-8 text-white border border-amber-500/40 shadow-2xl bg-[#0A2342]"
        style={{ backgroundColor: '#0A2342' }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Bulk Church & International Orders</span>
            </span>
            <h3 className="text-xl sm:text-2xl font-serif-royal font-bold">
              Distribute Pastor Best's Books in Your Region
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We offer subsidized packages for churches, campus fellowships, Bible schools, and Christian bookstores. Physical copies shipped nationwide across Nigeria and worldwide.
            </p>
          </div>

          <a
            href={`https://wa.me/${config.whatsappMinistryLine.replace(/[^0-9]/g, '')}?text=Hello%20PST%20BEST%20EGHOSA%20Book%20Ministry,%20I%20would%20like%20to%20inquire%20about%20bulk%20orders%20of%20your%20books.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
            style={{ backgroundColor: config.accentColor }}
          >
            <span>Inquire Bulk Distribution via WhatsApp</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </section>

    </div>
  );
};
