import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Candidate-ന്റെ saved/bookmarked jobs കാണിക്കുന്ന dedicated പേജ്
const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  // ബാക്കെൻഡിൽ നിന്നും saved jobs ലിസ്റ്റ് എടുക്കുന്നു
  const fetchSavedJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/saved-jobs/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSavedJobs(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.error('Failed to load saved jobs', err);
      setError('Failed to load your saved jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ഒരു job-നെ saved ലിസ്റ്റിൽ നിന്നും നീക്കം ചെയ്യുന്നു (toggle endpoint)
  const handleRemove = async (jobId) => {
    if (!window.confirm('Remove this job from your saved list?')) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:8000/api/jobs/${jobId}/save/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSavedJobs((prev) => prev.filter((item) => item.job_details?.id !== jobId && item.job !== jobId));
    } catch (err) {
      console.error('Failed to remove saved job', err);
      alert('Failed to remove the job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-premium pt-28 md:pt-32 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <Link
            to="/candidate-dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider mb-3"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-2xl font-black text-slate-900">Saved Jobs</h1>
            <span className="px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
              {savedJobs.length} {savedJobs.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">Jobs you bookmarked to review or apply later.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 font-bold text-xs rounded-xl text-center">{error}</div>
        )}

        {savedJobs.length === 0 ? (
          // Saved jobs ഇല്ലെങ്കിൽ കാണിക്കുന്ന empty state
          <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
            <p className="text-slate-500 font-bold text-sm">You haven't saved any jobs yet.</p>
            <Link
              to="/jobs"
              className="inline-block mt-4 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-all text-sm"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedJobs.map((item) => {
              const job = item.job_details || {};
              return (
                <div key={item.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-700">
                        {job.job_type || 'Full-time'}
                      </span>
                      {job.category_name && (
                        <span className="px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700">
                          {job.category_name}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-black text-slate-900 leading-tight">{job.title}</h3>
                    <p className="text-sm font-bold text-slate-500 mt-1">{job.company_name}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs font-bold text-slate-500">
                      {job.location && (
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          {job.location}
                        </span>
                      )}
                      {job.salary_range && (
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 9v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {job.salary_range}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="flex-1 text-center px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-all text-sm"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemove(job.id)}
                      className="px-6 py-3 bg-white border border-slate-200 text-red-500 font-bold rounded-xl shadow-sm hover:bg-red-50 transition-all text-sm"
                    >
                      Remove
                    </button>
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

export default SavedJobs;
