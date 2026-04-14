import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createFD, getMyFDs, createSIP, getMySIPs } from '../../api/api';
import { TrendingUp, Landmark, Plus } from 'lucide-react';
import './Wealth.css';

export default function WealthPage() {
  const [tab, setTab] = useState('fd');
  const [fds, setFDs] = useState([]); const [sips, setSIPs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [fdForm, setFdForm] = useState({ fdType: 'Standard', fdAmount: '', fdDuration: '' });
  const [sipForm, setSipForm] = useState({ sipAmount: '', sipDuration: '', sipInterestRate: '12' });

  const fetchData = async () => {
    try { const [f, s] = await Promise.allSettled([getMyFDs(), getMySIPs()]);
      if (f.status === 'fulfilled') setFDs(f.value.data);
      if (s.status === 'fulfilled') setSIPs(s.value.data);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const handleFD = async (e) => {
    e.preventDefault();
    try { await createFD(fdForm.fdType, Number(fdForm.fdAmount), Number(fdForm.fdDuration));
      setMsg({ type: 'success', text: 'Fixed Deposit created!' }); setShowForm(false); fetchData();
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' }); }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const handleSIP = async (e) => {
    e.preventDefault();
    try { await createSIP(Number(sipForm.sipAmount), Number(sipForm.sipDuration), Number(sipForm.sipInterestRate));
      setMsg({ type: 'success', text: 'SIP created!' }); setShowForm(false); fetchData();
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' }); }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const items = tab === 'fd' ? fds : sips;

  return (
    <motion.div className="wealth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="cards-header">
        <div><h1>Wealth Management</h1><p className="page-subtitle">Grow your money with Fixed Deposits and SIPs.</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><Plus size={18} /> New {tab === 'fd' ? 'FD' : 'SIP'}</button>
      </div>

      <div className="wealth-tabs">
        <button className={`tab-btn ${tab === 'fd' ? 'active' : ''}`} onClick={() => setTab('fd')}><Landmark size={16} /> Fixed Deposits</button>
        <button className={`tab-btn ${tab === 'sip' ? 'active' : ''}`} onClick={() => setTab('sip')}><TrendingUp size={16} /> SIPs</button>
      </div>

      {msg.text && <div className={`auth-${msg.type}`} style={{ marginBottom: '1rem' }}>{msg.text}</div>}

      {showForm && (
        <motion.div className="glass-card wealth-form" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          {tab === 'fd' ? (
            <form onSubmit={handleFD} className="wealth-form-inner">
              <div className="input-group"><label>Type</label><select className="input-field" value={fdForm.fdType} onChange={e => setFdForm({ ...fdForm, fdType: e.target.value })}><option>Standard</option><option>Tax Saver</option><option>Flexi</option></select></div>
              <div className="input-group"><label>Amount (₹)</label><input type="number" className="input-field" value={fdForm.fdAmount} onChange={e => setFdForm({ ...fdForm, fdAmount: e.target.value })} min="1000" required /></div>
              <div className="input-group"><label>Duration (months)</label><input type="number" className="input-field" value={fdForm.fdDuration} onChange={e => setFdForm({ ...fdForm, fdDuration: e.target.value })} min="1" required /></div>
              <button type="submit" className="btn btn-primary">Create FD</button>
            </form>
          ) : (
            <form onSubmit={handleSIP} className="wealth-form-inner">
              <div className="input-group"><label>Monthly Amount (₹)</label><input type="number" className="input-field" value={sipForm.sipAmount} onChange={e => setSipForm({ ...sipForm, sipAmount: e.target.value })} min="500" required /></div>
              <div className="input-group"><label>Duration (months)</label><input type="number" className="input-field" value={sipForm.sipDuration} onChange={e => setSipForm({ ...sipForm, sipDuration: e.target.value })} min="1" required /></div>
              <div className="input-group"><label>Interest Rate (%)</label><input type="number" className="input-field" value={sipForm.sipInterestRate} onChange={e => setSipForm({ ...sipForm, sipInterestRate: e.target.value })} step="0.1" required /></div>
              <button type="submit" className="btn btn-primary">Create SIP</button>
            </form>
          )}
        </motion.div>
      )}

      {loading ? <div className="skeleton" style={{ height: 200, borderRadius: 16 }} /> : items.length === 0 ? (
        <div className="empty-state glass-card" style={{ padding: '4rem' }}><TrendingUp size={48} strokeWidth={1.5} /><p>No {tab === 'fd' ? 'Fixed Deposits' : 'SIPs'} yet</p></div>
      ) : (
        <div className="wealth-list">
          {items.map((item, i) => (
            <motion.div key={i} className="glass-card wealth-item" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              {tab === 'fd' ? (
                <>
                  <div className="wi-top"><span className="badge badge-info">{item.fdType || 'Standard'}</span><span className="wi-amount">₹{Number(item.fdAmount || 0).toLocaleString('en-IN')}</span></div>
                  <div className="wi-details"><span>Duration: {item.fdDuration} months</span><span>Rate: {item.fdInterestRate || '—'}%</span><span>Maturity: ₹{Number(item.fdMaturityAmount || 0).toLocaleString('en-IN')}</span></div>
                </>
              ) : (
                <>
                  <div className="wi-top"><span className="badge badge-success">SIP</span><span className="wi-amount">₹{Number(item.sipAmount || 0).toLocaleString('en-IN')}/mo</span></div>
                  <div className="wi-details"><span>Duration: {item.sipDuration} months</span><span>Rate: {item.sipInterestRate}%</span><span>Maturity: ₹{Number(item.sipMaturityAmount || 0).toLocaleString('en-IN')}</span></div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
