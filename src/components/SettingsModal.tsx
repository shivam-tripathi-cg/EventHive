import React, { useState } from 'react';
import { X, Bell, Shield, MapPin, Smartphone, Check, Moon, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePreferences: (prefs: SettingsPreferences) => void;
}

export interface SettingsPreferences {
  smsAlerts: boolean;
  emailPasses: boolean;
  fastTrackNfc: boolean;
  campusCenter: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSavePreferences,
}) => {
  const [smsAlerts, setSmsAlerts] = useState<boolean>(true);
  const [emailPasses, setEmailPasses] = useState<boolean>(true);
  const [fastTrackNfc, setFastTrackNfc] = useState<boolean>(true);
  const [campusCenter, setCampusCenter] = useState<string>('Gandhinagar Main Campus');
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSavePreferences({
      smsAlerts,
      emailPasses,
      fastTrackNfc,
      campusCenter,
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-[#e8e5dc] shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full border border-[#e8e5dc] flex items-center justify-center text-[#62626e] hover:text-[#111116] hover:bg-[#f4f3ef] transition-colors"
          aria-label="Close settings"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-wider text-[#b8860b] mb-2">
              <Shield className="w-3 h-3" />
              Portal Preferences
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#111116]">
              Account & Notification Settings
            </h2>
            <p className="text-xs text-[#62626e] mt-1">
              Configure gate alerts, NFC turnstile automation, and campus preferences.
            </p>
          </div>

          <div className="space-y-4">
            {/* SMS Gate Alert Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#e8e5dc] bg-[#fbfbf9]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-[#b8860b] flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111116]">Gate Entry SMS & WhatsApp</div>
                  <div className="text-[11px] text-[#62626e]">Receive gate queue timing and turnstile notices</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  smsAlerts ? 'bg-[#b8860b]' : 'bg-[#e8e5dc]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  smsAlerts ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Email Pass PDF Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#e8e5dc] bg-[#fbfbf9]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111116]">Automatic PDF Pass Email</div>
                  <div className="text-[11px] text-[#62626e]">Send high-res printable passes to university inbox</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEmailPasses(!emailPasses)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  emailPasses ? 'bg-[#b8860b]' : 'bg-[#e8e5dc]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  emailPasses ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Fast-Track NFC Auto Sync */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#e8e5dc] bg-[#fbfbf9]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111116]">Fast-Track NFC Turnstile Link</div>
                  <div className="text-[11px] text-[#62626e]">Automatically authorize student smart wristbands</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFastTrackNfc(!fastTrackNfc)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  fastTrackNfc ? 'bg-[#b8860b]' : 'bg-[#e8e5dc]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  fastTrackNfc ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Campus Center Select */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-[#62626e] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#b8860b]" />
                Primary Campus Location
              </label>
              <select
                value={campusCenter}
                onChange={(e) => setCampusCenter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b]"
              >
                <option value="Gandhinagar Main Campus">Gandhinagar Main University Campus</option>
                <option value="Kalol Medical Sciences Campus">Kalol Health & Medical Sciences Complex</option>
                <option value="Ahmedabad Satellite Center">Ahmedabad Executive Center</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#62626e] hover:text-[#111116] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-full bg-gold-gradient text-white text-xs font-bold shadow-gold-glow hover:opacity-95 flex items-center gap-1.5 transition-all active:scale-95"
            >
              {savedToast ? <Check className="w-3.5 h-3.5" /> : null}
              {savedToast ? 'Saved!' : 'Save Preferences'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
