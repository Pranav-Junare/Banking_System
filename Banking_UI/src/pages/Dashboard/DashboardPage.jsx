/* ═══════════════════════════════════════════════════════════════════════
   DashboardPage Component — User Dashboard
   The main landing page for authenticated users. Displays a greeting,
   account balance, quick action buttons, stat cards, and recent
   transaction history. Falls back to dummy data when the API is offline.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'; /* React hooks for state and lifecycle */
import { motion } from 'framer-motion'; /* Framer Motion for staggered animations */
import { useAuth } from '../../context/AuthContext'; /* Auth hook to get user data */
import { getDashboard, getHistory, createSupportTicket, downloadStatement } from '../../api/api'; /* API calls for dashboard data */
import {
  ArrowUpRight,   /* Icon for sent transactions */
  ArrowDownLeft,   /* Icon for received transactions */
  Send,            /* Icon for send money action */
  Plus,            /* Icon for save/add action */
  TrendingUp,      /* Icon for invest action */
  CreditCard,      /* Icon for cards action */
  Wallet,           /* Icon for account status */
  AlertTriangle,     /* Icon for report fraud */
  Download           /* Icon for download statement */
} from 'lucide-react'; /* Lucide React icon library */
import { useNavigate } from 'react-router-dom'; /* Hook for navigation to other pages */
import './Dashboard.css'; /* Dashboard page specific styles */

/* ─── Greeting Helper Function ───────────────────────────────────────
   Returns a time-appropriate greeting based on the current hour.
   Used in the dashboard header to personalize the experience.
   ───────────────────────────────────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours(); /* Get the current hour (0-23) */
  if (h < 12) return 'Good morning';    /* Before noon */
  if (h < 17) return 'Good afternoon';  /* Noon to 5pm */
  return 'Good evening';                /* After 5pm */
}

/* ─── Dummy Transaction Data ─────────────────────────────────────────
   Fallback transactions shown when the backend API is unavailable.
   Provides a realistic preview of the transaction history feature.
   ───────────────────────────────────────────────────────────────────── */
const DUMMY_TRANSACTIONS = [
  { transactionId: 'TXN-1001', receiverName: 'Rahul Sharma', amount: 2500, type: 'sent' },
  { transactionId: 'TXN-1002', receiverName: 'Priya Patel', amount: 1800, type: 'sent' },
  { transactionId: 'TXN-1003', receiverName: 'Amit Kumar', amount: 5000, type: 'sent' },
  { transactionId: 'TXN-1004', receiverName: 'Neha Singh', amount: 3200, type: 'sent' },
  { transactionId: 'TXN-1005', receiverName: 'Vikram Reddy', amount: 750, type: 'sent' },
  { transactionId: 'TXN-1006', receiverName: 'Ananya Iyer', amount: 1500, type: 'sent' },
];

/* ─── Animation Variants ─────────────────────────────────────────────
   Framer Motion variants for staggered entrance animations.
   The container staggers its children, each child fades in and slides up.
   ───────────────────────────────────────────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },                /* Container starts invisible */
  show: {
    opacity: 1,                           /* Container becomes visible */
    transition: { staggerChildren: 0.1 }, /* Stagger child animations by 100ms */
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },            /* Start hidden and 20px below */
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }, /* Fade in and slide up */
};

