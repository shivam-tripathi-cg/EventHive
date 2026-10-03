import React, { useState } from 'react';
import { X, CheckCircle2, Ticket, QrCode, ShieldCheck, Sparkles, User, Hash } from 'lucide-react';
import { EventItem, PassItem } from '../data/eventsData';
import { downloadThanganatPass } from '../utils/passGenerator';

interface PassClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  onPassClaimed: (pass: PassItem) => void;
  onViewPasses: () => void;
}

export const PassClaimModal: React.FC<PassClaimModalProps> = ({
  isOpen,
  onClose,
  event,
  onPassClaimed,
  onViewPasses,
}) => {
  const [studentName, setStudentName] = useState('Dev Patel');
  const [rollNumber, setRollNumber] = useState('SU202204192');
  const [tier, setTier] = useState('Student VIP Entry');
  const [includeGuest, setIncludeGuest] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<PassItem | null>(null);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const passPrefix = event.id.slice(0, 5).toUpperCase();
    const newPassId = `#SU-${passPrefix}-${randomCode}`;

    const newPass: PassItem = {
      id: `pass-${Date.now()}`,
      passId: newPassId,
      eventTitle: event.title.split('—')[0].trim(),
      eventSubtitle: event.title.split('—')[1]?.trim() || event.categoryLabel,
      category: event.categoryLabel,
      dateStr: event.dateStr,
      timeStr: event.time,
      venue: event.venue,
      gateInfo: `${tier} • Ground Gate ${Math.floor(1 + Math.random() * 4)}`,
      turnstileInfo: `Lane ${String.fromCharCode(65 + Math.floor(Math.random() * 4))} • Turnstile 0${Math.floor(1 + Math.random() * 8)}`,
      status: 'active',
      badge: 'Active • Verified Entry',
      passType: tier,
      qrCodeSeed: `${newPassId}-${rollNumber}-VALIDATED`,
    };

    onPassClaimed(newPass);
    setGeneratedPass(newPass);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setGeneratedPass(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white border border-[#e8e5dc] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gold-gradient px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-white/90" />
            <h3 className="font-serif font-bold text-lg">
              {isSuccess ? 'Pass Issued Successfully' : 'Claim Campus Entry Pass'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Event Summary Box */}
            <div className="p-3.5 bg-[#fbfbf9] rounded-xl border border-[#e8e5dc]">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#b8860b]">
                {event.categoryLabel}
              </span>
              <h4 className="font-serif font-bold text-base text-[#111116] mt-0.5">
                {event.title}
              </h4>
              <p className="text-xs text-[#62626e] mt-1">
                📍 {event.venue} • 🕒 {event.dateStr}
              </p>
            </div>

            {/* Student Info Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#111116] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#b8860b]" /> Student Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#e8e5dc] rounded-lg focus:border-[#b8860b] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111116] mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#b8860b]" /> Enrollment Number
                </label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#e8e5dc] rounded-lg focus:border-[#b8860b] outline-none font-mono"
                />
              </div>
            </div>

            {/* Pass Tier Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#111116] mb-1.5">
                Entry Pass Clearance Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Student Standard', label: 'Standard', desc: 'Free Entry' },
                  { id: 'Student VIP Entry', label: 'VIP Pass', desc: 'Ground Access' },
                  { id: 'Delegate Pass', label: 'Delegate', desc: 'Full Access' },
                ].map((tierItem) => (
                  <button
                    key={tierItem.id}
                    type="button"
                    onClick={() => setTier(tierItem.id)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      tier === tierItem.id
                        ? 'border-[#b8860b] bg-[#fbf8ee] text-[#111116]'
                        : 'border-[#e8e5dc] bg-white text-[#62626e] hover:border-[#d4af37]'
                    }`}
                  >
                    <div className="font-semibold text-xs text-[#111116]">{tierItem.label}</div>
                    <div className="text-[10px] text-[#b8860b] font-medium">{tierItem.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Guest Toggle */}
            <div className="p-3 bg-[#f6f4ee] rounded-xl border border-[#e8e5dc]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#111116] block">
                    Accompanying Guest Pass (+1)
                  </span>
                  <span className="text-[11px] text-[#62626e]">
                    Allowed under Swaminarayan University enrollment policy
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={includeGuest}
                  onChange={(e) => setIncludeGuest(e.target.checked)}
                  className="w-4 h-4 accent-[#b8860b] cursor-pointer"
                />
              </div>

              {includeGuest && (
                <div className="mt-3 pt-3 border-t border-[#e8e5dc]">
                  <input
                    type="text"
                    placeholder="Guest Full Name (for gate RFID printing)"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#e8e5dc] rounded-lg bg-white outline-none focus:border-[#b8860b]"
                  />
                </div>
              )}
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-[#15803d]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Instant contactless RFID QR sync tied to your student account.</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 text-xs font-semibold text-[#62626e] hover:text-[#111116]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gold-gradient text-white px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg shadow-gold-glow hover:opacity-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Claim Pass (Free)
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-6 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-[#15803d] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#15803d]">
                Turnstile Validation Ready
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#111116] mt-1">
                Pass Generated!
              </h4>
              <p className="text-xs text-[#62626e] mt-1">
                Your entry pass is registered for <strong className="text-[#111116]">{studentName}</strong> ({rollNumber}).
              </p>
            </div>

            {/* Ticket Preview Card */}
            {generatedPass && (
              <div className="bg-[#fbfbf9] border border-[#d4af37]/40 rounded-xl p-4 text-left shadow-sm">
                <div className="flex justify-between items-start border-b border-[#e8e5dc] pb-2.5 mb-2.5">
                  <div>
                    <span className="text-[10px] font-bold text-[#b8860b] uppercase">
                      {generatedPass.passId}
                    </span>
                    <h5 className="font-serif font-bold text-sm text-[#111116]">
                      {generatedPass.eventTitle}
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white border border-[#e8e5dc] rounded-lg p-1.5 flex items-center justify-center shrink-0">
                    <QrCode className="w-12 h-12 text-[#111116]" />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-[#111116]">{generatedPass.gateInfo}</p>
                    <p className="text-[#62626e]">{generatedPass.turnstileInfo}</p>
                    <p className="text-[11px] text-[#b8860b] font-medium">{generatedPass.dateStr}</p>
                  </div>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => {
                  downloadThanganatPass(studentName, rollNumber, 'B.Tech CSE / Enrolled Scholar');
                }}
                className="flex-1 bg-white border-2 border-[#b8860b] text-[#745c00] py-2.5 px-3 rounded-xl font-bold text-xs hover:bg-amber-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Download Thanganat Pass</span>
              </button>
              <button
                onClick={() => {
                  handleClose();
                  onViewPasses();
                }}
                className="flex-1 bg-gold-gradient text-white py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-opacity"
              >
                View in Vault →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
