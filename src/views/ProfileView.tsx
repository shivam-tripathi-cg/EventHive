import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Mail, Phone, BookOpen, Award, Camera, Check, 
  Upload, ShieldCheck, ArrowLeft, RefreshCw, Calendar, Sparkles, AlertCircle,
  Activity, Ticket, Bookmark, Eye, MessageSquare, LogIn, Clock
} from 'lucide-react';
import { UserProfile, AVAILABLE_COURSES } from '../data/eventsData';
import { DatabaseService, UserActivityLog } from '../data/dbStore';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'wishlist' | 'admin') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigate,
}) => {
  const [profileTab, setProfileTab] = useState<'profile' | 'activity'>('profile');
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [gender, setGender] = useState(userProfile.gender);
  const [course, setCourse] = useState(userProfile.course);
  const [rollNumber, setRollNumber] = useState(userProfile.rollNumber);
  const [contactNumber, setContactNumber] = useState(userProfile.contactNumber);
  const [email, setEmail] = useState(userProfile.email);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [savedToast, setSavedToast] = useState(false);
  const [activityLogs, setActivityLogs] = useState<UserActivityLog[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const logs = DatabaseService.getActivityLogs(userProfile.rollNumber);
    setActivityLogs(logs);

    const handleUpdate = () => {
      setActivityLogs(DatabaseService.getActivityLogs(userProfile.rollNumber));
    };
    window.addEventListener('eventhive_activity_updated', handleUpdate);
    return () => window.removeEventListener('eventhive_activity_updated', handleUpdate);
  }, [userProfile.rollNumber]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoUrl = reader.result as string;
        setAvatar(photoUrl);

        // Immediate persist and log activity
        const updated: UserProfile = {
          ...userProfile,
          avatar: photoUrl,
        };
        onUpdateProfile(updated);
        DatabaseService.logActivity({
          userId: userProfile.rollNumber,
          type: 'profile_updated',
          title: 'Profile Photo Uploaded',
          description: 'Uploaded and linked new scholar photo to digital gate pass.',
          timestamp: 'Just now',
        });
        setSavedToast(true);
        setTimeout(() => setSavedToast(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatar('');
    const updated: UserProfile = {
      ...userProfile,
      avatar: '',
    };
    onUpdateProfile(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name,
      age: Number(age) || 20,
      gender,
      course,
      rollNumber,
      contactNumber,
      email,
      avatar,
    };
    onUpdateProfile(updated);

    DatabaseService.logActivity({
      userId: rollNumber,
      type: 'profile_updated',
      title: 'Profile Details Saved',
      description: `Updated student record: ${name} (${rollNumber}) - ${course}.`,
      timestamp: 'Just now',
    });

    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getActivityIcon = (type: UserActivityLog['type']) => {
    switch (type) {
      case 'pass_claimed':
      case 'payment_completed':
        return <Ticket className="w-4 h-4 text-[#b8860b]" />;
      case 'wishlist_add':
      case 'wishlist_remove':
        return <Bookmark className="w-4 h-4 text-rose-500" />;
      case 'view_event':
        return <Eye className="w-4 h-4 text-sky-500" />;
      case 'feedback_submitted':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'login':
      case 'logout':
        return <LogIn className="w-4 h-4 text-emerald-500" />;
      default:
        return <Activity className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfbf9] text-[#111116] py-10 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111116] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-[#d4af37]/40 animate-in slide-in-from-bottom duration-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white">Profile Updated Successfully!</div>
            <div className="text-[#a0a0ab] text-[11px]">Photo and credentials saved into permanent student registry.</div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb / Top Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('passes')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#62626e] hover:text-[#111116] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Passes & Vault
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-wider text-[#b8860b]">
            <ShieldCheck className="w-3.5 h-3.5" />
            Official University Identity Card
          </div>
        </div>

        {/* Page Title & Intro */}
        <div className="border-b border-[#e8e5dc] pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#111116]">
            Scholar Profile <span className="font-serif italic text-[#b8860b]">& University ID</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#62626e] mt-1 max-w-2xl">
            Update your student credentials, enrolled academic course, uploaded photo, and review your persistent activity history on campus.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 mt-4 pt-2">
            <button
              onClick={() => setProfileTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                profileTab === 'profile'
                  ? 'bg-[#111116] text-white shadow-sm'
                  : 'bg-white border border-[#e8e5dc] text-[#62626e] hover:bg-[#f4f3ef]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Identity & Information</span>
            </button>

            <button
              onClick={() => setProfileTab('activity')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                profileTab === 'activity'
                  ? 'bg-[#111116] text-white shadow-sm'
                  : 'bg-white border border-[#e8e5dc] text-[#62626e] hover:bg-[#f4f3ef]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>Activity Timeline (Saved History)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                {activityLogs.length}
              </span>
            </button>
          </div>
        </div>

        {/* ===================== TAB 1: PROFILE EDIT FORM ===================== */}
        {profileTab === 'profile' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card 1: Profile Photo Upload */}
            <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#b8860b] mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Profile Photo & Digital Avatar
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar Preview */}
                <div className="relative group shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-[#d4af37] bg-gradient-to-br from-[#fed65b]/40 to-[#d4af37]/20 flex items-center justify-center shadow-md">
                    {avatar ? (
                      <img 
                        src={avatar} 
                        alt="Student Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-[#745c00]">
                        {getInitials(name || 'SU')}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 p-2 bg-[#111116] text-[#fed65b] rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Upload picture"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* Upload Controls */}
                <div className="space-y-3 flex-1 text-center sm:text-left">
                  <div>
                    <h3 className="text-base font-bold text-[#111116]">{name || 'Shivam Tripathi'}</h3>
                    <p className="text-xs text-[#62626e]">{course}</p>
                    <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#f4f3ef] text-[#745c00] font-semibold">
                      Enrollment No: {rollNumber}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-gold-gradient text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:opacity-95 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload New Photo
                    </button>
                    {avatar && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="px-3 py-2 rounded-xl border border-[#e8e5dc] text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-[#888894]">
                    Photo is dynamically embossed on all your digital QR event entry passes.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Student Academic Information */}
            <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#b8860b] flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Academic & Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111116] mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111116] mb-1">
                    University Roll / GR Number
                  </label>
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b] font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#111116] mb-1">
                    Enrolled Academic Course / Discipline
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b] bg-white"
                  >
                    {AVAILABLE_COURSES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111116] mb-1">
                    Institutional Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111116] mb-1">
                    Mobile Contact Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#e8e5dc] rounded-xl outline-none focus:border-[#b8860b]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <button
                  type="submit"
                  className="bg-gold-gradient text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Profile Updates
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ===================== TAB 2: ACTIVITY TIMELINE ===================== */}
        {profileTab === 'activity' && (
          <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#e8e5dc]">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#111116]">
                  User Activity Log & History
                </h3>
                <p className="text-xs text-[#62626e] mt-0.5">
                  Every interaction across passes, wishlists, and payments is timestamped and persisted.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-[#b8860b] border border-[#d4af37]/30">
                {activityLogs.length} Events Tracked
              </span>
            </div>

            {/* Timeline Items */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#e8e5dc]">
              {activityLogs.map((log) => (
                <div key={log.id} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-white border-2 border-[#b8860b] flex items-center justify-center shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b8860b]"></span>
                  </div>

                  <div className="p-4 bg-[#fbfbf9] rounded-2xl border border-[#e8e5dc] hover:border-[#d4af37]/60 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#111116]">
                        {getActivityIcon(log.type)}
                        <span>{log.title}</span>
                      </div>
                      <span className="text-[10px] text-[#888894] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {log.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-[#62626e] mt-1.5 leading-relaxed">
                      {log.description}
                    </p>

                    {log.passId && (
                      <div className="mt-2 inline-block font-mono text-[10px] font-bold text-[#b8860b] bg-amber-50 px-2 py-0.5 rounded border border-[#d4af37]/30">
                        Pass ID: {log.passId}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {activityLogs.length === 0 && (
                <div className="text-center py-8 text-[#888894] text-xs">
                  No activity logs recorded yet. Book passes or save events to build your timeline!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
