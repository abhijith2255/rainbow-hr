import React, { useEffect, useRef, useState } from 'react';
import { UserPlus, Wand2, Trophy } from 'lucide-react';
import Reveal from './Reveal';

const HowItWorks = () => {
  const [lineVisible, setLineVisible] = useState(false);
  const lineRef = useRef(null);

  // Line drawing animation trigger on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLineVisible(true);
        }
      },
      { threshold: 0.5 }
    );
    if (lineRef.current) observer.observe(lineRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 sm:py-32 relative z-10 overflow-hidden bg-[#FAFAFA]">
      
      {/* Custom Heavy Animations injected via Style Tag */}
      <style>{`
        @keyframes float-heavy {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.02); }
        }
        @keyframes draw-line {
          0% { width: 0; opacity: 0; }
          100% { width: 100%; opacity: 1; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-float-1 { animation: float-heavy 4s ease-in-out infinite; }
        .animate-float-2 { animation: float-heavy 4s ease-in-out infinite 1s; }
        .animate-float-3 { animation: float-heavy 4s ease-in-out infinite 2s; }
        .animate-draw { animation: draw-line 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .pulse-circle::before {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.3);
          animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
      `}</style>

      {/* Deep Background Glows */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-teal-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <Reveal className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-black text-[11px] tracking-[0.2em] uppercase mb-4 shadow-sm">
            Simple Process
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight uppercase">
            How It <span className="text-emerald-500 font-serif italic font-medium capitalize">Works</span>
          </h2>
          <p className="text-slate-500 font-medium mt-5 max-w-2xl mx-auto text-base sm:text-lg">
            Your dream job is just three simple steps away. A premium experience designed to accelerate your career.
          </p>
        </Reveal>

        <div className="relative">
          {/* Animated Connecting Line for Desktop */}
          <div ref={lineRef} className="hidden md:block absolute top-[40%] left-[10%] right-[10%] h-1.5 bg-slate-100 -translate-y-1/2 z-0 rounded-full overflow-hidden">
            {lineVisible && (
              <div className="h-full bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-400 animate-draw rounded-full relative">
                {/* Moving glowing dot on the line */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(16,185,129,1)]"></div>
              </div>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            
            {/* Step 1 */}
            <Reveal delay={100} className="h-full">
              <div className="group relative flex flex-col items-center text-center bg-white h-full p-8 lg:p-10 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.25)] hover:-translate-y-4 transition-all duration-500 overflow-hidden">
                {/* Huge Watermark Number */}
                <span className="absolute -bottom-8 -right-4 text-[150px] font-black text-slate-50 group-hover:text-emerald-50/50 group-hover:scale-110 transition-all duration-700 pointer-events-none select-none">1</span>
                
                {/* Floating Icon */}
                <div className="animate-float-1 relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-white to-slate-50 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-xl border border-slate-100 group-hover:rotate-6 transition-transform duration-500 relative z-10">
                    <UserPlus className="w-10 h-10" strokeWidth={2} />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors relative z-10">Create Profile</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed relative z-10">
                  Sign up and build a premium portfolio that perfectly highlights your skills, experience, and ambitions.
                </p>
              </div>
            </Reveal>

            {/* Step 2 (Highlighted/Active State Style) */}
            <Reveal delay={300} className="h-full">
              <div className="group relative flex flex-col items-center text-center bg-slate-900 h-full p-8 lg:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] hover:shadow-[0_35px_60px_-15px_rgba(16,185,129,0.4)] hover:-translate-y-4 transition-all duration-500 overflow-hidden">
                <span className="absolute -bottom-8 -right-4 text-[150px] font-black text-white/5 group-hover:text-emerald-500/10 group-hover:scale-110 transition-all duration-700 pointer-events-none select-none">2</span>
                
                <div className="animate-float-2 relative mb-8 pulse-circle">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] flex items-center justify-center text-white shadow-[0_15px_30px_rgba(16,185,129,0.4)] group-hover:-rotate-6 transition-transform duration-500 relative z-10">
                    <Wand2 className="w-10 h-10" strokeWidth={2} />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-white mb-4 group-hover:text-emerald-400 transition-colors relative z-10">Smart Matches</h3>
                <p className="text-slate-300 font-medium text-sm leading-relaxed relative z-10">
                  Our advanced AI algorithm analyzes your profile to connect you directly with tailored, premium job roles.
                </p>
              </div>
            </Reveal>

            {/* Step 3 */}
            <Reveal delay={500} className="h-full">
              <div className="group relative flex flex-col items-center text-center bg-white h-full p-8 lg:p-10 rounded-[2.5rem] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-emerald-200 hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.25)] hover:-translate-y-4 transition-all duration-500 overflow-hidden">
                <span className="absolute -bottom-8 -right-4 text-[150px] font-black text-slate-50 group-hover:text-emerald-50/50 group-hover:scale-110 transition-all duration-700 pointer-events-none select-none">3</span>
                
                <div className="animate-float-3 relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-white to-slate-50 rounded-[2rem] flex items-center justify-center text-emerald-500 shadow-xl border border-slate-100 group-hover:rotate-6 transition-transform duration-500 relative z-10">
                    <Trophy className="w-10 h-10" strokeWidth={2} />
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors relative z-10">Get Hired</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed relative z-10">
                  Attend exclusive interviews with top-tier companies, secure your dream career, and grow exponentially.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;