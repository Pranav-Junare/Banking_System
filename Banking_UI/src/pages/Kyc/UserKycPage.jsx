import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyKycStatus, submitKyc } from '../../api/api';
import './UserKyc.css';

export default function UserKycPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState('LOADING');

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    legalName: '', dob: '', gender: 'Male',
    documentType: 'PAN', documentNumber: '',
    address: '', pinCode: '', sameAddress: false,
    employmentStatus: 'Salaried', annualIncome: 'Below ₹3L'
  });
  
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { fetchStatus(); }, []);

  const fetchStatus = async () => {
    try {
      const res = await getMyKycStatus();
      setStatus(res.data.status);
    } catch {
      setStatus(user?.kycStatus || 'NOT_SUBMITTED');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== 4) return;

    if (!form.documentNumber) {
      setMsg({ type: 'error', text: 'Document number required' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Backend expects the form data payload
      const payload = {
        legalName: form.legalName,
        dob: form.dob,
        gender: form.gender,
        documentType: form.documentType,
        documentNumber: form.documentNumber,
        streetAddress: form.address,
        city: form.city || '',
        state: form.state || '',
        pinCode: form.pinCode,
        sameAddress: form.sameAddress,
        employmentStatus: form.employmentStatus,
        annualIncome: form.annualIncome
      };
      await submitKyc(payload);
      setMsg({ type: 'success', text: 'KYC submitted successfully!' });
      setStatus('PENDING');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    }
  };

  const renderStepOne = () => (
    <div className="kyc-step">
      <h3>Step 1: Basic Identity</h3>
      <div className="kyc-form-group">
        <label>Full Legal Name</label>
        <span className="kyc-file-hint">Must exactly match your ID</span>
        <input type="text" name="legalName" value={form.legalName} onChange={handleChange} required />
      </div>
      <div className="kyc-form-group">
        <label>Date of Birth</label>
        <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
      </div>
      <div className="kyc-form-group">
        <label>Gender</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="kyc-step">
      <h3>Step 2: Document Verification</h3>
      <div className="kyc-form-group">
        <label>National ID Type</label>
        <select name="documentType" value={form.documentType} onChange={handleChange}>
          <option value="PAN">PAN Card</option>
          <option value="AADHAR">Aadhaar</option>
          <option value="PASSPORT">Passport</option>
          <option value="VOTER_ID">Voter ID</option>
        </select>
      </div>
      <div className="kyc-form-group">
        <label>National ID Number</label>
        <input type="text" name="documentNumber" value={form.documentNumber} onChange={handleChange} required />
      </div>
      <div className="kyc-form-group">
        <label>Upload ID Document</label>
        <input type="file" className="kyc-file-input" />
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="kyc-step">
      <h3>Step 3: Address Details</h3>
      <div className="kyc-form-group">
        <label>Current Residential Address (Street)</label>
        <textarea name="address" value={form.address} onChange={handleChange} rows="2" required></textarea>
      </div>
      <div className="kyc-form-group" style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <label>City</label>
          <input type="text" name="city" value={form.city || ''} onChange={handleChange} required />
        </div>
        <div style={{ flex: 1 }}>
          <label>State</label>
          <input type="text" name="state" value={form.state || ''} onChange={handleChange} required />
        </div>
        <div style={{ flex: 1 }}>
          <label>PIN Code</label>
          <input type="text" name="pinCode" value={form.pinCode || ''} onChange={handleChange} required />
        </div>
      </div>
      <div className="kyc-form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input type="checkbox" name="sameAddress" checked={form.sameAddress} onChange={handleChange} id="sameAddress" />
        <label htmlFor="sameAddress" style={{ margin: 0 }}>Same as current address (Permanent Address)</label>
      </div>
    </div>
  );

  const renderStepFour = () => (
    <div className="kyc-step">
      <h3>Step 4: Financial Profile</h3>
      <div className="kyc-form-group">
        <label>Employment Status</label>
        <select name="employmentStatus" value={form.employmentStatus} onChange={handleChange}>
          <option>Salaried</option>
          <option>Self-Employed</option>
          <option>Business</option>
          <option>Student</option>
        </select>
      </div>
      <div className="kyc-form-group">
        <label>Annual Income Range</label>
        <select name="annualIncome" value={form.annualIncome} onChange={handleChange}>
          <option>Below ₹3L</option>
          <option>₹3L-₹10L</option>
          <option>₹10L+</option>
        </select>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="kyc-card">
      <h2>Complete Your KYC</h2>
      <p className="kyc-subtitle">Please fill out all steps to unlock premium features.</p>
      
      {msg.text && <div className={`kyc-msg kyc-msg-${msg.type}`}>{msg.text}</div>}
      
      <div className="kyc-stepper">
        <div className="kyc-progress">
          Step {step} of 4
        </div>
      </div>

      <form className="kyc-form" onSubmit={handleSubmit}>
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
        {step === 4 && renderStepFour()}
        
        <div className="kyc-form-actions" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
           {step > 1 ? (
             <button type="button" className="kyc-btn btn-secondary" onClick={prevStep}>Back</button>
           ) : <div/>}

           {step < 4 ? (
             <button type="button" className="kyc-btn btn-primary" onClick={nextStep}>Next</button>
           ) : (
             <button type="submit" className="kyc-btn btn-primary" disabled={isSubmitting}>
               {isSubmitting ? 'Submitting...' : 'Submit Form'}
             </button>
           )}
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    if (status === 'LOADING') return <div className="kyc-loading"><div className="kyc-spinner"></div><p>Loading...</p></div>;
    if (status === 'APPROVED') return <div className="kyc-card kyc-approved"><h2>KYC Verified</h2><p>Your identity has been successfully verified.</p></div>;
    if (status === 'PENDING') return (
      <div className="kyc-card kyc-pending">
        <h2>Pending Review</h2>
        <p>Your documents are currently awaiting review by our administrative team.</p>
        <button 
          className="kyc-btn btn-secondary" 
          onClick={() => setStatus('NOT_SUBMITTED')} 
          style={{ marginTop: '20px', width: 'auto', padding: '10px 20px', margin: '20px auto 0 auto', display: 'block' }}
        >
          Cancel & Resubmit KYC Form
        </button>
      </div>
    );
    
    return renderForm();
  };

  return (
    <div className="kyc-page-container">
      <div className="kyc-header"><h1>KYC Verification</h1></div>
      <div className="kyc-content-wrapper">{renderContent()}</div>
    </div>
  );
}
