import React, { useState, useEffect } from 'react';
import { 
  Calendar, Filter, Users, Award, ShieldCheck, Ticket, 
  ArrowRight, Radio, MapPin, Clock, Sparkles, ChevronDown, CheckCircle, 
  ExternalLink, Compass, Plus, Music, Code, Trophy, Heart
} from 'lucide-react';
import { EventItem } from '../data/eventsData';
import { DatabaseService } from '../data/dbStore';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'wishlist') => void;
  onSelectEvent: (event: EventItem) => void;
  onOpenClaimModal: (event: EventItem) => void;
  wishlistIds: string[];
  onToggleWishlist: (eventId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectEvent,
  onOpenClaimModal,
  wishlistIds,
  onToggleWishlist,
}) => {
  const [eventsList, setEventsList] = useState<EventItem[]>(() => DatabaseService.getEvents());
  const [submitEventModal, setSubmitEventModal] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const handleDbUpdate = () => {
      setEventsList(DatabaseService.getEvents());
    };
    window.addEventListener('eventhive_db_updated', handleDbUpdate);
    return () => window.removeEventListener('eventhive_db_updated', handleDbUpdate);
  }, []);

  // Flagship campus events preview
  const flagshipEvents = eventsList.slice(0, 4);

  const handleEventClick = (event: EventItem) => {
    onSelectEvent(event);
    if (event.id === 'thanganat-5') {
      onNavigate('details');
    } else {
      onOpenClaimModal(event);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbf9] text-[#111116] pb-12">
      {/* 1. Marquee Hero Section */}
      <section className="relative pt-10 pb-14 md:pt-16 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto text-center">
        {/* Campus Kicker Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f3ef] border border-[#e8e5dc] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-[#7b5800] mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
          <span>Swaminarayan University • Campus Event Gateway</span>
        </div>

        {/* Display Headline */}
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111116] max-w-4xl mx-auto leading-[1.18]">
          Discover <span className="font-serif italic font-normal text-[#b8860b] decoration-[#d4af37]/40 underline underline-offset-8">what&apos;s happening</span> on our campus
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#62626e] max-w-2xl mx-auto leading-relaxed">
          Tech fests, cultural nights, workshops, and sports meets — all verified campus gatherings with digital QR turnstile passes.
        </p>

        {/* Quick Stat Counters */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {[
            { value: '45+', label: 'Active Student Clubs', desc: 'Tech, Dance & Fine Arts' },
            { value: '120+', label: 'Annual Campus Fests', desc: 'Symposiums & Galas' },
            { value: '8,500+', label: 'Enrolled Scholars', desc: 'Across All Departments' },
            { value: '100%', label: 'Digital Passes', desc: 'Instant QR Verification' },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border border-[#e8e5dc] rounded-2xl p-4 text-center shadow-sm hover:border-[#d4af37]/60 hover:shadow-card-elevated hover:-translate-y-0.5 transition-all"
            >
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#b8860b] tabular-nums">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-[#111116] mt-0.5">{stat.label}</div>
              <div className="text-[10px] sm:text-[11px] text-[#62626e]">{stat.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Event Ongoing Right Now (Live Feature Card) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#111116]">
              Event Ongoing Right Now
            </h2>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-50 text-[#b8860b] border border-[#d4af37]/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-[#b8860b]" />
            Live Feed
          </span>
        </div>

        {/* Featured Live Card */}
        <div className="bg-white border border-[#e8e5dc] rounded-3xl overflow-hidden shadow-card-elevated hover:shadow-card-3d transition-all grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Media Column */}
          <div className="lg:col-span-6 relative min-h-[280px] sm:min-h-[340px] bg-gradient-to-br from-amber-800 via-amber-900 to-black p-6 sm:p-8 flex flex-col justify-between overflow-hidden text-white">
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Live Broadcast
              </span>

              <button
                onClick={() => onToggleWishlist('thanganat-5')}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                  wishlistIds.includes('thanganat-5')
                    ? 'bg-rose-500 text-white'
                    : 'bg-black/40 text-white hover:text-rose-400'
                }`}
                title="Wishlist Event"
              >
                <Heart className={`w-4 h-4 ${wishlistIds.includes('thanganat-5') ? 'fill-white' : ''}`} />
              </button>
            </div>

            <div className="relative z-10 my-auto py-4 text-center">
              <div className="inline-flex p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3 text-amber-300">
                <Music className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
                Thanganat 5.0
              </h3>
              <p className="text-amber-200/90 text-xs sm:text-sm mt-1 font-medium">
                Dhol Tasha • 3,500+ Dancers • Dodhiya Circles
              </p>
            </div>

            <div className="relative z-10 bg-black/60 backdrop-blur-md border border-white/15 rounded-2xl p-3 flex items-center justify-between text-white text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                <div>
                  <span className="text-[10px] text-amber-300 uppercase tracking-wider block font-bold">Live on Stage</span>
                  <span className="font-semibold">DJ Parth & Troupe Performing</span>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                Stage 01
              </span>
            </div>
          </div>

          {/* Right Information Column */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#b8860b] uppercase tracking-wider">
                <span>Cultural Extravaganza</span>
                <span>•</span>
                <span>Annual Fest Series</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#111116]">
                Thanganat 5.0 — Live Garba Celebration
              </h3>

              <p className="text-xs sm:text-sm text-[#62626e] leading-relaxed">
                The grandest campus Garba & Dandiya celebration bringing together thousands of students, vibrant beats, traditional folk dance, and celebrity DJ performances under the starry Kalol sky!
              </p>

              {/* Meta details */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2.5 text-xs text-[#2d2d34] bg-[#fbfbf9] p-2.5 rounded-xl border border-[#e8e5dc]">
                  <MapPin className="w-4 h-4 text-[#b8860b] shrink-0" />
                  <span className="font-semibold">New Cricket Ground, SU Campus (Kalol)</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-[#2d2d34] bg-[#fbfbf9] p-2.5 rounded-xl border border-[#e8e5dc]">
                  <Clock className="w-4 h-4 text-[#b8860b] shrink-0" />
                  <span>4th October, Wednesday • 7:00 PM to 12:00 AM</span>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-[#2d2d34] bg-[#fbfbf9] p-2.5 rounded-xl border border-[#e8e5dc]">
                  <Ticket className="w-4 h-4 text-[#b8860b] shrink-0" />
                  <span className="font-semibold text-[#15803d]">Free Entry with Verified SU Student ID</span>
                </div>
              </div>
            </div>

            {/* Checked In Count & CTA */}
            <div className="pt-4 border-t border-[#e8e5dc] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-[#b8860b] font-bold text-xs">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-[#111116] text-sm tabular-nums">1,420+ Scholars</div>
                  <div className="text-[11px] text-[#62626e]">Checked-in now at gate turnstiles</div>
                </div>
              </div>

              <button
                onClick={() => onNavigate('details')}
                className="w-full sm:w-auto bg-gold-gradient text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>View Details & Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Upcoming Flagship Gatherings */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 my-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#b8860b] block mb-1">
              The Campus Calendar
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111116]">
              Upcoming Flagship Gatherings
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#62626e] max-w-md">
            Handpicked academic conferences, winter celebrations, and competitive tournaments scheduled this term.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flagshipEvents.map((evt) => {
            const isSaved = wishlistIds.includes(evt.id);

            return (
              <div
                key={evt.id}
                onClick={() => handleEventClick(evt)}
                className="group cursor-pointer bg-white border border-[#e8e5dc] rounded-3xl overflow-hidden shadow-card-elevated hover:shadow-card-3d hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Visual Header */}
                  <div className={`h-36 ${evt.bannerImage ? 'relative' : `bg-gradient-to-br ${evt.gradient}`} p-4 flex flex-col justify-between text-white relative overflow-hidden`}>
                    {evt.bannerImage && (
                      <>
                        <img src={evt.bannerImage} alt={evt.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
                      </>
                    )}
                    <div className="flex justify-between items-start z-10">
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                        {evt.categoryLabel}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(evt.id);
                          }}
                          className={`p-1.5 rounded-full backdrop-blur-sm transition-colors ${
                            isSaved ? 'bg-rose-500 text-white' : 'bg-black/30 text-white hover:text-rose-400'
                          }`}
                          title="Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                        </button>
                        <span className="bg-white text-[#111116] px-2 py-1 rounded-lg text-center font-bold text-xs shadow-sm">
                          <span className="block text-[9px] uppercase tracking-wider text-[#b8860b] leading-tight">
                            {evt.shortDate.month}
                          </span>
                          <span className="block text-sm leading-none tabular-nums">
                            {evt.shortDate.day}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="text-white/90 text-xs font-semibold flex items-center gap-1.5 z-10">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span>{evt.time}</span>
                    </div>

                    <div className="absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-white/10 blur-lg pointer-events-none" />
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-serif font-bold text-base text-[#111116] group-hover:text-[#b8860b] transition-colors leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#62626e] line-clamp-2 leading-relaxed">
                      {evt.summary}
                    </p>
                    <div className="pt-2 text-xs text-[#2d2d34] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer with View Details */}
                <div className="p-4 pt-3 border-t border-[#e8e5dc] flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#15803d] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    +{evt.attendees} attending
                  </span>
                  <span className="font-bold text-[#b8860b] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Claim Pass →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => onNavigate('explore')}
            className="px-6 py-3 rounded-full border border-[#e8e5dc] bg-white text-xs sm:text-sm font-bold text-[#111116] hover:border-[#b8860b] hover:shadow-sm transition-all"
          >
            View All Upcoming Events & Seminars
          </button>
        </div>
      </section>
    </main>
  );
};
