import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostJobModal = ({ isOpen, onClose, onJobPosted }) => {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    location: '',
    jobType: 'Full-time',
    category: '', // പുതുതായി ചേർത്തത്
    genderPreference: 'Any',
    salaryType: 'Fixed Range',
    salaryRange: '',
    hasIncentives: false,
    incentiveDetails: '',
    fresherAllowed: true,
    experienceRequired: '',
    ageLimit: '',
    qualification: '',
    description: '',
    requirements: '',
    accommodation: false,
    foodProvided: false,
    healthInsurance: false,
    providentFund: false,
    travelAllowance: false,
    dearnessAllowance: false,
    leavePolicy: '',
    additionalBenefits: ''
  });

  const [categories, setCategories] = useState([]); // കാറ്റഗറികൾ സ്റ്റോർ ചെയ്യാൻ
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // മോഡൽ ഓപ്പൺ ആകുമ്പോൾ കാറ്റഗറികൾ എടുക്കാൻ
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/categories/');
      setCategories(res.data);
      // ഒന്നാമത്തെ കാറ്റഗറി ഡിഫോൾട്ടായി സെലക്ട് ചെയ്യാൻ
      if (res.data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: res.data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        title: formData.title,
        company_name: formData.companyName,
        location: formData.location,
        job_type: formData.jobType,
        category: formData.category, // കാറ്റഗറി കൂടി അയക്കുന്നു
        gender_preference: formData.genderPreference,
        salary_type: formData.salaryType,
        salary_range: formData.salaryRange,
        has_incentives: formData.hasIncentives,
        incentive_details: formData.incentiveDetails,
        fresher_allowed: formData.fresherAllowed,
        experience_required: formData.experienceRequired,
        age_limit: formData.ageLimit,
        qualification: formData.qualification,
        description: formData.description,
        requirements: formData.requirements,
        accommodation: formData.accommodation,
        food_provided: formData.foodProvided,
        health_insurance: formData.healthInsurance,
        provident_fund: formData.providentFund,
        travel_allowance: formData.travelAllowance,
        dearness_allowance: formData.dearnessAllowance,
        leave_policy: formData.leavePolicy,
        additional_benefits: formData.additionalBenefits
      };

      await axios.post('http://127.0.0.1:8000/api/jobs/', payload, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setLoading(false);
      onJobPosted(); 
      onClose();     
    } catch (err) {
      setLoading(false);
      let errorMessage = 'Failed to post job. Please check all fields.';
      if (err.response && err.response.data) {
          errorMessage = JSON.stringify(err.response.data); 
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-slate-100">
        
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <div>
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-full mb-1">Employer Portal</span>
            <h2 className="text-2xl font-black text-slate-900">Post a New Job</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 text-red-600 font-bold text-xs rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Job Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none" placeholder="e.g. Sales Executive / React Developer" required />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none" placeholder="Company Name" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Dropdown (പുതുതായി ചേർത്തത്) */}
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none" required>
                <option value="" disabled>Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none" placeholder="e.g. Kochi, Remote" required />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Work From Home">Work From Home</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Salary & Incentives */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Gender Preference</label>
              <select name="genderPreference" value={formData.genderPreference} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none">
                <option value="Any">Any / Both</option>
                <option value="Male">Male Only</option>
                <option value="Female">Female Only</option>
              </select>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div>
                <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Salary Range</label>
                <input type="text" name="salaryRange" value={formData.salaryRange} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:border-emerald-500 outline-none" placeholder="e.g. ₹18,000 to ₹22,000" />
              </div>
              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <input type="checkbox" name="hasIncentives" checked={formData.hasIncentives} onChange={handleChange} className="w-5 h-5 accent-emerald-600 rounded" />
                  <span className="text-xs font-black text-slate-700 uppercase">Incentives?</span>
                </label>
                {formData.hasIncentives && (
                  <input type="text" name="incentiveDetails" value={formData.incentiveDetails} onChange={handleChange} className="mt-2 w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none" placeholder="Details..." />
                )}
              </div>
            </div>
          </div>

          {/* Experience, Age & Qualification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Experience</label>
              <input type="text" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none" placeholder="e.g. 1-3 Years" />
              <div className="flex items-center gap-3 mt-3">
                <input type="checkbox" name="fresherAllowed" checked={formData.fresherAllowed} onChange={handleChange} className="w-5 h-5 accent-emerald-600 rounded" />
                <span className="text-xs font-extrabold text-slate-700">Freshers OK</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Age Limit</label>
              <input type="text" name="ageLimit" value={formData.ageLimit} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none" placeholder="e.g. 24 to 35" />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Qualification</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none" placeholder="e.g. +2 / Degree" />
            </div>
          </div>

          {/* Benefits Checkboxes */}
          <div>
            <label className="block text-xs font-extrabold text-slate-500 mb-3 uppercase">Perks & Allowances</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" name="accommodation" checked={formData.accommodation} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                <span className="text-xs font-bold text-slate-700">Accommodation</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" name="foodProvided" checked={formData.foodProvided} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                <span className="text-xs font-bold text-slate-700">Food Provided</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" name="healthInsurance" checked={formData.healthInsurance} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                <span className="text-xs font-bold text-slate-700">Health Insurance</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" name="providentFund" checked={formData.providentFund} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                <span className="text-xs font-bold text-slate-700">PF (Provident Fund)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" name="travelAllowance" checked={formData.travelAllowance} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                <span className="text-xs font-bold text-slate-700">TA (Travel)</span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" name="dearnessAllowance" checked={formData.dearnessAllowance} onChange={handleChange} className="w-4 h-4 accent-emerald-600 rounded" />
                <span className="text-xs font-bold text-slate-700">DA (Dearness)</span>
              </label>
            </div>
          </div>

          {/* Description & Requirements */}
          <div>
            <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Job Description / Roles</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none resize-none" placeholder="Describe the job roles..." required></textarea>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-500 mb-2 uppercase">Requirements & Skills</label>
            <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-800 focus:bg-white focus:border-emerald-500 outline-none resize-none" placeholder="Basic computer knowledge, languages known..." required></textarea>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={loading} className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30 tracking-wide">
              {loading ? 'Posting...' : 'Publish Job Post'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PostJobModal;