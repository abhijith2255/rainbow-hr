import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, FileText, Clock, CheckCircle2, XCircle, Filter,
  RefreshCw, Loader2, Mail, Phone, MapPin, Download, Inbox, Layers,
} from 'lucide-react';
import AdminPageShell from './AdminPageShell';

const TABS = [
  { key: 'All', label: 'All' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Approved', label: 'Approved' },
  { key: 'Rejected', label: 'Rejected' },
];

// അപേക്ഷയുടെ നില അനുസരിച്ച് പ്രീമിയം ബാഡ്ജ്
const getStatusBadge = (status) => {
  if (status === 'Approved') {
    return { label: 'Forwarded', className: 'bg-emerald-50 text-emerald-700 border-emerald-100', Icon: CheckCircle2 };
  }
  if (status === 'Rejected') {
    return { label: 'Rejected', className: 'bg-red-50 text-red-700 border-red-100', Icon: XCircle };
  }
  return { label: 'Pending', className: 'bg-amber-50 text-amber-700 border-amber-100', Icon: Clock };
};

// Admin / Staff: പ്ലാറ്റ്ഫോമിലേക്ക് വന്ന എല്ലാ അപേക്ഷകളും + instant approve / reject.
const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, search]);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (search) params.search = search;

      const res = await axios.get('https://rainbow-hr.onrender.com/api/jobs/staff/applications/', {
        headers: { 'Authorization': `Bearer ${token}` },
        params,
      });
      setApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  // ഒരു അപേക്ഷ approve / reject ചെയ്യുന്നു
  const handleDecision = async (application, action) => {
    const verb = action === 'approve' ? 'approve and forward' : 'reject';
    if (!window.confirm(`Are you sure you want to ${verb} ${application.full_name}'s application?`)) return;

    setProcessingId(application.id);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        `https://rainbow-hr.onrender.com/api/jobs/staff/applications/${application.id}/verify/`,
        { action },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      await fetchApplications();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update the application.');
    } finally {
      setProcessingId(null);
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'Pending').length;
  const approvedCount = applications.filter((a) => a.status === 'Approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: FileText, tint: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Review', value: pendingCount, icon: Clock, tint: 'text-amber-600 bg-amber-50' },
    { label: 'Forwarded', value: approvedCount, icon: CheckCircle2, tint: 'text-emerald-600 bg-emerald-50' },
    { label: 'Rejected', value: rejectedCount, icon: XCircle, tint: 'text-red-600 bg-red-50' },
  ];

  return (
    <AdminPageShell
      title="Applications"
      subtitle="Every candidate submission across the platform, with instant moderation."
      actions={
        <button
          onClick={fetchApplications}
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

      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
        {/* Status tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                statusFilter === tab.key
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" strokeWidth={2.5} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 lg:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by candidate, email, job or company..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-2xl p-4 text-sm font-bold mb-6">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-9 h-9 text-emerald-500 animate-spin" strokeWidth={2.5} />
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" strokeWidth={2} />
          <p className="text-slate-500 font-bold text-sm">No applications found in this section.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const badge = getStatusBadge(application.status);
            const isWorking = processingId === application.id;
            return (
              <div
                key={application.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all flex flex-col lg:flex-row justify-between gap-5"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-xl border font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 ${badge.className}`}>
                      <badge.Icon className="w-3 h-3" strokeWidth={3} />
                      {badge.label}
                    </span>
                    {application.pipeline_stage && (
                      <span className="px-3 py-1 rounded-xl border border-slate-100 bg-slate-50 font-black text-[10px] uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                        <Layers className="w-3 h-3" strokeWidth={3} />
                        {application.pipeline_stage}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-slate-900">{application.full_name}</h3>
                  <p className="text-sm font-bold text-slate-600 mt-0.5">
                    applied for <span className="text-blue-600">{application.job_title}</span>
                    <span className="text-slate-400"> at {application.company_name}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                      {application.email}
                    </span>
                    {application.phone && (
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                        {application.phone}
                      </span>
                    )}
                    {application.location && (
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                        {application.location}
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-400">
                      {new Date(application.applied_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:justify-end shrink-0">
                  {application.resume && (
                    <a
                      href={application.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" strokeWidth={2.5} />
                      Resume
                    </a>
                  )}
                  {application.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => handleDecision(application, 'reject')}
                        disabled={isWorking}
                        className="px-4 py-2.5 bg-red-50 border border-red-200 text-red-600 font-black text-xs rounded-xl hover:bg-red-100 transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" strokeWidth={2.5} />
                        Reject
                      </button>
                      <button
                        onClick={() => handleDecision(application, 'approve')}
                        disabled={isWorking}
                        className="px-4 py-2.5 bg-emerald-600 text-white font-black text-xs rounded-xl hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50 flex items-center gap-2"
                      >
                        {isWorking ? (
                          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                        )}
                        Approve &amp; Forward
                      </button>
                    </>
                  ) : (
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider px-2">Reviewed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminApplications;
