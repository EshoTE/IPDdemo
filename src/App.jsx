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

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:8080/api/v1/transactions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setTransactions(data))
    .catch(err => console.error(err));
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

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
            />
          </DashboardLayout>
        } />
        
        <Route path="/income" element={
          <DashboardLayout>
            <Income 
              totalIncome={totalIncome}
              transactions={transactions}
            />
          </DashboardLayout>
        } />
        
        <Route path="/expense" element={
          <DashboardLayout>
            <Expense 
              totalExpenses={totalExpenses}
              transactions={transactions}
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