import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Filter dropdown-il upayogikkunna motham moderation action keys
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

// Action prefix anusarich colour category theerumanikkunnu
const getColorCategory = (action = '') => {
  if (action === 'job_approve' || action === 'job_activate') return 'emerald';
  if (action === 'job_deactivate' || action === 'job_delete' || action === 'application_reject') return 'red';
  if (action === 'job_update' || action === 'category_update') return 'amber';
  if (action === 'application_approve') return 'blue';
  if (action === 'category_create' || action === 'staff_create') return 'indigo';
  if (action === 'employer_verify') return 'teal';
  return 'slate';
};

// Oroke colour category-ക്കും corresponding Tailwind classes
const COLOR_STYLES = {
  emerald: { icon: 'bg-emerald-100 text-emerald-600', badge: 'bg-emerald-50 text-emerald-700' },
  red: { icon: 'bg-red-100 text-red-600', badge: 'bg-red-50 text-red-700' },
  amber: { icon: 'bg-amber-100 text-amber-600', badge: 'bg-amber-50 text-amber-700' },
  blue: { icon: 'bg-blue-100 text-blue-600', badge: 'bg-blue-50 text-blue-700' },
  indigo: { icon: 'bg-indigo-100 text-indigo-600', badge: 'bg-indigo-50 text-indigo-700' },
  teal: { icon: 'bg-teal-100 text-teal-600', badge: 'bg-teal-50 text-teal-700' },
  slate: { icon: 'bg-slate-100 text-slate-600', badge: 'bg-slate-100 text-slate-700' },
};

// Oroke category-യുടെയും icon path
const ICON_PATHS = {
  emerald: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  red: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  amber: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  blue: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  indigo: 'M12 4v16m8-8H4',
  teal: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  slate: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
};

// Summary card-il upayogikkunna icon component
const StatCard = ({ title, value, color, iconPath, subtitle }) => {
  const styles = COLOR_STYLES[color] || COLOR_STYLES.slate;
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">{title}</h3>
          <p className="text-3xl font-black text-slate-900 mt-2">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styles.icon}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath}></path>
          </svg>
        </div>
      </div>
      {subtitle && <p className="text-xs font-bold text-slate-400 mt-4">{subtitle}</p>}
    </div>
  );
};

// Staff/Admin-ന്റെ motham moderation actions onnu vere kaanikkunna dedicated page
const ModerationAuditLog = () => {
  const role = localStorage.getItem('userRole');
  const isStaff = role === 'staff';
  const dashboardLink = role === 'admin' ? '/admin-dashboard' : role === 'staff' ? '/staff-dashboard' : '/';

  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState('');

  const [actionFilter, setActionFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [mineOnly, setMineOnly] = useState(false);

  // Search input-il 350ms debounce kazhinjittu maathram backend-ilekku pokunnu
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filters maaranumbol server-side-il ninnum veendum fetch cheyyunnu
  useEffect(() => {
    fetchLogs();
  }, [actionFilter, search, mineOnly]);

  // Backend-il ninnum audit logs edukkunna function (filters server-side)
  const fetchLogs = async () => {
    setError('');
    // First load-il maathram full spinner; pinneed list visible-ayirikkum
    if (!hasLoaded) {
      setInitialLoading(true);
    } else {
      setFetching(true);
    }

    try {
      const token = localStorage.getItem('authToken');
      const params = { limit: 200 };
      if (actionFilter) params.action = actionFilter;
      if (search) params.search = search;
      if (mineOnly && isStaff) params.mine = 'true';

      const res = await axios.get('http://127.0.0.1:8000/api/accounts/moderation/audit-logs/', {
        headers: { 'Authorization': `Bearer ${token}` },
        params,
      });

      setLogs(Array.isArray(res.data?.logs) ? res.data.logs : []);
      setSummary(res.data?.summary || null);
    } catch (err) {
      console.error('Failed to load moderation audit logs', err);
      if (err.response?.status === 403) {
        setError("You don't have permission to view the audit log.");
      } else {
        setError('Failed to load the audit log. Please try again.');
      }
      setLogs([]);
    } finally {
      // First attempt kazhinjal pinneed full spinner venda
      setHasLoaded(true);
      setInitialLoading(false);
      setFetching(false);
    }
  };

  const filtersActive = Boolean(actionFilter || search || (mineOnly && isStaff));

  // Ellaa filters-um reset cheyyunnu
  const handleClearFilters = () => {
    setActionFilter('');
    setSearchInput('');
    setSearch('');
    setMineOnly(false);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-premium pt-28 md:pt-32 pb-16 px-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Page Header */}
        <div>
          <Link
            to={dashboardLink}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 uppercase tracking-wider mb-3"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Moderation Audit Log</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Every staff and admin moderation action, in one place.</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 text-red-600 border border-red-100 rounded-2xl p-4 text-sm font-bold">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Total Actions"
            value={summary?.total || 0}
            color="slate"
            iconPath={ICON_PATHS.slate}
            subtitle="All recorded actions"
          />
          <StatCard
            title="Job Approvals"
            value={summary?.job_approvals || 0}
            color="emerald"
            iconPath={ICON_PATHS.emerald}
            subtitle="Approved & activated jobs"
          />
          <StatCard
            title="Application Decisions"
            value={summary?.application_decisions || 0}
            color="blue"
            iconPath={ICON_PATHS.blue}
            subtitle="Approved & rejected"
          />
          <StatCard
            title="Job Visibility Changes"
            value={summary?.job_visibility_changes || 0}
            color="amber"
            iconPath={ICON_PATHS.amber}
            subtitle="Activated & deactivated"
          />
        </div>

        {/* Logs List Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full md:w-56 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-slate-400"
            >
              <option value="">All actions</option>
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>

            <div className="relative w-full md:flex-1">
              <svg className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"></path>
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by target, details or actor..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-slate-400"
              />
            </div>

            {/* 'Only my actions' toggle staff-inu maathram kaanikkunnu */}
            {isStaff && (
              <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={mineOnly}
                  onChange={(e) => setMineOnly(e.target.checked)}
                  className="w-4 h-4 accent-slate-900"
                />
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Only my actions</span>
              </label>
            )}

            <button
              onClick={fetchLogs}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all text-sm whitespace-nowrap"
            >
              Refresh
            </button>
          </div>

          {/* Result Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Showing {logs.length} {logs.length === 1 ? 'action' : 'actions'}
            </p>
          </div>

          {/* Empty State */}
          {!error && logs.length === 0 && (
            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center">
              <p className="text-slate-500 font-bold text-sm">No moderation actions recorded yet.</p>
              {filtersActive && (
                <>
                  <p className="text-slate-400 font-medium text-xs mt-2">Try clearing the filters to see all activity.</p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all text-sm"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          )}

          {/* Log Rows */}
          {logs.length > 0 && (
            <div className={`space-y-3 transition-opacity ${fetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              {logs.map((log) => {
                const color = getColorCategory(log.action);
                const styles = COLOR_STYLES[color];
                return (
                  <div key={log.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styles.icon}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={ICON_PATHS[color]}></path>
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase tracking-wider ${styles.badge}`}>
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

        </div>
      </div>
    </div>
  );
};

export default ModerationAuditLog;
