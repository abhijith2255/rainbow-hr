import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileText, Bookmark, Search, PencilLine, LogOut, X, CalendarDays } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ResumePreview from './ResumePreview';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [savedJobsCount, setSavedJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [viewingApp, setViewingApp] = useState(null);
  const [editingApp, setEditingApp] = useState(null);
  const [editFormData, setEditFormData] = useState({ full_name: '', phone: '', cover_letter: '', resume: null });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDashboardAndApplications();
  }, []);

  const fetchDashboardAndApplications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return handleLogout();

      const [dashRes, appsRes, savedRes] = await Promise.all([
        axios.get('https://rainbow-hr.onrender.com/api/accounts/candidate/dashboard-data/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('https://rainbow-hr.onrender.com/api/jobs/my-applications/', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get('https://rainbow-hr.onrender.com/api/jobs/saved-jobs/', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      setData(dashRes.data);
      setApplications(appsRes.data || []);
      const savedList = Array.isArray(savedRes.data) ? savedRes.data : (savedRes.data?.results || []);
      setSavedJobsCount(savedList.length);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Delete / Withdraw Application
  const handleDeleteApplication = async (appId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`https://rainbow-hr.onrender.com/api/jobs/applications/${appId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("Application withdrawn successfully!");
      setApplications(applications.filter(app => app.id !== appId));
      if (viewingApp?.id === appId) setViewingApp(null);
    } catch (err) {
      console.error("Failed to delete application", err);
      alert("Failed to withdraw application. Please try again.");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (app) => {
    setEditingApp(app);
    setEditFormData({
      full_name: app.full_name || '',
      phone: app.phone || '',
      cover_letter: app.cover_letter || '',
      resume: null
    });
  };

  // Submit Edit Application
  const handleUpdateApplication = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('full_name', editFormData.full_name);
      formData.append('phone', editFormData.phone);
      formData.append('cover_letter', editFormData.cover_letter);
      if (editFormData.resume) {
        formData.append('resume', editFormData.resume);
      }

      const res = await axios.put(`https://rainbow-hr.onrender.com/api/jobs/applications/${editingApp.id}/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert("Application updated successfully!");
      setApplications(applications.map(app => app.id === editingApp.id ? res.data : app));
      setEditingApp(null);
    } catch (err) {
      console.error("Error updating application:", err);
      alert("Failed to update application details.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getProfilePicUrl = () => {
    if (!data?.profilePicture) return null;
    return data.profilePicture.startsWith('http') 
      ? data.profilePicture 
      : `https://rainbow-hr.onrender.com${data.profilePicture}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-premium pt-28 md:pt-32 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Header section with User Data */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center gap-4 sm:gap-6 z-10 w-full md:w-auto">
            <div className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg overflow-hidden border-4 border-white shrink-0">
              {getProfilePicUrl() ? (
                <img src={getProfilePicUrl()} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                data?.fullName ? data.fullName.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            
            <div className="flex-grow">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-full mb-2">Candidate Portal</span>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                Welcome, <span className="text-emerald-500 capitalize">{data?.name || data?.fullName || data?.username || 'User'}</span>
              </h1>
              <p className="text-slate-500 font-bold mt-1 text-sm md:text-base">
                {data?.designation || 'Add a designation'} • {data?.location || 'Add your location'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 z-10 w-full md:w-auto mt-2 md:mt-0">
            <button 
              onClick={() => navigate('/')} 
              className="flex-1 md:flex-none px-5 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Search className="w-4 h-4" strokeWidth={2.5} />
              Find Jobs
            </button>
            <button 
              onClick={() => navigate('/candidate-profile-edit')} 
              className="flex-1 md:flex-none px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-emerald-50 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <PencilLine className="w-4 h-4" strokeWidth={2.5} />
              Edit Profile
            </button>
            <button 
              onClick={handleLogout} 
              className="px-4 py-3 bg-white border border-slate-200 text-red-500 font-bold rounded-xl shadow-sm hover:bg-red-50 transition-all flex items-center justify-center"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link to="/candidate/applications" className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-3xl font-black text-slate-900">{applications.length}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Applied Jobs <span className="inline-block text-emerald-500 group-hover:translate-x-1 transition-transform">→</span></p>
          </Link>
          
          <Link to="/candidate/saved-jobs" className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6" strokeWidth={2} />
            </div>
            <h3 className="text-3xl font-black text-slate-900">{savedJobsCount}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Saved Jobs <span className="inline-block text-emerald-500 group-hover:translate-x-1 transition-transform">→</span></p>
          </Link>
          
        </div>

        {/* Applied Jobs Section */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">My Applications</h2>
              <p className="text-slate-500 text-sm font-medium mt-1">Track, manage or edit your submitted job applications.</p>
            </div>
            <span className="px-3 py-1 bg-slate-100 text-slate-700 font-extrabold text-xs rounded-xl">
              {applications.length} Submitted
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-bold text-sm">You haven't applied for any jobs yet.</p>
              <button onClick={() => navigate('/')} className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all">
                Browse Jobs & Apply Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="p-6 rounded-2xl border border-slate-100 bg-white hover:border-emerald-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    {/* Status Badge ഉൾപ്പെടുത്തിയ ഭാഗം */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 font-black text-[10px] rounded-md uppercase">
                        {app.job_type || 'Full-time'}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status === 'Approved' ? '✓ Verified & Forwarded' : (app.status || 'Pending Review')}
                      </span>

                      <span className="text-[11px] font-bold text-slate-400">
                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900">{app.job_title}</h3>
                    <p className="text-sm font-bold text-slate-500 mt-0.5">{app.company_name} • {app.location}</p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">Applicant: <span className="text-slate-700 font-bold">{app.full_name}</span> ({app.phone})</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => setViewingApp(app)} 
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                    >
                      View Details
                    </button>
                    <Link 
                      to="/candidate/applications"
                      className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-all text-center"
                    >
                      Timeline
                    </Link>
                    <button 
                      onClick={() => handleOpenEdit(app)} 
                      className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteApplication(app.id)} 
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-all"
                      title="Withdraw Application"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 1. VIEW JOB & APPLICATION DETAILS MODAL */}
      {viewingApp && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-black text-[10px] rounded-lg uppercase">{viewingApp.job_type}</span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{viewingApp.job_title}</h2>
                <p className="text-sm font-bold text-slate-500">{viewingApp.company_name} • {viewingApp.location}</p>
              </div>
              <button onClick={() => setViewingApp(null)} className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 shrink-0"><X className="w-4 h-4" strokeWidth={2.5} /></button>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Application Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-700">
                  <p>Name: <span className="text-slate-900">{viewingApp.full_name}</span></p>
                  <p>Email: <span className="text-slate-900">{viewingApp.email}</span></p>
                  <p>Phone: <span className="text-slate-900">{viewingApp.phone}</span></p>
                  <p>Status: <span className="text-slate-900">{viewingApp.status || 'Pending'}</span></p>
                  <p>Applied Date: <span className="text-slate-900">{new Date(viewingApp.applied_at).toLocaleDateString()}</span></p>
                </div>
                {viewingApp.resume && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <a 
                      href={viewingApp.resume.startsWith('http') ? viewingApp.resume : `https://rainbow-hr.onrender.com${viewingApp.resume}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex items-center gap-2 text-emerald-600 font-black text-xs hover:underline"
                    >
                      Download Submitted Resume
                    </a>
                  </div>
                )}
              </div>

              {/* Application Info-ക്ക് താഴെ റിസ്യൂമിന്റെ ഇൻലൈൻ പ്രിവ്യൂ */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Submitted Resume</h4>
                <ResumePreview resumeUrl={viewingApp.resume} compact />
              </div>

              {viewingApp.cover_letter && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Your Cover Note</h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl whitespace-pre-line font-medium">{viewingApp.cover_letter}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Job Description</h4>
                <p className="text-sm text-slate-700 whitespace-pre-line font-medium leading-relaxed">{viewingApp.description || 'No description provided.'}</p>
              </div>

              {viewingApp.requirements && (
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Job Requirements</h4>
                  <p className="text-sm text-slate-700 whitespace-pre-line font-medium leading-relaxed">{viewingApp.requirements}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-100 mt-6">
              <button onClick={() => setViewingApp(null)} className="flex-1 py-3 bg-slate-100 font-bold text-slate-700 rounded-xl text-xs">
                Close
              </button>
              <button 
                onClick={() => {
                  const toDeleteId = viewingApp.id;
                  handleDeleteApplication(toDeleteId);
                }} 
                className="py-3 px-6 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-xs"
              >
                Withdraw Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT APPLICATION MODAL */}
      {editingApp && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-slate-900">Edit Application</h3>
                <p className="text-xs font-bold text-slate-400">{editingApp.job_title} • {editingApp.company_name}</p>
              </div>
              <button onClick={() => setEditingApp(null)} className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 shrink-0"><X className="w-4 h-4" strokeWidth={2.5} /></button>
            </div>

            <form onSubmit={handleUpdateApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editFormData.full_name} 
                  onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={editFormData.phone} 
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Update Resume (Optional)</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setEditFormData({ ...editFormData, resume: e.target.files[0] })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-bold hover:file:bg-emerald-100" 
                />
                <p className="text-[10px] text-slate-400 mt-1">Leave empty if you want to keep the current resume.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cover Note</label>
                <textarea 
                  rows="3" 
                  value={editFormData.cover_letter} 
                  onChange={(e) => setEditFormData({ ...editFormData, cover_letter: e.target.value })} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 resize-none" 
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditingApp(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-500/20">
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CandidateDashboard;