import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { CompanyLogo } from './categoryVisuals';
import { Search, MapPin } from 'lucide-react';

// എല്ലാ അപ്രൂവ്ഡ് ജോബുകളും കാണിക്കുന്ന പ്രത്യേക പേജ്
const AllJobs = () => {
  const navigate = useNavigate();
  // Hero search bar-il ninnum varunna ?q= & ?location= params ivide vayikkunnu
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

  // Hero-il ninnum veendum search cheyyumbol URL param maarunnathine sync cheyyunnu
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

  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    const diffDays = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Posted today';
    if (diffDays === 1) return 'Posted 1 day ago';
    return `Posted ${diffDays} days ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 md:pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            All <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Jobs</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-lg mt-2">
            {loading ? 'Loading verified openings...' : `${filteredJobs.length} verified opening${filteredJobs.length === 1 ? '' : 's'} available across Kerala.`}
          </p>
        </div>

        {/* Search + Location + Category Filter */}
        <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Search job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-5 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
            />
          </div>
          <div className="relative md:w-56">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
            <input
              type="text"
              placeholder="Location"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-5 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="md:w-56 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-20 font-bold text-slate-400">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <p className="text-slate-500 font-bold text-sm">No jobs match your search.</p>
            <p className="text-slate-400 font-medium text-xs mt-1">Try a different keyword or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="group relative bg-white rounded-[2rem] p-7 border border-slate-100 shadow-[0_15px_50px_-25px_rgba(15,23,42,0.2)] hover:shadow-[0_25px_60px_-25px_rgba(16,185,129,0.3)] hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start mb-5">
                  <CompanyLogo
                    logoUrl={job.company_logo}
                    name={job.company_name}
                    iconName={job.category_icon}
                    themeIndex={job.category || job.id}
                    size="md"
                  />
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">{job.job_type}</span>
                    {job.has_applied && (
                      <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">Applied</span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{job.title}</h3>
                <p className="text-slate-500 font-semibold text-xs mb-5">{job.company_name} • {job.location}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.salary_range && (
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">{job.salary_range}</span>
                  )}
                  {job.experience_required && (
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">{job.experience_required}</span>
                  )}
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">{formatPostedDate(job.created_at)}</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs">
                    View Details
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllJobs;
