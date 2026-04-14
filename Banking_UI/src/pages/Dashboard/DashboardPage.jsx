import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getDashboard, getHistory } from '../../api/api';
import {
  ArrowUpRight, ArrowDownLeft, Send, Plus,
  TrendingUp, CreditCard, Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashData, setDashData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, histRes] = await Promise.allSettled([
          getDashboard(),
          getHistory(),
        ]);
        if (dashRes.status === 'fulfilled') setDashData(dashRes.value.data);
        if (histRes.status === 'fulfilled') setTransactions(histRes.value.data);
      } catch { /* silently fail */ }
      setLoading(false);
    };
    fetchData();
  }, []);

  const balance = dashData?.balance ?? 0;
  const displayName = dashData?.name || user?.name || 'User';

  return (
    <motion.div
      className="dashboard-page"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <motion.div className="dash-header" variants={itemVariants}>
        <div>
          <h1 className="dash-greeting">{getGreeting()}, {displayName}!</h1>
          <p className="dash-subtitle">Here's what's happening with your money today.</p>
        </div>
      </motion.div>

      {/* Balance Card */}
      <motion.div className="balance-section" variants={itemVariants}>
        <div className="balance-card glass-card">
          <div className="balance-label">Total Balance</div>
          <div className="balance-amount">
            <span className="currency">₹</span>
            {loading ? (
              <span className="skeleton" style={{ width: 140, height: 40, display: 'inline-block' }} />
            ) : (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {Number(balance).toLocaleString('en-IN')}
              </motion.span>
            )}
          </div>
          <div className="balance-actions">
            <button className="action-btn" onClick={() => navigate('/send-money')}>
              <div className="action-icon"><Send size={20} /></div>
              <span>Send</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/pots')}>
              <div className="action-icon"><Plus size={20} /></div>
              <span>Save</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/cards')}>
              <div className="action-icon"><CreditCard size={20} /></div>
              <span>Cards</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/wealth')}>
              <div className="action-icon"><TrendingUp size={20} /></div>
              <span>Invest</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div className="stats-grid" variants={itemVariants}>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(108, 92, 231, 0.1)', color: 'var(--accent-primary)' }}>
            <Wallet size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Account</span>
            <span className="stat-value">Active</span>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 184, 148, 0.1)', color: 'var(--accent-success)' }}>
            <ArrowDownLeft size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-label">Received</span>
            <span className="stat-value">{transactions.length} txns</span>
          </div>
        </div>
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

      {/* Recent Transactions */}
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
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
