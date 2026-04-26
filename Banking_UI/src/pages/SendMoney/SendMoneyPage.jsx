/* ═══════════════════════════════════════════════════════════════════════
   SendMoneyPage Component — Fund Transfer
   Allows users to send money to other users by email. Includes a
   transfer form, success confirmation, and recent transfer history
   with dummy data for demonstration when the API is offline.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'; /* React useState hook for form state */
import { motion } from 'framer-motion'; /* Animation library for transitions */
import { sendMoney, getHistory } from '../../api/api'; /* API function for money transfer */
import { Send, ArrowRight, CheckCircle, Clock } from 'lucide-react'; /* Icon components */
import './SendMoney.css'; /* SendMoney page specific styles */

/* ─── Dummy Recent Transfers ─────────────────────────────────────────
   Fallback transfer history data shown below the form.
   Provides a realistic preview of past transfers.
   ───────────────────────────────────────────────────────────────────── */
const DUMMY_RECENT_TRANSFERS = [
  { receiverName: 'Rahul Sharma', receiverEmail: 'rahul@example.com', amount: 2500, time: '2 hours ago' },
  { receiverName: 'Priya Patel', receiverEmail: 'priya@example.com', amount: 1800, time: 'Yesterday' },
  { receiverName: 'Amit Kumar', receiverEmail: 'amit@example.com', amount: 5000, time: '2 days ago' },
  { receiverName: 'Neha Singh', receiverEmail: 'neha@example.com', amount: 3200, time: '3 days ago' },
];

/* ─── SendMoneyPage Component ────────────────────────────────────────
   Main exported component for the money transfer page.
   ───────────────────────────────────────────────────────────────────── */
