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

function App() {
  const [transactions, setTransactions] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshData = () => setRefreshKey(prev => prev + 1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_URL}/api/v1/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setTransactions(data))
    .catch(err => console.error(err));

    fetch(`${API_URL}/api/v1/installments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setInstallments(data))
    .catch(err => console.error(err));
  }, [refreshKey]);

  const today = new Date();

  const transactionIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

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
        <Route path="/" element={<Landing />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/dashboard" element={
          <DashboardLayout>
            <Home
              totalBalance={totalBalance}
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              transactions={transactions}
              refreshData={refreshData}
            />
          </DashboardLayout>
        } />
        
        <Route path="/income" element={
          <DashboardLayout>
            <Income 
              totalIncome={totalIncome}
              transactions={transactions}
              refreshData={refreshData}
            />
          </DashboardLayout>
        } />
        
        <Route path="/expense" element={
          <DashboardLayout>
            <Expense 
              totalExpenses={totalExpenses}
              transactions={transactions}
              refreshData={refreshData}
            />
          </DashboardLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

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

export default App;