import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryJobs = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobsAndCategory();
  }, [categoryId]);

  const fetchJobsAndCategory = async () => {
    setLoading(true);
    try {
      const catRes = await axios.get('http://127.0.0.1:8000/api/jobs/categories/');
      const currentCat = catRes.data.find(c => c.id === parseInt(categoryId));
      if (currentCat) setCategoryName(currentCat.name);

      const token = localStorage.getItem('authToken');
      const jobsRes = await axios.get('http://127.0.0.1:8000/api/jobs/?public=true', {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const filtered = (Array.isArray(jobsRes.data) ? jobsRes.data : []).filter(
        job => job.category === parseInt(categoryId)
      );
      setJobs(filtered);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 md:pt-32 pb-16 px-6">
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
              <div
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-black text-[11px] rounded-lg">{job.job_type}</span>
                    {job.salary_range && <span className="px-3 py-1 bg-slate-100 text-slate-700 font-black text-[11px] rounded-lg">{job.salary_range}</span>}
                    {job.has_applied && <span className="px-3 py-1 bg-emerald-600 text-white font-black text-[11px] rounded-lg uppercase tracking-wide">Applied</span>}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{job.title}</h3>
                  <p className="text-sm font-bold text-slate-500 mt-1">{job.company_name} • {job.location}</p>
                </div>

                <span className="inline-flex items-center gap-2 bg-emerald-600 text-white font-black text-xs py-3.5 px-6 rounded-xl shadow-md shadow-emerald-600/20 whitespace-nowrap">
                  View Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryJobs;
