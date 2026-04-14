import { useState } from 'react';
import { motion } from 'framer-motion';
import { fetchBill, payBill, mobileRecharge } from '../../api/api';
import { Receipt, Smartphone, Zap, CheckCircle } from 'lucide-react';
import './Utility.css';

export default function UtilityPage() {
  const [tab, setTab] = useState('bill');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [billData, setBillData] = useState(null);

  const [billForm, setBillForm] = useState({ billerName: 'Electricity', consumerId: '' });
  const [rechargeForm, setRechargeForm] = useState({ phoneNumber: '', amount: '', provider: 'Jio' });

  const handleFetch = async (e) => {
    e.preventDefault();
    try { const r = await fetchBill(billForm.billerName, billForm.consumerId); setBillData(r.data); }
    catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' }); }
  };

  const handlePay = async () => {
    try { await payBill(billForm.billerName, billForm.consumerId);
      setMsg({ type: 'success', text: 'Bill paid!' }); setBillData(null);
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' }); }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    try { await mobileRecharge(rechargeForm.phoneNumber, Number(rechargeForm.amount), rechargeForm.provider);
      setMsg({ type: 'success', text: 'Recharge successful!' }); setRechargeForm({ phoneNumber: '', amount: '', provider: 'Jio' });
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' }); }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  return (
    <motion.div className="utility-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>Utility Payments</h1>
      <p className="page-subtitle">Pay bills and recharge mobile instantly.</p>

      <div className="wealth-tabs">
        <button className={`tab-btn ${tab === 'bill' ? 'active' : ''}`} onClick={() => setTab('bill')}><Zap size={16} /> Bill Payment</button>
        <button className={`tab-btn ${tab === 'recharge' ? 'active' : ''}`} onClick={() => setTab('recharge')}><Smartphone size={16} /> Mobile Recharge</button>
      </div>

      {msg.text && <motion.div className={`auth-${msg.type}`} style={{ marginBottom: '1rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{msg.text}</motion.div>}

      {tab === 'bill' ? (
        <div className="glass-card credit-section">
          <h3><Receipt size={20} /> Pay a Bill</h3>
          <form onSubmit={handleFetch} className="credit-form">
            <div className="input-group"><label>Biller</label>
              <select className="input-field" value={billForm.billerName} onChange={e => setBillForm({ ...billForm, billerName: e.target.value })}>
                <option>Electricity</option><option>Water</option><option>Gas</option><option>Internet</option>
              </select>
            </div>
            <div className="input-group"><label>Consumer ID</label><input className="input-field" value={billForm.consumerId} onChange={e => setBillForm({ ...billForm, consumerId: e.target.value })} required /></div>
            <button type="submit" className="btn btn-secondary">Fetch Bill</button>
          </form>
          {billData && (
            <motion.div className="bill-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bill-info"><span>Biller: {billData.billerName}</span><span>Amount Due: <strong>₹{Number(billData.amount || 0).toLocaleString('en-IN')}</strong></span></div>
              <button className="btn btn-primary" onClick={handlePay}><CheckCircle size={16} /> Pay Now</button>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="glass-card credit-section">
          <h3><Smartphone size={20} /> Mobile Recharge</h3>
          <form onSubmit={handleRecharge} className="credit-form">
            <div className="input-group"><label>Phone Number</label><input type="tel" className="input-field" value={rechargeForm.phoneNumber} onChange={e => setRechargeForm({ ...rechargeForm, phoneNumber: e.target.value })} required /></div>
            <div className="input-group"><label>Amount (₹)</label><input type="number" className="input-field" value={rechargeForm.amount} onChange={e => setRechargeForm({ ...rechargeForm, amount: e.target.value })} min="10" required /></div>
            <div className="input-group"><label>Provider</label>
              <select className="input-field" value={rechargeForm.provider} onChange={e => setRechargeForm({ ...rechargeForm, provider: e.target.value })}>
                <option>Jio</option><option>Airtel</option><option>Vi</option><option>BSNL</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Recharge</button>
          </form>
        </div>
      )}
    </motion.div>
  );
}
