/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PassClaimModal } from './components/PassClaimModal';
import { FeedbackModal } from './components/FeedbackModal';
import { SettingsModal, SettingsPreferences } from './components/SettingsModal';
import { HomeView } from './views/HomeView';
import { ExploreView } from './views/ExploreView';
import { EventDetailsView } from './views/EventDetailsView';
import { MyPassesView } from './views/MyPassesView';
import { ProfileView } from './views/ProfileView';
import { LoginView } from './views/LoginView';
import { WishlistView } from './views/WishlistView';
import { 
  CAMPUS_EVENTS, INITIAL_PASSES, INITIAL_USER_PROFILE, DEFAULT_ACCOUNTS,
  EventItem, PassItem, UserProfile, RegisteredAccount 
} from './data/eventsData';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'explore' | 'details' | 'passes' | 'profile' | 'login' | 'wishlist'>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [passes, setPasses] = useState<PassItem[]>(INITIAL_PASSES);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['thanganat-5', 'su-mun-2025']);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(CAMPUS_EVENTS[0]);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [appToast, setAppToast] = useState<string | null>(null);

  // Theme state: light or dark
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('eventhive_theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch (e) {
      console.error(e);
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('eventhive_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Registered accounts stored in state and persisted in localStorage
  const [registeredAccounts, setRegisteredAccounts] = useState<RegisteredAccount[]>(() => {
    try {
      const stored = localStorage.getItem('eventhive_registered_accounts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_ACCOUNTS;
  });

  const handleRegisterAccount = (newAccount: RegisteredAccount) => {
    setRegisteredAccounts((prev) => {
      const updated = [newAccount, ...prev];
      try {
        localStorage.setItem('eventhive_registered_accounts', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast(`Account created for ${newAccount.name} (${newAccount.loginId})!`);
  };

  const showToast = (message: string) => {
    setAppToast(message);
    setTimeout(() => setAppToast(null), 3500);
  };

  const handleNavigate = (view: 'home' | 'explore' | 'details' | 'passes' | 'profile' | 'login' | 'wishlist') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEvent = (event: EventItem) => {
    setSelectedEvent(event);
  };

  const handleOpenClaimModal = (event: EventItem) => {
    setSelectedEvent(event);
    setIsClaimModalOpen(true);
  };

  const handlePassClaimed = (newPass: PassItem) => {
    // Stamp the current user's profile on newly claimed pass
    const customizedPass: PassItem = {
      ...newPass,
      studentName: userProfile.name,
      studentRoll: userProfile.rollNumber,
      studentCourse: userProfile.course,
    };
    setPasses((prev) => [customizedPass, ...prev]);
    showToast(`Pass for "${newPass.eventTitle}" generated successfully!`);
  };

  const handleToggleWishlist = (eventId: string) => {
    setWishlistIds((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      } else {
        return [...prev, eventId];
      }
    });
  };

  const handleRefreshPasses = () => {
    // Re-sync passes with current user credentials
    setPasses((prev) => 
      prev.map((p) => ({
        ...p,
        studentName: userProfile.name,
        studentRoll: userProfile.rollNumber,
        studentCourse: userProfile.course,
      }))
    );
    showToast('Credential Vault synced with Swaminarayan University registry!');
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    // Dynamically update all active passes with the new account name & ID!
    setPasses((prev) =>
      prev.map((pass) => ({
        ...pass,
        studentName: updated.name,
        studentRoll: updated.rollNumber,
        studentCourse: updated.course,
      }))
    );
    showToast(`Profile updated! All 3 event passes now print "${updated.name}" (${updated.rollNumber}).`);
  };

  const handleLogout = () => {
    setUserProfile((prev) => ({
      ...prev,
      isLoggedIn: false,
    }));
    showToast('Logged out of Swaminarayan University CAS session.');
    if (activeView === 'profile') {
      setActiveView('home');
    }
  };

  const handleLoginSuccess = (credentials: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...userProfile,
      ...credentials,
      isLoggedIn: true,
    };
    setUserProfile(updated);
    
    // Update passes with logged in user details
    setPasses((prev) =>
      prev.map((pass) => ({
        ...pass,
        studentName: updated.name,
        studentRoll: updated.rollNumber,
        studentCourse: updated.course,
      }))
    );

    showToast(`Welcome back, ${updated.name}!`);
    setActiveView('passes');
  };

  // Wishlist event objects
  const wishlistEvents = CAMPUS_EVENTS.filter((e) => wishlistIds.includes(e.id));

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-[#0b0b10] text-[#f5f5f8]' : 'bg-[#fbfbf9] text-[#111116]'} flex flex-col font-sans selection:bg-[#fed65b]/40 transition-colors duration-200`}>
      {/* Global App Toast */}
      {appToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#111116] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-semibold border border-[#d4af37]/40 animate-in slide-in-from-top-4 duration-300">
          <Sparkles className="w-4 h-4 text-[#fed65b]" />
          <span>{appToast}</span>
        </div>
      )}

      {/* Universal 3-Zone Navbar */}
      <Navbar
        activeView={activeView}
        onNavigate={handleNavigate}
        activePassCount={passes.length}
        wishlistCount={wishlistIds.length}
        userProfile={userProfile}
        onLogout={handleLogout}
        onOpenFeedback={() => setIsFeedbackModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Dynamic View Container */}
      <div className="flex-1">
        {activeView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onOpenClaimModal={handleOpenClaimModal}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeView === 'explore' && (
          <ExploreView
            onNavigate={handleNavigate}
            onSelectEvent={handleSelectEvent}
            onOpenClaimModal={handleOpenClaimModal}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeView === 'details' && (
          <EventDetailsView
            onNavigate={handleNavigate}
            onOpenClaimModal={handleOpenClaimModal}
            wishlistIds={wishlistIds}
            onToggleWishlist={handleToggleWishlist}
          />
        )}

        {activeView === 'passes' && (
          <MyPassesView
            passes={passes}
            userProfile={userProfile}
            onNavigate={handleNavigate}
            onRefreshPasses={handleRefreshPasses}
          />
        )}

        {activeView === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
            registeredAccounts={registeredAccounts}
            onRegisterAccount={handleRegisterAccount}
          />
        )}

        {activeView === 'wishlist' && (
          <WishlistView
            wishlistEvents={wishlistEvents}
            onToggleWishlist={handleToggleWishlist}
            onSelectEvent={handleSelectEvent}
            onOpenClaimModal={handleOpenClaimModal}
            onNavigate={handleNavigate}
          />
        )}
      </div>

      {/* Interactive Pass Claiming Modal */}
      <PassClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        event={selectedEvent}
        onPassClaimed={handlePassClaimed}
        onViewPasses={() => handleNavigate('passes')}
      />

      {/* Interactive Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmitFeedback={(f) => {
          showToast(`Feedback received for ${f.category}! Thank you.`);
        }}
        userName={userProfile.name}
      />

      {/* Interactive Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSavePreferences={(prefs) => {
          showToast('Preferences updated for SMS & NFC turnstiles.');
        }}
      />

      {/* University Institutional Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
