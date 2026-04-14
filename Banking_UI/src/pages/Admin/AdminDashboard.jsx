/* ═══════════════════════════════════════════════════════════════════════
   AdminDashboard Component
   The main admin command center. The sidebar drives navigation via
   React Router — each route (/admin, /admin/kyc, etc.) renders this
   component, which reads the URL path to determine the active view.
   ═══════════════════════════════════════════════════════════════════════ */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
  Users, AlertTriangle, ShieldCheck, Activity, Search,
  CheckCircle2, XCircle, DollarSign, TrendingUp, ArrowUpRight,
  ArrowDownRight, Clock, BarChart3, Send, Ban, Unlock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  adminAddMoney, getKycQueue, reviewKyc, getUserPortfolio,
  getOpenTickets, resolveTicket, getPendingLoans, approveLoan,
  rejectLoan, getAllUsers, suspendUser, unsuspendUser
} from '../../api/api';
import './Admin.css';

/* ═══════════════════════════════════════════════════════════════════════
   Main AdminDashboard Component
   ═══════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const location = useLocation();
  const { admin } = useAuth();

  const getViewFromPath = (pathname) => {
    if (pathname === '/admin/kyc') return 'kyc';
    if (pathname === '/admin/users') return 'users';
    if (pathname === '/admin/transactions') return 'transactions';
    if (pathname === '/admin/tickets') return 'tickets';
    if (pathname === '/admin/loans') return 'loans';
    if (pathname === '/admin/add-money') return 'add-money';
    return 'overview';
  };

  const [activeView, setActiveView] = useState(getViewFromPath(location.pathname));

  useEffect(() => {
    setActiveView(getViewFromPath(location.pathname));
  }, [location.pathname]);

  const renderContent = () => {
    switch (activeView) {
      case 'kyc':
        return <KycQueue key="kyc" />;
      case 'users':
        return <UserManagement key="users" />;
      case 'transactions':
        return <TransactionReview key="transactions" />;
      case 'tickets':
        return <SupportTickets key="tickets" />;
      case 'loans':
        return <LoanUnderwriting key="loans" />;
      case 'add-money':
        return <AddMoney key="add-money" />;
      case 'overview':
      default:
        return <OverviewDashboard key="overview" adminName={admin?.name || 'Admin'} />;
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   OverviewDashboard
   ═══════════════════════════════════════════════════════════════════════ */
