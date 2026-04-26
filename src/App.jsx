import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home.jsx';
import Income from './pages/Income.jsx';
import Expense from './pages/Expense.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Auth/Login.jsx';
import SignUp from './pages/Auth/SignUp.jsx';
import Navbar from './Components/Navbar.jsx';
import Sidebar from './Components/Sidebar.jsx';
import API_URL from './config';
import Admin from './pages/Admin.jsx';

// Top-level component - holds the financial data and routes
function App() {
  const [transactions, setTransactions] = useState([]);
  const [installments, setInstallments] = useState([]);

  // refreshKey is bumped after any create/edit/delete to trigger a re-fetch
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshData = () => setRefreshKey(prev => prev + 1);

  // Fetch transactions and instalments whenever refreshKey changes
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) return;

  // Shared 401 handler - clears the session and sends the user back to login
  const handleAuthError = (res) => {
    if (res.status === 401) {
      localStorage.clear();
      window.location.href = '/IPDdemo/login';
      return null;
    }
    return res.ok ? res.json() : [];
  };

  fetch(`${API_URL}/api/v1/transactions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(handleAuthError)
    .then(data => { if (Array.isArray(data)) setTransactions(data); })
    .catch(err => console.error(err));

  fetch(`${API_URL}/api/v1/installments`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(handleAuthError)
    .then(data => { if (Array.isArray(data)) setInstallments(data); })
    .catch(err => console.error(err));
  }, [refreshKey]);

  const today = new Date();

  // Manual income transactions (Part-time Job, gifts, etc.)
  const transactionIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  // Auto-include instalments whose scheduled date has passed
  // (avoids the user having to manually enter SFE payments as income)
  const instalmentIncome = installments
    .filter(i => new Date(i.date) <= today)
    .reduce((sum, i) => sum + i.amount, 0);

  const totalIncome = transactionIncome + instalmentIncome;

  const totalExpenses = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = totalIncome - totalExpenses;

  return (
    <BrowserRouter basename="/IPDdemo">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes - all wrapped in ProtectedRoute + DashboardLayout */}
        <Route path="/dashboard" element={
         <ProtectedRoute>
          <DashboardLayout>
            <Home
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              transactions={transactions}
              refreshData={refreshData}
            />
          </DashboardLayout>
         </ProtectedRoute>
        } />
        
        <Route path="/income" element={
          <ProtectedRoute>
           <DashboardLayout>
            <Income 
              totalIncome={totalIncome}
              transactions={transactions}
              refreshData={refreshData}
            />
           </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/expense" element={
          <ProtectedRoute>
           <DashboardLayout>
            <Expense 
              totalExpenses={totalExpenses}
              transactions={transactions}
              refreshData={refreshData}
            />
           </DashboardLayout>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
         <ProtectedRoute>
          <DashboardLayout>
            <Admin />
           </DashboardLayout>
         </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

// Standard layout wrapper for authenticated pages: navbar + sidebar + content
function DashboardLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-[#0c0e18] min-h-screen">
          {children}
        </div>
      </div>
    </div>

  );
}

// Route guard: redirects to login if no token is found in localStorage
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default App;