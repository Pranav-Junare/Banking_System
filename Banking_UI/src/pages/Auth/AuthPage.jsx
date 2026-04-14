/* ═══════════════════════════════════════════════════════════════════════
   AuthPage Component — Login & Signup
   Displays a split-panel authentication page with a branded left side
   (gradient panel with animated card preview) and a form right side
   (login/signup with user/admin toggle). Supports both user and admin
   authentication modes with animated transitions between states.
   ═══════════════════════════════════════════════════════════════════════ */

import { useState } from 'react'; /* React useState hook for form state management */
import { useNavigate } from 'react-router-dom'; /* Hook for programmatic navigation after login */
import { motion, AnimatePresence } from 'framer-motion'; /* Animation library for smooth transitions */
import { useAuth } from '../../context/AuthContext'; /* Custom hook to access authentication functions */
import { loginUser, signupUser, loginAdmin, signupAdmin } from '../../api/api'; /* API endpoint functions */
import { Eye, EyeOff, Mail, Lock, User, Phone, Shield } from 'lucide-react'; /* Icon components */
import './Auth.css'; /* Auth page specific styles */

/* ─── AuthPage Component ─────────────────────────────────────────────
   Main exported component. Manages form state, handles login/signup
   submissions, and renders the two-panel auth layout.
   ───────────────────────────────────────────────────────────────────── */
