/* ═══════════════════════════════════════════════════════════════════════
   App Component — Root Application Entry Point
   Configures React Router with all application routes, authentication
   guards, and role-based access control. Wraps the entire app with
   the AuthProvider context and BrowserRouter for client-side routing.
   ═══════════════════════════════════════════════════════════════════════ */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; /* React Router for client-side navigation */
import { AuthProvider, useAuth } from './context/AuthContext'; /* Auth context provider and consumer hook */
import Layout from './layouts/Layout'; /* Shared layout wrapper with sidebar */
import AuthPage from './pages/Auth/AuthPage'; /* Login/signup page */
import DashboardPage from './pages/Dashboard/DashboardPage'; /* User dashboard */
import AdminDashboard from './pages/Admin/AdminDashboard'; /* Admin command center */
import SendMoneyPage from './pages/SendMoney/SendMoneyPage'; /* Send money transfer page */
import CardsPage from './pages/Cards/CardsPage'; /* Virtual cards management page */
import PotsPage from './pages/Pots/PotsPage'; /* Savings pots page */
import WealthPage from './pages/Wealth/WealthPage'; /* Fixed deposits & SIP page */
import CreditPage from './pages/Credit/CreditPage'; /* Credit & loans page */
import UtilityPage from './pages/Utility/UtilityPage'; /* Utility bill payments page */
import ForexPage from './pages/Forex/ForexPage'; /* Forex exchange page */
import UserKycPage from './pages/Kyc/UserKycPage'; /* User KYC page */

/* ═══════════════════════════════════════════════════════════════════════
   ProtectedRoute Component
   A wrapper component that guards routes from unauthorized access.
   Checks if the user is authenticated (and optionally if they are admin)
   before rendering the child components. Redirects to login or dashboard.
   ═══════════════════════════════════════════════════════════════════════ */
function ProtectedRoute({ children, requireAdmin }) {
  /* Destructure authentication state from the auth context */
  const { isAuthenticated, isAdmin, loading } = useAuth();

  /* Show a loading spinner while the auth session is being restored */
  if (loading) return <div className="page-loader"><span className="spinner" /></div>;

  /* If the user is not authenticated, redirect them to the login page */
  if (!isAuthenticated) return <Navigate to="/" replace />;

  /* If the route requires admin access but the user is not an admin, redirect to user dashboard */
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;

  /* All checks passed — render the protected children */
  return children;
}

/* ═══════════════════════════════════════════════════════════════════════
   AppRoutes Component
   Defines all application routes organized by role (user vs admin).
   Uses nested routing with Layout for consistent sidebar + main content.
   ═══════════════════════════════════════════════════════════════════════ */
function AppRoutes() {
  /* Get authentication state to handle the root "/" redirect logic */
  const { isAuthenticated, isAdmin, loading } = useAuth();

  /* Show a loading spinner while checking the initial auth session */
  if (loading) return <div className="page-loader"><span className="spinner" /></div>;

  return (
    <Routes>
      {/* ── Root Route ─────────────────────────────────────────────────
         If authenticated, redirect to the appropriate dashboard.
         If not authenticated, show the login/signup page.
         ─────────────────────────────────────────────────────────────── */}
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
            : <AuthPage />
        }
      />

      {/* ── User Routes ────────────────────────────────────────────────
         Protected routes for regular (non-admin) users.
         All wrapped in the Layout component which provides the sidebar.
         ─────────────────────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />      {/* User dashboard */}
        <Route path="/send-money" element={<SendMoneyPage />} />     {/* Send money page */}
        <Route path="/cards" element={<CardsPage />} />               {/* Virtual cards page */}
        <Route path="/pots" element={<PotsPage />} />                 {/* Savings pots page */}
        <Route path="/wealth" element={<WealthPage />} />             {/* Wealth management page */}
        <Route path="/credit" element={<CreditPage />} />             {/* Credit & loans page */}
        <Route path="/utility" element={<UtilityPage />} />           {/* Utility payments page */}
        <Route path="/forex" element={<ForexPage />} />               {/* Forex exchange page */}
        <Route path="/kyc" element={<UserKycPage />} />               {/* User KYC page */}
      </Route>

      {/* ── Admin Routes ───────────────────────────────────────────────
         Protected routes requiring admin role.
         Each route renders AdminDashboard which reads the URL path
         to determine which tab/view to display.
         ─────────────────────────────────────────────────────────────── */}
      <Route element={<ProtectedRoute requireAdmin><Layout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />               {/* Admin overview */}
        <Route path="/admin/kyc" element={<AdminDashboard />} />           {/* KYC queue tab */}
        <Route path="/admin/users" element={<AdminDashboard />} />         {/* User management tab */}
        <Route path="/admin/loans" element={<AdminDashboard />} />         {/* Loan underwriting tab */}
        <Route path="/admin/tickets" element={<AdminDashboard />} />       {/* Support tickets tab */}
        <Route path="/admin/transactions" element={<AdminDashboard />} />  {/* Flagged transactions tab */}
        <Route path="/admin/add-money" element={<AdminDashboard />} />     {/* Add money tab */}
      </Route>

      {/* ── Catch-All Route ────────────────────────────────────────────
         Any unmatched URL redirects to the root "/" route.
         ─────────────────────────────────────────────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   App Component — Main Export
   The root component that wraps the entire application with:
   1. BrowserRouter — enables client-side routing
   2. AuthProvider — provides authentication context to all children
   3. AppRoutes — renders the appropriate page based on the URL
   ═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
