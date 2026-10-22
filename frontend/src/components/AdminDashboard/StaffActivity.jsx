import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Users, Activity, CheckCircle2, FileText, Search, RefreshCw, Loader2,
  History, ShieldCheck, Layers, XCircle, PencilLine, Plus, Filter, Inbox, X,
} from 'lucide-react';
import AdminPageShell from './AdminPageShell';

// Filter dropdown-ലെ എല്ലാ moderation action keys
const ACTION_OPTIONS = [
  { key: 'job_approve', label: 'Job Approved' },
  { key: 'job_update', label: 'Job Updated' },
  { key: 'job_delete', label: 'Job Deleted' },
  { key: 'job_activate', label: 'Job Activated' },
  { key: 'job_deactivate', label: 'Job Deactivated' },
  { key: 'application_approve', label: 'Application Approved' },
  { key: 'application_reject', label: 'Application Rejected' },
  { key: 'employer_verify', label: 'Employer Verified' },
  { key: 'category_create', label: 'Category Created' },
  { key: 'category_update', label: 'Category Updated' },
  { key: 'category_delete', label: 'Category Deleted' },
  { key: 'staff_create', label: 'Staff Account Created' },
];

// Action അനുസരിച്ച് നിറവും Lucide ഐക്കണും തിരഞ്ഞെടുക്കുന്നു
const getActionVisual = (action = '') => {
  if (action === 'job_approve' || action === 'job_activate') {
    return { Icon: CheckCircle2, icon: 'bg-emerald-100 text-emerald-600', badge: 'bg-emerald-50 text-emerald-700' };
  }
  if (action === 'job_deactivate' || action === 'job_delete' || action === 'application_reject') {
    return { Icon: XCircle, icon: 'bg-red-100 text-red-600', badge: 'bg-red-50 text-red-700' };
  }
  if (action === 'job_update' || action === 'category_update') {
    return { Icon: PencilLine, icon: 'bg-amber-100 text-amber-600', badge: 'bg-amber-50 text-amber-700' };
  }
  if (action === 'application_approve') {
    return { Icon: CheckCircle2, icon: 'bg-blue-100 text-blue-600', badge: 'bg-blue-50 text-blue-700' };
  }
  if (action === 'category_create' || action === 'staff_create') {
    return { Icon: Plus, icon: 'bg-indigo-100 text-indigo-600', badge: 'bg-indigo-50 text-indigo-700' };
  }
  if (action === 'employer_verify') {
    return { Icon: ShieldCheck, icon: 'bg-teal-100 text-teal-600', badge: 'bg-teal-50 text-teal-700' };
  }
  return { Icon: Layers, icon: 'bg-slate-100 text-slate-600', badge: 'bg-slate-100 text-slate-700' };
};

