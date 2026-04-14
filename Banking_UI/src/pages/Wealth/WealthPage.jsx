/* ═══════════════════════════════════════════════════════════════════════
   WealthPage Component — Fixed Deposits & SIPs
   Allows users to create and view Fixed Deposits (FDs) and Systematic
   Investment Plans (SIPs). Includes tabbed navigation, creation forms,
   and dummy data fallback for offline demonstration.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'; /* React hooks for state and lifecycle */
import { motion } from 'framer-motion'; /* Animation library for transitions */
import { createFD, getMyFDs, createSIP, getMySIPs } from '../../api/api'; /* Wealth API functions */
import { TrendingUp, Landmark, Plus } from 'lucide-react'; /* Icon components */
import './Wealth.css'; /* Wealth page specific styles */

/* ─── Dummy FD Data ──────────────────────────────────────────────────
   Fallback Fixed Deposit data shown when the API is unavailable.
   ───────────────────────────────────────────────────────────────────── */
const DUMMY_FDS = [
  { fdType: 'Standard', fdAmount: 100000, fdDuration: 12, fdInterestRate: 7.5, fdMaturityAmount: 107500 },
  { fdType: 'Tax Saver', fdAmount: 150000, fdDuration: 60, fdInterestRate: 7.8, fdMaturityAmount: 218700 },
  { fdType: 'Flexi', fdAmount: 50000, fdDuration: 6, fdInterestRate: 6.5, fdMaturityAmount: 53250 },
];

/* ─── Dummy SIP Data ─────────────────────────────────────────────────
   Fallback SIP data shown when the API is unavailable.
   ───────────────────────────────────────────────────────────────────── */
const DUMMY_SIPS = [
  { sipType: 'EQUITY', sipAmount: 5000, sipDuration: 24, sipInterestRate: 12, sipMaturityAmount: 134868 },
  { sipType: 'MUTUAL_FUND', sipAmount: 10000, sipDuration: 36, sipInterestRate: 10, sipMaturityAmount: 432120 },
];

/* ─── WealthPage Component ───────────────────────────────────────────
   Main exported component for the wealth management page.
   ───────────────────────────────────────────────────────────────────── */
