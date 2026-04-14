/* ═══════════════════════════════════════════════════════════════════════
   API Service Layer
   Centralizes all HTTP API calls using Axios. Each function corresponds
   to a backend endpoint and returns a Promise with the response data.
   Uses session-based authentication via HTTP-only cookies.
   ═══════════════════════════════════════════════════════════════════════ */

import axios from 'axios'; /* Axios HTTP client library */

/* ─── Axios Instance Configuration ───────────────────────────────────
   Create a pre-configured Axios instance with the backend base URL,
   credentials (cookies), and default headers. All API functions use
   this instance to automatically include these settings.
   ───────────────────────────────────────────────────────────────────── */
const API = axios.create({
  baseURL: 'http://localhost:8080', /* Spring Boot backend server URL */
  withCredentials: true,            /* Send cookies with every request (session auth) */
  headers: { 'Content-Type': 'application/json' }, /* JSON request bodies */
});

/* ═══════════════════════════════════════════════════════════════════════
   Authentication APIs
   Login and signup endpoints for both regular users and admins.
   ═══════════════════════════════════════════════════════════════════════ */

/* Log in a regular user with email and password */
export const loginUser = (email, password) =>
  API.post('/login', { email, password });

/* Register a new regular user account */
export const signupUser = (data) =>
  API.post('/signup', data);

/* Log in an admin user with email and password */
export const loginAdmin = (email, password) =>
  API.post('/loginAdmin', { email, password });

/* Register a new admin user account */
export const signupAdmin = (data) =>
  API.post('/signupAdmin', data);

/* ═══════════════════════════════════════════════════════════════════════
   Dashboard APIs
   Fetch dashboard data for user and admin views.
   Also used by AuthContext to check if a session is still valid.
   ═══════════════════════════════════════════════════════════════════════ */

/* Get the user dashboard data (name, balance, account info) */
export const getDashboard = () => API.get('/dashboard');

/* Get the admin dashboard data (admin name, system stats) */
export const getAdminDashboard = () => API.get('/adminDashboard');

/* ═══════════════════════════════════════════════════════════════════════
   Transaction APIs
   Endpoints for viewing transaction history and sending money.
   ═══════════════════════════════════════════════════════════════════════ */

/* Get the current user's transaction history */
export const getHistory = () => API.get('/history');

/* Get all transactions (admin view — global ledger) */
export const getAdminHistory = () => API.get('/transactionHistoryAdmin');

/* Send money to another user by their email address */
export const sendMoney = (uEmail, amount) =>
  API.post('/sendMoney', { uEmail, amount: String(amount) });

/* Admin: Add money to a user's account (credit operation) */
export const adminAddMoney = (uEmail, amount) =>
  API.post('/addMoney', { uEmail, amount: String(amount) });

/* ═══════════════════════════════════════════════════════════════════════
   Savings Pots APIs
   Endpoints for creating and managing goal-based savings pots.
   ═══════════════════════════════════════════════════════════════════════ */

/* Get all savings pots for the current user */
export const getPots = () => API.get('/api/pots/my-pots');

/* Create a new savings pot with a name and target amount */
export const createPot = (potName, targetAmount) =>
  API.post('/api/pots/create', { potName, targetAmount });

/* Add funds to an existing savings pot */
export const fundPot = (potId, amount) =>
  API.post('/api/pots/fund', { potId, amount });

/* Withdraw funds from an existing savings pot */
export const withdrawPot = (potId, amount) =>
  API.post('/api/pots/withdraw', { potId, amount });

/* ═══════════════════════════════════════════════════════════════════════
   Virtual Cards APIs
   Endpoints for managing virtual debit cards (generate, freeze, PIN).
   ═══════════════════════════════════════════════════════════════════════ */

/* Generate a new virtual debit card */
export const generateCard = () => API.post('/api/cards/generate');

/* Get all virtual cards for the current user */
export const getMyCards = () => API.get('/api/cards/my-cards');

/* Toggle the freeze/active state of a card */
export const toggleCardFreeze = async (cardId, isCurrentlyActive) => {
  const url = isCurrentlyActive ? '/api/cards/freeze' : '/api/cards/activate';
  return API.post(url, { cardId });
};

/* Set or update the PIN for a card — uses request/confirm flow mock */
export const setCardPin = async (cardId, newPin) => {
  const reqRes = await API.post('/api/cards/reset-pin/request', { cardId });
  const otp = reqRes.data.otp_for_testing || "123456"; 
  return API.post('/api/cards/reset-pin/confirm', { cardId, otp, newPin: String(newPin) });
};

/* Set or update the daily spending limit for a card */
export const setDailyLimit = (cardId, limit) =>
  API.post('/api/cards/set-daily-limit', { cardId, dailyLimit: Number(limit) });

/* ═══════════════════════════════════════════════════════════════════════
   Credit & Loan APIs
   Endpoints for credit profiles, loan eligibility, and loan applications.
   ═══════════════════════════════════════════════════════════════════════ */

/* Get the current user's credit profile (limits, scores, etc.) */
export const getCreditProfile = () => API.get('/api/credit/profile');

