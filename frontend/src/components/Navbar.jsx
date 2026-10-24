import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu, X, ChevronDown, UserRound, LayoutDashboard, LogOut, Briefcase, Sparkles,
} from 'lucide-react';
import Login from '../pages/login';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Find Jobs', to: '/jobs' },
  { label: 'Top Companies', to: '/#companies' },
  { label: 'For Employers', to: '/#for-employers' },
  { label: 'Contact', to: '/#contact' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isLoggedIn, userRole, userName, profilePic, logout, dashboardLink, profileEditLink } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsOpen(false);
    navigate('/');
  };

  const handlePostJobClick = () => {
    if (isLoggedIn) {
      navigate(userRole === 'employer' ? '/employer/jobs' : dashboardLink);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const displayName = userName || 'User';

  return (
    <>
      {/* Floating Header Wrapper */}
      <header className="fixed top-4 md:top-6 inset-x-0 z-50 px-4 sm:px-6 transition-all duration-500">
        <nav
          className={`max-w-6xl mx-auto rounded-full h-16 flex items-center justify-between px-4 sm:px-6 transition-all duration-500 ease-in-out ${
            scrolled
              ? 'bg-white/95 backdrop-blur-xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-200'
              : 'bg-white/70 backdrop-blur-md shadow-sm border border-white/60'
          }`}
        >
          {/* ---------- Brand Logo ---------- */}
          <Link to="/" className="group flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-md group-hover:bg-emerald-500 transition-colors duration-300">
              <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">
              Rainbow<span className="text-emerald-500">HR.</span>
            </span>
          </Link>

          {/* ---------- Desktop Links (Pill Style) ---------- */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="px-5 py-2 text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-full transition-all duration-300 hover:shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ---------- Desktop Actions ---------- */}
          <div className="hidden lg:flex items-center gap-3 relative">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-sm font-bold text-slate-600 hover:text-emerald-600 px-4 py-2 transition-colors duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={handlePostJobClick}
                  className="group flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-emerald-600 shadow-md hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Briefcase className="w-4 h-4 text-white transition-colors" strokeWidth={2.5} />
                  <span className="text-sm font-extrabold text-white transition-colors">
                    Post a Job
                  </span>
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-300 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-emerald-500 font-black text-sm">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-slate-900 text-[13px] font-bold leading-tight truncate max-w-[100px]">
                      {userName}
                    </p>
                    <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-0.5">
                      {userRole}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2.5}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 rounded-[1.5rem] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-slate-900 font-bold text-sm truncate">{userName}</p>
                      <p className="text-emerald-600 text-[10px] font-black uppercase tracking-widest mt-1">{userRole} Account</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link
                        to={profileEditLink}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 font-bold text-sm rounded-xl transition-colors"
                      >
                        <UserRound className="w-4 h-4" strokeWidth={2.5} /> My Profile
                      </Link>
                      <Link
                        to={dashboardLink}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 font-bold text-sm rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" strokeWidth={2.5} /> Dashboard
                      </Link>
                    </div>
                    <div className="p-2 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-500 hover:bg-rose-50 font-bold text-sm rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={2.5} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------- Mobile Menu Toggle ---------- */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* ---------- Mobile Drawer ---------- */}
        <div
          className={`lg:hidden max-w-6xl mx-auto overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
          }`}
        >
          <div className="rounded-[2rem] bg-white/95 backdrop-blur-xl border border-slate-200 p-5 shadow-2xl">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-3.5 rounded-xl text-slate-600 font-bold text-sm hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="h-px bg-slate-100 my-4"></div>
            {!isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }}
                  className="w-full py-3.5 rounded-xl text-slate-900 font-bold text-sm bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsOpen(false); handlePostJobClick(); }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-extrabold text-sm bg-slate-900 hover:bg-emerald-600 transition-colors shadow-md"
                >
                  <Briefcase className="w-4 h-4" /> Post a Job
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to={profileEditLink}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-slate-50 text-slate-700 font-bold text-sm"
                >
                  <UserRound className="w-4 h-4" /> My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-rose-50 text-rose-500 font-bold text-sm"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Login
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          const role = localStorage.getItem('userRole');
          if (role === 'employer') navigate('/employer-dashboard');
          else if (role === 'candidate') navigate('/candidate-dashboard');
          else if (role === 'staff') navigate('/staff-dashboard');
          else if (role === 'admin') navigate('/admin-dashboard');
          else navigate('/');
        }}
      />
    </>
  );
};

export default Navbar;