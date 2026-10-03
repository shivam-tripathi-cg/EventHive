import React, { useState } from 'react';
import { 
  GraduationCap, Shield, UserCheck, Users, Lock, 
  ArrowRight, Key, Mail, Phone, Eye, EyeOff, Sparkles, 
  Check, UserPlus, LogIn, AlertCircle, BookOpen, User 
} from 'lucide-react';
import { UserProfile, AVAILABLE_COURSES, RegisteredAccount } from '../data/eventsData';

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
  // Mode: 'signin' or 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<RoleType>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

  // Handle switching tabs
  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    setErrorMsg('');
    setSuccessMsg('');
    
    // Provide sensible default placeholders for demo
    if (newRole === 'student') {
      setLoginId('SU202204192');
      setLoginPassword('student@2025');
    } else if (newRole === 'admin') {
      setLoginId('admin.affairs@swaminarayanuniversity.ac.in');
      setLoginPassword('SU-ADMIN-SECURE-KEY');
    } else if (newRole === 'faculty') {
      setLoginId('FAC-CSE-804');
      setLoginPassword('faculty@2025');
    } else if (newRole === 'guest') {
      setLoginId('+91 99000 11223');
      setLoginPassword('4829');
    }
  };

  // Sign In Submission - STRICT VALIDATION AGAINST REGISTERED ACCOUNTS
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

    // Match strictly against registeredAccounts
    const matchedAccount = registeredAccounts.find(
      (acc) =>
        acc.loginId.toLowerCase() === trimmedId.toLowerCase() &&
        acc.password === trimmedPw &&
        acc.role === role
    );

    if (!matchedAccount) {
      // Find if ID exists with wrong password or role
      const idExists = registeredAccounts.find(
        (acc) => acc.loginId.toLowerCase() === trimmedId.toLowerCase()
      );

      if (idExists && idExists.role !== role) {
        setErrorMsg(`This ID is registered under the "${idExists.role.toUpperCase()}" role. Please switch tabs.`);
      } else if (idExists) {
        setErrorMsg('Incorrect Password! Please enter the exact password you registered with.');
      } else {
        setErrorMsg(
          `No registered account found for ID "${trimmedId}". Please check your credentials or switch to "Create Account (Sign Up)" below.`
        );
      }
      return;
    }

    // Authenticate with EXACT details of this registered user!
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

    // Check if ID already exists
    const alreadyExists = registeredAccounts.some(
      (acc) => acc.loginId.toLowerCase() === trimmedId.toLowerCase()
    );

    if (alreadyExists) {
      setErrorMsg(`An account with ID "${trimmedId}" is already registered. Please sign in.`);
      return;
    }

    // Create the new account
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

    // Auto-login immediately with the newly registered credentials
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
            {authMode === 'signin' ? 'Sign In to Portal' : 'Create Student / User Account'}
          </h1>
          <p className="text-xs text-[#62626e] max-w-xs mx-auto">
            {authMode === 'signin' 
              ? 'Only registered ID and Password can log in. Passes reflect your exact account credentials.' 
              : 'Register your own ID and Password to claim verified campus event passes.'}
          </p>
        </div>

        {/* Auth Mode Toggle: Sign In vs Sign Up */}
        <div className="flex rounded-2xl bg-white border border-[#e8e5dc] p-1 shadow-sm">
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signin'
                ? 'bg-gold-gradient text-white shadow-gold-glow'
                : 'text-[#62626e] hover:text-[#111116] hover:bg-[#f4f3ef]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'signup'
                ? 'bg-gold-gradient text-white shadow-gold-glow'
                : 'text-[#62626e] hover:text-[#111116] hover:bg-[#f4f3ef]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account (Sign Up)</span>
          </button>
        </div>

        {/* 4 Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-white border border-[#e8e5dc] rounded-2xl shadow-sm">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 ${
              role === 'student'
                ? 'bg-[#111116] text-[#fed65b] shadow-sm'
                : 'text-[#62626e] hover:text-[#111116] hover:bg-[#f4f3ef]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 ${
              role === 'admin'
                ? 'bg-[#111116] text-[#fed65b] shadow-sm'
                : 'text-[#62626e] hover:text-[#111116] hover:bg-[#f4f3ef]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('faculty')}
            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 ${
              role === 'faculty'
                ? 'bg-[#111116] text-[#fed65b] shadow-sm'
                : 'text-[#62626e] hover:text-[#111116] hover:bg-[#f4f3ef]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Faculty</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('guest')}
            className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold transition-all flex flex-col items-center gap-0.5 ${
              role === 'guest'
                ? 'bg-[#111116] text-[#fed65b] shadow-sm'
                : 'text-[#62626e] hover:text-[#111116] hover:bg-[#f4f3ef]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Guest</span>
          </button>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white border border-[#e8e5dc] rounded-3xl p-5 sm:p-7 shadow-card-elevated hover:shadow-card-3d transition-all space-y-5">
          
          {/* Header indicator */}
          <div className="flex items-center justify-between pb-2 border-b border-[#f4f3ef]">
            <span className="text-[11px] font-bold text-[#b8860b] uppercase tracking-wider">
              {role === 'student' && 'Student Portal'}
              {role === 'admin' && 'University Admin'}
              {role === 'faculty' && 'Faculty Member'}
              {role === 'guest' && 'Guest Visitor'}
              {' • '}
              {authMode === 'signin' ? 'Sign In' : 'New Registration'}
            </span>

            {authMode === 'signin' && (
              <span className="text-[10px] text-[#888894] font-mono">
                {registeredAccounts.filter((a) => a.role === role).length} registered
              </span>
            )}
          </div>

          {/* Error / Alert notification */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Success notification */}
          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-start gap-2 animate-in fade-in duration-200">
              <Check className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          {/* ================= MODE 1: SIGN IN ================= */}
          {authMode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              
              {/* ID Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                  {role === 'student' && 'General Register (GR) Number *'}
                  {role === 'admin' && 'Admin Official Email / ID *'}
                  {role === 'faculty' && 'Faculty Staff ID *'}
                  {role === 'guest' && 'Registered Mobile Number *'}
                </label>
                <div className="relative">
                  {role === 'student' && <GraduationCap className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />}
                  {role === 'admin' && <Mail className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />}
                  {role === 'faculty' && <UserCheck className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />}
                  {role === 'guest' && <Phone className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />}
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder={
                      role === 'student' ? 'e.g. SU202204192' :
                      role === 'admin' ? 'admin@swaminarayanuniversity.ac.in' :
                      role === 'faculty' ? 'FAC-CSE-804' : '+91 99000 11223'
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-mono font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                    {role === 'admin' ? 'Security Access Key *' : role === 'guest' ? 'Access Passcode / OTP *' : 'Password *'}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-[#b8860b] hover:underline font-semibold"
                  >
                    Need an account?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your registered password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#888894] hover:text-[#111116]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Sign In Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gold-gradient text-white text-xs sm:text-sm font-bold shadow-gold-glow hover:opacity-95 flex items-center justify-center gap-2 transition-all active:scale-95 pt-2"
              >
                <span>Sign In with Credentials</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* ================= MODE 2: SIGN UP (CREATE ACCOUNT) ================= */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                  Your Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>
              </div>

              {/* ID / GR Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                  {role === 'student' ? 'Assign Student GR / Roll Number *' : 'Assign Employee / User ID *'}
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={signupId}
                    onChange={(e) => setSignupId(e.target.value)}
                    placeholder={role === 'student' ? 'e.g. SU20248812' : 'e.g. FAC-2025'}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-mono font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
                  />
                </div>
              </div>

              {/* Course Selection (For Students) */}
              {role === 'student' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                    Enrolled Academic Course *
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                    <select
                      value={signupCourse}
                      onChange={(e) => setSignupCourse(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] cursor-pointer"
                    >
                      {AVAILABLE_COURSES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                    Set Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="At least 4 chars"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>
                </div>
              </div>

              {/* Contact & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      value={signupContact}
                      onChange={(e) => setSignupContact(e.target.value)}
                      placeholder="+91 98765 00000"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#888894] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="student@su.ac.in"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Sign Up Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gold-gradient text-white text-xs sm:text-sm font-bold shadow-gold-glow hover:opacity-95 flex items-center justify-center gap-2 transition-all active:scale-95 pt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register & Create My Account</span>
              </button>
            </form>
          )}

          {/* Quick Helper Links */}
          <div className="pt-2 text-center text-xs text-[#62626e]">
            {authMode === 'signin' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
                  className="font-bold text-[#b8860b] hover:underline"
                >
                  Create one now (Sign Up)
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
                  className="font-bold text-[#b8860b] hover:underline"
                >
                  Sign In here
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="text-center text-[10px] sm:text-[11px] text-[#888894] flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-[#b8860b]" />
          <span>Swaminarayan University 256-bit Gate Credentials Security</span>
        </div>
      </div>
    </main>
  );
};
