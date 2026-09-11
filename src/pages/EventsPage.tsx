import React, { useState } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Flame, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  BookOpen,
  Heart,
  ShieldCheck,
  Sun,
  Sunrise,
  Layers,
  Award
} from 'lucide-react';

interface EventsPageProps {
  onOpenBookingTab: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onOpenBookingTab }) => {
  const { events, rsvpEvent, config } = useMinistry();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Sunday Services',
    'Weekly Services',
    'Special Sunday Services',
    'Ministers Fellowship',
    'Monthly Programmes'
  ];

  const filteredServices = config.serviceTimes.filter(service => {
    if (activeCategory === 'All') return true;
    return service.category === activeCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-20 text-left">
      
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
          <Calendar className="w-3.5 h-3.5" />
          <span>Church Services, Itineraries & Programmes</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-royal font-bold text-slate-900 dark:text-white leading-tight">
          Church Services & Programmes
        </h1>
        <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif-royal">
          Champions of Grace Assembly, Incorporated, holds regular services, fellowships, prayer meetings, and special programmes throughout the month. These gatherings provide opportunities for worship, Bible teaching, prayer, spiritual growth, fellowship, and service.
        </p>
      </div>

      {/* ========================================================= */}
      {/* CHURCH SERVICES & PROGRAMMES FULL SCHEDULE GRID           */}
      {/* ========================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mb-1">
              <Clock className="w-4 h-4" />
              <span>Regular Assemblies & Encounters</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-royal font-bold text-slate-900 dark:text-white">
              Official Schedule of Gatherings
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Service Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredServices.map((service, idx) => {
            const isSunday = service.category === 'Sunday Services' || service.title.includes('Sunday Services');
            const isCommunion = service.title.includes('Holy Communion');
            const isFasting = service.title.includes('Psalm 91');
            const isMinisters = service.title.includes('Ministers');

            return (
              <div
                key={service.id || idx}
                className={`rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0A2342] border transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl ${
                  isSunday 
                    ? 'border-amber-500/50 ring-1 ring-amber-500/30' 
                    : isCommunion || isFasting
                    ? 'border-rose-500/40'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-5">
                  {/* Badge & Timing Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        {service.category || 'Church Gathering'}
                      </span>
                      {service.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    
                    <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg">
                      {service.frequency || service.day}
                    </span>
                  </div>

                  {/* Title & Time Display */}
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif-royal font-bold text-slate-900 dark:text-white">
                      {service.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 mt-2 text-base font-mono font-bold text-rose-600 dark:text-amber-400">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>{service.time}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Detailed Sub-Schedule (for Sunday Services) */}
                  {service.subServices && service.subServices.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-500" />
                        <span>Sunday Order of Services</span>
                      </h4>

                      <div className="space-y-2.5">
                        {service.subServices.map((sub, sIdx) => (
                          <div 
                            key={sIdx}
                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between font-serif-royal font-bold text-slate-900 dark:text-white">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-800 dark:text-amber-300 flex items-center justify-center text-[10px]">
                                  {sIdx + 1}
                                </span>
                                <span>{sub.title}</span>
                              </div>
                              <span className="font-mono text-rose-600 dark:text-amber-400 font-semibold text-[11px]">
                                {sub.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                              {sub.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights for Specific Special Services */}
                  {isCommunion && (
                    <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                      <Award className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>Sacred celebration of Holy Communion, impartation of divine life, and apostolic anointing for fresh oil.</span>
                    </div>
                  )}

                  {isFasting && (
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>Dedicated period for fasting, prayer, intercession, and seeking God’s intervention and protection under the shadow of the Almighty.</span>
                    </div>
                  )}

                  {isMinisters && (
                    <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                      <Users className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Dedicated in-house fellowship for ministers serving at Champions of Grace Assembly to seek God's direction and intercede.</span>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Grace Chapel Headquarters, Igue-Iheya</span>
                  </div>

                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isMinisters ? 'Ministers Assembly' : 'All Are Welcome'}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* FEATURED CRUSADES, CONFERENCES & SPECIAL VIGILS           */}
      {/* ========================================================= */}
      <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1.5 mb-1">
              <Flame className="w-4 h-4" />
              <span>Conferences & Holy Ghost Encounters</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-royal font-bold text-slate-900 dark:text-white">
              Conferences, Crusades & Vigils
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Specialized prophetic meetings, conventions, and international revivals with Pastor Best Eghosa.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {events.map(event => (
            <div
              key={event.id}
              className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0A2342] border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                    {event.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {event.rsvpCount.toLocaleString()} Seats Reserved
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-serif-royal font-bold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-amber-400 transition-colors">
                  {event.title}
                </h3>

                <p className="text-sm font-serif-royal italic text-amber-600 dark:text-amber-300 font-semibold">
                  Theme: {event.theme}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Date: <strong className="text-slate-900 dark:text-white">{event.startDate}</strong> {event.endDate ? `to ${event.endDate}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Time: <strong className="text-slate-900 dark:text-white">{event.time}</strong></span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>Venue: <strong className="text-slate-900 dark:text-white">{event.venue}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                    <Users className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>Ministering: <strong className="text-slate-900 dark:text-white">{event.minister}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Free Registration / Open to All</span>
                </span>

                <button
                  onClick={() => rsvpEvent(event.id)}
                  className="px-5 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Reserve Seat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Pastor Best CTA */}
      <section 
        className="rounded-3xl p-8 text-white border border-amber-500/40 shadow-2xl bg-[#0A2342]"
        style={{ backgroundColor: '#0A2342' }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-serif-royal font-bold">
              Host Pastor Best Eghosa at Your Conference
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Is your ministry, church network, or university fellowship organizing a conference or revival? Submit an official ministerial invitation.
            </p>
          </div>

          <button
            onClick={onOpenBookingTab}
            className="px-6 py-3 rounded-xl text-slate-950 font-bold text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
            style={{ backgroundColor: config.accentColor }}
          >
            <span>Fill Ministration Booking Form</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