export default function AuthPage() {
  /* Toggle between login (true) and signup (false) mode */
  const [isLogin, setIsLogin] = useState(true);

  /* Toggle between user (false) and admin (true) authentication */
  const [isAdminMode, setIsAdminMode] = useState(false);

  /* Toggle password visibility (show/hide) */
  const [showPassword, setShowPassword] = useState(false);

  /* Loading state — true while the API call is in progress */
  const [loading, setLoading] = useState(false);

  /* Error message string — displayed when login/signup fails */
  const [error, setError] = useState('');

  /* Success message string — displayed after successful signup */
  const [success, setSuccess] = useState('');

  /* Form field values — managed as a single state object */
  const [form, setForm] = useState({
    name: '',      /* User's full name (signup only) */
    email: '',     /* Email address (login & signup) */
    password: '',  /* Password (login & signup) */
    phone: '',     /* Phone number (user signup only) */
  });

  /* React Router's navigation function for redirecting after auth */
  const navigate = useNavigate();

  /* Auth context functions for setting the session state */
  const { loginAsUser, loginAsAdmin } = useAuth();

  /* ─── Form Change Handler ────────────────────────────────────────
     Updates the form state when any input field changes.
     Also clears any existing error message on input change.
     ─────────────────────────────────────────────────────────────── */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); /* Update the changed field */
    setError(''); /* Clear error when user starts typing */
  };

  /* ─── Form Submit Handler ────────────────────────────────────────
     Handles both login and signup submissions for user and admin.
     Makes the appropriate API call and handles the response.
     ─────────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault(); /* Prevent default form submission (page reload) */
    setLoading(true);   /* Show loading spinner */
    setError('');        /* Clear previous errors */
    setSuccess('');      /* Clear previous success messages */

    try {
      if (isLogin) {
        /* ── Login Mode ── */
        if (isAdminMode) {
          /* Admin login — call the admin login API */
          const res = await loginAdmin(form.email, form.password);
          loginAsAdmin({ name: res.data.adminName }); /* Set admin session */
          navigate('/admin'); /* Redirect to admin dashboard */
        } else {
          /* User login — call the user login API */
          const res = await loginUser(form.email, form.password);
          loginAsUser({ name: res.data.name }); /* Set user session */
          navigate('/dashboard'); /* Redirect to user dashboard */
        }
      } else {
        /* ── Signup Mode ── */
        if (isAdminMode) {
          /* Admin signup — register a new admin account */
          await signupAdmin({
            aName: form.name,        /* Admin name */
            aEmail: form.email,      /* Admin email */
            aPassword: form.password /* Admin password */
          });
        } else {
          /* User signup — register a new user account */
          await signupUser({
            uName: form.name,              /* User's full name */
            uEmail: form.email,            /* User's email */
            uPassword: form.password,      /* User's password */
            phoneNumber: Number(form.phone), /* Phone number as integer */
            accountBalance: 0              /* Initial balance of zero */
          });
        }
        /* Show success message and auto-switch to login after 1.5s */
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => { setIsLogin(true); setSuccess(''); }, 1500);
      }
    } catch (err) {
      /* Display the error message from the API response */
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false); /* Stop loading spinner regardless of outcome */
    }
  };

  /* ─── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="auth-page">
      {/* ── Animated Background Orbs ── */}
      {/* Three blurred circles that float around for a dynamic background effect */}
      <div className="auth-bg">
        <div className="auth-bg-orb auth-bg-orb-1" /> {/* Purple orb — top right */}
        <div className="auth-bg-orb auth-bg-orb-2" /> {/* Blue orb — bottom left */}
        <div className="auth-bg-orb auth-bg-orb-3" /> {/* Lavender orb — center */}
      </div>

      {/* ── Main Auth Container ── */}
      {/* Glass card container with two panels (brand + form) */}
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: 30 }}  /* Start hidden and shifted down */
        animate={{ opacity: 1, y: 0 }}   /* Fade in and slide up */
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }} /* Smooth easing */
      >
        {/* ── Left Panel — Branding ── */}
        {/* Gradient panel with bank logo, headline, and floating card preview */}
        <div className="auth-brand">
          <motion.div
            className="auth-brand-content"
            initial={{ opacity: 0, x: -20 }}  /* Start hidden and shifted left */
            animate={{ opacity: 1, x: 0 }}    /* Fade in and slide right */
            transition={{ delay: 0.3, duration: 0.5 }} /* Delayed entrance */
          >
            {/* Bank logo with rupee icon */}
            <div className="auth-logo">
              <div className="auth-logo-icon">₹</div>   {/* Rupee symbol icon */}
              <span>PranavBank</span>                    {/* Bank name */}
            </div>

            {/* Hero headline and description */}
            <h1>Welcome to the Future of Banking</h1>
            <p>Manage your wealth, cards, and investments — all in one premium dashboard.</p>

            {/* Floating 3D card preview with continuous animation */}
            <motion.div
              className="auth-preview-card"
              animate={{ rotateY: [0, 5, -5, 0], y: [0, -8, 0] }} /* Subtle rotation and float */
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} /* Infinite loop */
            >
              <div className="preview-card-chip" />                    {/* Gold chip graphic */}
              <div className="preview-card-number">•••• •••• •••• 4832</div> {/* Masked card number */}
              <div className="preview-card-name">PranavBank</div>      {/* Card holder name */}
              <div className="preview-card-contactless">)))</div>      {/* Contactless symbol */}
            </motion.div>
          </motion.div>
        </div>

        {/* ── Right Panel — Auth Form ── */}
        {/* Contains the user/admin toggle and the login/signup form */}
        <div className="auth-form-panel">
          {/* User/Admin mode toggle — segmented control */}
          <div className="auth-mode-toggle">
            {/* User mode button */}
            <button
              className={`mode-btn ${!isAdminMode ? 'active' : ''}`}
              onClick={() => setIsAdminMode(false)}
            >
              <User size={16} /> User
            </button>
            {/* Admin mode button — applies 'admin' class for red styling */}
            <button
              className={`mode-btn ${isAdminMode ? 'active admin' : ''}`}
              onClick={() => setIsAdminMode(true)}
            >
              <Shield size={16} /> Admin
            </button>
          </div>

          {/* Animated form area — animates when switching between login/signup/admin */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${isLogin}-${isAdminMode}`} /* Re-animate when mode changes */
              initial={{ opacity: 0, x: 20 }}    /* Start hidden and shifted right */
              animate={{ opacity: 1, x: 0 }}     /* Fade in and slide left */
              exit={{ opacity: 0, x: -20 }}      /* Exit by sliding left */
              transition={{ duration: 0.3 }}     /* Quick transition */
            >
              {/* Form heading — changes based on login/signup mode */}
              <h2>{isLogin ? 'Sign In' : 'Create Account'}</h2>
              {/* Subtitle with contextual text */}
              <p className="auth-subtitle">
                {isLogin
                  ? `Enter your ${isAdminMode ? 'admin ' : ''}credentials to continue`
                  : `Create a new ${isAdminMode ? 'admin' : 'user'} account`}
              </p>

              {/* ── Auth Form ── */}
              <form onSubmit={handleSubmit} className="auth-form">
                {/* Name field — shown only during signup */}
                {!isLogin && (
                  <div className="input-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User size={18} /> {/* User icon inside input */}
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Email field — shown for both login and signup */}
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <Mail size={18} /> {/* Mail icon inside input */}
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                {/* Password field — with show/hide toggle */}
                <div className="input-group">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <Lock size={18} /> {/* Lock icon inside input */}
                    <input
                      type={showPassword ? 'text' : 'password'} /* Toggle between text/password */
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="input-field"
                      required
                    />
                    {/* Eye icon button to toggle password visibility */}
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Phone number field — shown only for user signup (not admin signup) */}
                {!isLogin && !isAdminMode && (
                  <div className="input-group">
                    <label>Phone Number</label>
                    <div className="input-with-icon">
                      <Phone size={18} /> {/* Phone icon inside input */}
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Error message — shown when login/signup fails */}
                {error && (
                  <motion.div
                    className="auth-error"
                    initial={{ opacity: 0, y: -10 }} /* Slide in from above */
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}

                {/* Success message — shown after successful signup */}
                {success && (
                  <motion.div
                    className="auth-success"
                    initial={{ opacity: 0, y: -10 }} /* Slide in from above */
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {success}
                  </motion.div>
                )}

                {/* Submit button — shows spinner while loading */}
                <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                  {loading ? (
                    <span className="spinner" /> /* Loading spinner animation */
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account' /* Button text based on mode */
                  )}
                </button>
              </form>

              {/* Toggle link between login and signup modes */}
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
