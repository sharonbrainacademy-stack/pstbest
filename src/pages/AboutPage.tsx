import React from 'react';
import { useMinistry } from '../context/MinistryContext';
import { 
  ShieldCheck, 
  MapPin, 
  Heart, 
  Flame, 
  Calendar, 
  Phone, 
  CheckCircle2, 
  GraduationCap, 
  Users 
} from 'lucide-react';

interface AboutPageProps {
  setActiveTab: (tab: string) => void;
  onOpenPrayerModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setActiveTab, onOpenPrayerModal }) => {
  const { config } = useMinistry();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-left">
      
      {/* Top Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
          <span>The Man, The Mandate & The Message</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-royal font-bold text-slate-900 dark:text-white leading-tight">
          About Pastor Eghosa Best IGBINOVIA
        </h1>
        <p className="text-base sm:text-lg text-amber-600 dark:text-amber-400 font-serif-royal italic font-medium">
          “Building Lives, Spreading the Gospel & Winning Souls at All Costs”
        </p>
      </div>

      {/* Main Bio Grid with Executive Photo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Photos & Quick Credentials */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-amber-500/30 relative">
            <img
              src={config.aboutExecutiveImageUrl}
              alt="Pastor Eghosa Best IGBINOVIA"
              className="w-full h-[460px] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                Apostolic & Prophetic Leader
              </span>
              <h3 className="text-xl font-serif-royal font-bold text-white">
                PST BEST EGHOSA
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Founder, Best Eghosa World Outreach • Lead Pastor, Champions of Grace Assembly, Inc.
              </p>
            </div>
          </div>

          {/* Quick Credential Badges */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Ministry Pillars & Credentials
            </h4>
            <div className="flex items-start gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Two decades of demonstrated prophetic signs, wonders, and deliverance.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <GraduationCap className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>Sound theological scholarship paired with dynamic apostolic revelation.</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>Headquartered in Igue-Iheya, Benin City, Edo State, Nigeria.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Narrative Biography */}
        <div className="lg:col-span-7 space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed font-sans-body">
          
          <div className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-l-4 border-amber-500 space-y-2">
            <h3 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white">
              The Divine Commission
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300">
              Pastor Eghosa Best IGBINOVIA (affectionately known worldwide as <strong>PST BEST EGHOSA</strong>) is a seasoned prophetic minister, dynamic teacher of the Word of God, author of best-selling spiritual volumes, and founder of <strong>Best Eghosa World Outreach</strong>.
            </p>
          </div>

          <h3 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white pt-2">
            Early Calling & Ministry Origins
          </h3>
          <p className="text-sm sm:text-base">
            From an early age in Edo State, Nigeria, the hand of God was manifestly evident upon Pastor Best. Guided by an intense passion for the presence of the Holy Spirit, he spent years in deep intercession, fasting, and biblical study. The Lord revealed unto him a divine commission to <em>“build lives, spread the unadulterated gospel of Jesus Christ, and win souls at all costs.”</em>
          </p>

          <p className="text-sm sm:text-base">
            Under this mandate, <strong>Champions of Grace Assembly, Incorporated</strong> was birthed. Today, the ministry’s international headquarters, known as <strong>Grace Chapel</strong>, located at Igue-Iheya, Benin City, stands as a spiritual beacon drawing thousands seeking salvation, supernatural healing, demonic deliverance, and prophetic alignment.
          </p>

          <h3 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white pt-2">
            The Prophetic Mantle & Teaching Depth
          </h3>
          <p className="text-sm sm:text-base">
            Pastor Best is widely celebrated for his unique ability to marry deep, balanced biblical exegesis with the raw demonstration of prophetic accuracy. Through his ministry, blind eyes have received sight, generational curses plaguing families for centuries have been obliterated, and believers have stepped into supernatural marketplace dominion.
          </p>

          <p className="text-sm sm:text-base">
            His visionary platform, <strong>Word Café</strong> (“Sip. Study. Soak. Transform.”), serves as a digital sanctuary where believers, professionals, and aspiring ministers feed upon deep revelation, moving beyond religious ritual into practical kingdom authority.
          </p>

          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('booking')}
              className="px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              style={{ backgroundColor: config.primaryColor }}
            >
              <Calendar className="w-4 h-4" />
              <span>Invite Pastor Best for Conference</span>
            </button>

            <button
              onClick={onOpenPrayerModal}
              className="px-6 py-3 rounded-xl border border-amber-500/50 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider hover:bg-amber-500/10 transition-all flex items-center gap-2"
            >
              <Heart className="w-4 h-4" />
              <span>Submit Prayer Petition</span>
            </button>
          </div>
        </div>

      </div>

      {/* Family Life & Ministry Couple Section */}
      <section className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-xl text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
              <Users className="w-3.5 h-3.5 text-rose-500" />
              <span>Family & Pastoral Partnership</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-serif-royal font-bold text-slate-900 dark:text-white">
              Family Life & Pastoral Support
            </h2>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              Behind the prophetic fire and international crusades is a warm, godly family sanctuary. Pastor Eghosa Best is joyfully married to his beloved wife and co-laborer in grace. Together, they exemplify the beauty of covenant marriage, mutual honor, and kingdom parenting.
            </p>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              Their union continues to serve as an inspiring testament to young couples and ministry partners, demonstrating that the power of God shines brightest through homes established on sacrificial love, prayer, and fidelity.
            </p>

            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Mentoring marriages across Edo State and beyond</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Champions of Grace Family & Youth Enrichment Initiative</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-amber-500/40 relative">
              <img
                src={config.pastorAndWifeImageUrl}
                alt="Pastor Best Eghosa and Wife"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5 text-white">
                <div>
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-widest block">
                    Champions of Grace Assembly
                  </span>
                  <span className="text-sm font-serif-royal font-bold text-white">
                    Pastor & Wife — Co-Laborers in Grace
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Headquarters Location Highlight */}
      <section 
        className="rounded-3xl p-8 text-white border border-amber-500/40 text-left shadow-2xl bg-[#0A2342]"
        style={{ backgroundColor: '#0A2342' }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <MapPin className="w-4 h-4" />
              <span>Headquarters Sanctuary</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif-royal font-bold">
              Grace Chapel (International Headquarters)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Located at Igue-Iheya, Benin City, Edo State, Nigeria. We welcome all worshippers to our life-transforming Sunday services (6:30 a.m. – 10:30 a.m.), Wednesday Bible study (5:00 p.m. – 6:30 p.m.), Friday prayer meetings (5:00 p.m. – 6:30 p.m.), monthly Communion, and Psalm 91 fasting programmes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setActiveTab('events')}
              className="px-5 py-2.5 rounded-xl text-slate-950 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: config.accentColor }}
            >
              <span>Service Schedules</span>
            </button>
            <a
              href={`tel:${config.phoneNumbers[0]}`}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Church Office</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
