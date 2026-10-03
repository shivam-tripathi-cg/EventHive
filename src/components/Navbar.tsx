import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Bell, User, Menu, X, Calendar, Ticket, 
  Compass, Home, Bookmark, Settings, MessageSquare, 
  Moon, Sun, LogOut, LogIn, ChevronDown, ShieldCheck, Heart 
} from 'lucide-react';
import { UserProfile } from '../data/eventsData';

interface NavbarProps {
  activeView: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'login' | 'wishlist';
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'login' | 'wishlist') => void;
  activePassCount: number;
  wishlistCount: number;
  userProfile: UserProfile;
  onLogout: () => void;
  onOpenFeedback: () => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  activePassCount,
  wishlistCount,
  userProfile,
  onLogout,
  onOpenFeedback,
  onOpenSettings,
  theme,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationToast(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'login' | 'wishlist') => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-[#e8e5dc]/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.04)] transition-all">
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Zone 1: University Brand Mark */}
        <div 
          onClick={() => handleNavClick('home')}
          className="cursor-pointer group flex flex-col justify-center"
        >
          <div className="flex items-center gap-1">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#111116] group-hover:text-[#b8860b] transition-colors">
              eventhive<span className="text-[#d4af37]">.in</span>
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.14em] text-[#b8860b]">
            Swaminarayan University
          </span>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2.5">
          <button
            onClick={() => handleNavClick('home')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              activeView === 'home'
                ? 'bg-[#111116] text-[#ffffff] shadow-sm'
                : 'text-[#2d2d34] hover:text-[#b8860b] hover:bg-[#f4f3ef]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>

          <button
            onClick={() => handleNavClick('explore')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              activeView === 'explore'
                ? 'bg-[#111116] text-[#ffffff] shadow-sm'
                : 'text-[#2d2d34] hover:text-[#b8860b] hover:bg-[#f4f3ef]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Explore
          </button>

          <button
            onClick={() => handleNavClick('details')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              activeView === 'details'
                ? 'bg-[#111116] text-[#ffffff] shadow-sm'
                : 'text-[#2d2d34] hover:text-[#b8860b] hover:bg-[#f4f3ef]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Thanganat 5.0
          </button>

          <button
            onClick={() => handleNavClick('passes')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-1.5 relative ${
              activeView === 'passes'
                ? 'bg-gold-gradient text-[#ffffff] shadow-gold-glow'
                : 'text-[#2d2d34] hover:text-[#b8860b] hover:bg-[#f4f3ef]'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            My Passes
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
              activeView === 'passes' ? 'bg-[#ffffff] text-[#b8860b]' : 'bg-[#d4af37]/20 text-[#b8860b]'
            }`}>
              {activePassCount}
            </span>
          </button>

          <button
            onClick={() => handleNavClick('wishlist')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-1.5 ${
              activeView === 'wishlist'
                ? 'bg-[#111116] text-[#ffffff] shadow-sm'
                : 'text-[#62626e] hover:text-[#b8860b] hover:bg-[#f4f3ef]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Wishlist
            {wishlistCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700">
                {wishlistCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Utility Controls & User Profile / Login */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Quick Search */}
          <button
            onClick={() => handleNavClick('explore')}
            aria-label="Search events"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#e8e5dc] flex items-center justify-center text-[#2d2d34] hover:border-[#b8860b] hover:text-[#b8860b] hover:bg-[#fbfbf9] transition-colors"
            title="Search Campus Events"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Quick Theme Toggle Button (Light / Dark) */}
          <button
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#e8e5dc] flex items-center justify-center text-[#2d2d34] hover:border-[#b8860b] hover:text-[#b8860b] hover:bg-[#fbfbf9] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#fed65b]" />
            ) : (
              <Moon className="w-4 h-4 text-[#2d2d34]" />
            )}
          </button>

          {/* Conditional Rendering: If LOGGED IN -> Show Notification Bell and Account Dropdown */}
          {userProfile.isLoggedIn ? (
            <>
              {/* Notification Bell (Dismisses automatically when mouse leaves or on outside click) */}
              <div 
                className="relative" 
                ref={notificationRef}
                onMouseLeave={() => setNotificationToast(false)}
              >
                <button
                  onClick={() => setNotificationToast(!notificationToast)}
                  aria-label="Notifications"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#e8e5dc] flex items-center justify-center text-[#2d2d34] hover:border-[#b8860b] hover:text-[#b8860b] hover:bg-[#fbfbf9] transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#b8860b]"></span>
                </button>

                {/* Popover that closes when mouse leaves */}
                {notificationToast && (
                  <div 
                    className="absolute right-0 mt-2 w-72 sm:w-80 p-3.5 bg-white border border-[#e8e5dc] rounded-2xl shadow-2xl text-xs z-50 animate-in fade-in duration-150"
                    onMouseLeave={() => setNotificationToast(false)}
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#f4f3ef]">
                      <span className="font-bold text-[#111116] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#b8860b]" />
                        SU Turnstile Alert
                      </span>
                      <button
                        onClick={() => setNotificationToast(false)}
                        className="p-1 rounded-md text-[#888894] hover:text-[#111116] hover:bg-[#f4f3ef]"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[#62626e] mt-2 leading-relaxed">
                      Thanganat 5.0 gates open at 06:30 PM. Turnstile Lane B is active for RFID wristbands.
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-[#f4f3ef] flex items-center justify-between text-[10px] text-[#888894]">
                      <span>Swaminarayan University Security</span>
                      <span className="text-[#b8860b] font-semibold">Auto-dismiss on mouse leave</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Account Dropdown Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  aria-label="User Account Menu"
                  className="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full border border-[#e8e5dc] hover:border-[#b8860b] transition-all bg-[#ffffff] shadow-sm hover:shadow"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gradient-to-br from-[#fed65b] to-[#d4af37] flex items-center justify-center text-[#745c00] font-bold text-xs shadow-inner shrink-0">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      getInitials(userProfile.name)
                    )}
                  </div>
                  <div className="hidden sm:block text-left text-xs">
                    <span className="block font-semibold text-[#111116] leading-tight max-w-[90px] truncate">
                      {userProfile.name}
                    </span>
                    <span className="block text-[10px] text-[#15803d] font-bold capitalize">
                      {userProfile.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#888894]" />
                </button>

                {/* Dropdown Menu Container */}
                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#e8e5dc] rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1">
                    {/* User Mini Header */}
                    <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#f4f3ef] mb-2">
                      <div className="font-bold text-xs text-[#111116] truncate">{userProfile.name}</div>
                      <div className="text-[10px] font-mono text-[#888894] truncate">{userProfile.rollNumber}</div>
                      <div className="text-[10px] text-[#b8860b] truncate mt-0.5">{userProfile.course}</div>
                    </div>

                    {/* 1. Profile Option */}
                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#2d2d34] hover:bg-[#f4f3ef] hover:text-[#b8860b] transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-[#888894]" />
                      <span>Profile & Academic Info</span>
                    </button>

                    {/* 2. Settings Option */}
                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        onOpenSettings();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#2d2d34] hover:bg-[#f4f3ef] hover:text-[#b8860b] transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-[#888894]" />
                      <span>Settings & Alerts</span>
                    </button>

                    {/* 3. Feedback Option */}
                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        onOpenFeedback();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#2d2d34] hover:bg-[#f4f3ef] hover:text-[#b8860b] transition-colors text-left"
                    >
                      <MessageSquare className="w-4 h-4 text-[#888894]" />
                      <span>Campus Feedback</span>
                    </button>

                    {/* 4. Theme Dark/Light Option (Interactive theme toggle) */}
                    <button
                      onClick={() => {
                        onToggleTheme();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[#2d2d34] hover:bg-[#f4f3ef] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        {theme === 'dark' ? <Sun className="w-4 h-4 text-[#fed65b]" /> : <Moon className="w-4 h-4 text-[#888894]" />}
                        <span>{theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4f3ef] text-[#b8860b] border border-[#e8e5dc]">
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                      </span>
                    </button>

                    <div className="my-1 border-t border-[#f4f3ef]" />

                    {/* 5. Logout Option */}
                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* If LOGGED OUT -> Show Login Button */
            <button
              onClick={() => handleNavClick('login')}
              className="px-4 py-2 rounded-full bg-gold-gradient text-white font-bold text-xs sm:text-sm shadow-gold-glow hover:opacity-95 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-[#e8e5dc] flex items-center justify-center text-[#111116] hover:bg-[#f4f3ef]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e8e5dc]/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1.5 shadow-2xl animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeView === 'home' ? 'bg-[#111116] text-white' : 'text-[#2d2d34] hover:bg-[#f4f3ef]'
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          <button
            onClick={() => handleNavClick('explore')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeView === 'explore' ? 'bg-[#111116] text-white' : 'text-[#2d2d34] hover:bg-[#f4f3ef]'
            }`}
          >
            <Compass className="w-4 h-4" />
            Explore Campus Events
          </button>

          <button
            onClick={() => handleNavClick('details')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeView === 'details' ? 'bg-[#111116] text-white' : 'text-[#2d2d34] hover:bg-[#f4f3ef]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Thanganat 5.0 Gala
          </button>

          <button
            onClick={() => handleNavClick('passes')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeView === 'passes' ? 'bg-gold-gradient text-white' : 'text-[#2d2d34] hover:bg-[#f4f3ef]'
            }`}
          >
            <span className="flex items-center gap-3">
              <Ticket className="w-4 h-4" />
              My Passes & Bookings
            </span>
            <span className="text-[11px] bg-white text-[#b8860b] px-2 py-0.5 rounded-full font-bold">
              {activePassCount} Active
            </span>
          </button>

          <button
            onClick={() => handleNavClick('wishlist')}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
              activeView === 'wishlist' ? 'bg-[#111116] text-white' : 'text-[#2d2d34] hover:bg-[#f4f3ef]'
            }`}
          >
            <span className="flex items-center gap-3">
              <Bookmark className="w-4 h-4" />
              Wishlist Saved
            </span>
            {wishlistCount > 0 && (
              <span className="text-[11px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Theme Switcher in Mobile Drawer */}
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#2d2d34] hover:bg-[#f4f3ef] transition-colors"
          >
            <span className="flex items-center gap-3">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#fed65b]" /> : <Moon className="w-4 h-4 text-[#888894]" />}
              {theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4f3ef] text-[#b8860b] border border-[#e8e5dc]">
              {theme === 'dark' ? 'Dark' : 'Light'}
            </span>
          </button>

          {/* User Profile Links in Mobile Drawer */}
          {userProfile.isLoggedIn ? (
            <div className="pt-2 border-t border-[#f4f3ef] space-y-1">
              <button
                onClick={() => handleNavClick('profile')}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-[#2d2d34] hover:bg-[#f4f3ef]"
              >
                <User className="w-4 h-4 text-[#888894]" />
                Profile ({userProfile.name})
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFeedback();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-[#2d2d34] hover:bg-[#f4f3ef]"
              >
                <MessageSquare className="w-4 h-4 text-[#888894]" />
                Campus Feedback
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#f4f3ef]">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-2.5 rounded-xl bg-gold-gradient text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login to Portal
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
