import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostJobModal from './PostJobModal';
import { CompanyLogo } from '../Home/categoryVisuals';

const EmployerJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return navigate('/');
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/?my_jobs=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setJobs(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.error("Failed to load your jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ഓരോ ജോബിന്റെയും നില (status) കാണിക്കാൻ
  const getStatusBadge = (job) => {
    if (job.approval_status === 'Pending') return { label: 'Pending Approval', className: 'bg-amber-50 text-amber-700 border-amber-100' };
    if (job.approval_status === 'Rejected') return { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-100' };
    if (!job.is_active) return { label: 'Inactive', className: 'bg-slate-100 text-slate-600 border-slate-200' };
    return { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
  };

  // ജോബ് Inactive / Activate ആക്കാൻ
  const handleToggleActive = async (job) => {
    const actionLabel = job.is_active ? 'mark this job as Inactive' : 'activate this job';
    if (!window.confirm(`Are you sure you want to ${actionLabel}?`)) return;

    setProcessingId(job.id);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `http://127.0.0.1:8000/api/jobs/${job.id}/toggle-active/`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert(res.data.message || 'Job status updated successfully.');
      fetchMyJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update job status.');
    } finally {
      setProcessingId(null);
    }
  };

  // ജോബ് പൂർണ്ണമായി ഡിലീറ്റ് ചെയ്യാൻ
  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Delete "${job.title}" permanently? This action cannot be undone.`)) return;

    setProcessingId(job.id);
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://127.0.0.1:8000/api/jobs/${job.id}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Job deleted successfully.');
      setJobs(jobs.filter(j => j.id !== job.id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete job.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 md:pt-32 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <Link to="/employer-dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
            Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">My Posted Jobs</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Manage every vacancy your company has published.</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Post a Job
            </button>
          </div>
        </div>

        {/* Search + count */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by job title or location..."
            className="w-full sm:w-80 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500"
          />
          <span className="px-3 py-2 bg-white border border-slate-100 text-slate-700 font-black text-xs rounded-xl whitespace-nowrap">
            {filteredJobs.length} Jobs
          </span>
        </div>

        {/* Jobs list */}
        {loading ? (
          <div className="text-center py-16 font-bold text-slate-400 text-sm">Loading your jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-500 font-bold text-sm">No jobs found.</p>
            <p className="text-slate-400 font-medium text-xs mt-1">Click "Post a Job" to publish a new vacancy.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredJobs.map((job) => {
              const badge = getStatusBadge(job);
              const isWorking = processingId === job.id;
              // അപ്രൂവൽ ആകാത്ത ജോബ് ആക്ടീവ് ആക്കാൻ സാധിക്കില്ല
              const cannotActivate = !job.is_active && job.approval_status !== 'Approved';

              return (
              <div key={job.id} className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-[0_20px_50px_-25px_rgba(16,185,129,0.35)] hover:border-emerald-100 transition-all duration-300 flex flex-col">
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <CompanyLogo
                      logoUrl={job.company_logo}
                      name={job.company_name}
                      iconName={job.category_icon}
                      themeIndex={job.category || job.id}
                      size="sm"
                    />
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-tight">{job.title}</h3>
                      <p className="text-xs font-bold text-slate-400 mt-0.5">{job.location}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 font-bold text-[11px] rounded-lg">{job.job_type}</span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-lg">{job.salary_range || 'Best in Industry'}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-bold text-slate-400">
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/employer/applications?job=${job.id}`}
                      className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      View Applications
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                    </Link>
                  </div>

                  {/* Job post actions: Edit / Inactive-Activate / Delete */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setEditJob(job)}
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      Edit
                    </button>

                    <button
                      onClick={() => handleToggleActive(job)}
                      disabled={isWorking || cannotActivate}
                      title={cannotActivate ? 'Job must be approved before it can be activated.' : ''}
                      className={`py-2.5 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                        job.is_active
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {job.is_active ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Inactive
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Activate
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeleteJob(job)}
                      disabled={isWorking}
                      className="py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>

      <PostJobModal
        isOpen={isModalOpen || !!editJob}
        onClose={() => { setIsModalOpen(false); setEditJob(null); }}
        onJobPosted={() => { fetchMyJobs(); }}
        jobToEdit={editJob}
      />
    </div>
  );
};

export default EmployerJobs;
