import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Plus, PencilLine, Columns3, BarChart3, LogOut, Briefcase, Users,
  Clock, Eye, ArrowRight, Building2, Globe, User, X, Mail, Phone,
} from 'lucide-react';
import PostJobModal from './PostJobModal';
import { useAuth } from '../../context/AuthContext';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [totalViews, setTotalViews] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return handleLogout();

      // 1. Employer Profile Data
      const res = await axios.get('https://rainbow-hr.onrender.com/api/accounts/employer/dashboard-data/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setData(res.data);
      
      // 2. ഈ Employer പോസ്റ്റ് ചെയ്ത സ്വന്തം Jobs മാത്രം ഫെച്ച് ചെയ്യുന്നു (?my_jobs=true)
      const jobsRes = await axios.get('https://rainbow-hr.onrender.com/api/jobs/?my_jobs=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMyJobs(Array.isArray(jobsRes.data) ? jobsRes.data : (jobsRes.data?.results || []));

      // 3. Staff verify cheytha Approved Candidate Applications
      const appsRes = await axios.get('https://rainbow-hr.onrender.com/api/jobs/employer/applications/', {
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

  // Job Views കാർഡിനു വേണ്ടി മാത്രം വേർതിരിച്ചുള്ള analytics ഫെച്ച് (ഇത് fail ആയാലും dashboard തകരില്ല)
  const fetchTotalViews = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      const res = await axios.get('https://rainbow-hr.onrender.com/api/jobs/employer/analytics/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTotalViews(res.data?.totals?.total_views ?? 0);
    } catch (error) {
      console.error("Total views fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTotalViews();
  }, []);

  const handleLogout = () => {
    logout();
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
    return logo.startsWith('http') ? logo : `https://rainbow-hr.onrender.com${logo}`;
  };

  const getResumeUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `https://rainbow-hr.onrender.com${path}`;
  };

  // യഥാർത്ഥത്തിൽ അപ്രൂവ് ആയ ആക്ടീവ് ജോബുകളുടെ എണ്ണം മാത്രം ഫിൽട്ടർ ചെയ്യുന്നു
  const activeJobsCount = myJobs.filter(job => job.approval_status === 'Approved').length;
  const pendingJobsCount = myJobs.filter(job => job.approval_status === 'Pending').length;

  return (
    <div className="min-h-screen bg-slate-50 font-premium pt-28 md:pt-32 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center gap-4 sm:gap-6 z-10 w-full md:w-auto">
            {/* Company Logo / Initial */}
            <div className="w-16 h-16 sm:w-20 md:w-24 sm:h-20 md:h-24 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-lg overflow-hidden border-4 border-white shrink-0">
              {getLogoUrl() ? (
                <img src={getLogoUrl()} alt="Logo" className="w-full h-full object-cover bg-white" />
              ) : (
                (data?.companyName || data?.company_name || 'C').charAt(0).toUpperCase()
              )}
            </div>
            
            <div className="flex-grow min-w-0">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-black text-[10px] uppercase tracking-widest rounded-full mb-2">
                Employer Portal
              </span>
              <h1 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 tracking-tight capitalize truncate">
                {data?.companyName || data?.company_name || data?.username || 'Your Company'}
              </h1>
              <p className="text-slate-500 font-bold mt-1 text-sm md:text-base flex items-center gap-2 capitalize">
                <Building2 className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                <span className="truncate">{data?.industry || data?.industry_sector || 'Add Industry'} • {data?.location || data?.companyLocation || 'Add Location'}</span>
              </p>
            </div>
          </div>
          
          {/* Header Action Buttons */}
          <div className="flex flex-wrap gap-3 z-10 w-full md:w-auto mt-2 md:mt-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex-1 min-w-[8.5rem] md:flex-none md:min-w-0 px-5 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              Post a Job
            </button>

            <button 
              onClick={() => navigate('/employer-profile-edit')} 
              className="flex-1 min-w-[8.5rem] md:flex-none md:min-w-0 px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <PencilLine className="w-4 h-4" strokeWidth={2.5} />
              Edit Company
            </button>

            <Link
              to="/employer/pipeline"
              className="flex-1 min-w-[8.5rem] md:flex-none md:min-w-0 px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <Columns3 className="w-4 h-4" strokeWidth={2.5} />
              ATS Pipeline
            </Link>

            <Link
              to="/employer/analytics"
              className="flex-1 min-w-[8.5rem] md:flex-none md:min-w-0 px-5 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <BarChart3 className="w-4 h-4" strokeWidth={2.5} />
              Job Analytics
            </Link>

            {/* Sign Out Button */}
            <button 
              onClick={handleLogout} 
              className="px-4 py-3 bg-white border border-slate-200 text-red-500 hover:bg-red-50 rounded-xl font-bold shadow-sm transition-all flex items-center justify-center"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </header>

        {/* Summary Cards (clickable → dedicated sub-pages) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Jobs → /employer/jobs */}
          <Link
            to="/employer/jobs"
            className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6" strokeWidth={2} />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
            </div>
            {/* ഈ യൂസർ പോസ്റ്റ് ചെയ്ത് approved ആയ ജോബുകളുടെ എണ്ണം മാത്രം */}
            <h3 className="text-3xl font-black text-slate-900">{activeJobsCount}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Active Jobs</p>
            <p className="text-[11px] font-black text-blue-600 mt-3">Manage all jobs →</p>
          </Link>

          {/* Total Applicants → /employer/applications */}
          <Link
            to="/employer/applications"
            className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" strokeWidth={2} />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-black text-slate-900">{applications.length}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Applicants</p>
            <p className="text-[11px] font-black text-emerald-600 mt-3">View applications →</p>
          </Link>

          {/* Pending Approval (informational) */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6" strokeWidth={2} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{pendingJobsCount}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Pending Approval</p>
            <p className="text-[11px] font-bold text-slate-400 mt-3">Awaiting staff review</p>
          </div>

          {/* Job Views → /employer/analytics (analytics API-ൽ നിന്നുള്ള total_views) */}
          <Link
            to="/employer/analytics"
            className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-200 hover:-translate-y-1 transition-all flex flex-col"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6" strokeWidth={2} />
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" strokeWidth={2.5} />
            </div>
            <h3 className="text-3xl font-black text-slate-900">{totalViews}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Job Views</p>
            <p className="text-[11px] font-black text-indigo-600 mt-3">Views &amp; funnel →</p>
          </Link>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols): Recent Applications Preview */}
          <div className="space-y-8 lg:col-span-2">

            {/* Recent Verified Applications (preview only — full list lives on /employer/applications) */}
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Recent Applications</h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Latest candidates verified and forwarded by RainbowHR Staff.</p>
                </div>
                <Link to="/employer/applications" className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-extrabold text-xs rounded-xl hover:bg-emerald-100 transition-all whitespace-nowrap">
                  View All
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="py-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold text-sm">No candidate applications received yet.</p>
                  <p className="text-slate-400 text-xs mt-1">Applications approved by Staff will appear here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((app) => (
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
                        <p className="text-xs font-semibold text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" strokeWidth={2.5} />{app.email}</span>
                          <span className="inline-flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" strokeWidth={2.5} />{app.phone}</span>
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

                  {applications.length > 3 && (
                    <Link to="/employer/applications" className="block text-center text-xs font-black text-slate-500 hover:text-emerald-600 pt-2 transition-colors">
                      + {applications.length - 3} more application{applications.length - 3 > 1 ? 's' : ''} — View all
                    </Link>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (1 Col): Company Overview */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Company Overview</h3>
              <button onClick={() => navigate('/employer-profile-edit')} className="text-blue-600 hover:text-blue-700 bg-blue-50 p-2 rounded-full transition-colors">
                <PencilLine className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                  <User className="w-5 h-5" strokeWidth={2} />
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
                    <Globe className="w-5 h-5" strokeWidth={2} />
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
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-0">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {selectedApp.job_title}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{selectedApp.full_name}</h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Applied on {new Date(selectedApp.applied_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full shrink-0">
                <X className="w-4 h-4" strokeWidth={2.5} />
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