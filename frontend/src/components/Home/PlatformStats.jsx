import React, { useEffect, useRef, useState } from 'react';
import { Briefcase, Building2, Users, Trophy } from 'lucide-react';

// Platform-inte credibility udaneye build cheyyunna numbers.
const STATS = [
  { icon: Briefcase, value: 10000, label: 'Active Jobs', hint: 'Verified openings' },
  { icon: Building2, value: 5000, label: 'Trusted Employers', hint: 'Hiring partners' },
  { icon: Users, value: 50000, label: 'Verified Candidates', hint: 'Talent pool' },
  { icon: Trophy, value: 12000, label: 'Placements', hint: 'Careers launched' },
];

// Indian numbering format (10,000 / 50,000) — Malayalam users-ന് പരിചിതം
const formatNumber = (n) => n.toLocaleString('en-IN');

// Oru stat card — scroll-il kaanumbol number 0-il ninnu count up aakunnu.
const StatCard = ({ stat, active, delay }) => {
  const [value, setValue] = useState(0);
  const Icon = stat.icon;

  useEffect(() => {
    if (!active) return;
    let frame;
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo — aadyam vegam, pinne slow aayi settle aakunnu
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(stat.value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, stat.value]);

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.75rem] bg-white/5 border border-white/10 backdrop-blur-xl p-6 sm:p-7 transition-all duration-700 hover:bg-white/10 hover:-translate-y-1.5 hover:border-emerald-400/30 ${
        active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Hover-il mattram kaanikkunna soft brand glow */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-36 h-36 rounded-full bg-emerald-400/25 blur-[55px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5 group-hover:scale-110 transition-transform duration-500">
        <Icon className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
      </div>

      <div className="relative flex items-baseline gap-0.5">
        <span className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
          {formatNumber(value)}
        </span>
        <span className="text-2xl sm:text-3xl font-black text-emerald-400">+</span>
      </div>

      <p className="relative mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-emerald-300/80">
        {stat.label}
      </p>
      <p className="relative mt-1 text-xs font-semibold text-slate-400">{stat.hint}</p>
    </div>
  );
};

const PlatformStats = () => {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(false);

  // Section viewport-il ethiyal mattram counter kick-start cheyyunnu
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
      { threshold: 0.25 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 bg-gradient-to-b from-white to-slate-50 py-16 sm:py-20 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Dark premium band — page-il ninnu separate aayi nilkkunnu */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 sm:px-10 py-14 sm:py-16 shadow-[0_35px_80px_-30px_rgba(2,6,23,0.6)]">
          {/* Background depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/70"></div>
          <div className="absolute top-[-40%] left-[-10%] w-[32rem] h-[32rem] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none"></div>
          <div className="absolute bottom-[-45%] right-[-10%] w-[28rem] h-[28rem] bg-teal-400/10 rounded-full blur-[140px] pointer-events-none"></div>

          <div className="relative text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-emerald-200/90 font-black text-[10px] tracking-[0.25em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Platform Statistics
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Trusted at Scale Across{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Kerala
              </span>
            </h2>
            <p className="mt-4 text-slate-300/80 font-light text-base sm:text-lg leading-relaxed">
              Real numbers from a network built on verified employers, genuine openings, and measurable hiring outcomes.
            </p>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} active={active} delay={index * 110} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformStats;
