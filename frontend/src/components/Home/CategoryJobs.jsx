import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Login from '../../pages/login';
import ApplyJobModal from './ApplyJobModal';

const CategoryJobs = () => {
  const { categoryId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState(null);
  const [pendingJob, setPendingJob] = useState(null);

  useEffect(() => {
    fetchJobsAndCategory();
  }, [categoryId]);

  const fetchJobsAndCategory = async () => {
    setLoading(true);
    try {
      const catRes = await axios.get('http://127.0.0.1:8000/api/jobs/categories/');
      const currentCat = catRes.data.find(c => c.id === parseInt(categoryId));
      if (currentCat) setCategoryName(currentCat.name);

      const jobsRes = await axios.get('http://127.0.0.1:8000/api/jobs/');
      const filtered = jobsRes.data.filter(job => 
        job.category === parseInt(categoryId) && job.approval_status === 'Approved'
      );
      setJobs(filtered);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply Now Click Action
  const handleApplyClick = (job) => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // User login cheythittillengil: Job save cheythu Login Modal open aakkunnu
      setPendingJob(job);
      setIsLoginOpen(true);
    } else {
      // User already logged in aanengil direct apply modal open aakkunnu
      setApplyingJob(job);
    }
  };

  // Login successful aayi kazhinjaal automatic aayi apply form open aakkunnu
  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    if (pendingJob) {
      setApplyingJob(pendingJob);
      setPendingJob(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb & Header */}
        <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-4 uppercase">
          <Link to="/" className="hover:text-slate-700">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-slate-700">Categories</Link>
          <span>/</span>
          <span className="text-emerald-600">{categoryName || 'Jobs'}</span>
        </div>

        <div className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {categoryName ? `${categoryName} Jobs` : 'Category Jobs'}
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
              {jobs.length} verified opening{jobs.length === 1 ? '' : 's'} available
            </p>
          </div>
          <Link to="/categories" className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-sm">
            ← Other Categories
          </Link>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-20 font-bold text-slate-400">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
            <h3 className="text-lg font-black text-slate-800">No active openings right now</h3>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-black text-[11px] rounded-lg">{job.job_type}</span>
                    {job.salary_range && <span className="px-3 py-1 bg-slate-100 text-slate-700 font-black text-[11px] rounded-lg">{job.salary_range}</span>}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{job.title}</h3>
                  <p className="text-sm font-bold text-slate-500 mt-1">{job.company_name} • {job.location}</p>
                </div>

                <button 
                  onClick={() => handleApplyClick(job)} 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* 1. Login Modal Popup (Login illatha user-kku maathram) */}
      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      {/* 2. Apply Job Modal Popup (Login aayikazhinjathinu shesham auto-fill aavunnu) */}
      <ApplyJobModal 
        isOpen={!!applyingJob} 
        onClose={() => setApplyingJob(null)} 
        job={applyingJob} 
      />
    </div>
  );
};

export default CategoryJobs;