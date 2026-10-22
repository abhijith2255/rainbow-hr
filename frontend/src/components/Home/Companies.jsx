import React from 'react';

// Kerala / India-il candidates trusted aayi ariyunna enterprises.
const BRANDS = [
  'TCS', 'Infosys', 'Wipro', 'Cognizant', 'UST Global', 'IBS Software',
  'HCLTech', 'Tech Mahindra', 'Zoho', 'Freshworks', 'Accenture', 'Capgemini',
];

// Oru brand pill — card-inu glassmorphism look + hover-il brand color.
const BrandPill = ({ name }) => (
  <div className="group flex items-center gap-3 shrink-0 px-6 py-4 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.25)] hover:border-emerald-200 hover:shadow-[0_18px_40px_-18px_rgba(16,185,129,0.35)] transition-all duration-300">
    <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
    <span className="text-lg sm:text-xl font-black text-slate-700 tracking-tight whitespace-nowrap group-hover:text-emerald-600 transition-colors">
      {name}
    </span>
  </div>
);

const Companies = () => {
  return (
    <section id="companies" className="py-16 sm:py-20 bg-white border-b border-slate-200/60 relative z-10 scroll-mt-28 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6 max-w-7xl text-center mb-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
          Trusted by 5,000+ Top Enterprises
        </p>
      </div>

      {/* Auto-scrolling marquee — edges-il soft fade mask */}
      <div className="marquee-paused relative w-full [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee">
          {/* Rande same copies — -50% translate seamless loop undakkunnu */}
          {[0, 1].map((group) => (
            <div
              key={group}
              aria-hidden={group === 1}
              className="flex items-center gap-5 sm:gap-7 pr-5 sm:pr-7"
            >
              {BRANDS.map((brand) => (
                <BrandPill key={`${group}-${brand}`} name={brand} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;
