import React from 'react';
import { 
  Bookmark, Heart, Calendar, Clock, MapPin, Users, 
  ArrowRight, Ticket, Sparkles, Trash2, ArrowLeft 
} from 'lucide-react';
import { EventItem } from '../data/eventsData';

interface WishlistViewProps {
  wishlistEvents: EventItem[];
  onToggleWishlist: (eventId: string) => void;
  onSelectEvent: (event: EventItem) => void;
  onOpenClaimModal: (event: EventItem) => void;
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'wishlist') => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlistEvents,
  onToggleWishlist,
  onSelectEvent,
  onOpenClaimModal,
  onNavigate,
}) => {
  return (
    <main className="min-h-screen bg-[#fbfbf9] text-[#111116] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e5dc] pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-[10px] font-bold uppercase tracking-wider text-rose-700">
              <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              Saved Campus Gatherings
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111116]">
              My Wishlist <span className="font-serif italic text-[#b8860b]">({wishlistEvents.length} Saved)</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#62626e]">
              Bookmarked festivals, hackathons, and symposiums you intend to attend. Claim digital entry passes before seats run out.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('explore')}
              className="px-4 py-2 rounded-full border border-[#e8e5dc] bg-white text-xs font-semibold text-[#111116] hover:border-[#b8860b] flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
              Discover More Events
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        {wishlistEvents.length === 0 ? (
          <div className="bg-white border border-[#e8e5dc] rounded-3xl p-12 text-center space-y-4 shadow-sm max-w-md mx-auto my-12">
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-500 mx-auto flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#111116]">
              Your Wishlist is Empty
            </h3>
            <p className="text-xs text-[#62626e] max-w-xs mx-auto">
              You haven't saved any events yet. Click the heart icon on any campus event card to bookmark it for later.
            </p>
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-2.5 rounded-full bg-gold-gradient text-white text-xs font-bold shadow-gold-glow hover:opacity-95 transition-all"
            >
              Browse Campus Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white border border-[#e8e5dc] rounded-3xl overflow-hidden shadow-card-elevated hover:shadow-card-3d hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Event Card Header with Gradient */}
                <div className={`h-36 ${evt.bannerImage ? 'relative' : `bg-gradient-to-br ${evt.gradient}`} p-5 flex flex-col justify-between relative overflow-hidden`}>
                  {evt.bannerImage && (
                    <>
                      <img src={evt.bannerImage} alt={evt.title} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
                    </>
                  )}
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[#fed65b] border border-white/20">
                      {evt.categoryLabel}
                    </span>
                    <button
                      onClick={() => onToggleWishlist(evt.id)}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-md text-rose-400 hover:text-white hover:bg-rose-600 transition-colors"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-white z-10">
                    <span className="text-xs font-mono font-bold text-amber-200 block">
                      {evt.dateStr}
                    </span>
                  </div>

                  {/* Aesthetic geometric watermark */}
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
                </div>

                {/* Event Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#111116] group-hover:text-[#b8860b] transition-colors leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#62626e] mt-1 line-clamp-2">
                      {evt.summary}
                    </p>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#62626e] pt-2 border-t border-[#f4f3ef]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                      <span className="truncate">{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#b8860b] shrink-0" />
                      <span>{evt.attendees.toLocaleString()}+ Scholars Attending</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        onSelectEvent(evt);
                        onNavigate('details');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl border border-[#e8e5dc] text-xs font-semibold text-[#111116] hover:bg-[#f4f3ef] transition-colors text-center"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onOpenClaimModal(evt)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gold-gradient text-white text-xs font-bold shadow-sm hover:opacity-95 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      Claim Pass
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};
