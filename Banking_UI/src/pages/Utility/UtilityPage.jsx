/* ═══════════════════════════════════════════════════════════════════════
   UtilityPage Component — Bill Payments & Mobile Recharge
   Tabbed interface for paying utility bills (electricity, water, gas,
   internet) and performing mobile recharges. Includes recent payment
   history with dummy data for offline demonstration.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState } from 'react'; /* React useState hook for form state */
import { motion } from 'framer-motion'; /* Animation library for transitions */
import { fetchBill, payBill, mobileRecharge } from '../../api/api'; /* Utility API functions */
import { Receipt, Smartphone, Zap, CheckCircle, Clock } from 'lucide-react'; /* Icon components */
import './Utility.css'; /* Utility page specific styles */

/* ─── Dummy Recent Payments ──────────────────────────────────────────
   Fallback payment history shown below the forms.
   ───────────────────────────────────────────────────────────────────── */
const DUMMY_PAYMENTS = [
  { type: 'Electricity', provider: 'MSEDCL', amount: 1850, time: '3 days ago', status: 'Paid' },
  { type: 'Internet', provider: 'Jio Fiber', amount: 999, time: '1 week ago', status: 'Paid' },
  { type: 'Recharge', provider: 'Airtel', amount: 599, time: '2 weeks ago', status: 'Paid' },
  { type: 'Water', provider: 'Municipal Corp', amount: 450, time: '1 month ago', status: 'Paid' },
  { type: 'Gas', provider: 'Indane Gas', amount: 1100, time: '1 month ago', status: 'Paid' },
];

/* ─── UtilityPage Component ──────────────────────────────────────────
   Main exported component for the utility payments page.
   ───────────────────────────────────────────────────────────────────── */