/* ═══════════════════════════════════════════════════════════════════════
   DashboardPage Component
   ═══════════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  /* Get the authenticated user data from context */
  const { user } = useAuth();

  /* Navigation hook for routing to other pages on button click */
  const navigate = useNavigate();

  /* State for the dashboard API response data (balance, name, etc.) */
  const [dashData, setDashData] = useState(null);

  /* State for the transaction history array */
  const [transactions, setTransactions] = useState([]);

  /* Loading state — shows skeleton loaders while fetching data */
  const [loading, setLoading] = useState(true);

  /* ─── Fetch Dashboard Data on Mount ────────────────────────────────
     Calls the dashboard and history APIs in parallel, then falls
     back to dummy data if either call fails (backend offline).
     ─────────────────────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        /* Fetch dashboard data and transaction history simultaneously */
        const [dashRes, histRes] = await Promise.allSettled([
          getDashboard(), /* Get user balance, name, account info */
          getHistory(),   /* Get recent transaction history */
        ]);

        /* Set dashboard data if the API call succeeded */
        if (dashRes.status === 'fulfilled') setDashData(dashRes.value.data);

        /* Set transaction data if the API call succeeded */
        if (histRes.status === 'fulfilled' && histRes.value.data.length > 0) {
          setTransactions(histRes.value.data);
        } else {
          /* Fall back to dummy transactions if API returned empty or failed */
          setTransactions(DUMMY_TRANSACTIONS);
        }
      } catch {
        /* If both API calls fail, use dummy data */
        setTransactions(DUMMY_TRANSACTIONS);
      }
      setLoading(false); /* Stop showing skeleton loaders */
    };
    fetchData(); /* Execute the data fetch */
  }, []); /* Empty dependency — run only once on mount */

  /* Extract the balance from dashboard data, defaulting to 1,25,000 for demo */
  const balance = dashData?.balance ?? 125000;

  /* Get the display name from API data or user context, with fallback */
  const displayName = dashData?.name || user?.name || 'User';

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <motion.div
      className="dashboard-page"
      variants={containerVariants}   /* Apply stagger animation to children */
      initial="hidden"               /* Start with hidden state */
      animate="show"                 /* Animate to show state */
    >
      {/* ── Header Section ── */}
      {/* Personalized greeting with time-based message */}
      <motion.div className="dash-header" variants={itemVariants}>
        <div>
          <h1 className="dash-greeting">{getGreeting()}, {displayName}!</h1>
          <p className="dash-subtitle">Here's what's happening with your money today.</p>
        </div>
      </motion.div>

      {/* ── Balance Card ── */}
      {/* Large gradient card showing total balance and quick actions */}
      <motion.div className="balance-section" variants={itemVariants}>
        <div className="balance-card glass-card">
          {/* Balance label */}
          <div className="balance-label">Total Balance</div>
          {/* Balance amount — shows skeleton while loading */}
          <div className="balance-amount">
            <span className="currency">₹</span>
            {loading ? (
              /* Skeleton placeholder for the balance number */
              <span className="skeleton" style={{ width: 140, height: 40, display: 'inline-block' }} />
            ) : (
              /* Animated balance number */
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}   /* Start small and hidden */
                animate={{ opacity: 1, scale: 1 }}      /* Grow to full size */
                transition={{ duration: 0.5, delay: 0.2 }} /* Delayed entrance */
              >
                {Number(balance).toLocaleString('en-IN')} {/* Format with Indian locale */}
              </motion.span>
            )}
          </div>
          {/* Quick action buttons for common operations */}
          <div className="balance-actions">
            {/* Send money button */}
            <button className="action-btn" onClick={() => navigate('/send-money')}>
              <div className="action-icon"><Send size={20} /></div>
              <span>Send</span>
            </button>
            {/* Save to pot button */}
            <button className="action-btn" onClick={() => navigate('/pots')}>
              <div className="action-icon"><Plus size={20} /></div>
              <span>Save</span>
            </button>
            {/* View cards button */}
            <button className="action-btn" onClick={() => navigate('/cards')}>
              <div className="action-icon"><CreditCard size={20} /></div>
              <span>Cards</span>
            </button>
            {/* Invest button */}
            <button className="action-btn" onClick={() => navigate('/wealth')}>
              <div className="action-icon"><TrendingUp size={20} /></div>
              <span>Invest</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Stats Grid ── */}
      {/* Three stat cards showing account status, received count, and sent total */}
      <motion.div className="stats-grid" variants={itemVariants}>
        {/* Account status stat */}
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(108, 92, 231, 0.1)', color: 'var(--accent-primary)' }}>
            <Wallet size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Account</span>
            <span className="stat-value">Active</span>
          </div>
        </div>
        {/* Received transactions count */}
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 184, 148, 0.1)', color: 'var(--accent-success)' }}>
            <ArrowDownLeft size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Received</span>
            <span className="stat-value">{transactions.length} txns</span>
          </div>
        </div>
        {/* Total amount sent */}
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(225, 112, 85, 0.1)', color: 'var(--accent-danger)' }}>
            <ArrowUpRight size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Sent</span>
            <span className="stat-value">
              ₹{transactions.reduce((s, t) => s + (t.amount || 0), 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Recent Transactions List ── */}
      {/* Shows the most recent 6 transactions in a list format */}
      <motion.div className="transactions-section" variants={itemVariants}>
        <div className="section-header">
          <h2>Recent Transactions</h2>
        </div>
        <div className="glass-card transactions-list">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="transaction-item">
                <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ width: '60%', height: 14, marginBottom: 6 }} />
                  <div className="skeleton" style={{ width: '40%', height: 12 }} />
                </div>
              </div>
            ))
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              <Send size={40} strokeWidth={1.5} />
              <p>No transactions yet</p>
              <span>Send money to see your history here</span>
            </div>
          ) : (
            transactions.slice(0, 6).map((tx, i) => (
              <motion.div
                key={tx.transactionId || i}
                className="transaction-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="tx-avatar">
                  {tx.receiverName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="tx-details">
                  <span className="tx-name">{tx.receiverName || 'Unknown'}</span>
                  <span className="tx-id">TXN #{tx.transactionId}</span>
                </div>
                <span className="tx-amount sent">
                  -₹{Number(tx.amount).toLocaleString('en-IN')}
                </span>
                <button
                  className="btn-report-fraud"
                  title="Report Fraud"
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await createSupportTicket('DISPUTE', tx.transactionId, `Disputing transaction ${tx.transactionId} of ₹${tx.amount} to ${tx.receiverName}`);
                      alert('Fraud dispute filed! The admin will review this transaction.');
                    } catch { alert('Failed to create dispute ticket.'); }
                  }}
                  style={{ marginLeft: '0.5rem', background: 'none', border: '1px solid var(--text-muted)', borderRadius: 8, padding: '0.3rem 0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: 'var(--text-muted)' }}
                >
                  <AlertTriangle size={12} /> Report
                </button>
              </motion.div>
            ))
          )}
        </div>
        {/* Download Statement Button */}
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button
            className="btn btn-primary"
            onClick={async () => {
              try {
                const res = await downloadStatement();
                const blob = new Blob([res.data], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pranavbank_statement.txt';
                a.click();
                window.URL.revokeObjectURL(url);
              } catch { alert('Failed to download statement.'); }
            }}
            style={{ fontSize: '0.85rem' }}
          >
            <Download size={16} /> Download Statement
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
