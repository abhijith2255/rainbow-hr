import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole'); // Role koodi clear cheyyunnu
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-premium flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-10 text-center">
        
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        </div>
        
        <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome, User!</h1>
        <p className="text-slate-500 font-medium mb-8">This is your personal portal. Here you can track your job applications and profile.</p>
        
        <button onClick={handleLogout} className="bg-red-50 text-red-600 font-extrabold px-8 py-3.5 rounded-xl hover:bg-red-100 transition-colors">
          Sign Out
        </button>
        
      </div>
    </div>
  );
};

export default UserDashboard;