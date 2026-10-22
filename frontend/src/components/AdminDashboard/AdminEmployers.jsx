import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Building2, ShieldCheck, ShieldAlert, Briefcase, MapPin,
  Globe, Mail, RefreshCw, Loader2, UserCheck, Inbox,
} from 'lucide-react';
import AdminPageShell from './AdminPageShell';
import { CompanyLogo } from '../Home/categoryVisuals';

// Admin / Staff: പ്ലാറ്റ്ഫോമിലെ മുഴുവൻ എംപ്ലോയർമാരുടെയും ലിസ്റ്റ് + instant verification.
const AdminEmployers = () => {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState('');

  // തിരയലിന് 350ms debounce
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchEmployers();
  }, [search]);

  const fetchEmployers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://127.0.0.1:8000/api/accounts/admin/employers/', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: search ? { search } : {},
      });
      setEmployers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load employers.');
    } finally {
      setLoading(false);
    }
  };

  // ഒരു എംപ്ലോയറെ verify / unverify ചെയ്യുന്നു
  const handleToggleVerify = async (employer) => {
    const nextState = !employer.is_verified;
    if (!window.confirm(`${nextState ? 'Verify' : 'Remove verification for'} "${employer.company_name}"?`)) return;

    setProcessingId(employer.id);
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `http://127.0.0.1:8000/api/accounts/admin/employers/${employer.id}/verify/`,
        { verified: nextState },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setEmployers((prev) =>
        prev.map((e) => (e.id === employer.id ? { ...e, is_verified: res.data.is_verified } : e))
      );
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update verification status.');
    } finally {
      setProcessingId(null);
    }
  };

  const verifiedCount = employers.filter((e) => e.is_verified).length;
  const totalJobs = employers.reduce((sum, e) => sum + (e.total_jobs || 0), 0);

  const stats = [
    { label: 'Total Employers', value: employers.length, icon: Building2, tint: 'text-indigo-600 bg-indigo-50' },
    { label: 'Verified', value: verifiedCount, icon: ShieldCheck, tint: 'text-emerald-600 bg-emerald-50' },
    { label: 'Awaiting Verification', value: employers.length - verifiedCount, icon: ShieldAlert, tint: 'text-amber-600 bg-amber-50' },
    { label: 'Total Job Posts', value: totalJobs, icon: Briefcase, tint: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <AdminPageShell
      title="Companies & Employers"
      subtitle="Every hiring company on the platform, with instant verification control."
      actions={
        <button
          onClick={fetchEmployers}
          className="px-4 py-2.5 bg-white/5 border border-white/10 text-slate-200 font-bold text-xs rounded-xl hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
          Refresh
        </button>
      }
    >
      {/* Stat strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
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

      {/* Search */}
      <div className="relative mb-6 max-w-xl">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by company, industry or email..."
          className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 shadow-sm"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-100 rounded-2xl p-4 text-sm font-bold mb-6">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-9 h-9 text-emerald-500 animate-spin" strokeWidth={2.5} />
        </div>
      ) : employers.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" strokeWidth={2} />
          <p className="text-slate-500 font-bold text-sm">No employers found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {employers.map((employer) => {
            const isWorking = processingId === employer.id;
            return (
              <div
                key={employer.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-100 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <CompanyLogo
                    logoUrl={employer.company_logo}
                    name={employer.company_name}
                    themeIndex={employer.id}
                    size="lg"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-black text-slate-900 truncate">{employer.company_name}</h3>
                        <p className="text-xs font-bold text-slate-500 mt-0.5 truncate">
                          {employer.industry || 'Industry not specified'}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-lg border font-black text-[10px] uppercase tracking-wider flex items-center gap-1 ${
                          employer.is_verified
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}
                      >
                        {employer.is_verified ? (
                          <><ShieldCheck className="w-3 h-3" strokeWidth={3} /> Verified</>
                        ) : (
                          <><ShieldAlert className="w-3 h-3" strokeWidth={3} /> Unverified</>
                        )}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {employer.company_location && (
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                          {employer.company_location}
                        </p>
                      )}
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={2.5} />
                        {employer.email || 'No email on record'}
                      </p>
                      {employer.company_website && (
                        <a
                          href={employer.company_website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1.5 truncate"
                        >
                          <Globe className="w-3.5 h-3.5 shrink-0" strokeWidth={2.5} />
                          {employer.company_website.replace(/^https?:\/\//, '')}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                      <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-black text-slate-600">
                        {employer.total_jobs} Jobs Posted
                      </span>
                      <span className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[11px] font-black text-emerald-700">
                        {employer.active_jobs} Live
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleToggleVerify(employer)}
                    disabled={isWorking}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 ${
                      employer.is_verified
                        ? 'bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {isWorking ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
                    ) : (
                      <UserCheck className="w-4 h-4" strokeWidth={2.5} />
                    )}
                    {employer.is_verified ? 'Remove Verification' : 'Verify Employer'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminEmployers;
