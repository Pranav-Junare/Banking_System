import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, CreditCard, PiggyBank, Landmark,
  Receipt, Globe, Shield, LogOut, Send, TrendingUp
} from 'lucide-react';
import './Sidebar.css';

const userLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/send-money', icon: Send, label: 'Send Money' },
  { to: '/cards', icon: CreditCard, label: 'Cards' },
  { to: '/pots', icon: PiggyBank, label: 'Savings Pots' },
  { to: '/wealth', icon: TrendingUp, label: 'Wealth (FD/SIP)' },
  { to: '/credit', icon: Landmark, label: 'Credit & Loans' },
  { to: '/utility', icon: Receipt, label: 'Utility' },
  { to: '/forex', icon: Globe, label: 'Forex' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' },
  { to: '/admin/transactions', icon: Receipt, label: 'Global Ledger' },
  { to: '/admin/add-money', icon: Send, label: 'Add Money' },
];

export default function Sidebar() {
  const { user, admin, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const links = isAdmin ? adminLinks : userLinks;
  const displayName = isAdmin ? admin?.name || admin?.aName : user?.name;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -260 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">₹</div>
        <span className="logo-text">Bank</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">
          {isAdmin ? 'ADMINISTRATION' : 'MENU'}
        </div>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* Admin Section (for user view) */}
        {!isAdmin && (
          <>
            <div className="nav-section-label" style={{ marginTop: '1.5rem' }}>
              ADMIN
            </div>
            <NavLink
              to="/"
              className="sidebar-link admin-link"
              onClick={(e) => {
                e.preventDefault();
                logout();
                navigate('/');
              }}
            >
              <Shield size={20} />
              <span>Switch to Admin</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Info & Logout */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {displayName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="user-info">
            <span className="user-name">{displayName || 'User'}</span>
            <span className="user-role">
              {isAdmin ? 'Administrator' : 'Personal Account'}
            </span>
          </div>
        </div>
        <button className="btn-icon sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </motion.aside>
  );
}
