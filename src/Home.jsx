import { useState, useEffect } from 'react';
import SummaryCards from './Components/SummaryCards';
import FinancialOverview from './Components/FinancialOverview';

function Home({ totalBalance, totalIncome, totalExpenses }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/v1/transactions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setTransactions(data))
    .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <SummaryCards
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />

      <div className="grid grid-cols-2 gap-6 mt-6">

        <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>

          <div className="flex flex-col gap-4">
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between hover:bg-white/5 p-2 rounded-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-900/30 border border-purple-900/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{t.type === 'INCOME' ? '📈' : '📉'}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{t.description}</p>
                    <p className="text-sm text-gray-500">{t.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className={t.type === 'INCOME' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                    {t.type === 'INCOME' ? '+' : '-'} £{t.amount}
                  </p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-gray-500 text-sm">No transactions yet.</p>
            )}
          </div>
        </div>

        <FinancialOverview
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />

      </div>
    </div>
  );
}

export default Home;