// Admin: ഓരോ staff-ന്റെയും moderation activity + മുഴുവൻ action history.
const StaffActivity = () => {
  const [staffSummary, setStaffSummary] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const [actorFilter, setActorFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchActivity();
  }, [actorFilter, actionFilter, search]);

  const fetchActivity = async () => {
    setLoading(true);
    setFetching(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const params = { limit: 200 };
      if (actorFilter) params.actor = actorFilter;
      if (actionFilter) params.action = actionFilter;
      if (search) params.search = search;

      const res = await axios.get('http://127.0.0.1:8000/api/accounts/staff-activity/', {
        headers: { 'Authorization': `Bearer ${token}` },
        params,
      });
      setStaffSummary(Array.isArray(res.data?.staff_summary) ? res.data.staff_summary : []);
      setLogs(Array.isArray(res.data?.logs) ? res.data.logs : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load staff activity.');
      setLogs([]);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  const totalActions = staffSummary.reduce((sum, s) => sum + (s.total_actions || 0), 0);
  const totalJobApprovals = staffSummary.reduce((sum, s) => sum + (s.job_approvals || 0), 0);
  const totalApplicationDecisions = staffSummary.reduce((sum, s) => sum + (s.application_decisions || 0), 0);

  const stats = [
    { label: 'Team Members', value: staffSummary.length, icon: Users, tint: 'text-indigo-600 bg-indigo-50' },
    { label: 'Total Actions', value: totalActions, icon: Activity, tint: 'text-slate-600 bg-slate-100' },
    { label: 'Job Approvals', value: totalJobApprovals, icon: CheckCircle2, tint: 'text-emerald-600 bg-emerald-50' },
    { label: 'Application Decisions', value: totalApplicationDecisions, icon: FileText, tint: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <AdminPageShell
      title="Staff Activity & Audit Log"
      subtitle="Who did what, when — full moderation history across the team."
      actions={
        <button
          onClick={fetchActivity}
          className="px-4 py-2.5 bg-white/5 border border-white/10 text-slate-200 font-bold text-xs rounded-xl hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
          Refresh
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">{s.label}</h3>
                <p className="text-3xl font-black text-slate-900 mt-1.5">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${s.tint}`}>
                <s.icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-2xl p-4 text-sm font-bold mb-6">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-9 h-9 text-emerald-500 animate-spin" strokeWidth={2.5} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Per-staff activity breakdown */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Team Breakdown</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {staffSummary.map((member) => {
                const isSelected = actorFilter === member.username;
                return (
                  <button
                    key={member.id}
                    onClick={() => setActorFilter(isSelected ? '' : member.username)}
                    className={`text-left bg-white p-6 rounded-3xl border shadow-sm transition-all hover:shadow-lg ${
                      isSelected ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-100 hover:border-emerald-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center font-black text-lg shrink-0">
                          {member.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-base font-black text-slate-900 truncate">{member.username}</h3>
                          <p className="text-[11px] font-bold text-slate-400 truncate">{member.email || 'No email'}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 rounded-lg border font-black text-[10px] uppercase tracking-wider ${
                        member.role === 'admin'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {member.role}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-5">
                      <div className="text-center bg-slate-50 rounded-2xl py-2.5">
                        <p className="text-lg font-black text-slate-900">{member.total_actions}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Actions</p>
                      </div>
                      <div className="text-center bg-emerald-50 rounded-2xl py-2.5">
                        <p className="text-lg font-black text-emerald-700">{member.job_approvals}</p>
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Approvals</p>
                      </div>
                      <div className="text-center bg-blue-50 rounded-2xl py-2.5">
                        <p className="text-lg font-black text-blue-700">{member.application_decisions}</p>
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-wider">App Decisions</p>
                      </div>
                    </div>

                    <p className="text-[11px] font-bold text-slate-400 mt-4">
                      {member.last_active
                        ? `Last active ${new Date(member.last_active).toLocaleString()}`
                        : 'No recorded activity yet'}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Activity feed */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <History className="w-4 h-4 text-slate-400" strokeWidth={2.5} />
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Activity History</h2>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full lg:w-56 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500"
              >
                <option value="">All actions</option>
                {ACTION_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>

              <div className="relative w-full lg:flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search by target, details, job or staff..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              {actorFilter && (
                <button
                  onClick={() => setActorFilter('')}
                  className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-xs rounded-xl hover:bg-emerald-100 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  <Filter className="w-3.5 h-3.5" strokeWidth={2.5} />
                  {actorFilter}
                  <X className="w-3.5 h-3.5" strokeWidth={3} />
                </button>
              )}
            </div>

            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Showing {logs.length} {logs.length === 1 ? 'action' : 'actions'}
            </p>

            {logs.length === 0 ? (
              <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
                <Inbox className="w-9 h-9 text-slate-300 mx-auto mb-3" strokeWidth={2} />
                <p className="text-slate-500 font-bold text-sm">No staff activity recorded for this filter.</p>
              </div>
            ) : (
              <div className={`space-y-3 transition-opacity ${fetching ? 'opacity-60' : 'opacity-100'}`}>
                {logs.map((log) => {
                  const { Icon, icon, badge } = getActionVisual(log.action);
                  return (
                    <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${icon}`}>
                        <Icon className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider ${badge}`}>
                            {log.action_label}
                          </span>
                          <span className="text-xs font-bold text-slate-400">by {log.actor}</span>
                        </div>
                        {log.target_label && (
                          <p className="font-bold text-slate-800 text-sm mt-2">{log.target_label}</p>
                        )}
                        {log.details && (
                          <p className="text-slate-500 font-medium text-xs mt-1">{log.details}</p>
                        )}
                        <p className="text-[11px] font-bold text-slate-400 mt-2">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}
    </AdminPageShell>
  );
};

export default StaffActivity;
