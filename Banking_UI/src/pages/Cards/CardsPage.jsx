import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMyCards, generateCard, toggleCardFreeze, setCardPin, setDailyLimit } from '../../api/api';
import { CreditCard, Plus, Snowflake, Sun, Lock, Gauge } from 'lucide-react';
import './Cards.css';

function Card3D({ card, onRefresh }) {
  const [flipped, setFlipped] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [limitInput, setLimitInput] = useState('');
  const [msg, setMsg] = useState('');

  const handleFreeze = async () => {
    try {
      await toggleCardFreeze(card.id);
      setMsg(card.isActive ? 'Card frozen' : 'Card activated');
      onRefresh();
    } catch { setMsg('Failed'); }
    setTimeout(() => setMsg(''), 2000);
  };

  const handlePin = async (e) => {
    e.preventDefault();
    try { await setCardPin(card.id, pinInput); setMsg('PIN set!'); setPinInput(''); }
    catch { setMsg('Failed'); }
    setTimeout(() => setMsg(''), 2000);
  };

  const handleLimit = async (e) => {
    e.preventDefault();
    try { await setDailyLimit(card.id, Number(limitInput)); setMsg('Limit updated!'); setLimitInput(''); onRefresh(); }
    catch { setMsg('Failed'); }
    setTimeout(() => setMsg(''), 2000);
  };

  const pan = card.pan || '0000000000000000';
  const formatted = pan.replace(/(.{4})/g, '$1 ').trim();

  return (
    <div className="card-3d-section">
      {/* The 3D Card */}
      <div className={`card-3d-container ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <motion.div className="card-3d-inner"
          initial={{ rotateY: 0 }} animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}>

          {/* Front */}
          <div className={`card-face card-front ${!card.isActive ? 'frozen' : ''}`}>
            {!card.isActive && <div className="frozen-overlay"><Snowflake size={40} /><span>FROZEN</span></div>}
            <div className="card-top-row">
              <span className="card-brand">Bank</span>
              <span className="card-contactless">)))</span>
            </div>
            <div className="card-chip" />
            <div className="card-pan">{formatted}</div>
            <div className="card-bottom-row">
              <div><span className="card-label">EXPIRES</span><span className="card-val">{card.expiryDate || '—'}</span></div>
              <div><span className="card-label">LIMIT</span><span className="card-val">₹{Number(card.dailyLimit || 0).toLocaleString('en-IN')}</span></div>
            </div>
          </div>

          {/* Back */}
          <div className="card-face card-back">
            <div className="card-mag-stripe" />
            <div className="card-cvv-area">
              <span className="card-label">CVV</span>
              <span className="card-cvv">{card.cvv || '•••'}</span>
            </div>
            <p className="card-back-text">This card is property of Bank. Tap to flip back.</p>
          </div>
        </motion.div>
      </div>
      <p className="card-tap-hint">Tap card to flip</p>

      {/* Controls */}
      <div className="card-controls">
        <button className={`ctrl-btn ${!card.isActive ? 'active-ctrl' : ''}`} onClick={handleFreeze}>
          {card.isActive ? <><Snowflake size={16} /> Freeze</> : <><Sun size={16} /> Activate</>}
        </button>

        <form onSubmit={handlePin} className="ctrl-inline">
          <input type="password" maxLength={4} placeholder="New PIN" value={pinInput}
            onChange={e => setPinInput(e.target.value)} className="ctrl-input" required />
          <button type="submit" className="ctrl-btn"><Lock size={14} /> Set</button>
        </form>

        <form onSubmit={handleLimit} className="ctrl-inline">
          <input type="number" placeholder="Daily Limit" value={limitInput}
            onChange={e => setLimitInput(e.target.value)} className="ctrl-input" required />
          <button type="submit" className="ctrl-btn"><Gauge size={14} /> Set</button>
        </form>
      </div>
      {msg && <motion.div className="card-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{msg}</motion.div>}
    </div>
  );
}

export default function CardsPage() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [genLoading, setGenLoading] = useState(false);

  const fetchCards = async () => {
    try { const res = await getMyCards(); setCards(res.data); } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCards(); }, []);

  const handleGenerate = async () => {
    setGenLoading(true);
    try { await generateCard(); fetchCards(); } catch {}
    setGenLoading(false);
  };

  return (
    <motion.div className="cards-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="cards-header">
        <div>
          <h1>Virtual Cards</h1>
          <p className="page-subtitle">Manage your virtual debit cards with 3D controls.</p>
        </div>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={genLoading}>
          {genLoading ? <span className="spinner" /> : <><Plus size={18} /> Generate Card</>}
        </button>
      </div>

      {loading ? (
        <div className="cards-grid">
          {[1,2].map(i => <div key={i} className="skeleton" style={{ height: 300, borderRadius: 16 }} />)}
        </div>
      ) : cards.length === 0 ? (
        <div className="empty-state glass-card" style={{ padding: '4rem' }}>
          <CreditCard size={48} strokeWidth={1.5} />
          <p>No cards yet</p><span>Generate your first virtual card above</span>
        </div>
      ) : (
        <div className="cards-grid">
          {cards.map(card => <Card3D key={card.id} card={card} onRefresh={fetchCards} />)}
        </div>
      )}
    </motion.div>
  );
}
