import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      
      // Dashboard summary data mathram edukkunnu
      const res = await axios.get('http://127.0.0.1:8000/api/accounts/admin/dashboard-data/', config);
      setDashboardData(res.data);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  const pendingCount = dashboardData?.pending_jobs?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 font-premium flex overflow-hidden">
      
      {/* Admin Sidebar */}
      <aside className="w-72 bg-slate-950 text-white flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-white/10">
          <h2 className="text-3xl font-black tracking-tighter">Rainbow<span className="text-emerald-500">HR.</span></h2>
          <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1 block">Super Admin Dashboard</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          <Link to="/admin-dashboard" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all bg-emerald-500 text-slate-950 shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"></path></svg>
            Dashboard Overview
          </Link>
          
          {/* Route to separate Approvals page */}
          <Link to="/admin/approvals" className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold transition-all text-slate-400 hover:bg-white/5 hover:text-white">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Job Approvals
            </div>
            {pendingCount > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingCount}</span>}
          </Link>

          {/* Route to separate Staffs page */}
          <Link to="/admin/staffs" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-slate-400 hover:bg-white/5 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Manage Staffs
          </Link>
          
           <Link to="/admin/employers" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-slate-400 hover:bg-white/5 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Companies / Employers
          </Link>
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full bg-white/5 hover:bg-red-500 text-slate-300 hover:text-white py-3.5 rounded-xl font-extrabold transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          <header className="mb-10 pb-6 border-b border-slate-200">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Overview</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">{dashboardData?.welcome_message || "Manage platform operations seamlessly."}</p>
          </header>

          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div onClick={() => navigate('/admin/approvals')} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-full blur-2xl -z-10 group-hover:bg-red-100 transition-colors"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Pending Approvals</h3>
                    <p className="text-4xl font-black text-slate-900 mt-2">{pendingCount}</p>
                  </div>
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                </div>
                <p className="text-xs font-bold text-blue-600 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">Review Now <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg></p>
              </div>

              <div onClick={() => navigate('/admin/staffs')} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl -z-10 group-hover:bg-blue-100 transition-colors"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Staffs</h3>
                    <p className="text-4xl font-black text-slate-900 mt-2">{dashboardData?.total_staffs || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </div>
                </div>
                <p className="text-xs font-bold text-blue-600 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">Manage Staffs <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg></p>
              </div>

              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -z-10"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Active Jobs</h3>
                    <p className="text-4xl font-black text-white mt-2">{dashboardData?.active_jobs || 0}</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                </div>
              </div>

              <div onClick={() => navigate('/admin/employers')} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full blur-2xl -z-10 group-hover:bg-purple-100 transition-colors"></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Total Companies</h3>
                    <p className="text-4xl font-black text-slate-900 mt-2">--</p> {/* Future feature */}
                  </div>
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  </div>
                </div>
                <p className="text-xs font-bold text-blue-600 mt-4 flex items-center gap-1 group-hover:gap-2 transition-all">View List <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg></p>
              </div>

            </div>

            {/* Recent Activities */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-extrabold text-slate-900">Recent Activities</h3>
              </div>
              <div className="space-y-4">
                {dashboardData?.recent_activities?.length > 0 ? dashboardData.recent_activities.map((act, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <p className="font-bold text-slate-700 text-sm">{act}</p>
                  </div>
                )) : (
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