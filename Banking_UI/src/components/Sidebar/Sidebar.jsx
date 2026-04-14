/* ═══════════════════════════════════════════════════════════════════════
   Sidebar Component
   The main navigation sidebar displayed on all authenticated pages.
   Renders different navigation links based on whether the user is a
   regular user or an admin. Includes logo, nav links, and user footer.
   ═══════════════════════════════════════════════════════════════════════ */

import { NavLink, useNavigate } from 'react-router-dom'; /* NavLink for active-state routing, useNavigate for programmatic navigation */
import { useAuth } from '../../context/AuthContext'; /* Custom auth hook for user/admin state */
import { motion } from 'framer-motion'; /* Framer Motion for sidebar slide-in animation */
import {
  LayoutDashboard, /* Dashboard icon */
  CreditCard,      /* Cards icon */
  PiggyBank,       /* Savings pots icon */
  Landmark,        /* Credit & loans icon */
  Receipt,         /* Utility / transactions icon */
  Globe,           /* Forex icon */
  Shield,          /* Admin shield icon */
  LogOut,          /* Logout icon */
  Send,            /* Send money icon */
  TrendingUp,      /* Wealth/investments icon */
  ShieldCheck,     /* KYC shield icon */
  Users,           /* User management icon */
  AlertTriangle,   /* Flagged transactions icon */
  Settings         /* Settings icon */
} from 'lucide-react'; /* Lucide React icon library */
import './Sidebar.css'; /* Import sidebar-specific styles */

/* ─── Navigation Links Configuration ─────────────────────────────────
   Arrays of route objects that define the sidebar navigation items.
   Each object has a `to` (route path), `icon` (Lucide component),
   and `label` (display text) property.
   ───────────────────────────────────────────────────────────────────── */

/* User-mode sidebar links — shown when logged in as a regular user */
const userLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },    /* Main user dashboard */
  { to: '/send-money', icon: Send, label: 'Send Money' },            /* Fund transfer page */
  { to: '/cards', icon: CreditCard, label: 'Cards' },                 /* Virtual cards management */
  { to: '/pots', icon: PiggyBank, label: 'Savings Pots' },           /* Goal-based savings */
  { to: '/wealth', icon: TrendingUp, label: 'Wealth (FD/SIP)' },     /* Fixed deposits & SIPs */
  { to: '/credit', icon: Landmark, label: 'Credit & Loans' },        /* Loan eligibility & apply */
  { to: '/utility', icon: Receipt, label: 'Utility' },                /* Bill payments & recharge */
  { to: '/forex', icon: Globe, label: 'Forex' },                      /* Foreign exchange */
  { to: '/kyc', icon: ShieldCheck, label: 'KYC Status' },             /* User KYC page */
];

/* Admin-mode sidebar links — shown when logged in as an admin */
/* Each route maps to a specific admin tab in AdminDashboard */
const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', end: true },       /* Admin overview — uses 'end' for exact match */
  { to: '/admin/kyc', icon: ShieldCheck, label: 'KYC Queue' },                /* KYC verification queue */
  { to: '/admin/users', icon: Users, label: 'User Management' },              /* User search & management */
  { to: '/admin/loans', icon: Receipt, label: 'Loan Underwriting' },          /* Loan approval queue */
  { to: '/admin/tickets', icon: Receipt, label: 'Support Tickets' },          /* Support tickets queue */
  { to: '/admin/transactions', icon: AlertTriangle, label: 'Flagged Txns' },  /* Flagged transaction review */
  { to: '/admin/add-money', icon: Send, label: 'Add Money' },                 /* Add money to user accounts */
];

/* ─── Sidebar Component ──────────────────────────────────────────────
   The main exported sidebar component. Reads auth state to determine
   which navigation links to render (user vs admin).
   ───────────────────────────────────────────────────────────────────── */
export default function Sidebar() {
  /* Destructure auth state — user data, admin data, role, and logout function */
  const { user, admin, isAdmin, logout } = useAuth();

  /* Hook for programmatic navigation (used for logout redirect) */
  const navigate = useNavigate();

  /* Choose the correct link set based on user role */
  const links = isAdmin ? adminLinks : userLinks;

  /* Determine the display name from admin or user data */
  const displayName = isAdmin ? admin?.name || admin?.aName : user?.name;

  /* ─── Logout Handler ─────────────────────────────────────────────
     Clears auth state and redirects to the login page.
     ───────────────────────────────────────────────────────────────── */
  const handleLogout = () => {
    logout();       /* Clear user/admin state from context */
    navigate('/');   /* Redirect to the auth/login page */
  };

  return (
    /* Animated sidebar with slide-in from left on mount */
    <motion.aside
      className="sidebar"
      initial={{ x: -260 }}                          /* Start off-screen to the left */
      animate={{ x: 0 }}                             /* Slide into view */
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }} /* Smooth easing */
    >
      {/* ── Logo Section ── */}
      {/* Brand logo at the top of the sidebar */}
      <div className="sidebar-logo">
        <div className="logo-icon">₹</div>           {/* Rupee symbol as logo icon */}
        <span className="logo-text">PranavBank</span> {/* Bank name text */}
      </div>

      {/* ── Navigation Section ── */}
      {/* Scrollable navigation area with links */}
      <nav className="sidebar-nav">
        {/* Section label — shows "ADMINISTRATION" for admin, "MENU" for user */}
        <div className="nav-section-label">
          {isAdmin ? 'ADMINISTRATION' : 'MENU'}
        </div>

        {/* Map through the link array and render each NavLink */}
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}                                 /* Unique key for React reconciliation */
            to={to}                                  /* Route path for navigation */
            end={end || false}                       /* Exact match for /admin to avoid highlighting on sub-routes */
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`  /* Apply 'active' class when route matches */
            }
          >
            <Icon size={20} />                       {/* Navigation icon */}
            <span>{label}</span>                     {/* Navigation label text */}
          </NavLink>
        ))}

        {/* ── Switch to Admin (shown only for regular users) ── */}
        {/* Allows users to log out and switch to admin login */}
        {!isAdmin && (
          <>
            {/* Divider label for admin section */}
            <div className="nav-section-label" style={{ marginTop: '1.5rem' }}>
              ADMIN
            </div>
            {/* Switch to Admin link — triggers logout and redirects to login */}
            <NavLink
              to="/"
              className="sidebar-link admin-link"
              onClick={(e) => {
                e.preventDefault();  /* Prevent default navigation */
                logout();            /* Clear current session */
                navigate('/');       /* Redirect to login page */
              }}
            >
              <Shield size={20} />            {/* Admin shield icon */}
              <span>Switch to Admin</span>    {/* Link text */}
            </NavLink>
          </>
        )}
      </nav>

      {/* ── Footer Section ── */}
      {/* Shows the logged-in user's info and logout button */}
      <div className="sidebar-footer">
        {/* User avatar and info */}
        <div className="sidebar-user">
          {/* Avatar circle with first letter of user's name */}
          <div className="user-avatar">
            {displayName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          {/* User name and role text */}
          <div className="user-info">
            <span className="user-name">{displayName || 'User'}</span>
            <span className="user-role">
              {isAdmin ? 'Administrator' : 'Personal Account'}
            </span>
          </div>
        </div>
        {/* Logout button — icon-only circular button */}
        <button className="btn-icon sidebar-logout" onClick={handleLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </motion.aside>
  );
}
