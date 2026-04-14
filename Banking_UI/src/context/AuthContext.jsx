import { createContext, useContext, useState, useEffect } from 'react';
import { getDashboard, getAdminDashboard } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await getDashboard();
        setUser(res.data);
      } catch {
        setUser(null);
      }
      try {
        const res = await getAdminDashboard();
        setAdmin(res.data);
      } catch {
        setAdmin(null);
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const loginAsUser = (userData) => {
    setUser(userData);
    setAdmin(null);
  };

  const loginAsAdmin = (adminData) => {
    setAdmin(adminData);
    setUser(null);
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
  };

  const isAuthenticated = !!user || !!admin;
  const isAdmin = !!admin;

  return (
    <AuthContext.Provider value={{
      user, admin, loading,
      isAuthenticated, isAdmin,
      loginAsUser, loginAsAdmin, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
