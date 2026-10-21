import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ isOpen, onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('login'); 
  const [selectedRole, setSelectedRole] = useState(''); 
  
  const [render, setRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  const [candidateData, setCandidateData] = useState({ fullName: '', designation: '', location: '' });
  const [employerData, setEmployerData] = useState({ companyName: '', hrName: '', industry: '' });

  const navigate = useNavigate();

  // 3D Flip Animation Control
  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setIsClosing(false);
      setView('login');
      setError('');
    } else if (render) {
      setIsClosing(true);
      setTimeout(() => setRender(false), 500); 
    }
  }, [isOpen]);

  if (!render) return null;

  // ലോഗിൻ സക്സസ് ആകുമ്പോൾ പേജ് റീഫ്രഷ് ചെയ്യാതെ തന്നെ നാബ്‌ബാർ അപ്ഡേറ്റ് ആകാൻ സഹായിക്കുന്നു
  const handleAuthSuccess = (token, role) => {
    localStorage.setItem('authToken', token);
    
    if (!role || role === 'unassigned') {
      setView('role-selection'); 
    } else {
      localStorage.setItem('userRole', role);
      onClose();
      
      // അഡ്മിനും സ്റ്റാഫും ആണെങ്കിൽ നേരിട്ട് ഡാഷ്ബോർഡിലേക്ക് പോകുന്നു
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'staff') {
        navigate('/staff-dashboard');
      } else {
        // കാൻഡിഡേറ്റും എംപ്ലോയറും ആണെങ്കിൽ പേജ് റീഫ്രഷ് ചെയ്യാതെ കോൾബാക്ക് വഴി നാബ്‌ബാർ മാറ്റുന്നു
        if (onLoginSuccess) onLoginSuccess(); 
      }
    }
  };

  const handleRegularLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/login/', { username, password });
      handleAuthSuccess(response.data.token, response.data.role);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setError('');
    setView(role === 'candidate' ? 'candidate-form' : 'employer-form');
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        role: selectedRole,
        profile_data: selectedRole === 'candidate' ? candidateData : employerData
      };
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/set-role/', payload, { headers: { 'Authorization': `Bearer ${token}` } });
      localStorage.setItem('userRole', response.data.role);
      onClose();
      if (onLoginSuccess) onLoginSuccess(); // പേജ് റീഫ്രഷ് ചെയ്യാതെ അപ്ഡേറ്റ് ചെയ്യുന്നു
    } catch (err) {
      setError('Failed to complete setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => alert('Connecting to Google...');
  const handlePhoneSubmit = (e) => { e.preventDefault(); alert('OTP sent!'); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-premium" style={{ perspective: '1500px' }}>
      
      {/* High-End Animations */}
      <style>{`
        @keyframes overlayIn { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(16px); } }
        @keyframes overlayOut { from { opacity: 1; backdrop-filter: blur(16px); } to { opacity: 0; backdrop-filter: blur(0px); } }
        
        @keyframes flipIn {
          0% { opacity: 0; transform: rotateY(-90deg) scale(0.9); }
          100% { opacity: 1; transform: rotateY(0deg) scale(1); }
        }
        @keyframes flipOut {
          0% { opacity: 1; transform: rotateY(0deg) scale(1); }
          100% { opacity: 0; transform: rotateY(90deg) scale(0.9); }
        }

        @keyframes contentFadeIn {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        .animate-overlay-in { animation: overlayIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-overlay-out { animation: overlayOut 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .animate-flip-in { animation: flipIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-style: preserve-3d; }
        .animate-flip-out { animation: flipOut 0.5s cubic-bezier(0.5, 0, 0, 1) forwards; transform-style: preserve-3d; }
        
        .animate-content { animation: contentFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      {/* Dark Premium Overlay */}
      <div 
        className={`absolute inset-0 bg-slate-950/70 cursor-pointer ${isClosing ? 'animate-overlay-out' : 'animate-overlay-in'}`} 
        onClick={onClose}
      ></div>

      {/* 3D Flipped Modal Card */}
      <div className={`relative z-10 w-full max-w-[420px] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-white/40 p-8 sm:p-10 ${isClosing ? 'animate-flip-out' : 'animate-flip-in'}`}>
        
        {/* Floating Close Button */}
        <button onClick={onClose} className="absolute top-5 right-5 p-2.5 bg-slate-50/50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-all duration-300 z-20 shadow-sm border border-slate-200/50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        {/* --- VIEW 1: PREMIUM LOGIN --- */}
        {view === 'login' && (
           <div className="animate-content">
             <div className="flex justify-center mb-6">
               <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-[0_10px_25px_rgba(16,185,129,0.4)] transform rotate-12">
                 <svg className="w-8 h-8 text-white transform -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
               </div>
             </div>
             
             <div className="text-center mb-8">
               <h2 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
                 Welcome <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">Back</span>
               </h2>
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Secure Premium Access</p>
             </div>
 
             {error && <div className="mb-5 p-3.5 bg-red-50/80 border border-red-100 text-red-600 text-xs text-center font-extrabold rounded-xl shadow-sm">{error}</div>}
 
             <form onSubmit={handleRegularLogin} className="space-y-4">
               <div>
                 <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                    placeholder="Enter Username" 
                    required 
                  />
               </div>
               <div>
                 <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" 
                    placeholder="Enter Password" 
                    required 
                  />
                 <div className="text-right mt-1.5">
                   <a href="#" className="text-[10px] font-extrabold text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-wider">Forgot Password?</a>
                 </div>
               </div>
               
               <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-3.5 rounded-xl transition-all duration-300 mt-2 text-sm shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] hover:shadow-[0_10px_25px_-6px_rgba(16,185,129,0.5)] hover:-translate-y-0.5">
                 {loading ? 'Authenticating...' : 'Sign In'}
               </button>
             </form>

             <div className="flex items-center my-6 opacity-70">
               <div className="flex-grow border-t border-slate-200"></div>
               <span className="px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Or Continue With</span>
               <div className="flex-grow border-t border-slate-200"></div>
             </div>

             <div className="flex gap-3">
               <button type="button" onClick={handleGoogleLogin} className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs group shadow-sm hover:shadow-md">
                 <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                   <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                   <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.16 21.32 7.23 24 12 24z"/>
                   <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.39l4.09-3.15z"/>
                   <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.16 2.68 1.18 6.61l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
                 </svg>
                 <span>Google</span>
               </button>

               <button type="button" onClick={() => setShowPhoneInput(!showPhoneInput)} className={`flex-1 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs border shadow-sm hover:shadow-md ${showPhoneInput ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'}`}>
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                 <span>Phone</span>
               </button>
             </div>

             {showPhoneInput && (
               <div className="animate-content mt-4">
                 <form onSubmit={handlePhoneSubmit} className="flex gap-2">
                   <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:border-slate-900 focus:ring-2 outline-none text-sm font-bold" placeholder="+91 Mobile Number" required />
                   <button type="submit" className="bg-slate-900 hover:bg-black text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition-all text-sm">OTP</button>
                 </form>
               </div>
             )}
           </div>
        )}

        {/* --- VIEW 2: ROLE SELECTION --- */}
        {view === 'role-selection' && (
          <div className="animate-content">
            <div className="text-center mb-10 mt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-[10px] uppercase tracking-widest rounded-full mb-5">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                Verified
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">Choose Your <br/><span className="text-emerald-500">Journey</span></h2>
            </div>
            
            <div className="space-y-4">
              <button onClick={() => handleRoleSelection('candidate')} className="w-full group bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)] rounded-[1.5rem] p-5 flex items-center gap-5 transition-all duration-300 text-left hover:-translate-y-1">
                <div className="w-14 h-14 bg-slate-50 group-hover:bg-emerald-50 rounded-2xl flex items-center justify-center transition-colors">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">Find a Job</h4>
                  <p className="text-xs font-bold text-slate-400 mt-1">Discover opportunities & apply.</p>
                </div>
              </button>

              <button onClick={() => handleRoleSelection('employer')} className="w-full group bg-white border border-slate-200 hover:border-blue-500 hover:shadow-[0_10px_30px_-10px_rgba(59,130,246,0.3)] rounded-[1.5rem] p-5 flex items-center gap-5 transition-all duration-300 text-left hover:-translate-y-1">
                <div className="w-14 h-14 bg-slate-50 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center transition-colors">
                  <span className="text-2xl">🏢</span>
                </div>
                <div>
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">Hire Talents</h4>
                  <p className="text-xs font-bold text-slate-400 mt-1">Post jobs and recruit the best.</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* --- VIEW 3: CANDIDATE DETAILS FORM --- */}
        {view === 'candidate-form' && (
          <div className="animate-content">
            <div className="text-center mb-8 mt-2">
              <h2 className="text-2xl font-black text-slate-900 mb-1">Your Profile</h2>
              <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">Candidate Setup</p>
            </div>
            {error && <div className="mb-4 p-2 bg-red-50 text-red-500 text-xs text-center font-bold rounded-lg">{error}</div>}
            
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <input type="text" value={candidateData.fullName} onChange={(e) => setCandidateData({...candidateData, fullName: e.target.value})} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" placeholder="Full Legal Name" required />
              
              <input type="text" value={candidateData.designation} onChange={(e) => setCandidateData({...candidateData, designation: e.target.value})} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" placeholder="Professional Title (e.g. Developer)" required />
              
              <input type="text" value={candidateData.location} onChange={(e) => setCandidateData({...candidateData, location: e.target.value})} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" placeholder="Current Location" required />
              
              <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl transition-all mt-4 text-sm shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 tracking-wide">
                {loading ? 'Saving...' : 'Complete & Continue →'}
              </button>
            </form>
          </div>
        )}

        {/* --- VIEW 4: EMPLOYER DETAILS FORM --- */}
        {view === 'employer-form' && (
          <div className="animate-content">
            <div className="text-center mb-8 mt-2">
              <h2 className="text-2xl font-black text-slate-900 mb-1">Company Info</h2>
              <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-widest">Employer Setup</p>
            </div>
            {error && <div className="mb-4 p-2 bg-red-50 text-red-500 text-xs text-center font-bold rounded-lg">{error}</div>}
            
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <input type="text" value={employerData.companyName} onChange={(e) => setEmployerData({...employerData, companyName: e.target.value})} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" placeholder="Company Name" required />
              
              <input type="text" value={employerData.hrName} onChange={(e) => setEmployerData({...employerData, hrName: e.target.value})} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none" placeholder="HR Manager Name" required />
              
              <input type="text" value={employerData.industry} onChange={(e) => setEmployerData({...employerData, industry: e.target.value})} className="w-full bg-slate-50/50 hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all, outline-none" placeholder="Industry (e.g. IT, Healthcare)" required />
              
              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all mt-4 text-sm shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 tracking-wide">
                {loading ? 'Saving...' : 'Complete & Continue →'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;