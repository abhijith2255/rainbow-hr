import React from 'react';

const Companies = () => {
  return (
    <section className="py-12 border-b border-slate-200/60 bg-white relative z-10">
      <div className="container mx-auto px-6 text-center max-w-7xl">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by 500+ Top Enterprises</p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight hover:text-emerald-600 transition-colors cursor-pointer">TCS</h3>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight hover:text-emerald-600 transition-colors cursor-pointer">Infosys</h3>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight hover:text-emerald-600 transition-colors cursor-pointer">Wipro</h3>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight hover:text-emerald-600 transition-colors cursor-pointer">Cognizant</h3>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight hover:text-emerald-600 transition-colors cursor-pointer">UST Global</h3>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight hover:text-emerald-600 transition-colors cursor-pointer">IBS</h3>
        </div>
      </div>
    </section>
  );
};

export default Companies;