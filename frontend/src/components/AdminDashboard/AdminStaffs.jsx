import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminStaffs = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ username: '', email: '', password: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchStaffList();
  }, []);

  const fetchStaffList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://127.0.0.1:8000/api/accounts/admin/staff-list/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStaffList(res.data);
    } catch (error) {
      console.error("Error fetching staffs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewStaff({ ...newStaff, [e.target.name]: e.target.value });
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://127.0.0.1:8000/api/accounts/admin/create-staff/', newStaff, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert("New Staff Account Created Successfully!");
      setIsModalOpen(false);
      setNewStaff({ username: '', email: '', password: '' }); // Reset form
      fetchStaffList(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.error || "Failed to create staff. Username might already exist.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-white flex flex-col shadow-2xl z-20 hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-black tracking-tighter">Rainbow<span className="text-emerald-500">HR.</span></h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <Link to="/admin-dashboard" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            Dashboard
          </Link>
          <Link to="/admin/approvals" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            Job Approvals
          </Link>
          <Link to="/admin/staffs" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold bg-emerald-500 text-slate-950 shadow-lg">
            Manage Staffs
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Staff Directory</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Manage team members and their access.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-lg transition-all flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            Add New Staff
          </button>
        </header>

        {/* Staff Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffList.length > 0 ? staffList.map((staff, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-black text-2xl uppercase border-2 border-blue-100">
                {staff.username.charAt(0)}
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-lg">{staff.username}</h4>
                <p className="text-sm font-bold text-slate-500">{staff.email || 'No email provided'}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded">Staff Member</span>
              </div>
            </div>
          )) : (
            <div className="col-span-full p-10 bg-white rounded-3xl border border-slate-100 text-center">
              <p className="text-slate-400 font-bold">No staff members found. Add one to get started!</p>
            </div>
          )}
        </div>
      </main>

      {/* Create Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">Create Staff Account</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username</label>
                <input type="text" name="username" required value={newStaff.username} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-bold" placeholder="e.g. jsmith" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                <input type="email" name="email" required value={newStaff.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-bold" placeholder="staff@rainbowhr.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Temporary Password</label>
                <input type="password" name="password" required value={newStaff.password} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-bold" placeholder="••••••••" />
              </div>
              
              <div className="flex gap-3 mt-6 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors">
                  {isSaving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default AdminStaffs;