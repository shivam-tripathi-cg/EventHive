import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Plus, Search, Edit3, Trash2, CheckCircle2, 
  XCircle, Users, Calendar, Ticket, MessageSquare, 
  Sparkles, Download, Upload, Eye, QrCode, Lock, 
  Key, ArrowRight, RefreshCw, Check, Star, Filter, 
  Layers, Clock, MapPin, AlertCircle, ExternalLink 
} from 'lucide-react';
import { DetailedEventItem, AttendeeRecord, EventFeedbackRecord, DatabaseService } from '../data/dbStore';
import { AVAILABLE_COURSES, UserProfile } from '../data/eventsData';
import { ScanableQrCode } from '../components/ScanableQrCode';

interface AdminPortalViewProps {
  userProfile: UserProfile;
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'wishlist' | 'admin') => void;
  onSelectEventForPreview?: (event: DetailedEventItem) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  userProfile,
  onNavigate,
  onSelectEventForPreview,
}) => {
  // Security PIN gate
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return userProfile.role === 'admin' || localStorage.getItem('eventhive_admin_unlocked') === 'true';
  });
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'events' | 'attendees' | 'scanner' | 'feedback' | 'analytics'>('events');

  // Database States
  const [events, setEvents] = useState<DetailedEventItem[]>([]);
  const [attendees, setAttendees] = useState<AttendeeRecord[]>([]);
  const [feedbackList, setFeedbackList] = useState<EventFeedbackRecord[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Search & Filters
  const [eventSearch, setEventSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('all');

  // Event Modal Editor
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  // Event Form State
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formCategory, setFormCategory] = useState<'cultural' | 'tech' | 'sports' | 'workshops' | 'diplomatic'>('cultural');
  const [formCategoryLabel, setFormCategoryLabel] = useState('Cultural & Arts');
  const [formDateStr, setFormDateStr] = useState('');
  const [formMonth, setFormMonth] = useState('OCT');
  const [formDay, setFormDay] = useState('25');
  const [formTime, setFormTime] = useState('06:00 PM - 10:00 PM');
  const [formVenue, setFormVenue] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formAboutText, setFormAboutText] = useState('');
  const [formBadge, setFormBadge] = useState('Registrations Open');
  const [formIsFree, setFormIsFree] = useState(true);
  const [formTicketPrice, setFormTicketPrice] = useState(0);
  const [formPassTheme, setFormPassTheme] = useState('gold');
  const [formBannerImage, setFormBannerImage] = useState('');
  const [formOrganizer, setFormOrganizer] = useState('Swaminarayan University Cultural Directorate');
  const [formRules, setFormRules] = useState<string[]>([
    'Valid university credentials mandatory at entrance.',
    'Follow code of conduct inside the campus premises.',
  ]);
  const [formPerks, setFormPerks] = useState<string[]>([
    'Verified Attendance Certificate with QR',
    'Full access to all seminar and session halls',
  ]);
  const [newRuleInput, setNewRuleInput] = useState('');
  const [newPerkInput, setNewPerkInput] = useState('');

  // Free Pass Issuance Modal
  const [isIssuePassModalOpen, setIsIssuePassModalOpen] = useState(false);
  const [issueStudentName, setIssueStudentName] = useState('');
  const [issueStudentRoll, setIssueStudentRoll] = useState('SU202300000');
  const [issueStudentCourse, setIssueStudentCourse] = useState(AVAILABLE_COURSES[0]);
  const [issueStudentEmail, setIssueStudentEmail] = useState('');
  const [issueStudentPhone, setIssueStudentPhone] = useState('');
  const [issueEventId, setIssueEventId] = useState('');
  const [issuePassTier, setIssuePassTier] = useState('Admin Free Pass');

  // Scanner Tool State
  const [scanQuery, setScanQuery] = useState('');
  const [scanResult, setScanResult] = useState<AttendeeRecord | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'found' | 'notFound'>('idle');

  const loadData = () => {
    setEvents(DatabaseService.getEvents());
    setAttendees(DatabaseService.getAttendees());
    setFeedbackList(DatabaseService.getFeedback());
  };

  useEffect(() => {
    loadData();

    const handleDataUpdate = () => loadData();
    window.addEventListener('eventhive_db_updated', handleDataUpdate);
    window.addEventListener('eventhive_attendees_updated', handleDataUpdate);
    window.addEventListener('eventhive_feedback_updated', handleDataUpdate);

    return () => {
      window.removeEventListener('eventhive_db_updated', handleDataUpdate);
      window.removeEventListener('eventhive_attendees_updated', handleDataUpdate);
      window.removeEventListener('eventhive_feedback_updated', handleDataUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === 'trident1593') {
      setIsUnlocked(true);
      localStorage.setItem('eventhive_admin_unlocked', 'true');
      setPinError('');
      showToast('Admin Portal Unlocked successfully!');
    } else {
      setPinError('Invalid Admin Passcode! The only authorized credential is: trident1593');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    localStorage.removeItem('eventhive_admin_unlocked');
    showToast('Admin Portal Locked.');
  };

  // Open Event Creator / Editor
  const handleOpenCreateEvent = () => {
    setEditingEventId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormCategory('cultural');
    setFormCategoryLabel('Cultural & Arts');
    setFormDateStr('Fri, Nov 15 • 06:00 PM - 10:00 PM');
    setFormMonth('NOV');
    setFormDay('15');
    setFormTime('06:00 PM - 10:00 PM');
    setFormVenue('Central University Amphitheatre');
    setFormSummary('');
    setFormAboutText('');
    setFormBadge('Registrations Open');
    setFormIsFree(true);
    setFormTicketPrice(0);
    setFormPassTheme('gold');
    setFormBannerImage('');
    setFormOrganizer('Swaminarayan University Directorate');
    setFormRules([
      'Valid student or faculty ID required at Gate turnstile.',
      'Maintain campus decorum throughout the event.',
    ]);
    setFormPerks([
      'Official verified attendance certificate',
      'Complimentary refreshment voucher',
    ]);
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: DetailedEventItem) => {
    setEditingEventId(evt.id);
    setFormTitle(evt.title);
    setFormSubtitle(evt.subtitle || '');
    setFormCategory(evt.category);
    setFormCategoryLabel(evt.categoryLabel);
    setFormDateStr(evt.dateStr);
    setFormMonth(evt.shortDate.month);
    setFormDay(evt.shortDate.day);
    setFormTime(evt.time);
    setFormVenue(evt.venue);
    setFormSummary(evt.summary);
    setFormAboutText(evt.aboutText || evt.summary);
    setFormBadge(evt.badge || 'Active');
    setFormIsFree(evt.isFree ?? true);
    setFormTicketPrice(evt.ticketPrice || 0);
    setFormPassTheme(evt.passColorTheme || 'gold');
    setFormBannerImage(evt.bannerImage || '');
    setFormOrganizer(evt.organizer || 'Swaminarayan University Directorate');
    setFormRules(evt.rules || ['Standard university rules apply.']);
    setFormPerks(evt.perks || ['Official entry pass provided.']);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formVenue.trim()) {
      showToast('Please provide event title and venue.');
      return;
    }

    const eventId = editingEventId || `event-${Date.now()}`;
    const gradientMap = {
      gold: 'from-amber-700 via-yellow-600 to-amber-900',
      indigo: 'from-blue-700 via-indigo-700 to-slate-900',
      emerald: 'from-emerald-700 via-teal-800 to-slate-900',
      rose: 'from-rose-800 via-purple-900 to-black',
      dark: 'from-neutral-800 via-zinc-800 to-black',
    };

    const updatedEvent: DetailedEventItem = {
      id: eventId,
      title: formTitle.trim(),
      subtitle: formSubtitle.trim() || `${formCategoryLabel} Special`,
      category: formCategory,
      categoryLabel: formCategoryLabel,
      dateStr: formDateStr.trim(),
      shortDate: { month: formMonth.toUpperCase(), day: formDay },
      time: formTime.trim(),
      venue: formVenue.trim(),
      summary: formSummary.trim() || formAboutText.trim(),
      aboutText: formAboutText.trim() || formSummary.trim(),
      attendees: editingEventId ? (events.find((e) => e.id === editingEventId)?.attendees || 120) : 0,
      badge: formBadge.trim(),
      gradient: gradientMap[formPassTheme as keyof typeof gradientMap] || 'from-amber-700 to-black',
      iconName: formCategory === 'tech' ? 'Code' : formCategory === 'sports' ? 'Trophy' : 'Sparkles',
      isFree: formIsFree,
      ticketPrice: formIsFree ? 0 : Number(formTicketPrice) || 0,
      passColorTheme: formPassTheme,
      rules: formRules,
      perks: formPerks,
      status: 'active',
      organizer: formOrganizer.trim() || 'Swaminarayan University Directorate',
      bannerImage: formBannerImage.trim(),
    };

    if (editingEventId) {
      DatabaseService.updateEvent(editingEventId, updatedEvent);
      showToast(`Event "${formTitle}" updated successfully!`);
    } else {
      DatabaseService.addEvent(updatedEvent);
      showToast(`New Event "${formTitle}" published!`);
    }

    setIsEventModalOpen(false);
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      DatabaseService.deleteEvent(id);
      showToast(`Event "${title}" removed.`);
    }
  };

  const handleAddRule = () => {
    if (newRuleInput.trim()) {
      setFormRules([...formRules, newRuleInput.trim()]);
      setNewRuleInput('');
    }
  };

  const handleRemoveRule = (index: number) => {
    setFormRules(formRules.filter((_, i) => i !== index));
  };

  const handleAddPerk = () => {
    if (newPerkInput.trim()) {
      setFormPerks([...formPerks, newPerkInput.trim()]);
      setNewPerkInput('');
    }
  };

  const handleRemovePerk = (index: number) => {
    setFormPerks(formPerks.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormBannerImage(reader.result as string);
        showToast('Event banner photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const PRESET_BANNERS = [
    { label: 'Garba Night Gala', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80' },
    { label: 'Tech Hackathon / AI', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80' },
    { label: 'Sports Turf & Meet', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80' },
    { label: 'Academic Convocation', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80' },
  ];

  // Free Pass Issuance Handler
  const handleOpenIssuePass = (defaultEventId?: string) => {
    setIssueEventId(defaultEventId || (events[0]?.id ?? 'thanganat-5'));
    setIssueStudentName('');
    setIssueStudentRoll('SU2024' + Math.floor(10000 + Math.random() * 90000));
    setIssueStudentEmail('');
    setIssueStudentPhone('+91 9');
    setIssuePassTier('Admin Free Pass');
    setIsIssuePassModalOpen(true);
  };

  const handleIssuePassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueStudentName.trim()) {
      showToast('Please enter the student name.');
      return;
    }

    const selectedEvt = events.find((e) => e.id === issueEventId) || events[0];
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const passPrefix = selectedEvt.id.slice(0, 5).toUpperCase();
    const newPassId = `SU-${passPrefix}-${randomCode}`;

    const newAttendee: AttendeeRecord = {
      id: `att-${Date.now()}`,
      passId: newPassId,
      eventId: selectedEvt.id,
      eventTitle: selectedEvt.title,
      studentName: issueStudentName.trim(),
      studentRoll: issueStudentRoll.trim(),
      studentCourse: issueStudentCourse,
      studentEmail: issueStudentEmail.trim() || `${issueStudentRoll.toLowerCase()}@swaminarayanuniversity.ac.in`,
      studentPhone: issueStudentPhone.trim() || '+91 98000 00000',
      studentAvatar: '',
      passType: issuePassTier,
      bookingDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isCheckedIn: false,
      seatZone: 'VIP Pavilion • Row 1',
      gateInfo: 'Gate 02 • FastPass Entry',
      pricePaid: 0,
      paymentMethod: 'Admin Complimentary Free Pass',
    };

    DatabaseService.addAttendee(newAttendee);
    showToast(`Free Pass ${newPassId} issued to ${issueStudentName}!`);
    setIsIssuePassModalOpen(false);
  };

  // Check-In Toggle
  const handleToggleAttendeeCheckIn = (attendeeId: string) => {
    const updated = DatabaseService.toggleCheckIn(attendeeId);
    if (updated) {
      showToast(`Pass ${updated.passId} marked as ${updated.isCheckedIn ? 'Checked-In (Verified)' : 'Pending Entry'}`);
    }
  };

  // Live Pass Verification Lookup
  const handleScanLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const q = scanQuery.trim().toLowerCase();
    if (!q) return;

    const matched = attendees.find(
      (a) => a.passId.toLowerCase() === q || 
             a.studentRoll.toLowerCase() === q || 
             a.studentName.toLowerCase().includes(q) ||
             (q.includes(a.passId.toLowerCase()))
    );

    if (matched) {
      setScanResult(matched);
      setScanStatus('found');
    } else {
      setScanResult(null);
      setScanStatus('notFound');
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matchCat = selectedCategoryFilter === 'all' || evt.category === selectedCategoryFilter;
    const matchQ = evt.title.toLowerCase().includes(eventSearch.toLowerCase()) || 
                   evt.venue.toLowerCase().includes(eventSearch.toLowerCase());
    return matchCat && matchQ;
  });

  const filteredAttendees = attendees.filter((att) => {
    const matchEvt = selectedEventFilter === 'all' || att.eventId === selectedEventFilter;
    const matchQ = att.studentName.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
                   att.studentRoll.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
                   att.passId.toLowerCase().includes(attendeeSearch.toLowerCase());
    return matchEvt && matchQ;
  });

  // If locked, render PIN Gate
  if (!isUnlocked) {
    return (
      <main className="min-h-screen bg-[#fbfbf9] text-[#111116] flex items-center justify-center p-4">
        <div className="bg-white border border-[#e8e5dc] rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#fed65b]/20 border border-[#d4af37]/40 text-[#7b5800] flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[10px] font-bold uppercase tracking-wider text-[#b8860b] mb-2 border border-[#d4af37]/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Administrative Security Guard
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#111116]">
              Admin Portal Access
            </h2>
            <p className="text-xs text-[#62626e] mt-1.5 leading-relaxed">
              Manage live campus events, upload new programs, issue free student passes, and monitor attendees.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#111116] text-left mb-1.5">
                Admin Security Passcode / PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter Passcode (trident1593)"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#e8e5dc] text-sm focus:border-[#b8860b] outline-none font-mono"
                  autoFocus
                />
                <Key className="w-4 h-4 text-[#888894] absolute right-3.5 top-3.5" />
              </div>
              {pinError && (
                <p className="text-rose-600 text-[11px] text-left mt-1.5 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gold-gradient text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Controls</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-[#f4f3ef] text-center">
            <p className="text-[11px] text-[#888894]">
              Authorized Admin Credential: <code className="bg-[#f4f3ef] px-2 py-0.5 rounded font-mono text-[#b8860b] font-bold">trident1593</code>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbfbf9] text-[#111116] pb-20">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-[#111116] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-[#d4af37]/40 animate-in slide-in-from-top duration-300">
          <Check className="w-4 h-4 text-[#fed65b]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Top Header Banner */}
      <section className="bg-gradient-to-r from-[#111116] via-[#1c1b24] to-[#252014] text-white border-b border-[#d4af37]/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#d4af37]/40 text-[10px] font-bold uppercase tracking-widest text-[#fed65b]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Directorate of Student Affairs & Campus Security
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              CampusConnect <span className="text-[#fed65b] italic font-normal">Admin Portal</span>
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl">
              Master control center for event uploads, ticketing rules, complimentary passes, gate check-in scanning, and attendee directories.
            </p>
          </div>

          {/* Quick Actions & Lock */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreateEvent}
              className="bg-gold-gradient text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Event</span>
            </button>
            <button
              onClick={() => handleOpenIssuePass()}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4 text-[#fed65b]" />
              <span>Grant Free Pass</span>
            </button>
            <button
              onClick={handleLock}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white transition-colors"
              title="Lock Admin Mode"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Pills */}
        <div className="max-w-[1440px] mx-auto mt-6 pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: 'events', label: '🎪 Events Manager', count: events.length },
            { id: 'attendees', label: '👥 Attendees Directory', count: attendees.length },
            { id: 'scanner', label: '📱 Gate QR Scanner', count: null },
            { id: 'feedback', label: '💬 Student Feedback', count: feedbackList.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-white text-[#111116] shadow-md'
                  : 'text-neutral-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-amber-100 text-amber-900 font-extrabold' : 'bg-white/20 text-white'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Main Admin Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Admin Capabilities & Control Center Guide Banner */}
        <div className="bg-white border border-[#e8e5dc] rounded-3xl p-5 sm:p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f4f3ef] pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-[#d4af37]/40 flex items-center justify-center text-[#b8860b]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#111116]">
                  Admin Capabilities & Power Center (एडमिन क्या-क्या कर सकते हैं)
                </h3>
                <p className="text-xs text-[#62626e]">
                  Swaminarayan University EventHive Complete Operational Capabilities
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[10px] font-bold text-[#15803d] border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              Active Passkey: trident1593
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#fbfbf9] border border-[#e8e5dc] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#111116]">
                <Calendar className="w-4 h-4 text-[#b8860b]" />
                <span>1. Event Upload & Editor</span>
              </div>
              <p className="text-[11px] text-[#62626e] leading-relaxed">
                Naye event upload karein, photo/banner lagayein, category, date/time, venue, rules, perks, aur Free vs Paid UPI ticket customize karein.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fbfbf9] border border-[#e8e5dc] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#111116]">
                <Ticket className="w-4 h-4 text-[#b8860b]" />
                <span>2. Grant Free Passes</span>
              </div>
              <p className="text-[11px] text-[#62626e] leading-relaxed">
                Kisi bhi scholar/student ko unke Roll No par complimentary VIP free pass issue karein, instant unique QR code generate ho jata hai.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fbfbf9] border border-[#e8e5dc] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#111116]">
                <QrCode className="w-4 h-4 text-[#b8860b]" />
                <span>3. Gate QR Turnstile Scanner</span>
              </div>
              <p className="text-[11px] text-[#62626e] leading-relaxed">
                Campus gates par students ke QR pass ya Roll No ko lookup karein, instant authentic verification aur check-in status toggle karein.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#fbfbf9] border border-[#e8e5dc] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#111116]">
                <Users className="w-4 h-4 text-[#b8860b]" />
                <span>4. Attendees & Feedback</span>
              </div>
              <p className="text-[11px] text-[#62626e] leading-relaxed">
                Live attendee roster dekhein (kisne kab pass liya, payment type) aur students dwara diye gaye feedback/reviews review karein.
              </p>
            </div>
          </div>
        </div>

        {/* ===================== TAB 1: EVENTS MANAGER ===================== */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Search and Category Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white border border-[#e8e5dc] rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#888894]" />
                <input
                  type="text"
                  placeholder="Search events by title, venue, or keywords..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent outline-none"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'cultural', label: 'Cultural' },
                  { id: 'tech', label: 'Tech' },
                  { id: 'sports', label: 'Sports' },
                  { id: 'workshops', label: 'Workshops' },
                  { id: 'diplomatic', label: 'Diplomatic' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategoryFilter(c.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === c.id
                        ? 'bg-[#111116] text-white'
                        : 'bg-[#f4f3ef] text-[#62626e] hover:bg-[#e8e5dc]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white border border-[#e8e5dc] rounded-3xl overflow-hidden shadow-sm hover:shadow-card-elevated transition-all flex flex-col justify-between"
                >
                  {/* Top Badge & Header */}
                  <div>
                    <div className={`p-4 ${evt.bannerImage ? 'relative min-h-[140px]' : `bg-gradient-to-r ${evt.gradient}`} text-white relative overflow-hidden flex flex-col justify-between`}>
                      {evt.bannerImage && (
                        <>
                          <img src={evt.bannerImage} alt={evt.title} className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/30" />
                        </>
                      )}
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                          {evt.categoryLabel}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                          {evt.isFree ? 'Free Pass' : `₹${evt.ticketPrice || 199}`}
                        </span>
                      </div>
                      <div className="relative z-10 mt-3">
                        <h3 className="font-serif font-bold text-lg text-white leading-snug drop-shadow-sm">
                          {evt.title}
                        </h3>
                        {evt.subtitle && (
                          <p className="text-xs text-amber-200 mt-0.5 line-clamp-1 drop-shadow-sm">{evt.subtitle}</p>
                        )}
                      </div>
                    </div>

                    {/* Details Body */}
                    <div className="p-4 space-y-3">
                      <div className="space-y-1 text-xs text-[#62626e]">
                        <p className="flex items-center gap-1.5 font-medium text-[#111116]">
                          <Calendar className="w-3.5 h-3.5 text-[#b8860b]" />
                          <span>{evt.dateStr}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#888894]" />
                          <span className="line-clamp-1">{evt.venue}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#888894]" />
                          <span>{evt.attendees} Registered Attendees</span>
                        </p>
                      </div>

                      <p className="text-xs text-[#62626e] line-clamp-2 leading-relaxed">
                        {evt.summary}
                      </p>

                      {/* Perks Preview */}
                      {evt.perks && evt.perks.length > 0 && (
                        <div className="pt-2 border-t border-[#f4f3ef] flex flex-wrap gap-1">
                          {evt.perks.slice(0, 2).map((perk, pi) => (
                            <span key={pi} className="text-[10px] bg-amber-50 text-[#7b5800] px-2 py-0.5 rounded border border-[#d4af37]/30">
                              ✓ {perk}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Controls */}
                  <div className="p-4 bg-[#fbfbf9] border-t border-[#e8e5dc] flex items-center justify-between">
                    <button
                      onClick={() => handleOpenIssuePass(evt.id)}
                      className="text-xs font-bold text-[#b8860b] hover:underline flex items-center gap-1"
                    >
                      <Ticket className="w-3.5 h-3.5" />
                      Issue Free Pass
                    </button>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditEvent(evt)}
                        className="p-2 rounded-lg bg-white border border-[#e8e5dc] text-[#111116] hover:bg-[#f4f3ef] transition-colors"
                        title="Edit Event Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt.id, evt.title)}
                        className="p-2 rounded-lg bg-white border border-[#e8e5dc] text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ATTENDEES DIRECTORY ===================== */}
        {activeTab === 'attendees' && (
          <div className="space-y-6">
            {/* Filter toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-white border border-[#e8e5dc] rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#888894]" />
                <input
                  type="text"
                  placeholder="Search attendee by student name, roll number, or Pass ID..."
                  value={attendeeSearch}
                  onChange={(e) => setAttendeeSearch(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-transparent outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="text-xs bg-[#fbfbf9] border border-[#e8e5dc] rounded-xl px-3 py-2 outline-none font-medium"
                >
                  <option value="all">All Events ({attendees.length})</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>

                <button
                  onClick={() => handleOpenIssuePass()}
                  className="bg-gold-gradient text-white px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shadow-sm hover:opacity-95"
                >
                  + Issue Free Pass
                </button>
              </div>
            </div>

            {/* Attendees Table / Card List */}
            <div className="bg-white border border-[#e8e5dc] rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#fbfbf9] border-b border-[#e8e5dc] text-[#62626e] uppercase tracking-wider font-semibold text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Attendee / Scholar</th>
                      <th className="py-3.5 px-4">Event Program</th>
                      <th className="py-3.5 px-4">Pass ID & Tier</th>
                      <th className="py-3.5 px-4">Gate / Seat</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4f3ef]">
                    {filteredAttendees.map((att) => (
                      <tr key={att.id} className="hover:bg-[#fcfbf7] transition-colors">
                        {/* Student Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#fed65b] to-[#d4af37] text-[#745c00] font-bold text-xs flex items-center justify-center shrink-0">
                              {att.studentAvatar ? (
                                <img src={att.studentAvatar} alt={att.studentName} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                att.studentName[0]
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-[#111116]">{att.studentName}</div>
                              <div className="text-[10px] font-mono text-[#888894]">{att.studentRoll}</div>
                              <div className="text-[10px] text-[#62626e] truncate max-w-[180px]">{att.studentCourse}</div>
                            </div>
                          </div>
                        </td>

                        {/* Event Column */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-[#111116] line-clamp-1">{att.eventTitle}</div>
                          <div className="text-[10px] text-[#888894]">{att.bookingDate}</div>
                        </td>

                        {/* Pass ID & Tier */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-[#b8860b]">{att.passId}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-[#7b5800] border border-[#d4af37]/30">
                            {att.passType}
                          </span>
                        </td>

                        {/* Gate / Seat */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#111116]">{att.gateInfo}</div>
                          <div className="text-[10px] text-[#888894]">{att.seatZone}</div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {att.isCheckedIn ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle2 className="w-3 h-3" />
                              Checked-In ({att.checkedInAt || 'Verified'})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              <Clock className="w-3 h-3" />
                              Pending Entry
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleAttendeeCheckIn(att.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              att.isCheckedIn
                                ? 'bg-neutral-100 text-[#62626e] hover:bg-neutral-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                            }`}
                          >
                            {att.isCheckedIn ? 'Undo Check-In' : 'Mark Entry'}
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredAttendees.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#888894]">
                          No attendees found matching current filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 3: GATE QR SCANNER ===================== */}
        {activeTab === 'scanner' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
                <QrCode className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-[#111116]">
                  Live Entry Gate QR Verification
                </h3>
                <p className="text-xs text-[#62626e] mt-1.5 max-w-md mx-auto">
                  Scan pass with turnstile camera or enter the Student Pass ID / Roll Number below to verify legitimacy and authorize physical venue admission.
                </p>
              </div>

              {/* Input Form */}
              <form onSubmit={handleScanLookup} className="flex gap-2 max-w-md mx-auto">
                <input
                  type="text"
                  placeholder="Enter Pass ID (e.g. SU-THANG-88421) or Roll No..."
                  value={scanQuery}
                  onChange={(e) => setScanQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b] font-mono"
                />
                <button
                  type="submit"
                  className="bg-[#111116] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#22222c] transition-colors"
                >
                  Verify
                </button>
              </form>

              {/* Sample Fast Buttons for Demonstration */}
              <div className="flex flex-wrap justify-center items-center gap-2 pt-2 text-[11px] text-[#888894]">
                <span>Quick demo passes:</span>
                {attendees.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setScanQuery(a.passId);
                      setScanResult(a);
                      setScanStatus('found');
                    }}
                    className="px-2 py-0.5 bg-[#f4f3ef] hover:bg-[#e8e5dc] rounded font-mono text-[#b8860b] font-bold"
                  >
                    {a.passId}
                  </button>
                ))}
              </div>
            </div>

            {/* Scan Result Box */}
            {scanStatus === 'found' && scanResult && (
              <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-xl animate-in zoom-in-95 space-y-5">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                        Authentication Verified
                      </span>
                      <h4 className="font-serif font-bold text-lg text-[#111116]">
                        Valid Entry Pass — {scanResult.passId}
                      </h4>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    scanResult.isCheckedIn ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {scanResult.isCheckedIn ? 'Already Checked-In' : 'Ready For Entry'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#e8e5dc]">
                    <span className="text-[10px] text-[#888894] uppercase block font-semibold">Student Name</span>
                    <strong className="text-sm text-[#111116] block">{scanResult.studentName}</strong>
                    <span className="font-mono text-[11px] text-[#62626e]">{scanResult.studentRoll}</span>
                  </div>

                  <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#e8e5dc]">
                    <span className="text-[10px] text-[#888894] uppercase block font-semibold">Event Program</span>
                    <strong className="text-xs text-[#111116] block line-clamp-1">{scanResult.eventTitle}</strong>
                    <span className="text-[11px] text-[#b8860b] font-semibold">{scanResult.passType}</span>
                  </div>

                  <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#e8e5dc]">
                    <span className="text-[10px] text-[#888894] uppercase block font-semibold">Assigned Turnstile</span>
                    <strong className="text-xs text-[#111116] block">{scanResult.gateInfo}</strong>
                  </div>

                  <div className="p-3 bg-[#fbfbf9] rounded-xl border border-[#e8e5dc]">
                    <span className="text-[10px] text-[#888894] uppercase block font-semibold">Seating Zone</span>
                    <strong className="text-xs text-[#111116] block">{scanResult.seatZone}</strong>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => handleToggleAttendeeCheckIn(scanResult.id)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{scanResult.isCheckedIn ? 'Reverse Check-In Status' : 'Authorize Gate Entry & Scan In'}</span>
                  </button>
                </div>
              </div>
            )}

            {scanStatus === 'notFound' && (
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center text-rose-800 space-y-2">
                <XCircle className="w-8 h-8 text-rose-600 mx-auto" />
                <h4 className="font-bold text-sm">Pass Not Recognized in University Registry</h4>
                <p className="text-xs text-rose-700">
                  No ticket matched query &ldquo;{scanQuery}&rdquo;. Check for typo or counterfeit wristband.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 4: STUDENT FEEDBACK ===================== */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#e8e5dc]">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#111116]">
                    Student & Attendee Feedback
                  </h3>
                  <p className="text-xs text-[#62626e] mt-1">
                    Real reviews and suggestions submitted by attendees across all campus events.
                  </p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-[#b8860b] border border-[#d4af37]/30">
                  {feedbackList.length} Submissions
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedbackList.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-5 rounded-2xl bg-[#fbfbf9] border border-[#e8e5dc] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#888894] font-mono">{fb.createdAt}</span>
                    </div>

                    <p className="text-xs text-[#111116] leading-relaxed italic">
                      &ldquo;{fb.message}&rdquo;
                    </p>

                    <div className="pt-2 border-t border-[#e8e5dc] flex items-center justify-between text-[11px]">
                      <div>
                        <strong className="text-[#111116] block">{fb.studentName}</strong>
                        <span className="text-[#888894] font-mono">{fb.studentRoll}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-white border border-[#e8e5dc] text-[#62626e] font-medium text-[10px]">
                        {fb.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== MODAL: CREATE / EDIT EVENT ===================== */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-y-auto border border-[#e8e5dc]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#e8e5dc] px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#b8860b]" />
                <h3 className="font-serif font-bold text-lg text-[#111116]">
                  {editingEventId ? 'Edit Event Details' : 'Upload New Campus Event'}
                </h3>
              </div>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#f4f3ef] hover:bg-[#e8e5dc] flex items-center justify-center transition-colors text-[#111116]"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveEvent} className="p-6 space-y-5 text-xs">
              {/* Event Title & Subtitle */}
              <div className="space-y-3">
                <div>
                  <label className="block font-semibold text-[#111116] mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thanganat 2026 — Live Garba Mahotsav"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#111116] mb-1">
                    Subtitle / Theme Line
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9 Nights of Traditional Folk Rhythm"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[#111116] mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setFormCategory(val);
                      const map: Record<string, string> = {
                        cultural: 'Cultural & Arts',
                        tech: 'Tech & Coding',
                        sports: 'Sports & E-Sports',
                        workshops: 'Workshops & Seminars',
                        diplomatic: 'Diplomatic Club',
                      };
                      setFormCategoryLabel(map[val] || 'Campus Event');
                    }}
                    className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b] bg-white"
                  >
                    <option value="cultural">Cultural & Arts</option>
                    <option value="tech">Tech & Coding</option>
                    <option value="sports">Sports & E-Sports</option>
                    <option value="workshops">Workshops & Seminars</option>
                    <option value="diplomatic">Diplomatic Club</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#111116] mb-1">
                    Badge / Status Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Happening Now / Flagship Event"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                  />
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#111116] mb-1">
                    Date & Timing Label *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wed, Oct 4 • 7:00 PM - 12:00 AM"
                    value={formDateStr}
                    onChange={(e) => setFormDateStr(e.target.value)}
                    className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#111116] mb-1">
                    Short Tag (Mon / Day)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="OCT"
                      value={formMonth}
                      onChange={(e) => setFormMonth(e.target.value)}
                      className="w-1/2 px-2 py-2 border border-[#e8e5dc] rounded-xl text-center uppercase font-bold"
                    />
                    <input
                      type="text"
                      placeholder="04"
                      value={formDay}
                      onChange={(e) => setFormDay(e.target.value)}
                      className="w-1/2 px-2 py-2 border border-[#e8e5dc] rounded-xl text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block font-semibold text-[#111116] mb-1">
                  Venue & Gate Instructions *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Cricket Ground, SU Campus (Gate 02 Turnstile)"
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                />
              </div>

              {/* Summary / About */}
              <div>
                <label className="block font-semibold text-[#111116] mb-1">
                  Summary & About Section *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Write full details about the fest, what attendees can expect, attire, acoustic arrangements..."
                  value={formAboutText}
                  onChange={(e) => {
                    setFormAboutText(e.target.value);
                    setFormSummary(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                />
              </div>

              {/* Ticketing & Free Pass Settings */}
              <div className="p-4 bg-[#fbfbf9] rounded-2xl border border-[#e8e5dc] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <strong className="block text-[#111116]">Ticket Pricing Policy</strong>
                    <span className="text-[11px] text-[#62626e]">Toggle whether attendees can claim free pass or pay via UPI QR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFormIsFree(true);
                        setFormTicketPrice(0);
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-xs ${
                        formIsFree ? 'bg-[#111116] text-white' : 'bg-white border text-[#62626e]'
                      }`}
                    >
                      Free Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormIsFree(false)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs ${
                        !formIsFree ? 'bg-[#b8860b] text-white' : 'bg-white border text-[#62626e]'
                      }`}
                    >
                      Paid Pass (UPI)
                    </button>
                  </div>
                </div>

                {!formIsFree && (
                  <div className="flex items-center gap-3 pt-2">
                    <span className="font-semibold text-[#111116]">Ticket Fee (₹ INR):</span>
                    <input
                      type="number"
                      min={10}
                      value={formTicketPrice}
                      onChange={(e) => setFormTicketPrice(Number(e.target.value))}
                      className="w-28 px-3 py-1.5 border rounded-lg font-mono font-bold text-[#b8860b]"
                    />
                  </div>
                )}
              </div>

              {/* Pass Color Theme */}
              <div>
                <label className="block font-semibold text-[#111116] mb-1.5">
                  Digital Pass Color Theme
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'gold', label: 'Gold (Garba)', class: 'bg-amber-600' },
                    { id: 'indigo', label: 'Indigo (Tech)', class: 'bg-indigo-600' },
                    { id: 'emerald', label: 'Emerald (Sports)', class: 'bg-emerald-600' },
                    { id: 'rose', label: 'Rose (Music)', class: 'bg-rose-600' },
                    { id: 'dark', label: 'Dark (Classic)', class: 'bg-neutral-900' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setFormPassTheme(thm.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        formPassTheme === thm.id ? 'border-[#111116] ring-2 ring-[#d4af37]' : 'border-[#e8e5dc]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${thm.class}`} />
                      <span className="text-[10px] font-semibold">{thm.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Event Visual Photo / Banner (Visible to users) */}
              <div className="p-4 bg-[#fbfbf9] rounded-2xl border border-[#e8e5dc] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-[#111116]">
                      Event Cover Photo / Visual Banner *
                    </label>
                    <span className="text-[11px] text-[#62626e]">
                      Upload an image file from device, paste a URL, or choose a campus preset.
                    </span>
                  </div>
                  {formBannerImage && (
                    <button
                      type="button"
                      onClick={() => setFormBannerImage('')}
                      className="text-[11px] text-rose-600 font-semibold hover:underline"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {/* Banner Preview */}
                {formBannerImage && (
                  <div className="relative h-32 rounded-xl overflow-hidden border border-[#d4af37]/40 shadow-sm">
                    <img src={formBannerImage} alt="Event Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                    <span className="absolute bottom-2 left-3 text-white text-[11px] font-bold">
                      ✓ Photo Active — Visible on Campus Gateways
                    </span>
                  </div>
                )}

                {/* File Upload & URL Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[11px] font-semibold text-[#111116] mb-1">
                      Option A: Upload From Computer / Phone
                    </span>
                    <label className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-[#d4af37]/60 hover:border-[#b8860b] bg-white rounded-xl text-xs font-semibold text-[#7b5800] transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Choose Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <span className="block text-[11px] font-semibold text-[#111116] mb-1">
                      Option B: Image Web URL
                    </span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formBannerImage}
                      onChange={(e) => setFormBannerImage(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b] text-xs bg-white"
                    />
                  </div>
                </div>

                {/* Preset University Event Banners */}
                <div>
                  <span className="block text-[11px] font-semibold text-[#62626e] mb-1.5">
                    Or select a university banner preset:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {PRESET_BANNERS.map((pre, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormBannerImage(pre.url)}
                        className={`text-[10px] font-semibold px-2 py-1.5 rounded-lg border text-center transition-all truncate ${
                          formBannerImage === pre.url
                            ? 'bg-[#111116] text-[#fed65b] border-[#111116]'
                            : 'bg-white text-[#2d2d34] border-[#e8e5dc] hover:border-[#b8860b]'
                        }`}
                      >
                        {pre.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Organizer / Directorate */}
              <div>
                <label className="block font-semibold text-[#111116] mb-1">
                  Organizing Body / Directorate *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Swaminarayan University Cultural Directorate, Dept of CSE"
                  value={formOrganizer}
                  onChange={(e) => setFormOrganizer(e.target.value)}
                  className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                />
              </div>

              {/* Dynamic Rules Builder */}
              <div className="space-y-2">
                <label className="block font-semibold text-[#111116]">
                  Event Rules & Guidelines ({formRules.length})
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {formRules.map((r, ri) => (
                    <div key={ri} className="flex items-center justify-between p-2 rounded-xl bg-[#fbfbf9] border border-[#e8e5dc] text-xs">
                      <span className="text-[#2d2d34]">• {r}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(ri)}
                        className="text-rose-500 hover:text-rose-700 font-bold ml-2"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add specific rule (e.g. Traditional dress mandatory, gates close at 8 PM)"
                    value={newRuleInput}
                    onChange={(e) => setNewRuleInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddRule(); }}}
                    className="flex-1 px-3 py-2 border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="px-3 py-2 rounded-xl bg-[#f4f3ef] hover:bg-[#e8e5dc] text-[#111116] font-bold text-xs"
                  >
                    + Add Rule
                  </button>
                </div>
              </div>

              {/* Dynamic Perks Builder */}
              <div className="space-y-2">
                <label className="block font-semibold text-[#111116]">
                  Perks & Privileges ({formPerks.length})
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {formPerks.map((p, pi) => (
                    <div key={pi} className="flex items-center justify-between p-2 rounded-xl bg-[#fbfbf9] border border-[#e8e5dc] text-xs">
                      <span className="text-[#2d2d34]">✓ {p}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePerk(pi)}
                        className="text-rose-500 hover:text-rose-700 font-bold ml-2"
                        title="Remove"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add attendee perk (e.g. Verified digital certificate, Dinner box voucher)"
                    value={newPerkInput}
                    onChange={(e) => setNewPerkInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddPerk(); }}}
                    className="flex-1 px-3 py-2 border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b] text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddPerk}
                    className="px-3 py-2 rounded-xl bg-[#f4f3ef] hover:bg-[#e8e5dc] text-[#111116] font-bold text-xs"
                  >
                    + Add Perk
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 font-semibold text-[#62626e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-gradient text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider shadow-gold-glow hover:opacity-95"
                >
                  {editingEventId ? 'Save Changes' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: ISSUE FREE PASS ===================== */}
      {isIssuePassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 border border-[#e8e5dc] space-y-4 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-[#b8860b]" />
                <h3 className="font-serif font-bold text-base text-[#111116]">
                  Issue Complimentary Free Pass
                </h3>
              </div>
              <button
                onClick={() => setIsIssuePassModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#f4f3ef] hover:bg-[#e8e5dc] flex items-center justify-center"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleIssuePassSubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-[#111116] mb-1">
                  Select Event *
                </label>
                <select
                  value={issueEventId}
                  onChange={(e) => setIssueEventId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white outline-none font-medium"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#111116] mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shivam Tripathi"
                  value={issueStudentName}
                  onChange={(e) => setIssueStudentName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111116] mb-1">
                  Enrollment / Roll Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="SU202204192"
                  value={issueStudentRoll}
                  onChange={(e) => setIssueStudentRoll(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl font-mono outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#111116] mb-1">
                  Course *
                </label>
                <select
                  value={issueStudentCourse}
                  onChange={(e) => setIssueStudentCourse(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white outline-none"
                >
                  {AVAILABLE_COURSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#111116] mb-1">
                  Pass Clearance Tier
                </label>
                <select
                  value={issuePassTier}
                  onChange={(e) => setIssuePassTier(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-white outline-none font-medium"
                >
                  <option value="Admin Free Pass">Admin Free Pass (Full Access)</option>
                  <option value="VIP Student FastPass">VIP Student FastPass</option>
                  <option value="Special Guest Pass">Special Guest Pass</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsIssuePassModalOpen(false)}
                  className="px-3 py-2 text-[#62626e] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gold-gradient text-white px-5 py-2 rounded-xl font-bold uppercase tracking-wider shadow-gold-glow hover:opacity-95"
                >
                  Issue Pass Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
