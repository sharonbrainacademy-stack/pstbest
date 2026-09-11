import React, { useState } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { X, Sparkles, Send, ShieldCheck, Heart } from 'lucide-react';
import { PrayerRequest } from '../types';

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrayerModal: React.FC<PrayerModalProps> = ({ isOpen, onClose }) => {
  const { submitPrayerRequest, config } = useMinistry();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<PrayerRequest['category']>('Healing & Health');
  const [request, setRequest] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !request) return;

    submitPrayerRequest({
      name,
      email,
      phone,
      category,
      request,
      isPrivate
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setRequest('');
      setIsPrivate(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0A2342] text-slate-900 dark:text-white shadow-2xl border border-amber-500/30 overflow-hidden">
        
        {/* Header */}
        <div 
          className="p-6 text-white relative overflow-hidden"
          style={{ backgroundColor: config.primaryColor }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 border border-white/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-200">
                  Prophetic Intercession
                </span>
                <h3 className="text-lg sm:text-xl font-serif-royal font-bold">
                  Send Your Prayer Petition
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-200 mt-2">
            Pastor Eghosa Best and the Champions of Grace prayer mantle team will lift your petition during the midnight watches.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-bounce">
                <Heart className="w-8 h-8 fill-current" />
              </div>
              <h4 className="text-xl font-bold font-serif-royal text-emerald-600 dark:text-emerald-400">
                Petition Placed Upon the Altar
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm">
                "And it shall come to pass, that before they call, I will answer; and while they are yet speaking, I will hear." — Isaiah 65:24
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Brother Emmanuel O."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Prayer Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as PrayerRequest['category'])}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Healing & Health">Healing & Health</option>
                    <option value="Prophetic Deliverance">Prophetic Deliverance</option>
                    <option value="Financial Miracle">Financial Miracle</option>
                    <option value="Marriage & Family">Marriage & Family</option>
                    <option value="Spiritual Growth">Spiritual Growth</option>
                    <option value="Other">Other Petitions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Email (Optional for pastoral feedback)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Describe Your Prayer Need *
                </label>
                <textarea
                  required
                  rows={4}
                  value={request}
                  onChange={e => setRequest(e.target.value)}
                  placeholder="Detail your request clearly. What supernatural intervention are you trusting God for?"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="privateCheck"
                  checked={isPrivate}
                  onChange={e => setIsPrivate(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="privateCheck" className="text-xs text-slate-600 dark:text-slate-400 cursor-pointer flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                  <span>Strictly confidential (only Pastor Best reviews this)</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-white font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all hover:opacity-95 active:scale-98"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Send className="w-4 h-4" />
                <span>Submit Prayer Petition</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
