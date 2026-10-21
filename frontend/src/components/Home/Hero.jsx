import React from 'react';

const Hero = () => {
  return (
    <div className="relative min-h-screen w-full">
      
      {/* Full Screen Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920" 
          alt="Premium Office Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/85 backdrop-blur-[1px]"></div>
      </div>

      {/* Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-6 pt-32 md:pt-48 pb-24 min-h-screen flex flex-col lg:flex-row items-center justify-between gap-12 z-10 relative">
        
        <div className="w-full lg:w-[50%] z-20 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-300 font-bold text-xs tracking-[0.1em] uppercase">Premium Kerala HR Network</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight text-white">
            Find the <span className="text-emerald-400 drop-shadow-md">Talent.</span><br/>
            Build the <span className="text-white">Future.</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-300 mb-8 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
            We bridge the gap between world-class companies and Kerala's elite professionals. Step into your dream career today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="bg-emerald-500 text-slate-950 px-8 py-3.5 rounded-xl font-extrabold text-base shadow-[0_10px_25px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_rgba(16,185,129,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Explore Jobs
            </button>
            <button className="bg-white/5 backdrop-blur-sm text-white border border-white/20 px-8 py-3.5 rounded-xl font-bold text-base hover:bg-white/15 hover:-translate-y-1 transition-all shadow-sm">
              Hire Professionals
            </button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 max-w-md mx-auto lg:mx-0">
             <div><h4 className="text-2xl font-extrabold text-white">500+</h4><p className="text-xs font-semibold text-slate-400 mt-1">Companies</p></div>
             <div><h4 className="text-2xl font-extrabold text-white">12K+</h4><p className="text-xs font-semibold text-slate-400 mt-1">Placements</p></div>
             <div><h4 className="text-2xl font-extrabold text-white">100%</h4><p className="text-xs font-semibold text-slate-400 mt-1">Verified</p></div>
          </div>
        </div>

        <div className="w-full lg:w-[50%] relative h-[400px] md:h-[550px] flex items-center justify-center mt-6 lg:mt-0">
          <div className="absolute w-[70%] h-[80%] rounded-[2rem] overflow-hidden border-4 border-slate-700 shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-20 animate-float-1">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800" alt="Team" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/10 to-transparent"></div>
          </div>
          <div className="absolute top-4 left-0 w-[45%] h-[45%] rounded-2xl overflow-hidden border-[3px] border-slate-700 shadow-[0_15px_30px_rgba(0,0,0,0.5)] z-30 animate-float-2">
            <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=600" alt="Professional" className="w-full h-full object-cover opacity-90" />
          </div>
          <div className="absolute bottom-4 right-0 w-[50%] h-[40%] rounded-2xl overflow-hidden border-[3px] border-slate-700 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-30 animate-float-1" style={{animationDelay: '2s'}}>
            <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80&w=600" alt="Interview" className="w-full h-full object-cover opacity-90" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;