import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const MAX_FEATURED_JOBS = 4;

// 100% Working Premium generic office images for job covers
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

const FeaturedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedJobs();
  }, []);

  const fetchApprovedJobs = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('https://rainbow-hr.onrender.com/api/jobs/?public=true', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const featuredJobs = jobs.slice(0, MAX_FEATURED_JOBS);

  return (
    <section className="py-20 sm:py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <Reveal className="mb-14">
          <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.2em] mb-2">Popular</p>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Most Applied <span className="text-emerald-500 font-serif italic font-medium">Jobs</span>
          </h2>
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: MAX_FEATURED_JOBS }).map((_, index) => (
              <div key={index} className="bg-slate-100 rounded-[2rem] h-[350px] animate-pulse"></div>
            ))}
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-[2rem]">
            <p className="text-slate-500 font-bold">No jobs available right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredJobs.map((job, index) => {
              const coverImg = coverImages[index % coverImages.length];
              return (
                <Reveal key={job.id} delay={index * 100} className="h-full">
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
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm">
                        {job.job_type || 'Full Time'}
                      </div>
                      
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
                      <p className="text-slate-500 font-semibold text-xs mb-4">
                        {job.company_name} • {job.experience_required || 'Fresher'}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest">Salary</span>
                          <span className="text-base font-black text-slate-900">
                            {job.salary_range || 'Best in Market'}
                          </span>
                        </div>
                        
                        {/* Circular Green Plus Button */}
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:bg-slate-900 transition-colors duration-300">
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

        {/* View All Jobs Button */}
        <Reveal className="text-center mt-12">
          <button
            onClick={() => navigate('/jobs')}
            className="group inline-flex items-center gap-2 bg-slate-900 hover:bg-emerald-500 text-white font-black px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Explore All Jobs
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
        </Reveal>

      </div>
    </section>
  );
};

export default FeaturedJobs;