import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplyJobModal = ({ isOpen, onClose, job }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadUserData();
    }
  }, [isOpen]);

  // Login ചെയ്ത കാൻഡിഡേറ്റിന്റെ പ്രൊഫൈൽ വിവരങ്ങൾ തനിയെ ലോഡ് ചെയ്യുന്നു
  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const res = await axios.get('http://127.0.0.1:8000/api/accounts/profile/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.data) {
        setFullName(res.data.fullName || res.data.full_name || res.data.name || res.data.username || '');
        setEmail(res.data.email || '');
        setPhone(res.data.phoneNumber || res.data.phone_number || res.data.phone || '');
      }
    } catch (err) {
      console.error("Profile auto-fill fetch error:", err);
    }
  };

  if (!isOpen || !job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return setError("Please upload your resume (PDF/DOC)!");

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('cover_letter', coverLetter);
    formData.append('resume', resume);

    try {
      const token = localStorage.getItem('authToken');
      await axios.post(`http://127.0.0.1:8000/api/jobs/${job.id}/apply/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      alert("Application submitted successfully!");
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-premium">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl border border-slate-100">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              Quick Apply
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">{job.title}</h3>
            <p className="text-xs font-bold text-slate-400">
              {job.company_name} • {job.location}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 font-bold text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Full Name
            </label>
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500" 
              placeholder="Your full name"
              required 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Email
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500" 
                placeholder="name@email.com"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                Phone Number
              </label>
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500" 
                placeholder="+91 9876543210"
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Upload Resume (PDF/DOC)
            </label>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={(e) => setResume(e.target.files[0])} 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:text-emerald-700 file:font-bold hover:file:bg-emerald-100 cursor-pointer" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
              Cover Note (Optional)
            </label>
            <textarea 
              rows="3" 
              value={coverLetter} 
              onChange={(e) => setCoverLetter(e.target.value)} 
              placeholder="Short note about your experience and skills..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 resize-none" 
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md shadow-emerald-500/20 transition-all"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ApplyJobModal;