import React, { useState } from 'react';
import { 
  ShieldCheck, Printer, RefreshCw, QrCode, Download, 
  Smartphone, Share2, Plus, ArrowRight, HelpCircle, 
  Sun, Clock, CreditCard, Check, X, ExternalLink,
  MapPin, Calendar, Sparkles, User, Award, Ticket, Copy
} from 'lucide-react';
import { PassItem, UserProfile } from '../data/eventsData';
import { downloadThanganatPass } from '../utils/passGenerator';
import { ScanableQrCode } from '../components/ScanableQrCode';

interface MyPassesViewProps {
  passes: PassItem[];
  userProfile: UserProfile;
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'wishlist') => void;
  onRefreshPasses: () => void;
}

export const MyPassesView: React.FC<MyPassesViewProps> = ({
  passes,
  userProfile,
  onNavigate,
  onRefreshPasses,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'wishlist'>('active');
  const [zoomedPass, setZoomedPass] = useState<PassItem | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = (passId: string) => {
    downloadThanganatPass(userProfile.name, userProfile.rollNumber, userProfile.course);
    showToast(`Official Thanganat 5.0 VIP Pass downloaded for ${userProfile.name}!`);
  };

  const handleAddToWallet = (passTitle: string) => {
    showToast(`Pass for "${passTitle}" added to Apple / Google Wallet!`);
  };

  const handleSharePass = (passId: string) => {
    navigator.clipboard?.writeText(`https://eventhive.in/verify-pass/${passId}`);
    showToast(`Pass verification link copied to clipboard!`);
  };

  // Past attended passes
  const pastPasses: PassItem[] = [
    {
      id: 'past-1',
      passId: 'SU-FRESH-11029',
      eventTitle: 'Orientation & Freshers Gala 2024',
      eventSubtitle: 'Student Induction & Welcome Bash',
      category: 'University Life',
      dateStr: 'Sat, Aug 10, 2024 • 10:00 AM - 5:00 PM',
      timeStr: '10:00 AM - 5:00 PM',
      venue: 'Main Auditorium Arena',
      gateInfo: 'Fresher Ground Pass • Gate 01',
      turnstileInfo: 'Turnstile A02',
      status: 'past',
      badge: 'Concluded & Checked-In',
      passType: 'General Student Pass',
      qrCodeSeed: 'SU-FRESH-11029',
      barcode: '||| | | |||| || ||| || ||||',
      studentName: userProfile.name,
      studentRoll: userProfile.rollNumber,
      studentCourse: userProfile.course,
      seatZone: 'Auditorium • Row 12',
    },
    {
      id: 'past-2',
      passId: 'SU-SPORTS-9921',
      eventTitle: 'National Sports Day Tug-of-War',
      eventSubtitle: 'Inter-Department Athletics Meet',
      category: 'Sports Board',
      dateStr: 'Thu, Aug 29, 2024 • 02:00 PM - 06:00 PM',
      timeStr: '02:00 PM - 06:00 PM',
      venue: 'Sports Pavilion & Field',
      gateInfo: 'Participant Athlete Badge',
      turnstileInfo: 'Arena Gate 01',
      status: 'past',
      badge: 'Concluded & Checked-In',
      passType: 'Athlete Pass',
      qrCodeSeed: 'SU-SPORTS-9921',
      barcode: '|| |||| | | ||| |||| | ||',
      studentName: userProfile.name,
      studentRoll: userProfile.rollNumber,
      studentCourse: userProfile.course,
      seatZone: 'Athlete Dugout',
    },
  ];

  const currentPasses = activeTab === 'active' ? passes : activeTab === 'past' ? pastPasses : [];

  return (
    <main className="min-h-screen bg-[#fbfbf9] text-[#111116] pb-20 print-page">
      {/* Toast Alert */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111116] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-[#d4af37]/40 animate-in slide-in-from-bottom duration-300">
          <Check className="w-4 h-4 text-[#d4af37]" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* 1. Header & Student Credential Vault */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#e8e5dc]">
          
          {/* Left Title & Kicker */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-wider text-[#b8860b]">
              <ShieldCheck className="w-3.5 h-3.5" />
              University Credential Vault
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111116]">
              My Event Passes <span className="font-serif italic font-normal text-[#b8860b]">& Bookings</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#62626e] max-w-xl">
              All your verified digital entry QR passes, RFID gate wristband reservations, and turnstile tickets for Swaminarayan University.
            </p>
          </div>

          {/* Right Student Profile Card (Dynamic with Active Profile) */}
          <div className="bg-white border border-[#e8e5dc] rounded-2xl p-4 sm:p-5 pr-20 sm:pr-5 shadow-card-elevated hover:shadow-card-3d transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
            <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-[#15803d] border border-emerald-200">
              Verified Scholar
            </span>

            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-[#fed65b] to-[#d4af37] border border-[#d4af37] flex items-center justify-center text-[#745c00] font-bold text-sm sm:text-base shadow-sm shrink-0">
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  userProfile.name.split(' ').map(n => n[0]).slice(0, 2).join('')
                )}
              </div>

              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#111116] truncate">{userProfile.name}</span>
                </div>
                <div className="text-xs text-[#62626e] font-mono">
                  {userProfile.rollNumber}
                </div>
                <div className="text-[11px] text-[#b8860b] font-medium truncate max-w-[200px]">
                  {userProfile.course}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0 sm:border-l sm:border-[#f4f3ef] sm:pl-4">
              <button
                onClick={() => onNavigate('profile')}
                className="px-3 py-1.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] hover:border-[#b8860b] text-xs font-semibold text-[#111116] flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-[#b8860b]" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* 2. Filter & Utility Tabs */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-gold-gradient text-white shadow-gold-glow'
                  : 'bg-white border border-[#e8e5dc] text-[#2d2d34] hover:border-[#b8860b]'
              }`}
            >
              Active Passes
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                {passes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'past'
                  ? 'bg-gold-gradient text-white shadow-gold-glow'
                  : 'bg-white border border-[#e8e5dc] text-[#2d2d34] hover:border-[#b8860b]'
              }`}
            >
              Past Attended
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#f4f3ef] text-[#62626e] font-mono">
                2
              </span>
            </button>

            <button
              onClick={() => onNavigate('wishlist')}
              className="px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 bg-white border border-[#e8e5dc] text-[#2d2d34] hover:border-[#b8860b]"
            >
              Saved in Wishlist
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-50 text-[#b8860b] font-mono">
                ★
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl border border-[#e8e5dc] bg-white text-xs font-semibold text-[#111116] hover:border-[#b8860b] flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-[#b8860b]" />
              Bulk Print Passes
            </button>

            <button
              onClick={onRefreshPasses}
              aria-label="Refresh credentials"
              className="p-2 rounded-xl border border-[#e8e5dc] bg-white text-[#62626e] hover:border-[#b8860b] hover:text-[#b8860b] transition-colors shadow-sm"
              title="Sync passes"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Grid of Digital Passes (Designed as Authentic Event Passes with Printed Account Details!) */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {currentPasses.map((pass) => (
            <div
              key={pass.id}
              className="ticket-card bg-white border border-[#e8e5dc] rounded-3xl overflow-hidden shadow-card-elevated hover:shadow-card-3d hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* TOP HEADER SECTION OF PASS: Holographic University Band */}
              <div className="p-4 sm:p-5 bg-gradient-to-br from-[#111116] via-[#1c1b22] to-[#252219] text-white relative overflow-hidden">
                {/* Security Holographic Gold Ribbon */}
                <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-[#fed65b] pb-2 border-b border-white/10">
                  <span className="flex items-center gap-1 font-bold">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    SWAMINARAYAN UNIVERSITY
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#fed65b] font-bold">
                    {pass.passType}
                  </span>
                </div>

                {/* Event Title & Subtitle */}
                <div className="mt-3 space-y-1">
                  <h3 className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-[#fed65b] transition-colors leading-snug">
                    {pass.eventTitle}
                  </h3>
                  <p className="text-xs text-[#a0a0ab]">
                    {pass.eventSubtitle}
                  </p>
                </div>

                {/* Date & Venue Tags */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#e8e5dc]">
                  <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    {pass.dateStr}
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    {pass.venue}
                  </span>
                </div>

                {/* Aesthetic security watermark */}
                <div className="absolute -bottom-6 -right-6 text-white/5 font-serif text-7xl font-bold select-none pointer-events-none">
                  SU
                </div>
              </div>

              {/* MIDDLE SECTION: STUDENT CREDENTIALS PRINTED DYNAMICALLY FROM ACTIVE ACCOUNT */}
              <div className="p-4 sm:p-5 bg-gradient-to-b from-[#fdfaf0] to-[#ffffff] border-b border-dashed border-[#e8e5dc] space-y-3 relative">
                
                {/* Left & Right Perforation Cutouts */}
                <div className="ticket-notch-left" />
                <div className="ticket-notch-right" />

                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#b8860b]">
                  <span>Authorized Pass Holder</span>
                  <span className="font-mono text-[#15803d] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    RFID Validated
                  </span>
                </div>

                {/* Student Holder Information Block */}
                <div className="p-3 rounded-2xl bg-white border border-[#e8e5dc] shadow-sm flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-[#888894]">Student Name</div>
                    <div className="font-bold text-sm text-[#111116] tracking-tight">
                      {userProfile.name}
                    </div>
                    <div className="text-[11px] text-[#62626e] truncate max-w-[190px]">
                      {userProfile.course}
                    </div>
                  </div>

                  <div className="text-right space-y-0.5">
                    <div className="text-[10px] uppercase font-bold text-[#888894]">Enrollment / GR</div>
                    <div className="font-mono font-bold text-xs text-[#b8860b] bg-amber-50 px-2 py-1 rounded-md border border-[#d4af37]/30">
                      {userProfile.rollNumber}
                    </div>
                    <div className="text-[10px] text-[#62626e] font-mono">
                      {pass.seatZone || 'General Zone'}
                    </div>
                  </div>
                </div>

                {/* Gate & Turnstile Lane */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#fbfbf9] border border-[#e8e5dc]">
                    <div className="text-[10px] uppercase font-bold text-[#888894]">Entry Gate</div>
                    <div className="font-bold text-[#111116] truncate">{pass.gateInfo}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#fbfbf9] border border-[#e8e5dc]">
                    <div className="text-[10px] uppercase font-bold text-[#888894]">Turnstile Lane</div>
                    <div className="font-mono font-bold text-[#b8860b] truncate">{pass.turnstileInfo}</div>
                  </div>
                </div>
              </div>

              {/* BOTTOM SECTION: QR SCANNER & BARCODE STUB */}
              <div className="p-5 bg-white space-y-4">
                <div className="flex items-center justify-between gap-4">
                  {/* High-Resolution Real Scanable QR Code */}
                  <div className="relative group/qr">
                    <ScanableQrCode
                      payload={`https://eventhive.in/verify?passId=${pass.passId}&student=${encodeURIComponent(userProfile.name)}&roll=${encodeURIComponent(userProfile.rollNumber)}&event=${encodeURIComponent(pass.eventTitle)}&status=VALID`}
                      size={80}
                      allowInspect={true}
                    />
                  </div>

                  {/* Pass Metadata & Barcode */}
                  <div className="flex-1 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-[#888894]">Digital Pass Serial</div>
                    <div className="font-mono text-xs font-bold text-[#111116] truncate">
                      {pass.passId}
                    </div>
                    
                    {/* Simulated High-Res Barcode */}
                    <div className="font-mono text-xs tracking-[0.2em] text-[#111116] font-bold select-none pt-1">
                      {pass.barcode || '||| |||| | ||| | ||||'}
                    </div>

                    <div className="text-[10px] text-[#15803d] font-semibold flex items-center gap-1 pt-0.5">
                      <ShieldCheck className="w-3 h-3" />
                      <span>GATE FASTSCAN READY</span>
                    </div>
                  </div>
                </div>

                {/* PASS ACTION TOOLBAR */}
                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-[#f4f3ef] no-print">
                  <button
                    onClick={() => setZoomedPass(pass)}
                    className="p-2 rounded-xl border border-[#e8e5dc] hover:border-[#b8860b] hover:bg-[#fbfbf9] text-xs font-semibold text-[#111116] flex flex-col items-center justify-center gap-1 transition-all"
                    title="Zoom QR Code for turnstile"
                  >
                    <QrCode className="w-4 h-4 text-[#b8860b]" />
                    <span className="text-[9px]">Zoom QR</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(pass.passId)}
                    className="p-2 rounded-xl border border-[#e8e5dc] hover:border-[#b8860b] hover:bg-[#fbfbf9] text-xs font-semibold text-[#111116] flex flex-col items-center justify-center gap-1 transition-all"
                    title="Download Pass PDF"
                  >
                    <Download className="w-4 h-4 text-[#b8860b]" />
                    <span className="text-[9px]">PDF Pass</span>
                  </button>

                  <button
                    onClick={() => handleAddToWallet(pass.eventTitle)}
                    className="p-2 rounded-xl border border-[#e8e5dc] hover:border-[#b8860b] hover:bg-[#fbfbf9] text-xs font-semibold text-[#111116] flex flex-col items-center justify-center gap-1 transition-all"
                    title="Add to Google / Apple Wallet"
                  >
                    <Smartphone className="w-4 h-4 text-[#b8860b]" />
                    <span className="text-[9px]">Wallet</span>
                  </button>

                  <button
                    onClick={() => handleSharePass(pass.passId)}
                    className="p-2 rounded-xl border border-[#e8e5dc] hover:border-[#b8860b] hover:bg-[#fbfbf9] text-xs font-semibold text-[#111116] flex flex-col items-center justify-center gap-1 transition-all"
                    title="Share pass link"
                  >
                    <Share2 className="w-4 h-4 text-[#b8860b]" />
                    <span className="text-[9px]">Share</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Gate Verification Protocols & Guidelines (Image 1.png matching) */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 no-print">
        <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 sm:p-10 shadow-card-elevated">
          <div className="max-w-2xl mb-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8860b] bg-amber-50 px-3 py-1 rounded-full border border-[#d4af37]/30">
              Turnstile Entry Guidelines
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#111116] mt-2">
              Fast-Track Entry Verification Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-[#62626e] mt-1">
              Please review the official gate protocols to ensure seamless admission without queue delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#fbfbf9] border border-[#e8e5dc] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#b8860b] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111116]">Physical Student ID Required</h3>
              <p className="text-xs text-[#62626e] leading-relaxed">
                Security turnstiles require pairing this digital pass with your physical Swaminarayan University RFID smartcard.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfbf9] border border-[#e8e5dc] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#b8860b] flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111116]">Screen Brightness at 100%</h3>
              <p className="text-xs text-[#62626e] leading-relaxed">
                Optical turnstile laser scanners work best when phone brightness is maxed out. Avoid cracked or tinted screen protectors.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fbfbf9] border border-[#e8e5dc] space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-[#b8860b] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#111116]">Arrive 45 Mins Prior to Gala</h3>
              <p className="text-xs text-[#62626e] leading-relaxed">
                Security lanes for major galas like Thanganat 5.0 close strictly 15 minutes before the opening Aarti & ceremony.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FULL-SCREEN QR ZOOM MODAL FOR GATE TURNSTILE SCANNER */}
      {zoomedPass && (
        <div 
          onClick={() => setZoomedPass(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 no-print"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 border border-[#e8e5dc] shadow-2xl relative"
          >
            <button
              onClick={() => setZoomedPass(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#f4f3ef] text-[#62626e]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8860b] bg-amber-50 px-3 py-1 rounded-full border border-[#d4af37]/30">
                Gate FastScan Mode
              </span>
              <h3 className="font-serif text-xl font-bold text-[#111116] mt-2">
                {zoomedPass.eventTitle}
              </h3>
              <p className="text-xs text-[#62626e]">
                Hold this screen directly in front of the gate optical laser.
              </p>
            </div>

            {/* High-Contrast Large Real Scanable QR */}
            <div className="p-3 bg-white border-2 border-[#111116] rounded-2xl mx-auto inline-block shadow-lg">
              <ScanableQrCode
                payload={`https://eventhive.in/verify?passId=${zoomedPass.passId}&student=${encodeURIComponent(userProfile.name)}&roll=${encodeURIComponent(userProfile.rollNumber)}&event=${encodeURIComponent(zoomedPass.eventTitle)}&status=VALID`}
                size={180}
                allowInspect={false}
              />
            </div>

            {/* Holder Confirmation */}
            <div className="p-3 rounded-xl bg-[#fbfbf9] border border-[#e8e5dc] text-xs">
              <div className="font-bold text-[#111116]">{userProfile.name}</div>
              <div className="font-mono text-[#b8860b]">{userProfile.rollNumber}</div>
              <div className="text-[11px] text-[#62626e] mt-1">{zoomedPass.turnstileInfo}</div>
            </div>

            <button
              onClick={() => setZoomedPass(null)}
              className="w-full py-2.5 rounded-full bg-[#111116] text-white text-xs font-bold hover:bg-[#2d2d34] transition-colors"
            >
              Close Scanner View
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
