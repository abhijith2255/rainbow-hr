import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = 'https://rainbow-hr.onrender.com';

// Role -> dashboard route. Same mapping is used by Navbar, Hero, CTA and Footer.
export const getDashboardLinkForRole = (role) => {
  if (role === 'admin') return '/admin-dashboard';
  if (role === 'staff') return '/staff-dashboard';
  if (role === 'employer') return '/employer-dashboard';
  if (role === 'candidate') return '/candidate-dashboard';
  return '/';
};

export const getProfileEditLinkForRole = (role) => {
  if (role === 'employer') return '/employer-profile-edit';
  if (role === 'candidate') return '/candidate-profile-edit';
  return '/';
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole'));
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  // A user counts as logged in only when both the token and the role are known.
  const isLoggedIn = Boolean(token && userRole);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setToken(null);
    setUserRole(null);
    setUserName('');
    setProfilePic(null);
  }, []);

  const loadProfile = useCallback(async (activeToken) => {
    if (!activeToken) return;
    try {
      const res = await axios.get(`${API_BASE}/api/accounts/profile/`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      const data = res.data || {};
      setUserName(
        data.full_name || data.fullName || data.company_name || data.companyName ||
        data.username || 'User'
      );
      const pic = data.profile_picture || data.profilePicture || data.company_logo || data.companyLogo;
      setProfilePic(pic ? (pic.startsWith('http') ? pic : `${API_BASE}${pic}`) : null);
    } catch (err) {
      // Expired / invalid token -> clear the session so the UI does not stay "logged in".
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
        return;
      }
      setUserName((prev) => prev || 'User');
    }
  }, [logout]);

  const login = useCallback((newToken, newRole) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    if (newRole && newRole !== 'unassigned') {
      localStorage.setItem('userRole', newRole);
      setUserRole(newRole);
    } else {
      localStorage.removeItem('userRole');
      setUserRole(null);
    }
    loadProfile(newToken);
  }, [loadProfile]);

  // Fetch the profile whenever we have a complete session.
  useEffect(() => {
    if (token && userRole) loadProfile(token);
  }, [token, userRole, loadProfile]);

  // Keep other tabs / windows in sync.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === 'authToken' || event.key === 'userRole') {
        setToken(localStorage.getItem('authToken'));
        setUserRole(localStorage.getItem('userRole'));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const value = {
    isLoggedIn,
    userRole,
    userName,
    profilePic,
    login,
    logout,
    refreshProfile: () => loadProfile(localStorage.getItem('authToken')),
    dashboardLink: getDashboardLinkForRole(userRole),
    profileEditLink: getProfileEditLinkForRole(userRole),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
};

export default AuthContext;