export default function WealthPage() {
  /* Active tab — 'fd' for Fixed Deposits, 'sip' for SIPs */
  const [tab, setTab] = useState('fd');

  /* State arrays for FDs and SIPs */
  const [fds, setFDs] = useState([]);
  const [sips, setSIPs] = useState([]);

  /* Loading state — shows skeleton while fetching */
  const [loading, setLoading] = useState(true);

  /* Toggle for the creation form visibility */
  const [showForm, setShowForm] = useState(false);

  /* Feedback message with type (success/error) and text */
  const [msg, setMsg] = useState({ type: '', text: '' });

  /* FD creation form state */
  const [fdForm, setFdForm] = useState({ fdType: 'Standard', fdAmount: '', fdDuration: '' });

  /* SIP creation form state */
  const [sipForm, setSipForm] = useState({ sipType: 'EQUITY', sipAmount: '', sipDuration: '' });

  /* ─── Fetch Data from API ──────────────────────────────────────────
     Fetches FDs and SIPs in parallel. Falls back to dummy data.
     ─────────────────────────────────────────────────────────────────── */
  const fetchData = async () => {
    try {
      const [f, s] = await Promise.allSettled([getMyFDs(), getMySIPs()]); /* Parallel API calls */
      /* Set FD data — use API data or fall back to dummy */
      if (f.status === 'fulfilled' && f.value.data.length > 0) {
        setFDs(f.value.data);
      } else {
        setFDs(DUMMY_FDS);
      }
      /* Set SIP data — use API data or fall back to dummy */
      if (s.status === 'fulfilled' && s.value.data.length > 0) {
        setSIPs(s.value.data);
      } else {
        setSIPs(DUMMY_SIPS);
      }
    } catch {
      setFDs(DUMMY_FDS);   /* Use dummy FDs on error */
      setSIPs(DUMMY_SIPS); /* Use dummy SIPs on error */
    }
    setLoading(false); /* Stop showing skeleton */
  };

  /* Fetch data on component mount */
  useEffect(() => { fetchData(); }, []);

  /* ─── Create FD Handler ──────────────────────────────────────────
     Creates a new Fixed Deposit via the API.
     ─────────────────────────────────────────────────────────────── */
  const handleFD = async (e) => {
    e.preventDefault(); /* Prevent form reload */
    try {
      await createFD(fdForm.fdType, Number(fdForm.fdAmount), Number(fdForm.fdDuration));
      setMsg({ type: 'success', text: 'Fixed Deposit created!' }); /* Success feedback */
      setShowForm(false); /* Hide the form */
      fetchData();        /* Refresh data */
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' }); /* Error feedback */
    }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000); /* Clear message after 3 seconds */
  };

  /* ─── Create SIP Handler ─────────────────────────────────────────
     Creates a new SIP via the API.
     ─────────────────────────────────────────────────────────────── */
  const handleSIP = async (e) => {
    e.preventDefault(); /* Prevent form reload */
    try {
      await createSIP(sipForm.sipType, Number(sipForm.sipAmount), Number(sipForm.sipDuration));
      setMsg({ type: 'success', text: 'SIP created!' }); /* Success feedback */
      setShowForm(false); /* Hide the form */
      fetchData();        /* Refresh data */
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' }); /* Error feedback */
    }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000); /* Clear message after 3 seconds */
  };

  /* Get the items array for the currently active tab */
  const items = tab === 'fd' ? fds : sips;

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <motion.div className="wealth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Page header with title and create button */}
      <div className="cards-header">
        <div>
          <h1>Wealth Management</h1>
          <p className="page-subtitle">Grow your money with Fixed Deposits and SIPs.</p>
        </div>
        {/* Create new FD/SIP button */}
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> New {tab === 'fd' ? 'FD' : 'SIP'}
        </button>
      </div>

      {/* Tab navigation — FD vs SIP */}
      <div className="wealth-tabs">
        <button
          className={`tab-btn ${tab === 'fd' ? 'active' : ''}`}
          onClick={() => setTab('fd')}
        >
          <Landmark size={16} /> Fixed Deposits
        </button>
        <button
          className={`tab-btn ${tab === 'sip' ? 'active' : ''}`}
          onClick={() => setTab('sip')}
        >
          <TrendingUp size={16} /> SIPs
        </button>
      </div>

      {/* Feedback message */}
      {msg.text && (
        <div className={`auth-${msg.type}`} style={{ marginBottom: '1rem' }}>
          {msg.text}
        </div>
      )}

      {/* ── Creation Form ── */}
      {showForm && (
        <motion.div
          className="glass-card wealth-form"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {tab === 'fd' ? (
            /* FD Creation Form */
            <form onSubmit={handleFD} className="wealth-form-inner">
              {/* FD Type selector */}
              <div className="input-group">
                <label>Type</label>
                <select
                  className="input-field"
                  value={fdForm.fdType}
                  onChange={e => setFdForm({ ...fdForm, fdType: e.target.value })}
                >
                  <option>Standard</option>
                  <option>Tax Saver</option>
                  <option>Flexi</option>
                </select>
              </div>
              {/* FD Amount input */}
              <div className="input-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={fdForm.fdAmount}
                  onChange={e => setFdForm({ ...fdForm, fdAmount: e.target.value })}
                  min="1000"
                  required
                />
              </div>
              {/* FD Duration input */}
              <div className="input-group">
                <label>Duration (months)</label>
                <input
                  type="number"
                  className="input-field"
                  value={fdForm.fdDuration}
                  onChange={e => setFdForm({ ...fdForm, fdDuration: e.target.value })}
                  min="1"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">Create FD</button>
            </form>
          ) : (
            /* SIP Creation Form */
            <form onSubmit={handleSIP} className="wealth-form-inner">
              {/* Monthly SIP amount */}
              <div className="input-group">
                <label>Monthly Amount (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={sipForm.sipAmount}
                  onChange={e => setSipForm({ ...sipForm, sipAmount: e.target.value })}
                  min="500"
                  required
                />
              </div>
              {/* SIP Duration */}
              <div className="input-group">
                <label>Duration (months)</label>
                <input
                  type="number"
                  className="input-field"
                  value={sipForm.sipDuration}
                  onChange={e => setSipForm({ ...sipForm, sipDuration: e.target.value })}
                  min="1"
                  required
                />
              </div>
              {/* SIP Type */}
              <div className="input-group">
                <label>Type</label>
                <select
                  className="input-field"
                  value={sipForm.sipType}
                  onChange={e => setSipForm({ ...sipForm, sipType: e.target.value })}
                >
                  <option value="EQUITY">Equity</option>
                  <option value="MUTUAL_FUND">Mutual Fund</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">Create SIP</button>
            </form>
          )}
        </motion.div>
      )}

      {/* ── Items List ── */}
      {loading ? (
        <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
      ) : (
        /* Render each FD or SIP as a card */
        <div className="wealth-list">
          {items.map((item, i) => (
            <motion.div
              key={i}
              className="glass-card wealth-item"
              initial={{ opacity: 0, x: -20 }}  /* Slide in from left */
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}   /* Stagger entrance */
            >
              {tab === 'fd' ? (
                /* FD display — type badge, amount, details */
                <>
                  <div className="wi-top">
                    <span className="badge badge-info">{item.fdType || 'Standard'}</span>
                    <span className="wi-amount">₹{Number(item.fdAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="wi-details">
                    <span>Duration: {item.fdDuration} months</span>
                    <span>Rate: {item.fdInterestRate || '—'}%</span>
                    <span>Maturity: ₹{Number(item.fdMaturityAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                /* SIP display — SIP badge, monthly amount, details */
                <>
                  <div className="wi-top">
                    <span className="badge badge-success">SIP</span>
                    <span className="wi-amount">₹{Number(item.sipAmount || 0).toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div className="wi-details">
                    <span>Duration: {item.sipDuration} months</span>
                    <span>Rate: {item.sipInterestRate}%</span>
                    <span>Maturity: ₹{Number(item.sipMaturityAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
