import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/employer/applications/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (err) {
      console.error("Failed to load applications", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter(app =>
    app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Received Applications</h2>
          <p className="text-slate-500 font-medium text-xs mt-1">
            Verified candidate applications forwarded by the HR team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Search candidate or job..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 w-full sm:w-64"
          />
          <span className="px-3 py-2 bg-emerald-50 text-emerald-700 font-black text-xs rounded-xl whitespace-nowrap">
            {filteredApps.length} Candidates
          </span>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="text-center py-16 font-bold text-slate-400 text-sm">Loading applications...</div>
      ) : filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-bold text-sm">No verified applications received yet.</p>
          <p className="text-slate-400 font-medium text-xs mt-1">Applications approved by staff will automatically appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <div 
              key={app.id} 
              className="p-5 md:p-6 rounded-2xl border border-slate-100 bg-white hover:border-emerald-100 hover:shadow-md transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-black text-[10px] rounded-md">
                    {app.job_title}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    Applied on {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{app.full_name}</h3>
                <p className="text-xs font-bold text-slate-500 mt-0.5">
                  📧 {app.email} • 📞 {app.phone}
                </p>
                {app.cover_letter && (
                  <p className="text-xs text-slate-600 mt-2 line-clamp-1 italic font-medium">
                    "{app.cover_letter}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={() => setSelectedApp(app)} 
                  className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  View Details
                </button>
                
                {app.resume && (
                  <a 
                    href={app.resume.startsWith('http') ? app.resume : `http://127.0.0.1:8000${app.resume}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    download
                    className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Resume
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidate Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  {selectedApp.job_title}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">{selectedApp.full_name}</h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">Applied on {new Date(selectedApp.applied_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-medium text-slate-700 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p><span className="font-bold text-slate-500">Email:</span> <a href={`mailto:${selectedApp.email}`} className="text-blue-600 font-bold underline">{selectedApp.email}</a></p>
                <p><span className="font-bold text-slate-500">Phone:</span> <a href={`tel:${selectedApp.phone}`} className="text-emerald-600 font-bold">{selectedApp.phone}</a></p>
              </div>

              {selectedApp.cover_letter && (
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-1">Cover Note</h4>
                  <p className="p-4 bg-slate-50 rounded-2xl whitespace-pre-line leading-relaxed text-slate-800">
                    {selectedApp.cover_letter}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => setSelectedApp(null)} 
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Close
              </button>
              {selectedApp.resume && (
                <a 
                  href={selectedApp.resume.startsWith('http') ? selectedApp.resume : `http://127.0.0.1:8000${selectedApp.resume}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20"
                >
                  Download Full Resume
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployerApplications;