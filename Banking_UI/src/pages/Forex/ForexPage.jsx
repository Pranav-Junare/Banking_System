/* ═══════════════════════════════════════════════════════════════════════
   ForexPage Component — Foreign Exchange
   Allows users to convert INR to foreign currencies (USD, EUR, GBP),
   view their forex wallet balances, see live exchange rates, and
   download account statements. Includes dummy data for offline demo.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'; /* React hooks for state and lifecycle */
import { motion } from 'framer-motion'; /* Animation library for transitions */
import { forexConvert, getForexWallet, downloadStatement } from '../../api/api'; /* Forex API functions */
import { Globe, ArrowRightLeft, Download, Wallet, TrendingUp } from 'lucide-react'; /* Icon components */
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Forex.css'; /* Forex page specific styles */

/* ─── Currency Flags Mapping ─────────────────────────────────────────
   Maps currency codes to their country flag emoji.
   ───────────────────────────────────────────────────────────────────── */
const flags = { USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧' };

/* ─── Dummy Forex Wallet ─────────────────────────────────────────────
   Fallback wallet balances when the API is offline.
   ───────────────────────────────────────────────────────────────────── */
const EMPTY_WALLET = {
  usd: 0.00,
  eur: 0.00,
  gbp: 0.00,
};

/* ─── Dummy Exchange Rates ───────────────────────────────────────────
   Approximate exchange rates for display purposes.
   ───────────────────────────────────────────────────────────────────── */
const EXCHANGE_RATES = [
  { from: 'INR', to: 'USD', rate: 0.012, change: '+0.15%' },
  { from: 'INR', to: 'EUR', rate: 0.011, change: '-0.08%' },
  { from: 'INR', to: 'GBP', rate: 0.0095, change: '+0.22%' },
];

/* ─── ForexPage Component ────────────────────────────────────────────
   Main exported component for the forex exchange page.
   ───────────────────────────────────────────────────────────────────── */
export default function ForexPage() {
  /* State for the user's forex wallet data */
  const [wallet, setWallet] = useState(null);

  /* Loading state for initial data fetch */
  const [loading, setLoading] = useState(true);

  /* Feedback message with type and text */
  const [msg, setMsg] = useState({ type: '', text: '' });

  /* Conversion form state — amount in INR and target currency */
  const [form, setForm] = useState({ amountInr: '', targetCurrency: 'USD' });

  /* ─── Fetch Forex Wallet ───────────────────────────────────────────
     Gets the user's forex wallet balances. Falls back to dummy data.
     ─────────────────────────────────────────────────────────────────── */
  const fetchWallet = async () => {
    try {
      const r = await getForexWallet(); /* Call the wallet API */
      setWallet(r.data); /* Set wallet data from API */
    } catch {
      setWallet(EMPTY_WALLET); /* Use empty wallet if API fails */
    }
    setLoading(false); /* Stop loading */
  };

  /* Fetch wallet on component mount */
  useEffect(() => { fetchWallet(); }, []);

  /* ─── Convert Currency Handler ─────────────────────────────────────
     Converts INR to the selected foreign currency via the API.
     ─────────────────────────────────────────────────────────────────── */
  const handleConvert = async (e) => {
    e.preventDefault(); /* Prevent form reload */
    try {
      const r = await forexConvert(Number(form.amountInr), form.targetCurrency); /* Call API */
      setMsg({
        type: 'success',
        text: r.data.message || 'Converted successfully!'
      });
      fetchWallet(); /* Refresh wallet to show updated balances */
      setForm({ ...form, amountInr: '' }); /* Clear the amount input */
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Conversion failed' });
    }
    setTimeout(() => setMsg({ type: '', text: '' }), 4000); /* Clear after 4s */
  };

  /* ─── Download Statement Handler ───────────────────────────────────
     Downloads the user's account statement as a PDF file.
     ─────────────────────────────────────────────────────────────────── */
  const handleDownload = async () => {
    try {
      const res = await downloadStatement(); /* Get CSV string */
      let csvStr = res.data;
      if (typeof csvStr === 'string') {
        const doc = new jsPDF();
        const lines = csvStr.trim().split(/\r?\n/);
        const headers = lines[0].split(',');
        const dataRows = lines.slice(1).map(line => line.split(','));

        doc.text("PranavBank - Account Statement", 14, 15);
        if (dataRows.length > 0) {
          doc.autoTable({
            startY: 20,
            head: [headers],
            body: dataRows,
          });
        } else {
          doc.text("No transactions found.", 14, 25);
        }
        doc.save('statement.pdf');
        setMsg({ type: 'success', text: 'Statement PDF downloaded!' });
      } else {
        setMsg({ type: 'error', text: 'Invalid response format' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Download failed' });
    }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000); /* Clear after 3s */
  };

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <motion.div className="forex-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Page header with title and PDF download button */}
      <div className="cards-header">
        <div>
          <h1>Forex Exchange</h1>
          <p className="page-subtitle">Convert INR to foreign currencies and manage your wallet.</p>
        </div>
        <button className="btn btn-secondary" onClick={handleDownload}>
          <Download size={16} /> PDF Statement
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

      {/* ── Live Exchange Rates ── */}
      {/* Shows current exchange rates with change percentages */}
      <div className="exchange-rates-section">
        <h3><TrendingUp size={20} /> Live Exchange Rates</h3>
        <div className="rates-grid">
          {EXCHANGE_RATES.map((rate, i) => (
            <motion.div
              key={i}
              className="glass-card rate-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Currency flag emoji */}
              <span className="rate-flag">{flags[rate.to]}</span>
              {/* Currency pair */}
              <span className="rate-pair">{rate.from} → {rate.to}</span>
              {/* Exchange rate value */}
              <span className="rate-value">{rate.rate}</span>
              {/* Change percentage badge */}
              <span className={`badge ${rate.change.startsWith('+') ? 'badge-success' : 'badge-danger'}`}>
                {rate.change}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Forex Wallet ── */}
      {/* Shows the user's foreign currency balances */}
      {wallet && (
        <motion.div
          className="forex-wallet"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3><Wallet size={20} /> Your Forex Wallet</h3>
          <div className="forex-balances">
            {/* Filter out 'inr' and show each foreign currency balance */}
            {Object.entries(wallet)
              .filter(([k]) => k !== 'inr') /* Exclude INR balance */
              .map(([currency, balance]) => (
                <div key={currency} className="forex-bal-card glass-card">
                  <span className="forex-flag">{flags[currency.toUpperCase()] || '💱'}</span>
                  <span className="forex-curr">{currency.toUpperCase()}</span>
                  <span className="forex-amt">{Number(balance || 0).toFixed(2)}</span>
                </div>
              ))}
          </div>
        </motion.div>
      )}

      {/* ── Convert INR Form ── */}
      <div className="glass-card credit-section">
        <h3><ArrowRightLeft size={20} /> Convert INR</h3>
        <form onSubmit={handleConvert} className="credit-form">
          {/* Amount in INR */}
          <div className="input-group">
            <label>Amount (₹)</label>
            <input
              type="number"
              className="input-field"
              value={form.amountInr}
              onChange={e => setForm({ ...form, amountInr: e.target.value })}
              min="1"
              required
            />
          </div>
          {/* Target currency selector */}
          <div className="input-group">
            <label>To Currency</label>
            <select
              className="input-field"
              value={form.targetCurrency}
              onChange={e => setForm({ ...form, targetCurrency: e.target.value })}
            >
              <option value="USD">🇺🇸 USD</option>
              <option value="EUR">🇪🇺 EUR</option>
              <option value="GBP">🇬🇧 GBP</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">
            <Globe size={16} /> Convert
          </button>
        </form>
      </div>
    </motion.div>
  );
}
