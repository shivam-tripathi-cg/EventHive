import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, ShieldCheck, Sparkles, Copy, 
  Smartphone, ArrowRight, Loader2, Download, Ticket, 
  CreditCard, ExternalLink, RefreshCw 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem, PassItem, UserProfile } from '../data/eventsData';
import { ScanableQrCode } from './ScanableQrCode';
import { DatabaseService } from '../data/dbStore';
import { downloadThanganatPass } from '../utils/passGenerator';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  userProfile: UserProfile;
  onPassGenerated: (pass: PassItem) => void;
  onViewPasses: () => void;
}

export const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  event,
  userProfile,
  onPassGenerated,
  onViewPasses,
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'verifying' | 'success'>('idle');
  const [verificationStep, setVerificationStep] = useState<string>('');
  const [createdPass, setCreatedPass] = useState<PassItem | null>(null);

  const upiId = 'tto.shivam.dm12@oksbi';
  const payeeName = 'Shivam';
  const amount = event?.id === 'thanganat-5' ? 199 : 99;

  useEffect(() => {
    if (isOpen) {
      setPaymentState('idle');
      setVerificationStep('');
      setCreatedPass(null);
    }
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSimulatePayment = () => {
    setPaymentState('verifying');
    setVerificationStep('Connecting to UPI Gateway & Bank Server...');

    setTimeout(() => {
      setVerificationStep(`Verifying transaction reference for ${upiId}...`);
    }, 1200);

    setTimeout(() => {
      setVerificationStep('Authenticating merchant settlement with SBI...');
    }, 2400);

    setTimeout(() => {
      // Generate Pass
      const randomCode = Math.floor(10000 + Math.random() * 90000);
      const prefix = event.id.slice(0, 5).toUpperCase();
      const newPassId = `SU-${prefix}-${randomCode}`;
      
      const passPayload = `https://eventhive.in/verify?passId=${newPassId}&student=${encodeURIComponent(userProfile.name)}&roll=${encodeURIComponent(userProfile.rollNumber)}&event=${encodeURIComponent(event.title)}&status=VALID&ref=UPI_SBI_${Date.now()}`;

      const newPass: PassItem = {
        id: `pass-${Date.now()}`,
        passId: newPassId,
        eventTitle: event.title.split('—')[0].trim(),
        eventSubtitle: event.title.split('—')[1]?.trim() || event.categoryLabel,
        category: event.categoryLabel,
        dateStr: event.dateStr,
        timeStr: event.time,
        venue: event.venue,
        gateInfo: `Student VIP FastPass • Gate 02`,
        turnstileInfo: `Lane B • Turnstile 04`,
        status: 'active',
        badge: 'Verified Entry • Paid via UPI',
        passType: 'VIP Pass (UPI Verified)',
        qrCodeSeed: passPayload,
        barcode: '||| | | |||| || ||| || |||| | ||| | ||',
        seatZone: 'Zone A • Circle 01',
        studentName: userProfile.name,
        studentRoll: userProfile.rollNumber,
        studentCourse: userProfile.course,
      };

      // Save to database as attendee
      DatabaseService.addAttendee({
        id: `att-${Date.now()}`,
        passId: newPassId,
        eventId: event.id,
        eventTitle: event.title,
        studentName: userProfile.name,
        studentRoll: userProfile.rollNumber,
        studentCourse: userProfile.course,
        studentEmail: userProfile.email,
        studentPhone: userProfile.contactNumber,
        studentAvatar: userProfile.avatar,
        passType: 'VIP Pass (UPI)',
        bookingDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        isCheckedIn: false,
        seatZone: 'Zone A • Circle 01',
        gateInfo: 'Gate 02 • FastPass',
        pricePaid: amount,
        paymentMethod: `UPI (${upiId})`,
      });

      // Log user activity
      DatabaseService.logActivity({
        userId: userProfile.rollNumber,
        type: 'payment_completed',
        title: `Payment Verified for ${event.title}`,
        description: `Paid ₹${amount} via UPI to ${upiId}. Digital Pass generated: ${newPassId}`,
        timestamp: 'Just now',
        eventId: event.id,
        passId: newPassId,
      });

      setCreatedPass(newPass);
      onPassGenerated(newPass);
      setPaymentState('success');

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#fed65b', '#10b981', '#111116'],
        });
      } catch (e) {
        console.error(e);
      }
    }, 3600);
  };

  const upiIntentString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Pass for ${event.title}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative border border-[#e8e5dc] text-[#111116]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#111116] via-[#1a1922] to-[#2b2518] px-6 py-4 text-white flex items-center justify-between border-b border-[#d4af37]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-[#fed65b]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                UPI Instant Payment & Pass Unlock
              </h3>
              <p className="text-[11px] text-[#fed65b]">
                Official Swaminarayan University Cashier
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {paymentState === 'idle' && (
          <div className="p-6 space-y-5">
            {/* Event Summary Card */}
            <div className="p-4 bg-[#fbfbf9] rounded-2xl border border-[#e8e5dc] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#b8860b]">
                  {event.categoryLabel}
                </span>
                <h4 className="font-serif font-bold text-base text-[#111116]">
                  {event.title}
                </h4>
                <p className="text-xs text-[#62626e] mt-0.5">
                  Attendee: <strong>{userProfile.name}</strong> ({userProfile.rollNumber})
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#62626e] block uppercase font-semibold">Total Fee</span>
                <span className="font-serif text-2xl font-bold text-[#b8860b]">₹{amount}</span>
              </div>
            </div>

            {/* UPI QR Display Box */}
            <div className="bg-gradient-to-b from-[#f9f8f4] to-[#f4f2ea] rounded-2xl p-5 border border-[#e8e5dc] text-center shadow-inner">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#e8e5dc] text-[10px] font-bold uppercase tracking-wider text-[#7b5800] mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
                Scan with any UPI App
              </div>

              {/* Scannable UPI QR */}
              <div className="flex justify-center mb-3">
                <div className="p-2 bg-white rounded-2xl shadow-md border border-[#e8e5dc] inline-block">
                  <ScanableQrCode
                    payload={upiIntentString}
                    size={170}
                    darkColor="#111116"
                    lightColor="#ffffff"
                    altText="UPI Payment QR Code"
                    allowInspect={false}
                  />
                </div>
              </div>

              {/* Payee Info */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#111116]">
                  Payee: <span className="text-[#b8860b]">{payeeName}</span>
                </div>
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-[#e8e5dc] text-xs font-mono text-[#111116]">
                  <span>{upiId}</span>
                  <button
                    onClick={handleCopyUpi}
                    className="text-[#b8860b] hover:text-[#7b5800] text-[11px] font-sans font-semibold flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    {copiedUpi ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Supported UPI Apps */}
              <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-[#62626e] font-medium">
                <span className="px-2 py-0.5 rounded bg-white border border-[#e8e5dc]">GPay</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#e8e5dc]">PhonePe</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#e8e5dc]">Paytm</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#e8e5dc]">BHIM</span>
                <span className="px-2 py-0.5 rounded bg-white border border-[#e8e5dc]">CRED</span>
              </div>
            </div>

            {/* Note & Action */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#15803d] bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Simulated instant bank verification active. Click below to verify and generate pass.</span>
              </div>

              <button
                onClick={handleSimulatePayment}
                className="w-full bg-gradient-to-r from-[#b8860b] via-[#d4af37] to-[#b8860b] text-white py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>I Have Paid via UPI / Simulate Payment</span>
              </button>
            </div>
          </div>
        )}

        {paymentState === 'verifying' && (
          <div className="p-10 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-50 border-2 border-[#d4af37] flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-10 h-10 text-[#b8860b] animate-spin" />
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-2xl font-bold text-[#111116]">
                Verifying Payment...
              </h4>
              <p className="text-xs text-[#62626e] max-w-xs mx-auto">
                {verificationStep || 'Communicating with banking gateway...'}
              </p>
            </div>

            <div className="w-48 h-1.5 bg-[#f4f2ea] rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gold-gradient w-3/4 rounded-full animate-pulse"></div>
            </div>

            <p className="text-[11px] text-[#888894]">
              Please do not refresh or close this window.
            </p>
          </div>
        )}

        {paymentState === 'success' && createdPass && (
          <div className="p-6 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-[#15803d] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#15803d]">
                UPI Transaction Confirmed
              </span>
              <h4 className="font-serif text-2xl font-bold text-[#111116]">
                Payment Successful!
              </h4>
              <p className="text-xs text-[#62626e]">
                Pass issued to <strong className="text-[#111116]">{userProfile.name}</strong> ({userProfile.rollNumber}).
              </p>
            </div>

            {/* Pass Preview Card */}
            <div className="bg-[#fbfbf9] border border-[#d4af37]/40 rounded-2xl p-4 text-left shadow-md">
              <div className="flex justify-between items-start border-b border-[#e8e5dc] pb-2.5 mb-2.5">
                <div>
                  <span className="text-[10px] font-bold text-[#b8860b] uppercase">
                    {createdPass.passId}
                  </span>
                  <h5 className="font-serif font-bold text-sm text-[#111116]">
                    {createdPass.eventTitle}
                  </h5>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active & Verified
                </span>
              </div>

              <div className="flex items-center gap-3">
                <ScanableQrCode
                  payload={createdPass.qrCodeSeed}
                  size={68}
                  allowInspect={false}
                />
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-[#111116]">{createdPass.gateInfo}</p>
                  <p className="text-[#62626e]">{createdPass.turnstileInfo}</p>
                  <p className="text-[11px] text-[#b8860b] font-medium">{createdPass.dateStr}</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => {
                  downloadThanganatPass(userProfile.name, userProfile.rollNumber, userProfile.course);
                }}
                className="flex-1 bg-white border-2 border-[#b8860b] text-[#745c00] py-2.5 px-3 rounded-xl font-bold text-xs hover:bg-amber-50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Pass</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onViewPasses();
                }}
                className="flex-1 bg-gold-gradient text-white py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>View in Vault</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
