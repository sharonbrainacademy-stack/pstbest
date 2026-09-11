import React from 'react';
import { useMinistry } from '../context/MinistryContext';
import { Calendar, Clock, MapPin, Users, Flame, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface EventsPageProps {
  onOpenBookingTab: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onOpenBookingTab }) => {
  const { events, rsvpEvent, config } = useMinistry();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-left">
      
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
          <Calendar className="w-3.5 h-3.5" />
          <span>Ministry Itinerary & Assemblies</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-royal font-bold text-slate-900 dark:text-white leading-tight">
          Upcoming Events & Conventions
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Mark your calendar for unforgettable encounters with the power of the Holy Ghost. Join Pastor Eghosa Best IGBINOVIA in Benin City and in apostolic meetings worldwide.
        </p>
      </div>

      {/* Featured Crusades & Conferences */}
      <div className="space-y-8">
        <h2 className="text-2xl font-serif-royal font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-rose-600" />
          <span>Major Crusades & Conferences</span>
        </h2>

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

      {/* Weekly Service Times at Grace Chapel Headquarters */}
      <div className="space-y-8">
        <h2 className="text-2xl font-serif-royal font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <span>Weekly Assemblies at Grace Chapel Headquarters</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {config.serviceTimes.map((service, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-800 dark:text-amber-300 border border-amber-400/30 inline-block">
                {service.day}
              </span>

              <h3 className="text-lg font-serif-royal font-bold text-slate-900 dark:text-white">
                {service.title}
              </h3>

              <div className="text-sm font-mono font-bold text-rose-600 dark:text-amber-400">
                {service.time}
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {service.description}
              </p>

              <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>Grace Chapel, Igue-Iheya, Benin City</span>
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
