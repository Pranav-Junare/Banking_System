import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth ───
export const loginUser = (email, password) =>
  API.post('/login', { email, password });

export const signupUser = (data) =>
  API.post('/signup', data);

export const loginAdmin = (email, password) =>
  API.post('/loginAdmin', { email, password });

export const signupAdmin = (data) =>
  API.post('/signupAdmin', data);

// ─── Dashboard ───
export const getDashboard = () => API.get('/dashboard');
export const getAdminDashboard = () => API.get('/adminDashboard');

// ─── Transactions ───
export const getHistory = () => API.get('/history');
export const getAdminHistory = () => API.get('/transactionHistoryAdmin');
export const sendMoney = (uEmail, amount) =>
  API.post('/sendMoney', { uEmail, amount: String(amount) });
export const adminAddMoney = (uEmail, amount) =>
  API.post('/addMoney', { uEmail, amount: String(amount) });

// ─── Pots ───
export const getPots = () => API.get('/api/pots');
export const createPot = (potName, targetAmount) =>
  API.post('/api/pots/create', { potName, targetAmount });
export const fundPot = (potId, amount) =>
  API.post('/api/pots/fund', { potId, amount });
export const withdrawPot = (potId, amount) =>
  API.post('/api/pots/withdraw', { potId, amount });

// ─── Virtual Cards ───
export const generateCard = () => API.post('/api/cards/generate');
export const getMyCards = () => API.get('/api/cards/my-cards');
export const toggleCardFreeze = (cardId) =>
  API.post('/api/cards/toggle-freeze', { cardId });
export const setCardPin = (cardId, pin) =>
  API.post('/api/cards/set-pin', { cardId, pin });
export const setDailyLimit = (cardId, limit) =>
  API.post('/api/cards/set-daily-limit', { cardId, dailyLimit: limit });

// ─── Credit ───
export const getCreditProfile = () => API.get('/api/credit/profile');
export const checkLoanEligibility = (monthlyIncome, monthlyDebt, requestedAmount, tenureMonths) =>
  API.post('/api/credit/check-eligibility', { monthlyIncome, monthlyDebt, requestedAmount, tenureMonths });

// ─── Loans ───
export const applyLoan = (loanAmount, loanTenure) =>
  API.post('/apply-loan', { loanAmount: String(loanAmount), loanTenure: String(loanTenure) });
export const getMyLoans = () => API.get('/my-loans');

// ─── Wealth (FD & SIP) ───
export const createFD = (fdType, fdAmount, fdDuration) =>
  API.post('/create-fd', { fdType, fdAmount, fdDuration });
export const getMyFDs = () => API.get('/my-fds');
export const createSIP = (sipAmount, sipDuration, sipInterestRate) =>
  API.post('/create-sip', { sipAmount, sipDuration, sipInterestRate });
export const getMySIPs = () => API.get('/my-sips');

// ─── Utility ───
export const fetchBill = (billerName, consumerId) =>
  API.post('/api/utility/fetch-bill', { billerName, consumerId });
export const payBill = (billerName, consumerId) =>
  API.post('/api/utility/pay-bill', { billerName, consumerId });
export const mobileRecharge = (phoneNumber, amount, provider) =>
  API.post('/api/utility/recharge', { phoneNumber, amount, provider });

// ─── Core Banking ───
export const forexConvert = (amountInr, targetCurrency) =>
  API.post('/api/core/forex/convert', { amountInr, targetCurrency });
export const getForexWallet = () => API.get('/api/core/forex/wallet');
export const downloadStatement = () =>
  API.get('/api/core/statement/csv', { responseType: 'blob' });

export default API;
