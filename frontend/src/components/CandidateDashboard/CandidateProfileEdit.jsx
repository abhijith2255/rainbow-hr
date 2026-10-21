import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CandidateProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 1. പുതിയ ഫീൽഡുകൾ കൂടി സ്റ്റേറ്റിൽ ഉൾപ്പെടുത്തി
  const [formData, setFormData] = useState({
    fullName: '',
    designation: '',
    location: '',
    phoneNumber: '',
    skills: '',
    experienceYears: '',
    education: '',
    portfolioLink: ''
  });

  const [files, setFiles] = useState({
    profilePicture: null,
    resume: null
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('http://127.0.0.1:8000/api/accounts/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // 2. ബാക്കെൻഡിൽ നിന്നും വരുന്ന ഡാറ്റ ഫോമിലേക്ക് സെറ്റ് ചെയ്യുന്നു
        setFormData({
          fullName: res.data.fullName || '',
          designation: res.data.designation || '',
          location: res.data.location || '',
          phoneNumber: res.data.phoneNumber || '',
          skills: res.data.skills || '',
          experienceYears: res.data.experienceYears || '',
          education: res.data.education || '',
          portfolioLink: res.data.portfolioLink || ''
        });
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => submitData.append(key, formData[key]));
    if (files.profilePicture) submitData.append('profilePicture', files.profilePicture);
    if (files.resume) submitData.append('resume', files.resume);

    try {
      const token = localStorage.getItem('authToken');
      await axios.put('http://127.0.0.1:8000/api/accounts/profile/', submitData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => navigate('/candidate-dashboard'), 1000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-premium py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-full mb-2">Settings</span>
            <h1 className="text-3xl font-black text-slate-900">Complete Profile</h1>
          </div>
          <button onClick={() => navigate('/candidate-dashboard')} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {message && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-xl text-center">{message}</div>}
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 font-bold text-xs rounded-xl text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* File Uploads Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Profile Picture</label>
              <input type="file" name="profilePicture" onChange={handleFileChange} accept="image/*" className="w-full text-sm font-bold text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-extrabold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200 transition-all outline-none" />
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Upload Resume (PDF)</label>
              <input type="file" name="resume" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="w-full text-sm font-bold text-slate-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-extrabold file:bg-slate-200 file:text-slate-700 hover:file:bg-slate-300 transition-all outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Basic Info */}
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Full Legal Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Phone Number</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all" placeholder="+91 9876543210" />
            </div>
            
            {/* Professional Info */}
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Professional Title</label>
              <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all" placeholder="e.g. Frontend Developer" required />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Current Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all" placeholder="e.g. Kochi, Kerala" required />
            </div>

            {/* Experience & Education */}
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Experience (Years)</label>
              <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} min="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all" placeholder="0 for Fresher" />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Highest Education</label>
              <input type="text" name="education" value={formData.education} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all" placeholder="e.g. B.Tech in Computer Science" />
            </div>
          </div>

          {/* Extended Info */}
          <div>
            <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Top Skills (Comma Separated)</label>
            <input type="text" name="skills" value={formData.skills} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all" placeholder="React, Django, Python, Tailwind" />
          </div>
          <div>
            <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Portfolio / LinkedIn URL</label>
            <input type="url" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all" placeholder="https://..." />
          </div>

          <button type="submit" disabled={saving} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/30 tracking-wide mt-6">
            {saving ? 'Saving Profile...' : 'Save Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfileEdit;