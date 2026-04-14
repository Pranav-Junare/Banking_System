import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';
import AuthPage from './pages/Auth/AuthPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import SendMoneyPage from './pages/SendMoney/SendMoneyPage';
import CardsPage from './pages/Cards/CardsPage';
import PotsPage from './pages/Pots/PotsPage';
import WealthPage from './pages/Wealth/WealthPage';
import CreditPage from './pages/Credit/CreditPage';
import UtilityPage from './pages/Utility/UtilityPage';
import ForexPage from './pages/Forex/ForexPage';

function ProtectedRoute({ children, requireAdmin }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="page-loader"><span className="spinner" /></div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <div className="page-loader"><span className="spinner" /></div>;

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace /> : <AuthPage />} />

      {/* User Routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/send-money" element={<SendMoneyPage />} />
        <Route path="/cards" element={<CardsPage />} />
        <Route path="/pots" element={<PotsPage />} />
        <Route path="/wealth" element={<WealthPage />} />
        <Route path="/credit" element={<CreditPage />} />
        <Route path="/utility" element={<UtilityPage />} />
        <Route path="/forex" element={<ForexPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requireAdmin><Layout /></ProtectedRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/transactions" element={<AdminDashboard />} />
        <Route path="/admin/add-money" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
