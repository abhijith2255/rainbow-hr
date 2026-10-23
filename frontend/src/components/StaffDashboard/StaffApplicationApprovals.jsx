import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StaffApplicationApprovals = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending'); // 'Pending', 'Approved', 'Rejected', 'All'
  const [selectedApp, setSelectedApp] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const url = filter === 'All' 
        ? 'https://rainbow-hr.onrender.com/api/jobs/staff/applications/'
        : `https://rainbow-hr.onrender.com/api/jobs/staff/applications/?status=${filter}`;

      const res = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (appId, action) => {
    const confirmMessage = action === 'approve'
      ? "Approve this application and forward candidate profile to the employer?"
      : "Are you sure you want to reject this application?";

    if (!window.confirm(confirmMessage)) return;

    setProcessingId(appId);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `https://rainbow-hr.onrender.com/api/jobs/staff/applications/${appId}/verify/`,
        { action },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

      alert(`Application ${action === 'approve' ? 'approved & forwarded to employer' : 'rejected'} successfully!`);
      setSelectedApp(null);
      fetchApplications();
    } catch (err) {
      console.error("Verification action error:", err);
      alert(err.response?.data?.error || "Failed to process application. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const getResumeUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `https://rainbow-hr.onrender.com${path}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Filter Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900">Candidate Applications Review</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">
            Verify candidate profiles one by one and forward them directly to employers.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {['Pending', 'Approved', 'Rejected', 'All'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === tab 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'Pending' ? 'Pending Review' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 font-bold text-sm bg-white rounded-2xl border border-slate-100">
          Loading applications...
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-bold text-sm">No applications found in this section.</p>
          <p className="text-slate-400 text-xs mt-1">New candidate applications will appear here for staff review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div 
              key={app.id} 
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
            >
              {/* Application Details */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    app.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {app.status === 'Approved' ? '✓ Verified & Forwarded' : (app.status || 'Pending')}
                  </span>
                  
                  <span className="text-[11px] font-bold text-slate-400">
                    Applied on: {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-900">{app.full_name}</h3>
                
                <p className="text-xs font-bold text-slate-500">
                  Applied for: <span className="text-slate-900 font-black">{app.job_title}</span> • {app.company_name}
                </p>

                <p className="text-xs text-slate-400 font-semibold flex items-center gap-4 pt-0.5">
                  <span>📞 {app.phone}</span>
                  <span>✉️ {app.email}</span>
                </p>
              </div>

              {/* Action Buttons: Individual One-by-One Controls */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button 
                  onClick={() => setSelectedApp(app)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  View Details
                </button>

                {app.resume && (
                  <a 
                    href={getResumeUrl(app.resume)} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-xl transition-all"
                  >
                    Download CV
                  </a>
                )}

                {/* Approve / Reject Buttons (Show when status is Pending or unset) */}
                {(!app.status || app.status === 'Pending') && (
                  <>
                    <button 
                      onClick={() => handleVerify(app.id, 'approve')}
                      disabled={processingId === app.id}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-black text-xs rounded-xl shadow-sm transition-all"
                    >
                      {processingId === app.id ? 'Processing...' : '✓ Confirm & Forward'}
                    </button>

                    <button 
                      onClick={() => handleVerify(app.id, 'reject')}
                      disabled={processingId === app.id}
                      className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 font-bold text-xs rounded-xl transition-all"
                    >
                      ✕ Reject
                    </button>
                  </>
                )}

                {app.status === 'Approved' && (
                  <span className="px-3 py-2 bg-emerald-50 text-emerald-700 font-black text-xs rounded-xl">
                    ✓ Forwarded to Employer
                  </span>
                )}

                {app.status === 'Rejected' && (
                  <span className="px-3 py-2 bg-red-50 text-red-600 font-black text-xs rounded-xl">
                    Rejected
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  Verification Review
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">{selectedApp.full_name}</h3>
                <p className="text-xs font-bold text-slate-400">
                  Target Role: {selectedApp.job_title} ({selectedApp.company_name})
                </p>
              </div>
              <button 
                onClick={() => setSelectedApp(null)} 
                className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                <p><span className="font-bold text-slate-500">Email:</span> {selectedApp.email}</p>
                <p><span className="font-bold text-slate-500">Phone:</span> {selectedApp.phone}</p>
                <p>
                  <span className="font-bold text-slate-500">Current Status:</span>{' '}
                  <span className="font-black text-slate-900">{selectedApp.status || 'Pending'}</span>
                </p>
              </div>

              {selectedApp.cover_letter && (
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Candidate Cover Note
                  </h4>
                  <p className="p-4 bg-slate-50 rounded-2xl whitespace-pre-line leading-relaxed text-slate-800">
                    {selectedApp.cover_letter}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={() => setSelectedApp(null)} 
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>

              {(!selectedApp.status || selectedApp.status === 'Pending') && (
                <>
                  <button 
                    onClick={() => handleVerify(selectedApp.id, 'reject')}
                    disabled={processingId === selectedApp.id}
                    className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-xs"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleVerify(selectedApp.id, 'approve')}
                    disabled={processingId === selectedApp.id}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-500/20"
                  >
                    {processingId === selectedApp.id ? 'Processing...' : 'Confirm & Forward'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffApplicationApprovals;