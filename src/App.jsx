import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home.jsx';
import Income from './pages/Income.jsx';
import Expense from './pages/Expense.jsx';
import Login from './pages/Auth/Login.jsx';
import SignUp from './pages/Auth/SignUp.jsx';
import Navbar from './Components/Navbar.jsx';
import Sidebar from './Components/Sidebar.jsx';

function App() {
  
  const [transactions, setTransactions] = useState([
    { id: 1, name: 'Student Loan', amount: 5000, date: '1st Jan', icon: '🎓' },
    { id: 2, name: 'Part-time Job', amount: 800, date: '5th Jan', icon: '💼' },
    { id: 3, name: 'Rent', amount: -500, date: '10th Jan', icon: '🏠' },
    { id: 4, name: 'Groceries', amount: -150, date: '12th Jan', icon: '🛒' },
    { id: 5, name: 'Going Out', amount: -75, date: '15th Jan', icon: '🍕' },
  ]);

  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalBalance = totalIncome - totalExpenses;

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Route */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard Routes */}
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

// Dashboard Layout Component
function DashboardLayout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}

export default App;