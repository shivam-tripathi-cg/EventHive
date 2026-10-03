import React, { useState } from 'react';
import { Mail, Check, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'login' | 'wishlist') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="bg-[#f6f4ee] border-t border-[#e8e5dc] mt-20 pt-16 pb-12 text-[#2d2d34]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-[#e8e5dc]">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-[#111116]">
                eventhive<span className="text-[#d4af37]">.in</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-[#b8860b]">
                Swaminarayan University
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#62626e] leading-relaxed">
              The official cultural and academic event gateway for Swaminarayan University. Discover symposiums, hackathons, and galas in one luminous collective.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#15803d]">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Institutional Gateway • Kalol Campus</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold uppercase tracking-wider text-[#111116]">
              Quick Shortcuts
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#b8860b] transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#b8860b] transition-colors text-left"
                >
                  Explore Events
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('passes')}
                  className="hover:text-[#b8860b] transition-colors text-left"
                >
                  My Passes & Bookings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('wishlist')}
                  className="hover:text-[#b8860b] transition-colors text-left"
                >
                  Wishlist Saved
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('profile')}
                  className="hover:text-[#b8860b] transition-colors text-left"
                >
                  Scholar Profile & ID
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Headquarters */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold uppercase tracking-wider text-[#111116]">
              Campus Headquarters
            </h4>
            <div className="space-y-2.5 text-sm text-[#62626e] leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#b8860b] shrink-0 mt-0.5" />
                <p>
                  Swaminarayan University Campus,<br />
                  Ahmedabad-Mehsana Highway, At & Po. Saij,<br />
                  Kalol, Dist. Gandhinagar,<br />
                  Gujarat – 382721
                </p>
              </div>
              <p className="pt-1">
                <a 
                  href="mailto:events@swaminarayanuniversity.ac.in" 
                  className="text-[#b8860b] hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  events@swaminarayanuniversity.ac.in
                </a>
              </p>
            </div>
          </div>

          {/* Stay Informed */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold uppercase tracking-wider text-[#111116]">
              Stay Informed
            </h4>
            <p className="text-sm text-[#62626e]">
              Receive exclusive ticket invitations and gala notifications directly to your university inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center rounded-lg border border-[#e8e5dc] bg-white overflow-hidden focus-within:border-[#b8860b] transition-colors">
                <input
                  type="email"
                  required
                  placeholder="university email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm text-[#111116] outline-none placeholder:text-[#62626e]"
                />
                <button
                  type="submit"
                  className="bg-gold-gradient text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-95 transition-opacity flex items-center gap-1"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : 'Join'}
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-[#15803d] font-semibold animate-in fade-in">
                  ✓ Subscribed! You will receive campus bulletins.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#62626e] gap-4">
          <p>© 2025 Swaminarayan University (Kalol). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-[#111116] transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-[#111116] transition-colors">Terms of Service</a>
            <a href="#help" className="hover:text-[#111116] transition-colors">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
