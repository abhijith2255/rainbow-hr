import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search, Users, ShieldCheck, ShieldAlert, FileText, MapPin,
  Mail, RefreshCw, Loader2, GraduationCap, Briefcase, Inbox, Sparkles,
} from 'lucide-react';
import AdminPageShell from './AdminPageShell';

// Skills TextField-ൽ നിന്ന് ആദ്യത്തെ കുറച്ച് skills മാത്രം chips ആയി കാണിക്കുന്നു.
const parseSkills = (skills) => {
  if (!skills) return [];
  return skills
    .split(/[,\n|]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
};

// Admin / Staff: രജിസ്റ്റർ ചെയ്ത എല്ലാ കാൻഡിഡേറ്റുകളുടെയും ലിസ്റ്റ്.
const AdminCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchCandidates();
  }, [search]);

  const fetchCandidates = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('https://rainbow-hr.onrender.com/api/accounts/admin/candidates/', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: search ? { search } : {},
      });
      setCandidates(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load candidates.');
    } finally {
      setLoading(false);
    }
  };

  const verifiedCount = candidates.filter((c) => c.is_verified).length;
  const totalApplications = candidates.reduce((sum, c) => sum + (c.total_applications || 0), 0);
  const experiencedCount = candidates.filter((c) => (c.experience_years || 0) > 0).length;

  const stats = [
    { label: 'Total Candidates', value: candidates.length, icon: Users, tint: 'text-amber-600 bg-amber-50' },
    { label: 'Verified Profiles', value: verifiedCount, icon: ShieldCheck, tint: 'text-emerald-600 bg-emerald-50' },
    { label: 'Experienced', value: experiencedCount, icon: Briefcase, tint: 'text-indigo-600 bg-indigo-50' },
    { label: 'Applications Sent', value: totalApplications, icon: FileText, tint: 'text-blue-600 bg-blue-50' },
  ];

  return (
    <AdminPageShell
      title="Candidates"
      subtitle="All registered job seekers, their profiles and application activity."
      actions={
        <button
          onClick={fetchCandidates}
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

      <div className="relative mb-6 max-w-xl">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name, designation, email or skill..."
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
      ) : candidates.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" strokeWidth={2} />
          <p className="text-slate-500 font-bold text-sm">No candidates found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {candidates.map((candidate) => {
            const skills = parseSkills(candidate.skills);
            const initial = (candidate.full_name || candidate.username || '?').charAt(0).toUpperCase();
            return (
              <div
                key={candidate.id}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-blue-100 transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar initials badge */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-lg">
                    {initial}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-black text-slate-900 truncate">{candidate.full_name}</h3>
                        <p className="text-xs font-bold text-slate-500 mt-0.5 truncate">
                          {candidate.designation || 'Designation not set'}
                        </p>
                      </div>
                      {candidate.is_verified && (
                        <span className="shrink-0 px-2.5 py-1 rounded-lg border font-black text-[10px] uppercase tracking-wider flex items-center gap-1 bg-emerald-50 text-emerald-700 border-emerald-100">
                          <ShieldCheck className="w-3 h-3" strokeWidth={3} /> Verified
                        </span>
                      )}
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {candidate.location && (
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" strokeWidth={2.5} />
                          {candidate.location}
                        </p>
                      )}
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={2.5} />
                        {candidate.email || 'No email on record'}
                      </p>
                      {candidate.education && (
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 truncate">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" strokeWidth={2.5} />
                          {candidate.education}
                        </p>
                      )}
                    </div>

                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {skills.map((skill, i) => (
                          <span
                            key={`${candidate.id}-${i}`}
                            className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-wide"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-[11px] font-black text-indigo-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
                    {candidate.experience_years || 0} yrs experience
                  </span>
                  <span className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-[11px] font-black text-blue-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" strokeWidth={2.5} />
                    {candidate.total_applications} applications
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminPageShell>
  );
};

export default AdminCandidates;