function OverviewDashboard({ adminName }) {
  const stats = [
    { title: "Total Users", value: "14,205", icon: <Users size={22} />, trend: "+12%", positive: true, subtitle: "Active accounts" },
    { title: "Pending KYC", value: "243", icon: <ShieldCheck size={22} />, trend: "-5%", positive: false, subtitle: "Awaiting verification" },
    { title: "Flagged Txns", value: "12", icon: <AlertTriangle size={22} />, trend: "+2%", positive: false, subtitle: "Needs review" },
    { title: "System Liquidity", value: "₹4.2Cr", icon: <DollarSign size={22} />, trend: "+1.2%", positive: true, subtitle: "Total reserves" },
  ];
  const insights = [
    { label: "Today's Signups", value: "127", change: "+18%", icon: <TrendingUp size={18} /> },
    { label: "Avg. Response Time", value: "1.2s", change: "-8%", icon: <Clock size={18} /> },
    { label: "Txn Volume (24h)", value: "₹1.8Cr", change: "+22%", icon: <BarChart3 size={18} /> },
  ];

  return (
    <motion.div className="admin-overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <div className="admin-header">
        <div className="admin-header-text">
          <h1>Welcome back, {adminName}</h1>
          <p>Here's what's happening across the system today.</p>
        </div>
        <div className="admin-header-badge">
          <span className="badge badge-green">System Online</span>
        </div>
      </div>
      <div className="admin-stats-grid">
        {stats.map((stat, i) => (
          <motion.div key={i} className="admin-stat-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08, duration: 0.4 }}>
            <div className="admin-stat-top">
              <div className="admin-stat-icon">{stat.icon}</div>
              <span className={`admin-stat-trend ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{stat.trend}
              </span>
            </div>
            <div className="admin-stat-value">{stat.value}</div>
            <div className="admin-stat-title">{stat.title}</div>
            <div className="admin-stat-subtitle">{stat.subtitle}</div>
          </motion.div>
        ))}
      </div>
      <div className="admin-insights">
        {insights.map((item, i) => (
          <div key={i} className="admin-insight-card">
            <div className="insight-icon">{item.icon}</div>
            <div className="insight-content">
              <span className="insight-label">{item.label}</span>
              <span className="insight-value">{item.value}</span>
            </div>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{item.change}</span>
          </div>
        ))}
      </div>
      <div className="admin-section">
        <h3 className="admin-section-title">Recent Audit Logs</h3>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Admin</th><th>Action</th><th>Target</th><th>Time</th></tr></thead>
            <tbody>
              <tr><td><div className="admin-user-cell"><div className="admin-avatar">S</div><span>superadmin@pranavbank.com</span></div></td><td><span className="badge badge-red">FREEZE_ACCOUNT</span></td><td>UID-8439</td><td><span className="admin-time"><Clock size={12} /> 2 mins ago</span></td></tr>
              <tr><td><div className="admin-user-cell"><div className="admin-avatar">C</div><span>compliance@pranavbank.com</span></div></td><td><span className="badge badge-green">APPROVE_KYC</span></td><td>UID-2391</td><td><span className="admin-time"><Clock size={12} /> 15 mins ago</span></td></tr>
              <tr><td><div className="admin-user-cell"><div className="admin-avatar">S</div><span>support@pranavbank.com</span></div></td><td><span className="badge badge-blue">APPROVE_LOAN</span></td><td>LN-4412</td><td><span className="admin-time"><Clock size={12} /> 1 hour ago</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   KYC Queue
   ═══════════════════════════════════════════════════════════════════════ */
function KycQueue() {
  const [kycQueue, setKycQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchQueue(); }, []);
  const fetchQueue = async () => {
    try { const res = await getKycQueue(); setKycQueue(res.data); } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  const handleReview = async (id, status) => {
    try { await reviewKyc(id, status); fetchQueue(); } catch (err) { alert("Failed: " + (err.response?.data?.error || err.message)); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <div className="admin-header">
        <div className="admin-header-text"><h1>KYC Verification Queue</h1><p>Review and process pending identity verification requests.</p></div>
        <span className="badge badge-warning" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>{kycQueue.length} Pending</span>
      </div>
      <div className="admin-table-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}><span className="spinner"></span></div>
          ) : kycQueue.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>No pending KYC requests.</div>
          ) : kycQueue.map((item) => (
            <div key={item.id} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                <div className="admin-user-cell">
                  <div className="admin-avatar">{item.userEmail.charAt(0).toUpperCase()}</div>
                  <div>
                    <span style={{ fontWeight: 'bold' }}>{item.userEmail}</span>
                    <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b' }}>Request ID: KYC-{item.id}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-approve" onClick={() => handleReview(item.id, 'APPROVED')}><CheckCircle2 size={14} /> Approve</button>
                  <button className="btn-reject" onClick={() => handleReview(item.id, 'REJECTED')}><XCircle size={14} /> Reject</button>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
                <div><strong>Full Legal Name:</strong> {item.legalName || 'N/A'}</div>
                <div><strong>DOB:</strong> {item.dob || 'N/A'}</div>
                <div><strong>Gender:</strong> {item.gender || 'N/A'}</div>
                
                <div><strong>ID Type:</strong> {item.documentType}</div>
                <div><strong>ID Number:</strong> {item.documentNumber}</div>
                <div><strong>Employment:</strong> {item.employmentStatus || 'N/A'}</div>
                
                <div><strong>Income Range:</strong> {item.annualIncome || 'N/A'}</div>
                <div><strong>Same as Permanent:</strong> {item.sameAddress ? 'Yes' : 'No'}</div>
              </div>
              
              <div style={{ fontSize: '0.9rem', background: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>Address:</strong> {item.streetAddress || 'N/A'}, {item.city || 'N/A'}, {item.state || 'N/A'} - {item.pinCode || 'N/A'}
              </div>
            </div>
          ))}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Support Tickets
   ═══════════════════════════════════════════════════════════════════════ */
function SupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTickets(); }, []);
  const fetchTickets = async () => {
    try { const res = await getOpenTickets(); setTickets(res.data); } catch { } setLoading(false);
  };
  const handleResolve = async (id, status) => {
    try { await resolveTicket(id, status); fetchTickets(); } catch (err) { alert(err.message); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="admin-header">
        <div className="admin-header-text"><h1>Support Tickets</h1><p>Review and resolve user requests (Card Unfreeze, Disputes, etc).</p></div>
        <span className="badge badge-warning">{tickets.length} Open</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>User</th><th>Type</th><th>Description</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="6" style={{textAlign:"center", padding:"2rem"}}><span className="spinner" /></td></tr> :
             tickets.length === 0 ? <tr><td colSpan="6" style={{textAlign:"center", padding:"2rem"}}>No open tickets</td></tr> :
             tickets.map(t => (
              <tr key={t.id}>
                <td><strong>TKT-{t.id}</strong></td>
                <td>{t.userEmail}</td>
                <td><span className={`badge ${t.ticketType === 'DISPUTE' ? 'badge-red' : 'badge-blue'}`}>{t.ticketType}</span></td>
                <td style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{t.description}</td>
                <td><span className="admin-time"><Clock size={12} /> {t.createdAt?.substring(0,10)}</span></td>
                <td>
                  <div className="admin-action-btns">
                    <button className="btn-approve" onClick={() => handleResolve(t.id, 'APPROVED')}><CheckCircle2 size={14} /> {t.ticketType === 'DISPUTE' ? 'Reverse & Refund' : 'Resolve & Approve'}</button>
                    <button className="btn-reject" onClick={() => handleResolve(t.id, 'REJECTED')}><XCircle size={14} /> Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Loan Underwriting Queue (NEW)
   ═══════════════════════════════════════════════════════════════════════ */
function LoanUnderwriting() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchLoans(); }, []);
  const fetchLoans = async () => {
    try { const res = await getPendingLoans(); setLoans(res.data); } catch { } setLoading(false);
  };
  const handleApprove = async (id) => {
    try { await approveLoan(id); fetchLoans(); } catch (err) { alert(err.response?.data?.error || err.message); }
  };
  const handleReject = async (id) => {
    try { await rejectLoan(id); fetchLoans(); } catch (err) { alert(err.response?.data?.error || err.message); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="admin-header">
        <div className="admin-header-text"><h1>Loan Underwriting Queue</h1><p>Review and approve/reject pending loan applications.</p></div>
        <span className="badge badge-warning">{loans.length} Pending</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Loan ID</th><th>User</th><th>Type</th><th>Amount</th><th>Tenure</th><th>EMI</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan="7" style={{textAlign:"center", padding:"2rem"}}><span className="spinner" /></td></tr> :
             loans.length === 0 ? <tr><td colSpan="7" style={{textAlign:"center", padding:"2rem"}}>No pending loan applications.</td></tr> :
             loans.map(loan => (
              <tr key={loan.id}>
                <td><strong>LN-{loan.id}</strong></td>
                <td><div className="admin-user-cell"><div className="admin-avatar">{loan.accountEmail?.charAt(0).toUpperCase()}</div><span>{loan.accountEmail}</span></div></td>
                <td><span className="badge badge-blue">{loan.loanType}</span></td>
                <td className="admin-amount-danger">₹{Number(loan.amount).toLocaleString('en-IN')}</td>
                <td>{loan.tenure} months</td>
                <td>₹{Number(loan.monthlyPayment || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}/mo</td>
                <td>
                  <div className="admin-action-btns">
                    <button className="btn-approve" onClick={() => handleApprove(loan.id)}><CheckCircle2 size={14} /> Approve & Disburse</button>
                    <button className="btn-reject" onClick={() => handleReject(loan.id)}><XCircle size={14} /> Reject</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   User Management (REAL DATA FROM DB)
   ═══════════════════════════════════════════════════════════════════════ */
function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = async () => {
    try { const res = await getAllUsers(); setUsers(res.data); } catch { } setLoading(false);
  };

  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(u.uid).includes(searchQuery)
  );

  const handleViewPortfolio = async (email) => {
    try { const res = await getUserPortfolio(email); setPortfolioData(res.data); setViewingUser(email); } catch { alert("Failed to load portfolio"); }
  };

  const handleSuspend = async (email) => {
    try { await suspendUser(email); fetchUsers(); } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };
  const handleUnsuspend = async (email) => {
    try { await unsuspendUser(email); fetchUsers(); } catch (err) { alert(err.response?.data?.error || 'Failed'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <div className="admin-header">
        <div className="admin-header-text"><h1>User Management</h1><p>Search, review, and manage user accounts.</p></div>
      </div>
      <div className="admin-search-bar">
        <Search size={20} />
        <input type="text" placeholder="Search by name, email, or UID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      {loading ? <div style={{textAlign:'center', padding:'2rem'}}><span className="spinner" /></div> : (
      <div className="admin-users-grid">
        {filteredUsers.map((user) => (
          <motion.div key={user.uid || user.email} className="admin-user-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="admin-user-card-header">
              <div className="admin-user-card-avatar">{(user.name || 'U').charAt(0)}</div>
              <div className="admin-user-card-info">
                <h4>{user.name}</h4>
                <span className="admin-user-card-uid">UID-{user.uid}</span>
              </div>
              <span className={`badge ${user.status === 'ACTIVE' ? 'badge-green' : 'badge-red'}`}>{user.status}</span>
            </div>
            <div className="admin-user-card-details">
              <div><span className="detail-label">Email</span><span>{user.email}</span></div>
              <div><span className="detail-label">Balance</span><span className="detail-value">₹{Number(user.balance || 0).toLocaleString('en-IN')}</span></div>
              <div><span className="detail-label">Tier</span><span className="detail-value">{user.tier}</span></div>
              <div><span className="detail-label">KYC</span><span className="detail-value">{user.kycStatus}</span></div>
            </div>
            <div className="admin-user-card-actions">
              {user.status === 'ACTIVE' ? (
                <button className="btn-reject" onClick={() => handleSuspend(user.email)}><Ban size={14} /> Suspend</button>
              ) : (
                <button className="btn-approve" onClick={() => handleUnsuspend(user.email)}><Unlock size={14} /> Unsuspend</button>
              )}
              <button className="btn-approve" onClick={() => handleViewPortfolio(user.email)}>
                <Activity size={14} /> View Portfolio
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      {viewingUser && portfolioData && (
        <div className="modal-overlay" onClick={() => setViewingUser(null)} style={{position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', zIndex: 100, display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="glass-card" onClick={e => e.stopPropagation()} style={{padding: '2rem', width:'90%', maxWidth:'800px', maxHeight:'80vh', overflowY:'auto'}}>
            <h2 style={{borderBottom: '1px solid var(--border-light)', paddingBottom:'1rem', marginBottom:'1rem'}}>Portfolio: {viewingUser}</h2>

            <h4>Virtual Cards ({portfolioData.cards?.length || 0})</h4>
            <div className="admin-table-wrap" style={{marginBottom: '1rem'}}>
              <table className="admin-table">
                <thead><tr><th>PAN</th><th>Limit</th><th>Status</th></tr></thead>
                <tbody>{portfolioData.cards?.length ? portfolioData.cards.map((c, i) => <tr key={i}><td>{c.pan}</td><td>₹{c.dailyLimit}</td><td>{c.isActive ? 'Active' : 'Frozen'}</td></tr>) : <tr><td colSpan="3" style={{textAlign:'center'}}>None</td></tr>}</tbody>
              </table>
            </div>

            <h4>Savings Pots ({portfolioData.pots?.length || 0})</h4>
            <div className="admin-table-wrap" style={{marginBottom: '1rem'}}>
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Balance</th><th>Target</th></tr></thead>
                <tbody>{portfolioData.pots?.length ? portfolioData.pots.map((p, i) => <tr key={i}><td>{p.potName}</td><td>₹{p.currentBalance}</td><td>₹{p.targetAmount}</td></tr>) : <tr><td colSpan="3" style={{textAlign:'center'}}>None</td></tr>}</tbody>
              </table>
            </div>

            <h4>Loans ({portfolioData.loans?.length || 0})</h4>
            <div className="admin-table-wrap" style={{marginBottom: '1rem'}}>
              <table className="admin-table">
                <thead><tr><th>Type</th><th>Amount</th><th>Status</th><th>EMI</th></tr></thead>
                <tbody>{portfolioData.loans?.length ? portfolioData.loans.map((l, i) => <tr key={i}><td>{l.loanType}</td><td>₹{l.amount}</td><td>{l.status}</td><td>₹{Number(l.monthlyPayment || 0).toFixed(0)}/mo</td></tr>) : <tr><td colSpan="4" style={{textAlign:'center'}}>None</td></tr>}</tbody>
              </table>
            </div>

            <h4>Fixed Deposits ({portfolioData.fds?.length || 0})</h4>
            <div className="admin-table-wrap" style={{marginBottom: '1rem'}}>
              <table className="admin-table">
                <thead><tr><th>Type</th><th>Amount</th><th>Rate</th><th>Status</th></tr></thead>
                <tbody>{portfolioData.fds?.length ? portfolioData.fds.map((fd, i) => <tr key={i}><td>{fd.fdType}</td><td>₹{fd.fdAmount}</td><td>{fd.fdInterestRate}%</td><td>{fd.fdStatus}</td></tr>) : <tr><td colSpan="4" style={{textAlign:'center'}}>None</td></tr>}</tbody>
              </table>
            </div>

            <h4>SIPs ({portfolioData.sips?.length || 0})</h4>
            <div className="admin-table-wrap" style={{marginBottom: '1rem'}}>
              <table className="admin-table">
                <thead><tr><th>Type</th><th>Amount</th><th>Rate</th><th>Status</th></tr></thead>
                <tbody>{portfolioData.sips?.length ? portfolioData.sips.map((s, i) => <tr key={i}><td>{s.sipType}</td><td>₹{s.sipAmount}</td><td>{s.sipInterestRate}%</td><td>{s.sipStatus}</td></tr>) : <tr><td colSpan="4" style={{textAlign:'center'}}>None</td></tr>}</tbody>
              </table>
            </div>

            <div style={{marginTop:'2rem', textAlign:'right'}}>
              <button className="btn btn-secondary" onClick={() => setViewingUser(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Transaction Review (Flagged Txns)
   ═══════════════════════════════════════════════════════════════════════ */
function TransactionReview() {
  const dummyTxns = [
    { id: "TXN-99821", amount: "₹15,000", from: "UID-1022", to: "EXT-ACC-883", reason: "Velocity Spike", time: "10 mins ago" },
    { id: "TXN-88432", amount: "₹25,500", from: "UID-3301", to: "EXT-ACC-441", reason: "Large Transfer", time: "30 mins ago" },
    { id: "TXN-77219", amount: "₹12,800", from: "UID-5592", to: "UID-7788", reason: "New Payee + Large Amt", time: "1 hour ago" },
    { id: "TXN-66108", amount: "₹50,000", from: "UID-7788", to: "EXT-ACC-992", reason: "Exceeds Daily Limit", time: "2 hours ago" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <div className="admin-header">
        <div className="admin-header-text"><h1>Flagged Transactions</h1><p>Review and process flagged high-value or suspicious transfers.</p></div>
        <span className="badge badge-red" style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>{dummyTxns.length} Flagged</span>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Txn ID</th><th>Amount</th><th>From</th><th>To</th><th>Flag Reason</th><th>Time</th><th>Actions</th></tr></thead>
          <tbody>
            {dummyTxns.map((txn) => (
              <tr key={txn.id}>
                <td><strong>{txn.id}</strong></td>
                <td className="admin-amount-danger">{txn.amount}</td>
                <td>{txn.from}</td>
                <td>{txn.to}</td>
                <td><span className="badge badge-red">{txn.reason}</span></td>
                <td><span className="admin-time"><Clock size={12} /> {txn.time}</span></td>
                <td>
                  <div className="admin-action-btns">
                    <button className="btn-approve"><CheckCircle2 size={14} /> Clear</button>
                    <button className="btn-reject"><XCircle size={14} /> Reverse</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   AddMoney
   ═══════════════════════════════════════════════════════════════════════ */
function AddMoney() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleAdd = async (e) => {
    e.preventDefault(); setLoading(true); setMsg({ type: '', text: '' });
    try {
      await adminAddMoney(email, Number(amount));
      setMsg({ type: 'success', text: `Successfully added ₹${Number(amount).toLocaleString('en-IN')} to ${email}` });
      setEmail(''); setAmount('');
    } catch (err) { setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to add money' }); }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <div className="admin-header">
        <div className="admin-header-text"><h1>Add Money to Account</h1><p>Credit funds to any user account by their email address.</p></div>
      </div>
      <div className="admin-add-money-card">
        <div className="admin-add-money-icon"><Send size={32} /></div>
        <form onSubmit={handleAdd} className="admin-add-money-form">
          <div className="input-group">
            <label>User Email</label>
            <input type="email" className="input-field" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Amount (₹)</label>
            <input type="number" className="input-field" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" required />
          </div>
          {msg.text && <div className={msg.type === 'success' ? 'auth-success' : 'auth-error'}>{msg.text}</div>}
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? <span className="spinner" /> : 'Add Money'}</button>
        </form>
      </div>
    </motion.div>
  );
}
