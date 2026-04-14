import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPots, createPot, fundPot, withdrawPot } from '../../api/api';
import { PiggyBank, Plus, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import './Pots.css';

export default function PotsPage() {
  const [pots, setPots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [amounts, setAmounts] = useState({});
  const [msg, setMsg] = useState('');

  const fetchPots = async () => {
    try { const r = await getPots(); setPots(r.data); } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchPots(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await createPot(newName, Number(newTarget)); setNewName(''); setNewTarget(''); setShowCreate(false); fetchPots(); }
    catch (err) { setMsg(err.response?.data?.error || 'Failed'); }
  };

  const handleFund = async (potId) => {
    try { await fundPot(potId, Number(amounts[potId] || 0)); setAmounts({ ...amounts, [potId]: '' }); fetchPots(); setMsg('Funded!'); }
    catch (err) { setMsg(err.response?.data?.error || 'Failed'); }
    setTimeout(() => setMsg(''), 2000);
  };

  const handleWithdraw = async (potId) => {
    try { await withdrawPot(potId, Number(amounts[potId] || 0)); setAmounts({ ...amounts, [potId]: '' }); fetchPots(); setMsg('Withdrawn!'); }
    catch (err) { setMsg(err.response?.data?.error || 'Failed'); }
    setTimeout(() => setMsg(''), 2000);
  };

  return (
    <motion.div className="pots-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="cards-header">
        <div><h1>Savings Pots</h1><p className="page-subtitle">Virtual sub-accounts for goal-based savings.</p></div>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)}><Plus size={18} /> New Pot</button>
      </div>

      {msg && <motion.div className="card-msg" style={{ marginBottom: '1rem' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{msg}</motion.div>}

      {showCreate && (
        <motion.form className="glass-card pot-create-form" onSubmit={handleCreate} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="input-group"><label>Pot Name</label><input className="input-field" placeholder="e.g. Holiday Fund" value={newName} onChange={e => setNewName(e.target.value)} required /></div>
          <div className="input-group"><label>Target Amount</label><input type="number" className="input-field" placeholder="50000" value={newTarget} onChange={e => setNewTarget(e.target.value)} min="1" required /></div>
          <button type="submit" className="btn btn-primary">Create Pot</button>
        </motion.form>
      )}

      {loading ? (
        <div className="pots-grid">{[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />)}</div>
      ) : pots.length === 0 ? (
        <div className="empty-state glass-card" style={{ padding: '4rem' }}><PiggyBank size={48} strokeWidth={1.5} /><p>No pots created yet</p></div>
      ) : (
        <div className="pots-grid">
          {pots.map((pot, i) => {
            const pct = pot.targetAmount > 0 ? Math.min((pot.currentAmount / pot.targetAmount) * 100, 100) : 0;
            return (
              <motion.div key={pot.potId || i} className="glass-card pot-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="pot-header">
                  <div className="pot-icon"><PiggyBank size={22} /></div>
                  <h3>{pot.potName}</h3>
                </div>
                <div className="pot-amounts">
                  <span className="pot-current">₹{Number(pot.currentAmount || 0).toLocaleString('en-IN')}</span>
                  <span className="pot-target">of ₹{Number(pot.targetAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="pot-progress-track"><motion.div className="pot-progress-bar" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} /></div>
                <span className="pot-pct">{pct.toFixed(0)}% complete</span>
                <div className="pot-actions">
                  <input type="number" placeholder="Amount" className="ctrl-input" value={amounts[pot.potId] || ''}
                    onChange={e => setAmounts({ ...amounts, [pot.potId]: e.target.value })} />
                  <button className="ctrl-btn" onClick={() => handleFund(pot.potId)}><ArrowDownToLine size={14} /> Fund</button>
                  <button className="ctrl-btn" onClick={() => handleWithdraw(pot.potId)}><ArrowUpFromLine size={14} /> Withdraw</button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
