import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCreditProfile, checkLoanEligibility, applyLoan, getMyLoans } from '../../api/api';
import { Landmark, ShieldCheck, FileText } from 'lucide-react';
import './Credit.css';

export default function CreditPage() {
  const [profile, setProfile] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eligibility, setEligibility] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [eligForm, setEligForm] = useState({ monthlyIncome: '', monthlyDebt: '', requestedAmount: '', tenureMonths: '' });
  const [loanForm, setLoanForm] = useState({ loanAmount: '', loanTenure: '' });

  const fetchData = async () => {
    try { const [p, l] = await Promise.allSettled([getCreditProfile(), getMyLoans()]);
      if (p.status === 'fulfilled') setProfile(p.value.data);
      if (l.status === 'fulfilled') setLoans(l.value.data);
    } catch {}
    setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);

  const handleEligibility = async (e) => {
    e.preventDefault();
    try { const r = await checkLoanEligibility(Number(eligForm.monthlyIncome), Number(eligForm.monthlyDebt), Number(eligForm.requestedAmount), Number(eligForm.tenureMonths));
      setEligibility(r.data);
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' }); }
  };

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    try { await applyLoan(Number(loanForm.loanAmount), Number(loanForm.loanTenure));
      setMsg({ type: 'success', text: 'Loan applied successfully!' }); fetchData();
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' }); }
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  return (
    <motion.div className="credit-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>Credit & Loans</h1>
      <p className="page-subtitle">Check eligibility, apply for loans, and manage your credit.</p>

      {msg.text && <div className={`auth-${msg.type}`} style={{ marginBottom: '1rem' }}>{msg.text}</div>}

      {/* Credit Profile */}
      {profile && (
        <motion.div className="glass-card credit-profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3><ShieldCheck size={20} /> Your Credit Profile</h3>
          <div className="cp-grid">
            <div><span className="cp-label">Credit Limit</span><span className="cp-val">₹{Number(profile.creditLimit || 0).toLocaleString('en-IN')}</span></div>
            <div><span className="cp-label">Overdraft Limit</span><span className="cp-val">₹{Number(profile.overdraftLimit || 0).toLocaleString('en-IN')}</span></div>
            <div><span className="cp-label">Statement Balance</span><span className="cp-val">₹{Number(profile.statementBalance || 0).toLocaleString('en-IN')}</span></div>
            <div><span className="cp-label">Repayment Score</span><span className="cp-val">{((profile.repaymentHistoryScore || 0) * 100).toFixed(0)}%</span></div>
          </div>
        </motion.div>
      )}

      {/* Eligibility Check */}
      <div className="glass-card credit-section">
        <h3><FileText size={20} /> Check Loan Eligibility</h3>
        <form onSubmit={handleEligibility} className="credit-form">
          <div className="input-group"><label>Monthly Income</label><input type="number" className="input-field" value={eligForm.monthlyIncome} onChange={e => setEligForm({ ...eligForm, monthlyIncome: e.target.value })} required /></div>
          <div className="input-group"><label>Monthly Debt</label><input type="number" className="input-field" value={eligForm.monthlyDebt} onChange={e => setEligForm({ ...eligForm, monthlyDebt: e.target.value })} required /></div>
          <div className="input-group"><label>Requested Amount</label><input type="number" className="input-field" value={eligForm.requestedAmount} onChange={e => setEligForm({ ...eligForm, requestedAmount: e.target.value })} required /></div>
          <div className="input-group"><label>Tenure (months)</label><input type="number" className="input-field" value={eligForm.tenureMonths} onChange={e => setEligForm({ ...eligForm, tenureMonths: e.target.value })} required /></div>
          <button type="submit" className="btn btn-primary">Check</button>
        </form>
        {eligibility && (
          <motion.div className="elig-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span className={`badge ${eligibility.eligible ? 'badge-success' : 'badge-danger'}`}>{eligibility.eligible ? 'Eligible' : 'Not Eligible'}</span>
            <span>DTI Ratio: {eligibility.dtiRatio?.toFixed(2)}</span>
            {eligibility.emi && <span>EMI: ₹{Number(eligibility.emi).toLocaleString('en-IN')}/mo</span>}
          </motion.div>
        )}
      </div>

      {/* Apply Loan */}
      <div className="glass-card credit-section">
        <h3><Landmark size={20} /> Apply for a Loan</h3>
        <form onSubmit={handleApplyLoan} className="credit-form">
          <div className="input-group"><label>Loan Amount</label><input type="number" className="input-field" value={loanForm.loanAmount} onChange={e => setLoanForm({ ...loanForm, loanAmount: e.target.value })} required /></div>
          <div className="input-group"><label>Tenure (months)</label><input type="number" className="input-field" value={loanForm.loanTenure} onChange={e => setLoanForm({ ...loanForm, loanTenure: e.target.value })} required /></div>
          <button type="submit" className="btn btn-primary">Apply</button>
        </form>
      </div>

      {/* My Loans */}
      {loans.length > 0 && (
        <div className="loans-list">
          <h3>Your Loans</h3>
          {loans.map((loan, i) => (
            <div key={i} className="glass-card wealth-item">
              <div className="wi-top"><span className="badge badge-info">Loan</span><span className="wi-amount">₹{Number(loan.loanAmount || 0).toLocaleString('en-IN')}</span></div>
              <div className="wi-details"><span>Tenure: {loan.loanTenure} months</span><span>Status: {loan.loanStatus || 'Active'}</span></div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
