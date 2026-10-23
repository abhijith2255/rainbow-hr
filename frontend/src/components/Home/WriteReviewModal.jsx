import React, { useState } from 'react';
import axios from 'axios';
import { Star, X, Loader2, Send, CheckCircle2 } from 'lucide-react';

const API_BASE = 'https://rainbow-hr.onrender.com';

const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

// Logged-in candidate / employer rating-um feedback-um submit cheyyunna modal.
const WriteReviewModal = ({ isOpen, onClose, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const activeRating = hovered || rating;

  const resetAndClose = () => {
    setComment('');
    setRating(5);
    setHovered(0);
    setError('');
    setSubmitted(false);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      setError('Please write a short review before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `${API_BASE}/api/jobs/reviews/`,
        { rating, comment: comment.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitted(true);
      if (onSubmitted) onSubmitted();
      // Success message-onnu kaanichittu modal close cheyyunnu.
      setTimeout(resetAndClose, 1300);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Could not submit your review. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={submitting ? undefined : resetAndClose}
      ></div>

      {/* Panel - max-h + overflow vazhi valiya content-um scroll aayi labhyam */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-[2rem] border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)] animate-menu-drop">
        <div className="pointer-events-none absolute -top-24 -right-16 w-56 h-56 rounded-full bg-emerald-500/20 blur-[90px]"></div>

        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close"
          className="absolute top-5 right-5 z-10 w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>

        {submitted ? (
          <div className="relative px-8 py-16 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-[0_15px_40px_-12px_rgba(16,185,129,0.8)] mb-5">
              <CheckCircle2 className="w-8 h-8 text-slate-950" strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black text-white tracking-tight">Thank you!</h3>
            <p className="text-slate-400 font-medium mt-2">
              Your review is now live on RainbowHR.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="relative px-7 sm:px-8 py-8">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/25 text-emerald-300 font-black text-[10px] tracking-[0.2em] uppercase mb-4">
              Share your experience
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight">Write a Review</h3>
            <p className="text-slate-400 text-sm font-medium mt-2">
              Your feedback helps thousands of job seekers and employers across Kerala.
            </p>

            {/* Star picker */}
            <div className="mt-7">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Your rating
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHovered(value)}
                      aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
                      className="p-0.5 transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                    >
                      <Star
                        strokeWidth={1.75}
                        className={`w-8 h-8 transition-colors duration-200 ${
                          value <= activeRating
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm font-extrabold text-amber-300">
                  {RATING_LABELS[activeRating]}
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="mt-6">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2">
                Your review
              </label>
              <textarea
                rows={4}
                maxLength={600}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Tell us how RainbowHR helped you find a job or hire the right talent..."
                className="w-full resize-none rounded-2xl bg-slate-950/60 border border-white/10 px-4 py-3.5 text-sm font-medium text-white placeholder-slate-500 outline-none focus:border-emerald-400/50 focus:bg-slate-950/80 transition-all duration-300"
              />
              <p className="text-[11px] font-semibold text-slate-500 mt-2 text-right">
                {comment.length}/600
              </p>
            </div>

            {error && (
              <p className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-300">
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={resetAndClose}
                className="px-5 py-3 rounded-xl text-sm font-bold text-slate-300 border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_12px_30px_-12px_rgba(16,185,129,0.8)] hover:shadow-[0_16px_38px_-12px_rgba(16,185,129,0.9)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" strokeWidth={2.5} />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default WriteReviewModal;
