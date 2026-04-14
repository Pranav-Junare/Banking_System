/* ═══════════════════════════════════════════════════════════════════════
   AuthContext — Authentication State Management
   Provides global authentication state for user and admin sessions.
   Uses React Context to share auth data (user, admin, login, logout)
   across all components without prop drilling.
   ═══════════════════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect } from 'react'; /* React hooks for context and state */
import { getDashboard, getAdminDashboard } from '../api/api'; /* API calls to check existing sessions */

/* Create the AuthContext with a default value of null */
/* This context will hold the authentication state and helper functions */
const AuthContext = createContext(null);

/* ═══════════════════════════════════════════════════════════════════════
   AuthProvider Component
   Wraps the entire app to provide authentication state.
   On mount, it attempts to restore sessions by calling the dashboard
   APIs (which rely on HTTP-only cookies for session authentication).
   ═══════════════════════════════════════════════════════════════════════ */
export function AuthProvider({ children }) {
  /* State for the regular user's session data (name, balance, etc.) */
  const [user, setUser] = useState(null);

  /* State for the admin user's session data (name, permissions, etc.) */
  const [admin, setAdmin] = useState(null);

  /* Loading state — true while checking for existing sessions on mount */
  const [loading, setLoading] = useState(true);

  /* ─── Session Restoration on Mount ─────────────────────────────────
     When the app first loads, try to call both dashboard APIs.
     If a session cookie exists, the API will return user/admin data.
     This allows users to stay logged in across page refreshes.
     ─────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const checkSession = async () => {
      /* Try to restore the regular user session */
      try {
        const res = await getDashboard(); /* Call user dashboard API */
        setUser(res.data);                /* Set user data if session is valid */
      } catch {
        setUser(null); /* No valid user session — clear state */
      }

      /* Try to restore the admin session */
      try {
        const res = await getAdminDashboard(); /* Call admin dashboard API */
        setAdmin(res.data);                    /* Set admin data if session is valid */
      } catch {
        setAdmin(null); /* No valid admin session — clear state */
      }

      /* Done checking sessions — hide the loading spinner */
      setLoading(false);
    };

    checkSession(); /* Execute the session check */
  }, []); /* Empty dependency array — run only once on mount */

  /* ─── Login Functions ──────────────────────────────────────────────
     Called after successful login API calls to update the auth state.
     Each login function clears the other role's state to prevent
     conflicting sessions.
     ─────────────────────────────────────────────────────────────────── */

  /* Log in as a regular user — clears any admin state */
  const loginAsUser = (userData) => {
    setUser(userData);  /* Set the user session data */
    setAdmin(null);     /* Clear admin state to prevent role confusion */
  };

  /* Log in as an admin — clears any user state */
  const loginAsAdmin = (adminData) => {
    setAdmin(adminData); /* Set the admin session data */
    setUser(null);       /* Clear user state to prevent role confusion */
  };

  /* Refresh user session data */
  const refreshUser = async () => {
    try {
      const res = await getDashboard();
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  /* ─── Logout Function ──────────────────────────────────────────────
     Clears both user and admin state, effectively ending the session.
     Note: The backend session cookie should also be invalidated
     via an API call in production scenarios.
     ─────────────────────────────────────────────────────────────────── */
  const logout = () => {
    setUser(null);   /* Clear user session */
    setAdmin(null);  /* Clear admin session */
  };

  /* ─── Derived State ────────────────────────────────────────────────
     Computed boolean values for easy access throughout the app.
     ─────────────────────────────────────────────────────────────────── */
  const isAuthenticated = !!user || !!admin; /* True if any session exists */
  const isAdmin = !!admin;                   /* True if logged in as admin */

  /* ─── Provide Context Value ────────────────────────────────────────
     Expose all auth state and functions to child components via context.
     Any component can access these via the useAuth() hook.
     ─────────────────────────────────────────────────────────────────── */
  return (
    <AuthContext.Provider value={{
      user,              /* Regular user data object */
      admin,             /* Admin user data object */
      loading,           /* Whether session check is in progress */
      isAuthenticated,   /* Boolean — is any user logged in? */
      isAdmin,           /* Boolean — is the logged-in user an admin? */
      loginAsUser,       /* Function to set user session */
      loginAsAdmin,      /* Function to set admin session */
      logout,            /* Function to clear all sessions */
      refreshUser        /* Function to refresh user session data */
    }}>
      {children}         {/* Render all child components with access to auth context */}
    </AuthContext.Provider>
  );
}

/* ─── useAuth Hook ───────────────────────────────────────────────────
   Convenience hook for consuming the AuthContext in any component.
   Usage: const { user, isAuthenticated, logout } = useAuth();
   ───────────────────────────────────────────────────────────────────── */
export const useAuth = () => useContext(AuthContext);
