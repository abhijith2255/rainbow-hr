import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Edit Modal States
  const [editCategory, setEditCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');

  const role = localStorage.getItem('userRole'); 
  const dashboardLink = role === 'staff' ? '/staff-dashboard' : '/admin-dashboard';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/categories/');
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Category Name is required!");
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('http://127.0.0.1:8000/api/jobs/categories/', 
        { name, icon },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert("Category added successfully!");
      setName(''); setIcon('');
      fetchCategories(); 
    } catch (error) {
      alert("Error: " + JSON.stringify(error.response?.data || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if(!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://127.0.0.1:8000/api/jobs/categories/${id}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchCategories();
    } catch (error) {
      alert("Failed to delete category.");
    }
  };

  const openEditModal = (cat) => {
    setEditCategory(cat);
    setEditName(cat.name);
    setEditIcon(cat.icon || '');
  };

  const handleUpdateCategory = async () => {
    if (!editName.trim()) return alert("Category Name is required!");
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://127.0.0.1:8000/api/jobs/categories/${editCategory.id}/`, 
        { name: editName, icon: editIcon },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      alert("Category updated successfully!");
      setEditCategory(null);
      fetchCategories();
    } catch (error) {
      alert("Failed to update. " + JSON.stringify(error.response?.data || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm hidden md:flex">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-3xl font-black tracking-tighter text-slate-900">Rainbow<span className="text-emerald-500">HR.</span></h2>
          <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1 block bg-emerald-50 w-max px-2 py-1 rounded">
            {role === 'staff' ? 'Staff Portal' : 'Admin Portal'}
          </span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <Link to={dashboardLink} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-extrabold text-slate-500 hover:bg-slate-50 transition-all">
            Dashboard
          </Link>
          <div className="w-full flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-3.5 rounded-xl font-extrabold border border-emerald-100">
            Manage Categories
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Categories</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Add and manage job categories for the platform.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Category Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Category</h3>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Software & IT" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Icon Name (Optional)</label>
                  <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. monitor, code" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm" />
                </div>
                <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all">
                  {isSaving ? 'Saving...' : 'Add Category'}
                </button>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Existing Categories</h3>
              {loading ? (
                <p className="text-slate-500">Loading...</p>
              ) : categories.length === 0 ? (
                <p className="text-slate-500 font-medium">No categories added yet.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex flex-col justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:border-emerald-200 transition-all">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-xl">
                          {cat.icon ? <span>💠</span> : <span className="font-black text-emerald-600">{cat.name.charAt(0)}</span>}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{cat.name}</h4>
                          {cat.icon && <p className="text-xs text-slate-400 font-medium">Icon: {cat.icon}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2 border-t border-slate-200 pt-3 mt-auto">
                        <button onClick={() => openEditModal(cat)} className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors">Edit</button>
                        <button onClick={() => handleDeleteCategory(cat.id)} className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editCategory && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900">Edit Category</h2>
              <button onClick={() => setEditCategory(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Icon Name (Optional)</label>
                <input type="text" value={editIcon} onChange={(e) => setEditIcon(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditCategory(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
                <button onClick={handleUpdateCategory} className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCategories;