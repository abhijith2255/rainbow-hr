import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostJobModal from '../EmployerDashboard/PostJobModal';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://127.0.0.1:8000/api/staff/dashboard-data/', {
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-premium flex overflow-hidden">
      
      {/* Staff Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm relative z-20">
        <div className="p-8">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900">
            Rainbow<span className="text-emerald-500">HR.</span>
          </h2>
          <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1 block bg-blue-50 w-max px-2 py-1 rounded">Staff Portal</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="#" className="flex items-center gap-3 bg-blue-50 text-blue-700 px-4 py-3.5 rounded-xl font-extrabold border border-blue-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            My Workspace
          </a>
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
              <header className="flex justify-between items-end mb-12">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    {dashboardData?.welcome_message || "My Workspace"}
                  </h1>
                  <p className="text-slate-500 font-medium mt-1">Manage your assigned tasks and applications here.</p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Post a Job Button for Staff */}
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                    Post a Job
                  </button>
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full shadow-sm flex items-center justify-center font-black text-xl">
                    S
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
                  <h3 className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wider">Pending Tasks</h3>
                  <p className="text-4xl font-black text-slate-900">{dashboardData?.pending_tasks || 0}</p>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      {/* Post Job Modal */}
      <PostJobModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onJobPosted={fetchStaffData} 
      />
    </div>
  );
};

export default StaffDashboard;