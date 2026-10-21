import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-20 pb-10 relative z-10 overflow-hidden">
      {/* Subtle Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-24 bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Main Footer Content - മൊബൈലിൽ 2 കോളം, ഡെസ്ക്ടോപ്പിൽ 12 കോളം */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-6 gap-y-12 mb-16">

          {/* Brand Section - മൊബൈലിൽ ഫുൾ വീതി (col-span-2) */}
          <div className="col-span-2 md:col-span-4">
            <h2 className="text-3xl font-black text-white tracking-tight mb-4">
              Rainbow<span className="text-emerald-500">HR.</span>
            </h2>
            <p className="text-slate-400 font-medium text-sm leading-relaxed mb-8 max-w-sm">
              Kerala's most trusted premium job portal connecting top talents with leading global and local enterprises.
            </p>
            {/* Social Icons (Premium Style) */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-sm"><span className="font-black text-xs uppercase tracking-wider">fb</span></div>
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-sm"><span className="font-black text-xs uppercase tracking-wider">ig</span></div>
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all duration-300 cursor-pointer hover:-translate-y-1 shadow-sm"><span className="font-black text-xs uppercase tracking-wider">in</span></div>
            </div>
          </div>
          
          {/* Candidates Links - മൊബൈലിൽ ഒരു ഭാഗം (col-span-1) */}
          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <h4 className="font-black text-white mb-6 uppercase tracking-wider text-xs">Candidates</h4>
            <ul className="space-y-4 text-sm font-semibold text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Submit Resume</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Dashboard</a></li>
            </ul>
          </div>

          {/* Employers Links - മൊബൈലിൽ അടുത്ത ഭാഗം (col-span-1) */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="font-black text-white mb-6 uppercase tracking-wider text-xs">Employers</h4>
            <ul className="space-y-4 text-sm font-semibold text-slate-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Post a Job</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Find Talent</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Pricing Plans</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Dashboard</a></li>
            </ul>
          </div>

          {/* Contact - മൊബൈലിൽ ഫുൾ വീതി (col-span-2) */}
          <div className="col-span-2 md:col-span-4 lg:col-span-3 lg:col-start-10">
            <h4 className="font-black text-white mb-6 uppercase tracking-wider text-xs">Contact Us</h4>
            <ul className="space-y-4 text-sm font-semibold text-slate-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Highmax TechStudio,<br/>Cyberpark, Kozhikode, Kerala
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                support@rainbowhr.com
              </li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-500">© 2026 RainbowHR. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-bold text-slate-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;