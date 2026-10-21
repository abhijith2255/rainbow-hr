import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from '../pages/login'; 

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // User States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState(null); // പ്രൊഫൈൽ ഫോട്ടോ കാണിക്കാൻ

  // സ്ക്രോൾ ചെയ്യുമ്പോൾ ബാക്ക്ഗ്രൗണ്ട് മാറ്റാൻ
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ലോഗിൻ സ്റ്റാറ്റസും യൂസർ വിവരങ്ങളും ചെക്ക് ചെയ്യാൻ
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');

      if (token && role) {
        setIsLoggedIn(true);
        setUserRole(role);
        
        try {
          // പുതിയ profile API വിളിക്കുന്നു
          const res = await axios.get('http://127.0.0.1:8000/api/profile/', { 
            headers: { 'Authorization': `Bearer ${token}` } 
          });
          
          setUserName(res.data.fullName || res.data.companyName || res.data.username || 'User');
          
          // ഫോട്ടോ ഉണ്ടെങ്കിൽ അത് സെറ്റ് ചെയ്യുന്നു
          const pic = res.data.profilePicture || res.data.companyLogo;
          if (pic) {
            setProfilePic(pic.startsWith('http') ? pic : `http://127.0.0.1:8000${pic}`);
          }
          
        } catch (err) {
          console.error("Failed to fetch user data", err);
          if (err.response?.status === 401) handleLogout();
        }
      }
    };

    checkLoginStatus();
  }, [isLoginModalOpen]); // ലോഗിൻ മോഡൽ ക്ലോസ് ആകുമ്പോഴും ഇത് റൺ ആകും

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
    setProfilePic(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (userRole === 'admin') return '/admin-dashboard';
    if (userRole === 'staff') return '/staff-dashboard';
    if (userRole === 'employer') return '/employer-dashboard';
    return '/candidate-dashboard';
  };

  const getProfileEditLink = () => {
    if (userRole === 'employer') return '/employer-profile-edit';
    return '/candidate-profile-edit'; // ഡീഫോൾട്ട് ആയി കാൻഡിഡേറ്റ് പ്രൊഫൈലിലേക്ക്
  };

  return (
    <>
      <nav className="fixed w-full z-50 top-4 px-4 md:px-8">
        <div className={`max-w-7xl mx-auto rounded-2xl h-16 md:h-20 flex items-center justify-between px-6 md:px-8 shadow-2xl transition-all duration-300 ${
          scrolled 
            ? 'bg-slate-950/90 backdrop-blur-xl border border-white/10' 
            : 'bg-slate-900/40 backdrop-blur-md border border-white/15'
        }`}>
          
          <div className="text-2xl md:text-3xl font-extrabold tracking-tighter text-white">
            <Link to="/">Rainbow<span className="text-emerald-400">HR.</span></Link>
          </div>
          
          <div className="hidden lg:flex space-x-8 text-sm font-bold text-slate-300">
            <Link to="/" className="hover:text-emerald-400 transition-colors">Find Jobs</Link>
            <Link to="/" className="hover:text-emerald-400 transition-colors">Top Companies</Link>
            <Link to="/" className="hover:text-emerald-400 transition-colors">For Employers</Link>
            <Link to="/" className="hover:text-emerald-400 transition-colors">Contact</Link>
          </div>

          <div className="hidden lg:flex space-x-5 items-center relative">
            {!isLoggedIn ? (
              <>
                <button onClick={() => setIsLoginModalOpen(true)} className="text-slate-300 text-sm font-bold hover:text-white transition-colors cursor-pointer">
                  Sign In
                </button>
                <button className="bg-emerald-500 text-slate-950 px-6 py-2.5 rounded-xl text-sm font-extrabold shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:bg-emerald-400 transition-all cursor-pointer">
                  Post a Job
                </button>
              </>
            ) : (
              <div className="relative">
                {/* User Avatar Button */}
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 bg-white/10 border border-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm overflow-hidden">
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      userName ? userName.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-white text-sm font-bold leading-none">{userName}</p>
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-wider mt-0.5">{userRole}</p>
                  </div>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {/* Dropdown Menu (ഇവിടെയാണ് My Profile വരുന്നത്) */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden animate-fade-in py-2">
                    
                    <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-slate-900 font-bold text-sm truncate">{userName}</p>
                      <p className="text-slate-500 text-xs font-semibold capitalize">{userRole} Account</p>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      {/* My Profile Link */}
                      <Link 
                        to={getProfileEditLink()}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 font-bold text-sm rounded-xl transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        My Profile
                      </Link>

                      {/* Dashboard Link */}
                      <Link 
                        to={getDashboardLink()}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 font-bold text-sm rounded-xl transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        Go to Dashboard
                      </Link>
                    </div>
                    
                    <div className="p-2 border-t border-slate-100">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 font-bold text-sm rounded-xl transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden focus:outline-none p-2 rounded-xl text-white bg-white/10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden mt-3 bg-slate-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col space-y-4 text-center">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-300 font-bold hover:text-emerald-400">Find Jobs</Link>
            <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-300 font-bold hover:text-emerald-400">Top Companies</Link>
            <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-300 font-bold hover:text-emerald-400">For Employers</Link>
            <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-300 font-bold hover:text-emerald-400">Contact</Link>
            <hr className="border-white/10 my-1"/>
            
            {!isLoggedIn ? (
              <>
                <button onClick={() => { setIsOpen(false); setIsLoginModalOpen(true); }} className="text-white font-bold py-2 cursor-pointer">Sign In</button>
                <button className="bg-emerald-500 text-slate-950 py-3 rounded-xl font-extrabold shadow-lg cursor-pointer">Post a Job</button>
              </>
            ) : (
              <>
                <div className="py-2 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center gap-3">
                   {profilePic && <img src={profilePic} alt="Profile" className="w-8 h-8 rounded-full object-cover" />}
                   <div>
                     <p className="text-white font-bold leading-none">{userName}</p>
                     <p className="text-emerald-400 text-[10px] font-black uppercase tracking-wider mt-1">{userRole}</p>
                   </div>
                </div>
                {/* Mobile Menu: My Profile */}
                <Link to={getProfileEditLink()} onClick={() => setIsOpen(false)} className="bg-white/5 text-white py-3 rounded-xl font-bold border border-white/10 block">
                  My Profile
                </Link>
                {/* Mobile Menu: Dashboard */}
                <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="bg-white/10 text-white py-3 rounded-xl font-bold border border-white/10 block">
                  Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="bg-red-500/10 text-red-500 py-3 rounded-xl font-bold border border-red-500/20 w-full">
                  Sign Out
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <Login isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLoginSuccess={() => window.location.reload()} />
    </>
  );
};

export default Navbar;