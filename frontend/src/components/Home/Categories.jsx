import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/categories/');
      setCategories(res.data);
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
          <button 
            onClick={() => navigate('/categories')} 
            className="hidden md:flex items-center gap-2 text-emerald-600 font-extrabold hover:text-emerald-700 transition-colors group cursor-pointer"
          >
            Browse All 
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </div>

        {loading ? (
          <p className="text-slate-500 font-bold">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-slate-500 font-medium">No categories added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => navigate(`/categories/${cat.id}/jobs`)}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                  <span className="font-black text-2xl">{cat.name.charAt(0).toUpperCase()}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">{cat.name}</h3>
                <p className="text-slate-500 font-semibold text-sm">{cat.jobs_count || 0} Openings</p>
              </div>
            ))}
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="mt-8 text-center md:hidden">
          <button 
            onClick={() => navigate('/categories')} 
            className="px-6 py-3 bg-emerald-50 text-emerald-700 font-bold rounded-xl text-sm"
          >
            See All Categories →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Categories;