import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Hero = () => {
  const { isLoggedIn, dashboardLink } = useAuth();

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
      <main className="max-w-7xl w-full mx-auto px-6 pt-32 md:pt-44 pb-24 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-16 z-10 relative">

        <div className="w-full lg:w-[52%] z-20 text-center lg:text-left">
          <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 backdrop-blur-xl rounded-full px-4 py-2 mb-7 shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-200/90 font-semibold text-[11px] tracking-[0.25em] uppercase">Kerala's Premium HR Network</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05] text-white">
            Where Ambition<br />
            Meets <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">Opportunity.</span>
          </h1>

          <p className="text-base md:text-lg text-slate-300/90 mb-10 max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
            Curated careers for Kerala's finest professionals and world-class companies. Elevate your future with a network built on trust and excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/jobs" className="group bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 px-9 py-4 rounded-2xl font-extrabold text-sm tracking-wide shadow-[0_15px_40px_-10px_rgba(16,185,129,0.6)] hover:shadow-[0_22px_55px_-12px_rgba(16,185,129,0.8)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              Explore Premium Jobs
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
            {isLoggedIn ? (
              <Link to={dashboardLink} className="bg-white/5 backdrop-blur-xl text-white border border-white/15 px-9 py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-white/10 hover:-translate-y-0.5 transition-all text-center">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/#for-employers" className="bg-white/5 backdrop-blur-xl text-white border border-white/15 px-9 py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-white/10 hover:-translate-y-0.5 transition-all text-center">
                Hire Elite Talent
              </Link>
            )}
          </div>

          {/* Refined Stats */}
          <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 max-w-lg mx-auto lg:mx-0">
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-white">500+</h4>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300/70 mt-1.5">Companies</p>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-white">12K+</h4>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300/70 mt-1.5">Placements</p>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-white">100%</h4>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300/70 mt-1.5">Verified</p>
            </div>
          </div>
        </div>

        {/* Right visual — floating glass cards */}
        <div className="w-full lg:w-[48%] relative h-[400px] md:h-[560px] flex items-center justify-center mt-6 lg:mt-0">
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
        </div>
      </main>
    </div>
  );
};

export default Hero;
