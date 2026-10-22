import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffJobApprovals = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending'); // 'Pending', 'Approved', 'Inactive', 'Rejected', 'All'
  const [selectedJob, setSelectedJob] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // ടാബ് അനുസരിച്ച് ജോബുകൾ ഫിൽട്ടർ ചെയ്യുന്നു
  const filteredJobs = jobs.filter(job => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return job.approval_status === 'Pending';
    if (filter === 'Rejected') return job.approval_status === 'Rejected';
    if (filter === 'Approved') return job.approval_status === 'Approved' && job.is_active;
    if (filter === 'Inactive') return job.approval_status === 'Approved' && !job.is_active;
    return true;
  });

  const tabs = [
    { key: 'Pending', label: 'Pending' },
    { key: 'Approved', label: 'Approved' },
    { key: 'Inactive', label: 'Inactive' },
    { key: 'Rejected', label: 'Rejected' },
    { key: 'All', label: 'All' },
  ];

  // ഓരോ ജോബിന്റെയും നില കാണിക്കാൻ
  const getStatusBadge = (job) => {
    if (job.approval_status === 'Pending') return { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-100' };
    if (job.approval_status === 'Rejected') return { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-100' };
    if (!job.is_active) return { label: 'Inactive', className: 'bg-slate-100 text-slate-600 border-slate-200' };
    return { label: 'Active', className: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
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
        requirements: editData.requirements
      };
      await axios.put(`http://127.0.0.1:8000/api/jobs/${selectedJob.id}/`, payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Job details updated successfully!");
      fetchJobs();
      setSelectedJob(null);
    } catch (error) {
      alert("Error: " + JSON.stringify(error.response?.data || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleApproveJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to approve and publish this job?")) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:8000/api/jobs/${jobId}/approve/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Job Approved & Published!");
      fetchJobs();
      setSelectedJob(null);
    } catch (error) {
      alert("Failed to approve job.");
    }
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
      fetchJobs();
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

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-slate-900">Employer Job Approvals</h2>
          <p className="text-slate-500 font-medium text-xs mt-0.5">Review, edit, activate or remove employer job postings.</p>
        </div>
        <span className="px-3 py-1 bg-amber-50 text-amber-700 font-black text-xs rounded-xl">
          {filteredJobs.length} {filter === 'All' ? 'Total' : filter}
        </span>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              filter === tab.key
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 font-bold text-sm">No jobs found in this section.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map(job => {
              const badge = getStatusBadge(job);
              const isWorking = processingId === job.id;
              const cannotActivate = !job.is_active && job.approval_status !== 'Approved';
              return (
                <div key={job.id} className="p-5 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 border font-black text-[10px] uppercase rounded-md ${badge.className}`}>
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">{job.company_name}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900">{job.title}</h4>
                    <p className="text-xs font-bold text-slate-500 mt-1">{job.location} • <span className="text-blue-600">{job.job_type}</span></p>
                  </div>
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    {job.approval_status === 'Pending' && (
                      <button onClick={() => handleApproveJob(job.id)} disabled={isWorking} className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 shadow-sm disabled:opacity-50">
                        Approve
                      </button>
                    )}
                    <button onClick={() => handleReviewClick(job)} disabled={isWorking} className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 disabled:opacity-50">
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(job)}
                      disabled={isWorking || cannotActivate}
                      title={cannotActivate ? 'Job must be approved before activation' : ''}
                      className={`flex-1 md:flex-none px-4 py-2 font-bold text-xs rounded-xl disabled:opacity-40 ${
                        job.is_active
                          ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {job.is_active ? 'Inactive' : 'Activate'}
                    </button>
                    <button onClick={() => handleDeleteJob(job)} disabled={isWorking} className="flex-1 md:flex-none px-4 py-2 bg-red-50 border border-red-200 text-red-600 font-bold text-xs rounded-xl hover:bg-red-100 disabled:opacity-50">
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
                <h3 className="text-xl font-black text-slate-900">Review Job Post</h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Edit details before publishing.</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs font-bold text-slate-600">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase mb-1">Job Title</label>
                  <input type="text" name="title" value={editData.title || ''} onChange={handleEditChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold" />
                </div>
                <div>
                  <label className="block uppercase mb-1">Company Name</label>
                  <input type="text" name="company_name" value={editData.company_name || ''} onChange={handleEditChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase mb-1">Location</label>
                  <input type="text" name="location" value={editData.location || ''} onChange={handleEditChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold" />
                </div>
                <div>
                  <label className="block uppercase mb-1">Salary Range</label>
                  <input type="text" name="salary_range" value={editData.salary_range || ''} onChange={handleEditChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none font-bold" />
                </div>
              </div>
              <div>
                <label className="block uppercase mb-1">Description</label>
                <textarea name="description" value={editData.description || ''} onChange={handleEditChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none resize-none font-medium"></textarea>
              </div>
            </div>

            <div className="p-4 border-t flex justify-end gap-3 bg-white rounded-b-3xl">
              <button onClick={handleSaveChanges} disabled={isSaving} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              {selectedJob.approval_status === 'Pending' && (
                <button onClick={() => handleApproveJob(selectedJob.id)} className="px-5 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-700">
                  Approve & Publish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffJobApprovals;
