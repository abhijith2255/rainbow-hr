import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Layers, Menu, X, PencilLine, Trash2, Plus } from 'lucide-react';
import { CategoryIcon } from './Home/categoryVisuals';

// `embedded` prop:
//   - true  -> StaffDashboard-inu ullile oru tab aayi render cheyyunnu (sidebar illa)
//   - false -> /admin/categories, /staff/categories enna standalone route-ukalil
//              swantham responsive drawer shell-ode render cheyyunnu
const ManageCategories = ({ embedded = false }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // Mobile-il standalone sidebar drawer open/close control cheyyan
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      const res = await axios.get('https://rainbow-hr.onrender.com/api/jobs/categories/');
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
      await axios.post('https://rainbow-hr.onrender.com/api/jobs/categories/', 
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
      await axios.delete(`https://rainbow-hr.onrender.com/api/jobs/categories/${id}/`, {
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
      await axios.put(`https://rainbow-hr.onrender.com/api/jobs/categories/${editCategory.id}/`, 
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

  // Pothuvaaya content — embedded aayalum standalone aayalum ithu thanne kaanikkunnu
  const content = (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Add Category Form */}
      <div className="lg:col-span-1">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h3 className="text-lg font-black text-slate-900">Add New Category</h3>
          </div>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Software & IT" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Icon Name (Optional)</label>
              <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="e.g. monitor, code" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 font-bold text-sm" />
            </div>
            <button type="submit" disabled={isSaving} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60">
              {isSaving ? 'Saving...' : 'Add Category'}
            </button>
          </form>
        </div>
      </div>

      {/* Categories List */}
      <div className="lg:col-span-2">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-4">Existing Categories</h3>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : categories.length === 0 ? (
            <p className="text-slate-500 font-medium">No categories added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="flex flex-col justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-emerald-600 shrink-0">
                      <CategoryIcon iconName={cat.icon} className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">{cat.name}</h4>
                      {cat.icon && <p className="text-xs text-slate-400 font-medium truncate">Icon: {cat.icon}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 border-t border-slate-200 pt-3 mt-auto">
                    <button onClick={() => openEditModal(cat)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                      <PencilLine className="w-3.5 h-3.5" strokeWidth={2.5} /> Edit
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Edit Modal (ethu mode-ilum reuse cheyyunnu)
  const editModal = editCategory && (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4 sm:p-0">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-900">Edit Category</h2>
          <button onClick={() => setEditCategory(null)} aria-label="Close" className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
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
  );

  // StaffDashboard-inullil tab aayirikkumbol sidebar onnum venda (double sidebar ozhivakkan)
  if (embedded) {
    return (
      <>
        {content}
        {editModal}
      </>
    );
  }

  // Standalone page (own sidebar-ode)
  return (
    <div className="min-h-screen bg-slate-50 font-premium">

      {/* Mobile top bar — sidebar drawer thurakkanulla hamburger */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
          className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors"
        >
          <Menu className="w-5 h-5" strokeWidth={2.5} />
        </button>
        <h2 className="text-xl font-black tracking-tighter text-slate-900">Rainbow<span className="text-emerald-500">HR.</span></h2>
        <div className="w-10 h-10" />
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-white border-r border-slate-200 flex flex-col shadow-sm transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 lg:p-8 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">Rainbow<span className="text-emerald-500">HR.</span></h2>
            <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1 block bg-emerald-50 w-max px-2 py-1 rounded">
              {role === 'staff' ? 'Staff Portal' : 'Admin Portal'}
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className="lg:hidden w-9 h-9 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-6">
          <Link
            to={dashboardLink}
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-extrabold text-slate-500 hover:bg-slate-50 transition-all"
          >
            <LayoutDashboard className="w-5 h-5" strokeWidth={2.5} />
            Dashboard
          </Link>
          <div className="w-full flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-3.5 rounded-xl font-extrabold border border-emerald-100">
            <Layers className="w-5 h-5" strokeWidth={2.5} />
            Manage Categories
          </div>
        </nav>
      </aside>

      <main className="lg:pl-72">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-10">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Job Categories</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Add and manage job categories for the platform.</p>
          </header>
          {content}
        </div>
      </main>

      {editModal}
    </div>
  );
};

export default ManageCategories;
