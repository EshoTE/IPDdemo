import { useState, useEffect } from 'react';
import SummaryCards from './Components/SummaryCards';

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
    <div className="min-h-screen bg-[#0c0e18] p-8">
      <div className="fixed top-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,150,160,0.04) 0%, transparent 70%)' }} />

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-[#f0e8ea] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[rgba(240,232,234,0.3)] mt-1">Your financial overview</p>
      </div>

      
      <SummaryCards
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />

      <div className="grid grid-cols-[1.3fr_1fr] gap-6 mt-6">
        <div className="border rounded-2xl p-6"
          style={{ background: 'rgba(200,150,160,0.03)', borderColor: 'rgba(200,150,160,0.08)' }}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-[#f0e8ea]">Recent Transactions</h2>
            <span className="text-sm text-[rgba(240,232,234,0.25)] cursor-pointer hover:text-[rgba(240,232,234,0.4)] transition-colors">
              View all →
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {transactions.length === 0 && (
              <p className="text-[rgba(240,232,234,0.25)] text-sm py-8 text-center">
                No transactions yet.
              </p>
            )}
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id}
                className="flex items-center justify-between hover:bg-[rgba(200,150,160,0.05)] p-3 rounded-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{
                      background: t.type === 'INCOME' ? 'rgba(138,184,160,0.08)' : 'rgba(200,150,160,0.08)',
                      borderColor: t.type === 'INCOME' ? 'rgba(138,184,160,0.15)' : 'rgba(200,150,160,0.15)',
                    }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      {t.type === 'INCOME' ? (
                        <path d="M10 15V5M10 5L6 9M10 5L14 9" stroke="#8ab8a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M10 5V15M10 15L6 11M10 15L14 11" stroke="#d08888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#f0e8ea] text-[15px] font-medium">{t.description}</p>
                    <p className="text-[rgba(240,232,234,0.3)] text-[13px]">{t.date}</p>
                  </div>
                </div>
                <p className="text-[15px] font-semibold font-mono"
                  style={{ color: t.type === 'INCOME' ? '#8ab8a0' : '#d08888' }}>
                  {t.type === 'INCOME' ? '+' : '-'} £{Number(t.amount).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border rounded-2xl p-6"
          style={{ background: 'rgba(200,150,160,0.03)', borderColor: 'rgba(200,150,160,0.08)' }}>
          <h2 className="text-lg font-bold text-[#f0e8ea] mb-5">Financial Overview</h2>

          <div className="flex flex-col items-center mb-8">
            <p className="text-[rgba(240,232,234,0.35)] text-sm uppercase tracking-widest mb-2">Total Balance</p>
            <p className="text-[#f0e8ea] text-4xl font-bold tracking-tight">
              £{(totalBalance || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[rgba(240,232,234,0.5)] text-sm">Income</span>
                <span className="text-[#8ab8a0] text-sm font-semibold font-mono">
                  £{(totalIncome || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full" style={{ background: 'rgba(240,232,234,0.04)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: totalIncome > 0 ? '100%' : '0%',
                    background: 'linear-gradient(90deg, #8ab8a0 0%, #6a9880 100%)',
                    opacity: 0.7,
                  }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[rgba(240,232,234,0.5)] text-sm">Expenses</span>
                <span className="text-[#d08888] text-sm font-semibold font-mono">
                  £{(totalExpenses || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full" style={{ background: 'rgba(240,232,234,0.04)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: totalIncome > 0 ? `${Math.min((totalExpenses / totalIncome) * 100, 100)}%` : '0%',
                    background: 'linear-gradient(90deg, #d08888 0%, #b06868 100%)',
                    opacity: 0.7,
                  }} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#c896a0] opacity-70" />
              <span className="text-[rgba(240,232,234,0.35)] text-sm">Total Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8ab8a0] opacity-70" />
              <span className="text-[rgba(240,232,234,0.35)] text-sm">Total Income</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;