export default function UtilityPage() {
  /* Active tab — 'bill' for bill payments, 'recharge' for mobile recharge */
  const [tab, setTab] = useState('bill');

  /* Feedback message with type (success/error) and text */
  const [msg, setMsg] = useState({ type: '', text: '' });

  /* State for the fetched bill data (amount, biller info) */
  const [billData, setBillData] = useState(null);

  /* Bill payment form state */
  const [billForm, setBillForm] = useState({ billerName: 'Electricity', consumerId: '' });

  /* Mobile recharge form state */
  const [rechargeForm, setRechargeForm] = useState({ phoneNumber: '', amount: '', provider: 'Jio' });

  /* ─── Fetch Bill Handler ─────────────────────────────────────────
     Fetches the pending bill amount for a given biller and consumer ID.
     ─────────────────────────────────────────────────────────────── */
  const handleFetch = async (e) => {
    e.preventDefault(); /* Prevent form reload */
    try {
      const r = await fetchBill(billForm.billerName, billForm.consumerId); /* Call API */
      setBillData(r.data); /* Store the fetched bill data */
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' });
    }
  };

  /* ─── Pay Bill Handler ───────────────────────────────────────────
     Pays the fetched bill via the API.
     ─────────────────────────────────────────────────────────────── */
  const handlePay = async () => {
    try {
      await payBill(billForm.billerName, billForm.consumerId, Number(billData.amount || 0)); /* Call API */
      setMsg({ type: 'success', text: 'Bill paid!' }); /* Success feedback */
      setBillData(null); /* Clear the bill data after payment */
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' });
    }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000); /* Clear after 3s */
  };

  /* ─── Mobile Recharge Handler ────────────────────────────────────
     Processes a mobile recharge via the API.
     ─────────────────────────────────────────────────────────────── */
  const handleRecharge = async (e) => {
    e.preventDefault(); /* Prevent form reload */
    try {
      await mobileRecharge(rechargeForm.phoneNumber, Number(rechargeForm.amount), rechargeForm.provider);
      setMsg({ type: 'success', text: 'Recharge successful!' }); /* Success */
      setRechargeForm({ phoneNumber: '', amount: '', provider: 'Jio' }); /* Reset form */
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' });
    }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000); /* Clear after 3s */
  };

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <motion.div className="utility-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Page title */}
      <h1>Utility Payments</h1>
      <p className="page-subtitle">Pay bills and recharge mobile instantly.</p>

      {/* Tab navigation — Bill Payment vs Mobile Recharge */}
      <div className="wealth-tabs">
        <button
          className={`tab-btn ${tab === 'bill' ? 'active' : ''}`}
          onClick={() => setTab('bill')}
        >
          <Zap size={16} /> Bill Payment
        </button>
        <button
          className={`tab-btn ${tab === 'recharge' ? 'active' : ''}`}
          onClick={() => setTab('recharge')}
        >
          <Smartphone size={16} /> Mobile Recharge
        </button>
      </div>

      {/* Feedback message */}
      {msg.text && (
        <motion.div
          className={`auth-${msg.type}`}
          style={{ marginBottom: '1rem' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {msg.text}
        </motion.div>
      )}

      {/* Tab Content */}
      {tab === 'bill' ? (
        /* ── Bill Payment Form ── */
        <div className="glass-card credit-section">
          <h3><Receipt size={20} /> Pay a Bill</h3>
          <form onSubmit={handleFetch} className="credit-form">
            {/* Biller selector */}
            <div className="input-group">
              <label>Biller</label>
              <select
                className="input-field"
                value={billForm.billerName}
                onChange={e => setBillForm({ ...billForm, billerName: e.target.value })}
              >
                <option>Electricity</option>
                <option>Water</option>
                <option>Gas</option>
                <option>Internet</option>
              </select>
            </div>
            {/* Consumer ID input */}
            <div className="input-group">
              <label>Consumer ID</label>
              <input
                className="input-field"
                value={billForm.consumerId}
                onChange={e => setBillForm({ ...billForm, consumerId: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-secondary">Fetch Bill</button>
          </form>
          {/* Bill result — shown after fetching */}
          {billData && (
            <motion.div className="bill-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bill-info">
                <span>Biller: {billData.billerName}</span>
                <span>Amount Due: <strong>₹{Number(billData.amount || 0).toLocaleString('en-IN')}</strong></span>
              </div>
              <button className="btn btn-primary" onClick={handlePay}>
                <CheckCircle size={16} /> Pay Now
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        /* ── Mobile Recharge Form ── */
        <div className="glass-card credit-section">
          <h3><Smartphone size={20} /> Mobile Recharge</h3>
          <form onSubmit={handleRecharge} className="credit-form">
            {/* Phone number input */}
            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                className="input-field"
                value={rechargeForm.phoneNumber}
                onChange={e => setRechargeForm({ ...rechargeForm, phoneNumber: e.target.value })}
                required
              />
            </div>
            {/* Recharge amount input */}
            <div className="input-group">
              <label>Amount (₹)</label>
              <input
                type="number"
                className="input-field"
                value={rechargeForm.amount}
                onChange={e => setRechargeForm({ ...rechargeForm, amount: e.target.value })}
                min="10"
                required
              />
            </div>
            {/* Provider selector */}
            <div className="input-group">
              <label>Provider</label>
              <select
                className="input-field"
                value={rechargeForm.provider}
                onChange={e => setRechargeForm({ ...rechargeForm, provider: e.target.value })}
              >
                <option>Jio</option>
                <option>Airtel</option>
                <option>Vi</option>
                <option>BSNL</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Recharge</button>
          </form>
        </div>
      )}

      {/* ── Recent Payments History ── */}
      {/* Shows dummy recent payment history */}
      <div className="recent-payments">
        <h3>Recent Payments</h3>
        <div className="glass-card transfers-list">
          {DUMMY_PAYMENTS.map((payment, i) => (
            <motion.div
              key={i}
              className="transfer-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {/* Payment type icon */}
              <div className="tx-avatar" style={{
                background: payment.type === 'Recharge'
                  ? 'linear-gradient(135deg, #00B894, #00CEC9)' /* Green for recharge */
                  : 'var(--accent-gradient)'                      /* Purple for bills */
              }}>
                {payment.type === 'Recharge' ? <Smartphone size={16} /> : <Zap size={16} />}
              </div>
              {/* Payment details */}
              <div className="transfer-details">
                <span className="transfer-name">{payment.type} — {payment.provider}</span>
                <span className="transfer-meta">
                  <Clock size={12} /> {payment.time}
                </span>
              </div>
              {/* Amount and status */}
              <div style={{ textAlign: 'right' }}>
                <div className="tx-amount sent">-₹{payment.amount.toLocaleString('en-IN')}</div>
                <span className="badge badge-success" style={{ marginTop: 4 }}>{payment.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
