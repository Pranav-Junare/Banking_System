import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMyKycStatus, submitKyc } from '../../api/api';
import { User, CreditCard, MapPin, Briefcase, UploadCloud, ShieldCheck, CheckCircle } from 'lucide-react';
import './UserKyc.css';

export default function UserKycPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState('LOADING');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', gender: 'Male',
    documentType: 'PAN', documentNumber: '', issueCountry: 'India',
    address: '', city: '', state: '', pinCode: '', sameAddress: false,
    employmentStatus: 'Salaried (Full-time)', annualIncome: 'Below 3L',
    sourceOfWealth: 'Salary / Wages',
    declareTnc: false, declareFatca: false
  });
  const [dragActive, setDragActive] = useState(false);
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

  const validateStep = () => {
    if (step === 1) return form.firstName && form.lastName && form.dob;
    if (step === 2) return form.documentNumber;
    if (step === 3) return form.address && form.city && form.pinCode && form.state;
    if (step === 4) return form.declareTnc && form.declareFatca;
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) {
      setMsg({ type: 'error', text: 'Please fill all required fields.' });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
      return;
    }
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) {
      setMsg({ type: 'error', text: 'Please complete all declarations.' });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        legalName: `${form.firstName} ${form.lastName}`.trim(),
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
      setMsg({ type: 'error', text: err.response?.data?.error || 'Failed to submit KYC Form.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMsg({ type: '', text: '' }), 4000);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const renderStepOne = () => (
    <div className="kyc-step-content animation-fade-in">
      <div className="kyc-section-header">
        <User className="kyc-sec-icon" strokeWidth={1.5} />
        <div>
          <h3>Basic Identity</h3>
          <p>Please enter your details exactly as they appear on your government ID.</p>
        </div>
      </div>
      <div className="kyc-form-grid">
        <div className="kyc-form-group">
          <label>First Name <span className="req">*</span></label>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" required />
        </div>
        <div className="kyc-form-group">
          <label>Last Name <span className="req">*</span></label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" required />
        </div>
        <div className="kyc-form-group">
          <label>Date of Birth <span className="req">*</span></label>
          <input type="date" name="dob" value={form.dob} onChange={handleChange} required />
        </div>
        <div className="kyc-form-group">
          <label>Gender <span className="req">*</span></label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Non-Binary</option>
            <option>Prefer not to say</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStepTwo = () => (
    <div className="kyc-step-content animation-fade-in">
      <div className="kyc-section-header">
        <CreditCard className="kyc-sec-icon" strokeWidth={1.5} />
        <div>
          <h3>Document Verification</h3>
          <p>Provide a valid government-issued document.</p>
        </div>
      </div>
      <div className="kyc-form-grid">
        <div className="kyc-form-group">
          <label>Issuing Country <span className="req">*</span></label>
          <select name="issueCountry" value={form.issueCountry} onChange={handleChange}>
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Australia</option>
            <option>Other</option>
          </select>
        </div>
        <div className="kyc-form-group">
          <label>Document Type <span className="req">*</span></label>
          <select name="documentType" value={form.documentType} onChange={handleChange}>
            <option value="PAN">PAN Card</option>
            <option value="AADHAR">Aadhaar Card</option>
            <option value="PASSPORT">Passport</option>
            <option value="VOTER_ID">Voter ID</option>
            <option value="DRIVING_LICENSE">Driving License</option>
          </select>
        </div>
        <div className="kyc-form-group span-2">
          <label>Document Number <span className="req">*</span></label>
          <input type="text" name="documentNumber" value={form.documentNumber} onChange={handleChange} placeholder="ABCDE1234F" style={{ textTransform: 'uppercase' }} required />
        </div>
      </div>
      <div className="kyc-form-group mt-lg">
        <label>Upload ID Front & Back (PDF, JPG, PNG)</label>
        <div 
          className={`kyc-drag-drop ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-icon-ring"><UploadCloud size={32} className="kyc-upload-icon" /></div>
          <h4>Drag & Drop files here</h4>
          <p>or click to browse from your device</p>
          <small>Maximum file size: 5MB</small>
        </div>
      </div>
    </div>
  );

  const renderStepThree = () => (
    <div className="kyc-step-content animation-fade-in">
      <div className="kyc-section-header">
        <MapPin className="kyc-sec-icon" strokeWidth={1.5} />
        <div>
          <h3>Address Details</h3>
          <p>Your current primary residential address.</p>
        </div>
      </div>
      <div className="kyc-form-grid">
        <div className="kyc-form-group span-2">
          <label>Street Address / Apartment <span className="req">*</span></label>
          <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="123 Financial District, Suite 5A" required />
        </div>
        <div className="kyc-form-group">
          <label>City <span className="req">*</span></label>
          <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" required />
        </div>
        <div className="kyc-form-group">
          <label>State / Province <span className="req">*</span></label>
          <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" required />
        </div>
        <div className="kyc-form-group">
          <label>Postal / ZIP Code <span className="req">*</span></label>
          <input type="text" name="pinCode" value={form.pinCode} onChange={handleChange} placeholder="400001" required />
        </div>
      </div>
      <div className="kyc-checkbox-group mt-md">
        <input type="checkbox" name="sameAddress" checked={form.sameAddress} onChange={handleChange} id="sameAddress" />
        <label htmlFor="sameAddress">My permanent address is the same as my residential address</label>
      </div>
    </div>
  );

  const renderStepFour = () => (
    <div className="kyc-step-content animation-fade-in">
      <div className="kyc-section-header">
        <Briefcase className="kyc-sec-icon" strokeWidth={1.5} />
        <div>
          <h3>Regulatory & Financial Profile</h3>
          <p>Required for anti-money laundering (AML) and compliance.</p>
        </div>
      </div>
      <div className="kyc-form-grid">
        <div className="kyc-form-group">
          <label>Employment Status <span className="req">*</span></label>
          <select name="employmentStatus" value={form.employmentStatus} onChange={handleChange}>
            <option>Salaried (Full-time)</option>
            <option>Self-Employed / Freelance</option>
            <option>Business Owner</option>
            <option>Student</option>
            <option>Retired</option>
            <option>Unemployed</option>
          </select>
        </div>
        <div className="kyc-form-group">
          <label>Source of Wealth <span className="req">*</span></label>
          <select name="sourceOfWealth" value={form.sourceOfWealth} onChange={handleChange}>
            <option>Salary / Wages</option>
            <option>Business Income</option>
            <option>Savings / Investments</option>
            <option>Inheritance</option>
          </select>
        </div>
        <div className="kyc-form-group span-2">
          <label>Annual Income Range (in INR) <span className="req">*</span></label>
          <select name="annualIncome" value={form.annualIncome} onChange={handleChange}>
            <option>Below ₹3,000,000 (3L)</option>
            <option>₹3,000,000 - ₹10,000,000 (3L-10L)</option>
            <option>₹10,000,000 - ₹50,000,000 (10L-50L)</option>
            <option>Above ₹50,000,000 (50L+)</option>
          </select>
        </div>
      </div>
      
      <div className="kyc-declarations mt-lg">
        <h4>Declarations & Consents</h4>
        <div className="kyc-checkbox-group kyc-fatca-box">
          <input type="checkbox" name="declareFatca" checked={form.declareFatca} onChange={handleChange} id="declareFatca" />
          <label htmlFor="declareFatca">I declare that I am a tax resident only in India and not of any other jurisdiction (FATCA / CRS conformity).</label>
        </div>
        <div className="kyc-checkbox-group kyc-fatca-box">
          <input type="checkbox" name="declareTnc" checked={form.declareTnc} onChange={handleChange} id="declareTnc" />
          <label htmlFor="declareTnc">I confirm that all information provided is accurate and authentic to the best of my knowledge as per Section 177 & 193 of the Indian Penal Code.</label>
        </div>
      </div>
    </div>
  );

  const stepsList = [
    { label: "Identity", icon: <User size={16} /> }, 
    { label: "Document", icon: <CreditCard size={16} /> }, 
    { label: "Address", icon: <MapPin size={16} /> }, 
    { label: "Financial", icon: <Briefcase size={16} /> }
  ];

  const renderForm = () => (
    <div className="kyc-form-container glass-card">
      <div className="kyc-stepper-header">
        {stepsList.map((st, idx) => (
          <React.Fragment key={idx}>
            <div className={`kyc-step-indicator ${step === idx + 1 ? 'active' : step > idx + 1 ? 'completed' : ''}`}>
              <div className="kyc-step-circle">
                {step > idx + 1 ? <CheckCircle size={14} /> : st.icon}
              </div>
              <span className="kyc-step-label">{st.label}</span>
            </div>
            {idx < stepsList.length - 1 && <div className={`kyc-step-line ${step > idx + 1 ? 'line-completed' : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="kyc-card-body">
        {msg.text && (
          <div className={`kyc-msg kyc-msg-${msg.type} animation-slide-down`}>
            <ShieldCheck size={18} /> {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}
          {step === 4 && renderStepFour()}

          <div className="kyc-actions-footer">
            <button 
              type="button" 
              className={`kyc-btn btn-back ${step === 1 ? 'hidden' : ''}`} 
              onClick={prevStep}
              disabled={isSubmitting}
            >
              Back
            </button>

            {step < 4 ? (
              <button type="button" className="kyc-btn btn-next" onClick={nextStep}>
                Continue
              </button>
            ) : (
              <button type="submit" className="kyc-btn btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Encrypting & Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    if (status === 'LOADING') return (
      <div className="kyc-loading glass-card">
        <div className="kyc-spinner"></div>
        <h4>Establishing secure connection...</h4>
        <p>Loading your profile.</p>
      </div>
    );
    if (status === 'APPROVED') return (
      <div className="kyc-success-banner glass-card">
        <div className="icon-pulse-wrapper"><CheckCircle size={60} className="kyc-success-icon" /></div>
        <h2>Verification Complete</h2>
        <p>Your identity has been successfully verified and securely stored. All premium limits and international transfers have been unlocked.</p>
      </div>
    );   
    if (status === 'PENDING') return (
      <div className="kyc-pending-banner glass-card">
        <div className="icon-pulse-wrapper-yellow"><ShieldCheck size={60} className="kyc-pending-icon" /></div>
        <h2>Application Under Review</h2>
        <p>Your documents are currently being processed manually by our compliance identity team. This usually takes between 1-2 hours.</p>
        <button
          className="kyc-btn btn-outline mt-lg"
          onClick={() => setStatus('NOT_SUBMITTED')}
        >
          Withdraw & Resubmit Application
        </button>
      </div>
    );

    return renderForm();
  };

  return (
    <div className="kyc-layout-root">
      <div className="kyc-header-top">
        <h1>Customer Due Diligence</h1>
        <p className="kyc-header-sub">Complete this one-time 2-minute e-KYC securely to unlock global transfers, card limits, and premium features.</p>
      </div>
      <div className="kyc-main-wrapper">{renderContent()}</div>
    </div>
  );
}