import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import PostJobModal from '../EmployerDashboard/PostJobModal';
import StaffJobApprovals from './StaffJobApprovals';
import StaffApplicationApprovals from './StaffApplicationApprovals';
import StaffReceivedApplications from './StaffReceivedApplications';
import ManageCategories from '../ManageCategories';
import { useAuth } from '../../context/AuthContext';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace', 'applications', 'job-approvals', 'categories'

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/api/accounts/staff/dashboard-data/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setDashboardData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching staff data", err);
      setError("Failed to load your workspace data.");
      setLoading(false);
      if (err.response && err.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-premium flex overflow-hidden">
      
      {/* Staff Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm relative z-20 shrink-0">
        <div className="p-8">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 cursor-pointer" onClick={() => navigate('/')}>
            Rainbow<span className="text-emerald-500">HR.</span>
          </h2>
          <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1 block bg-blue-50 w-max px-2.5 py-1 rounded-md">
            Staff Portal
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-2">
          {/* 1. Workspace Overview */}
          <button 
            onClick={() => setActiveTab('workspace')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-extrabold text-sm transition-all ${
              activeTab === 'workspace' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            My Workspace
          </button>

          {/* 2. Candidate Verification */}
          <button 
            onClick={() => setActiveTab('applications')}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-extrabold text-sm transition-all ${
              activeTab === 'applications' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Candidate Verify
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>

          {/* 3. Employer Job Approvals */}
          <button 
            onClick={() => setActiveTab('job-approvals')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-extrabold text-sm transition-all ${
              activeTab === 'job-approvals' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Job Approvals
          </button>

          {/* 4. Received Applications (Staff's own posted jobs) */}
          <button 
            onClick={() => setActiveTab('received-applications')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-extrabold text-sm transition-all ${
              activeTab === 'received-applications' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Received Applications
          </button>

          {/* 5. Manage Categories */}
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-extrabold text-sm transition-all ${
              activeTab === 'categories' 
                ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            Manage Categories
          </button>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 py-3.5 rounded-xl font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-500 p-6 rounded-2xl font-bold text-center border border-red-100">
              {error}
            </div>
          ) : (
            <>
              {/* Header */}
              <header className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                    {activeTab === 'workspace' && (dashboardData?.welcome_message || "My Workspace")}
                    {activeTab === 'applications' && "Candidate Applications"}
                    {activeTab === 'job-approvals' && "Employer Job Approvals"}
                    {activeTab === 'received-applications' && "Received Applications"}
                    {activeTab === 'categories' && "Manage Job Categories"}
                  </h1>
                  <p className="text-slate-500 font-medium text-xs mt-1">
                    Manage candidate verifications, company listings, and system tasks.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Audit Log page-ilekku pokunna header button */}
                  <Link 
                    to="/staff/audit-logs"
                    className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-black text-xs rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                    Audit Log
                  </Link>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                    Post a Job
                  </button>
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl shadow-sm flex items-center justify-center font-black text-lg">
                    S
                  </div>
                </div>
              </header>

              {/* Dynamic View rendering based on activeTab */}
              {activeTab === 'workspace' && (
                <div className="space-y-8">
                  {/* Analytics Summary Cards */}
                  <div>
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Platform Analytics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider mb-2">Active Employers</h3>
                        <p className="text-3xl font-black text-slate-900">{dashboardData?.total_employers || 0}</p>
                        <span className="text-xs font-bold text-indigo-500 mt-2 block">Hiring companies</span>
                      </div>

                      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider mb-2">Total Job Posts</h3>
                        <p className="text-3xl font-black text-slate-900">{dashboardData?.total_jobs || 0}</p>
                        <span className="text-xs font-bold text-emerald-600 mt-2 block">All postings</span>
                      </div>

                      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider mb-2">Total Candidates</h3>
                        <p className="text-3xl font-black text-slate-900">{dashboardData?.total_candidates || 0}</p>
                        <span className="text-xs font-bold text-amber-500 mt-2 block">Registered job seekers</span>
                      </div>

                      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                        <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider mb-2">Total Applications</h3>
                        <p className="text-3xl font-black text-slate-900">{dashboardData?.total_applications || 0}</p>
                        <span className="text-xs font-bold text-blue-600 mt-2 block">Received submissions</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div 
                      onClick={() => setActiveTab('applications')}
                      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
                    >
                      <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider mb-2">Candidate Review</h3>
                      <p className="text-3xl font-black text-slate-900">Verify Applications</p>
                      <span className="text-xs font-bold text-emerald-600 mt-2 block">Click to view & forward →</span>
                    </div>

                    <div 
                      onClick={() => setActiveTab('job-approvals')}
                      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
                    >
                      <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider mb-2">Pending Jobs</h3>
                      <p className="text-3xl font-black text-slate-900">{dashboardData?.pending_tasks || 0}</p>
                      <span className="text-xs font-bold text-blue-600 mt-2 block">Review pending jobs →</span>
                    </div>

                    <div 
                      onClick={() => setActiveTab('received-applications')}
                      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
                    >
                      <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider mb-2">My Posted Jobs</h3>
                      <p className="text-3xl font-black text-slate-900">Applications</p>
                      <span className="text-xs font-bold text-emerald-600 mt-2 block">View received applications →</span>
                    </div>

                    <div 
                      onClick={() => setActiveTab('categories')}
                      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
                    >
                      <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider mb-2">Categories</h3>
                      <p className="text-3xl font-black text-slate-900">Configure</p>
                      <span className="text-xs font-bold text-slate-500 mt-2 block">Add or edit categories →</span>
                    </div>

                    {/* Audit Log page-ilekku pokunna quick action card */}
                    <Link 
                      to="/staff/audit-logs"
                      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all"
                    >
                      <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider mb-2">Moderation Audit Log</h3>
                      <p className="text-3xl font-black text-slate-900">History</p>
                      <span className="text-xs font-bold text-blue-600 mt-2 block">Browse all moderation actions →</span>
                    </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'applications' && <StaffApplicationApprovals />}
              {activeTab === 'job-approvals' && <StaffJobApprovals />}
              {activeTab === 'received-applications' && <StaffReceivedApplications />}
              {activeTab === 'categories' && <ManageCategories />}
            </>
          )}

        </div>
      </main>

      {/* Post Job Modal */}
      <PostJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onJobPosted={fetchStaffData} 
        portalLabel="Staff Portal"
      />
    </div>
  );
};

export default StaffDashboard;