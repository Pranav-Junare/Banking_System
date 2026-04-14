import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { forexConvert, getForexWallet, downloadStatement } from '../../api/api';
import { Globe, ArrowRightLeft, Download, Wallet } from 'lucide-react';
import './Forex.css';

const flags = { USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧' };

export default function ForexPage() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [form, setForm] = useState({ amountInr: '', targetCurrency: 'USD' });

  const fetchWallet = async () => {
    try { const r = await getForexWallet(); setWallet(r.data); } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchWallet(); }, []);

  const handleConvert = async (e) => {
    e.preventDefault();
    try { const r = await forexConvert(Number(form.amountInr), form.targetCurrency);
      setMsg({ type: 'success', text: `Converted! You received ${r.data.convertedAmount} ${form.targetCurrency}` });
      fetchWallet(); setForm({ ...form, amountInr: '' });
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || 'Conversion failed' }); }
    setTimeout(() => setMsg({ type: '', text: '' }), 4000);
  };

  const handleDownload = async () => {
    try {
      const res = await downloadStatement();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a'); a.href = url; a.download = 'statement.csv'; a.click();
      window.URL.revokeObjectURL(url);
      setMsg({ type: 'success', text: 'Statement downloaded!' });
    } catch { setMsg({ type: 'error', text: 'Download failed' }); }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  return (
    <motion.div className="forex-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="cards-header">
        <div><h1>Forex Exchange</h1><p className="page-subtitle">Convert INR to foreign currencies and manage your wallet.</p></div>
        <button className="btn btn-secondary" onClick={handleDownload}><Download size={16} /> CSV Statement</button>
      </div>

      {msg.text && <motion.div className={`auth-${msg.type}`} style={{ marginBottom: '1rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{msg.text}</motion.div>}

      {/* Forex Wallet */}
      {wallet && (
        <motion.div className="forex-wallet" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3><Wallet size={20} /> Your Forex Wallet</h3>
          <div className="forex-balances">
            {Object.entries(wallet).filter(([k]) => k !== 'inr').map(([currency, balance]) => (
              <div key={currency} className="forex-bal-card glass-card">
                <span className="forex-flag">{flags[currency.toUpperCase()] || '💱'}</span>
                <span className="forex-curr">{currency.toUpperCase()}</span>
                <span className="forex-amt">{Number(balance || 0).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Convert */}
      <div className="glass-card credit-section">
        <h3><ArrowRightLeft size={20} /> Convert INR</h3>
        <form onSubmit={handleConvert} className="credit-form">
          <div className="input-group"><label>Amount (₹)</label><input type="number" className="input-field" value={form.amountInr} onChange={e => setForm({ ...form, amountInr: e.target.value })} min="1" required /></div>
          <div className="input-group"><label>To Currency</label>
            <select className="input-field" value={form.targetCurrency} onChange={e => setForm({ ...form, targetCurrency: e.target.value })}>
              <option value="USD">🇺🇸 USD</option><option value="EUR">🇪🇺 EUR</option><option value="GBP">🇬🇧 GBP</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary"><Globe size={16} /> Convert</button>
        </form>
      </div>
    </motion.div>
  );
}
