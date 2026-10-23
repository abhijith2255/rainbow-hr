import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ChevronDown,
  UserRound,
  LayoutDashboard,
  LogOut,
  Briefcase,
  Sparkles,
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

  const {
    isLoggedIn,
    userRole,
    userName,
    profilePic,
    logout,
    dashboardLink,
    profileEditLink,
  } = useAuth();

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
      <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 pt-4 transition-all duration-500">
        <nav
          className={`max-w-7xl mx-auto rounded-[2rem] h-[4.5rem] flex items-center justify-between px-5 md:px-8 transition-all duration-500 ease-in-out ${
            scrolled
              ? 'bg-[#0b1120]/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)]'
              : 'bg-transparent border border-transparent'
          }`}
        >
          {/* ---------- Brand Logo ---------- */}
          <Link to="/" className="group flex items-center gap-3 shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 shadow-lg shadow-emerald-500/20 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[5deg]">
              <Sparkles className="w-5 h-5 text-slate-950" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-white transition-opacity duration-300">
              Rainbow
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                HR.
              </span>
            </span>
          </Link>

          {/* ---------- Desktop Links ---------- */}
          <div className="hidden lg:flex items-center gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="relative px-4 py-2 text-[14px] font-bold text-slate-300 hover:text-white transition-colors duration-300 group"
              >
                {link.label}
                {/* Modern subtle dot indicator on hover */}
                <span className="absolute left-1/2 -bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-0 transform -translate-x-1/2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"></span>
              </Link>
            ))}
          </div>

          {/* ---------- Desktop Actions ---------- */}
          <div className="hidden lg:flex items-center gap-4 relative">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-[14px] font-bold text-slate-300 hover:text-white transition-colors duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={handlePostJobClick}
                  className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white overflow-hidden shadow-lg shadow-white/10 hover:shadow-white/20 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Sweep effect on hover */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-teal-400 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                  
                  <Briefcase className="w-4 h-4 text-slate-900 group-hover:text-slate-950 relative z-10 transition-colors" strokeWidth={2.5} />
                  <span className="text-[14px] font-extrabold text-slate-900 group-hover:text-slate-950 relative z-10 transition-colors">
                    Post a Job
                  </span>
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                      {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-emerald-400 font-black text-sm">
                          {displayName.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-white text-[13px] font-bold leading-tight truncate max-w-[100px]">
                      {userName}
                    </p>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-0.5">
                      {userRole}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2.5}
                  />
                </button>

                {/* Modern Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-3xl bg-[#0f172a]/95 backdrop-blur-xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="px-6 py-5 border-b border-white/10 bg-white/5">
                      <p className="text-white font-bold text-sm truncate">{userName}</p>
                      <p className="text-emerald-400 text-xs font-semibold capitalize mt-1">{userRole} Account</p>
                    </div>

                    <div className="p-3 space-y-1">
                      <Link
                        to={profileEditLink}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm rounded-2xl transition-colors"
                      >
                        <UserRound className="w-4 h-4" strokeWidth={2.5} />
                        My Profile
                      </Link>

                      <Link
                        to={dashboardLink}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm rounded-2xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" strokeWidth={2.5} />
                        Dashboard
                      </Link>
                    </div>

                    <div className="p-3 border-t border-white/10">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 font-bold text-sm rounded-2xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" strokeWidth={2.5} />
                        Sign Out
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
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {/* ---------- Mobile Drawer ---------- */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
          }`}
        >
          <div className="max-w-7xl mx-auto rounded-3xl bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 p-5 shadow-2xl">
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-3.5 rounded-2xl text-slate-300 font-bold text-sm hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="h-px bg-white/10 my-4"></div>

            {!isLoggedIn ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }}
                  className="w-full py-3.5 rounded-2xl text-white font-bold text-sm bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsOpen(false); handlePostJobClick(); }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-slate-950 font-extrabold text-sm bg-white hover:bg-emerald-400 transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  Post a Job
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to={profileEditLink}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/5 text-white font-bold text-sm"
                >
                  <UserRound className="w-4 h-4" />
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-rose-500/10 text-rose-400 font-bold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
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