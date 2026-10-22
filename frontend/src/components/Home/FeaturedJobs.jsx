import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CompanyLogo } from './categoryVisuals';

// ഹോം പേജിൽ കാണിക്കുന്ന പരമാവധി ജോബുകൾ
const MAX_FEATURED_JOBS = 4;

const FeaturedJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedJobs();
  }, []);

  // Home Page-ൽ Employer + Staff പോസ്റ്റ് ചെയ്ത Approved ജോബുകൾ കാണിക്കുന്നു
  const fetchApprovedJobs = async () => {
    setLoading(true);
    try {
      // ലോഗിൻ ചെയ്ത കാൻഡിഡേറ്റിന് "ഇതിനകം അപ്ലൈ ചെയ്തോ" എന്ന് അറിയാൻ ടോക്കൺ അയയ്ക്കുന്നു
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/?public=true', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // ഹോം പേജിൽ പരിമിതമായ എണ്ണം ജോബുകൾ മാത്രം
  const featuredJobs = jobs.slice(0, MAX_FEATURED_JOBS);

  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    const diffDays = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Posted today';
    if (diffDays === 1) return 'Posted 1 day ago';
    return `Posted ${diffDays} days ago`;
  };

  return (
    <section className="py-24 relative bg-gradient-to-b from-white via-emerald-50/40 to-white overflow-hidden z-10">
      {/* Subtle Background Glows for Premium Vibe */}
      <div className="absolute top-[20%] left-[-5%] w-[30rem] h-[30rem] bg-emerald-300/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-teal-300/15 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-black text-[11px] tracking-[0.2em] uppercase mb-4">Top Opportunities</span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Featured <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Jobs</span></h2>
          <p className="text-slate-500 font-medium mt-4 max-w-2xl mx-auto text-lg">Apply to the most highly sought-after roles available right now across Kerala.</p>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="text-center py-16 font-bold text-slate-400">Loading jobs...</div>
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <p className="text-slate-500 font-bold text-sm">No approved jobs available right now.</p>
            <p className="text-slate-400 font-medium text-xs mt-1">New verified job postings will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_15px_50px_-20px_rgba(15,23,42,0.18)] hover:shadow-[0_25px_70px_-20px_rgba(16,185,129,0.28)] transition-all duration-500 hover:-translate-y-2 overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <CompanyLogo
                    logoUrl={job.company_logo}
                    name={job.company_name}
                    iconName={job.category_icon}
                    themeIndex={job.category || job.id}
                    size="lg"
                  />
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-wider">
                      {job.job_type}
                    </span>
                    {job.approval_status === 'Approved' && (
                      <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-wider">
                        Verified
                      </span>
                    )}
                    {job.has_applied && (
                      <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-black uppercase tracking-wider">
                        Applied
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{job.title}</h3>
                  <p className="text-slate-500 font-semibold text-sm mb-6 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    {job.company_name} • {job.location}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-8">
                    {job.salary_range && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {job.salary_range}
                      </div>
                    )}
                    {job.experience_required && (
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> {job.experience_required}
                      </div>
                    )}
                  </div>

                  <div className="h-px w-full bg-slate-100 mb-6 group-hover:bg-emerald-100 transition-colors"></div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-400">{formatPostedDate(job.created_at)}</span>
                    <span className="flex items-center gap-2 text-slate-900 group-hover:text-emerald-600 font-extrabold transition-colors">
                      View Details
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/jobs')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5"
          >
            View All Jobs
          </button>
          <button
            onClick={() => navigate('/categories')}
            className="bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 font-extrabold px-8 py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Browse All Jobs by Category
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;
