import React, { useState } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Copy, 
  Check, 
  MessageCircle, 
  ShieldCheck, 
  Heart, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenPrayerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenPrayerModal }) => {
  const { config, showToast } = useMinistry();
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleCopy = (acctNo: string, bank: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(acctNo);
      setCopiedAccount(acctNo);
      showToast(`${bank} account number (${acctNo}) copied!`, 'success');
      setTimeout(() => setCopiedAccount(null), 2500);
    }
  };

  return (
    <footer 
      className="w-full bg-[#051329] text-slate-300 border-t border-amber-500/20 pt-16 pb-32"
      style={{ backgroundColor: '#051329' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Ministry Brand Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-serif-royal text-xl font-bold shadow-md border border-amber-400/40"
                style={{ backgroundColor: config.primaryColor }}
              >
                <span className="text-amber-300">PBE</span>
              </div>
              <div>
                <h3 className="text-xl font-serif-royal font-bold text-white tracking-wide">
                  PST BEST EGHOSA
                </h3>
                <p className="text-xs text-amber-300/90 font-medium">
                  Pastor Eghosa Best IGBINOVIA
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 italic font-serif-royal leading-relaxed">
              “{config.motto}”
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              Founder of Best Eghosa World Outreach & Lead Pastor of {config.churchName}. Dedicated to unlocking prophetic mantles, spiritual deliverance, and raising kingdom champions across the nations.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={config.whatsappPrayerChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors border border-emerald-500/30"
              >
                <MessageCircle className="w-4 h-4 text-emerald-200" />
                <span>WhatsApp Prayer Channel</span>
              </a>

              <button
                onClick={onOpenPrayerModal}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-semibold transition-colors border border-white/10"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Submit Prayer Petition</span>
              </button>
            </div>
          </div>

          {/* Church Services & Programmes */}
          <div className="lg:col-span-4 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-serif-royal font-bold text-base">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Church Services & Programmes</span>
              </div>
              <button
                onClick={() => setActiveTab('events')}
                className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-2"
              >
                Full Schedule
              </button>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {config.serviceTimes.map((service, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-1.5 hover:border-amber-400/30 transition-all">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-amber-300 leading-snug">{service.title}</span>
                    <span className="text-slate-400 font-mono text-[10px] whitespace-nowrap bg-white/5 px-2 py-0.5 rounded">
                      {service.frequency || service.day}
                    </span>
                  </div>

                  <div className="text-white font-semibold font-mono text-xs text-amber-200">
                    {service.time}
                  </div>

                  {service.subServices && service.subServices.length > 0 ? (
                    <div className="space-y-1 pt-1 border-t border-white/5">
                      {service.subServices.map((sub, sIdx) => (
                        <div key={sIdx} className="flex items-baseline justify-between text-[11px] text-slate-300">
                          <span>{sub.title}</span>
                          <span className="font-mono text-slate-400 text-[10px]">{sub.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">{service.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Headquarters */}
          <div className="lg:col-span-3 space-y-3 text-left">
            <div className="flex items-center gap-2 text-white font-serif-royal font-bold text-base">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Headquarters Location</span>
            </div>

            <div className="text-xs text-slate-300 space-y-2.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                <span className="text-amber-300 font-semibold block">Grace Chapel International</span>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {config.branchHeadquarters}
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-mono text-xs">{config.phoneNumbers.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>WhatsApp Line: {config.whatsappMinistryLine}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 truncate">
                  <Mail className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{config.emails[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Giving Details Section */}
        <div 
          className="p-6 rounded-3xl border border-amber-500/30 text-left bg-[#0A2342]"
          style={{ backgroundColor: '#0A2342' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center border border-amber-400/40 text-amber-300"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-serif-royal font-bold text-white">
                  Church Bank Accounts for Tithes, Offerings & Seeds
                </h4>
                <p className="text-xs text-slate-400">
                  Partner with the Kingdom and sow into the grace mantle upon Pastor Best Eghosa.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab('giving');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-950 transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: config.accentColor }}
            >
              <span>Online Giving Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.bankAccounts.map((acct, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-2xl transition-colors flex items-center justify-between gap-3 shadow-md"
                style={{ 
                  backgroundColor: '#051329', 
                  border: '1px solid rgba(245, 158, 11, 0.3)' 
                }}
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-0.5">
                    {acct.purpose}
                  </span>
                  <div className="text-sm font-bold text-white">
                    {acct.bankName}
                  </div>
                  <div className="text-xs text-slate-300">
                    Acct Name: <span className="text-white font-medium">{acct.accountName}</span>
                  </div>
                  <div className="text-base sm:text-lg font-mono font-bold text-amber-300 tracking-wider mt-1">
                    {acct.accountNumber}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(acct.accountNumber, acct.bankName)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors shrink-0"
                  title="Copy account number"
                >
                  {copiedAccount === acct.accountNumber ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-300" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Legal & Admin Access */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Pastor Eghosa Best IGBINOVIA. All Rights Reserved. Champions of Grace Assembly, Inc.</p>

          <div className="flex items-center gap-4">
            <button
              id="footer-admin-login-btn"
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo(0, 0);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 transition-all font-semibold flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Admin Portal Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
