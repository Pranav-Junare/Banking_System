/* ═══════════════════════════════════════════════════════════════════════
   CreditPage Component — Credit & Loans
   Displays the user's credit profile, loan eligibility checker,
   loan application form, and active loans list. Falls back to dummy
   data when the backend API is unavailable.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef } from 'react'; /* React hooks for state and lifecycle */
import { motion } from 'framer-motion'; /* Animation library for transitions */
import { getCreditProfile, checkLoanEligibility, applyLoan, getMyLoans } from '../../api/api'; /* Credit API functions */
import { Landmark, ShieldCheck, FileText } from 'lucide-react'; /* Icon components */
import './Credit.css'; /* Credit page specific styles */

/* ─── Dummy Credit Profile ───────────────────────────────────────────
   Fallback credit profile data when the API is offline.
   ───────────────────────────────────────────────────────────────────── */
const DUMMY_PROFILE = {
  creditLimit: 500000,
  overdraftLimit: 50000,
  statementBalance: 12500,
  repaymentHistoryScore: 0.92,
};

/* ─── Dummy Loans ────────────────────────────────────────────────────
   Fallback active loan data when the API is offline.
   ───────────────────────────────────────────────────────────────────── */
const DUMMY_LOANS = [
  { loanAmount: 200000, loanTenure: 24, loanStatus: 'Active' },
  { loanAmount: 50000, loanTenure: 12, loanStatus: 'Active' },
];

/* ─── CreditPage Component ───────────────────────────────────────────
   Main exported component for the credit and loans page.
   ───────────────────────────────────────────────────────────────────── */
