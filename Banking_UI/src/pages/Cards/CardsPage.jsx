/* ═══════════════════════════════════════════════════════════════════════
   CardsPage Component — Virtual Card Management
   Displays 3D-flippable virtual debit cards with controls for
   freezing, setting PIN, and adjusting daily limits. Shows dummy
   cards when the API is offline for demonstration purposes.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'; /* React hooks for state and lifecycle */
import { motion } from 'framer-motion'; /* Animation library for card flip */
import { getMyCards, generateCard, toggleCardFreeze, setCardPin, setDailyLimit, createSupportTicket, getMyTickets } from '../../api/api'; /* Card API functions */
import { CreditCard, Plus, Snowflake, Sun, Lock, Gauge } from 'lucide-react'; /* Icon components */
import './Cards.css'; /* Cards page specific styles */

/* ─── Dummy Card Data ────────────────────────────────────────────────
   Fallback card data shown when the backend API is unavailable.
   Provides a realistic preview with two demo cards.
   ───────────────────────────────────────────────────────────────────── */
const DUMMY_CARDS = [
  { id: 1, pan: '4532891056781234', cvv: '847', expiryDate: '12/28', dailyLimit: 50000, isActive: true },
  { id: 2, pan: '4532891099876543', cvv: '321', expiryDate: '06/27', dailyLimit: 25000, isActive: false },
];

/* ═══════════════════════════════════════════════════════════════════════
   Card3D Sub-Component
   Renders a single 3D-flippable card with front/back faces and
   control buttons for freeze, PIN, and daily limit management.
   ═══════════════════════════════════════════════════════════════════════ */
