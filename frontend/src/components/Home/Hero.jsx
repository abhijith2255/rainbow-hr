import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Building2, Users } from 'lucide-react';
import Reveal from './Reveal';

const Hero = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobTitle.trim()) params.set('q', jobTitle.trim());
    if (location.trim()) params.set('location', location.trim());
    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="bg-[#FAFAFA] pt-24 md:pt-32 pb-16 px-4 sm:px-6 relative z-10">
      <div className="max-w-7xl mx-auto relative">
        
        {/* Boxed Hero Image Card - Responsive Height Fixed */}
        <Reveal>
          <div className="relative w-full rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl">
            {/* Premium Background Image */}
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80"
              alt="Modern Office"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/40"></div>
            
            {/* Content Inside Hero - Using Padding for natural responsiveness */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 py-16 sm:py-24 md:py-32 mt-6 md:mt-0">
              <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-black text-[10px] tracking-[0.25em] uppercase mb-4 sm:mb-5 shadow-sm">
                Kerala's Premium Network
              </span>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black tracking-tight text-white leading-[1.1] uppercase drop-shadow-lg mb-4 sm:mb-5">
                Build Your <br />
                <span className="text-emerald-400 font-serif italic font-medium capitalize">Dream Career</span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-white/90 font-medium max-w-2xl drop-shadow-md px-2">
                Connecting verified professionals with top-tier organizations. Start your journey with highly curated roles.
              </p>

              {/* Floating Search Bar */}
              <form
                onSubmit={handleSearch}
                className="w-full max-w-4xl bg-white p-2.5 sm:p-3 rounded-[1.5rem] sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-stretch gap-2 mt-8 md:mt-12 transition-all duration-300 focus-within:ring-4 focus-within:ring-emerald-500/30"
              >
                <div className="flex items-center gap-3 flex-1 px-4 py-3 sm:py-0">
                  <Search className="w-5 h-5 text-emerald-500 shrink-0" strokeWidth={2.5} />
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Job title or company..."
                    className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder-slate-400 outline-none"
                  />
                </div>

                <div className="hidden sm:block w-px h-10 my-auto bg-slate-200"></div>
                <div className="sm:hidden h-px mx-4 bg-slate-100"></div>

                <div className="flex items-center gap-3 flex-1 px-4 py-3 sm:py-0">
                  <MapPin className="w-5 h-5 text-emerald-500 shrink-0" strokeWidth={2.5} />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Location"
                    className="w-full bg-transparent text-sm font-bold text-slate-900 placeholder-slate-400 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-emerald-600 text-white px-8 py-4 sm:py-0 rounded-xl sm:rounded-full font-black text-sm tracking-wide transition-colors shadow-md shrink-0 flex items-center justify-center gap-2 mt-1 sm:mt-0"
                >
                  Find Job <span className="hidden sm:inline">→</span>
                </button>
              </form>
            </div>
          </div>
        </Reveal>

        {/* Overlapping Info Cards */}
        <Reveal delay={200}>
          <div className="relative z-30 -mt-10 md:-mt-16 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5 px-4 sm:px-8">
            {/* Card 1 */}
            <div className="bg-white rounded-[1.5rem] sm:rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">10K+</h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Active Openings</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-[1.5rem] sm:rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">5K+</h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Top Companies</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[1.5rem] sm:rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3 sm:mb-4 shadow-sm">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">50K+</h3>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">Hired Candidates</p>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default Hero;