export default function SendMoneyPage() {
  /* Recipient email address state */
  const [email, setEmail] = useState('');

  /* Transfer amount state */
  const [amount, setAmount] = useState('');

  /* Loading state — shows spinner while transfer is processing */
  const [loading, setLoading] = useState(false);

  /* State for the transaction history array */
  const [transactions, setTransactions] = useState([]);

  /* Result object — holds the API response after a successful transfer */
  const [result, setResult] = useState(null);

  /* Error message string — displayed when transfer fails */
  const [error, setError] = useState('');

  /* ─── Fetch Recent Transfers on Mount ──────────────────────────────
     Gets the transaction history to display recent transfers below.
     ─────────────────────────────────────────────────────────────── */
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const histRes = await getHistory();
      if (histRes.data && histRes.data.length > 0) {
        // Dashboard shows history without filter since the backend history endpoint returns fromUser transactions
        setTransactions(histRes.data);
      } else {
        setTransactions(DUMMY_RECENT_TRANSFERS);
      }
    } catch (err) {
      setTransactions(DUMMY_RECENT_TRANSFERS);
    }
  };

  /* ─── Send Money Handler ─────────────────────────────────────────
     Calls the sendMoney API with the email and amount.
     On success, displays the confirmation card.
     On failure, shows the error message.
     ─────────────────────────────────────────────────────────────── */
  const handleSend = async (e) => {
    e.preventDefault(); /* Prevent default form submission */
    setLoading(true);   /* Show loading spinner */
    setError('');        /* Clear previous errors */
    setResult(null);     /* Clear previous result */
    try {
      const res = await sendMoney(email, amount); /* Call the API */
      setResult(res.data); /* Store successful result */
      setEmail('');         /* Clear email field */
      setAmount('');        /* Clear amount field */
      fetchHistory();       /* Refresh the history after sending */
    } catch (err) {
      /* Extract and display the error message from the API response */
      setError(err.response?.data?.error || 'Transfer failed');
    }
    setLoading(false); /* Stop loading spinner */
  };

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <motion.div className="send-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Page title */}
      <h1>Send Money</h1>
      {/* Page description */}
      <p className="page-subtitle">Transfer funds instantly to any Bank account.</p>

      <div className="send-container">
        {/* ── Transfer Form Card ── */}
        {/* Glass card containing the send money form */}
        <div className="send-form-card glass-card">
          {/* Icon header with gradient circle and title */}
          <div className="send-icon-header">
            <div className="send-icon-circle"><Send size={28} /></div>
            <h3>New Transfer</h3>
          </div>

          {/* Form fields for recipient email and amount */}
          <form onSubmit={handleSend} className="send-form">
            {/* Recipient email input */}
            <div className="input-group">
              <label>Recipient Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="recipient@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Transfer amount input */}
            <div className="input-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                className="input-field"
                placeholder="Enter amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="1"
                required
              />
            </div>

            {/* Error message display */}
            {error && <div className="auth-error">{error}</div>}

            {/* Submit button — shows spinner when loading */}
            <button type="submit" className="btn btn-primary send-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Send <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        {/* ── Success / Pending Confirmation Card ── */}
        {/* Shown after a successful transfer or pending review with amount and receiver info */}
        {result && (
          <motion.div
            className={`send-success glass-card ${result.status === 'PENDING_REVIEW' ? 'pending' : ''}`}
            initial={{ opacity: 0, scale: 0.9 }} /* Start small and hidden */
            animate={{ opacity: 1, scale: 1 }}   /* Grow and fade in */
          >
            {result.status === 'PENDING_REVIEW' ? (
              <>
                <Clock size={48} color="var(--accent-warning, #f1c40f)" />
                <h3>Pending Review</h3>
                <p className="success-amount">₹{Number(result.sendAmount).toLocaleString('en-IN')}</p>
                <p className="success-to">transfer to <strong>{result.receiverName}</strong></p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  This amount exceeds the limit and requires admin approval.
                </p>
              </>
            ) : (
              <>
                <CheckCircle size={48} color="var(--accent-success)" /> {/* Green check icon */}
                <h3>Transfer Successful!</h3>
                <p className="success-amount">₹{Number(result.sendAmount).toLocaleString('en-IN')}</p>
                <p className="success-to">sent to <strong>{result.receiverName}</strong></p>
              </>
            )}
          </motion.div>
        )}

        {/* ── Recent Transfers Section ── */}
        {/* Shows actual or dummy recent transfer history for demonstration */}
        <div className="recent-transfers">
          <h3>Recent Transfers</h3>
          <div className="glass-card transfers-list transactions-list">
            {transactions.slice(0, 5).map((tx, i) => {
              const isPending = tx.status === 'PENDING_REVIEW' || tx.status === 'PENDING';
              const isRejected = tx.status === 'REVERSED' || tx.status === 'REJECTED';
              const isApproved = tx.status === 'CLEARED';

              return (
              <motion.div
                key={tx.transactionId || i}
                className="transaction-item"
                initial={{ opacity: 0, x: -20 }} /* Start hidden and shifted left */
                animate={{ opacity: 1, x: 0 }}  /* Slide in from left */
                transition={{ delay: i * 0.05 }} /* Stagger each item */
              >
                {/* Avatar with first letter */}
                <div className="tx-avatar" style={isRejected ? { background: 'var(--accent-success)' } : {}}>{tx.receiverName?.charAt(0)?.toUpperCase() || '?'}</div>
                {/* Transfer details */}
                <div className="tx-details">
                  <span className="tx-name">
                    {tx.receiverName || 'Unknown'} {isRejected && '(Refund)'}
                  </span>
                  <span className="tx-id">
                    {tx.transactionId ? `TXN #${tx.transactionId}` : (tx.time || 'Recent')}
                    {isPending && <span style={{ color: 'var(--accent-warning)', marginLeft: '4px', fontSize: '0.75rem' }}>- Pending Review</span>}
                    {isApproved && <span style={{ color: 'var(--accent-success)', marginLeft: '4px', fontSize: '0.75rem' }}>- Approved (Transferred)</span>}
                    {isRejected && <span style={{ color: 'var(--accent-danger)', marginLeft: '4px', fontSize: '0.75rem' }}>- Rejected</span>}
                  </span>
                </div>
                {/* Transfer amount */}
                <span className={`tx-amount ${isRejected ? 'received' : 'sent'} ${isPending ? 'pending-amount' : ''}`}>
                  {isRejected ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                </span>
              </motion.div>
            )})}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
