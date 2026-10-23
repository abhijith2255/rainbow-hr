import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Building2, Globe, User, MapPin, Upload, CheckCircle2,
  Loader2, Briefcase, Camera, Image as ImageIcon, FileText,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const API_ROOT = 'https://rainbow-hr.onrender.com';

// Backend-il ninnum varunna relative media URL-ne full URL aakki maattunnu
const toAbsoluteUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_ROOT}${url}`;
};

const EmployerProfileEdit = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    companyName: '', hrName: '', industry: '', companyWebsite: '', companyLocation: '', companyDescription: ''
  });

  const [files, setFiles] = useState({ companyLogo: null });
  const [logoPreview, setLogoPreview] = useState(null); // Logo preview kanikkanulla state
  const [existingLogo, setExistingLogo] = useState(null); // Database-il already ulla logo

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${API_ROOT}/api/accounts/profile/`, {
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
        const logo = toAbsoluteUrl(res.data.companyLogo);
        setExistingLogo(logo);
        if (logo) setLogoPreview(logo);
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
      await axios.put(`${API_ROOT}/api/accounts/profile/`, submitData, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Company Profile updated successfully!');
      refreshProfile(); // Navbar-le logo/name udane update aavan
      setTimeout(() => navigate('/employer-dashboard'), 1000);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" strokeWidth={2.5} />
      </div>
    );
  }

  // Form field-inte common style (repeat ozhivakkan)
  const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all';
  const labelClass = 'block text-[11px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider';

  return (
    <div className="min-h-screen bg-slate-50 font-premium pt-28 md:pt-32 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back + title */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/employer-dashboard')}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 font-black text-[10px] uppercase tracking-widest rounded-full">
            <Briefcase className="w-3 h-3" strokeWidth={2.5} /> Employer Profile
          </span>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-xl text-center border border-emerald-100 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} /> {message}
          </div>
        )}
        {error && <div className="p-4 bg-red-50 text-red-600 font-bold text-xs rounded-xl text-center border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ---------- Cover + Logo ---------- */}
          <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden">
            <div className="relative h-32 sm:h-40 bg-gradient-to-r from-slate-900 via-blue-800 to-blue-600">
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 15% 25%, rgba(255,255,255,0.6) 0, transparent 40%), radial-gradient(circle at 85% 75%, rgba(255,255,255,0.45) 0, transparent 45%)' }} />
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 sm:-mt-16">
                {/* Logo — click cheythal maattam */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
                  <input
                    id="employer-logo-input"
                    type="file"
                    name="companyLogo"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-full h-full rounded-[1.75rem] bg-white p-2 shadow-xl shadow-slate-900/10">
                    <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-slate-50 flex items-center justify-center">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Company logo" className="w-full h-full object-contain p-1.5" />
                      ) : (
                        <Building2 className="w-10 h-10 text-slate-300" strokeWidth={2} />
                      )}
                    </div>
                  </div>
                  <label
                    htmlFor="employer-logo-input"
                    className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-blue-600 transition-colors"
                    title="Change logo"
                  >
                    <Camera className="w-4 h-4" strokeWidth={2.5} />
                  </label>
                </div>

                <div className="min-w-0 flex-1 sm:pb-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">
                    {formData.companyName || 'Your Company'}
                  </h1>
                  <p className="text-slate-500 font-bold text-sm mt-0.5 truncate">
                    {formData.industry || 'Add your industry sector'}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] font-bold text-slate-400">
                    {formData.companyLocation && (
                      <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" strokeWidth={2.5} />{formData.companyLocation}</span>
                    )}
                    {formData.hrName && (
                      <span className="inline-flex items-center gap-1.5"><User className="w-3.5 h-3.5" strokeWidth={2.5} />HR: {formData.hrName}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Sectioned grid ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">

              {/* Company Details */}
              <div className="bg-white rounded-[1.75rem] shadow-[0_12px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Company Details</h2>
                    <p className="text-[11px] font-semibold text-slate-400">Basic information about your company</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Company Name</label>
                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Industry Sector</label>
                    <input type="text" name="industry" value={formData.industry} onChange={handleChange} className={inputClass} placeholder="e.g. IT, Healthcare, Finance" required />
                  </div>
                  <div>
                    <label className={labelClass}>Headquarters / Location</label>
                    <input type="text" name="companyLocation" value={formData.companyLocation} onChange={handleChange} className={inputClass} placeholder="e.g. Kochi, Kerala" required />
                  </div>
                </div>
              </div>

              {/* About Company */}
              <div className="bg-white rounded-[1.75rem] shadow-[0_12px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">About Company</h2>
                    <p className="text-[11px] font-semibold text-slate-400">Tell candidates about your culture</p>
                  </div>
                </div>
                <label className={labelClass}>Company Description</label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  rows="5"
                  className={`${inputClass} resize-none leading-relaxed`}
                  placeholder="Briefly describe your company, culture, and what you do..."
                ></textarea>
              </div>
            </div>

            {/* RIGHT COLUMN — Contact & Documents */}
            <div className="space-y-6">

              {/* Contact / HR */}
              <div className="bg-white rounded-[1.75rem] shadow-[0_12px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <User className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Contact &amp; HR</h2>
                    <p className="text-[11px] font-semibold text-slate-400">Hiring point of contact</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>HR / Manager Name</label>
                    <input type="text" name="hrName" value={formData.hrName} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Company Website</label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2.5} />
                      <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} className={`${inputClass} pl-11`} placeholder="https://www.example.com" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Logo / Documents */}
              <div className="bg-white rounded-[1.75rem] shadow-[0_12px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Brand Asset</h2>
                    <p className="text-[11px] font-semibold text-slate-400">Company logo</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-1.5" />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-300" strokeWidth={2} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <label htmlFor="employer-logo-input" className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 transition-colors">
                      <Upload className="w-4 h-4" strokeWidth={2.5} />
                      {existingLogo || files.companyLogo ? 'Replace Logo' : 'Upload Logo'}
                    </label>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 font-medium">PNG or JPG, square images look best.</p>
              </div>
            </div>
          </div>

          {/* ---------- Save ---------- */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/employer-dashboard')}
              className="px-6 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-500/30 tracking-wide"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />}
              {saving ? 'Saving Profile...' : 'Save Company Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployerProfileEdit;
