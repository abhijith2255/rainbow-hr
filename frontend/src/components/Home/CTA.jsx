import React from 'react';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="py-20 px-6 relative z-10 bg-slate-50">
      <div className="container mx-auto max-w-6xl bg-slate-950 rounded-[3rem] overflow-hidden relative shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-emerald-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-teal-500/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 py-20 px-8 text-center md:px-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">Ready to Accelerate Your Career?</h2>
          <p className="text-slate-400 font-medium text-lg md:text-xl mb-12 max-w-3xl mx-auto">
            Join RainbowHR today. Create your premium profile, get noticed by top recruiters, and land your dream job faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link to="/login" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-10 py-4 rounded-xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
              Candidate Login
            </Link>
            <Link to="/login" className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 text-white font-extrabold px-10 py-4 rounded-xl transition-all hover:-translate-y-1">
              Post a Job (Employer)
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;