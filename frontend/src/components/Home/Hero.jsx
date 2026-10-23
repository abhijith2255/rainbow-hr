import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const QUICK_SEARCHES = [
  'React Developer',
  'Security Supervisor',
  'Tally Accountant',
  'Staff Nurse',
  'HR Executive',
];

const Hero = () => {
  const { isLoggedIn, dashboardLink } = useAuth();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobTitle.trim()) params.set('q', jobTitle.trim());
    if (location.trim()) params.set('location', location.trim());
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const runQuickSearch = (term) => {
    const params = new URLSearchParams({ q: term });
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen w-full bg-slate-950 overflow-hidden flex flex-col justify-between">
      {/* ---------- Main Custom Background Image ---------- */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.jpeg"
          alt="Rainbow HR & Security Service Pvt Ltd Office"
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000"
        />
        {/* Balanced luxury gradient: keeps the 3D Rainbow wall logo visible while making text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/55 to-slate-950/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60"></div>
      </div>

      {/* Subtle Rainbow & Emerald Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[36rem] h-[36rem] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-5%] w-[36rem] h-[36rem] bg-purple-500/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* ---------- Main Hero Content ---------- */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-5 sm:px-6 pt-32 md:pt-40 pb-16 min-h-screen flex flex-col lg:flex-row items-end lg:items-center justify-between gap-12">
        
        {/* Left Column: Glassmorphic Command Center */}
        <div className="w-full lg:w-[58%] text-center lg:text-left">
          
          {/* Brand Trust Pill matching the wall motto */}
          <div className="inline-flex items-center gap-2.5 bg-slate-900/70 border border-white/15 backdrop-blur-xl rounded-full px-4 py-2 mb-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-white/90 font-bold text-[11px] tracking-[0.22em] uppercase">
              Trust • Integrity • Excellence
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-[1.06] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Build Your Future With{' '}
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Rainbow HR.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-200/95 mb-8 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            Kerala&apos;s premier recruitment &amp; security service network. Connecting verified professionals with top-tier organizations across every industry.
          </p>

          {/* ---------- Floating Glassmorphic Search Bar ---------- */}
          <form
            onSubmit={handleSearch}
            className="mx-auto lg:mx-0 max-w-2xl bg-slate-950/75 backdrop-blur-2xl border border-white/20 rounded-[1.75rem] sm:rounded-full p-2 shadow-[0_28px_70px_-15px_rgba(0,0,0,0.9)] ring-1 ring-white/10 flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 transition-all duration-300 focus-within:border-emerald-400/60 focus-within:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.4)]"
          >
            {/* Job title input */}
            <div className="flex items-center gap-3 flex-1 px-5 py-3.5 sm:py-3">
              <Search className="w-[18px] h-[18px] text-emerald-400 shrink-0" strokeWidth={2.5} />
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job title, skill, or company..."
                aria-label="Job title, company or keyword"
                className="w-full bg-transparent text-sm font-semibold text-white placeholder-slate-400 outline-none"
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px my-3 bg-white/15"></div>
            <div className="sm:hidden h-px mx-5 bg-white/15"></div>

            {/* Location input */}
            <div className="flex items-center gap-3 sm:w-[35%] px-5 py-3.5 sm:py-3">
              <MapPin className="w-[18px] h-[18px] text-emerald-400 shrink-0" strokeWidth={2.5} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location in Kerala"
                aria-label="Location"
                className="w-full bg-transparent text-sm font-semibold text-white placeholder-slate-400 outline-none"
              />
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="group shrink-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 px-7 py-4 sm:py-3.5 sm:rounded-full rounded-[1.35rem] font-extrabold text-sm tracking-wide shadow-[0_10px_30px_-5px_rgba(16,185,129,0.7)] hover:shadow-[0_15px_40px_-5px_rgba(16,185,129,0.95)] hover:scale-[1.02] transition-all"
            >
              <Search className="w-4 h-4" strokeWidth={3} />
              Find Jobs
            </button>
          </form>

          {/* Trending Keyword Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-300/90 mr-1">
              Popular:
            </span>
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => runQuickSearch(term)}
                className="px-3.5 py-1.5 rounded-full bg-slate-900/75 backdrop-blur-md border border-white/15 text-xs font-semibold text-slate-200 hover:text-white hover:border-emerald-400/50 hover:bg-emerald-500/20 transition-all"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
            <Link
              to="/jobs"
              className="group bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 px-8 py-4 rounded-2xl font-extrabold text-sm tracking-wide shadow-[0_15px_40px_-10px_rgba(16,185,129,0.6)] hover:shadow-[0_22px_55px_-12px_rgba(16,185,129,0.85)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              Browse Verified Jobs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>

            {isLoggedIn ? (
              <Link
                to={dashboardLink}
                className="bg-slate-900/75 backdrop-blur-xl text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-white/15 hover:-translate-y-0.5 transition-all text-center"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/#for-employers"
                className="bg-slate-900/75 backdrop-blur-xl text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-white/15 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" strokeWidth={2.5} />
                Hire Verified Talent
              </Link>
            )}
          </div>
        </div>

        {/* Right Column: Minimal Floating Trust Cards (Leaves Background Logo Clear) */}
        <div className="w-full lg:w-[38%] flex flex-col justify-end items-center lg:items-end gap-4 mt-6 lg:mt-48">
          
          {/* Floating Card 1: Official Corporate Identity */}
          <div className="w-full max-w-sm rounded-3xl bg-slate-950/75 backdrop-blur-2xl border border-white/15 p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] hover:border-emerald-400/40 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-teal-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-300" strokeWidth={2.2} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-extrabold text-sm">100% Verified Portal</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  Every employer and job opening is manually audited by Rainbow HR &amp; Security Service Pvt Ltd.
                </p>
              </div>
            </div>

            {/* Live Mini Stats inside Glass Card */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
              <div className="bg-white/5 rounded-xl py-2 px-1">
                <p className="text-lg font-black text-white">10K+</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">Openings</p>
              </div>
              <div className="bg-white/5 rounded-xl py-2 px-1">
                <p className="text-lg font-black text-white">5K+</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300/80">Companies</p>
              </div>
              <div className="bg-white/5 rounded-xl py-2 px-1">
                <p className="text-lg font-black text-white">50K+</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-300/80">Placed</p>
              </div>
            </div>
          </div>

          {/* Floating Card 2: Multi-Industry & Security Badge */}
          <div className="w-full max-w-sm rounded-2xl bg-slate-950/75 backdrop-blur-2xl border border-white/15 px-5 py-3.5 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.8)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <p className="text-white font-bold text-xs">ISO-Grade Recruitment</p>
                <p className="text-slate-400 text-[11px]">IT, Healthcare, Finance &amp; Security</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
              Active
            </span>
          </div>

        </div>
      </main>
    </section>
  );
};

export default Hero;