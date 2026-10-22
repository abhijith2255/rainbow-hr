import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Footer from './components/Home/Footer';
import AllCategories from './components/Home/AllCategories';
import CategoryJobs from './components/Home/CategoryJobs';
import AllJobs from './components/Home/AllJobs';
import JobDetails from './components/Home/JobDetails';
import { AuthProvider } from './context/AuthContext';

// --- Dashboard Imports ---
import AdminDashboard from './components/AdminDashboard/AdminDashboard'; 
import AdminJobApprovals from './components/AdminDashboard/AdminJobApprovals'; // പുതിയ പേജ് 1
import AdminStaffs from './components/AdminDashboard/AdminStaffs';       
import StaffJobApprovals from './components/StaffDashboard/StaffJobApprovals';  
import ManageCategories from './components/ManageCategories';   // പുതിയ പേജ് 2

import StaffDashboard from './components/StaffDashboard/StaffDashboard';
import CandidateDashboard from './components/CandidateDashboard/CandidateDashboard'; 
import EmployerDashboard from './components/EmployerDashboard/EmployerDashboard'; 
import EmployerJobs from './components/EmployerDashboard/EmployerJobs';
import EmployerApplications from './components/EmployerDashboard/EmployerApplications';
import CandidateProfileEdit from './components/CandidateDashboard/CandidateProfileEdit';
import SavedJobs from './components/CandidateDashboard/SavedJobs';
import ApplicationTimeline from './components/CandidateDashboard/ApplicationTimeline';
import EmployerProfileEdit from './components/EmployerDashboard/EmployerProfileEdit';
import ATSPipeline from './components/EmployerDashboard/ATSPipeline';
import JobAnalytics from './components/EmployerDashboard/JobAnalytics';
import ModerationAuditLog from './components/AdminDashboard/ModerationAuditLog';
import AdminEmployers from './components/AdminDashboard/AdminEmployers';
import AdminCandidates from './components/AdminDashboard/AdminCandidates';
import AdminApplications from './components/AdminDashboard/AdminApplications';
import StaffActivity from './components/AdminDashboard/StaffActivity';

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
  
  // Admin / Staff ഡാഷ്ബോർഡുകൾക്ക് മാത്രം മെയിൻ Navbar/Footer ഹൈഡ് ചെയ്യുന്നു.
  // Employer, Candidate ഡാഷ്ബോർഡുകളിലും Profile പേജുകളിലും Navbar + Footer കാണിക്കുന്നു.
  const hideNavbar = 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/staff');
  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* --- Protected Admin Routes --- */}
        <Route 
          path="/admin-dashboard" 
          element={ <AdminRoute><AdminDashboard /></AdminRoute> } 
        />
        <Route 
          path="/admin/approvals" 
          element={ <AdminRoute><AdminJobApprovals /></AdminRoute> } 
        />
        <Route 
          path="/admin/staffs" 
          element={ <AdminRoute><AdminStaffs /></AdminRoute> } 
        />

        {/* --- Other Dashboards --- */}
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
        {/* Employer dedicated sub-pages */}
        <Route 
          path="/employer/jobs" 
          element={ <EmployerRoute><EmployerJobs /></EmployerRoute> } 
        />
        <Route 
          path="/employer/applications" 
          element={ <EmployerRoute><EmployerApplications /></EmployerRoute> } 
        />
        <Route 
          path="/candidate-profile-edit"
          element={ <CandidateRoute><CandidateProfileEdit /></CandidateRoute> } 
        />
        <Route 
          path="/employer-profile-edit" 
          element={ <EmployerRoute><EmployerProfileEdit /></EmployerRoute> } 
        />

        {/* Employer: ATS Pipeline & Job Analytics (dedicated sub-pages) */}
        <Route 
          path="/employer/pipeline" 
          element={ <EmployerRoute><ATSPipeline /></EmployerRoute> } 
        />
        <Route 
          path="/employer/analytics" 
          element={ <EmployerRoute><JobAnalytics /></EmployerRoute> } 
        />

        {/* Candidate: Saved Jobs & Application Timeline (dedicated sub-pages) */}
        <Route 
          path="/candidate/saved-jobs" 
          element={ <CandidateRoute><SavedJobs /></CandidateRoute> } 
        />
        <Route 
          path="/candidate/applications" 
          element={ <CandidateRoute><ApplicationTimeline /></CandidateRoute> } 
        />

        {/* Moderation Audit Log (Admin + Staff) */}
        <Route path="/admin/audit-logs" element={<AdminRoute><ModerationAuditLog /></AdminRoute>} />
        <Route path="/staff/audit-logs" element={<StaffRoute><ModerationAuditLog /></StaffRoute>} />

        {/* Admin detail sub-pages (analytics cards-ൽ നിന്ന് navigate ചെയ്യുന്നു) */}
        <Route path="/admin/employers" element={<AdminRoute><AdminEmployers /></AdminRoute>} />
        <Route path="/admin/candidates" element={<AdminRoute><AdminCandidates /></AdminRoute>} />
        <Route path="/admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
        <Route path="/admin/staff-activity" element={<AdminRoute><StaffActivity /></AdminRoute>} />

        {/* Staff detail sub-pages (ഇതേ പേജുകൾ Staff-നും ലഭ്യം) */}
        <Route path="/staff/employers" element={<StaffRoute><AdminEmployers /></StaffRoute>} />
        <Route path="/staff/candidates" element={<StaffRoute><AdminCandidates /></StaffRoute>} />
        <Route path="/staff/applications" element={<StaffRoute><AdminApplications /></StaffRoute>} />

        <Route path="/admin/categories" element={<AdminRoute><ManageCategories /></AdminRoute>} />
        <Route path="/staff/categories" element={<StaffRoute><ManageCategories /></StaffRoute>} />
        <Route 
  path="/staff/approvals" 
  element={ <StaffRoute><StaffJobApprovals /></StaffRoute> } 
/>
<Route path="/categories" element={<AllCategories />} />
        <Route path="/categories/:categoryId/jobs" element={<CategoryJobs />} />
        {/* എല്ലാ ജോബുകളും + ഒരു ജോബിന്റെ വിശദാംശങ്ങൾ */}
        <Route path="/jobs" element={<AllJobs />} />
        <Route path="/jobs/:jobId" element={<JobDetails />} />
      </Routes>

      {/* Navbar ഉള്ള എല്ലാ പേജുകളിലും Footer-ഉം സ്ഥിരമായി കാണിക്കുന്നു */}
      {!hideNavbar && <Footer />}
    </>
  );
};

// --- 6. Main App Component ---
function App() {
  return (
    <Router>
      <AuthProvider>
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
      </AuthProvider>
    </Router>
  );
}

export default App;