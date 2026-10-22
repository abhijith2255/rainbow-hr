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

  // Shared auth state - updates instantly on login / logout anywhere in the app.
  const {
    isLoggedIn,
    userRole,
    userName,
    profilePic,
    logout,
    dashboardLink,
    profileEditLink,
  } = useAuth();

  // Scroll effect — thazheottu scroll cheyyumbol navbar-inte tone maari
  // kooduthal opaque aakunnu (readability koottan).
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

  // "Post a Job" ബട്ടൺ ക്ലിക്ക് - ലോഗിൻ ചെയ്ത എംപ്ലോയർക്ക് ജോബ് പോസ്റ്റിംഗ് പേജിലേക്ക്
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
      {/* Premium glassmorphism navbar — semi-transparent + backdrop-blur */}
      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-5 md:px-8 pt-3 sm:pt-4">
        <nav
          className={`max-w-7xl mx-auto rounded-2xl h-16 md:h-[4.5rem] flex items-center justify-between px-4 sm:px-6 md:px-8 transition-all duration-500 ease-out ${
            scrolled
              ? 'bg-slate-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(2,6,23,0.9)]'
              : 'bg-slate-900/35 backdrop-blur-xl border border-white/15 shadow-[0_12px_40px_-24px_rgba(2,6,23,0.8)]'
          }`}
        >
          {/* ---------- Brand ---------- */}
          <Link to="/" className="group flex items-center gap-2.5 shrink-0">
            <span className="relative flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_10px_25px_-10px_rgba(16,185,129,0.85)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
              <Sparkles className="w-[18px] h-[18px] text-slate-950" strokeWidth={2.5} />
            </span>
            <span className="text-xl md:text-2xl font-extrabold tracking-tighter text-white">
              Rainbow<span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">HR.</span>
            </span>
          </Link>

          {/* ---------- Desktop links (animated underline) ---------- */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="group relative px-3.5 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors duration-300"
              >
                {link.label}
                {/* Hover-il left ninnu neengunna gradient underline */}
                <span className="pointer-events-none absolute left-3.5 right-3.5 -bottom-0.5 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-transform duration-300 group-hover:scale-x-100"></span>
              </Link>
            ))}
          </div>

          {/* ---------- Desktop CTA / Profile ---------- */}
          <div className="hidden lg:flex items-center gap-3 relative">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-4 py-2 text-sm font-bold text-slate-200 hover:text-white border border-white/10 hover:border-white/25 hover:bg-white/5 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={handlePostJobClick}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_10px_30px_-10px_rgba(16,185,129,0.7)] hover:shadow-[0_16px_38px_-10px_rgba(16,185,129,0.85)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" strokeWidth={2.5} />
                  Post a Job
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="group flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-extrabold text-sm shadow-md overflow-hidden ring-2 ring-white/10">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="text-left hidden sm:block">
                    <span className="block text-white text-[13px] font-bold leading-none truncate max-w-[9rem]">{userName}</span>
                    <span className="block text-emerald-400 text-[10px] font-black uppercase tracking-wider mt-0.5">{userRole}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    strokeWidth={2.5}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-white shadow-[0_25px_70px_-18px_rgba(2,6,23,0.45)] border border-slate-100 overflow-hidden animate-dropdown-pop">
                    <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                      <p className="text-slate-900 font-bold text-sm truncate">{userName}</p>
                      <p className="text-slate-500 text-xs font-semibold capitalize mt-0.5">{userRole} Account</p>
                    </div>

                    <div className="p-2 space-y-1">
                      <Link
                        to={profileEditLink}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 font-bold text-sm rounded-xl transition-colors"
                      >
                        <UserRound className="w-4 h-4" strokeWidth={2.5} />
                        My Profile
                      </Link>

                      <Link
                        to={dashboardLink}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 font-bold text-sm rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" strokeWidth={2.5} />
                        Go to Dashboard
                      </Link>
                    </div>

                    <div className="p-2 border-t border-slate-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 font-bold text-sm rounded-xl transition-colors cursor-pointer"
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

          {/* ---------- Mobile hamburger ---------- */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/15 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            {isOpen ? <X className="w-5 h-5" strokeWidth={2.5} /> : <Menu className="w-5 h-5" strokeWidth={2.5} />}
          </button>
        </nav>

        {/* ---------- Mobile drawer (cleanly animated) ---------- */}
        <div
          className={`lg:hidden grid transition-all duration-500 ease-out ${
            isOpen ? 'grid-rows-[1fr] opacity-100 mt-2.5' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            <div className="max-w-7xl mx-auto rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-[0_30px_70px_-25px_rgba(2,6,23,0.95)] p-3">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-200 font-bold text-sm hover:text-white hover:bg-white/5 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-white/10 my-3"></div>

              {!isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }}
                    className="w-full py-3 rounded-xl text-slate-200 font-bold text-sm border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setIsOpen(false); handlePostJobClick(); }}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-slate-950 font-extrabold text-sm bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_12px_30px_-12px_rgba(16,185,129,0.8)] active:scale-[0.98] transition-all duration-300 cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4" strokeWidth={2.5} />
                    Post a Job
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-extrabold text-sm overflow-hidden shrink-0">
                      {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : displayName.charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-white font-bold text-sm leading-none truncate">{userName}</span>
                      <span className="block text-emerald-400 text-[10px] font-black uppercase tracking-wider mt-1">{userRole}</span>
                    </span>
                  </div>

                  <Link
                    to={profileEditLink}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors"
                  >
                    <UserRound className="w-4 h-4" strokeWidth={2.5} />
                    My Profile
                  </Link>
                  <Link
                    to={dashboardLink}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" strokeWidth={2.5} />
                    Go to Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm border border-red-500/20 hover:bg-red-500/15 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={2.5} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Login
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          // ലോഗിൻ ചെയ്ത റോൾ അനുസരിച്ച് ശരിയായ ഡാഷ്ബോർഡിലേക്ക് മാറ്റുന്നു
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
