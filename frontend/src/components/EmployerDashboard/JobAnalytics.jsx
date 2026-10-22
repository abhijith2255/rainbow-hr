import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

const JobAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortKey, setSortKey] = useState('views');

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
  };

  // Employer-ന്റെ analytics (totals + funnel + jobs) ഫെച്ച് ചെയ്യുന്നു
  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/api/jobs/employer/analytics/`, { headers: authHeaders() });
      setAnalytics(res.data);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err.response?.data?.error || 'Could not load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 font-premium pt-28 md:pt-32 pb-16 px-4 sm:px-6 flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const totals = analytics?.totals || {};
  const funnel = analytics?.funnel || [];
  const jobs = analytics?.jobs || [];

  // Funnel bar-കളുടെ width കണക്കാക്കാൻ ഏറ്റവും വലിയ count
  const maxCount = funnel.reduce((max, item) => Math.max(max, item.count || 0), 0);
  const firstCount = funnel[0]?.count || 0;

  // sort key അനുസരിച്ച് jobs ക്രമീകരിക്കുന്നു (default: views descending)
  const sortedJobs = [...jobs].sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));

  // Stat cards data
  const statCards = [
    { key: 'total_jobs', label: 'Total Jobs', value: totals.total_jobs, icon: 'briefcase', accent: 'bg-blue-50 text-blue-600' },
    { key: 'active_jobs', label: 'Active Jobs', value: totals.active_jobs, icon: 'check', accent: 'bg-emerald-50 text-emerald-600' },
    { key: 'total_views', label: 'Total Views', value: totals.total_views, icon: 'eye', accent: 'bg-indigo-50 text-indigo-600' },
    { key: 'total_applications', label: 'Applications', value: totals.total_applications, icon: 'users', accent: 'bg-amber-50 text-amber-600' },
    { key: 'total_shortlisted', label: 'Shortlisted', value: totals.total_shortlisted, icon: 'star', accent: 'bg-blue-50 text-blue-600' },
    { key: 'total_hired', label: 'Hired', value: totals.total_hired, icon: 'trophy', accent: 'bg-emerald-50 text-emerald-600' },
  ];

  // ഓരോ card-ന്റെയും inline SVG icon path
  const renderIcon = (icon) => {
    const paths = {
      briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      check: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      star: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.077 10.1c-.783-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z',
      trophy: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    };
    return paths[icon] || paths.briefcase;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-premium pt-28 md:pt-32 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <Link
            to="/employer-dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider mb-3"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Analytics</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Track job views and your hiring funnel.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-5 py-4">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((card) => (
            <div key={card.key} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${card.accent}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={renderIcon(card.icon)}></path></svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900">{card.value ?? 0}</h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Hiring Funnel */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-1">Hiring Funnel</h3>
          <p className="text-xs font-medium text-slate-500 mb-6">How candidates progress from views to hires.</p>

          {funnel.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-bold text-sm">No funnel data yet.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {funnel.map((item) => {
                const width = maxCount > 0 ? ((item.count || 0) / maxCount) * 100 : 0;
                const conversion = firstCount > 0 ? ((item.count || 0) / firstCount) * 100 : 0;
                return (
                  <div key={item.stage}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">{item.stage}</span>
                      <span className="text-xs font-bold text-slate-500">
                        {item.count} <span className="text-slate-400">({conversion.toFixed(0)}%)</span>
                      </span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Performance by Job */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">Performance by Job</h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Views, applications and outcomes for each posting.</p>
            </div>
            {jobs.length > 0 && (
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="views">Sort by Views</option>
                <option value="applications">Sort by Applications</option>
                <option value="shortlisted">Sort by Shortlisted</option>
                <option value="hired">Sort by Hired</option>
              </select>
            )}
          </div>

          {jobs.length === 0 ? (
            <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-bold text-sm">You haven't posted any jobs yet.</p>
              <Link to="/employer-dashboard" className="inline-block mt-3 text-xs font-black text-blue-600 hover:text-blue-700">
                ← Back to Dashboard
              </Link>
            </div>
          ) : (
            <>
              {/* Table (md and above) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 pr-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Job</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Status</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Views</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Apps</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Fwd</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Pending</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Rejected</th>
                      <th className="py-3 px-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Shortlisted</th>
                      <th className="py-3 pl-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-center">Hired</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedJobs.map((job) => (
                      <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                        <td className="py-4 pr-4">
                          <p className="text-sm font-black text-slate-900">{job.title}</p>
                          <p className="text-[11px] font-semibold text-slate-400">{job.company_name}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md ${
                              job.approval_status === 'Approved' ? 'bg-emerald-50 text-emerald-700'
                                : job.approval_status === 'Rejected' ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}>
                              {job.approval_status}
                            </span>
                            <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md ${
                              job.is_active ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {job.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-sm font-bold text-slate-700">{job.views}</td>
                        <td className="py-4 px-4 text-center text-sm font-bold text-slate-700">{job.applications}</td>
                        <td className="py-4 px-4 text-center text-sm font-bold text-slate-700">{job.forwarded}</td>
                        <td className="py-4 px-4 text-center text-sm font-bold text-slate-700">{job.pending_review}</td>
                        <td className="py-4 px-4 text-center text-sm font-bold text-slate-700">{job.rejected}</td>
                        <td className="py-4 px-4 text-center text-sm font-bold text-slate-700">{job.shortlisted}</td>
                        <td className="py-4 pl-4 text-center text-sm font-black text-emerald-600">{job.hired}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Stacked cards (below md) */}
              <div className="space-y-4 md:hidden">
                {sortedJobs.map((job) => (
                  <div key={job.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                    <div className="mb-3">
                      <p className="text-sm font-black text-slate-900">{job.title}</p>
                      <p className="text-[11px] font-semibold text-slate-400">{job.company_name}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md ${
                        job.approval_status === 'Approved' ? 'bg-emerald-50 text-emerald-700'
                          : job.approval_status === 'Rejected' ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {job.approval_status}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-md ${
                        job.is_active ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {job.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div><p className="text-lg font-black text-slate-900">{job.views}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Views</p></div>
                      <div><p className="text-lg font-black text-slate-900">{job.applications}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Apps</p></div>
                      <div><p className="text-lg font-black text-slate-900">{job.forwarded}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Fwd</p></div>
                      <div><p className="text-lg font-black text-slate-900">{job.pending_review}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Pending</p></div>
                      <div><p className="text-lg font-black text-slate-900">{job.rejected}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Rejected</p></div>
                      <div><p className="text-lg font-black text-slate-900">{job.shortlisted}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Shortlisted</p></div>
                      <div><p className="text-lg font-black text-emerald-600">{job.hired}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Hired</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobAnalytics;
