import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryCards from './Components/SummaryCards';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function Home({ totalBalance, totalIncome, totalExpenses, refreshData }) {
  const [transactions, setTransactions] = useState([]);
  const [termPlan, setTermPlan] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [breakdownTab, setBreakdownTab] = useState('expenses');
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
        const activeId = parseInt(localStorage.getItem('activeTermPlanId'));
        const userPlan = activeId ? data.find(p => p.id === activeId) : data[data.length - 1];
        setTermPlan(userPlan || data[data.length - 1] || null);
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

  const pastInstallments = installments
    .filter(i => new Date(i.date) <= today)
    .map(i => ({
      id: `inst-${i.id}`,
      description: i.label || 'Student Finance',
      amount: i.amount,
      date: i.date,
      type: 'INSTALMENT'
    }));

  const allTransactionsUnsorted = [...transactions, ...pastInstallments];

  const sortTransactions = (list) => {
    switch (sortBy) {
      case 'newest':
        return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'oldest':
        return [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'highest':
        return [...list].sort((a, b) => b.amount - a.amount);
      case 'lowest':
        return [...list].sort((a, b) => a.amount - b.amount);
      default:
        return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  };

  const allTransactions = sortTransactions(allTransactionsUnsorted);

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

  const categoryData = (() => {
    const categories = {};
    transactions.filter(t => t.type === 'EXPENSE').forEach(t => {
      const cat = t.category || 'Other';
      categories[cat] = (categories[cat] || 0) + t.amount;
    });
    return Object.entries(categories)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  })();

  const weeklyData = (() => {
    const weeks = {};
    const allTx = [...transactions];
    allTx.forEach(t => {
      const d = new Date(t.date);
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1);
      const key = weekStart.toISOString().split('T')[0];
      if (!weeks[key]) weeks[key] = { week: key, income: 0, expenses: 0 };
      if (t.type === 'INCOME') weeks[key].income += t.amount;
      if (t.type === 'EXPENSE') weeks[key].expenses += t.amount;
    });
    return Object.values(weeks)
      .sort((a, b) => new Date(a.week) - new Date(b.week))
      .slice(-8)
      .map(w => ({
        ...w,
        week: new Date(w.week).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
        income: Math.round(w.income * 100) / 100,
        expenses: Math.round(w.expenses * 100) / 100
      }));
  })();

  const COLORS = ['#c896a0', '#8ab8a0', '#96aac8', '#dcb464', '#d08888', '#a088c8', '#88b8d0', '#c8a088'];

  const handleExportCSV = () => {
    const userName = localStorage.getItem('name') || 'User';
    const headers = ['Date', 'Type', 'Description', 'Category', 'Amount (£)'];
    const rows = allTransactionsUnsorted
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(t => [
        new Date(t.date).toLocaleDateString('en-GB'),
        t.type === 'INSTALMENT' ? 'INSTALMENT' : t.type,
        `"${t.description || t.category || ''}"`,
        `"${t.category || ''}"`,
        t.type === 'EXPENSE' ? `-${t.amount.toFixed(2)}` : t.amount.toFixed(2)
      ]);

    const summaryRows = [
      [],
      ['SUMMARY'],
      ['Total Income', '', '', '', totalIncome.toFixed(2)],
      ['Total Expenses', '', '', '', totalExpenses.toFixed(2)],
      ['Total Balance', '', '', '', totalBalance.toFixed(2)],
    ];

    if (termPlan) {
      summaryRows.push(
        [],
        ['TERM PLAN'],
        ['Academic Year', termPlan.academicYear || ''],
        ['Year of Study', termPlan.yearOfStudy || ''],
        ['Weekly Budget', '', '', '', (termPlan.weeklyBudget || 0).toFixed(2)],
      );
    }

    if (categoryData.length > 0) {
      summaryRows.push(
        [],
        ['SPENDING BY CATEGORY'],
        ['Category', '', '', '', 'Amount (£)'],
        ...categoryData.map(c => [c.name, '', '', '', c.value.toFixed(2)])
      );
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(',')),
      ...summaryRows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${userName} - TermTrack Report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderTransaction = (t) => (
    <div key={t.id}
      className="flex items-center justify-between hover:bg-[rgba(255,255,255,0.03)] p-3 rounded-xl transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.02)' }}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
          style={{
            background: t.type === 'EXPENSE' ? 'rgba(200,150,160,0.1)' : 'rgba(138,184,160,0.1)',
            borderColor: t.type === 'EXPENSE' ? 'rgba(200,150,160,0.2)' : 'rgba(138,184,160,0.2)',
          }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {t.type === 'EXPENSE' ? (
              <path d="M10 5V15M10 15L6 11M10 15L14 11" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              <path d="M10 15V5M10 5L6 9M10 5L14 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-white text-[15px] font-medium">{t.description}</p>
            {t.type === 'INSTALMENT' && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(138,184,160,0.1)] border border-[rgba(138,184,160,0.2)] text-[#8ab8a0]">
                Instalment
              </span>
            )}
          </div>
          <p className="text-[rgba(255,255,255,0.35)] text-[13px]">{t.date}</p>
        </div>
      </div>
      <p className="text-[15px] font-semibold font-mono"
        style={{ color: t.type === 'EXPENSE' ? '#d08888' : '#8ab8a0' }}>
        {t.type === 'EXPENSE' ? '-' : '+'} £{Number(t.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );

  const filterBtnClass = (value) =>
    `px-3 py-1.5 text-xs rounded-lg transition-all duration-200 ${
      sortBy === value
        ? 'bg-[#c896a0] text-[#0c0e18] font-semibold'
        : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)] hover:text-white hover:border-[rgba(255,255,255,0.2)]'
    }`;

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
            <button
              onClick={() => setShowAllTransactions(true)}
              className="text-sm text-[#c896a0] cursor-pointer hover:text-white transition-colors">
              View all →
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {allTransactions.length === 0 && (
              <p className="text-[rgba(255,255,255,0.3)] text-sm py-8 text-center">
                No transactions yet.
              </p>
            )}
            {allTransactions.slice(0, 5).map(renderTransaction)}
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

          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#c896a0]" />
              <span className="text-[rgba(255,255,255,0.4)] text-sm">Total Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#8ab8a0]" />
              <span className="text-[rgba(255,255,255,0.4)] text-sm">Total Income</span>
            </div>
          </div>

          <button
            onClick={() => setShowBreakdown(true)}
            className="w-full mt-5 py-2.5 bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.18)] text-[#f0e8ea] rounded-lg hover:bg-[rgba(200,150,160,0.18)] transition-colors text-sm font-medium">
            View Breakdown →
          </button>
        </div>
      </div>

      {showAllTransactions && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c0e18] border border-[rgba(200,150,160,0.15)] rounded-2xl p-8 w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">All Transactions</h2>
              <button
                onClick={() => setShowAllTransactions(false)}
                className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors text-lg">
                ✕
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <button onClick={() => setSortBy('newest')} className={filterBtnClass('newest')}>Newest first</button>
              <button onClick={() => setSortBy('oldest')} className={filterBtnClass('oldest')}>Oldest first</button>
              <button onClick={() => setSortBy('highest')} className={filterBtnClass('highest')}>Highest amount</button>
              <button onClick={() => setSortBy('lowest')} className={filterBtnClass('lowest')}>Lowest amount</button>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-2"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(200,150,160,0.2) transparent' }}>
              {allTransactions.length === 0 && (
                <p className="text-[rgba(255,255,255,0.3)] text-sm py-8 text-center">No transactions yet.</p>
              )}
              {allTransactions.map(renderTransaction)}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)]">
              <p className="text-[rgba(255,255,255,0.4)] text-sm">{allTransactions.length} transactions</p>
              <p className="text-white font-semibold font-mono">
                Balance: £{(totalBalance || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      )}

      {showBreakdown && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c0e18] border border-[rgba(200,150,160,0.15)] rounded-2xl p-8 w-full max-w-3xl max-h-[85vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Financial Breakdown</h2>
              <div className="flex items-center gap-3">
                <button onClick={handleExportCSV}
                  className="px-4 py-2 bg-[#8ab8a0] text-[#0c0e18] text-sm rounded-lg hover:opacity-90 transition-colors font-semibold">
                  Export to CSV
                </button>
                <button
                  onClick={() => setShowBreakdown(false)}
                  className="text-[rgba(255,255,255,0.4)] hover:text-white transition-colors text-lg">
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(200,150,160,0.2) transparent' }}>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
                  <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-widest mb-1">Total Income</p>
                  <p className="text-[#8ab8a0] text-xl font-bold font-mono">
                    £{(totalIncome || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
                  <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-widest mb-1">Total Expenses</p>
                  <p className="text-[#d08888] text-xl font-bold font-mono">
                    £{(totalExpenses || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4">
                  <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-widest mb-1">Net Balance</p>
                  <p className="text-white text-xl font-bold font-mono">
                    £{(totalBalance || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Spending by Category</h3>
                  {categoryData.length > 0 ? (
                    <>
                      <div className="flex justify-center mb-4">
                        <ResponsiveContainer width={180} height={180}>
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              dataKey="value"
                              stroke="none"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ background: '#1a1c2e', border: '1px solid rgba(200,150,160,0.15)', borderRadius: '8px', color: '#f0e8ea', fontSize: '12px' }}
                              formatter={(value) => [`£${value.toFixed(2)}`, '']}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-col gap-2">
                        {categoryData.map((cat, i) => (
                          <div key={cat.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                              <span className="text-xs text-[rgba(255,255,255,0.6)]">{cat.name}</span>
                            </div>
                            <span className="text-xs font-mono text-[rgba(255,255,255,0.5)]">£{cat.value.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-[rgba(255,255,255,0.3)] text-sm text-center py-8">No expenses to show</p>
                  )}
                </div>

                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Weekly Overview</h3>
                  {weeklyData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={weeklyData}>
                          <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            contentStyle={{ background: '#1a1c2e', border: '1px solid rgba(200,150,160,0.15)', borderRadius: '8px', color: '#f0e8ea', fontSize: '12px' }}
                            formatter={(value) => [`£${value.toFixed(2)}`, '']}
                          />
                          <Bar dataKey="income" fill="#8ab8a0" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="expenses" fill="#c896a0" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="flex justify-center gap-6 mt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#8ab8a0]" />
                          <span className="text-xs text-[rgba(255,255,255,0.4)]">Income</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#c896a0]" />
                          <span className="text-xs text-[rgba(255,255,255,0.4)]">Expenses</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-[rgba(255,255,255,0.3)] text-sm text-center py-8">No data to show</p>
                  )}
                </div>
              </div>

              <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setBreakdownTab('expenses')}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                      breakdownTab === 'expenses'
                        ? 'bg-[#c896a0] text-[#0c0e18]'
                        : 'text-[rgba(255,255,255,0.5)] hover:text-white'
                    }`}>
                    Largest Expenses
                  </button>
                  <button
                    onClick={() => setBreakdownTab('income')}
                    className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                      breakdownTab === 'income'
                        ? 'bg-[#8ab8a0] text-[#0c0e18]'
                        : 'text-[rgba(255,255,255,0.5)] hover:text-white'
                    }`}>
                    Largest Income
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {breakdownTab === 'expenses' ? (
                    <>
                      {transactions
                        .filter(t => t.type === 'EXPENSE')
                        .sort((a, b) => b.amount - a.amount)
                        .slice(0, 5)
                        .map(t => (
                          <div key={t.id} className="flex items-center justify-between py-2">
                            <div>
                              <p className="text-sm text-white">{t.description || t.category || 'Expense'}</p>
                              <p className="text-xs text-[rgba(255,255,255,0.35)]">{t.date}</p>
                            </div>
                            <p className="text-sm font-mono font-semibold text-[#d08888]">
                              -£{t.amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        ))
                      }
                      {transactions.filter(t => t.type === 'EXPENSE').length === 0 && (
                        <p className="text-[rgba(255,255,255,0.3)] text-sm text-center py-4">No expenses yet</p>
                      )}
                    </>
                  ) : (
                    <>
                      {[...transactions.filter(t => t.type === 'INCOME'), ...pastInstallments]
                        .sort((a, b) => b.amount - a.amount)
                        .slice(0, 5)
                        .map(t => (
                          <div key={t.id} className="flex items-center justify-between py-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-white">{t.description || 'Income'}</p>
                                {t.type === 'INSTALMENT' && (
                                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-[rgba(138,184,160,0.1)] border border-[rgba(138,184,160,0.2)] text-[#8ab8a0]">
                                    Instalment
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[rgba(255,255,255,0.35)]">{t.date}</p>
                            </div>
                            <p className="text-sm font-mono font-semibold text-[#8ab8a0]">
                              +£{Number(t.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        ))
                      }
                      {transactions.filter(t => t.type === 'INCOME').length === 0 && pastInstallments.length === 0 && (
                        <p className="text-[rgba(255,255,255,0.3)] text-sm text-center py-4">No income yet</p>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;