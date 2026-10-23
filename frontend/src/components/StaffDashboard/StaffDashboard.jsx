import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, FileText, CheckCircle2, Inbox, Layers, History,
  Building2, Briefcase, Users, ArrowRight, Plus, LogOut, Clock,
  Menu, X,
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('workspace'); // 'workspace', 'applications', 'job-approvals', 'received-applications', 'categories'
  // Mobile-il sidebar drawer open/close control cheyyan
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Tab maattumbol mobile drawer automatic aayi adakkunnu
  const handleTabChange = (key) => {
    setActiveTab(key);
    setSidebarOpen(false);
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('https://rainbow-hr.onrender.com/api/accounts/staff/dashboard-data/', {
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

  const tabTitles = {
    workspace: dashboardData?.welcome_message || 'My Workspace',
    applications: 'Candidate Applications',
    'job-approvals': 'Employer Job Approvals',
    'received-applications': 'Received Applications',
    categories: 'Manage Job Categories',
  };

  // Sidebar tabs (Lucide ഐക്കണുകളോടെ)
  const tabItems = [
    { key: 'workspace', label: 'My Workspace', icon: LayoutDashboard },
    { key: 'applications', label: 'Candidate Verify', icon: FileText, dot: true },
    { key: 'job-approvals', label: 'Job Approvals', icon: CheckCircle2 },
    { key: 'received-applications', label: 'Received Applications', icon: Inbox },
    { key: 'categories', label: 'Manage Categories', icon: Layers },
  ];

  // Clickable analytics cards — ഓരോന്നും ഒരു dedicated page / ടാബിലേക്ക് പോകുന്നു
  const analyticsCards = [
    {
      label: 'Active Employers', value: dashboardData?.total_employers || 0, sub: 'Hiring companies',
      icon: Building2, to: '/staff/employers',
      tint: 'bg-indigo-100 text-indigo-600', blob: 'bg-indigo-100', accent: 'text-indigo-600', ring: 'hover:border-indigo-200',
    },
    {
      label: 'Total Job Posts', value: dashboardData?.total_jobs || 0, sub: 'All postings',
      icon: Briefcase, to: '/staff/approvals',
      tint: 'bg-emerald-100 text-emerald-600', blob: 'bg-emerald-100', accent: 'text-emerald-600', ring: 'hover:border-emerald-200',
    },
    {
      label: 'Total Candidates', value: dashboardData?.total_candidates || 0, sub: 'Registered job seekers',
      icon: Users, to: '/staff/candidates',
      tint: 'bg-amber-100 text-amber-600', blob: 'bg-amber-100', accent: 'text-amber-600', ring: 'hover:border-amber-200',
    },
    {
      label: 'Total Applications', value: dashboardData?.total_applications || 0, sub: 'Received submissions',
      icon: FileText, to: '/staff/applications',
      tint: 'bg-blue-100 text-blue-600', blob: 'bg-blue-100', accent: 'text-blue-600', ring: 'hover:border-blue-200',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-premium">

      {/* Mobile top bar — sidebar drawer തുറക്കാനുള്ള hamburger */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
          className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <h2 className="text-xl font-black tracking-tighter text-slate-900">Rainbow<span className="text-emerald-500">HR.</span></h2>
        <div className="w-10 h-10" />
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Staff Sidebar — mobile-il drawer, desktop-il fixed */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col shadow-sm transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 lg:p-8 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900 cursor-pointer" onClick={() => navigate('/')}>
              Rainbow<span className="text-emerald-500">HR.</span>
            </h2>
            <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1 block bg-blue-50 w-max px-2.5 py-1 rounded-md">
              Staff Portal
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className="lg:hidden w-9 h-9 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-2 overflow-y-auto">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleTabChange(item.key)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-extrabold text-sm transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                  {item.label}
                </div>
                {item.dot && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
              </button>
            );
          })}

          {/* Audit Log page-ilekku pokunna sidebar link */}
          <Link
            to="/staff/audit-logs"
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-extrabold text-sm text-slate-600 hover:bg-slate-50 border border-transparent transition-all"
          >
            <History className="w-5 h-5" strokeWidth={2.5} />
            Audit Log
          </Link>
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 py-3.5 rounded-xl font-extrabold transition-colors flex items-center justify-center gap-2 shadow-sm">
            <LogOut className="w-5 h-5" strokeWidth={2.5} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-72">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">

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
              <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 gap-4">
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{tabTitles[activeTab]}</h1>
                  <p className="text-slate-500 font-medium text-xs mt-1">
                    Manage candidate verifications, company listings, and system tasks.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    to="/staff/audit-logs"
                    className="px-5 py-3 bg-white border border-slate-200 text-slate-700 font-black text-xs rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    <History className="w-4 h-4" strokeWidth={2.5} />
                    Audit Log
                  </Link>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" strokeWidth={3} />
                    Post a Job
                  </button>
                  <div className="hidden sm:flex w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-sm items-center justify-center font-black text-lg">
                    S
                  </div>
                </div>
              </header>

              {/* Dynamic View rendering based on activeTab */}
              {activeTab === 'workspace' && (
                <div className="space-y-8">
                  {/* Clickable Analytics Summary Cards */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <LayoutDashboard className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                      <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Platform Analytics</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                      {analyticsCards.map((card) => {
                        const Icon = card.icon;
                        return (
                          <Link
                            key={card.label}
                            to={card.to}
                            className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1 ${card.ring}`}
                          >
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity ${card.blob}`}></div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-slate-500 font-black text-xs uppercase tracking-wider">{card.label}</h3>
                                <p className="text-4xl font-black text-slate-900 mt-2">{card.value}</p>
                              </div>
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${card.tint}`}>
                                <Icon className="w-5 h-5" strokeWidth={2.5} />
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <p className="text-xs font-bold text-slate-400">{card.sub}</p>
                              <span className={`text-[11px] font-black flex items-center gap-1 ${card.accent} group-hover:gap-2 transition-all`}>
                                View <ArrowRight className="w-3 h-3" strokeWidth={3} />
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                      <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <button
                        onClick={() => setActiveTab('applications')}
                        className="text-left bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200 transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider">Candidate Review</h3>
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FileText className="w-4 h-4" strokeWidth={2.5} />
                          </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900 mt-3">Verify Applications</p>
                        <span className="text-xs font-black text-emerald-600 mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Open queue <ArrowRight className="w-3 h-3" strokeWidth={3} />
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveTab('job-approvals')}
                        className="text-left bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider">Pending Jobs</h3>
                          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Clock className="w-4 h-4" strokeWidth={2.5} />
                          </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900 mt-3">{dashboardData?.pending_tasks || 0}</p>
                        <span className="text-xs font-black text-amber-600 mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Review pending jobs <ArrowRight className="w-3 h-3" strokeWidth={3} />
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveTab('received-applications')}
                        className="text-left bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider">My Posted Jobs</h3>
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Inbox className="w-4 h-4" strokeWidth={2.5} />
                          </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900 mt-3">Applications</p>
                        <span className="text-xs font-black text-blue-600 mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
                          View received applications <ArrowRight className="w-3 h-3" strokeWidth={3} />
                        </span>
                      </button>

                      <button
                        onClick={() => setActiveTab('categories')}
                        className="text-left bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider">Categories</h3>
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                            <Layers className="w-4 h-4" strokeWidth={2.5} />
                          </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900 mt-3">Configure</p>
                        <span className="text-xs font-black text-slate-500 mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Add or edit categories <ArrowRight className="w-3 h-3" strokeWidth={3} />
                        </span>
                      </button>

                      <Link
                        to="/staff/applications"
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-indigo-200 transition-all group"
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-slate-400 font-black text-xs uppercase tracking-wider">All Applications</h3>
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <FileText className="w-4 h-4" strokeWidth={2.5} />
                          </div>
                        </div>
                        <p className="text-2xl font-black text-slate-900 mt-3">{dashboardData?.total_applications || 0}</p>
                        <span className="text-xs font-black text-indigo-600 mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Open full list <ArrowRight className="w-3 h-3" strokeWidth={3} />
                        </span>
                      </Link>

                      <Link
                        to="/staff/audit-logs"
                        className="bg-slate-900 p-6 rounded-[2rem] border border-slate-800 shadow-lg hover:-translate-y-1 hover:shadow-2xl transition-all group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/20 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/30 transition-colors"></div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-emerald-400 font-black text-xs uppercase tracking-wider">Moderation Audit Log</h3>
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <History className="w-4 h-4" strokeWidth={2.5} />
                          </div>
                        </div>
                        <p className="text-2xl font-black text-white mt-3">History</p>
                        <span className="text-xs font-black text-emerald-400 mt-2 flex items-center gap-1 group-hover:gap-2 transition-all">
                          Browse all moderation actions <ArrowRight className="w-3 h-3" strokeWidth={3} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'applications' && <StaffApplicationApprovals />}
              {activeTab === 'job-approvals' && <StaffJobApprovals />}
              {activeTab === 'received-applications' && <StaffReceivedApplications />}
              {/* embedded=true — StaffDashboard-inte sidebar thanne upayogikkunnathu kondu
                  ManageCategories swantham sidebar onnum render cheyyilla (double sidebar ozhivakkan) */}
              {activeTab === 'categories' && <ManageCategories embedded />}
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
