import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostJobModal from './PostJobModal';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return handleLogout();

      // 1. Employer Profile Data
      const res = await axios.get('http://127.0.0.1:8000/api/accounts/employer/dashboard-data/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setData(res.data);
      
      // 2. ഈ Employer പോസ്റ്റ് ചെയ്ത സ്വന്തം Jobs മാത്രം ഫെച്ച് ചെയ്യുന്നു (?my_jobs=true)
      const jobsRes = await axios.get('http://127.0.0.1:8000/api/jobs/?my_jobs=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMyJobs(Array.isArray(jobsRes.data) ? jobsRes.data : (jobsRes.data?.results || []));

      // 3. Staff verify cheytha Approved Candidate Applications
      const appsRes = await axios.get('http://127.0.0.1:8000/api/jobs/employer/applications/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setApplications(Array.isArray(appsRes.data) ? appsRes.data : []);

    } catch (error) {
      console.error("Dashboard fetch error:", error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getLogoUrl = () => {
    const logo = data?.companyLogo || data?.company_logo;
    if (!logo) return null;
    return logo.startsWith('http') ? logo : `http://127.0.0.1:8000${logo}`;
  };

  const getResumeUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
  };

  // യഥാർത്ഥത്തിൽ അപ്രൂവ് ആയ ആക്ടീവ് ജോബുകളുടെ എണ്ണം മാത്രം ഫിൽട്ടർ ചെയ്യുന്നു
  const activeJobsCount = myJobs.filter(job => job.approval_status === 'Approved').length;

  return (
    <div className="min-h-screen bg-slate-50 font-premium p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            {/* Company Logo / Initial */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg overflow-hidden border-4 border-white shrink-0">
              {getLogoUrl() ? (
                <img src={getLogoUrl()} alt="Logo" className="w-full h-full object-cover bg-white" />
              ) : (
                (data?.companyName || data?.company_name || 'C').charAt(0).toUpperCase()
              )}
            </div>
            
            <div className="flex-grow">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-black text-[10px] uppercase tracking-widest rounded-full mb-2">
                Employer Portal
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight capitalize">
                {data?.companyName || data?.company_name || data?.username || 'Your Company'}
              </h1>
              <p className="text-slate-500 font-bold mt-1 text-sm md:text-base flex items-center gap-2 capitalize">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {data?.industry || data?.industry_sector || 'Add Industry'} • {data?.location || data?.companyLocation || 'Add Location'}
              </p>
            </div>
          </div>
          
          {/* Header Action Buttons */}
          <div className="flex flex-wrap gap-3 z-10 w-full md:w-auto mt-2 md:mt-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Post a Job
            </button>

            <button 
              onClick={() => navigate('/employer-profile-edit')} 
              className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              Edit Company
            </button>

            {/* Sign Out Button */}
            <button 
              onClick={handleLogout} 
              className="px-4 py-3 bg-white border border-slate-200 text-red-500 hover:bg-red-50 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            {/* ഈ യൂസർ പോസ്റ്റ് ചെയ്ത് approved ആയ ജോബുകളുടെ എണ്ണം മാത്രം */}
            <h3 className="text-3xl font-black text-slate-900">{activeJobsCount}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Active Jobs</p>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{applications.length}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Applicants</p>
          </div>
          
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-3xl font-black text-slate-900">0</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Interviews Scheduled</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols): Applications & Jobs */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* 1. Verified Applications from Candidates */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Verified Candidate Applications</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Reviewed and confirmed by RainbowHR Staff.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-xl">
                  {applications.length} Received
                </span>
              </div>

              {applications.length === 0 ? (
                <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold text-sm">No candidate applications received yet.</p>
                  <p className="text-slate-400 text-xs mt-1">Applications approved by Staff will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div 
                      key={app.id} 
                      className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-black text-[10px] rounded-md">
                            {app.job_title}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">
                            Applied: {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900">{app.full_name}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">
                          📧 {app.email} • 📞 {app.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <button 
                          onClick={() => setSelectedApp(app)}
                          className="flex-1 md:flex-none px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                        >
                          View Details
                        </button>
                        {app.resume && (
                          <a 
                            href={getResumeUrl(app.resume)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm transition-all text-center"
                          >
                            Resume
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Posted Jobs */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-slate-900">Your Posted Jobs</h3>
                <span className="text-xs font-bold text-slate-400">{myJobs.length} Jobs</span>
              </div>
              
              {myJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                  <p className="font-bold text-sm">No jobs posted yet.</p>
                  <p className="text-xs mt-1">Click 'Post a Job' to publish your vacancies.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myJobs.map((job) => (
                    <div key={job.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-base">{job.title}</h4>
                        <p className="text-xs font-semibold text-slate-500 mt-0.5">{job.location} • {job.job_type} • <span className="text-emerald-600 font-bold">{job.salary_range || 'Best in Industry'}</span></p>
                      </div>
                      {job.approval_status === 'Pending' ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-black rounded-full">
                          Pending Approval
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (1 Col): Company Overview */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Company Overview</h3>
              <button onClick={() => navigate('/employer-profile-edit')} className="text-blue-600 hover:text-blue-700 bg-blue-50 p-2 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Primary Contact (HR)</p>
                  <p className="text-sm font-bold text-slate-800 capitalize">{data?.hrName || data?.hr_name || 'Not added'}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">{data?.email}</p>
                </div>
              </div>

              {data?.companyWebsite && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Website</p>
                    <a href={data.companyWebsite} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline break-all">
                      {data.companyWebsite.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                </div>
              )}

              {data?.companyDescription && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">About</p>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {data.companyDescription}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Details Modal for Employer */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {selectedApp.job_title}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{selectedApp.full_name}</h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Applied on {new Date(selectedApp.applied_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p><span className="font-bold text-slate-500">Email:</span> <a href={`mailto:${selectedApp.email}`} className="text-blue-600 font-bold underline">{selectedApp.email}</a></p>
                <p><span className="font-bold text-slate-500">Phone:</span> <a href={`tel:${selectedApp.phone}`} className="text-emerald-600 font-bold">{selectedApp.phone}</a></p>
              </div>

              {selectedApp.cover_letter && (
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Cover Note</h4>
                  <p className="p-4 bg-slate-50 rounded-2xl whitespace-pre-line leading-relaxed text-slate-800">
                    {selectedApp.cover_letter}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSelectedApp(null)} 
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
              {selectedApp.resume && (
                <a 
                  href={getResumeUrl(selectedApp.resume)} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  Download Resume
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post Job Modal */}
      <PostJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onJobPosted={fetchDashboardData} 
      />
    </div>
  );
};

export default EmployerDashboard;