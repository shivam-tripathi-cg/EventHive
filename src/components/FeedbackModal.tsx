import React, { useState } from 'react';
import { X, Star, Send, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitFeedback: (feedback: { rating: number; category: string; comment: string }) => void;
  userName: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmitFeedback,
  userName,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>('Events & Activities');
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFeedback({ rating, category, comment });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setComment('');
      onClose();
    }, 2000);
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
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mx-auto flex items-center justify-center shadow-inner animate-in zoom-in-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#111116]">
              Thank You, {userName}!
            </h3>
            <p className="text-sm text-[#62626e] max-w-sm mx-auto">
              Your feedback has been routed to the Swaminarayan University Student Affairs Committee.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-[#d4af37]/30 text-[10px] font-bold uppercase tracking-wider text-[#b8860b] mb-2">
                <Sparkles className="w-3 h-3" />
                Student Voice & Reviews
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#111116]">
                Share Your Experience
              </h2>
              <p className="text-xs text-[#62626e] mt-1">
                Help us improve campus festival logistics, gate verification, and stage productions.
              </p>
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                Overall Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <Star
                      className={`w-7 h-7 transition-all ${
                        star <= rating
                          ? 'fill-[#d4af37] text-[#d4af37] scale-110'
                          : 'text-[#e8e5dc] hover:text-[#d4af37]/50'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-[#b8860b] ml-2">
                  {rating === 5 ? '5.0 — Outstanding!' : `${rating}.0 / 5.0`}
                </span>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                Feedback Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs font-semibold text-[#111116] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20"
              >
                <option value="Events & Activities">Festivals, DJ & Cultural Events</option>
                <option value="Gate Entry & Turnstile">RFID Turnstiles & QR Gate Verification</option>
                <option value="Web Portal & Digital Pass">EventHive Portal UI & Pass Experience</option>
                <option value="Food & Campus Amenities">Refreshments, Parking & Water Stations</option>
                <option value="Clubs & Competitions">Club Registrations & Hackathons</option>
              </select>
            </div>

            {/* Comments Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#62626e]">
                Your Suggestions or Concerns
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on recent campus events, queue wait times, or app features..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#e8e5dc] bg-[#fbfbf9] text-xs text-[#111116] placeholder:text-[#999] focus:outline-none focus:border-[#b8860b] focus:ring-2 focus:ring-[#d4af37]/20 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#62626e] hover:text-[#111116] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-full bg-gold-gradient text-white text-xs font-bold shadow-gold-glow hover:opacity-95 flex items-center gap-2 transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
