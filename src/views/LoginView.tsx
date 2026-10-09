import React, { useState } from 'react';
import { 
  GraduationCap, Shield, UserCheck, Users, Lock, 
  ArrowRight, Key, Mail, Phone, Eye, EyeOff, Sparkles, 
  Check, UserPlus, LogIn, AlertCircle, BookOpen, User,
  Smartphone, MessageSquare, RefreshCw
} from 'lucide-react';
import { UserProfile, AVAILABLE_COURSES, RegisteredAccount } from '../data/eventsData';
import { DatabaseService } from '../data/dbStore';

interface LoginViewProps {
  onLoginSuccess: (profile: Partial<UserProfile>) => void;
  onNavigate: (view: 'home' | 'explore' | 'details' | 'passes') => void;
  registeredAccounts: RegisteredAccount[];
  onRegisterAccount: (newAccount: RegisteredAccount) => void;
}

type RoleType = 'student' | 'admin' | 'faculty' | 'guest';

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigate,
  registeredAccounts,
  onRegisterAccount,
}) => {
  // Method: 'mobile_otp' vs 'credentials'
  const [authMethod, setAuthMethod] = useState<'mobile_otp' | 'credentials'>('mobile_otp');
  
  // Credentials mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<RoleType>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Mobile OTP States
  const [phoneNumber, setPhoneNumber] = useState('9825014920');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(60);
  const [simulatedSms, setSimulatedSms] = useState<string | null>(null);

  // Sign In inputs
  const [loginId, setLoginId] = useState('SU202204192');
  const [loginPassword, setLoginPassword] = useState('student@2025');

  // Sign Up inputs
  const [signupName, setSignupName] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupCourse, setSignupCourse] = useState(AVAILABLE_COURSES[0]);
  const [signupContact, setSignupContact] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  // Handle Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    setOtpTimer(60);

    const smsText = `[SMS from SU-PORTAL]: Your login OTP is ${randomOtp}. Valid for 10 minutes.`;
    setSimulatedSms(smsText);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (enteredOtp.trim() !== generatedOtp.trim()) {
      setErrorMsg('Invalid OTP! Please check the code in the SMS notification above.');
      return;
    }

    // Match phone with registered accounts or fallback
    const matched = registeredAccounts.find(
      (acc) => acc.contactNumber.replace(/\D/g, '').includes(phoneNumber.replace(/\D/g, ''))
    );

    const scholarName = matched ? matched.name : 'Shivam Tripathi';
    const scholarRoll = matched ? matched.loginId : 'SU202204192';
    const scholarCourse = matched ? matched.course : 'B.Tech CSE (Computer Science & Engineering)';
    const scholarRole = matched ? matched.role : 'student';

    DatabaseService.logActivity({
      userId: scholarRoll,
      type: 'login',
      title: 'Logged in via Mobile OTP',
      description: `Authenticated using mobile number +91 ${phoneNumber}.`,
      timestamp: 'Just now',
    });

    onLoginSuccess({
      name: scholarName,
      rollNumber: scholarRoll,
      role: scholarRole,
      course: scholarCourse,
      contactNumber: `+91 ${phoneNumber}`,
      email: matched?.email || `${scholarRoll.toLowerCase()}@swaminarayanuniversity.ac.in`,
      isLoggedIn: true,
    });
  };

  // Handle switching role
  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    setErrorMsg('');
    setSuccessMsg('');
    
    if (newRole === 'student') {
      setLoginId('SU202204192');
      setLoginPassword('student@2025');
    } else if (newRole === 'admin') {
      setLoginId('trident1593');
      setLoginPassword('trident1593');
    } else if (newRole === 'faculty') {
      setLoginId('FAC-CSE-804');
      setLoginPassword('faculty@2025');
    } else if (newRole === 'guest') {
      setLoginId('+91 99000 11223');
      setLoginPassword('4829');
    }
  };

  // Sign In Submission
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedId = loginId.trim();
    const trimmedPw = loginPassword.trim();

    if (!trimmedId || !trimmedPw) {
      setErrorMsg('Please enter both your Login ID and Password.');
      return;
    }

    // Direct verification for the exclusive admin credential trident1593
    if (role === 'admin' || trimmedId === 'trident1593' || trimmedPw === 'trident1593') {
      if (trimmedId === 'trident1593' && trimmedPw === 'trident1593') {
        DatabaseService.logActivity({
          userId: 'trident1593',
          type: 'login',
          title: 'Admin Authenticated',
          description: 'Single admin credential trident1593 verified.',
          timestamp: 'Just now',
        });
        localStorage.setItem('eventhive_admin_unlocked', 'true');
        onLoginSuccess({
          name: 'University Admin',
          rollNumber: 'trident1593',
          role: 'admin',
          course: 'Campus Administration Directorate',
          department: 'Administrative Directorate',
          email: 'admin@swaminarayanuniversity.ac.in',
          contactNumber: '+91 98111 22334',
          age: 38,
          gender: 'Male',
          isLoggedIn: true,
        });
        return;
      } else if (role === 'admin') {
        setErrorMsg('Invalid Admin Credentials! Authorized admin credential is: trident1593');
        return;
      }
    }

    const matchedAccount = registeredAccounts.find(
      (acc) =>
        acc.loginId.toLowerCase() === trimmedId.toLowerCase() &&
        acc.password === trimmedPw &&
        acc.role === role
    );

    if (!matchedAccount) {
      const idExists = registeredAccounts.find(
        (acc) => acc.loginId.toLowerCase() === trimmedId.toLowerCase()
      );

      if (idExists && idExists.role !== role) {
        setErrorMsg(`This ID is registered under the "${idExists.role.toUpperCase()}" role. Please switch tabs.`);
      } else if (idExists) {
        setErrorMsg('Incorrect Password! Please enter the exact password you registered with.');
      } else {
        setErrorMsg(
          `No registered account found for ID "${trimmedId}". Switch to "Create Account (Sign Up)" below.`
        );
      }
      return;
    }

    DatabaseService.logActivity({
      userId: matchedAccount.loginId,
      type: 'login',
      title: 'User Authenticated',
      description: `Signed in with credential ID ${matchedAccount.loginId}.`,
      timestamp: 'Just now',
    });

    onLoginSuccess({
      name: matchedAccount.name,
      rollNumber: matchedAccount.loginId,
      role: matchedAccount.role,
      course: matchedAccount.course,
      email: matchedAccount.email,
      contactNumber: matchedAccount.contactNumber,
      age: matchedAccount.age || 21,
      gender: matchedAccount.gender || 'Male',
      avatar: matchedAccount.avatar || '',
      isLoggedIn: true,
    });
  };

  // Sign Up Submission
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmedName = signupName.trim();
    const trimmedId = signupId.trim();
    const trimmedPw = signupPassword.trim();
    const trimmedContact = signupContact.trim();
    const trimmedEmail = signupEmail.trim();

    if (!trimmedName || !trimmedId || !trimmedPw) {
      setErrorMsg('Please fill in Full Name, ID / GR Number, and Password.');
      return;
    }

    if (trimmedPw.length < 4) {
      setErrorMsg('Password should be at least 4 characters long.');
      return;
    }

    if (trimmedPw !== signupConfirmPassword.trim()) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    const alreadyExists = registeredAccounts.some(
      (acc) => acc.loginId.toLowerCase() === trimmedId.toLowerCase()
    );

    if (alreadyExists) {
      setErrorMsg(`An account with ID "${trimmedId}" is already registered. Please sign in.`);
      return;
    }

    const newAcc: RegisteredAccount = {
      id: `acc-${Date.now()}`,
      name: trimmedName,
      loginId: trimmedId,
      password: trimmedPw,
      role,
      course: role === 'student' ? signupCourse : role === 'admin' ? 'University Administration' : role === 'faculty' ? 'Faculty Member' : 'Campus Visitor',
      department: signupCourse,
      email: trimmedEmail || `${trimmedId.toLowerCase()}@swaminarayanuniversity.ac.in`,
      contactNumber: trimmedContact || '+91 98000 00000',
      age: 21,
      gender: 'Male',
    };

    onRegisterAccount(newAcc);

    DatabaseService.logActivity({
      userId: newAcc.loginId,
      type: 'login',
      title: 'Account Created & Authenticated',
      description: `New user registration for ${newAcc.name} (${newAcc.loginId}).`,
      timestamp: 'Just now',
    });

    onLoginSuccess({
      name: newAcc.name,
      rollNumber: newAcc.loginId,
      role: newAcc.role,
      course: newAcc.course,
      email: newAcc.email,
      contactNumber: newAcc.contactNumber,
      isLoggedIn: true,
    });
  };

  return (
    <main className="min-h-screen bg-[#fbfbf9] text-[#111116] flex items-center justify-center py-8 sm:py-12 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-5">
        
        {/* Brand Header */}
        <div className="text-center space-y-1.5">
          <div 
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 cursor-pointer group"
          >
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#111116] group-hover:text-[#b8860b] transition-colors">
              eventhive<span className="text-[#d4af37]">.in</span>
            </span>
          </div>
          <div className="text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.16em] text-[#b8860b]">
            Swaminarayan University • Central Authentication (CAS)
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#111116] pt-1">
            {authMethod === 'mobile_otp' ? 'Mobile OTP Login' : (authMode === 'signin' ? 'Sign In to Portal' : 'Create User Account')}
          </h1>
          <p className="text-xs text-[#62626e] max-w-xs mx-auto">
            {authMethod === 'mobile_otp'
              ? 'Instant verification via 6-digit one-time SMS passcode sent to your mobile.'
              : 'Individual login with your registered ID and password. Passes reflect your exact account credentials.'}
          </p>
        </div>

        {/* Primary Auth Method Switch: Mobile OTP vs ID/Password */}
        <div className="flex rounded-2xl bg-white border border-[#e8e5dc] p-1 shadow-sm">
          <button
            type="button"
            onClick={() => { setAuthMethod('mobile_otp'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'mobile_otp'
                ? 'bg-[#111116] text-[#fed65b] shadow-sm'
                : 'text-[#62626e] hover:text-[#111116]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile OTP Login</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMethod('credentials'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMethod === 'credentials'
                ? 'bg-[#111116] text-[#fed65b] shadow-sm'
                : 'text-[#62626e] hover:text-[#111116]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>ID & Password</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ===================== FLOW 1: MOBILE OTP ===================== */}
        {authMethod === 'mobile_otp' && (
          <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 shadow-sm space-y-4">
            
            {/* Simulated SMS Alert Banner */}
            {simulatedSms && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs space-y-1.5 animate-in slide-in-from-top">
                <div className="flex items-center justify-between font-bold text-[11px] uppercase tracking-wider text-emerald-800">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    Incoming University SMS
                  </span>
                  <span className="text-emerald-600">Just Now</span>
                </div>
                <p className="font-mono text-xs">{simulatedSms}</p>
                <button
                  type="button"
                  onClick={() => setEnteredOtp(generatedOtp)}
                  className="mt-1 text-[11px] font-bold text-[#b8860b] underline"
                >
                  Click to Auto-fill ({generatedOtp})
                </button>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111116] mb-1.5">
                    Enter Mobile Number (+91)
                  </label>
                  <div className="flex items-center border border-[#e8e5dc] rounded-xl px-3 py-2.5 focus-within:border-[#b8860b]">
                    <span className="text-xs font-bold text-[#62626e] pr-2 border-r border-[#e8e5dc]">+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="98250 14920"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-2 text-sm bg-transparent outline-none font-mono"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-[11px] text-[#888894] mt-1">
                    Demo default: <strong>9825014920</strong> (registered to Shivam Tripathi)
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold-gradient text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Send 6-Digit OTP</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#111116]">
                      Enter 6-Digit Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-[11px] text-[#b8860b] hover:underline"
                    >
                      Change Number
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Enter 6-digit OTP"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full px-4 py-3 border border-[#e8e5dc] rounded-xl text-center text-lg font-mono tracking-widest outline-none focus:border-[#b8860b]"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold-gradient text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Verify OTP & Sign In</span>
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={(e) => handleSendOtp(e)}
                    className="text-xs text-[#62626e] hover:text-[#111116] flex items-center justify-center gap-1 mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ===================== FLOW 2: ID & PASSWORD ===================== */}
        {authMethod === 'credentials' && (
          <div className="space-y-4">
            {/* Mode Switch: Sign In vs Sign Up */}
            <div className="flex rounded-2xl bg-white border border-[#e8e5dc] p-1 shadow-sm">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signin'
                    ? 'bg-gold-gradient text-white shadow-gold-glow'
                    : 'text-[#62626e] hover:text-[#111116]'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signup'
                    ? 'bg-gold-gradient text-white shadow-gold-glow'
                    : 'text-[#62626e] hover:text-[#111116]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up (Register)</span>
              </button>
            </div>

            {/* Role Selectors */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-white border border-[#e8e5dc] rounded-2xl shadow-sm">
              {[
                { id: 'student', label: 'Student', icon: GraduationCap },
                { id: 'admin', label: 'Admin', icon: Shield },
                { id: 'faculty', label: 'Faculty', icon: UserCheck },
                { id: 'guest', label: 'Guest', icon: Users },
              ].map((r) => {
                const IconComponent = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleChange(r.id as RoleType)}
                    className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 ${
                      role === r.id
                        ? 'bg-[#111116] text-[#fed65b] shadow-sm'
                        : 'text-[#62626e] hover:bg-[#f4f3ef]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <div className="bg-white border border-[#e8e5dc] rounded-3xl p-6 shadow-sm">
              {authMode === 'signin' ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#111116] mb-1">
                      {role === 'student' ? 'Student Enrollment / Roll No' : role === 'admin' ? 'Admin Credential ID' : 'Login Identifier / Email'}
                    </label>
                    <input
                      type="text"
                      required
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder={role === 'admin' ? 'trident1593' : undefined}
                      className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl text-sm font-mono outline-none focus:border-[#b8860b]"
                    />
                    {role === 'admin' && (
                      <p className="text-[11px] text-[#888894] mt-1">
                        Authorized Admin ID: <strong className="text-[#b8860b] font-mono">trident1593</strong>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#111116] mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl text-sm outline-none focus:border-[#b8860b]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#888894] hover:text-[#111116]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold-gradient text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Sign In With Credentials</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-[#111116] mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shivam Tripathi"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl text-xs outline-none focus:border-[#b8860b]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#111116] mb-1">Enrollment / GR Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="SU202204192"
                      value={signupId}
                      onChange={(e) => setSignupId(e.target.value)}
                      className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl text-xs font-mono outline-none focus:border-[#b8860b]"
                    />
                  </div>

                  {role === 'student' && (
                    <div>
                      <label className="block font-semibold text-[#111116] mb-1">Academic Program *</label>
                      <select
                        value={signupCourse}
                        onChange={(e) => setSignupCourse(e.target.value)}
                        className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl text-xs outline-none bg-white"
                      >
                        {AVAILABLE_COURSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-[#111116] mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="Create password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl text-xs outline-none focus:border-[#b8860b]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#111116] mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat password"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-[#e8e5dc] rounded-xl text-xs outline-none focus:border-[#b8860b]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gold-gradient text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-gold-glow hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Create Account & Sign In</span>
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
