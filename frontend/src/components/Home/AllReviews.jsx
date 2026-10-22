import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, PenLine, MessageSquareQuote } from 'lucide-react';
import ReviewCard, { StarRating } from './ReviewCard';
import WriteReviewModal from './WriteReviewModal';
import Login from '../../pages/login';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://127.0.0.1:8000';

const AllReviews = () => {
  const { isLoggedIn, userRole } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/jobs/reviews/`);
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const stats = useMemo(() => {
    if (!reviews.length) {
      return { average: '0.0', total: 0, distribution: [0, 0, 0, 0, 0] };
    }
    const total = reviews.length;
    const sum = reviews.reduce((acc, item) => acc + (item.rating || 0), 0);
    // index 0 => 1 star ... index 4 => 5 stars
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach((item) => {
      const index = Math.min(Math.max((item.rating || 0) - 1, 0), 4);
      distribution[index] += 1;
    });
    return { average: (sum / total).toFixed(1), total, distribution };
  }, [reviews]);

  const canWriteReview = !isLoggedIn || userRole === 'candidate' || userRole === 'employer';

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsReviewModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden pt-28 md:pt-32 pb-24 px-4 sm:px-6">
      {/* Ambient glows */}
      <div className="absolute top-[-12%] left-[-10%] w-[42rem] h-[42rem] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-25%] right-[-12%] w-[38rem] h-[38rem] bg-teal-400/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto z-10">

        {/* ---------- Header ---------- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
          <div className="max-w-2xl">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-emerald-300/80 font-bold text-xs tracking-[0.2em] uppercase mb-5 hover:text-emerald-300 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.05]">
              What our{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                community says.
              </span>
            </h1>
            <p className="text-slate-400 font-light mt-5 text-base md:text-lg max-w-xl leading-relaxed">
              Honest ratings and feedback from candidates and employers who hire and get hired
              through RainbowHR.
            </p>
          </div>

          {/* Rating summary + distribution */}
          <div className="shrink-0 w-full lg:w-[22rem] rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-5">
              <div>
                <p className="text-5xl font-black text-white leading-none">{stats.average}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-2">
                  {stats.total} review{stats.total === 1 ? '' : 's'}
                </p>
              </div>
              <div className="w-px h-16 bg-white/10"></div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution[star - 1];
                  const percent = stats.total ? Math.round((count / stats.total) * 100) : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400 w-3">{star}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-300"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between gap-3">
              <StarRating rating={Math.round(Number(stats.average))} size="w-[18px] h-[18px]" glow />
              {canWriteReview ? (
                <button
                  type="button"
                  onClick={handleWriteReview}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_12px_28px_-12px_rgba(16,185,129,0.85)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <PenLine className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Write a Review
                </button>
              ) : (
                <span className="text-[11px] font-bold text-slate-500">
                  Only candidates &amp; employers can review
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Reviews ---------- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 animate-pulse h-[280px]"
              ></div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <MessageSquareQuote className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">No reviews yet</h3>
            <p className="text-slate-400 text-sm font-medium mb-7">
              Be the first to share your RainbowHR experience with the community.
            </p>
            {canWriteReview && (
              <button
                type="button"
                onClick={handleWriteReview}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-[0_15px_40px_-12px_rgba(16,185,129,0.7)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <PenLine className="w-4 h-4" strokeWidth={2.5} />
                Write a Review
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>

      <WriteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitted={fetchReviews}
      />

      <Login
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          setIsReviewModalOpen(true);
        }}
      />
    </div>
  );
};

export default AllReviews;
