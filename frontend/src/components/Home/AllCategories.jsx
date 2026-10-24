import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, X, ArrowRight, SlidersHorizontal, LayoutGrid } from 'lucide-react';
import Reveal from './Reveal';

// Premium background images for categories (100% Working Links)
const bgImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
];

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openingsOnly, setOpeningsOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await axios.get('https://rainbow-hr.onrender.com/api/jobs/categories/');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return categories.filter((cat) => {
      const matchesTerm = !term || cat.name.toLowerCase().includes(term);
      const matchesFilter = !openingsOnly || (cat.jobs_count || 0) > 0;
      return matchesTerm && matchesFilter;
    });
  }, [categories, searchTerm, openingsOnly]);

  const totalOpenings = useMemo(
    () => categories.reduce((sum, cat) => sum + (cat.jobs_count || 0), 0),
    [categories]
  );

  const hasFilters = Boolean(searchTerm.trim()) || openingsOnly;

  const clearFilters = () => {
    setSearchTerm('');
    setOpeningsOnly(false);
  };

  return (
    <div className="relative min-h-screen bg-[#FAFAFA] pt-28 md:pt-36 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto z-10 relative">

        {/* ---------- Header ---------- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-slate-500 font-bold text-xs tracking-[0.2em] uppercase mb-5 hover:text-emerald-600 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase">
              Browse by{' '}
              <span className="text-emerald-500 capitalize font-serif italic font-medium">
                Industry.
              </span>
            </h1>
            <p className="text-slate-500 font-medium mt-4 text-base md:text-lg max-w-xl leading-relaxed">
              Curated openings across Kerala's fastest growing sectors. Pick a field to
              explore verified roles from trusted employers.
            </p>
          </div>

          {/* Live stats */}
          <div className="flex gap-4 shrink-0">
            <div className="rounded-3xl border border-slate-200 bg-white px-7 py-5 min-w-[8rem] shadow-sm">
              <p className="text-3xl font-black text-slate-900 leading-none">{categories.length}</p>
              <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mt-2">Sectors</p>
            </div>
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-7 py-5 min-w-[8rem] shadow-sm">
              <p className="text-3xl font-black text-emerald-600 leading-none">{totalOpenings}</p>
              <p className="text-[11px] font-bold tracking-wider uppercase text-emerald-600/70 mt-2">Openings</p>
            </div>
          </div>
        </div>

        {/* ---------- Search / filter bar ---------- */}
        <div className="mb-10 rounded-[2rem] border border-slate-100 bg-white p-4 md:p-5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search a sector, e.g. Healthcare, Finance..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpeningsOnly((value) => !value)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold border transition-all duration-300 ${
                openingsOnly
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Only with openings
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 px-2">
            <p className="text-xs font-semibold tracking-wide text-slate-400">
              Showing <span className="text-slate-900 font-bold">{filteredCategories.length}</span> of{' '}
              {categories.length} sectors
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* ---------- Grid ---------- */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[2rem] bg-slate-200 h-[280px] animate-pulse"
              ></div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-[2.5rem] border border-dashed border-slate-200 bg-white px-8 py-20 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
              <LayoutGrid className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">No sectors match your search</h3>
            <p className="text-slate-500 text-sm font-medium mb-7">
              Try a different keyword, or reset the filters to see every sector.
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((cat, index) => {
              const openings = cat.jobs_count || 0;
              const bgImage = bgImages[index % bgImages.length];

              return (
                <Reveal key={cat.id} delay={index * 50}>
                  <Link
                    to={`/categories/${cat.id}/jobs`}
                    className="group relative block w-full h-[280px] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer bg-slate-900"
                  >
                    {/* Background Image with Fallback */}
                    <img 
                      src={bgImage} 
                      alt={cat.name} 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80";
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100"></div>
                    
                    {/* Openings Badge */}
                    <div className="absolute top-5 right-5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider text-slate-900 shadow-sm z-10">
                      {openings} Jobs
                    </div>

                    {/* Content inside Image */}
                    <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end z-10">
                      <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 leading-tight">
                        {cat.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          Explore Sector
                        </p>
                        
                        {/* Circular Action Button */}
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-emerald-500 group-hover:border-emerald-500 flex items-center justify-center transition-all duration-300 shrink-0">
                          <ArrowRight className="w-4 h-4 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllCategories;