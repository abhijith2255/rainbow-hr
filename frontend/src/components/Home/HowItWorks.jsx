import React from 'react';

const HowItWorks = () => {
  return (
    <section className="py-24 relative z-10 overflow-hidden bg-gradient-to-b from-slate-50 to-emerald-50/30">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-bold text-sm tracking-widest uppercase mb-2 block">Simple Process</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">How <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">RainbowHR</span> Works</h2>
          <p className="text-slate-500 font-medium mt-4 max-w-2xl mx-auto text-lg">Your dream job is just three simple steps away. Start your journey today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-emerald-100 via-teal-200 to-emerald-100 -translate-y-1/2 z-0"></div>

          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-[0_15px_30px_rgba(0,0,0,0.05)] border border-slate-100 mb-6 group-hover:-translate-y-3 transition-transform duration-500 relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <span className="text-2xl font-black">1</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">Create Profile</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">Sign up and build a premium portfolio that highlights your skills and experience.</p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-[0_15px_30px_rgba(16,185,129,0.3)] mb-6 group-hover:-translate-y-3 group-hover:scale-110 transition-transform duration-500">
              <span className="text-2xl font-black">2</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">Find Matches</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">Our smart AI algorithm connects you with the perfect job roles tailored for you.</p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-[0_15px_30px_rgba(0,0,0,0.05)] border border-slate-100 mb-6 group-hover:-translate-y-3 transition-transform duration-500 relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <span className="text-2xl font-black">3</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">Get Hired</h3>
            <p className="text-slate-500 font-medium text-sm leading-relaxed px-4">Attend interviews with top companies and secure your dream career.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;