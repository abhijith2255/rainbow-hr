import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, ArrowLeft } from 'lucide-react';
import { CompanyLogo } from './categoryVisuals';
import Reveal from './Reveal';

// Premium generic office images for job covers
const coverImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
];

// Helper to fix backend image URLs
const getImageUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `https://rainbow-hr.onrender.com${path}`;
};

const CategoryJobs = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobsAndCategory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [categoryId]);

  const fetchJobsAndCategory = async () => {
    setLoading(true);
    try {
      const catRes = await axios.get('https://rainbow-hr.onrender.com/api/jobs/categories/');
      const currentCat = catRes.data.find(c => c.id === parseInt(categoryId));
      if (currentCat) setCategoryName(currentCat.name);

      const token = localStorage.getItem('authToken');
      const jobsRes = await axios.get('https://rainbow-hr.onrender.com/api/jobs/?public=true', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const filtered = (Array.isArray(jobsRes.data) ? jobsRes.data : []).filter(
        job => job.category === parseInt(categoryId)
      );
      setJobs(filtered);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 md:pt-36 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link to="/categories" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-[0.2em] mb-4 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
              All Categories
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
              {categoryName ? (
                <>
                  {categoryName.split(' ')[0]}{' '}
                  <span className="text-emerald-500 font-serif italic font-medium capitalize">
                    {categoryName.substring(categoryName.indexOf(' ') + 1) || 'Jobs'}
                  </span>
                </>
              ) : (
                <>Category <span className="text-emerald-500 font-serif italic font-medium capitalize">Jobs</span></>
              )}
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base mt-4 max-w-xl">
              {loading ? 'Loading verified openings...' : `Showing ${jobs.length} verified opening${jobs.length === 1 ? '' : 's'} in this sector.`}
            </p>
          </div>
          <Link to="/categories" className="hidden md:inline-flex items-center justify-center px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all">
            Browse Other Sectors
          </Link>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-slate-200 rounded-[2rem] h-[350px] animate-pulse"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
              <span className="text-2xl">💼</span>
            </div>
            <p className="text-slate-900 font-black text-xl mb-2">No active openings right now</p>
            <p className="text-slate-500 font-medium text-sm mb-6">Check back later or explore other thriving sectors.</p>
            <Link to="/categories" className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 transition-all duration-300">
              Explore All Sectors
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobs.map((job, index) => {
              const coverImg = coverImages[index % coverImages.length];
              return (
                <Reveal key={job.id} delay={index * 50}>
                  <div
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="group flex flex-col h-full bg-white rounded-[2rem] p-3 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(16,185,129,0.15)] transition-all duration-300 cursor-pointer"
                  >
                    {/* Top Image Section */}
                    <div className="relative w-full h-48 rounded-[1.5rem] overflow-hidden bg-slate-100 mb-5">
                      <img 
                        src={coverImg} 
                        alt="Job Cover" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80";
                        }}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      
                      {/* Floating Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-900 shadow-sm">
                        {job.job_type || 'Full Time'}
                      </div>

                      {/* Applied Status */}
                      {job.has_applied && (
                        <div className="absolute top-3 right-3 bg-emerald-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                          Applied
                        </div>
                      )}
                      
                      {/* Floating Company Logo */}
                      {job.company_logo && (
                        <div className="absolute bottom-3 left-3 w-12 h-12 bg-white rounded-xl p-1.5 shadow-md">
                          <img 
                            src={getImageUrl(job.company_logo)} 
                            alt="Logo" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                            className="w-full h-full object-contain" 
                          />
                        </div>
                      )}
                    </div>

                    {/* Bottom Details Section */}
                    <div className="px-3 pb-3 flex flex-col flex-grow">
                      <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-slate-500 font-semibold text-xs mb-4 truncate">
                        {job.company_name} • {job.location}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Salary</span>
                          <span className="text-base font-black text-slate-900">
                            {job.salary_range || 'Best in Market'}
                          </span>
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:bg-slate-900 transition-colors duration-300 shrink-0">
                          <Plus className="w-5 h-5 text-white" strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/categories" className="inline-flex items-center justify-center px-6 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all w-full">
            Browse Other Sectors
          </Link>
        </div>

      </div>
    </div>
  );
};

export default CategoryJobs;