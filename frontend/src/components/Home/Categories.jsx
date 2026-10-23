import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, ArrowUpRight, Briefcase } from 'lucide-react';
import { CategoryIcon, getCategoryTheme } from './categoryVisuals';
import Reveal from './Reveal';

// Home page-il kaanikkunna curated sectors-nte ennam (clutter ozhivakkan 6 mattram)
const MAX_SECTORS = 6;

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://rainbow-hr.onrender.com/api/jobs/categories/');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const sectors = categories.slice(0, MAX_SECTORS);

  return (
    <section className="relative py-20 sm:py-24 bg-slate-50 overflow-hidden">
      {/* Ambient glows — premium international portal feel */}
      <div className="pointer-events-none absolute -top-24 left-[-10%] w-[32rem] h-[32rem] bg-emerald-200/25 rounded-full blur-[140px]"></div>
      <div className="pointer-events-none absolute bottom-[-20%] right-[-10%] w-[28rem] h-[28rem] bg-teal-200/25 rounded-full blur-[140px]"></div>

      <div className="relative container mx-auto px-5 sm:px-6 max-w-7xl z-10">

        {/* Curated header — centered, roomy, uncluttered */}
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 bg-white text-emerald-600 border border-emerald-100 rounded-full font-black text-[11px] tracking-[0.2em] uppercase mb-4 shadow-sm">
            Top Sectors
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Explore by{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Industry</span>
          </h2>
          <p className="text-slate-500 font-medium mt-4 text-base sm:text-lg">
            The most in-demand hiring sectors across Kerala, curated for verified roles only.
          </p>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: MAX_SECTORS }).map((_, index) => (
              <div key={index} className="bg-white p-7 rounded-3xl border border-slate-100 animate-pulse h-[190px]"></div>
            ))}
          </div>
        ) : sectors.length === 0 ? (
          <p className="text-center text-slate-500 font-medium">No categories added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((cat, index) => {
              const theme = getCategoryTheme(index);
              const openings = cat.jobs_count || 0;

              return (
                <Reveal key={cat.id} delay={index * 70} className="h-full">
                  <Link
                    to={`/categories/${cat.id}/jobs`}
                    className={`group relative flex h-full flex-col overflow-hidden bg-white p-7 rounded-3xl border border-slate-100 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-slate-200 will-change-transform ${theme.ring}`}
                  >
                    {/* Sector-inte color-il ulla soft glow — hover-il maathram varunnu */}
                    <div className={`pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${theme.icon} opacity-0 blur-[60px] transition-opacity duration-500 group-hover:opacity-25`}></div>

                    {/* Corner arrow badge */}
                    <div className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 group-hover:rotate-45">
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                    </div>

                    {/* Icon tile */}
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center shadow-lg ${theme.glow} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                      <CategoryIcon iconName={cat.icon} className="w-7 h-7 text-white" />
                    </div>

                    {/* Name + Available Jobs badge */}
                    <div className="relative flex flex-1 flex-col">
                      <h3 className="mt-5 text-lg font-extrabold tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-emerald-600">
                        {cat.name}
                      </h3>
                      <span className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-slate-500 transition-colors duration-300 group-hover:border-emerald-100 group-hover:bg-emerald-50 group-hover:text-emerald-600">
                        <Briefcase className="w-3 h-3" strokeWidth={2.5} />
                        {openings} {openings === 1 ? 'Job' : 'Jobs'} Available
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal className="mt-12 text-center">
          <Link
            to="/categories"
            className="group inline-flex items-center gap-2 px-7 py-4 bg-white border border-slate-200 text-slate-800 font-extrabold rounded-2xl text-sm shadow-sm hover:border-emerald-200 hover:text-emerald-600 hover:shadow-md transition-all"
          >
            Browse All Sectors
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default Categories;