function Card3D({ card, onRefresh }) {
  /* State to track if the card is flipped (showing back face) */
  const [flipped, setFlipped] = useState(false);

  /* State for the PIN input field */
  const [pinInput, setPinInput] = useState('');

  /* State for the daily limit input field */
  const [limitInput, setLimitInput] = useState('');

  /* Feedback message displayed below the controls */
  const [msg, setMsg] = useState('');

  /* ─── Freeze/Activate Toggle Handler ─────────────────────────────
     Toggles the card between frozen and active states. 
     If frozen, it raises an unfreeze request to the admin.
     ─────────────────────────────────────────────────────────────── */
  const handleFreeze = async () => {
    try {
      if (card.isActive) {
        await toggleCardFreeze(card.id, card.isActive); /* Call the freeze API */
        setMsg('Card frozen'); /* Show feedback */
        onRefresh(); /* Refresh the card list to reflect changes */
      } else {
        await createSupportTicket('CARD_UNFREEZE', String(card.id), 'Requesting to unfreeze virtual card.');
        setMsg('Unfreeze Request Sent to Admin');
      }
    } catch {
      setMsg('Failed'); /* Show error if API call fails */
    }
    setTimeout(() => setMsg(''), 3000); /* Clear message after 3 seconds */
  };

  /* ─── Set PIN Handler ────────────────────────────────────────────
     Sets a new 4-digit PIN for the card via the API.
     ─────────────────────────────────────────────────────────────── */
  const handlePin = async (e) => {
    e.preventDefault(); /* Prevent form submission reload */
    try {
      await setCardPin(card.id, pinInput); /* Call the set PIN API */
      setMsg('PIN set!'); /* Show success feedback */
      setPinInput('');    /* Clear the input field */
    } catch {
      setMsg('Failed'); /* Show error if API call fails */
    }
    setTimeout(() => setMsg(''), 2000); /* Clear message after 2 seconds */
  };

  /* ─── Set Daily Limit Handler ────────────────────────────────────
     Updates the daily spending limit for the card via the API.
     ─────────────────────────────────────────────────────────────── */
  const handleLimit = async (e) => {
    e.preventDefault(); /* Prevent form submission reload */
    try {
      await setDailyLimit(card.id, Number(limitInput)); /* Call the limit API */
      setMsg('Limit updated!'); /* Show success feedback */
      setLimitInput('');        /* Clear the input field */
      onRefresh();              /* Refresh card list to show new limit */
    } catch {
      setMsg('Failed'); /* Show error if API call fails */
    }
    setTimeout(() => setMsg(''), 2000); /* Clear message after 2 seconds */
  };

  /* Format the 16-digit PAN into groups of 4 with spaces */
  const pan = card.pan || '0000000000000000';
  const formatted = pan.replace(/(.{4})/g, '$1 ').trim();

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="card-3d-section">
      {/* ── The 3D Flippable Card ── */}
      {/* Clicking the card toggles the flip state */}
      <div
        className={`card-3d-container ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Inner container with preserve-3d for flip animation */}
        <motion.div
          className="card-3d-inner"
          initial={{ rotateY: 0 }}                    /* Start facing front */
          animate={{ rotateY: flipped ? 180 : 0 }}    /* Rotate 180° when flipped */
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} /* Smooth flip */
        >
          {/* ── Card Front Face ── */}
          <div className={`card-face card-front ${!card.isActive ? 'frozen' : ''}`}>
            {/* Frozen overlay — shown when card is deactivated */}
            {!card.isActive && (
              <div className="frozen-overlay">
                <Snowflake size={40} /> {/* Snowflake icon */}
                <span>FROZEN</span>     {/* Frozen label */}
              </div>
            )}
            {/* Top row — brand name and contactless symbol */}
            <div className="card-top-row">
              <span className="card-brand">PranavBank</span>
              <span className="card-contactless">)))</span>
            </div>
            {/* Chip graphic */}
            <div className="card-chip" />
            {/* Card number (PAN) formatted with spaces */}
            <div className="card-pan">{formatted}</div>
            {/* Bottom row — expiry date and daily limit */}
            <div className="card-bottom-row">
              <div>
                <span className="card-label">EXPIRES</span>
                <span className="card-val">{card.expiryDate || '—'}</span>
              </div>
              <div>
                <span className="card-label">LIMIT</span>
                <span className="card-val">₹{Number(card.dailyLimit || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* ── Card Back Face ── */}
          <div className="card-face card-back">
            {/* Magnetic stripe graphic */}
            <div className="card-mag-stripe" />
            {/* CVV area */}
            <div className="card-cvv-area">
              <span className="card-label">CVV</span>
              <span className="card-cvv">{card.cvv || '•••'}</span>
            </div>
            {/* Disclaimer text */}
            <p className="card-back-text">This card is property of PranavBank. Tap to flip back.</p>
          </div>
        </motion.div>
      </div>

      {/* Tap hint text below the card */}
      <p className="card-tap-hint">Tap card to flip</p>

      {/* ── Card Controls ── */}
      {/* Buttons and forms for card management actions */}
      <div className="card-controls">
        {/* Freeze/Activate toggle button */}
        <button
          className={`ctrl-btn ${!card.isActive ? 'active-ctrl' : ''}`}
          onClick={handleFreeze}
        >
          {card.isActive
            ? <><Snowflake size={16} /> Freeze</>    /* Show freeze if card is active */
            : <><Sun size={16} /> Request Unfreeze</> /* Request unfreeze if card is frozen */
          }
        </button>

        {/* Set PIN form — inline input with submit button */}
        <form onSubmit={handlePin} className="ctrl-inline">
          <input
            type="password"
            maxLength={4}
            placeholder="New PIN"
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            className="ctrl-input"
            required
          />
          <button type="submit" className="ctrl-btn"><Lock size={14} /> Set</button>
        </form>

        {/* Set Daily Limit form — inline input with submit button */}
        <form onSubmit={handleLimit} className="ctrl-inline">
          <input
            type="number"
            placeholder="Daily Limit"
            value={limitInput}
            onChange={e => setLimitInput(e.target.value)}
            className="ctrl-input"
            required
          />
          <button type="submit" className="ctrl-btn"><Gauge size={14} /> Set</button>
        </form>
      </div>

      {/* Feedback message — shown after an action */}
      {msg && (
        <motion.div className="card-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {msg}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CardsPage Component — Main Export
   Fetches the user's virtual cards from the API and displays them.
   Falls back to dummy cards when the API is unavailable.
   ═══════════════════════════════════════════════════════════════════════ */
export default function CardsPage() {
  /* State for the array of card objects */
  const [cards, setCards] = useState([]);

  /* Loading state — shows skeleton placeholders while fetching */
  const [loading, setLoading] = useState(true);

  /* Loading state for the card generation button */
  const [genLoading, setGenLoading] = useState(false);

  /* Alert msg for card top-level notifications */
  const [pageMsg, setPageMsg] = useState(null);

  /* ─── Fetch Cards and Tickets ─────────────────────────────────────────
     Calls the API to get the user's cards and recent tickets.
     Falls back to dummy cards if the API returns empty or fails.
     ─────────────────────────────────────────────────────────────────── */
  const fetchCards = async () => {
    try {
      const res = await getMyCards(); /* Call the cards API */
      /* Use API data if available, otherwise fall back to dummy data */
      setCards(res.data.length > 0 ? res.data : DUMMY_CARDS);
      
      // Also check if any card unfreeze tickets were recently resolved
      const tRes = await getMyTickets();
      if (tRes.data && tRes.data.length > 0) {
        const resolved = tRes.data.find(t => t.ticketType === 'CARD_UNFREEZE' && t.status !== 'OPEN');
        if (resolved) {
          setPageMsg(`One of your Card Unfreeze requests was ${resolved.status}!`);
          setTimeout(() => setPageMsg(null), 5000);
        }
      }
    } catch {
      setCards(DUMMY_CARDS); /* Use dummy data if API fails */
    }
    setLoading(false); /* Stop showing skeleton loaders */
  };

  /* Fetch cards when the component mounts */
  useEffect(() => { fetchCards(); }, []);

  /* ─── Generate New Card Handler ──────────────────────────────────
     Creates a new virtual card via the API and refreshes the list.
     ─────────────────────────────────────────────────────────────── */
  const handleGenerate = async () => {
    setGenLoading(true); /* Show loading spinner on button */
    try {
      await generateCard(); /* Call the generate card API */
      fetchCards();          /* Refresh the card list */
    } catch { /* Silently handle error */ }
    setGenLoading(false); /* Stop loading spinner */
  };

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <motion.div className="cards-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* ─── Notification Banner ─── */}
      {pageMsg && (
        <div className="kyc-alert" style={{ marginBottom: '1rem', backgroundColor: 'var(--bg-glass)', border: '1px solid var(--primary-color)', color: 'var(--text-color)' }}>
          {pageMsg}
        </div>
      )}

      {/* Page header with title and generate button */}
      <div className="cards-header">
        <div>
          <h1>Virtual Cards</h1>
          <p className="page-subtitle">Manage your virtual debit cards with 3D controls.</p>
        </div>
        {/* Generate new card button */}
        <button className="btn btn-primary" onClick={handleGenerate} disabled={genLoading}>
          {genLoading ? <span className="spinner" /> : <><Plus size={18} /> Generate Card</>}
        </button>
      </div>

      {/* Card display area */}
      {loading ? (
        /* Skeleton loading placeholders */
        <div className="cards-grid">
          {[1, 2].map(i => (
            <div key={i} className="skeleton" style={{ height: 300, borderRadius: 16 }} />
          ))}
        </div>
      ) : (
        /* Card grid — render each card as a 3D card component */
        <div className="cards-grid">
          {cards.map(card => (
            <Card3D key={card.id} card={card} onRefresh={fetchCards} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
