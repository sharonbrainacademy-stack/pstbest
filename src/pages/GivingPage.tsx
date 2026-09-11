import React, { useState } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { GivingRecord } from '../types';
import { 
  Heart, 
  Copy, 
  Check, 
  CreditCard, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Globe, 
  Gift, 
  Receipt, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export const GivingPage: React.FC = () => {
  const { config, recordGiving, showToast } = useMinistry();
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Online Seed Form State
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [givingType, setGivingType] = useState<GivingRecord['givingType']>('Tithe');
  const [amount, setAmount] = useState<string>('20000');
  const [selectedBank, setSelectedBank] = useState('Zenith Bank (1012345678)');
  const [notes, setNotes] = useState('');
  const [generatedReceipt, setGeneratedReceipt] = useState<GivingRecord | null>(null);

  const handleCopy = (acctNo: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(acctNo);
      setCopiedBank(acctNo);
      showToast(`${label} account number (${acctNo}) copied!`, 'success');
      setTimeout(() => setCopiedBank(null), 2500);
    }
  };

  const handleSeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!donorName || isNaN(numAmount) || numAmount <= 0) return;

    const ref = `PBE-${givingType.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRec: Omit<GivingRecord, 'id' | 'date'> = {
      donorName,
      email,
      phone,
      givingType,
      amount: numAmount,
      currency: 'NGN',
      bankUsed: selectedBank,
      referenceNumber: ref,
      notes
    };

    recordGiving(newRec);

    setGeneratedReceipt({
      ...newRec,
      id: `give-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
  };

  const givingPillars = [
    {
      title: 'Tithe & Firstfruit',
      icon: Gift,
      scripture: 'Malachi 3:10',
      description: 'Honoring the Lord with the first tenth of your increase to rebuke devourers and trigger open heaven abundance.'
    },
    {
      title: 'Outreach & Missions Seed',
      icon: Globe,
      scripture: 'Mark 16:15',
      description: 'Directly sponsoring rural crusades, gospel literature, media broadcasts, and winning souls at all costs.'
    },
    {
      title: 'Building & Sanctuary Project',
      icon: Building2,
      scripture: 'Haggai 1:8',
      description: 'Expanding the Grace Chapel International auditorium facilities to accommodate the soaring multitude in Benin City.'
    },
    {
      title: 'Prophetic Impartation Seed',
      icon: Sparkles,
      scripture: 'Galatians 6:6',
      description: 'Sowing into the apostolic grace and prophetic mantle upon Pastor Eghosa Best for family turnarounds.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-left">
      
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
          <Heart className="w-3.5 h-3.5 fill-current" />
          <span>Covenant Giving & Seed Faith</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-royal font-bold text-slate-900 dark:text-white leading-tight">
          Partner with Grace & Harvest
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          “Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver.” — 2 Corinthians 9:7. Sow into good soil and provoke supernatural returns.
        </p>
      </div>

      {/* 1. Official Bank Accounts for Direct Transfer */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl sm:text-2xl font-serif-royal font-bold text-slate-900 dark:text-white">
            Church Bank Accounts for Direct Electronic Transfer
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.bankAccounts.map((acct, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-6 sm:p-8 text-white border-2 border-amber-500/40 shadow-xl space-y-4 relative overflow-hidden bg-[#0A2342]"
              style={{ backgroundColor: '#0A2342' }}
            >
              <div 
                className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-15 blur-2xl pointer-events-none"
                style={{ backgroundColor: config.primaryColor }}
              />

              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/40">
                  {acct.purpose}
                </span>
                <span className="text-xs font-mono text-slate-300 font-semibold">Nigeria NGN</span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-serif-royal text-white">
                  {acct.bankName}
                </h3>
                <p className="text-xs text-slate-200 mt-0.5">
                  Account Name: <span className="font-semibold text-amber-200">{acct.accountName}</span>
                </p>
              </div>

              <div 
                className="p-4 rounded-2xl border flex items-center justify-between shadow-inner"
                style={{ 
                  backgroundColor: '#051329', 
                  border: '1px solid rgba(255, 255, 255, 0.2)' 
                }}
              >
                <div>
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider block font-medium">Account Number</span>
                  <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-300 tracking-wider">
                    {acct.accountNumber}
                  </span>
                </div>

                <button
                  onClick={() => handleCopy(acct.accountNumber, acct.bankName)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  {copiedBank === acct.accountNumber ? (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                You can transfer via Mobile Banking, USSD, ATM, or Over-The-Counter at any bank branch.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Giving Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {givingPillars.map((pillar, i) => {
          const Icon = pillar.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 block">
                {pillar.scripture}
              </span>
              <h3 className="text-base font-serif-royal font-bold text-slate-900 dark:text-white">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* 3. Interactive Online Giving / Seed Notification Form */}
      <div className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="max-w-2xl mb-8 space-y-2">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-widest">
            <Receipt className="w-4 h-4" />
            <span>Seed Faith Notification & Digital Receipt</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-royal font-bold text-slate-900 dark:text-white">
            Log Your Giving & Receive Acknowledgment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Notify the church treasury team after transferring your tithe or seed to receive your pastoral acknowledgment code and prayer covering.
          </p>
        </div>

        {generatedReceipt ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 space-y-6 max-w-xl mx-auto text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                Seed Faith Recorded Successfully
              </span>
              <h3 className="text-2xl font-serif-royal font-bold text-slate-900 dark:text-white mt-1">
                ₦{generatedReceipt.amount.toLocaleString()} ({generatedReceipt.givingType})
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Ref: <strong className="font-mono text-emerald-700 dark:text-emerald-300">{generatedReceipt.referenceNumber}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 text-left text-xs space-y-2 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Giver / Donor:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{generatedReceipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Destination Account:</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{generatedReceipt.bankUsed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 dark:text-slate-400 font-medium">Date:</span>
                <span className="text-slate-900 dark:text-slate-100">{generatedReceipt.date}</span>
              </div>
            </div>

            <p className="text-xs italic text-slate-700 dark:text-slate-300">
              “The Lord bless thee, and keep thee: The Lord make his face shine upon thee, and be gracious unto thee.” — Numbers 6:24-25
            </p>

            <button
              onClick={() => setGeneratedReceipt(null)}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Record Another Seed
            </button>
          </div>
        ) : (
          <form onSubmit={handleSeedSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={e => setDonorName(e.target.value)}
                placeholder="e.g. Bro. David O."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Phone Number / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+234..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Giving Purpose
              </label>
              <select
                value={givingType}
                onChange={e => setGivingType(e.target.value as GivingRecord['givingType'])}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Tithe">Tithe (10% Increase)</option>
                <option value="Offering">Sunday / Midweek Offering</option>
                <option value="Building Project">Grace Chapel Building Project</option>
                <option value="Outreach Seed">Best Eghosa World Outreach Seed</option>
                <option value="Prophetic Seed">Prophetic Mantle Impartation Seed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Amount (NGN ₦) *
              </label>
              <input
                type="number"
                required
                min="100"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="50000"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Bank Transferred To
              </label>
              <select
                value={selectedBank}
                onChange={e => setSelectedBank(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
              >
                <option value="Zenith Bank (1012345678)">Zenith Bank (Tithe & Offering - 1012345678)</option>
                <option value="First Bank of Nigeria (2034567890)">First Bank of Nigeria (Project & Missions - 2034567890)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Prayer Note or Specific Thanksgiving (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Mention the specific expectation or breakthrough you are anchoring this seed on..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: config.primaryColor }}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Seed Faith Notification</span>
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
};
