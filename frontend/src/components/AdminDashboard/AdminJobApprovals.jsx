import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  RefreshCw, Loader2, CheckCircle2, XCircle, Clock, Ban, Play, Trash2,
  PencilLine, Filter, Briefcase, MapPin, Inbox, X,
} from 'lucide-react';
import AdminPageShell from './AdminPageShell';

const TABS = [
  { key: 'Pending', label: 'Pending' },
  { key: 'Approved', label: 'Approved' },
  { key: 'Inactive', label: 'Inactive' },
  { key: 'Rejected', label: 'Rejected' },
  { key: 'All', label: 'All' },
];

// Admin: ജോബ് മോഡറേഷൻ ക്യൂ — Pending, Approved, Inactive, Rejected ടാബുകളോടെ.
const AdminJobApprovals = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');
  const [error, setError] = useState('');

  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setJobs(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  // ടാബ് അനുസരിച്ച് ജോബുകൾ ഫിൽട്ടർ ചെയ്യുന്നു
  const filteredJobs = jobs.filter((job) => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return job.approval_status === 'Pending';
    if (filter === 'Rejected') return job.approval_status === 'Rejected';
    if (filter === 'Approved') return job.approval_status === 'Approved' && job.is_active;
    if (filter === 'Inactive') return job.approval_status === 'Approved' && !job.is_active;
    return true;
  });

  const countFor = (key) => {
    if (key === 'All') return jobs.length;
    if (key === 'Pending') return jobs.filter((j) => j.approval_status === 'Pending').length;
    if (key === 'Rejected') return jobs.filter((j) => j.approval_status === 'Rejected').length;
    if (key === 'Approved') return jobs.filter((j) => j.approval_status === 'Approved' && j.is_active).length;
    if (key === 'Inactive') return jobs.filter((j) => j.approval_status === 'Approved' && !j.is_active).length;
    return 0;
  };

  const getStatusBadge = (job) => {
    if (job.approval_status === 'Pending') {
      return { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-100', Icon: Clock };
    }
    if (job.approval_status === 'Rejected') {
      return { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-100', Icon: XCircle };
    }
    if (!job.is_active) {
      return { label: 'Inactive', className: 'bg-slate-100 text-slate-600 border-slate-200', Icon: Ban };
    }
    return { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-100', Icon: CheckCircle2 };
  };

  const handleReviewClick = (job) => {
    setSelectedJob(job);
    setEditData({ ...job });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        title: editData.title,
        company_name: editData.company_name,
        location: editData.location,
        job_type: editData.job_type,
        gender_preference: editData.gender_preference,
        salary_type: editData.salary_type,
        salary_range: editData.salary_range,
        description: editData.description,
        requirements: editData.requirements,
      };
      await axios.put(`http://127.0.0.1:8000/api/jobs/${selectedJob.id}/`, payload, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      alert('Job details updated successfully!');
      fetchJobs();
      setSelectedJob(null);
    } catch (err) {
      alert('Error: ' + JSON.stringify(err.response?.data || err.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleApproveJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to approve and publish this job?')) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:8000/api/jobs/${jobId}/approve/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      alert('Job Approved & Published!');
      fetchJobs();
      setSelectedJob(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to approve job.');
    }
  };

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
      fetchJobs();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update job status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteJob = async (job) => {
    if (!window.confirm(`Delete "${job.title}" permanently? This action cannot be undone.`)) return;

    setProcessingId(job.id);
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://127.0.0.1:8000/api/jobs/${job.id}/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete job.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <AdminPageShell
      title="Job Moderation Queue"
      subtitle="Review, edit, publish, deactivate or remove employer job postings."
      actions={
        <button
          onClick={fetchJobs}
          className="px-4 py-2.5 bg-white/5 border border-white/10 text-slate-200 font-bold text-xs rounded-xl hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
          Refresh
        </button>
      }
    >
      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-2xl p-4 text-sm font-bold mb-6">{error}</div>
      )}

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
              filter === tab.key
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" strokeWidth={2.5} />
            {tab.label}
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
              filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {countFor(tab.key)}
            </span>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-9 h-9 text-emerald-500 animate-spin" strokeWidth={2.5} />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {filter === 'Pending' ? (
                <CheckCircle2 className="w-10 h-10" strokeWidth={2} />
              ) : (
                <Inbox className="w-10 h-10" strokeWidth={2} />
              )}
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {filter === 'Pending' ? 'All Caught Up!' : 'Nothing here'}
            </h3>
            <p className="text-slate-500 font-bold mt-2 text-sm">
              {filter === 'Pending'
                ? 'There are no pending jobs to approve right now.'
                : `No ${filter.toLowerCase()} job posts found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const badge = getStatusBadge(job);
              const isWorking = processingId === job.id;
              const cannotActivate = !job.is_active && job.approval_status !== 'Approved';
              return (
                <div
                  key={job.id}
                  className="p-5 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 border font-black text-[10px] uppercase rounded-md flex items-center gap-1.5 ${badge.className}`}>
                        <badge.Icon className="w-3 h-3" strokeWidth={3} />
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">{job.company_name}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900">{job.title}</h4>
                    <p className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                      {job.location}
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" strokeWidth={2.5} />
                        {job.job_type}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full md:w-auto shrink-0">
                    {job.approval_status === 'Pending' && (
                      <button
                        onClick={() => handleApproveJob(job.id)}
                        disabled={isWorking}
                        className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-700 shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleReviewClick(job)}
                      disabled={isWorking}
                      className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <PencilLine className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(job)}
                      disabled={isWorking || cannotActivate}
                      title={cannotActivate ? 'Job must be approved before activation' : ''}
                      className={`flex-1 md:flex-none px-4 py-2 font-bold text-xs rounded-xl disabled:opacity-40 flex items-center justify-center gap-1.5 ${
                        job.is_active
                          ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {job.is_active ? (
                        <><Ban className="w-3.5 h-3.5" strokeWidth={2.5} /> Inactive</>
                      ) : (
                        <><Play className="w-3.5 h-3.5" strokeWidth={2.5} /> Activate</>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job)}
                      disabled={isWorking}
                      className="flex-1 md:flex-none px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100 disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review & Edit Modal */}
      {selectedJob && editData && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
              <div>
                <h2 className="text-xl font-black text-slate-900">Review Job Post</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">Make necessary changes before approving.</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Title</label>
                  <input type="text" name="title" value={editData.title || ''} onChange={handleEditChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                  <input type="text" name="company_name" value={editData.company_name || ''} onChange={handleEditChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Location</label>
                  <input type="text" name="location" value={editData.location || ''} onChange={handleEditChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Type</label>
                  <select name="job_type" value={editData.job_type || ''} onChange={handleEditChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Work From Home">Work From Home</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender Preference</label>
                  <select name="gender_preference" value={editData.gender_preference || ''} onChange={handleEditChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm">
                    <option value="Any">Any / Both</option>
                    <option value="Male">Male Only</option>
                    <option value="Female">Female Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Salary Type</label>
                  <select name="salary_type" value={editData.salary_type || ''} onChange={handleEditChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm">
                    <option value="Fixed Range">Fixed Salary Range</option>
                    <option value="Best in Industry">Best in Industry</option>
                    <option value="Based on Interview">Based on Interview</option>
                    <option value="Negotiable">Negotiable</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Salary Range</label>
                  <input type="text" name="salary_range" value={editData.salary_range || ''} onChange={handleEditChange} placeholder="e.g. ₹20,000 - ₹30,000" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Description</label>
                <textarea name="description" value={editData.description || ''} onChange={handleEditChange} rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-bold text-sm resize-none"></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Requirements</label>
                <textarea name="requirements" value={editData.requirements || ''} onChange={handleEditChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-bold text-sm resize-none"></textarea>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white rounded-b-3xl flex justify-between items-center gap-4">
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all flex-1 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              {selectedJob.approval_status === 'Pending' && (
                <button
                  onClick={() => handleApproveJob(selectedJob.id)}
                  className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-all flex-1"
                >
                  Approve &amp; Publish Job
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminJobApprovals;
