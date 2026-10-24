import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, Building2, Users, Trophy } from 'lucide-react';

const STATS = [
  { icon: Briefcase, value: 10000, label: 'Active Jobs', hint: 'Verified openings' },
  { icon: Building2, value: 5000, label: 'Trusted Employers', hint: 'Hiring partners' },
  { icon: Users, value: 50000, label: 'Verified Candidates', hint: 'Talent pool' },
  { icon: Trophy, value: 12000, label: 'Placements', hint: 'Careers launched' },
];

const formatNumber = (n) => n.toLocaleString('en-IN');

const StatCard = ({ stat, active, delay }) => {
  const [value, setValue] = useState(0);
  const Icon = stat.icon;

  useEffect(() => {
    if (!active) return;
    let frame;
    const duration = 2000; // Smoother 2-second animation
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(stat.value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, stat.value]);

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8 transition-all duration-700 hover:bg-white/[0.06] hover:-translate-y-3 hover:border-emerald-400/40 hover:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.3)] ${
        active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Background Hover Glow */}
      <div className="absolute -inset-20 bg-gradient-to-br from-emerald-400/20 to-teal-500/0 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

      {/* Floating Icon */}
      <div className="animate-icon-float relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
        <Icon className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
      </div>

      <div className="relative flex items-baseline gap-1">
        <span className="text-4xl md:text-5xl font-black text-white tracking-tight tabular-nums drop-shadow-md">
          {formatNumber(value)}
        </span>
        <span className="text-3xl font-black text-emerald-400">+</span>
      </div>

      <p className="relative mt-3 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">
        {stat.label}
      </p>
      <p className="relative mt-1 text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
        {stat.hint}
      </p>
    </div>
  );
};

const PlatformStats = () => {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 bg-[#FAFAFA] py-20 sm:py-28 px-4 sm:px-6 overflow-hidden">
      
      {/* Custom Heavy Animations injected via Style Tag */}
      <style>{`
        @keyframes icon-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes orb-float-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-30px, 20px) scale(0.9); }
        }
        @keyframes orb-float-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, 30px) scale(1.2); }
          66% { transform: translate(20px, -40px) scale(0.8); }
        }
        .animate-icon-float { animation: icon-float 3s ease-in-out infinite; }
        .animate-orb-1 { animation: orb-float-1 15s ease-in-out infinite; }
        .animate-orb-2 { animation: orb-float-2 15s ease-in-out infinite; }
      `}</style>

      <div className="container mx-auto max-w-7xl">
        {/* Massive Dark Premium Band */}
        <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-6 sm:px-12 py-16 sm:py-20 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.3)] border border-slate-800">
          
          {/* Animated Background Orbs */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
          <div className="absolute top-[-30%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none animate-orb-1"></div>
          <div className="absolute bottom-[-30%] right-[-10%] w-[35rem] h-[35rem] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none animate-orb-2"></div>

          <div className="relative text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-emerald-400 font-black text-[11px] tracking-[0.25em] uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
              Platform Statistics
            </span>
            <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-[1.1]">
              Trusted at Scale Across <br />
              <span className="text-emerald-400 font-serif italic font-medium capitalize">
                Kerala
              </span>
            </h2>
            <p className="mt-6 text-slate-400 font-medium text-base sm:text-lg leading-relaxed px-4">
              Real numbers from a network built on verified employers, genuine openings, and measurable hiring outcomes. Join the fastest growing career platform.
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} active={active} delay={index * 150} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;