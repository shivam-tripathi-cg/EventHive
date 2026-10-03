import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, BookOpen, Award, Camera, Check, 
  Upload, ShieldCheck, ArrowLeft, RefreshCw, Calendar, Sparkles, AlertCircle 
} from 'lucide-react';
import { UserProfile, AVAILABLE_COURSES } from '../data/eventsData';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'wishlist') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onNavigate,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age);
  const [gender, setGender] = useState(userProfile.gender);
  const [course, setCourse] = useState(userProfile.course);
  const [rollNumber, setRollNumber] = useState(userProfile.rollNumber);
  const [contactNumber, setContactNumber] = useState(userProfile.contactNumber);
  const [email, setEmail] = useState(userProfile.email);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [savedToast, setSavedToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarPreset = (presetUrl: string) => {
    setAvatar(presetUrl);
  };

  const handleRemovePhoto = () => {
    setAvatar('');
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
            <div className="text-[#a0a0ab] text-[11px]">All your 3 event passes now reflect your updated name & ID.</div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
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
            Update your student credentials, enrolled academic course, contact details, and photo. Changes automatically update your gate passes and event registration badges.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card 1: Profile Photo & Quick Preview */}
          <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 sm:p-8 shadow-card-elevated hover:shadow-card-3d transition-all">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#b8860b] mb-4 flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Profile Photo & Digital Avatar
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-[#d4af37] bg-gradient-to-br from-[#fed65b]/40 to-[#d4af37]/20 flex items-center justify-center shadow-lg">
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
                  className="absolute bottom-2 right-2 p-2 bg-[#111116] text-[#d4af37] rounded-full shadow-lg hover:scale-110 transition-transform"
                  title="Upload picture"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Upload Controls & Presets */}
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <div>
                  <h3 className="text-base font-bold text-[#111116]">{name || 'Dev Patel'}</h3>
                  <p className="text-xs text-[#62626e]">{course}</p>
                  <span className="inline-block mt-1 text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#f4f3ef] text-[#745c00] font-semibold">
                    GR No: {rollNumber}
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
                    className="px-3.5 py-1.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] hover:border-[#b8860b] text-xs font-semibold text-[#111116] flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#b8860b]" />
                    Upload from Device
                  </button>

                  {avatar && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <div className="text-[10px] uppercase font-bold text-[#888894] tracking-wider mb-1.5">
                    Or select campus role avatar style:
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    {[
                      { label: 'Scholar', bg: 'bg-[#fed65b] text-[#745c00]' },
                      { label: 'Medical', bg: 'bg-emerald-600 text-white' },
                      { label: 'Tech CSE', bg: 'bg-indigo-600 text-white' },
                      { label: 'Royal Gold', bg: 'bg-amber-600 text-white' },
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar('')}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${preset.bg} opacity-90 hover:opacity-100 transition-opacity`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Academic & Personal Information */}
          <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 sm:p-8 shadow-card-elevated hover:shadow-card-3d transition-all space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#b8860b] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Academic Credentials & Personal Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                  Full Name (As printed on Pass) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter student full name"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>
              </div>

              {/* GR Number / Roll Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                  GR Number / Student ID *
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    placeholder="e.g. SU202204192"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-mono font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                  Age (Years) *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                  <input
                    type="number"
                    min={16}
                    max={65}
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                  Gender *
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Course Pursued (Dropdown with MBBS, BDS, CSE, Ayurvedic, Homeopathic, etc.) */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#62626e] flex items-center justify-between">
                  <span>Enrolled Academic Course *</span>
                  <span className="text-[10px] text-[#b8860b] font-normal">Printed on Event Pass & Certificate</span>
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20 cursor-pointer"
                  >
                    {AVAILABLE_COURSES.map((crs) => (
                      <option key={crs} value={crs}>
                        {crs}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Contact & Communication */}
          <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 sm:p-8 shadow-card-elevated hover:shadow-card-3d transition-all space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#b8860b] flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Contact Information & Gate Alerts
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Contact Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                  Contact Mobile Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                  University Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@swaminarayanuniversity.ac.in"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-[#d4af37]/30 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#b8860b] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#745c00] leading-relaxed">
                <strong>Campus Pass Synchronization:</strong> When you press <em>Save Profile Changes</em>, your current active event passes (Thanganat 5.0, SU-MUN, and HackSU) will automatically update their attendee name to <strong>{name}</strong> and enrollment code to <strong>{rollNumber}</strong> for gate turnstile verification.
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('passes')}
              className="text-xs font-semibold text-[#62626e] hover:text-[#111116] order-2 sm:order-1"
            >
              Cancel & Return
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gold-gradient text-white text-xs sm:text-sm font-bold shadow-gold-glow hover:opacity-95 flex items-center justify-center gap-2 transition-all active:scale-95 order-1 sm:order-2"
            >
              <Check className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
