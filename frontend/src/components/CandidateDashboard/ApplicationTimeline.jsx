import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// ഓരോ അപേക്ഷയുടെയും ATS status timeline കാണിക്കുന്ന പേജ്
const STAGE_OPTIONS = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected'];

const ApplicationTimeline = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stageFilter, setStageFilter] = useState('All');

  useEffect(() => {
    fetchApplications();
  }, []);

  // എല്ലാ അപേക്ഷകളും ബാക്കെൻഡിൽ നിന്നും എടുക്കുന്നു
  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/my-applications/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setApplications(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.error('Failed to load applications', err);
      setError('Failed to load your applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ഓരോ timeline state-നും അനുസരിച്ചുള്ള നിറവും ഐക്കണും നൽകുന്നു
  const getStateStyles = (state) => {
    switch (state) {
      case 'completed':
        return {
          dot: 'bg-emerald-500 border-emerald-500',
          text: 'text-emerald-600',
          icon: true,
        };
      case 'current':
        return {
          dot: 'bg-white border-emerald-500 ring-4 ring-emerald-100 animate-pulse',
          text: 'text-emerald-700 font-black',
          icon: false,
        };
      case 'rejected':
        return {
          dot: 'bg-red-500 border-red-500',
          text: 'text-red-600',
          icon: false,
        };
      default: // pending
        return {
          dot: 'bg-white border-slate-300',
          text: 'text-slate-400',
          icon: false,
        };
    }
  };

  // അപേക്ഷയുടെ ഇപ്പോഴത്തെ ATS സ്റ്റേജ് അനുസരിച്ച് badge നിറം
  const getStageBadgeClass = (stage) => {
    switch (stage) {
      case 'Hired':
        return 'bg-emerald-100 text-emerald-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Interview':
      case 'Shortlisted':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Summary counters
  const totalCount = applications.length;
  const pendingStaffCount = applications.filter((a) => a.status === 'Pending').length;
  const inProgressCount = applications.filter(
    (a) => a.status === 'Approved' && a.pipeline_stage !== 'Hired' && a.pipeline_stage !== 'Rejected'
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === 'Rejected' || a.pipeline_stage === 'Rejected'
  ).length;

  // Pipeline stage filter (client-side)
  const filteredApplications = stageFilter === 'All'
    ? applications
    : applications.filter((a) => (a.pipeline_stage || 'Applied') === stageFilter);

  const summaryCards = [
    { label: 'Total Applications', value: totalCount, color: 'text-slate-900' },
    { label: 'Pending Review', value: pendingStaffCount, color: 'text-amber-600' },
    { label: 'In Progress', value: inProgressCount, color: 'text-blue-600' },
    { label: 'Rejected', value: rejectedCount, color: 'text-red-600' },
  ];

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
          <h1 className="text-2xl font-black text-slate-900">Application Timeline</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Track where each of your applications stands in the hiring process.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 font-bold text-xs rounded-xl text-center">{error}</div>
        )}

        {/* Summary Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <div key={card.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm text-center">
              <h3 className={`text-3xl font-black ${card.color}`}>{card.value}</h3>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Stage Filter */}
        {applications.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Filter by Stage</label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500"
            >
              {STAGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {applications.length === 0 ? (
          // അപേക്ഷകൾ ഇല്ലെങ്കിൽ കാണിക്കുന്ന empty state
          <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-500 font-bold text-sm">You haven't applied for any jobs yet.</p>
            <Link
              to="/jobs"
              className="inline-block mt-4 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-all text-sm"
            >
              Browse Jobs
            </Link>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-500 font-bold text-sm">No applications match the selected stage.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredApplications.map((app) => {
              const timeline = Array.isArray(app.timeline) ? app.timeline : [];
              return (
                <div key={app.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                  {/* Card Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">{app.job_title}</h3>
                      <p className="text-sm font-bold text-slate-500 mt-0.5">{app.company_name} • {app.location}</p>
                      <p className="text-xs font-bold text-slate-400 mt-1">
                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider ${getStageBadgeClass(app.pipeline_stage)}`}>
                      {app.pipeline_stage || 'Applied'}
                    </span>
                  </div>

                  {/* Vertical Timeline */}
                  {timeline.length === 0 ? (
                    <p className="text-sm font-medium text-slate-400">No timeline available for this application.</p>
                  ) : (
                    <div className="space-y-0">
                      {timeline.map((step, idx) => {
                        const styles = getStateStyles(step.state);
                        const isLast = idx === timeline.length - 1;
                        return (
                          <div key={`${step.stage}-${idx}`} className="flex gap-4">
                            {/* Dot + connector */}
                            <div className="flex flex-col items-center">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${styles.dot}`}>
                                {styles.icon && (
                                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                                  </svg>
                                )}
                              </div>
                              {!isLast && <div className="w-0.5 flex-1 bg-slate-200 min-h-[28px]"></div>}
                            </div>

                            {/* Stage text */}
                            <div className={isLast ? 'pb-0' : 'pb-5'}>
                              <p className={`text-sm ${styles.text}`}>{step.stage}</p>
                              {step.date && (
                                <p className="text-xs font-bold text-slate-400 mt-0.5">
                                  {new Date(step.date).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTimeline;
