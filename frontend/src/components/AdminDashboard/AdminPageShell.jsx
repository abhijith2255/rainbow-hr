import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

// Admin / Staff detail pages-ന് ഒരേ പോലെയുള്ള പ്രീമിയം ടോപ്പ് ബാർ.
// Role അനുസരിച്ച് "Back to Dashboard" ശരിയായ ഡാഷ്ബോർഡിലേക്ക് പോകുന്നു.
const ROLE_LINKS = {
  admin: { dashboard: '/admin-dashboard', label: 'Admin Dashboard' },
  staff: { dashboard: '/staff-dashboard', label: 'Staff Dashboard' },
};

const AdminPageShell = ({ title, subtitle, actions, children }) => {
  const role = localStorage.getItem('userRole');
  const { dashboard, label } = ROLE_LINKS[role] || { dashboard: '/', label: 'Home' };

  return (
    <div className="min-h-screen bg-slate-50 font-premium">
      {/* Sticky premium header — mobile-il stack aakunnu */}
      <header className="sticky top-0 z-30 bg-slate-950 text-white shadow-2xl">
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link
              to={dashboard}
              title={`Back to ${label}`}
              className="w-10 h-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
            </Link>
            <div className="w-px h-9 bg-white/10 shrink-0"></div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400 shrink-0" strokeWidth={2.5} />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 truncate">{label}</span>
              </div>
              <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight truncate">{title}</h1>
              {subtitle && <p className="text-[11px] font-bold text-slate-400 truncate">{subtitle}</p>}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:justify-end">{actions}</div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
};

export default AdminPageShell;
