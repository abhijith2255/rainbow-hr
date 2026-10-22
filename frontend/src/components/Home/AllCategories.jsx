import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/categories/');
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 md:pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-emerald-600 font-extrabold text-sm mb-3 hover:underline">
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              All Job <span className="text-emerald-500">Categories</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-2">
              Select a sector to browse all verified openings.
            </p>
          </div>

          <div className="w-full md:w-80">
            <input 
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="text-center py-20 font-bold text-slate-400">Loading categories...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center font-bold text-slate-500">
            No matching categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCategories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => navigate(`/categories/${cat.id}/jobs`)}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <span className="font-black text-2xl">{cat.name.charAt(0).toUpperCase()}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-slate-500 font-semibold text-sm">
                  {cat.jobs_count || 0} Openings
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllCategories;