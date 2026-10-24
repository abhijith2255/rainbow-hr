import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Plus } from 'lucide-react';

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

const AllJobs = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [locationTerm, setLocationTerm] = useState(searchParams.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    setLocationTerm(searchParams.get('location') || '');
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const [jobsRes, catRes] = await Promise.all([
        axios.get('https://rainbow-hr.onrender.com/api/jobs/?public=true', { headers }),
        axios.get('https://rainbow-hr.onrender.com/api/jobs/categories/'),
      ]);
      setJobs(Array.isArray(jobsRes.data) ? jobsRes.data : []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = job.location?.toLowerCase().includes(locationTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === parseInt(selectedCategory);
    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] pt-28 md:pt-36 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-[0.2em] mb-4 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight uppercase">
              Explore All <span className="text-emerald-500 font-serif italic font-medium capitalize">Jobs</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm md:text-base mt-4 max-w-xl">
              {loading ? 'Loading verified openings...' : `Showing ${filteredJobs.length} verified opening${filteredJobs.length === 1 ? '' : 's'} across Kerala. Find your next career move.`}
            </p>
          </div>
        </div>

        {/* Search + Location + Category Filter */}
        <div className="bg-white p-4 md:p-5 rounded-[2rem] border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] mb-10 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300"
            />
          </div>
          <div className="relative lg:w-64">
            <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Location"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="lg:w-64 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 cursor-pointer transition-all duration-300"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="bg-slate-200 rounded-[2rem] h-[350px] animate-pulse"></div>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm">
            <p className="text-slate-900 font-black text-xl mb-2">No jobs match your search.</p>
            <p className="text-slate-500 font-medium text-sm">Try a different keyword, location, or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJobs.map((job, index) => {
              const coverImg = coverImages[index % coverImages.length];
              return (
                <div
                  key={job.id}
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
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllJobs;