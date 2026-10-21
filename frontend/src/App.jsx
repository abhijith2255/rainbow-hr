import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Footer from './components/Home/Footer';

// --- Dashboard Imports ---
import AdminDashboard from './components/AdminDashboard/AdminDashboard'; 
import StaffDashboard from './components/StaffDashboard/StaffDashboard';
import CandidateDashboard from './components/CandidateDashboard/CandidateDashboard'; 
import EmployerDashboard from './components/EmployerDashboard/EmployerDashboard'; 
import CandidateProfileEdit from './components/CandidateDashboard/CandidateProfileEdit';
import EmployerProfileEdit from './components/EmployerDashboard/EmployerProfileEdit';

// --- 1. Admin Route ---
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  if (!token || role !== 'admin') return <Navigate to="/" />; 
  return children;
};

// --- 2. Staff Route ---
const StaffRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  if (!token || role !== 'staff') return <Navigate to="/" />;
  return children;
};

// --- 3. Candidate Route ---
const CandidateRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  if (!token || role !== 'candidate') return <Navigate to="/" />;
  return children;
};

// --- 4. Employer Route ---
const EmployerRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  if (!token || role !== 'employer') return <Navigate to="/" />;
  return children;
};

// --- 5. Main Routes & Navbar Logic ---
const AppRoutes = () => {
  const location = useLocation();
  // ഡാഷ്ബോർഡുകളിൽ എത്തുമ്പോൾ മെയിൻ Navbar ഹൈഡ് ചെയ്യാൻ
  const hideNavbar = location.pathname.includes('dashboard');

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Protected Dashboards */}
        <Route 
          path="/admin-dashboard" 
          element={ <AdminRoute><AdminDashboard /></AdminRoute> } 
        />
        <Route 
          path="/staff-dashboard" 
          element={ <StaffRoute><StaffDashboard /></StaffRoute> } 
        />
        <Route 
          path="/candidate-dashboard" 
          element={ <CandidateRoute><CandidateDashboard /></CandidateRoute> } 
        />
        <Route 
          path="/employer-dashboard" 
          element={ <EmployerRoute><EmployerDashboard /></EmployerRoute> } 
        />
        <Route path="/candidate-profile-edit"
               element={ <CandidateRoute><CandidateProfileEdit /></CandidateRoute> } 
        />
        <Route path="/employer-profile-edit" element={ <EmployerRoute><EmployerProfileEdit /></EmployerRoute> } />
      
      </Routes>
      
    </>
  );
};

// --- 6. Main App Component ---
function App() {
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    // വെബ്‌സൈറ്റ് ആദ്യമായി ഓപ്പൺ ചെയ്യുമ്പോഴോ റിഫ്രഷ് ചെയ്യുമ്പോഴോ മാത്രം പ്രീലോഡർ വരും
    const timer = setTimeout(() => {
      setIsPreloading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isPreloading) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[200]">
        <div className="w-16 h-16 border-4 border-slate-800 border-t-emerald-500 rounded-full animate-spin"></div>
        <h2 className="mt-4 text-white font-extrabold text-xl tracking-widest animate-pulse">
          Rainbow<span className="text-emerald-500">HR.</span>
        </h2>
      </div>
    );
  }

  return (
    <Router>
      <div className="font-premium">
        
        {/* Global Styles and Animations */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
          .font-premium { font-family: 'Plus Jakarta Sans', sans-serif; }
          
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes float-img-1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
          @keyframes float-img-2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          @keyframes ripple-effect { 0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(37, 211, 102, 0); } 100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); } }
          @keyframes spin-slow { 100% { transform: rotate(360deg); } }
          @keyframes spin-fast { 100% { transform: rotate(-360deg); } }

          .animate-spin-slow { animation: spin-slow 3s linear infinite; }
          .animate-spin-fast { animation: spin-fast 1.5s linear infinite; }
          .fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
          .delay-100 { animation-delay: 100ms; }
          .delay-200 { animation-delay: 200ms; }
          .delay-300 { animation-delay: 300ms; }
          .animate-float-1 { animation: float-img-1 5s ease-in-out infinite; }
          .animate-float-2 { animation: float-img-2 4s ease-in-out infinite; animation-delay: 1s; }
          .animate-ripple { animation: ripple-effect 2s infinite; }
        `}</style>

        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;