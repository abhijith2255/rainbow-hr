import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../../pages/login';
import ApplyJobModal from './ApplyJobModal';
import { CompanyLogo } from './categoryVisuals';

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  // ബുക്ക്മാർക്ക് (save) സ്റ്റേറ്റുകൾ
  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    fetchJobAndSuggestions();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [jobId]);

  // ജോബ് ലോഡ് ആയിക്കഴിഞ്ഞാൽ save സ്റ്റേറ്റ് API-യിൽ നിന്ന് സെറ്റ് ചെയ്യുന്നു
  useEffect(() => {
    if (job) setIsSaved(!!job.is_saved);
  }, [job]);

  // പേജ് കാണുമ്പോൾ view ട്രാക്ക് ചെയ്യുന്നു (പബ്ലിക് എൻഡ്‌പോയിന്റ്, auth header ആവശ്യമില്ല)
  useEffect(() => {
    if (!jobId) return;
    const trackView = async () => {
      try {
        await axios.post(`http://127.0.0.1:8000/api/jobs/${jobId}/view/`);
      } catch (error) {
        // view ട്രാക്കിംഗ് പരാജയപ്പെട്ടാലും യൂസറെ ബാധിക്കരുത്
        console.error("Error tracking job view:", error);
      }
    };
    trackView();
  }, [jobId]);

  const fetchJobAndSuggestions = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      // 1. ജോബ് ഡീറ്റെയിൽസ് (പബ്ലിക് എൻഡ്‌പോയിന്റ്)
      const jobRes = await axios.get(`http://127.0.0.1:8000/api/jobs/${jobId}/`, { headers });
      const currentJob = jobRes.data;
      setJob(currentJob);

      // 2. സമാനമായ (suggested) ജോബുകൾ - ഒരേ കാറ്റഗറി / ജോബ് ടൈപ്പ് അനുസരിച്ച്
      const allRes = await axios.get('http://127.0.0.1:8000/api/jobs/?public=true', { headers });
      const allJobs = Array.isArray(allRes.data) ? allRes.data : [];
      const others = allJobs.filter((j) => j.id !== currentJob.id);

      const sameCategory = others.filter(
        (j) => currentJob.category && j.category === currentJob.category
      );
      const sameType = others.filter(
        (j) => j.job_type === currentJob.job_type
      );

      // ഒരേ ജോബ് ആവർത്തിക്കാതിരിക്കാൻ unique ആക്കുന്നു
      const pool = [...sameCategory, ...sameType];
      others.forEach((j) => {
        if (!pool.includes(j)) pool.push(j);
      });

      setSuggestions(pool.slice(0, 3));
    } catch (error) {
      console.error("Error fetching job details:", error);
      if (error.response?.status === 404) setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  // Apply ബട്ടൺ ക്ലിക്ക് - ലോഗിൻ ഇല്ലെങ്കിൽ ആദ്യം ലോഗിൻ
  const handleApplyClick = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoginOpen(true);
    } else {
      setIsApplyOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsApplyOpen(true);
  };

  // Save/Bookmark ബട്ടൺ ക്ലിക്ക് - ലോഗിൻ ഇല്ലെങ്കിൽ ആദ്യം ലോഗിൻ
  const handleSaveClick = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoginOpen(true);
      return;
    }
    setSaveLoading(true);
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/jobs/${jobId}/save/`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setIsSaved(!!res.data.saved);
    } catch (error) {
      console.error("Error saving job:", error);
    } finally {
      setSaveLoading(false);
    }
  };

  const formatPostedDate = (dateString) => {
    if (!dateString) return 'Recently posted';
    const diffDays = Math.floor((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return 'Posted today';
    if (diffDays === 1) return 'Posted 1 day ago';
    return `Posted ${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black text-slate-900 mb-3">Job not found</h1>
        <p className="text-slate-500 font-medium mb-8">This job may have been removed or is no longer available.</p>
        <Link to="/jobs" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl transition-all">
          Browse All Jobs
        </Link>
      </div>
    );
  }

  // Perks & Benefits ലിസ്റ്റ്
  const perks = [
    job.accommodation && 'Accommodation Provided',
    job.food_provided && 'Food Provided',
    job.health_insurance && 'Health Insurance',
    job.provident_fund && 'Provident Fund',
    job.travel_allowance && 'Travel Allowance',
    job.dearness_allowance && 'Dearness Allowance',
    job.has_incentives && (job.incentive_details ? `Incentives: ${job.incentive_details}` : 'Performance Incentives'),
    job.leave_policy && `Leave Policy: ${job.leave_policy}`,
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 md:pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-6 uppercase">
          <Link to="/" className="hover:text-slate-700">Home</Link>
          <span>/</span>
          <Link to="/jobs" className="hover:text-slate-700">Jobs</Link>
          <span>/</span>
          <span className="text-emerald-600 normal-case">{job.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ---------- Main Content ---------- */}
          <div className="lg:col-span-2 space-y-6">

            {/* Job Header Card */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-wrap items-start gap-5">
                <CompanyLogo
                  logoUrl={job.company_logo}
                  name={job.company_name}
                  iconName={job.category_icon}
                  themeIndex={job.category || job.id}
                  size="xl"
                />
                <div className="flex-1 min-w-[200px]">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">{job.job_type}</span>
                    {job.approval_status === 'Approved' && (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-wider">Verified</span>
                    )}
                    {job.has_applied && (
                      <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider">Applied</span>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{job.title}</h1>
                  <p className="text-slate-500 font-semibold text-sm mt-2">{job.company_name} • {job.location}</p>
                </div>
              </div>
            </div>

            {/* Job Overview Grid */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-5">Job Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Category</p>
                  <p className="text-sm font-bold text-slate-800">{job.category_name || 'General'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Salary</p>
                  <p className="text-sm font-bold text-slate-800">{job.salary_range || job.salary_type || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Experience</p>
                  <p className="text-sm font-bold text-slate-800">{job.fresher_allowed ? 'Freshers Welcome' : (job.experience_required || 'Experienced')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Qualification</p>
                  <p className="text-sm font-bold text-slate-800">{job.qualification || 'Any'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Gender Preference</p>
                  <p className="text-sm font-bold text-slate-800">{job.gender_preference === 'Any' ? 'Any / Both' : job.gender_preference}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Age Limit</p>
                  <p className="text-sm font-bold text-slate-800">{job.age_limit || 'No limit'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4">Job Description</h2>
              <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description || 'No description provided.'}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4">Requirements & Eligibility</h2>
              <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                {job.requirements || 'No specific requirements listed.'}
              </p>
            </div>

            {/* Perks & Benefits */}
            {perks.length > 0 && (
              <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black text-slate-900 mb-5">Perks & Benefits</h2>
                <div className="flex flex-wrap gap-3">
                  {perks.map((perk, idx) => (
                    <span key={idx} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold">
                      {perk}
                    </span>
                  ))}
                </div>
                {job.additional_benefits && (
                  <p className="text-sm font-medium text-slate-600 mt-5 leading-relaxed whitespace-pre-line">{job.additional_benefits}</p>
                )}
              </div>
            )}
          </div>

          {/* ---------- Sidebar ---------- */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-5">
              <div className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Offered Salary</p>
                <p className="text-2xl font-black text-slate-900 mb-5">{job.salary_range || job.salary_type || 'Negotiable'}</p>

                {job.has_applied ? (
                  <div className="w-full py-4 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-sm border border-emerald-100 text-center flex items-center justify-center gap-2 cursor-not-allowed">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    You have already applied
                  </div>
                ) : (
                  <button
                    onClick={handleApplyClick}
                    className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-600/25 transition-all hover:-translate-y-0.5"
                  >
                    Apply Now
                  </button>
                )}

                <button
                  onClick={handleSaveClick}
                  disabled={saveLoading}
                  title={isSaved ? 'Remove from saved' : 'Save job'}
                  className={`mt-3 w-full py-3 rounded-xl font-black text-xs border transition-all flex items-center justify-center gap-2 ${
                    isSaved
                      ? 'text-emerald-600 border-emerald-300 bg-emerald-50'
                      : 'text-slate-600 border-slate-200 bg-white hover:border-emerald-300 hover:text-emerald-600'
                  } ${saveLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {saveLoading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  ) : (
                    <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                  )}
                  {isSaved ? 'Saved' : 'Save Job'}
                </button>

                <p className="text-[11px] font-bold text-slate-400 text-center mt-4">{formatPostedDate(job.created_at)}</p>
                <p className="text-[10px] font-bold text-slate-400 text-center mt-1.5">
                  {job.views_count || 0} views • {job.applications_count || 0} applications
                </p>
              </div>

              <div className="bg-white rounded-[2rem] p-7 border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Location</p>
                    <p className="text-sm font-bold text-slate-800">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Job Type</p>
                    <p className="text-sm font-bold text-slate-800">{job.job_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Company</p>
                    <p className="text-sm font-bold text-slate-800">{job.company_name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Suggested Jobs ---------- */}
        {suggestions.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  Suggested <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Jobs</span>
                </h2>
                <p className="text-slate-500 font-medium text-sm mt-2">Related roles you might also be interested in.</p>
              </div>
              <Link to="/jobs" className="hidden md:inline-flex items-center gap-1.5 text-emerald-600 font-extrabold text-sm hover:text-emerald-700">
                View All Jobs
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/jobs/${s.id}`)}
                  className="group bg-white rounded-[2rem] p-7 border border-slate-100 shadow-[0_15px_50px_-25px_rgba(15,23,42,0.2)] hover:shadow-[0_25px_60px_-25px_rgba(16,185,129,0.3)] hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <CompanyLogo
                      logoUrl={s.company_logo}
                      name={s.company_name}
                      iconName={s.category_icon}
                      themeIndex={s.category || s.id}
                      size="sm"
                    />
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider">{s.job_type}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{s.title}</h3>
                  <p className="text-slate-500 font-semibold text-xs mb-4">{s.company_name} • {s.location}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{s.salary_range || s.salary_type || 'Negotiable'}</span>
                    <span className="flex items-center gap-1.5 text-emerald-600 font-extrabold text-xs">
                      View
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Login Modal (Apply ചെയ്യാൻ ലോഗിൻ ആവശ്യമെങ്കിൽ) */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Apply Modal */}
      <ApplyJobModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        job={job}
        onApplied={fetchJobAndSuggestions}
      />
    </div>
  );
};

export default JobDetails;
