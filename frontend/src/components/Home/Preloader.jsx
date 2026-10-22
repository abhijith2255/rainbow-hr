import React, { useEffect, useState } from 'react';

// Homepage aadyamayi load cheyyumbol kaanikkunna sleek, premium preloader.
// Vedikkulla load feel ozhivakkan vendi ~700ms-ൽ fade out aayi maayunnu.
const Preloader = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 700);
    const doneTimer = setTimeout(() => onFinish && onFinish(), 1200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <div
      aria-label="Loading"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 transition-opacity duration-500 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient brand glows */}
      <div className="absolute w-[30rem] h-[30rem] bg-emerald-500/20 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute w-[20rem] h-[20rem] bg-teal-400/10 rounded-full blur-[110px] pointer-events-none translate-y-24 translate-x-24"></div>

      <div className="relative flex flex-col items-center px-6">
        {/* Pulsing brand mark + rotating ring */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <span className="absolute inset-0 rounded-[1.75rem] bg-emerald-500/30 blur-2xl animate-pulse-glow"></span>
          <span className="absolute inset-[-10px] rounded-full border border-white/10 border-t-emerald-400 border-r-emerald-400/40 animate-spin-slow"></span>
          <div className="relative w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-[0_20px_50px_-12px_rgba(16,185,129,0.75)] animate-logo-pop">
            <span className="text-3xl font-black text-slate-950 tracking-tighter">R</span>
          </div>
        </div>

        <h1 className="mt-7 text-2xl font-black tracking-tighter text-white">
          Rainbow<span className="text-emerald-400">HR.</span>
        </h1>
        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.42em] text-emerald-300/70">
          Kerala&apos;s Premium HR Network
        </p>

        {/* Slim progress bar */}
        <div className="mt-6 w-44 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 animate-load-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
