import React, { useState } from 'react';
import { Book } from '../types';
import { useMinistry } from '../context/MinistryContext';
import { X, BookOpen, Download, ShoppingBag, Check, Award, ChevronRight } from 'lucide-react';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
}

export const BookModal: React.FC<BookModalProps> = ({ book, onClose }) => {
  const { config, showToast } = useMinistry();
  const [orderName, setOrderName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderFormat, setOrderFormat] = useState('Paperback (Delivered)');
  const [orderSent, setOrderSent] = useState(false);

  if (!book) return null;

  const handleDownloadExcerpt = () => {
    // Generate text blob for preview excerpt
    const content = `=====================================================
BOOK EXCERPT: ${book.title.toUpperCase()}
Author: ${book.author}
Publication: ${book.year}
Champions of Grace Assembly Inc. / Best Eghosa World Outreach
=====================================================

SUBTITLE:
${book.subtitle}

FEATURED PROPHETIC QUOTE:
${book.featuredQuote}

OVERVIEW:
${book.description}

CORE SPIRITUAL REVELATIONS:
${book.keyRevelations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

CHAPTER BLUEPRINT:
${book.chapters.map(c => `- ${c}`).join('\n')}

Order official copies via:
WhatsApp: ${config.whatsappMinistryLine}
Email: ${config.emails[0]}
Grace Chapel Headquarters, Igue-Iheya, Benin City, Edo State, Nigeria.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${book.title.replace(/\s+/g, '_')}_Excerpt_Sample.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloading excerpt sample for "${book.title}"!`, 'success');
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderName || !orderPhone) return;

    setOrderSent(true);
    showToast(`Order request submitted for "${book.title}"! Our book ministry team will reach you on ${orderPhone}.`, 'success');
    setTimeout(() => {
      setOrderSent(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] my-8 rounded-3xl bg-white dark:bg-[#0A2342] text-slate-900 dark:text-white shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col">
        
        {/* Header with Title and Close */}
        <div 
          className="p-6 text-white flex items-start justify-between relative overflow-hidden"
          style={{ backgroundColor: config.primaryColor }}
        >
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Pastor's Publications & Books</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-serif-royal font-bold">
              {book.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 italic">
              {book.subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
            aria-label="Close book modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Book Cover & Quick Meta */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-48 h-64 sm:w-full sm:h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/40 relative group">
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 text-white">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                    Author: {book.author}
                  </span>
                  <span className="text-xs font-serif-royal font-bold">
                    {book.pages} Pages • {book.year}
                  </span>
                </div>
              </div>

              <div className="mt-4 w-full text-center p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Ministry Offering Price</span>
                <span className="text-xl font-bold font-serif-royal text-rose-600 dark:text-amber-400">
                  ₦{book.priceNgn.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ({book.format})
                </span>
              </div>

              <button
                onClick={handleDownloadExcerpt}
                className="mt-3 w-full py-2.5 px-4 rounded-xl border border-amber-500/40 hover:bg-amber-500/10 text-amber-600 dark:text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Excerpt</span>
              </button>
            </div>

            {/* Book Revelations & Outline */}
            <div className="md:col-span-2 space-y-4">
              
              {/* Featured Quote */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30">
                <p className="text-sm font-serif-royal italic text-slate-800 dark:text-amber-200 leading-relaxed font-semibold">
                  {book.featuredQuote}
                </p>
                <span className="block text-right text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">
                  — Pastor Eghosa Best IGBINOVIA
                </span>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Book Synopsis & Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Key Revelations */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Key Revelations Inside This Book</span>
                </h4>
                <ul className="space-y-1.5">
                  {book.keyRevelations.map((rev, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chapters */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Chapter Blueprint
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {book.chapters.map((ch, i) => (
                    <div key={i} className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 truncate">
                      {ch}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order / Delivery Form Section */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Order / Reserve Official Copies</span>
            </h3>

            {orderSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Your order request has been logged! Our book distribution desk will contact you to arrange dispatch.</span>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orderName}
                    onChange={e => setOrderName(e.target.value)}
                    placeholder="Pastor / Minister / Bro / Sis..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={orderPhone}
                    onChange={e => setOrderPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Format
                  </label>
                  <select
                    value={orderFormat}
                    onChange={e => setOrderFormat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Paperback (Delivered)">Paperback (Physical Delivery)</option>
                    <option value="Digital PDF / eBook">Digital eBook (Email Delivery)</option>
                    <option value="Bulk Order (Churches/Bookstores)">Bulk Order for Church / Conference</option>
                  </select>
                </div>

                <div className="sm:col-span-3 flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <span>Submit Book Order (₦{book.priceNgn.toLocaleString()})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
