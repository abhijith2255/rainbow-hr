import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MapPin, Banknote, Clock, ArrowRight, BadgeCheck, Briefcase, CalendarDays,
} from 'lucide-react';
import { CompanyLogo } from './categoryVisuals';
import Reveal from './Reveal';

// ഹോം പേജിൽ കാണിക്കുന്ന പരമാവധി ജോബുകൾ — curated ആയി കാണിക്കാൻ പരിമിതപ്പെടുത്തുന്നു
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
    <section className="py-20 sm:py-24 relative bg-gradient-to-b from-white via-emerald-50/40 to-white overflow-hidden z-10">
      {/* Subtle background glows for premium vibe */}
      <div className="absolute top-[20%] left-[-5%] w-[30rem] h-[30rem] bg-emerald-300/15 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[30rem] h-[30rem] bg-teal-300/15 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="container mx-auto px-5 sm:px-6 max-w-7xl relative z-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-black text-[11px] tracking-[0.2em] uppercase mb-4">
            Handpicked Roles
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Featured{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Jobs</span>
          </h2>
          <p className="text-slate-500 font-medium mt-4 text-base sm:text-lg">
            A short, curated list of the most sought-after verified roles available right now.
          </p>
        </Reveal>

        {/* Jobs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: MAX_FEATURED_JOBS }).map((_, index) => (
              <div key={index} className="bg-white rounded-[2rem] p-7 border border-slate-100 animate-pulse h-[248px]"></div>
            ))}
          </div>
        ) : featuredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <p className="text-slate-500 font-bold text-sm">No approved jobs available right now.</p>
            <p className="text-slate-400 font-medium text-xs mt-1">New verified job postings will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job, index) => (
              <Reveal key={job.id} delay={index * 90} className="h-full">
                <div
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="group relative h-full bg-white rounded-[2rem] p-6 sm:p-7 border border-slate-100 shadow-[0_18px_50px_-30px_rgba(15,23,42,0.35)] hover:shadow-[0_30px_65px_-30px_rgba(16,185,129,0.45)] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden cursor-pointer flex flex-col"
                >
                  {/* Hover-il maathram kaanikkunna gradient wash + top hairline */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Header: logo + type chip */}
                  <div className="relative z-10 flex justify-between items-start gap-4 mb-5">
                    <CompanyLogo
                      logoUrl={job.company_logo}
                      name={job.company_name}
                      iconName={job.category_icon}
                      themeIndex={job.category || job.id}
                      size="lg"
                    />
                    <div className="flex flex-col items-end gap-2">
                      {job.job_type && (
                        <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                          {job.job_type}
                        </span>
                      )}
                      {job.has_applied && (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">
                          <BadgeCheck className="w-3 h-3" strokeWidth={3} /> Applied
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title + company */}
                  <div className="relative z-10">
                    <div className="flex items-start gap-2">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors leading-snug">
                        {job.title}
                      </h3>
                      {job.approval_status === 'Approved' && (
                        <BadgeCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-1" strokeWidth={2.5} />
                      )}
                    </div>
                    <p className="text-slate-500 font-semibold text-sm mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                        {job.company_name}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                        {job.location}
                      </span>
                    </p>
                  </div>

                  {/* Meta chips — clean, uncluttered */}
                  <div className="relative z-10 flex flex-wrap gap-2 mt-5">
                    {job.salary_range && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                        <Banknote className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                        {job.salary_range}
                      </span>
                    )}
                    {job.experience_required && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" strokeWidth={2.5} />
                        {job.experience_required}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 mt-auto pt-5 border-t border-slate-100 group-hover:border-emerald-100 transition-colors flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                      <CalendarDays className="w-3.5 h-3.5" strokeWidth={2.5} />
                      {formatPostedDate(job.created_at)}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-900 group-hover:text-emerald-600 font-extrabold text-sm transition-colors">
                      View Role
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="text-center mt-14 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => navigate('/jobs')}
            className="group inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5"
          >
            View All Jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
          <button
            onClick={() => navigate('/categories')}
            className="bg-white border border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 font-extrabold px-8 py-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md"
          >
            Browse Jobs by Sector
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default FeaturedJobs;
