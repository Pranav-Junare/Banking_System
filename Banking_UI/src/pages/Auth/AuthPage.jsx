import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { loginUser, signupUser, loginAdmin, signupAdmin } from '../../api/api';
import { Eye, EyeOff, Mail, Lock, User, Phone, Shield } from 'lucide-react';
import './Auth.css';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
  });

  const navigate = useNavigate();
  const { loginAsUser, loginAsAdmin } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        if (isAdminMode) {
          const res = await loginAdmin(form.email, form.password);
          loginAsAdmin({ name: res.data.adminName });
          navigate('/admin');
        } else {
          const res = await loginUser(form.email, form.password);
          loginAsUser({ name: res.data.name });
          navigate('/dashboard');
        }
      } else {
        if (isAdminMode) {
          await signupAdmin({
            aName: form.name, aEmail: form.email, aPassword: form.password,
          });
        } else {
          await signupUser({
            uName: form.name, uEmail: form.email, uPassword: form.password,
            phoneNumber: Number(form.phone), accountBalance: 0,
          });
        }
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => { setIsLogin(true); setSuccess(''); }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Decorative Background */}
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1" />
        <div className="auth-bg-orb auth-bg-orb-2" />
        <div className="auth-bg-orb auth-bg-orb-3" />
      </div>

      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Left Panel — Branding */}
        <div className="auth-brand">
          <motion.div
            className="auth-brand-content"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="auth-logo">
              <div className="auth-logo-icon">₹</div>
              <span>Bank</span>
            </div>
            <h1>Welcome to the Future of Banking</h1>
            <p>Manage your wealth, cards, and investments — all in one premium dashboard.</p>

            {/* Floating 3D card preview */}
            <motion.div
              className="auth-preview-card"
              animate={{ rotateY: [0, 5, -5, 0], y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="preview-card-chip" />
              <div className="preview-card-number">•••• •••• •••• 4832</div>
              <div className="preview-card-name"> Bank</div>
              <div className="preview-card-contactless">)))  </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Panel — Form */}
        <div className="auth-form-panel">
          {/* Admin Toggle */}
          <div className="auth-mode-toggle">
            <button
              className={`mode-btn ${!isAdminMode ? 'active' : ''}`}
              onClick={() => setIsAdminMode(false)}
            >
              <User size={16} /> User
            </button>
            <button
              className={`mode-btn ${isAdminMode ? 'active admin' : ''}`}
              onClick={() => setIsAdminMode(true)}
            >
              <Shield size={16} /> Admin
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${isLogin}-${isAdminMode}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
              <p className="auth-subtitle">
                {isLogin
                  ? `Enter your ${isAdminMode ? 'admin' : ''} credentials to continue`
                  : `Create a new ${isAdminMode ? 'admin' : 'user'} account`}
              </p>

              <form onSubmit={handleSubmit} className="auth-form">
                {!isLogin && (
                  <div className="input-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User size={18} />
                      <input
                        type="text" name="name" value={form.name}
                        onChange={handleChange} placeholder="Enter your name"
                        className="input-field" required
                      />
                    </div>
                  </div>
                )}

                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} />
                    <input
                      type="email" name="email" value={form.email}
                      onChange={handleChange} placeholder="you@example.com"
                      className="input-field" required
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password" value={form.password}
                      onChange={handleChange} placeholder="••••••••"
                      className="input-field" required
                    />
                    <button type="button" className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {!isLogin && !isAdminMode && (
                  <div className="input-group">
                    <label>Phone Number</label>
                    <div className="input-with-icon">
                      <Phone size={18} />
                      <input
                        type="tel" name="phone" value={form.phone}
                        onChange={handleChange} placeholder="9876543210"
                        className="input-field" required
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <motion.div className="auth-error"
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div className="auth-success"
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    {success}
                  </motion.div>
                )}

                <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                  {loading ? (
                    <span className="spinner" />
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>

              <p className="auth-switch">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
