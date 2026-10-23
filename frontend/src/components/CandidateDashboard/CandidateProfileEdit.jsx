import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft, Camera, X, FileText, Download, Upload, User, MapPin,
  Briefcase, Link2, Sparkles, CheckCircle2, Loader2, Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Kerala/India job market-ന് പ്രസക്തമായ suggested skills
const SUGGESTED_SKILLS = [
  'React', 'Python', 'Django', 'JavaScript', 'SQL', 'Excel',
  'Tally', 'Communication', 'Customer Service', 'Marketing', 'Accounting', 'Data Entry'
];
const MAX_SKILLS = 20;
const API_ROOT = 'https://rainbow-hr.onrender.com';

// Backend-il ninnum varunna relative media URL-ne full URL aakki maattunnu
const toAbsoluteUrl = (url) => {
  if (!url) return null;
  return url.startsWith('http') ? url : `${API_ROOT}${url}`;
};

const CandidateProfileEdit = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Skills tag input-ന്റെ state (array ആയി കൈകാര്യം ചെയ്യുന്നു)
  const [skillTags, setSkillTags] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  // Database-il already upload cheythirikkunna documents
  const [existing, setExisting] = useState({ profilePicture: null, resume: null });
  // Avatar preview (nilaവിലുള്ള ഫോട്ടോ / പുതിയത്)
  const [avatarPreview, setAvatarPreview] = useState(null);
  const resumeInputRef = useRef(null);

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
        const res = await axios.get(`${API_ROOT}/api/accounts/profile/`, {
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

        // 3. നിലവിലുള്ള uploaded documents സേവ് ചെയ്യുന്നു
        const pic = toAbsoluteUrl(res.data.profilePicture);
        const resume = toAbsoluteUrl(res.data.resume);
        setExisting({ profilePicture: pic, resume });
        setAvatarPreview(pic);

        // 4. ബാക്കെൻഡിൽ നിന്നും വരുന്ന skills string-നെ tags array ആക്കി മാറ്റുന്നു (de-duplicate ചെയ്ത്)
        const parsedSkills = (res.data.skills || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        const uniqueSkills = [];
        parsedSkills.forEach((s) => {
          if (!uniqueSkills.some((u) => u.toLowerCase() === s.toLowerCase())) {
            uniqueSkills.push(s);
          }
        });
        setSkillTags(uniqueSkills.slice(0, MAX_SKILLS));
      } catch (err) {
        setError('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFiles({ ...files, [e.target.name]: file });
    // Puthiya photo select cheyyumpol preview udaneye maattunnu
    if (e.target.name === 'profilePicture' && file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // ഒരു പുതിയ skill tag ചേർക്കുന്നു (cap, de-duplicate എന്നിവ പരിശോധിക്കുന്നു)
  const addSkill = (raw) => {
    const value = (raw || '').trim();
    if (!value) return;
    setSkillTags((prev) => {
      if (prev.length >= MAX_SKILLS) return prev;
      if (prev.some((s) => s.toLowerCase() === value.toLowerCase())) return prev;
      return [...prev, value];
    });
  };

  // Enter അമർത്തുമ്പോഴോ comma വരുമ്പോഴോ tag ആക്കി മാറ്റുന്നു
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
      setSkillInput('');
    } else if (e.key === 'Backspace' && !skillInput && skillTags.length > 0) {
      setSkillTags((prev) => prev.slice(0, -1));
    }
  };

  const handleSkillChange = (e) => {
    const val = e.target.value;
    if (val.includes(',')) {
      val.split(',').forEach((part) => addSkill(part));
      setSkillInput('');
    } else {
      setSkillInput(val);
    }
  };

  const removeSkill = (tag) => setSkillTags((prev) => prev.filter((s) => s !== tag));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => submitData.append(key, formData[key]));
    // skills-നെ comma separated string ആയി വീണ്ടും സെറ്റ് ചെയ്യുന്നു
    submitData.set('skills', skillTags.join(', '));
    if (files.profilePicture) submitData.append('profilePicture', files.profilePicture);
    if (files.resume) submitData.append('resume', files.resume);

    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`${API_ROOT}/api/accounts/profile/`, submitData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data' 
        }
      });
      setMessage('Profile updated successfully!');
      refreshProfile(); // Navbar-ലെ പേരും ഫോട്ടോയും ഉടനെ അപ്ഡേറ്റ് ആകാൻ
      setTimeout(() => navigate('/candidate-dashboard'), 1000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" strokeWidth={2.5} />
      </div>
    );
  }

  // Form field-inte common style (repeat ozhivakkan)
  const inputClass = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none transition-all';
  const labelClass = 'block text-[11px] font-extrabold text-slate-500 mb-2 uppercase tracking-wider';

  return (
    <div className="min-h-screen bg-slate-50 font-premium pt-28 md:pt-32 pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back + title */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/candidate-dashboard')}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
            Back to Dashboard
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-full">
            <Sparkles className="w-3 h-3" strokeWidth={2.5} /> Candidate Profile
          </span>
        </div>

        {message && (
          <div className="p-4 bg-emerald-50 text-emerald-600 font-bold text-xs rounded-xl text-center border border-emerald-100 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} /> {message}
          </div>
        )}
        {error && <div className="p-4 bg-red-50 text-red-600 font-bold text-xs rounded-xl text-center border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ---------- Cover + Avatar ---------- */}
          <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden">
            <div className="relative h-32 sm:h-40 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.5) 0, transparent 45%)' }} />
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 sm:-mt-16">
                {/* Avatar — click cheythal photo maattam */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 group">
                  <input
                    id="candidate-avatar-input"
                    type="file"
                    name="profilePicture"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="w-full h-full rounded-[1.75rem] bg-white p-1.5 shadow-xl shadow-slate-900/10">
                    <div className="w-full h-full rounded-[1.4rem] overflow-hidden bg-slate-100 flex items-center justify-center">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-10 h-10 text-slate-300" strokeWidth={2} />
                      )}
                    </div>
                  </div>
                  <label
                    htmlFor="candidate-avatar-input"
                    className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg cursor-pointer hover:bg-emerald-600 transition-colors"
                    title="Change photo"
                  >
                    <Camera className="w-4 h-4" strokeWidth={2.5} />
                  </label>
                </div>

                <div className="min-w-0 flex-1 sm:pb-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight truncate">
                    {formData.fullName || 'Your Name'}
                  </h1>
                  <p className="text-slate-500 font-bold text-sm mt-0.5 truncate">
                    {formData.designation || 'Add your professional title'}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[11px] font-bold text-slate-400">
                    {formData.location && (
                      <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" strokeWidth={2.5} />{formData.location}</span>
                    )}
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" strokeWidth={2.5} />
                      {formData.experienceYears ? `${formData.experienceYears} yrs experience` : 'Fresher'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Sectioned grid ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">

              {/* Personal Information */}
              <div className="bg-white rounded-[1.75rem] shadow-[0_12px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <User className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Personal Information</h2>
                    <p className="text-[11px] font-semibold text-slate-400">Your basic contact details</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Full Legal Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className={labelClass}>Current Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClass} placeholder="e.g. Kochi, Kerala" required />
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div className="bg-white rounded-[1.75rem] shadow-[0_12px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Professional Details</h2>
                    <p className="text-[11px] font-semibold text-slate-400">What you do and your experience</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Professional Title</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleChange} className={inputClass} placeholder="e.g. Frontend Developer" required />
                  </div>
                  <div>
                    <label className={labelClass}>Experience (Years)</label>
                    <input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} min="0" className={inputClass} placeholder="0 for Fresher" />
                  </div>
                  <div>
                    <label className={labelClass}>Highest Education</label>
                    <input type="text" name="education" value={formData.education} onChange={handleChange} className={inputClass} placeholder="e.g. B.Tech in Computer Science" />
                  </div>
                </div>
              </div>

              {/* Skills & Expertise */}
              <div className="bg-white rounded-[1.75rem] shadow-[0_12px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center justify-between gap-3 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h2 className="text-base font-black text-slate-900">Skills &amp; Expertise</h2>
                      <p className="text-[11px] font-semibold text-slate-400">Add up to {MAX_SKILLS} skills</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-slate-400 shrink-0">{skillTags.length}/{MAX_SKILLS}</span>
                </div>

                {/* നിലവിലുള്ള tags കാണിക്കുന്ന ചിപ്പുകൾ */}
                {skillTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skillTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeSkill(tag)}
                          className="text-emerald-500 hover:text-emerald-800 leading-none"
                          aria-label={`Remove ${tag}`}
                        >
                          <X className="w-3 h-3" strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  value={skillInput}
                  onChange={handleSkillChange}
                  onKeyDown={handleSkillKeyDown}
                  className={inputClass}
                  placeholder="Type a skill and press Enter or comma..."
                />
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                  Press Enter or comma to add each skill.
                </p>

                {/* Suggested skills - ക്ലിക്ക് ചെയ്താൽ tag ആയി ചേരുന്നു */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {SUGGESTED_SKILLS.filter((s) => !skillTags.some((t) => t.toLowerCase() === s.toLowerCase())).map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100 transition-all"
                    >
                      <Plus className="w-3 h-3" strokeWidth={3} /> {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — Documents & Links */}
            <div className="space-y-6">

              {/* Uploaded Documents */}
              <div className="bg-white rounded-[1.75rem] shadow-[0_12px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Documents</h2>
                    <p className="text-[11px] font-semibold text-slate-400">Photo &amp; resume</p>
                  </div>
                </div>

                {/* Profile photo */}
                <div className="pb-5 mb-5 border-b border-slate-100">
                  <p className={labelClass}>Profile Photo</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Profile preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-slate-300" strokeWidth={2} />
                      )}
                    </div>
                    <label htmlFor="candidate-avatar-input" className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs cursor-pointer hover:bg-slate-100 transition-colors">
                      <Upload className="w-4 h-4" strokeWidth={2.5} /> Change Photo
                    </label>
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <p className={labelClass}>Resume / CV</p>
                  {existing.resume && !files.resume ? (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-emerald-800">Resume uploaded</p>
                        <p className="text-[10px] font-semibold text-emerald-600">Ready for employers</p>
                      </div>
                      <a
                        href={existing.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-xl bg-white text-emerald-600 flex items-center justify-center shrink-0 hover:bg-emerald-100 transition-colors"
                        title="View / Download"
                      >
                        <Download className="w-4 h-4" strokeWidth={2.5} />
                      </a>
                    </div>
                  ) : null}

                  {files.resume && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 border border-blue-100 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      <p className="text-xs font-black text-blue-800 truncate">{files.resume.name}</p>
                    </div>
                  )}

                  <input
                    ref={resumeInputRef}
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => resumeInputRef.current?.click()}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                  >
                    <Upload className="w-4 h-4" strokeWidth={2.5} />
                    {existing.resume || files.resume ? 'Replace Resume (PDF)' : 'Upload Resume (PDF)'}
                  </button>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Accepted: PDF, DOC, DOCX</p>
                </div>
              </div>

              {/* Online Presence */}
              <div className="bg-white rounded-[1.75rem] shadow-[0_12px_35px_rgba(0,0,0,0.05)] border border-slate-100 p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                    <Link2 className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900">Online Presence</h2>
                    <p className="text-[11px] font-semibold text-slate-400">Portfolio or LinkedIn</p>
                  </div>
                </div>
                <label className={labelClass}>Portfolio / LinkedIn URL</label>
                <input type="url" name="portfolioLink" value={formData.portfolioLink} onChange={handleChange} className={inputClass} placeholder="https://..." />
              </div>
            </div>
          </div>

          {/* ---------- Save ---------- */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/candidate-dashboard')}
              className="px-6 py-4 rounded-xl bg-white border border-slate-200 text-slate-600 font-black text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/30 tracking-wide"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} /> : <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />}
              {saving ? 'Saving Profile...' : 'Save Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfileEdit;
