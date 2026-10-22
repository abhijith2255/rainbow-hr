import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployerProfileEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyName: '', hrName: '', industry: '', companyWebsite: '', companyLocation: '', companyDescription: ''
  });

  const [files, setFiles] = useState({ companyLogo: null });
  const [logoPreview, setLogoPreview] = useState(null); // Logo preview kanikkanulla state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('http://127.0.0.1:8000/api/accounts/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        setFormData({
          companyName: res.data.companyName || '',
          hrName: res.data.hrName || '',
          industry: res.data.industry || '',
          companyWebsite: res.data.companyWebsite || '',
          companyLocation: res.data.companyLocation || '',
          companyDescription: res.data.companyDescription || ''
        });

        // Database-il already logo undenkil ath preview aayi set cheyyunnu
        if (res.data.companyLogo) {
          setLogoPreview(res.data.companyLogo.startsWith('http') ? res.data.companyLogo : `http://127.0.0.1:8000${res.data.companyLogo}`);
        }
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  // Puthiya photo select cheyyumpol ath preview aayi kanikkan
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFiles({ ...files, [e.target.name]: file });
    if (e.target.name === 'companyLogo' && file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => submitData.append(key, formData[key]));
    if (files.companyLogo) submitData.append('companyLogo', files.companyLogo);

    try {
      const token = localStorage.getItem('authToken');
      await axios.put('http://127.0.0.1:8000/api/accounts/profile/', submitData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Company Profile updated successfully!');
      
      // Save cheyth kazhinjal Navbar update aavan vendi window reload cheythu dashboardilekk pokunnu
      setTimeout(() => {
        window.location.href = '/employer-dashboard';
      }, 1000);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-premium pt-28 md:pt-32 pb-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-black text-[10px] uppercase tracking-widest rounded-full mb-2">Employer Settings</span>
            <h1 className="text-3xl font-black text-slate-900">Company Profile</h1>
          </div>
          <button onClick={() => navigate('/employer-dashboard')} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {message && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-xl text-center">{message}</div>}
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 font-bold text-xs rounded-xl text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Logo Preview Section */}
          <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm shrink-0">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-slate-300">C</span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Company Logo</label>
              <input type="file" name="companyLogo" onChange={handleFileChange} accept="image/*" className="w-full text-sm font-bold text-slate-800 file:mr-4 file:py-2.5 file:px-5 file:rounded-full file:border-0 file:text-xs file:font-extrabold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition-all outline-none cursor-pointer" />
            </div>
          </div>

          {/* ... (Bakki form fields pazhayath pole thanne) ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">HR / Manager Name</label>
              <input type="text" name="hrName" value={formData.hrName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all" required />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Industry Sector</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="e.g. IT, Healthcare, Finance" required />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Headquarters / Location</label>
              <input type="text" name="companyLocation" value={formData.companyLocation} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="e.g. Kochi, Kerala" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Company Website (URL)</label>
            <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all" placeholder="https://www.example.com" />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">About Company</label>
            <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} rows="4" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all resize-none" placeholder="Briefly describe your company, culture, and what you do..."></textarea>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-blue-500/30 tracking-wide mt-6">
            {saving ? 'Saving Profile...' : 'Save Company Details'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployerProfileEdit;