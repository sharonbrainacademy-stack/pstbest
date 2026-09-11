import React, { useState } from 'react';
import { useMinistry } from '../context/MinistryContext';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';

export const BookingPage: React.FC = () => {
  const { config, submitBookingRequest } = useMinistry();

  const [eventName, setEventName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [venueCityState, setVenueCityState] = useState('');
  const [expectedAttendees, setExpectedAttendees] = useState('500 - 1,000 Attendees');
  const [eventType, setEventType] = useState('Prophetic Conference / Crusade');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !contactPerson || !contactPhone || !eventDate) return;

    submitBookingRequest({
      eventName,
      organizationName,
      contactPerson,
      contactEmail,
      contactPhone,
      eventDate,
      venueCityState,
      expectedAttendees,
      eventType,
      additionalNotes
    });

    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 text-left">
      
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          <span>Pastoral Protocol & Invitations</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-royal font-bold text-slate-900 dark:text-white leading-tight">
          Invite Pastor Best Eghosa
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          The ministration mantle upon Pastor Eghosa Best IGBINOVIA is available for crusades, national conferences, leadership conventions, and revivals across the globe.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Form: Booking Request */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0A2342] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl">
          {isSubmitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-serif-royal font-bold text-slate-900 dark:text-white">
                Ministration Invitation Logged
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{contactPerson}</strong>. Your invitation for <strong>"{eventName}"</strong> has been received by the Pastoral Protocol Office. Pastor Best reviews all invitations prayerfully and our itinerary desk will respond within 48 to 72 hours.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEventName('');
                  setOrganizationName('');
                  setContactPerson('');
                  setContactEmail('');
                  setContactPhone('');
                  setEventDate('');
                  setVenueCityState('');
                  setAdditionalNotes('');
                }}
                className="px-6 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md hover:opacity-90"
                style={{ backgroundColor: config.primaryColor }}
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b pb-3 dark:border-slate-800">
                <h3 className="text-base font-serif-royal font-bold text-slate-900 dark:text-white">
                  Event & Host Organization Details
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please fill out the fields accurately for prompt review.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Event Title / Program Name *
                </label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={e => setEventName(e.target.value)}
                  placeholder="e.g. Annual Prophetic Fire & Deliverance Convention"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Organization / Church Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={organizationName}
                    onChange={e => setOrganizationName(e.target.value)}
                    placeholder="e.g. Living Word Assembly"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Event Classification
                  </label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Prophetic Conference / Crusade">Prophetic Conference / Crusade</option>
                    <option value="Church Anniversary / Dedication">Church Anniversary / Dedication</option>
                    <option value="Ministers / Leadership Intensive">Ministers / Leadership Intensive</option>
                    <option value="Campus Revival / Youth Summit">Campus Revival / Youth Summit</option>
                    <option value="Marketplace / Business Believers Forum">Marketplace / Business Believers Forum</option>
                    <option value="All-Night Miracle Vigil">All-Night Miracle Vigil</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Proposed Date(s) *
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Expected Attendance
                  </label>
                  <select
                    value={expectedAttendees}
                    onChange={e => setExpectedAttendees(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  >
                    <option value="Under 500 Attendees">Under 500 Attendees</option>
                    <option value="500 - 1,000 Attendees">500 - 1,000 Attendees</option>
                    <option value="1,000 - 3,000 Attendees">1,000 - 3,000 Attendees</option>
                    <option value="3,000 - 10,000 Attendees">3,000 - 10,000 Attendees</option>
                    <option value="10,000+ Stadium / Arena Crusade">10,000+ Stadium / Arena Crusade</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Venue, City & State / Country *
                </label>
                <input
                  type="text"
                  required
                  value={venueCityState}
                  onChange={e => setVenueCityState(e.target.value)}
                  placeholder="e.g. City Auditorium, Abuja, Nigeria (or London, UK)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="border-t pt-4 dark:border-slate-800">
                <h3 className="text-base font-serif-royal font-bold text-slate-900 dark:text-white mb-2">
                  Contact Person & Protocol Liaison
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    placeholder="Pastor / Bishop / Minister..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    placeholder="protocol@church.org"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Specific Spiritual Burden / Ministry Expectations
                </label>
                <textarea
                  rows={3}
                  value={additionalNotes}
                  onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="Outline the vision for this meeting, specific prophetic direction, or ministration schedule..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 hover:opacity-95 active:scale-98 transition-all"
                style={{ backgroundColor: config.primaryColor }}
              >
                <Send className="w-4 h-4" />
                <span>Submit Ministration Invitation</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Info: Protocol Guidelines & Church Contacts */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Ministerial Protocol Guidelines</span>
            </div>
            
            <h3 className="text-xl font-serif-royal font-bold text-slate-900 dark:text-white">
              Invitation Etiquette & Planning
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Pastor Eghosa Best IGBINOVIA is committed to the spiritual integrity of every meeting. We recommend submitting invitations at least <strong>4 to 8 weeks</strong> ahead of proposed dates.
            </p>

            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 pt-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Travel logistics, lodging security, and itinerary coordination will be handled through the protocol desk.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Pastor Best prioritizes atmospheres of pure worship and spiritual liberty for the manifestation of signs and wonders.</span>
              </li>
            </ul>
          </div>

          {/* Quick Contact Box */}
          <div 
            className="p-6 rounded-3xl text-white border border-amber-500/40 space-y-4 shadow-xl bg-[#0A2342]"
            style={{ backgroundColor: '#0A2342' }}
          >
            <h4 className="text-base font-serif-royal font-bold text-amber-300">
              Direct Protocol Contacts
            </h4>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-mono">{config.phoneNumbers.join(', ')}</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp Ministry: {config.whatsappMinistryLine}</span>
              </div>
              <div className="flex items-center gap-3 truncate">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="truncate">{config.emails[0]}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{config.branchHeadquarters}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${config.whatsappMinistryLine.replace(/[^0-9]/g, '')}?text=Hello%20PST%20BEST%20EGHOSA%20Protocol%20Office,%20we%20would%20like%20to%20discuss%20an%20invitation%20for%20our%20program.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat with Protocol via WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
