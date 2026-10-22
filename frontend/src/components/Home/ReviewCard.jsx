import React, { useState } from 'react';
import { Star, BadgeCheck, Quote } from 'lucide-react';

// Role anusarichulla color theme (Candidate -> emerald, Employer -> blue)
const ROLE_THEMES = {
  employer: {
    gradient: 'from-sky-400 to-indigo-500',
    glow: 'shadow-sky-500/30',
    chip: 'bg-sky-400/10 text-sky-200 border-sky-400/25',
    border: 'hover:border-sky-400/40',
    label: 'Employer',
  },
  candidate: {
    gradient: 'from-emerald-400 to-teal-500',
    glow: 'shadow-emerald-500/30',
    chip: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/25',
    border: 'hover:border-emerald-400/40',
    label: 'Candidate',
  },
};

const getInitials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'RH';
  return parts.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join('');
};

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

// Review card-il kaanikkunna glowing star rating (Lucide Star).
export const StarRating = ({ rating = 0, size = 'w-4 h-4', glow = false }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((index) => {
      const filled = index <= rating;
      return (
        <Star
          key={index}
          strokeWidth={1.75}
          className={`${size} ${
            filled
              ? `fill-amber-400 text-amber-400 ${glow ? 'drop-shadow-[0_0_6px_rgba(251,191,36,0.55)]' : ''}`
              : 'text-slate-600'
          }`}
        />
      );
    })}
  </div>
);

// Homepage-um /reviews page-um share cheyyunna premium review card.
const ReviewCard = ({ review, className = '' }) => {
  // Avatar image load fail aayal initials fallback kanikkunnu.
  const [imgFailed, setImgFailed] = useState(false);
  const theme = ROLE_THEMES[review.role] || ROLE_THEMES.candidate;
  const initials = getInitials(review.display_name);

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 shadow-md shadow-black/40 transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:bg-white/[0.06] hover:shadow-lg hover:shadow-black/60 ${theme.border} ${className}`}
    >
      {/* Watermark quote */}
      <Quote className="pointer-events-none absolute top-5 right-5 w-16 h-16 text-white/[0.04] rotate-6 transition-transform duration-500 group-hover:-rotate-6" />

      {/* Colored glow */}
      <div className={`pointer-events-none absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${theme.gradient} opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-25`}></div>

      <div className="relative flex items-center justify-between gap-3 mb-6">
        <StarRating rating={review.rating} glow />
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${theme.chip}`}>
          <BadgeCheck className="w-3 h-3" strokeWidth={2.5} />
          {theme.label}
        </span>
      </div>

      <p className="relative text-slate-300 font-medium text-base leading-relaxed flex-grow">
        “{review.comment}”
      </p>

      <footer className="relative mt-7 flex items-center gap-4 border-t border-white/10 pt-6">
        <div className={`w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center text-white font-black text-sm shadow-lg ${theme.glow} overflow-hidden transition-transform duration-300 group-hover:scale-105`}>
          {review.avatar && !imgFailed ? (
            <img
              src={review.avatar}
              alt={review.display_name}
              loading="lazy"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-white font-extrabold text-sm truncate">{review.display_name}</h4>
          <p className="text-slate-400 text-xs font-semibold truncate mt-0.5">
            {review.designation}
            {formatDate(review.created_at) ? ` · ${formatDate(review.created_at)}` : ''}
          </p>
        </div>
      </footer>
    </article>
  );
};

export default ReviewCard;
