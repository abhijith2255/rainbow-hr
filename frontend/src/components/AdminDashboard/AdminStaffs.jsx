import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserPlus, Users, Mail, Loader2, X, RefreshCw, ShieldCheck, Inbox,
} from 'lucide-react';
import AdminPageShell from './AdminPageShell';

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" strokeWidth={2.5} />
    </div>
  );

  return (
    <AdminPageShell
      title="Staff Directory"
      subtitle="Manage team members and their platform access."
      actions={
        <>
          <button
            onClick={fetchStaffList}
            className="px-4 py-2.5 bg-white/5 border border-white/10 text-slate-200 font-bold text-xs rounded-xl hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg hover:bg-emerald-400 transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" strokeWidth={2.5} />
            Add New Staff
          </button>
        </>
      }
    >
      {/* Summary strip */}
      <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-8 flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Total Staff Members</h3>
          <p className="text-3xl font-black text-slate-900">{staffList.length}</p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.length > 0 ? staffList.map((staff, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-950 text-white rounded-2xl flex items-center justify-center font-black text-2xl uppercase shrink-0 shadow-lg">
              {staff.username.charAt(0)}
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-slate-900 text-lg truncate">{staff.username}</h4>
              <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={2.5} />
                {staff.email || 'No email provided'}
              </p>
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black uppercase tracking-wider rounded-lg">
                <ShieldCheck className="w-3 h-3" strokeWidth={3} />
                Staff Member
              </span>
            </div>
          </div>
        )) : (
          <div className="col-span-full p-14 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <Inbox className="w-9 h-9 text-slate-300 mx-auto mb-3" strokeWidth={2} />
            <p className="text-slate-500 font-bold text-sm">No staff members found. Add one to get started!</p>
          </div>
        )}
      </div>

      {/* Create Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900">Create Staff Account</h2>
                <p className="text-xs font-bold text-slate-500 mt-0.5">New team member will get staff portal access.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-full transition-colors shadow-sm">
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Username</label>
                <input type="text" name="username" required value={newStaff.username} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-bold" placeholder="e.g. jsmith" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                <input type="email" name="email" required value={newStaff.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-bold" placeholder="staff@rainbowhr.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Temporary Password</label>
                <input type="password" name="password" required value={newStaff.password} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 font-bold" placeholder="••••••••" />
              </div>

              <div className="flex gap-3 mt-6 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} /> : <UserPlus className="w-4 h-4" strokeWidth={2.5} />}
                  {isSaving ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminStaffs;