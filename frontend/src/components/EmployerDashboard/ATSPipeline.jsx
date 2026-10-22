import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

// Kanban-ലെ stage-കളുടെ ക്രമം (arrow controls-ന് ഇതാണ് base)
const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Hired', 'Rejected'];

// ഓരോ stage-ന്റെയും count badge accent colour
const STAGE_ACCENTS = {
  'Applied': 'bg-slate-200 text-slate-700',
  'Under Review': 'bg-amber-100 text-amber-700',
  'Shortlisted': 'bg-blue-100 text-blue-700',
  'Interview': 'bg-indigo-100 text-indigo-700',
  'Hired': 'bg-emerald-100 text-emerald-700',
  'Rejected': 'bg-red-100 text-red-700',
};

const ATSPipeline = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [board, setBoard] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingBoard, setLoadingBoard] = useState(false);
  const [movingId, setMovingId] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
  };

  // Resume relative URL ആണെങ്കിൽ backend host prefix ചേർക്കുന്നു
  const getResumeUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${API_BASE}${path}`;
  };

  const showToast = (msg) => setToast(msg);

  // Toast കുറച്ചു സമയത്തിനു ശേഷം സ്വയം മാഞ്ഞു പോകുന്നു
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Employer-ന്റെ pipeline jobs ഫെച്ച് ചെയ്യുന്നു
  const fetchJobs = async () => {
    setLoadingJobs(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/api/jobs/employer/pipeline/jobs/`, { headers: authHeaders() });
      const list = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setJobs(list);
      // ആദ്യത്തെ ജോബ് ഓട്ടോമാറ്റിക്കായി സെലക്ട് ചെയ്യുന്നു
      if (list.length > 0) setSelectedJobId((prev) => (prev ?? list[0].id));
    } catch (err) {
      console.error('Pipeline jobs fetch error:', err);
      setError('Could not load your jobs. Please try again.');
    } finally {
      setLoadingJobs(false);
    }
  };

  // തിരഞ്ഞെടുത്ത ജോബിന്റെ Kanban board ഫെച്ച് ചെയ്യുന്നു
  const fetchBoard = async (jobId) => {
    if (!jobId) return;
    setLoadingBoard(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/api/jobs/${jobId}/pipeline/`, { headers: authHeaders() });
      setBoard(res.data);
    } catch (err) {
      console.error('Pipeline board fetch error:', err);
      setError(err.response?.data?.error || 'Could not load this job pipeline.');
      setBoard(null);
    } finally {
      setLoadingBoard(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Job മാറുമ്പോൾ board വീണ്ടും ഫെച്ച് ചെയ്യുന്നു
  useEffect(() => {
    if (selectedJobId) fetchBoard(selectedJobId);
  }, [selectedJobId]);

  // ഒരു applicant-ന്റെ stage മാറ്റുന്നു (select + arrow രണ്ടും ഇത് വിളിക്കുന്നു)
  const moveStage = async (app, newStage) => {
    if (!newStage || newStage === app.pipeline_stage) return;
    setMovingId(app.id);
    try {
      await axios.post(
        `${API_BASE}/api/jobs/employer/applications/${app.id}/stage/`,
        { stage: newStage },
        { headers: authHeaders() }
      );
      showToast(`${app.full_name} → ${newStage}`);
      await fetchBoard(selectedJobId);
    } catch (err) {
      console.error('Stage update error:', err);
      setError(err.response?.data?.error || 'Failed to update the applicant stage.');
    } finally {
      setMovingId(null);
    }
  };

  // ← / → ബട്ടണുകൾക്ക് വേണ്ടി അടുത്ത/മുൻപത്തെ stage കണ്ടെത്തുന്നു
  const moveByOffset = (app, offset) => {
    const idx = STAGES.indexOf(app.pipeline_stage);
    if (idx === -1) return;
    const next = STAGES[idx + offset];
    if (!next) return;
    moveStage(app, next);
  };

  const columns = board?.columns || [];
  const totalApplicants = board?.total ?? columns.reduce((sum, col) => sum + (col.count || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-premium pt-28 md:pt-32 pb-16 px-6">
      <div className="max-w-[95rem] mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <Link
            to="/employer-dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider mb-3"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ATS Pipeline</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Move candidates through your hiring stages. Only applicants approved and forwarded by RainbowHR Staff appear here.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 rounded-2xl px-5 py-4">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {/* Loading (initial jobs fetch) */}
        {loadingJobs ? (
          <div className="py-24 flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : jobs.length === 0 ? (
          /* No jobs at all */
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="py-14 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-bold text-sm">You haven't posted any jobs yet.</p>
              <Link to="/employer-dashboard" className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all text-sm">
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Job Selector Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {jobs.map((job) => {
                const isSelected = job.id === selectedJobId;
                return (
                  <button
                    key={job.id}
                    onClick={() => setSelectedJobId(job.id)}
                    className={`text-left shrink-0 min-w-[240px] max-w-[280px] px-5 py-4 rounded-2xl transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-blue-50 hover:border-blue-200'
                    }`}
                  >
                    <p className={`text-sm font-black truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {job.title}
                    </p>
                    <p className={`text-[11px] font-semibold mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {job.company_name}{job.location ? ` • ${job.location}` : ''}
                    </p>
                    <span className={`inline-block mt-2 px-2.5 py-0.5 text-[10px] font-black rounded-md ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {job.applicants} applicant{job.applicants === 1 ? '' : 's'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Kanban Board */}
            {loadingBoard ? (
              <div className="py-24 flex justify-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : board && totalApplicants === 0 ? (
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="py-14 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-500 font-bold text-sm">No approved applicants for this job yet.</p>
                  <p className="text-slate-400 text-xs mt-1">Once Staff verifies and forwards applications, they'll show up as cards here.</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {columns.map((col) => (
                  <div key={col.stage} className="min-w-[290px] w-[290px] shrink-0 bg-slate-100/70 rounded-2xl p-4">
                    {/* Column Header */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
                      <h3 className="text-sm font-black text-slate-800">{col.label}</h3>
                      <span className={`px-2.5 py-0.5 text-[11px] font-black rounded-full ${STAGE_ACCENTS[col.stage] || 'bg-slate-200 text-slate-700'}`}>
                        {col.count}
                      </span>
                    </div>

                    {/* Applicant Cards */}
                    <div className="space-y-3">
                      {(col.applications || []).map((app) => {
                        const stageIdx = STAGES.indexOf(app.pipeline_stage);
                        const isMoving = movingId === app.id;
                        return (
                          <div
                            key={app.id}
                            className={`bg-white rounded-2xl p-4 border border-slate-200 shadow-sm transition-opacity ${
                              isMoving ? 'opacity-50 pointer-events-none' : ''
                            }`}
                          >
                            <h4 className="text-sm font-black text-slate-900 truncate">{app.full_name}</h4>
                            {app.applicant_username && (
                              <p className="text-[11px] font-bold text-blue-600 mt-0.5">@{app.applicant_username}</p>
                            )}

                            <div className="mt-2 space-y-1 text-[11px] font-semibold text-slate-500">
                              <p className="truncate">📧 {app.email}</p>
                              <p>📞 {app.phone}</p>
                              <p className="text-slate-400">
                                Applied: {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : '—'}
                              </p>
                            </div>

                            {app.cover_letter && (
                              <p className="mt-2 text-[11px] font-medium text-slate-600 leading-relaxed line-clamp-2">
                                {app.cover_letter.length > 110 ? `${app.cover_letter.slice(0, 110)}…` : app.cover_letter}
                              </p>
                            )}

                            {app.resume && (
                              <a
                                href={getResumeUrl(app.resume)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 mt-2 text-[11px] font-black text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                Resume
                              </a>
                            )}

                            {/* Movement Controls */}
                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                              <select
                                value={app.pipeline_stage}
                                onChange={(e) => moveStage(app, e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {STAGES.map((stage) => (
                                  <option key={stage} value={stage}>{stage}</option>
                                ))}
                              </select>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => moveByOffset(app, -1)}
                                  disabled={stageIdx <= 0}
                                  className="flex-1 py-2 bg-slate-100 text-slate-600 font-black text-xs rounded-xl hover:bg-slate-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="Move to previous stage"
                                >
                                  ←
                                </button>
                                <button
                                  onClick={() => moveByOffset(app, 1)}
                                  disabled={stageIdx === -1 || stageIdx === STAGES.length - 1}
                                  className="flex-1 py-2 bg-blue-50 text-blue-700 font-black text-xs rounded-xl hover:bg-blue-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                  title="Move to next stage"
                                >
                                  →
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {(col.applications || []).length === 0 && (
                        <p className="text-center text-[11px] font-bold text-slate-400 py-6">No candidates</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Success Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
          {toast}
        </div>
      )}
    </div>
  );
};

export default ATSPipeline;
