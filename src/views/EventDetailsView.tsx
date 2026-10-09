import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, Users, Ticket, ShieldCheck, Heart, 
  Share2, ArrowLeft, Star, CheckCircle, Play, Sparkles, AlertCircle, 
  Coffee, Droplet, PlusCircle, Lock, Search, Car, ExternalLink, HelpCircle
} from 'lucide-react';
import { EventItem, UserProfile } from '../data/eventsData';

interface EventDetailsViewProps {
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'login' | 'wishlist') => void;
  onOpenClaimModal: (event: EventItem) => void;
  onOpenUpiPayment?: (event: EventItem) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (eventId: string) => void;
  userProfile?: UserProfile;
}

export const EventDetailsView: React.FC<EventDetailsViewProps> = ({
  onNavigate,
  onOpenClaimModal,
  onOpenUpiPayment,
  wishlistIds = [],
  onToggleWishlist,
  userProfile,
}) => {
  const isBookmarked = wishlistIds.includes('thanganat-5');
  const [activeSection, setActiveSection] = useState('about');
  const [starRating, setStarRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [contestModal, setContestModal] = useState<string | null>(null);
  const [contestSuccess, setContestSuccess] = useState(false);

  const mockEvent: EventItem = {
    id: 'thanganat-5',
    title: 'Thanganat 5.0 — Live Garba Celebration',
    category: 'cultural',
    categoryLabel: 'Cultural & Arts',
    dateStr: 'Wed, Oct 4 • 7:00 PM - 12:00 AM',
    shortDate: { month: 'OCT', day: '04' },
    time: '7:00 PM - 12:00 AM',
    venue: 'New Cricket Ground, SU Campus (Kalol)',
    summary: 'Grand Traditional Campus Garba & Dandiya Night under the Kalol night sky.',
    attendees: 2450,
    gradient: 'from-amber-700 to-amber-950',
    iconName: 'Sparkles',
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSubmitted(false);
    }, 3500);
  };

  return (
    <main className="min-h-screen bg-[#fbfbf9] text-[#111116] pb-20">
      
      {/* 1. Breadcrumbs & Badges */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-xs text-[#62626e] mb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-[#b8860b]">Home</button>
          <span>/</span>
          <button onClick={() => onNavigate('explore')} className="hover:text-[#b8860b]">Explore</button>
          <span>/</span>
          <span className="text-[#111116] font-semibold">Thanganat 5.0</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-wider text-[#b8860b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b]"></span>
              Cultural Mega Gala • Navratri 2025
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-[#15803d] border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              Accredited Event
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist?.('thanganat-5')}
              aria-label="Save to Wishlist"
              className={`p-2 rounded-full border transition-colors ${
                isBookmarked 
                  ? 'bg-rose-50 border-rose-300 text-rose-600' 
                  : 'bg-white border-[#e8e5dc] text-[#62626e] hover:border-[#b8860b]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => alert('Event URL copied to clipboard for sharing!')}
              aria-label="Share Event"
              className="p-2 rounded-full border border-[#e8e5dc] bg-white text-[#62626e] hover:border-[#b8860b] hover:text-[#b8860b] transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Title & Pitch */}
        <div className="space-y-3 max-w-4xl">
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111116] leading-tight">
            Thanganat <span className="font-serif italic font-normal text-[#b8860b]">5.0</span>
          </h1>
          <p className="font-serif text-lg sm:text-xl text-[#7b5800] italic font-medium">
            The Official Campus Navratri & Dandiya Utsav of Swaminarayan University
          </p>
          <p className="text-sm sm:text-base text-[#62626e] leading-relaxed max-w-3xl">
            Immerse yourself in six pulsating hours of traditional rhythm, resonant dhol beats, and luminous heritage under the Kalol night sky. Celebrating communal harmony and youthful brilliance with over 3,500 peers.
          </p>
        </div>

        {/* 4 Meta Stat Boxes */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-8">
          <div className="bg-white border border-[#e8e5dc] p-3.5 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#62626e] flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-[#b8860b]" /> Date & Time
            </span>
            <div className="font-bold text-xs sm:text-sm text-[#111116]">Wed, 4th Oct</div>
            <div className="text-[11px] text-[#62626e]">7:00 PM – 12:00 AM</div>
          </div>

          <div className="bg-white border border-[#e8e5dc] p-3.5 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#62626e] flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-[#b8860b]" /> Venue
            </span>
            <div className="font-bold text-xs sm:text-sm text-[#111116]">New Cricket Ground</div>
            <div className="text-[11px] text-[#62626e]">Kalol Main Campus</div>
          </div>

          <div className="bg-white border border-[#e8e5dc] p-3.5 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#62626e] flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-[#b8860b]" /> Turnout
            </span>
            <div className="font-bold text-xs sm:text-sm text-[#111116] tabular-nums">3,500+ Attendees</div>
            <div className="text-[11px] text-[#62626e]">Students & Faculty</div>
          </div>

          <div className="bg-white border border-[#e8e5dc] p-3.5 rounded-xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#62626e] flex items-center gap-1.5 mb-1">
              <Ticket className="w-3.5 h-3.5 text-[#b8860b]" /> Access
            </span>
            <div className="font-bold text-xs sm:text-sm text-[#15803d]">Free Admission</div>
            <div className="text-[11px] text-[#62626e]">Valid SU ID Mandatory</div>
          </div>
        </div>

        {/* Primary Action Buttons Bar */}
        <div className="flex flex-wrap items-center gap-3 pb-8 border-b border-[#e8e5dc]">
          <button
            onClick={() => onOpenClaimModal(mockEvent)}
            className="bg-gold-gradient text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center gap-2"
          >
            <Ticket className="w-4 h-4" />
            Get Entry Pass / RSVP Now
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('volunteer-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-white border border-[#e8e5dc] text-[#111116] px-5 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wider hover:border-[#b8860b] transition-colors"
          >
            Volunteer / Contribute
          </button>
        </div>
      </div>

      {/* 2. Sticky Subnav Bar */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-[#e8e5dc] py-2.5 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: 'about', label: 'About & Guidelines' },
            { id: 'media', label: 'Media Gallery' },
            { id: 'competitions', label: 'Competitions' },
            { id: 'amenities', label: 'Amenities & Food' },
            { id: 'guests', label: 'Guests & Team' },
            { id: 'volunteer-section', label: 'Volunteer Call' },
            { id: 'voice', label: 'Student Voice' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSection(tab.id);
                document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors ${
                activeSection === tab.id
                  ? 'bg-[#111116] text-white'
                  : 'text-[#62626e] hover:text-[#111116] hover:bg-[#f4f3ef]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Content Grid (Two Columns: 68% / 32%) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Section: About & Guidelines */}
          <section id="about" className="space-y-6 scroll-mt-36">
            <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-[#111116] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#b8860b]" />
                About Thanganat 5.0
              </h2>

              <p className="text-sm text-[#2d2d34] leading-relaxed">
                Swaminarayan University’s marquee Navratri congregation returns in its fifth iteration, bigger and more dazzling than ever. Hosted on the expansive New Cricket Ground, <strong className="text-[#b8860b]">Thanganat 5.0</strong> bridges timeless Gujarati folklore with contemporary campus camaraderie. Whether you are stepping into the Dodhiya circle for the first time or competing for the coveted University Raas Shield, the evening guarantees thunderous celebration and collective memory.
              </p>

              {/* Dress Code & Flow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#fbfbf9] p-4 rounded-xl border border-[#e8e5dc] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111116]">
                    Dress Code Standards
                  </h4>
                  <p className="text-xs text-[#62626e]">
                    Authentic traditional attire is mandatory for arena entry.
                  </p>
                  <ul className="text-xs text-[#2d2d34] space-y-1 pt-1">
                    <li>• <strong>Gentlemen:</strong> Kedia, Kurta Pyjama, or Dhoti Kurta</li>
                    <li>• <strong>Ladies:</strong> Chaniya Choli or Bandhani Sarees</li>
                    <li className="text-[#b8860b] font-medium text-[11px] pt-1">
                      ⚠️ Western wear & casual footwear restricted inside the inner circle.
                    </li>
                  </ul>
                </div>

                <div className="bg-[#fbfbf9] p-4 rounded-xl border border-[#e8e5dc] space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#111116]">
                    Running Program Flow
                  </h4>
                  <ul className="text-xs text-[#2d2d34] space-y-1.5 font-mono">
                    <li><span className="font-bold text-[#b8860b]">06:30 PM:</span> Gates Open & Security Validation</li>
                    <li><span className="font-bold text-[#b8860b]">07:15 PM:</span> Maha Aarti with Chancellor</li>
                    <li><span className="font-bold text-[#b8860b]">08:00 PM:</span> Traditional Garba & Dodhiya</li>
                    <li><span className="font-bold text-[#b8860b]">10:45 PM:</span> Jury Judging & Awards</li>
                    <li><span className="font-bold text-[#b8860b]">11:15 PM:</span> Sanedo & Youth Finale</li>
                  </ul>
                </div>
              </div>

              {/* Safety Policy */}
              <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-start gap-3 text-xs text-[#2d2d34]">
                <ShieldCheck className="w-5 h-5 text-[#b8860b] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#111116] block">
                    Safety, Conduct & Zero-Tolerance Policy
                  </span>
                  <span>
                    Every attendee must present an unexpired Swaminarayan University physical/digital ID card alongside their EventHive QR Pass. Metal detection, mandatory bag scans, and internal CCTV surveillance are active across the perimeter.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Memories & Teaser Reel */}
          <section id="media" className="space-y-4 scroll-mt-36">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b]">
                  Snapshots & Videos
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#111116]">
                  Memories & Teaser Reel
                </h2>
              </div>
              <button 
                onClick={() => alert('Upload portal opens during the live festival!')}
                className="text-xs font-bold text-[#b8860b] hover:underline"
              >
                + Contribute Media
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { title: 'Official Teaser (2:14)', bg: 'from-amber-800 to-black', sub: 'High energy anthem' },
                { title: 'Dandiya Sync Round', bg: 'from-rose-900 to-neutral-900', sub: 'Dodhiya circles' },
                { title: 'Maha Aarti Ceremony', bg: 'from-yellow-900 to-neutral-950', sub: 'Luminous lamp view' },
                { title: 'Winners Podium 2024', bg: 'from-blue-900 to-black', sub: 'Trophy celebrations' },
                { title: 'Food Plaza Arena', bg: 'from-emerald-900 to-stone-900', sub: '32 food kiosks' },
                { title: 'Dhol Beats Soundcheck', bg: 'from-purple-900 to-black', sub: 'Live acoustic set' },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className={`h-36 bg-gradient-to-br ${m.bg} rounded-xl p-3 flex flex-col justify-between text-white relative group cursor-pointer overflow-hidden border border-white/10`}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mx-auto my-auto group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold truncate">{m.title}</p>
                    <p className="text-[10px] text-white/70">{m.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Gala Competitions & Cash Prizes */}
          <section id="competitions" className="space-y-4 scroll-mt-36">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b]">
                Judged by state folk exponents • Total Prize Pool: ₹75,000
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#111116]">
                Gala Competitions & Cash Prizes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#e8e5dc] rounded-xl p-5 space-y-3 shadow-sm hover:border-[#b8860b] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#62626e]">Individual & Duo</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7b5800] tabular-nums">
                    ₹25,000 Pool
                  </span>
                </div>
                <h4 className="font-serif font-bold text-lg text-[#111116]">
                  Best Raas Dancer (Male / Female)
                </h4>
                <p className="text-xs text-[#62626e] leading-relaxed">
                  Evaluated on footwork complexity, rhythm synchronization, stamina, authentic step forms, and stage expression.
                </p>
                <button
                  onClick={() => { setContestModal('Best Raas Dancer'); setContestSuccess(false); }}
                  className="w-full border border-[#e8e5dc] text-[#111116] py-2 rounded-lg text-xs font-bold hover:border-[#b8860b] hover:text-[#b8860b] transition-colors"
                >
                  Register for Dance Contest →
                </button>
              </div>

              <div className="bg-white border border-[#e8e5dc] rounded-xl p-5 space-y-3 shadow-sm hover:border-[#b8860b] transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#62626e]">Open Category</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-[#7b5800] tabular-nums">
                    ₹20,000 Pool
                  </span>
                </div>
                <h4 className="font-serif font-bold text-lg text-[#111116]">
                  Best Traditional Attire & Styling
                </h4>
                <p className="text-xs text-[#62626e] leading-relaxed">
                  Evaluated on historical authenticity, handloom embroidery, jewellery coordination, and ethnic poise.
                </p>
                <button
                  onClick={() => { setContestModal('Best Traditional Attire'); setContestSuccess(false); }}
                  className="w-full border border-[#e8e5dc] text-[#111116] py-2 rounded-lg text-xs font-bold hover:border-[#b8860b] hover:text-[#b8860b] transition-colors"
                >
                  Register for Dress Contest →
                </button>
              </div>
            </div>
          </section>

          {/* Section: Included Campus Amenities */}
          <section id="amenities" className="space-y-4 scroll-mt-36">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b]">
                Every valid SU pass unlocks comprehensive hospitality perks
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#111116]">
                Included Campus Amenities
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { title: 'Food Court Coupons', desc: '₹100 token included for authentic snacks and Jalebi-Fafda.', icon: Coffee },
                { title: 'Unlimited Hydration', desc: '8 water dispenser stations with mineral water & electro-mix.', icon: Droplet },
                { title: 'Medical Desk', desc: 'SU Ayurvedic & Allopathic paramedical team stationed on-site.', icon: PlusCircle },
                { title: 'Secured Cloakroom', desc: 'Token-based locker counter to safely store bags & valuables.', icon: Lock },
                { title: 'Lost & Found Booth', desc: 'Real-time digital registration booth for displaced keys.', icon: Search },
                { title: 'Campus Parking', desc: 'Designated zones for two-wheelers & registered vehicles.', icon: Car },
              ].map((amenity, i) => (
                <div key={i} className="bg-white border border-[#e8e5dc] p-4 rounded-xl space-y-1.5 shadow-sm">
                  <amenity.icon className="w-5 h-5 text-[#b8860b]" />
                  <h4 className="font-bold text-xs sm:text-sm text-[#111116]">{amenity.title}</h4>
                  <p className="text-[11px] text-[#62626e] leading-snug">{amenity.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Organizers & Dignitaries */}
          <section id="guests" className="space-y-4 scroll-mt-36">
            <h2 className="font-serif text-2xl font-bold text-[#111116]">
              Organizers & Dignitaries
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#e8e5dc] p-4 rounded-xl flex items-center gap-3 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-[#7b5800] font-bold text-base flex items-center justify-center shrink-0">
                  NG
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#111116]">Shri Nilesh Gadhavi</h4>
                  <p className="text-xs text-[#b8860b] font-medium">State Folk Laureate & Vocalist</p>
                  <p className="text-[11px] text-[#62626e]">Presiding as Chief Adjudicator for Raas</p>
                </div>
              </div>

              <div className="bg-white border border-[#e8e5dc] p-4 rounded-xl flex items-center gap-3 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-[#7b5800] font-bold text-base flex items-center justify-center shrink-0">
                  SH
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#111116]">The Saurashtra Heritage Troupe</h4>
                  <p className="text-xs text-[#b8860b] font-medium">Live Dhol & Shehnai Maestros</p>
                  <p className="text-[11px] text-[#62626e]">Leading the 100-beat grand crescendo</p>
                </div>
              </div>
            </div>

            {/* Directorate Notice */}
            <div className="p-4 bg-[#fbfbf9] border border-[#e8e5dc] rounded-xl text-xs text-[#62626e] space-y-1">
              <p className="font-bold text-[#111116]">Student Cultural Directorate</p>
              <p>Dr. R.K. Patel (Dean, Student Affairs) • Prof. Neha Sharma (Faculty Coordinator) • Aarav Mehta (Student Council Secretary)</p>
            </div>
          </section>

          {/* Section: Event Patrons & Partners */}
          <section className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b] block">
              Event Patrons & Official Partners
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Gujarat Gas', role: 'Gold Sponsor' },
                { name: 'Amul Dairy', role: 'Refreshment Partner' },
                { name: 'Radio Mirchi 98.3', role: 'Campus Media Voice' },
                { name: 'SU Medical Trust', role: 'Health & First Aid' },
              ].map((p, i) => (
                <div key={i} className="p-3 bg-white border border-[#e8e5dc] rounded-xl text-center shadow-sm">
                  <div className="font-bold text-xs text-[#111116]">{p.name}</div>
                  <div className="text-[10px] text-[#b8860b] uppercase font-semibold">{p.role}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Volunteer Callout Banner */}
          <section id="volunteer-section" className="bg-gradient-to-r from-amber-900 to-neutral-900 text-white rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                Join the Backstage Crew
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold">
                Be Part of the Thanganat Organizing Force
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-xl">
                Gain vital campus leadership credits, an official University organizing commendation certificate, and guaranteed VIP gala access.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/15">
                <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-mono">Role 01</span>
                <span className="font-bold">Crowd & Gate Control</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/15">
                <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-mono">Role 02</span>
                <span className="font-bold">Stage & Artist Liaison</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/15">
                <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-mono">Role 03</span>
                <span className="font-bold">Media & Reel Team</span>
              </div>
              <div className="bg-white/10 p-2.5 rounded-lg border border-white/15">
                <span className="text-[9px] uppercase tracking-wider text-amber-300 block font-mono">Role 04</span>
                <span className="font-bold">Hospitality Logistics</span>
              </div>
            </div>

            <button
              onClick={() => alert('Volunteer application submitted! Check your SU email for interview slot.')}
              className="bg-gold-gradient text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 shadow-sm"
            >
              Apply as Volunteer
            </button>
          </section>

          {/* Section: Student Voice & Insights Form */}
          <section id="voice" className="bg-white border border-[#e8e5dc] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm scroll-mt-36">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#b8860b]">
                Student Voice & Insights
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#111116]">
                Help the cultural committee elevate future campus celebrations
              </h2>
            </div>

            <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-[#111116] block mb-1.5">
                  Overall Festival Anticipation & Organization Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= starRating ? 'text-[#b8860b] fill-[#b8860b]' : 'text-[#e8e5dc]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#b8860b] ml-2">
                    {starRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#111116] block mb-1.5">
                  What can we improve or add next time?
                </label>
                <textarea
                  required
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="More traditional snack options, extra changing tents, or specific artist suggestions..."
                  className="w-full p-3 text-xs sm:text-sm border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                />
              </div>

              <div className="flex items-center justify-between">
                {feedbackSubmitted ? (
                  <span className="text-xs font-bold text-[#15803d] flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Thank you for your feedback!
                  </span>
                ) : <div></div>}

                <button
                  type="submit"
                  className="bg-gold-gradient text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Sticky Pass Widget & Venue Locator (32%) */}
        <div className="lg:col-span-4 sticky top-36 space-y-6">
          
          {/* Main Fast Track Pass Box */}
          <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 space-y-5 shadow-card-elevated">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[10px] uppercase tracking-wider bg-amber-50 text-[#b8860b] px-2.5 py-0.5 rounded-full border border-[#d4af37]/30">
                Fast Track Pass
              </span>
              <span className="font-bold text-[#15803d] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#15803d] animate-pulse"></span>
                780 Spots Left
              </span>
            </div>

            <div>
              <div className="font-serif text-3xl font-bold text-[#b8860b] flex items-baseline gap-1.5">
                FREE <span className="text-xs font-sans text-[#62626e] font-normal">/ for Swaminarayan Univ Students</span>
              </div>
              <p className="text-xs text-[#62626e] mt-1">
                Includes gate pass, refreshments, and eligibility for all trophies.
              </p>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-[#111116]">
                <span>Ground Capacity Booked</span>
                <span className="tabular-nums font-bold">78%</span>
              </div>
              <div className="w-full bg-[#f4f3ef] h-2 rounded-full overflow-hidden">
                <div className="bg-gold-gradient h-full rounded-full w-[78%]"></div>
              </div>
            </div>

            {/* Dual Pass Options: Free Student Pass & VIP UPI QR Pass */}
            <div className="space-y-2.5">
              <button
                onClick={() => onOpenClaimModal(mockEvent)}
                className="w-full bg-[#111116] text-white py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#22222c] transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                Claim Free University Pass
              </button>

              <button
                onClick={() => onOpenUpiPayment ? onOpenUpiPayment(mockEvent) : onOpenClaimModal(mockEvent)}
                className="w-full bg-gold-gradient text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Book VIP Pass via UPI QR (₹199)
              </button>
            </div>

            {/* Verification Promises */}
            <div className="space-y-2 pt-2 text-xs text-[#2d2d34]">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                <span>Physical SU Student ID card required</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                <span>1 guest pass permitted per enrollment</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#15803d] shrink-0 mt-0.5" />
                <span>Live streaming for campus alumni via portal</span>
              </div>
            </div>
          </div>

          {/* Campus Location Card */}
          <div className="bg-white border border-[#e8e5dc] rounded-2xl p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111116]">Campus Location</span>
              <span className="text-[10px] text-[#b8860b] font-bold">Gate 02 & 03 Entry</span>
            </div>

            {/* Visual map thumbnail */}
            <div className="h-28 bg-[#f4f3ef] border border-[#e8e5dc] rounded-xl p-3 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#111116_1px,transparent_1px)] [background-size:8px_8px]"></div>
              <div className="relative z-10 bg-white/90 backdrop-blur-sm text-[11px] font-bold px-2 py-1 rounded inline-flex items-center gap-1.5 shadow-sm text-[#111116] w-fit">
                <MapPin className="w-3.5 h-3.5 text-[#b8860b]" />
                New Cricket Ground Arena
              </div>
              <div className="relative z-10 text-[10px] text-[#62626e]">
                Kalol, Dist. Gandhinagar
              </div>
            </div>

            <button
              onClick={() => window.open('https://maps.google.com', '_blank')}
              className="w-full text-center text-xs font-bold text-[#b8860b] hover:underline flex items-center justify-center gap-1 pt-1"
            >
              Open Navigation <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* Need Help Box */}
          <div className="p-4 bg-[#fbfbf9] border border-[#e8e5dc] rounded-2xl flex items-center gap-3 text-xs">
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-[#b8860b] shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-[#111116]">Need Help with RSVP?</p>
              <p className="text-[#62626e]">Contact SU Helpdesk: +91 79 2396 9000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contest Registration Modal */}
      {contestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#e8e5dc] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold text-[#111116]">
              Register for {contestModal}
            </h3>
            <p className="text-xs text-[#62626e]">
              Enter your student details to register with the Thanganat cultural jury board.
            </p>

            {!contestSuccess ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContestSuccess(true);
                  setTimeout(() => setContestModal(null), 2500);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-xs font-semibold text-[#111116]">Participant Name</label>
                  <input required defaultValue={userProfile?.name || 'Shivam Tripathi'} className="w-full p-2 text-xs border border-[#e8e5dc] rounded-lg mt-1 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#111116]">SU Enrollment Number</label>
                  <input required defaultValue={userProfile?.rollNumber || 'SU202204192'} className="w-full p-2 text-xs border border-[#e8e5dc] rounded-lg mt-1 outline-none font-mono" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#111116]">Contact Number</label>
                  <input required placeholder="+91 98765 43210" className="w-full p-2 text-xs border border-[#e8e5dc] rounded-lg mt-1 outline-none" />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setContestModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#62626e]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-gold-gradient text-white px-5 py-2 text-xs font-bold uppercase rounded-lg shadow-sm"
                  >
                    Confirm Registration
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-2">
                <CheckCircle className="w-10 h-10 text-[#15803d] mx-auto" />
                <p className="text-sm font-bold text-[#111116]">Registration Confirmed!</p>
                <p className="text-xs text-[#62626e]">Jury bib number will be assigned at Gate 02 registration desk.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
