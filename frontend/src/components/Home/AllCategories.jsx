import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, X, ArrowRight, SlidersHorizontal, LayoutGrid, Briefcase } from 'lucide-react';
import { CategoryIcon, getCategoryTheme } from './categoryVisuals';

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

  // Category id -> theme map. Ithu vazhi search filter cheyyumbol koodi
  // oru category-de color maaraanilla (index maariyalum color same aayirikkum).
  const themeById = useMemo(() => {
    const map = new Map();
    categories.forEach((cat, index) => map.set(cat.id, getCategoryTheme(index)));
    return map;
  }, [categories]);

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
    <div className="relative min-h-screen bg-slate-950 overflow-hidden pt-28 md:pt-32 pb-24 px-6">
      {/* Ambient gradient glows - Hero section-inte same premium feel */}
      <div className="absolute top-[-12%] left-[-10%] w-[42rem] h-[42rem] bg-emerald-500/15 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-25%] right-[-12%] w-[38rem] h-[38rem] bg-teal-400/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/2 w-[32rem] h-[32rem] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto z-10">

        {/* ---------- Header ---------- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-emerald-300/80 font-bold text-xs tracking-[0.2em] uppercase mb-5 hover:text-emerald-300 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.05]">
              Browse by{' '}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Industry.
              </span>
            </h1>
            <p className="text-slate-400 font-light mt-5 text-base md:text-lg max-w-xl leading-relaxed">
              Curated openings across Kerala's fastest growing sectors. Pick a field to
              explore verified roles from trusted employers.
            </p>
          </div>

          {/* Live stats */}
          <div className="flex gap-4 shrink-0">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-6 py-4 min-w-[7.5rem]">
              <p className="text-3xl font-black text-white leading-none">{categories.length}</p>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300/70 mt-2">Sectors</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl px-6 py-4 min-w-[7.5rem]">
              <p className="text-3xl font-black text-white leading-none">{totalOpenings}</p>
              <p className="text-[11px] font-semibold tracking-wider uppercase text-emerald-300/70 mt-2">Openings</p>
            </div>
          </div>
        </div>

        {/* ---------- Search / filter bar ---------- */}
        <div className="mb-8 rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 md:p-5 shadow-[0_25px_60px_-30px_rgba(0,0,0,0.9)]">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search a sector, e.g. Healthcare, Finance..."
                className="w-full bg-slate-900/60 border border-white/10 rounded-2xl pl-12 pr-12 py-3.5 text-sm font-semibold text-white placeholder-slate-500 outline-none focus:border-emerald-400/50 focus:bg-slate-900/80 transition-all duration-300"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpeningsOnly((value) => !value)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold border transition-all duration-300 ${
                openingsOnly
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 border-transparent shadow-[0_12px_30px_-12px_rgba(16,185,129,0.7)]'
                  : 'bg-slate-900/60 text-slate-300 border-white/10 hover:border-white/25 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Only with openings
            </button>
          </div>

          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-xs font-semibold tracking-wide text-slate-400">
              Showing <span className="text-white font-bold">{filteredCategories.length}</span> of{' '}
              {categories.length} sectors
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-emerald-300/80 hover:text-emerald-300 transition-colors"
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
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 animate-pulse"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/10 mb-7"></div>
                <div className="h-5 w-2/3 rounded-full bg-white/10 mb-3"></div>
                <div className="h-3 w-1/3 rounded-full bg-white/5"></div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.02] px-8 py-20 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <LayoutGrid className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">No sectors match your search</h3>
            <p className="text-slate-400 text-sm font-medium mb-7">
              Try a different keyword, or reset the filters to see every sector.
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 px-6 py-3 text-sm font-extrabold text-slate-950 shadow-[0_15px_40px_-12px_rgba(16,185,129,0.7)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((cat) => {
              const theme = themeById.get(cat.id) || getCategoryTheme(0);
              const openings = cat.jobs_count || 0;

              return (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.id}/jobs`}
                  className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 shadow-md shadow-black/40 transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-black/60 ${theme.ring}`}
                >
                  {/* Colored glow blob - hover-il soft aayi bright aakunnu */}
                  <div
                    className={`pointer-events-none absolute -top-20 -right-20 w-44 h-44 rounded-full bg-gradient-to-br ${theme.icon} opacity-0 blur-[70px] transition-opacity duration-500 group-hover:opacity-30`}
                  ></div>

                  {/* Top gradient hairline */}
                  <div
                    className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r ${theme.icon} opacity-40`}
                  ></div>

                  <div className="relative flex items-start justify-between gap-4 mb-7">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center shadow-lg ${theme.glow} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                    >
                      <CategoryIcon iconName={cat.icon} className="w-8 h-8 text-white" />
                    </div>

                    {/* Corner arrow — hover-il maathram slide aayi kaanikkunnu */}
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:bg-white/10 group-hover:text-white">
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                  </div>

                  <h3
                    className={`relative text-xl font-extrabold tracking-tight text-white mb-3 transition-colors duration-300 ${theme.accent}`}
                  >
                    {cat.name}
                  </h3>

                  {/* Available Jobs count — name-inu thazhe clean modern badge */}
                  <span
                    className={`relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-black tracking-wide ${theme.chip}`}
                  >
                    <Briefcase className="w-3 h-3" strokeWidth={2.5} />
                    {openings} {openings === 1 ? 'JOB' : 'JOBS'} AVAILABLE
                  </span>

                  <p className="relative mt-4 text-sm font-medium text-slate-400 leading-relaxed">
                    Verified roles from trusted employers in this sector.
                  </p>

                  <div className="relative mt-6 flex items-center gap-2 text-sm font-bold text-slate-300">
                    Browse jobs
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllCategories;
