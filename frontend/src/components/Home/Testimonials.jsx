import React from 'react';

const Testimonials = () => {
  return (
    <section className="py-32 relative bg-slate-950 overflow-hidden z-10">
      {/* Deep Premium Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-[40rem] h-[40rem] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-emerald-400 font-extrabold text-xs tracking-[0.2em] uppercase mb-4 block flex items-center gap-2">
              <span className="w-8 h-px bg-emerald-400"></span> Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Trusted by Kerala's <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Elite Professionals.</span>
            </h2>
          </div>
          <div className="text-slate-400 font-medium text-lg max-w-sm md:text-right">
            Discover how RainbowHR is transforming careers and building the future of work.
          </div>
        </div>

        {/* Staggered Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Review 1 */}
          <div className="mt-0">
            {/* Gradient Border Wrapper */}
            <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent hover:from-emerald-500/50 transition-colors duration-500 group h-full cursor-pointer">
              {/* Inner Card */}
              <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden h-full flex flex-col">
                {/* Watermark Quote Icon */}
                <svg className="absolute top-6 right-6 w-24 h-24 text-white/5 rotate-3 group-hover:-rotate-3 transition-transform duration-500" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z"/></svg>
                
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="flex gap-1 text-emerald-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400/80 bg-emerald-400/10 px-2 py-1 rounded-md">Verified</span>
                </div>
                
                <p className="text-slate-300 font-medium text-lg leading-relaxed mb-10 flex-grow relative z-10">
                  "RainbowHR completely changed my job search experience. The premium profile design helped me stand out, and I landed a Senior Developer role at Wipro within two weeks!"
                </p>
                
                <div className="flex items-center gap-4 relative z-10 border-t border-white/10 pt-6 mt-auto">
                  <img src="https://ui-avatars.com/api/?name=Arjun+K&background=0f172a&color=34d399&bold=true" alt="Arjun" className="w-14 h-14 rounded-full border border-white/20 group-hover:border-emerald-400 transition-colors" />
                  <div>
                    <h4 className="text-white font-extrabold text-base">Arjun Krishnan</h4>
                    <p className="text-slate-400 text-xs font-bold tracking-wide mt-0.5">Senior Dev <span className="text-emerald-400">@Wipro</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review 2 - Staggered Down (മധ്യത്തിലെ കാർഡ് താഴേക്ക് ഇറങ്ങി നിൽക്കുന്നു) */}
          <div className="md:mt-16">
            <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent hover:from-blue-500/50 transition-colors duration-500 group h-full cursor-pointer">
              <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden h-full flex flex-col">
                <svg className="absolute top-6 right-6 w-24 h-24 text-white/5 rotate-3 group-hover:-rotate-3 transition-transform duration-500" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z"/></svg>
                
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="flex gap-1 text-blue-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400/80 bg-blue-400/10 px-2 py-1 rounded-md">Employer</span>
                </div>
                
                <p className="text-slate-300 font-medium text-lg leading-relaxed mb-10 flex-grow relative z-10">
                  "As an employer, finding the right tech talent in Kerala was always tough. This platform made our hiring process incredibly smooth, fast, and highly efficient."
                </p>
                
                <div className="flex items-center gap-4 relative z-10 border-t border-white/10 pt-6 mt-auto">
                  <img src="https://ui-avatars.com/api/?name=Meera+M&background=0f172a&color=60a5fa&bold=true" alt="Meera" className="w-14 h-14 rounded-full border border-white/20 group-hover:border-blue-400 transition-colors" />
                  <div>
                    <h4 className="text-white font-extrabold text-base">Meera Menon</h4>
                    <p className="text-slate-400 text-xs font-bold tracking-wide mt-0.5">HR Director <span className="text-blue-400">@TCS</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="mt-0">
            <div className="p-[1px] rounded-[2.5rem] bg-gradient-to-b from-white/20 via-white/5 to-transparent hover:from-purple-500/50 transition-colors duration-500 group h-full cursor-pointer">
              <div className="bg-slate-900/90 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden h-full flex flex-col">
                <svg className="absolute top-6 right-6 w-24 h-24 text-white/5 rotate-3 group-hover:-rotate-3 transition-transform duration-500" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H8c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z"/></svg>
                
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="flex gap-1 text-purple-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-400/80 bg-purple-400/10 px-2 py-1 rounded-md">Verified</span>
                </div>
                
                <p className="text-slate-300 font-medium text-lg leading-relaxed mb-10 flex-grow relative z-10">
                  "The UI is gorgeous, and the AI job suggestions were perfectly matched to my skills. Highly recommend RainbowHR to any professional seeking growth."
                </p>
                
                <div className="flex items-center gap-4 relative z-10 border-t border-white/10 pt-6 mt-auto">
                  <img src="https://ui-avatars.com/api/?name=Rakesh+S&background=0f172a&color=c084fc&bold=true" alt="Rakesh" className="w-14 h-14 rounded-full border border-white/20 group-hover:border-purple-400 transition-colors" />
                  <div>
                    <h4 className="text-white font-extrabold text-base">Rakesh Sharma</h4>
                    <p className="text-slate-400 text-xs font-bold tracking-wide mt-0.5">UI/UX Lead <span className="text-purple-400">@UST</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Testimonials;