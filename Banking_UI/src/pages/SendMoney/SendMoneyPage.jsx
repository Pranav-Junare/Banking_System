import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendMoney } from '../../api/api';
import { Send, ArrowRight, CheckCircle } from 'lucide-react';
import './SendMoney.css';

export default function SendMoneyPage() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await sendMoney(email, amount);
      setResult(res.data);
      setEmail(''); setAmount('');
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed');
    }
    setLoading(false);
  };

  return (
    <motion.div className="send-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>Send Money</h1>
      <p className="page-subtitle">Transfer funds instantly to any Bank account.</p>

      <div className="send-container">
        <div className="send-form-card glass-card">
          <div className="send-icon-header">
            <div className="send-icon-circle"><Send size={28} /></div>
            <h3>New Transfer</h3>
          </div>

          <form onSubmit={handleSend} className="send-form">
            <div className="input-group">
              <label>Recipient Email</label>
              <input type="email" className="input-field" placeholder="recipient@example.com"
                value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>Amount (₹)</label>
              <input type="number" className="input-field" placeholder="Enter amount"
                value={amount} onChange={e => setAmount(e.target.value)} min="1" required />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="btn btn-primary send-btn" disabled={loading}>
              {loading ? <span className="spinner" /> : <>Send <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>

        {result && (
          <motion.div className="send-success glass-card"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle size={48} color="var(--accent-success)" />
            <h3>Transfer Successful!</h3>
            <p className="success-amount">₹{Number(result.sendAmount).toLocaleString('en-IN')}</p>
            <p className="success-to">sent to <strong>{result.receiverName}</strong></p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