/* Check loan eligibility based on financial parameters */
export const checkLoanEligibility = (monthlyIncome, monthlyDebt, requestedAmount, tenureMonths) =>
  API.post('/api/credit/check-eligibility', { monthlyIncome, monthlyDebt, requestedAmount, tenureMonths });

/* Apply for a new loan with specified amount and tenure */
export const applyLoan = (loanAmount, loanTenure) =>
  API.post('/apply-loan', { loanType: "Personal", amount: Number(loanAmount), tenure: Number(loanTenure) });

/* Get all active loans for the current user */
export const getMyLoans = () => API.get('/my-loans');

/* ═══════════════════════════════════════════════════════════════════════
   Wealth Management APIs (Fixed Deposits & SIPs)
   Endpoints for creating and viewing FDs and SIPs.
   ═══════════════════════════════════════════════════════════════════════ */

/* Create a new Fixed Deposit with type, amount, and duration */
export const createFD = (fdType, fdAmount, fdDuration) =>
  API.post('/create-fd', { fdType, fdAmount, fdDuration });

/* Get all Fixed Deposits for the current user */
export const getMyFDs = () => API.get('/my-fds');

/* Create a new SIP with monthly amount, duration, and interest rate */
export const createSIP = (sipType, sipAmount, sipDuration) =>
  API.post('/create-sip', { sipType, sipAmount, sipDuration });

/* Get all SIPs for the current user */
export const getMySIPs = () => API.get('/my-sips');

/* ═══════════════════════════════════════════════════════════════════════
   Utility Payment APIs
   Endpoints for bill payments and mobile recharges.
   ═══════════════════════════════════════════════════════════════════════ */

/* Fetch a pending bill for a given biller and consumer ID */
export const fetchBill = (billerName, consumerId) =>
  API.post('/api/utility/fetch-bill', { billerName, consumerId });

/* Pay a fetched bill for a given biller and consumer ID */
export const payBill = (billerName, consumerId, amount) =>
  API.post('/api/utility/pay-bill', { billerName, consumerId, amount });

/* Perform a mobile recharge with phone number, amount, and provider */
export const mobileRecharge = (mobileNumber, amount, providerName) =>
  API.post('/api/utility/recharge-mobile', { mobileNumber, amount, providerName });

/* ═══════════════════════════════════════════════════════════════════════
   Core Banking APIs (Forex & Statements)
   Endpoints for foreign exchange conversion and account statements.
   ═══════════════════════════════════════════════════════════════════════ */

/* Convert INR to a foreign currency (USD, EUR, GBP) */
export const forexConvert = (amountInr, targetCurrency) =>
  API.post('/api/core/forex/convert', { amountInr, targetCurrency });

/* Get the user's forex wallet balances (USD, EUR, GBP holdings) */
export const getForexWallet = () => API.get('/api/core/forex/my-wallet');

/* Download the user's account statement as a text file */
export const downloadStatement = () =>
  API.get('/api/core/statement');

/* ═══════════════════════════════════════════════════════════════════════
   KYC APIs
   Endpoints for User KYC submissions and Admin KYC approvals.
   ═══════════════════════════════════════════════════════════════════════ */

/* User submits their KYC details */
export const submitKyc = (formData) =>
  API.post('/api/kyc/submit', formData);

/* User checks their current KYC status */
export const getMyKycStatus = () => API.get('/api/kyc/status');

/* Admin fetches all pending KYC requests */
export const getKycQueue = () => API.get('/api/kyc/queue');

/* Admin approves or rejects a KYC request */
export const reviewKyc = (requestId, status) =>
  API.post('/api/kyc/review', { requestId, status });

// ─── ADMIN PORTFOLIO & TICKETS ────────────────────────────────────
export const getUserPortfolio = (email) => {
  return API.get(`/api/admin/user/${email}/portfolio`);
};

export const getOpenTickets = () => {
  return API.get('/api/admin/tickets');
};

export const resolveTicket = (id, status) => {
  return API.post(`/api/admin/tickets/${id}/resolve`, { status });
};

export const createSupportTicket = (ticketType, targetId, description) => {
  return API.post('/api/support/ticket', { ticketType, targetId, description });
};

export const getMyTickets = () => {
  return API.get('/api/support/my-tickets');
};

// ─── LOAN UNDERWRITING (ADMIN) ────────────────────────────────────
export const getPendingLoans = () => API.get('/api/admin/loans/pending');
export const approveLoan = (loanId) => API.post(`/api/admin/loans/${loanId}/approve`);
export const rejectLoan = (loanId) => API.post(`/api/admin/loans/${loanId}/reject`);

// ─── ADMIN USER MANAGEMENT ────────────────────────────────────────
export const getAllUsers = () => API.get('/api/admin/users');
export const suspendUser = (email) => API.post(`/api/admin/user/${email}/suspend`);
export const unsuspendUser = (email) => API.post(`/api/admin/user/${email}/unsuspend`);


/* Export the Axios instance for direct use if needed */
export default API;
