/* ═══════════════════════════════════════════════════════════════════════
   PotsPage Component — Savings Pots
   Goal-based savings sub-accounts for organizing money into specific
   savings goals. Users can create pots, fund them, and withdraw.
   Falls back to dummy data when the API is offline.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'; /* React hooks for state and lifecycle */
import { motion } from 'framer-motion'; /* Animation library for transitions */
import { getPots, createPot, fundPot, withdrawPot } from '../../api/api'; /* Pots API functions */
import { useAuth } from '../../context/AuthContext'; // Import useAuth to access refreshUser
import { PiggyBank, Plus, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react'; /* Icon components */
import './Pots.css'; /* Pots page specific styles */

/* ─── Dummy Pot Data ─────────────────────────────────────────────────
   Fallback savings pot data shown when the API is unavailable.
   Shows realistic savings goals with varying progress levels.
   ───────────────────────────────────────────────────────────────────── */
const DUMMY_POTS = [
  { potId: 1, potName: 'Holiday Fund', currentAmount: 35000, targetAmount: 100000 },
  { potId: 2, potName: 'Emergency Savings', currentAmount: 75000, targetAmount: 200000 },
  { potId: 3, potName: 'New Laptop', currentAmount: 45000, targetAmount: 80000 },
  { potId: 4, potName: 'Wedding Gift', currentAmount: 8000, targetAmount: 15000 },
];

/* ─── PotsPage Component ─────────────────────────────────────────────
   Main exported component for the savings pots page.
   ───────────────────────────────────────────────────────────────────── */
export default function PotsPage() {
  /* State for the array of savings pot objects */
  const [pots, setPots] = useState([]);

  /* Loading state — shows skeleton loaders while fetching data */
  const [loading, setLoading] = useState(true);

  /* Toggle state for the create pot form visibility */
  const [showCreate, setShowCreate] = useState(false);

  /* State for the new pot name input */
  const [newName, setNewName] = useState('');

  /* State for the new pot target amount input */
  const [newTarget, setNewTarget] = useState('');

  /* State object tracking fund/withdraw amounts per pot ID */
  const [amounts, setAmounts] = useState({});

  /* Feedback message string for success/error notifications */
  const [msg, setMsg] = useState('');

  /* ─── Fetch Pots from API ──────────────────────────────────────────
     Calls the API to get the user's savings pots. Falls back to
     dummy data if the API returns empty or fails.
     ─────────────────────────────────────────────────────────────────── */
  const fetchPots = async () => {
    try {
      const r = await getPots(); /* Call the pots API */
      /* Use API data if available, otherwise use dummy data */
      setPots(r.data.length > 0 ? r.data : DUMMY_POTS);
    } catch {
      setPots(DUMMY_POTS); /* Use dummy data if API fails */
    }
    setLoading(false); /* Stop showing skeleton loaders */
  };

  /* Fetch pots when the component mounts */
  useEffect(() => { fetchPots(); }, []);

  const { refreshUser } = useAuth(); // ADDED: Pull refreshUser from context

  /* ─── Create New Pot Handler ─────────────────────────────────────
     Creates a new savings pot with the given name and target amount.
     ─────────────────────────────────────────────────────────────── */
  const handleCreate = async (e) => {
    e.preventDefault(); /* Prevent form submission reload */
    try {
      await createPot(newName, Number(newTarget)); /* Call create API */
      setNewName('');       /* Clear pot name input */
      setNewTarget('');     /* Clear target amount input */
      setShowCreate(false); /* Hide the create form */
      fetchPots();          /* Refresh pot list */
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed'); /* Show error */
    }
  };

  /* ─── Fund Pot Handler ───────────────────────────────────────────
     Adds funds to an existing savings pot.
     ─────────────────────────────────────────────────────────────── */
  const handleFund = async (potId) => {
    try {
      await fundPot(potId, Number(amounts[potId] || 0)); /* Call fund API */
      setAmounts({ ...amounts, [potId]: '' }); /* Clear the amount input */
      fetchPots();    /* Refresh pot list to show new balance */
      refreshUser();  // Refresh the global user context to update header balance
      setMsg('Funded!'); /* Show success feedback */
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed'); /* Show error */
    }
    setTimeout(() => setMsg(''), 2000); /* Clear message after 2 seconds */
  };

  /* ─── Withdraw from Pot Handler ──────────────────────────────────
     Removes funds from an existing savings pot back to main balance.
     ─────────────────────────────────────────────────────────────── */
  const handleWithdraw = async (potId) => {
    try {
      await withdrawPot(potId, Number(amounts[potId] || 0)); /* Call withdraw API */
      setAmounts({ ...amounts, [potId]: '' }); /* Clear the amount input */
      fetchPots();       /* Refresh pot list to show new balance */
      refreshUser();     // Refresh the global user context to update header balance
      setMsg('Withdrawn!'); /* Show success feedback */
    } catch (err) {
      setMsg(err.response?.data?.error || 'Failed'); /* Show error */
    }
    setTimeout(() => setMsg(''), 2000); /* Clear message after 2 seconds */
  };

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <motion.div className="pots-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Page header with title and create button */}
      <div className="cards-header">
        <div>
          <h1>Savings Pots</h1>
          <p className="page-subtitle">Virtual sub-accounts for goal-based savings.</p>
        </div>
        {/* Toggle create form button */}
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}>
          <Plus size={18} /> New Pot
        </button>
      </div>

      {/* Feedback message */}
      {msg && (
        <motion.div
          className="card-msg"
          style={{ marginBottom: '1rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {msg}
        </motion.div>
      )}

      {/* ── Create Pot Form ── */}
      {/* Shown when the "New Pot" button is clicked */}
      {showCreate && (
        <motion.form
          className="glass-card pot-create-form"
          onSubmit={handleCreate}
          initial={{ opacity: 0, y: -10 }} /* Slide down */
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Pot name input */}
          <div className="input-group">
            <label>Pot Name</label>
            <input
              className="input-field"
              placeholder="e.g. Holiday Fund"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              required
            />
          </div>
          {/* Target amount input */}
          <div className="input-group">
            <label>Target Amount</label>
            <input
              type="number"
              className="input-field"
              placeholder="50000"
              value={newTarget}
              onChange={e => setNewTarget(e.target.value)}
              min="1"
              required
            />
          </div>
          {/* Submit button */}
          <button type="submit" className="btn btn-primary">Create Pot</button>
        </motion.form>
      )}

      {/* ── Pots Grid ── */}
      {loading ? (
        /* Skeleton loading placeholders */
        <div className="pots-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        /* Render each savings pot as a card */
        <div className="pots-grid">
          {pots.map((pot, i) => {
            /* Calculate the progress percentage (capped at 100%) */
            const currentAmt = pot.currentAmount !== undefined ? pot.currentAmount : (pot.currentBalance || 0);
            const pct = pot.targetAmount > 0
              ? Math.min((currentAmt / pot.targetAmount) * 100, 100)
              : 0;
            const potId = pot.id || pot.potId;
            return (
              <motion.div
                key={potId || i}
                className="glass-card pot-card"
                initial={{ opacity: 0, y: 20 }}   /* Start below and hidden */
                animate={{ opacity: 1, y: 0 }}    /* Slide up and fade in */
                transition={{ delay: i * 0.05 }}   /* Staggered entrance */
              >
                {/* Pot header with icon and name */}
                <div className="pot-header">
                  <div className="pot-icon"><PiggyBank size={22} /></div>
                  <h3>{pot.potName}</h3>
                </div>
                {/* Current and target amounts */}
                <div className="pot-amounts">
                  <span className="pot-current">
                    ₹{Number(currentAmt).toLocaleString('en-IN')}
                  </span>
                  <span className="pot-target">
                    of ₹{Number(pot.targetAmount || 0).toLocaleString('en-IN')}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="pot-progress-track">
                  <motion.div
                    className="pot-progress-bar"
                    initial={{ width: 0 }}           /* Start at 0 width */
                    animate={{ width: `${pct}%` }}   /* Animate to calculated percentage */
                    transition={{ duration: 0.8 }}   /* Smooth progress bar animation */
                  />
                </div>
                {/* Progress percentage text */}
                <span className="pot-pct">{pct.toFixed(0)}% complete</span>
                {/* Fund/Withdraw action buttons */}
                <div className="pot-actions">
                  <input
                    type="number"
                    placeholder="Amount"
                    className="ctrl-input"
                    value={amounts[potId] || ''}
                    onChange={e => setAmounts({ ...amounts, [potId]: e.target.value })}
                  />
                  <button className="ctrl-btn" onClick={() => handleFund(potId)}>
                    <ArrowDownToLine size={14} /> Fund
                  </button>
                  <button className="ctrl-btn" onClick={() => handleWithdraw(potId)}>
                    <ArrowUpFromLine size={14} /> Withdraw
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
