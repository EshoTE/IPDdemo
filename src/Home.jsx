import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCards from './Components/SummaryCards';

function Home({ totalBalance, totalIncome, totalExpenses }) {
  const [transactions, setTransactions] = useState([]);
  const [termPlan, setTermPlan] = useState(null);
  const [installments, setInstallments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId'));

    fetch('http://localhost:8080/api/v1/transactions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error(err));

    fetch('http://localhost:8080/api/v1/termPlans', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const userPlan = data.find(p => p.user?.id === userId) || data[data.length - 1];
        setTermPlan(userPlan);
      })
      .catch(err => console.error(err));

    fetch('http://localhost:8080/api/v1/installments', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setInstallments(data))
      .catch(err => console.error(err));
  }, []);

  const today = new Date();
  const upcomingInstallments = installments
    .filter(i => new Date(i.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextInstallment = upcomingInstallments[0];

  const daysUntilNext = nextInstallment
    ? Math.ceil((new Date(nextInstallment.date) - today) / (1000 * 60 * 60 * 24))
    : null;

  const weeklyExpenses = transactions
    .filter(t => {
      if (t.type !== 'EXPENSE') return false;
      const txDate = new Date(t.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return txDate >= weekAgo;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const weeklyRemaining = termPlan?.weeklyBudget
    ? termPlan.weeklyBudget - weeklyExpenses
    : 0;

  return (
    <div className="min-h-screen bg-[#0c0e18] p-8">
      <div className="fixed top-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(200,150,160,0.04) 0%, transparent 70%)' }} />

      <div className="mb-8">
        <h1 className="text-[28px] font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-[rgba(240,232,234,0.35)] mt-1">Your financial overview</p>
      </div>

      {termPlan && (
        <div className="border rounded-2xl p-6 mb-6"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <p className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest mb-1">Year of Study</p>
              <p className="text-white text-lg font-semibold">{termPlan.yearOfStudy || 'Not set'}</p>
              <p className="text-[rgba(255,255,255,0.35)] text-xs mt-1">{termPlan.academicYear}</p>
            </div>
            <div>
              <p className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest mb-1">Weekly Budget</p>
              <p className="text-white text-lg font-semibold font-mono">
                £{(termPlan.weeklyBudget || 0).toFixed(2)}
              </p>
              <p className="text-xs mt-1"
                style={{ color: weeklyRemaining >= 0 ? '#8ab8a0' : '#d08888' }}>
                £{weeklyRemaining.toFixed(2)} remaining
              </p>
            </div>
            <div>
              <p className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest mb-1">Next Instalment</p>
              {nextInstallment ? (
                <>
                  <p className="text-white text-lg font-semibold font-mono">
                    £{Number(nextInstallment.amount).toFixed(2)}
                  </p>
                  <p className="text-[rgba(255,255,255,0.35)] text-xs mt-1">
                    in {daysUntilNext} {daysUntilNext === 1 ? 'day' : 'days'}
                  </p>
                </>
              ) : (
                <p className="text-[rgba(255,255,255,0.35)] text-sm">None scheduled</p>
              )}
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-[rgba(255,255,255,0.4)] text-xs uppercase tracking-widest mb-1">Term Dates</p>
                <p className="text-white text-sm font-semibold">
                  {termPlan.startDate ? new Date(termPlan.startDate).toLocaleDateString('en-GB') : '-'}
                </p>
                <p className="text-[rgba(255,255,255,0.35)] text-xs mt-1">
                  to {termPlan.endDate ? new Date(termPlan.endDate).toLocaleDateString('en-GB') : '-'}
                </p>
              </div>
              <button
                onClick={() => navigate('/income')}
                className="self-start text-[#c896a0] text-xs hover:text-white transition-colors mt-1"
              >
                Edit term plan →
              </button>
            </div>
          </div>
        </div>
      )}

      <SummaryCards
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />

      <div className="grid grid-cols-[1.3fr_1fr] gap-6 mt-6">
        <div className="border rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
            <span className="text-sm text-[rgba(255,255,255,0.3)] cursor-pointer hover:text-[rgba(255,255,255,0.5)] transition-colors">
              View all →
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {transactions.length === 0 && (
              <p className="text-[rgba(255,255,255,0.3)] text-sm py-8 text-center">
                No transactions yet.
              </p>
            )}
            {transactions.slice(0, 5).map((t) => (
              <div key={t.id}
                className="flex items-center justify-between hover:bg-[rgba(255,255,255,0.03)] p-3 rounded-xl transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
                    style={{
                      background: t.type === 'INCOME' ? 'rgba(138,184,160,0.1)' : 'rgba(200,150,160,0.1)',
                      borderColor: t.type === 'INCOME' ? 'rgba(138,184,160,0.2)' : 'rgba(200,150,160,0.2)',
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
                    <p className="text-white text-[15px] font-medium">{t.description}</p>
                    <p className="text-[rgba(255,255,255,0.35)] text-[13px]">{t.date}</p>
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
          style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}>
          <h2 className="text-lg font-bold text-white mb-5">Financial Overview</h2>

          <div className="flex flex-col items-center mb-8">
            <p className="text-[rgba(255,255,255,0.4)] text-sm uppercase tracking-widest mb-2">Total Balance</p>
            <p className="text-white text-4xl font-bold font-mono tracking-tight">
              £{(totalBalance || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[rgba(255,255,255,0.5)] text-sm">Income</span>
                <span className="text-[#8ab8a0] text-sm font-semibold font-mono">
                  £{(totalIncome || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: totalIncome > 0 ? '100%' : '0%',
                    background: '#8ab8a0',
                  }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[rgba(255,255,255,0.5)] text-sm">Expenses</span>
                <span className="text-[#d08888] text-sm font-semibold font-mono">
                  £{(totalExpenses || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: totalIncome > 0 ? `${Math.min((totalExpenses / totalIncome) * 100, 100)}%` : '0%',
                    background: '#d08888',
                  }} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#c896a0]" />
              <span className="text-[rgba(255,255,255,0.4)] text-sm">Total Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8ab8a0]" />
              <span className="text-[rgba(255,255,255,0.4)] text-sm">Total Income</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;