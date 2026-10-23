import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Layers, CheckCircle2, Users, Building2, History,
  Briefcase, FileText, Clock, ArrowRight, Activity, ShieldCheck, LogOut,
  Menu, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Mobile-il sidebar drawer open/close control cheyyan
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const res = await axios.get('https://rainbow-hr.onrender.com/api/accounts/admin/dashboard-data/', config);
      setDashboardData(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const pendingCount = dashboardData?.pending_jobs?.length || 0;

  // Sidebar navigation (പ്രീമിയം ഡാർക്ക് തീം)
  const navItems = [
    { label: 'Dashboard Overview', to: '/admin-dashboard', icon: LayoutDashboard, active: true },
    { label: 'Manage Categories', to: '/admin/categories', icon: Layers },
    { label: 'Job Approvals', to: '/admin/approvals', icon: CheckCircle2, badge: pendingCount },
    { label: 'Companies / Employers', to: '/admin/employers', icon: Building2 },
    { label: 'Candidates', to: '/admin/candidates', icon: Users },
    { label: 'Applications', to: '/admin/applications', icon: FileText },
    { label: 'Manage Staffs', to: '/admin/staffs', icon: Users },
    { label: 'Staff Activity', to: '/admin/staff-activity', icon: Activity },
  ];

  // Clickable analytics summary cards — ഓരോന്നും ഒരു dedicated detail page-ലേക്ക് പോകുന്നു
  const analyticsCards = [
    {
      label: 'Active Employers', value: dashboardData?.total_employers || 0, sub: 'Hiring companies',
      icon: Building2, to: '/admin/employers',
      tint: 'bg-indigo-100 text-indigo-600', blob: 'bg-indigo-100', accent: 'text-indigo-600', ring: 'hover:border-indigo-200',
    },
    {
      label: 'Total Job Posts', value: dashboardData?.total_jobs || 0, sub: 'All postings',
      icon: Briefcase, to: '/admin/approvals',
      tint: 'bg-emerald-100 text-emerald-600', blob: 'bg-emerald-100', accent: 'text-emerald-600', ring: 'hover:border-emerald-200',
    },
    {
      label: 'Total Candidates', value: dashboardData?.total_candidates || 0, sub: 'Registered job seekers',
      icon: Users, to: '/admin/candidates',
      tint: 'bg-amber-100 text-amber-600', blob: 'bg-amber-100', accent: 'text-amber-600', ring: 'hover:border-amber-200',
    },
    {
      label: 'Total Applications', value: dashboardData?.total_applications || 0, sub: 'Received submissions',
      icon: FileText, to: '/admin/applications',
      tint: 'bg-blue-100 text-blue-600', blob: 'bg-blue-100', accent: 'text-blue-600', ring: 'hover:border-blue-200',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-premium">

      {/* Mobile top bar — sidebar drawer തുറക്കാനുള്ള hamburger */}
      <div className="lg:hidden sticky top-0 z-30 bg-slate-950 text-white px-4 py-3 flex items-center justify-between shadow-xl">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
          className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <h2 className="text-xl font-black tracking-tighter">Rainbow<span className="text-emerald-500">HR.</span></h2>
        <div className="w-10 h-10" />
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar — mobile-il drawer, desktop-il fixed */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-slate-950 text-white flex flex-col shadow-2xl transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 lg:p-8 border-b border-white/10 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black tracking-tighter">Rainbow<span className="text-emerald-500">HR.</span></h2>
            <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1 block">Super Admin Dashboard</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className="lg:hidden w-9 h-9 shrink-0 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to + item.label}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all ${
                  item.active
                    ? 'bg-emerald-500 text-slate-950 shadow-lg'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" strokeWidth={2.5} />
                  {item.label}
                </div>
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full bg-white/5 hover:bg-red-500 text-slate-300 hover:text-white py-3.5 rounded-xl font-extrabold transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-72">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">

          <header className="mb-8 lg:mb-10 pb-6 border-b border-slate-200 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Overview</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">
                {dashboardData?.welcome_message || 'Manage platform operations seamlessly.'}
              </p>
            </div>
            <Link
              to="/admin/audit-logs"
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all text-sm flex items-center gap-2"
            >
              <History className="w-4 h-4" strokeWidth={2.5} />
              Audit Log
            </Link>
          </header>

          <div className="space-y-8">
            {/* Clickable Analytics Summary Cards */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Platform Analytics</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {analyticsCards.map((card) => {
                  const Icon = card.icon;
                  return (
                    <Link
                      key={card.label}
                      to={card.to}
                      className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl hover:-translate-y-1 ${card.ring}`}
                    >
                      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity ${card.blob}`}></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">{card.label}</h3>
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

            {/* Operational Shortcuts */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Operations</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Pending Approvals → moderation queue */}
                <Link
                  to="/admin/approvals"
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-red-200 transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full blur-2xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Pending Approvals</h3>
                      <p className="text-4xl font-black text-slate-900 mt-2">{pendingCount}</p>
                    </div>
                    <div className="w-10 h-10 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                      <Clock className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs font-black text-red-600 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Review Now <ArrowRight className="w-3 h-3" strokeWidth={3} />
                  </p>
                </Link>

                {/* Manage Staffs */}
                <Link
                  to="/admin/staffs"
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Staffs</h3>
                      <p className="text-4xl font-black text-slate-900 mt-2">{dashboardData?.total_staffs || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Users className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs font-black text-blue-600 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Manage Staffs <ArrowRight className="w-3 h-3" strokeWidth={3} />
                  </p>
                </Link>

                {/* Active Jobs (highlight card) */}
                <Link
                  to="/admin/approvals"
                  className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -z-10 group-hover:bg-emerald-500/30 transition-colors"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Active Jobs</h3>
                      <p className="text-4xl font-black text-white mt-2">{dashboardData?.active_jobs || 0}</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center">
                      <Briefcase className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs font-black text-emerald-400 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Postings <ArrowRight className="w-3 h-3" strokeWidth={3} />
                  </p>
                </Link>

                {/* Staff Activity */}
                <Link
                  to="/admin/staff-activity"
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 transition-all relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-slate-100 rounded-full blur-2xl -z-10 group-hover:bg-slate-200 transition-colors"></div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Staff Activity</h3>
                      <p className="text-4xl font-black text-slate-900 mt-2">Log</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
                      <Activity className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs font-black text-slate-600 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Who Did What <ArrowRight className="w-3 h-3" strokeWidth={3} />
                  </p>
                </Link>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <History className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
                <h3 className="text-xl font-extrabold text-slate-900">Recent Activities</h3>
              </div>
              <div className="space-y-4">
                {dashboardData?.recent_activities?.length > 0 ? (
                  dashboardData.recent_activities.map((act, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <p className="font-bold text-slate-700 text-sm">{act}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 font-bold">No recent activities found.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