export default function CreditPage() {
  /* State for the user's credit profile data */
  const [profile, setProfile] = useState(null);

  /* State for the user's active loans array */
  const [loans, setLoans] = useState([]);

  /* Loading state for initial data fetch */
  const [loading, setLoading] = useState(true);

  /* State for the eligibility check result */
  const [eligibility, setEligibility] = useState(null);

  /* Feedback message with type and text */
  const [msg, setMsg] = useState({ type: '', text: '' });

  /* Eligibility check form state fields */
  const [eligForm, setEligForm] = useState({
    monthlyIncome: '',
    monthlyDebt: '',
    requestedAmount: '',
    tenureMonths: ''
  });

  /* Loan application form state fields */
  const [loanForm, setLoanForm] = useState({ loanAmount: '', loanTenure: '' });

  /* Reference to keep track of previous loans to detect approval */
  const prevLoans = useRef([]);

  /* Alert msg for popup notifications */
  const [pageMsg, setPageMsg] = useState(null);

  /* ─── Fetch Credit Data on Mount ───────────────────────────────────
     Fetches credit profile and active loans. Falls back to dummy data.
     ─────────────────────────────────────────────────────────────────── */
  const fetchData = async () => {
    try {
      const [p, l] = await Promise.allSettled([getCreditProfile(), getMyLoans()]);
      /* Set profile — use API data or fall back */
      setProfile(p.status === 'fulfilled' ? p.value.data : DUMMY_PROFILE);
      /* Set loans — use API data or fall back */
      if (l.status === 'fulfilled' && Array.isArray(l.value.data)) {
        const fetchedLoans = l.value.data;
        // Check if any loan went from PENDING_APPROVAL to APPROVED
        const oldLoans = prevLoans.current;
        if (oldLoans.length > 0) {
           const newlyApproved = fetchedLoans.find(nl => 
              nl.status === 'APPROVED' && 
              oldLoans.some(ol => ol.id === nl.id && ol.status === 'PENDING_APPROVAL')
           );
           if (newlyApproved) {
              setPageMsg('Your loan application was approved!');
              setTimeout(() => setPageMsg(null), 8000);
           }
        }
        prevLoans.current = fetchedLoans; // Update ref
        setLoans(fetchedLoans);
      } else {
        setLoans(DUMMY_LOANS);
      }
    } catch {
      setProfile(DUMMY_PROFILE); /* Use dummy profile */
      setLoans(DUMMY_LOANS);     /* Use dummy loans */
    }
    setLoading(false); /* Stop loading */
  };

  /* Fetch data on mount and poll every 5s for updates */
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ─── Check Eligibility Handler ──────────────────────────────────
     Checks loan eligibility based on the user's financial inputs.
     ─────────────────────────────────────────────────────────────── */
  const handleEligibility = async (e) => {
    e.preventDefault(); /* Prevent form reload */
    try {
      const r = await checkLoanEligibility(
        Number(eligForm.monthlyIncome),
        Number(eligForm.monthlyDebt),
        Number(eligForm.requestedAmount),
        Number(eligForm.tenureMonths)
      );
      setEligibility(r.data); /* Set the eligibility result */
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' });
    }
  };

  /* ─── Apply Loan Handler ─────────────────────────────────────────
     Submits a loan application via the API.
     ─────────────────────────────────────────────────────────────── */
  const handleApplyLoan = async (e) => {
    e.preventDefault(); /* Prevent form reload */
    try {
      await applyLoan(Number(loanForm.loanAmount), Number(loanForm.loanTenure));
      setMsg({ type: 'success', text: 'Loan applied successfully!' }); /* Success */
      fetchData(); /* Refresh loans list */
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' }); /* Error */
    }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000); /* Clear after 3s */
  };

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <motion.div className="credit-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* ─── Notification Popup ─── */}
      {pageMsg && (
        <div className="kyc-alert" style={{ marginBottom: '1rem', backgroundColor: 'var(--bg-glass)', border: '1px solid var(--primary-color)', color: 'var(--text-color)' }}>
          {pageMsg}
        </div>
      )}

      {/* Page title */}
      <h1>Credit & Loans</h1>
      <p className="page-subtitle">Check eligibility, apply for loans, and manage your credit.</p>

      {/* Feedback message */}
      {msg.text && (
        <div className={`auth-${msg.type}`} style={{ marginBottom: '1rem' }}>
          {msg.text}
        </div>
      )}

      {/* ── Credit Profile Card ── */}
      {/* Shows credit limit, overdraft, balance, and repayment score */}
      {profile && (
        <motion.div
          className="glass-card credit-profile"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3><ShieldCheck size={20} /> Your Credit Profile</h3>
          <div className="cp-grid">
            {/* Credit Limit */}
            <div>
              <span className="cp-label">Credit Limit</span>
              <span className="cp-val">₹{Number(profile.creditLimit || 0).toLocaleString('en-IN')}</span>
            </div>
            {/* Overdraft Limit */}
            <div>
              <span className="cp-label">Overdraft Limit</span>
              <span className="cp-val">₹{Number(profile.overdraftLimit || 0).toLocaleString('en-IN')}</span>
            </div>
            {/* Statement Balance */}
            <div>
              <span className="cp-label">Statement Balance</span>
              <span className="cp-val">₹{Number(profile.statementBalance || 0).toLocaleString('en-IN')}</span>
            </div>
            {/* Repayment Score */}
            <div>
              <span className="cp-label">Repayment Score</span>
              <span className="cp-val">{((profile.repaymentHistoryScore || 0) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Eligibility Check Form ── */}
      <div className="glass-card credit-section">
        <h3><FileText size={20} /> Check Loan Eligibility</h3>
        <form onSubmit={handleEligibility} className="credit-form">
          <div className="input-group">
            <label>Monthly Income</label>
            <input
              type="number"
              className="input-field"
              value={eligForm.monthlyIncome}
              onChange={e => setEligForm({ ...eligForm, monthlyIncome: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Monthly Debt</label>
            <input
              type="number"
              className="input-field"
              value={eligForm.monthlyDebt}
              onChange={e => setEligForm({ ...eligForm, monthlyDebt: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Requested Amount</label>
            <input
              type="number"
              className="input-field"
              value={eligForm.requestedAmount}
              onChange={e => setEligForm({ ...eligForm, requestedAmount: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Tenure (months)</label>
            <input
              type="number"
              className="input-field"
              value={eligForm.tenureMonths}
              onChange={e => setEligForm({ ...eligForm, tenureMonths: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Check</button>
        </form>
        {/* Eligibility result display */}
        {eligibility && (
          <motion.div className="elig-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className={`badge ${eligibility.eligible ? 'badge-success' : 'badge-danger'}`}>
              {eligibility.eligible ? 'Eligible' : 'Not Eligible'}
            </span>
            <span>DTI Ratio: {eligibility.dtiRatio?.toFixed(2)}</span>
            {eligibility.emi && <span>EMI: ₹{Number(eligibility.emi).toLocaleString('en-IN')}/mo</span>}
          </motion.div>
        )}
      </div>

      {/* ── Apply Loan Form ── */}
      <div className="glass-card credit-section">
        <h3><Landmark size={20} /> Apply for a Loan</h3>
        <form onSubmit={handleApplyLoan} className="credit-form">
          <div className="input-group">
            <label>Loan Amount</label>
            <input
              type="number"
              className="input-field"
              value={loanForm.loanAmount}
              onChange={e => setLoanForm({ ...loanForm, loanAmount: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <label>Tenure (months)</label>
            <input
              type="number"
              className="input-field"
              value={loanForm.loanTenure}
              onChange={e => setLoanForm({ ...loanForm, loanTenure: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      </div>

      {/* ── Active Loans List ── */}
      {loans.length > 0 && (
        <div className="loans-list">
          <h3>Your Loans</h3>
          {loans.map((loan, i) => (
            <div key={i} className="glass-card wealth-item">
              <div className="wi-top">
                <span className="badge badge-info">Loan</span>
                <span className="wi-amount">₹{Number(loan.amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="wi-details">
                <span>Tenure: {loan.tenure} months</span>
                <span>Status: {loan.status === 'PENDING_APPROVAL' ? 'Pending' : loan.status === 'APPROVED' ? 'Active' : loan.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
