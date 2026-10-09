import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Calendar, MapPin, Clock, Users, Sparkles, 
  Radio, Check, ArrowRight, Share2, Bookmark, Eye, ExternalLink,
  Camera, Film, Trophy, Code, Award, Heart, Ticket
} from 'lucide-react';
import { CAMPUS_EVENTS, CONCLUDED_EVENTS, EventItem } from '../data/eventsData';
import { DatabaseService } from '../data/dbStore';

interface ExploreViewProps {
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'wishlist') => void;
  onSelectEvent: (event: EventItem) => void;
  onOpenClaimModal: (event: EventItem) => void;
  wishlistIds: string[];
  onToggleWishlist: (eventId: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onNavigate,
  onSelectEvent,
  onOpenClaimModal,
  wishlistIds,
  onToggleWishlist,
}) => {
  const [eventsList, setEventsList] = useState<EventItem[]>(() => DatabaseService.getEvents());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [rsvpState, setRsvpState] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleDbUpdate = () => {
      setEventsList(DatabaseService.getEvents());
    };
    window.addEventListener('eventhive_db_updated', handleDbUpdate);
    return () => window.removeEventListener('eventhive_db_updated', handleDbUpdate);
  }, []);

  // Keyboard shortcut cmd+k / ctrl+k for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('explore-search-input');
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleRsvp = (e: React.MouseEvent, evt: EventItem) => {
    e.stopPropagation();
    const isNowRsvpd = !rsvpState[evt.id];
    setRsvpState((prev) => ({ ...prev, [evt.id]: isNowRsvpd }));
    
    if (isNowRsvpd) {
      setToastMessage(`RSVP Confirmed for ${evt.title}!`);
      onOpenClaimModal(evt);
    } else {
      setToastMessage(`RSVP Removed for ${evt.title}.`);
    }
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWishlistClick = (e: React.MouseEvent, eventId: string, eventTitle: string) => {
    e.stopPropagation();
    onToggleWishlist(eventId);
    const isSaved = wishlistIds.includes(eventId);
    setToastMessage(isSaved ? `Removed "${eventTitle}" from Wishlist` : `Saved "${eventTitle}" to Wishlist!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter events from persistent database store
  const filteredEvents = eventsList.filter((evt) => {
    const matchCategory = activeCategory === 'all' || evt.category === activeCategory;
    const matchQuery = 
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <main className="min-h-screen bg-[#fbfbf9] text-[#111116] pb-16">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111116] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom border border-[#d4af37]/40">
          <Check className="w-4 h-4 text-[#d4af37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Search Area */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#e8e5dc]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f3ef] border border-[#e8e5dc] text-[10px] font-bold uppercase tracking-widest text-[#7b5800] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b]"></span>
              University Life • Academic Year 2024-25
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111116]">
              Explore All <span className="font-serif italic font-normal text-[#b8860b]">Campus Events</span>
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#62626e] max-w-xl">
              Find technical hackathons, cultural fests, workshops, sports meets, and diplomatic summits across Swaminarayan University.
            </p>
          </div>

          {/* Quick Search Bar with Hotkey */}
          <div className="relative w-full md:w-80">
            <div className="flex items-center bg-white border border-[#e8e5dc] rounded-2xl px-3.5 py-2.5 shadow-sm focus-within:border-[#b8860b] transition-colors">
              <Search className="w-4 h-4 text-[#62626e] shrink-0 mr-2" />
              <input
                id="explore-search-input"
                type="text"
                placeholder="Search by fest, club, hall..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-[#62626e]"
              />
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-[#f4f3ef] text-[#62626e] rounded border border-[#e8e5dc]">
                ⌘K
              </span>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'All Gatherings' },
            { id: 'cultural', label: 'Cultural & Arts' },
            { id: 'tech', label: 'Tech & Coding' },
            { id: 'sports', label: 'Sports & E-Sports' },
            { id: 'workshops', label: 'Workshops & Seminars' },
            { id: 'diplomatic', label: 'Diplomatic & MUN' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-gold-gradient text-white shadow-gold-glow'
                  : 'bg-white border border-[#e8e5dc] text-[#2d2d34] hover:border-[#b8860b] hover:bg-[#fbfbf9]'
              }`}
            >
              {cat.label}
              {cat.id === 'all' && (
                <span className="text-[10px] opacity-80 font-mono">
                  ({eventsList.length})
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Spotlight Event (Thanganat 5.0) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="bg-white border border-[#e8e5dc] rounded-3xl overflow-hidden shadow-card-elevated hover:shadow-card-3d transition-all grid grid-cols-1 lg:grid-cols-12">
          
          {/* Visual Column */}
          <div className="lg:col-span-6 relative min-h-[300px] bg-gradient-to-br from-amber-700 via-amber-900 to-black p-6 sm:p-8 flex flex-col justify-between text-white overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                Ongoing Right Now
              </span>
              <button
                onClick={(e) => handleWishlistClick(e, 'thanganat-5', 'Thanganat 5.0')}
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

            <div className="relative z-10 my-auto py-6">
              <div className="text-[11px] font-bold tracking-widest text-[#fed65b] uppercase mb-1">
                Day 2 of 3 • Navratri Mahotsav
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-wide">
                Thanganat 5.0 — Live Garba Celebration
              </h2>
              <p className="text-amber-100/90 text-xs sm:text-sm mt-2 max-w-lg leading-relaxed">
                Experience thunderous beats of Dhol, traditional Dodhiya, and folk performances under the stars with 3,500+ student dancers.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3 text-xs text-amber-200">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                New Cricket Ground, Kalol
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                07:00 PM - 12:00 AM
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-[#b8860b] font-bold uppercase tracking-wider">
                <span>Fast-Pass Verification Active</span>
                <span className="text-[#15803d]">Turnstile Lane B Live</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#fbfbf9] rounded-2xl border border-[#e8e5dc]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#62626e] block">
                    Wristband Pickup
                  </span>
                  <span className="font-bold text-[#111116]">
                    Registration Booth #2
                  </span>
                </div>

                <div className="p-3 bg-[#fbfbf9] rounded-2xl border border-[#e8e5dc]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#62626e] block">
                    Food & Stalls
                  </span>
                  <span className="font-bold text-[#111116]">
                    32 Refreshment Stalls
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('details')}
                className="bg-gold-gradient text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center gap-1.5"
              >
                <span>View Full Details & Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onOpenClaimModal(CAMPUS_EVENTS[0])}
                className="bg-white border border-[#e8e5dc] text-[#111116] px-4 py-2.5 rounded-full text-xs font-bold tracking-wider hover:border-[#b8860b] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Ticket className="w-3.5 h-3.5 text-[#b8860b]" />
                Claim Gate Pass
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Upcoming University Gatherings Grid */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 my-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#b8860b] block mb-1">
              Mark Your Calendars
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111116]">
              Upcoming <span className="font-serif italic font-normal text-[#b8860b]">University Gatherings</span>
            </h2>
          </div>
          <span className="text-xs text-[#62626e]">
            Showing {filteredEvents.length} events
          </span>
        </div>

        {/* Dynamic Card Grid with 3D Depth & Wishlist Hearts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((evt) => {
            const isSaved = wishlistIds.includes(evt.id);
            const isRsvpd = rsvpState[evt.id];
            const attendeeCount = evt.attendees + (isRsvpd ? 1 : 0);

            return (
              <div
                key={evt.id}
                onClick={() => {
                  onSelectEvent(evt);
                  if (evt.id === 'thanganat-5') onNavigate('details');
                  else onOpenClaimModal(evt);
                }}
                className="group cursor-pointer bg-white border border-[#e8e5dc] rounded-3xl overflow-hidden shadow-card-elevated hover:shadow-card-3d hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Graphic Strip */}
                  <div className={`h-40 ${evt.bannerImage ? 'relative' : `bg-gradient-to-br ${evt.gradient}`} p-4 flex flex-col justify-between text-white relative overflow-hidden`}>
                    {evt.bannerImage && (
                      <>
                        <img src={evt.bannerImage} alt={evt.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
                      </>
                    )}
                    <div className="flex justify-between items-start z-10">
                      <div className="bg-white text-[#111116] px-2.5 py-1.5 rounded-xl text-center font-bold text-xs shadow-sm">
                        <span className="block text-[10px] uppercase tracking-wider text-[#b8860b] leading-tight">
                          {evt.shortDate.month}
                        </span>
                        <span className="block text-base leading-none tabular-nums font-bold">
                          {evt.shortDate.day}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-white/20">
                          {evt.categoryLabel}
                        </span>
                        <button
                          onClick={(e) => handleWishlistClick(e, evt.id, evt.title)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                            isSaved
                              ? 'bg-rose-500 text-white'
                              : 'bg-black/30 text-white hover:text-rose-400'
                          }`}
                          title={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="text-white/90 text-xs font-medium flex items-center gap-1.5 z-10">
                      <Clock className="w-3.5 h-3.5 text-amber-300" />
                      <span>{evt.dateStr}</span>
                    </div>

                    {/* Subtle aesthetic glow */}
                    <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full bg-white/10 blur-xl pointer-events-none" />
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-serif text-xl font-bold text-[#111116] group-hover:text-[#b8860b] transition-colors leading-snug">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-[#62626e] line-clamp-2 leading-relaxed">
                      {evt.summary}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[#2d2d34]">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#15803d] font-semibold">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        <span>{attendeeCount} scholars attending</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-5 pt-3 border-t border-[#f4f3ef] flex items-center justify-between text-xs">
                  <button
                    onClick={(e) => handleToggleRsvp(e, evt)}
                    className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 text-xs ${
                      isRsvpd
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-[#f4f3ef] text-[#2d2d34] hover:bg-[#e8e5dc]'
                    }`}
                  >
                    {isRsvpd ? <Check className="w-3 h-3 text-emerald-600" /> : <Ticket className="w-3 h-3 text-[#b8860b]" />}
                    {isRsvpd ? 'RSVP Confirmed' : 'RSVP Free'}
                  </button>

                  <span className="font-bold text-[#b8860b] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Claim Pass & Details →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Concluded Campus Events Archive */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 my-14">
        <div className="border-t border-[#e8e5dc] pt-12">
          <div className="mb-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#888894]">Campus History & Archives</span>
            <h2 className="font-serif text-2xl font-bold text-[#111116] mt-1">Concluded Past Highlights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONCLUDED_EVENTS.map((c) => (
              <div key={c.id} className="p-5 rounded-2xl bg-white border border-[#e8e5dc] shadow-sm space-y-2">
                <span className="text-[10px] font-mono text-[#b8860b] font-bold">{c.dateLabel}</span>
                <h4 className="font-bold text-sm text-[#111116]">{c.title}</h4>
                <p className="text-xs text-[#62626e] leading-relaxed">{c.desc}</p>
                <div className="pt-2 text-[11px] font-semibold text-[#15803d] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{c.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
