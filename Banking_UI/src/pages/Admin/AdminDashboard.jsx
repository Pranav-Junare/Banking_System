import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, AlertTriangle, ShieldCheck, 
  Activity, ArrowLeftRight, Settings, 
  Search, Filter, CheckCircle2, XCircle
} from 'lucide-react';
import './Admin.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: "Total Users", value: "14,205", icon: <Users size={20} />, trend: "+12%" },
    { title: "Pending KYC", value: "243", icon: <ShieldCheck size={20} />, trend: "-5%" },
    { title: "Flagged Txns", value: "12", icon: <AlertTriangle size={20} className="text-red-500" />, trend: "+2%" },
    { title: "System Liquidity", value: "$4.2M", icon: <Activity size={20} />, trend: "+1.2%" }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'kyc':
        return <KycQueue />;
      case 'users':
        return <UserManagement />;
      case 'transactions':
        return <TransactionReview />;
      case 'overview':
      default:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="admin-overview">
            <div className="stats-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">{stat.icon}</span>
                    <span className="stat-trend">{stat.trend}</span>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-title">{stat.title}</div>
                </div>
              ))}
            </div>
            
            <div className="recent-activity-section mt-8">
              <h3 className="section-title">Recent Audit Logs</h3>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Admin ID</th>
                      <th>Action</th>
                      <th>Target ID</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>superadmin@pranavbank.com</td><td><span className="badge badge-red">FREEZE_ACCOUNT</span></td><td>UID-8439</td><td>2 mins ago</td></tr>
                    <tr><td>compliance@pranavbank.com</td><td><span className="badge badge-green">APPROVE_KYC</span></td><td>UID-2391</td><td>15 mins ago</td></tr>
                    <tr><td>support@pranavbank.com</td><td><span className="badge badge-blue">RESET_MFA</span></td><td>UID-5521</td><td>1 hour ago</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>Command Center</h1>
        <p>Global system management and compliance monitoring.</p>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><Activity size={16} /> Overview</button>
        <button className={`tab-btn ${activeTab === 'kyc' ? 'active' : ''}`} onClick={() => setActiveTab('kyc')}><ShieldCheck size={16} /> KYC Queue</button>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}><Users size={16} /> User Management</button>
        <button className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}><AlertTriangle size={16} /> Flagged Txns</button>
      </div>

      <div className="admin-content-area">
        {renderContent()}
      </div>
    </div>
  );
}

function KycQueue() {
  const dummyKyc = [
    { id: "KYC-101", user: "Alice Johnson", docs: "Passport, Utility Bill", risk: "Low", status: "Pending" },
    { id: "KYC-102", user: "Bob Smith", docs: "Driver's License", risk: "Medium", status: "Pending" },
    { id: "KYC-103", user: "Charlie Davis", docs: "National ID", risk: "High", status: "Pending" },
  ];

  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="kyc-queue">
      <h3>Pending Identity Verifications</h3>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Applicant</th>
              <th>Documents Submited</th>
              <th>Risk Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyKyc.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.user}</td>
                <td>{item.docs}</td>
                <td><span className={`badge risk-${item.risk.toLowerCase()}`}>{item.risk}</span></td>
                <td>
                  <button className="btn-approve"><CheckCircle2 size={16} /></button>
                  <button className="btn-reject ml-2"><XCircle size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function UserManagement() {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="user-management">
       <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search by email, phone, or UID..." />
       </div>
       <div className="user-profile-preview mt-4">
          <div className="profile-card">
             <h4>Jane Doe (UID-5592)</h4>
             <p>jane.doe@example.com</p>
             <div className="tier-info">Tier 2 <span className="badge badge-green">Active</span></div>
             <div className="actions mt-4">
                <button className="btn-freeze">Freeze Account</button>
                <button className="btn-upgrade ml-2">Upgrade Tier</button>
             </div>
          </div>
       </div>
    </motion.div>
  );
}

function TransactionReview() {
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="transaction-review">
      <h3>Flagged Transactions (Over $10k)</h3>
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Txn ID</th>
              <th>Amount</th>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>TXN-99821</td>
              <td className="text-red-400">$15,000.00</td>
              <td>UID-1022</td>
              <td>EXT-ACC-883</td>
              <td>Velocity Spike</td>
              <td>
                <button className="btn-approve">Clear</button>
                <button className="btn-reject ml-2">Reverse</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
