import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        // ബാക്കെൻഡിലെ profile_api വിളിക്കുന്നു
        const res = await axios.get('http://127.0.0.1:8000/api/accounts/candidate/dashboard-data/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Profile Picture URL ശരിയാക്കാൻ
  const getProfilePicUrl = () => {
    if (!data?.profilePicture) return null;
    return data.profilePicture.startsWith('http') 
      ? data.profilePicture 
      : `http://127.0.0.1:8000${data.profilePicture}`;
  };

  // Resume URL ശരിയാക്കാൻ
  const getResumeUrl = () => {
    if (!data?.resume) return null;
    return data.resume.startsWith('http') 
      ? data.resume 
      : `http://127.0.0.1:8000${data.resume}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-premium p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header section with User Data */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            {/* Profile Picture */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-3xl shadow-lg overflow-hidden border-4 border-white shrink-0">
              {getProfilePicUrl() ? (
                <img src={getProfilePicUrl()} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                data?.fullName ? data.fullName.charAt(0).toUpperCase() : 'U'
              )}
            </div>
            
            <div className="flex-grow">
              <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-full mb-2">Candidate Portal</span>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                Welcome, <span className="text-emerald-500 capitalize">{data?.name || data?.fullName || data?.username || 'User'}</span>
              </h1>
              <p className="text-slate-500 font-bold mt-1 text-sm md:text-base">
                {data?.designation || 'Add a designation'} • {data?.location || 'Add your location'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 z-10 w-full md:w-auto mt-2 md:mt-0">
            <button 
              onClick={() => navigate('/')} 
              className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Find Jobs
            </button>

            <button 
              onClick={() => navigate('/candidate-profile-edit')} 
              className="flex-1 md:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
              Edit Profile
            </button>

            <button 
              onClick={handleLogout} 
              className="px-4 py-3 bg-white border border-slate-200 text-red-500 font-bold rounded-xl shadow-sm hover:bg-red-50 hover:border-red-200 transition-all flex items-center justify-center"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Stats & Resume */}
          <div className="space-y-8 lg:col-span-2">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <h3 className="text-3xl font-black text-slate-900">0</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Applied Jobs</p>
              </div>
              
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                </div>
                <h3 className="text-3xl font-black text-slate-900">0</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Saved Jobs</p>
              </div>
              
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <h3 className="text-3xl font-black text-slate-900">0</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Interviews</p>
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-6">Resume & Portfolio</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                {getResumeUrl() ? (
                  <a href={getResumeUrl()} target="_blank" rel="noreferrer" className="flex-1 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-700 font-bold px-6 py-4 rounded-xl flex items-center gap-3 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <div>
                      <p className="text-sm">Download Resume</p>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold opacity-70">PDF Document</p>
                    </div>
                  </a>
                ) : (
                  <div className="flex-1 bg-slate-50 border border-slate-100 text-slate-400 font-bold px-6 py-4 rounded-xl flex items-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <p className="text-sm">No Resume Uploaded</p>
                  </div>
                )}
                
                {data?.portfolioLink && (
                  <a href={data.portfolioLink} target="_blank" rel="noreferrer" className="flex-1 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-700 font-bold px-6 py-4 rounded-xl flex items-center gap-3 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    <div>
                      <p className="text-sm">View Portfolio</p>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold opacity-70">External Link</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Personal Details */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-900">Personal Details</h3>
              <button onClick={() => navigate('/candidate-profile-edit')} className="text-emerald-500 hover:text-emerald-600 bg-emerald-50 p-2 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-sm font-bold text-slate-800 break-all">{data?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {data?.phoneNumber || 'Not provided'}
                    {data?.isPhoneVerified && <span className="w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center" title="Verified"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg></span>}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Experience & Education</p>
                  <p className="text-sm font-bold text-slate-800">{data?.experienceYears ? `${data.experienceYears} Years Experience` : 'Fresher'}</p>
                  <p className="text-xs font-semibold text-slate-500 mt-1">{data?.education || 'No education details added'}</p>
                </div>
              </div>

              {data?.skills && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.split(',').map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;