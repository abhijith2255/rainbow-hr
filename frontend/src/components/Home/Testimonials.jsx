import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PenLine, ArrowRight, MessageSquareQuote } from 'lucide-react';
import ReviewCard, { StarRating } from './ReviewCard';
import WriteReviewModal from './WriteReviewModal';
import Login from '../../pages/login';
import { useAuth } from '../../context/AuthContext';

const API_BASE = 'http://127.0.0.1:8000';

// Homepage-il kaanikkunna reviews-nte ennam (clutter ozhivakkan 3 mattram)
const MAX_FEATURED_REVIEWS = 3;

const Testimonials = () => {
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

  // Staff / Admin reviews ezhuthilla - avarkku button kaanikkunnilla.
  const canWriteReview = !isLoggedIn || userRole === 'candidate' || userRole === 'employer';

  const handleWriteReview = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    setIsReviewModalOpen(true);
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, item) => sum + (item.rating || 0), 0) / reviews.length).toFixed(1)
    : '5.0';

  const featured = reviews.slice(0, MAX_FEATURED_REVIEWS);

  return (
    <section id="reviews" className="py-24 sm:py-28 relative bg-slate-950 overflow-hidden z-10">
      {/* Deep premium glows */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none mix-blend-screen"></div>

      <div className="container mx-auto px-5 sm:px-6 max-w-7xl relative z-10">

        {/* ---------- Header ---------- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-emerald-400 font-extrabold text-xs tracking-[0.2em] uppercase mb-4">
              <span className="w-8 h-px bg-emerald-400"></span> Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Trusted by Kerala's <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Elite Professionals.
              </span>
            </h2>
            <p className="text-slate-400 font-medium text-base sm:text-lg mt-5">
              Real reviews from candidates and employers building their careers on RainbowHR.
            </p>
          </div>

          {/* Live rating summary */}
          <div className="shrink-0 rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl px-7 py-6 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-4xl font-black text-white leading-none">{averageRating}</p>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-2">
                  out of 5
                </p>
              </div>
              <div className="w-px h-12 bg-white/10"></div>
              <div>
                <StarRating rating={Math.round(Number(averageRating))} size="w-[18px] h-[18px]" glow />
                <p className="text-xs font-semibold text-slate-400 mt-2">
                  Based on {reviews.length} verified review{reviews.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Reviews ---------- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: MAX_FEATURED_REVIEWS }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 animate-pulse h-[280px]"
              ></div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <MessageSquareQuote className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">No reviews yet</h3>
            <p className="text-slate-400 text-sm font-medium">
              Be the first to share your RainbowHR experience.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {/* ---------- CTAs ---------- */}
        {canWriteReview && (
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleWriteReview}
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-sm font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_15px_40px_-14px_rgba(16,185,129,0.85)] hover:shadow-[0_20px_50px_-14px_rgba(16,185,129,0.95)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <PenLine className="w-4 h-4" strokeWidth={2.5} />
              Write a Review
            </button>

            <Link
              to="/reviews"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-sm font-extrabold text-white border border-white/15 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/25 transition-all duration-300"
            >
              View All Reviews
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
          </div>
        )}

        {/* Reviews ezhuthan pattatha roles-ക്കും All Reviews link labhyam */}
        {!canWriteReview && (
          <div className="mt-14 text-center">
            <Link
              to="/reviews"
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-sm font-extrabold text-white border border-white/15 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/25 transition-all duration-300"
            >
              View All Reviews
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
          </div>
        )}
      </div>

      {/* Write review modal (logged-in users) */}
      <WriteReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmitted={fetchReviews}
      />

      {/* Guest aanenkil aadyam login cheyyikkunnu */}
      <Login
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          setIsReviewModalOpen(true);
        }}
      />
    </section>
  );
};

export default Testimonials;
