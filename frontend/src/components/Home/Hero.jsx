import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Search bar-inu keezhe kaanikkunna trending keyword chips
const QUICK_SEARCHES = ['React Developer', 'Tally Accountant', 'Nurse', 'Digital Marketing'];

const Hero = () => {
  const { isLoggedIn, dashboardLink } = useAuth();
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  // Floating search bar submit cheyyumbol /jobs page-ilekku query-ode pokunnu
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobTitle.trim()) params.set('q', jobTitle.trim());
    if (location.trim()) params.set('location', location.trim());
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  };

  // Trending keyword click cheythal aa keyword search aayi pokunnu
  const runQuickSearch = (term) => {
    const params = new URLSearchParams({ q: term });
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden">

      {/* Layered luxury background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920"
          alt="Premium Office Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/92 to-emerald-950/85"></div>
      </div>

      {/* Ambient gradient glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[42rem] h-[42rem] bg-emerald-500/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-25%] right-[-10%] w-[38rem] h-[38rem] bg-teal-400/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-5 sm:px-6 pt-32 md:pt-40 pb-20 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-14 lg:gap-16 z-10 relative">

        <div className="w-full lg:w-[54%] z-20 text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full px-4 py-2 mb-7 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-200/90 font-semibold text-[11px] tracking-[0.25em] uppercase">Kerala's Premium HR Network</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05] text-white">
            Where Ambition<br />
            Meets{' '}
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Opportunity.
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-300/90 mb-9 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            Curated careers for Kerala's finest professionals and world-class companies. Elevate your future with a network built on trust and excellence.
          </p>

          {/* ---------- Floating glassmorphic search bar ---------- */}
          <form
            onSubmit={handleSearch}
            className="mx-auto lg:mx-0 max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/15 rounded-[1.75rem] sm:rounded-full p-2 shadow-[0_28px_70px_-25px_rgba(0,0,0,0.85)] ring-1 ring-white/5 flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0 transition-all duration-500 focus-within:border-emerald-400/40 focus-within:shadow-[0_28px_80px_-20px_rgba(16,185,129,0.45)]"
          >
            {/* Job title */}
            <div className="flex items-center gap-3 flex-1 px-5 py-3.5 sm:py-3">
              <Search className="w-[18px] h-[18px] text-emerald-300 shrink-0" strokeWidth={2.5} />
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job title, company or keyword"
                aria-label="Job title, company or keyword"
                className="w-full bg-transparent text-sm font-semibold text-white placeholder-slate-400/80 outline-none"
              />
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px my-3 bg-white/15"></div>
            <div className="sm:hidden h-px mx-5 bg-white/15"></div>

            {/* Location */}
            <div className="flex items-center gap-3 sm:w-[34%] px-5 py-3.5 sm:py-3">
              <MapPin className="w-[18px] h-[18px] text-emerald-300 shrink-0" strokeWidth={2.5} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                aria-label="Location"
                className="w-full bg-transparent text-sm font-semibold text-white placeholder-slate-400/80 outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="group shrink-0 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 px-7 py-4 sm:py-3.5 sm:rounded-full rounded-[1.35rem] font-extrabold text-sm tracking-wide shadow-[0_12px_35px_-10px_rgba(16,185,129,0.8)] hover:shadow-[0_18px_45px_-10px_rgba(16,185,129,1)] transition-all"
            >
              <Search className="w-4 h-4" strokeWidth={3} />
              Search
            </button>
          </form>

          {/* Trending searches */}
          <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mr-1">Trending</span>
            {QUICK_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => runQuickSearch(term)}
                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300 hover:text-emerald-200 hover:border-emerald-400/40 hover:bg-white/10 transition-all"
              >
                {term}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-9">
            <Link to="/jobs" className="group bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 px-8 py-4 rounded-2xl font-extrabold text-sm tracking-wide shadow-[0_15px_40px_-10px_rgba(16,185,129,0.6)] hover:shadow-[0_22px_55px_-12px_rgba(16,185,129,0.8)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              Explore Premium Jobs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>
            {isLoggedIn ? (
              <Link to={dashboardLink} className="bg-white/5 backdrop-blur-xl text-white border border-white/15 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-white/10 hover:-translate-y-0.5 transition-all text-center">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/#for-employers" className="bg-white/5 backdrop-blur-xl text-white border border-white/15 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-white/10 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-300" strokeWidth={2.5} />
                Hire Elite Talent
              </Link>
            )}
          </div>

          {/* Refined Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 max-w-lg mx-auto lg:mx-0">
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-white">10K+</h4>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300/70 mt-1.5">Live Jobs</p>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-white">5K+</h4>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300/70 mt-1.5">Employers</p>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-white">50K+</h4>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300/70 mt-1.5">Candidates</p>
            </div>
          </div>
        </div>

        {/* Right visual — floating glass cards */}
        <div className="w-full lg:w-[46%] relative h-[360px] sm:h-[440px] md:h-[560px] flex items-center justify-center mt-2 lg:mt-0">
          <div className="absolute w-[72%] h-[82%] rounded-[2.5rem] overflow-hidden border border-white/15 ring-1 ring-white/5 shadow-[0_35px_80px_-20px_rgba(0,0,0,0.8)] z-20 animate-float-1">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Team" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent"></div>
          </div>
          <div className="absolute top-2 left-0 w-[46%] h-[46%] rounded-[1.75rem] overflow-hidden border border-white/15 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.7)] z-30 animate-float-2">
            <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600" alt="Professional" className="w-full h-full object-cover" />
          </div>
          <div className="absolute bottom-3 right-0 w-[52%] h-[42%] rounded-[1.75rem] overflow-hidden border border-white/15 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] z-30 animate-float-1" style={{ animationDelay: '2s' }}>
            <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=600" alt="Interview" className="w-full h-full object-cover" />
          </div>

          {/* Floating verified badge — glassmorphism */}
          <div className="absolute bottom-6 left-0 sm:left-2 z-40 flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/15 px-4 py-3 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.8)] animate-float-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-300" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <p className="text-white font-black text-sm leading-none">100% Verified</p>
              <p className="text-emerald-200/70 text-[10px] font-bold uppercase tracking-wider mt-1">Employers &amp; Jobs</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
