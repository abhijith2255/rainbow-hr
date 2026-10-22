import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight } from 'lucide-react';
import { CategoryIcon, getCategoryTheme } from './categoryVisuals';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/categories/');
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-slate-50 relative z-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Popular <span className="text-emerald-500">Categories</span>
            </h2>
            <p className="text-slate-500 font-medium mt-3 text-lg">
              Explore the most demanded job sectors in the market.
            </p>
          </div>
          <Link
            to="/categories"
            className="hidden md:flex items-center gap-2 text-emerald-600 font-extrabold hover:text-emerald-700 transition-colors group"
          >
            Browse All
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-100 animate-pulse">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 mb-6"></div>
                <div className="h-5 w-2/3 rounded-full bg-slate-100 mb-3"></div>
                <div className="h-3 w-1/3 rounded-full bg-slate-50"></div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-slate-500 font-medium">No categories added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((cat, index) => {
              const theme = getCategoryTheme(index);
              const openings = cat.jobs_count || 0;

              return (
                <Link
                  key={cat.id}
                  to={`/categories/${cat.id}/jobs`}
                  className={`group relative overflow-hidden bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.18)] ${theme.ring}`}
                >
                  {/* Category-inte color-il ulla soft glow - hover-il mattram kaanikkunnu */}
                  <div
                    className={`pointer-events-none absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br ${theme.icon} opacity-0 blur-[55px] transition-opacity duration-500 group-hover:opacity-25`}
                  ></div>

                  <div className="relative flex items-start justify-between gap-3 mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center shadow-lg ${theme.glow} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                    >
                      <CategoryIcon iconName={cat.icon} className="w-8 h-8 text-white" />
                    </div>

                    <span className="rounded-full bg-slate-50 border border-slate-100 px-3 py-1.5 text-[11px] font-black tracking-wide uppercase text-slate-500">
                      {openings} {openings === 1 ? 'Opening' : 'Openings'}
                    </span>
                  </div>

                  <h3 className="relative text-xl font-extrabold text-slate-900 mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="relative text-slate-500 font-semibold text-sm">
                    Verified roles in this sector
                  </p>
                </Link>
              );
            })}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm"
          >
            See All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;
