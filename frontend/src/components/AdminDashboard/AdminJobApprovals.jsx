import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminJobApprovals = () => {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // പെൻഡിങ് ആയ ജോബുകൾ മാത്രം ഫിൽറ്റർ ചെയ്യുന്നു
      setPendingJobs(res.data.filter(job => job.approval_status === 'Pending'));
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (job) => {
    setSelectedJob(job);
    setEditData({ ...job }); // എഡിറ്റ് ചെയ്യാൻ വേണ്ടി ഡാറ്റ കോപ്പി ചെയ്യുന്നു
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData({
      ...editData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      
      // നമ്മൾ എഡിറ്റ് ചെയ്ത ഫീൽഡുകൾ മാത്രം ബാക്കെൻഡിലേക്ക് അയക്കുന്നു
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
      fetchPendingJobs(); // ലിസ്റ്റ് റിഫ്രഷ് ചെയ്യാൻ
      setSelectedJob(null); // മോഡൽ ക്ലോസ് ചെയ്യാൻ
    } catch (error) {
      console.error("Update Error:", error.response?.data);
      // ബാക്കെൻഡിൽ നിന്നുള്ള കൃത്യമായ എറർ മെസ്സേജ് കാണിക്കാൻ
      alert("Error: " + JSON.stringify(error.response?.data || error.message));
    } finally {
      setIsSaving(false);
    }
  };
  const handleApproveJob = async (jobId) => {
    if(!window.confirm("Are you sure you want to approve and publish this job?")) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:8000/api/jobs/${jobId}/approve/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Job Approved & Published!");
      fetchPendingJobs();
      setSelectedJob(null);
    } catch (error) {
      alert("Failed to approve job.");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar (Small version for sub-pages) */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col shadow-2xl z-20 hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-black tracking-tighter">Rainbow<span className="text-emerald-500">HR.</span></h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <Link to="/admin-dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            Dashboard
          </Link>
          <Link to="/admin/approvals" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-emerald-500 text-slate-950 shadow-lg">
            Job Approvals
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pending Approvals</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Review, edit, and approve employer job posts.</p>
          </div>
        </header>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          {pendingJobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 className="text-xl font-black text-slate-900">All Caught Up!</h3>
              <p className="text-slate-500 font-bold mt-2">There are no pending jobs to approve right now.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingJobs.map(job => (
                <div key={job.id} className="p-6 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-xl font-black text-slate-900">{job.title}</h4>
                      <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase tracking-wider rounded-full">Pending</span>
                    </div>
                    <p className="text-sm font-bold text-slate-500">{job.company_name} • {job.location} • {job.job_type}</p>
                  </div>
                  
                  <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={() => handleReviewClick(job)} className="flex-1 md:flex-none px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all">
                      Review & Edit
                    </button>
                    <button onClick={() => handleApproveJob(job.id)} className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-all">
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Review & Edit Modal */}
      {selectedJob && editData && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
              <div>
                <h2 className="text-xl font-black text-slate-900">Review Job Post</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">Make necessary changes before approving.</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
{/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              
              {/* Row 1: Title & Company */}
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

              {/* Row 2: Location, Job Type, Gender Preference */}
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

              {/* Row 3: Salary Options */}
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

              {/* Textareas: Description & Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Job Description</label>
                <textarea name="description" value={editData.description || ''} onChange={handleEditChange} rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-bold text-sm resize-none"></textarea>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Requirements</label>
                <textarea name="requirements" value={editData.requirements || ''} onChange={handleEditChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-bold text-sm resize-none"></textarea>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-white rounded-b-3xl flex justify-between items-center gap-4">
              <button onClick={handleSaveChanges} disabled={isSaving} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all flex-1">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => handleApproveJob(selectedJob.id)} className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-all flex-1">
                Approve & Publish Job
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminJobApprovals;