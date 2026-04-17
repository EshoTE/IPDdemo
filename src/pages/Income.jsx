import { useState, useEffect } from 'react';
import { FaDeleteLeft } from "react-icons/fa6";
import API_URL from '../config';

function Income({ totalIncome, transactions: transactionsProp, refreshData }) {
  const [transactions, setTransactions] = useState([]);
  const [pastInstallments, setPastInstallments] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [termError, setTermError] = useState('');
  const [showTermPlanModal, setShowTermPlanModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [weeklyBudget, setWeeklyBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [installments, setInstallments] = useState([{ label: '', amount: '', date: '' }]);
  const [termPlans, setTermPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [activePlanInstallments, setActivePlanInstallments] = useState([]);

  const fetchTermPlans = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/v1/termPlans`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setTermPlans(data);
      if (data.length > 0) {
        const stored = localStorage.getItem('activeTermPlanId');
        const active = stored ? data.find(p => p.id === parseInt(stored)) || data[data.length - 1] : data[data.length - 1];
        setActivePlan(active);
        localStorage.setItem('activeTermPlanId', active.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInstallments = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/v1/installments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      const today = new Date();
      const past = data
        .filter(i => new Date(i.date) <= today)
        .map(i => ({
          id: `inst-${i.id}`,
          description: i.label || 'Student Finance',
          amount: i.amount,
          date: i.date,
          type: 'INSTALMENT',
          termPlanId: i.termPlanId
        }));
      setPastInstallments(past);
      setActivePlanInstallments(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/v1/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setTransactions(data.filter(t => t.type === 'INCOME')))
    .catch(err => console.error(err));

    fetchTermPlans();
    fetchInstallments();
  }, []);

  const handleEditIncome = (transaction) => {
    setEditingId(transaction.id);
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setDate(transaction.date);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDescription('');
    setAmount('');
    setDate('');
    setError('');
  };

  const handleAddIncome = async () => {
    const missing = [];
    if (!description.trim()) missing.push('Title');
    if (!amount || parseFloat(amount) <= 0) missing.push('Amount');
    if (!date) missing.push('Date');
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(', ')}`);
      return;
    }
    setError('');
    const token = localStorage.getItem('token');

    if (editingId) {
      await fetch(`${API_URL}/api/v1/transaction/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          category: 'Income',
          type: 'INCOME',
          date
        })
      });
      setEditingId(null);
    } else {
      await fetch(`${API_URL}/api/v1/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
          category: 'Income',
          type: 'INCOME',
          date,
          user: { id: parseInt(localStorage.getItem('userId')) }
        })
      });
    }

    const updatedResponse = await fetch(`${API_URL}/api/v1/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const updatedData = await updatedResponse.json();
    setTransactions(updatedData.filter(t => t.type === 'INCOME'));
    setDescription('');
    setAmount('');
    setDate('');
    refreshData();
  };

  const handleDeleteIncome = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/v1/transaction/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    setTransactions(transactions.filter(t => t.id !== id));
    if (editingId === id) handleCancelEdit();
    refreshData();
  };

  const addInstallment = () => {
    setInstallments([...installments, { label: '', amount: '', date: '' }]);
  };

  const updateInstallment = (index, field, value) => {
    const updated = [...installments];
    updated[index][field] = value;
    setInstallments(updated);
  };

  const removeInstallment = (index) => {
    setInstallments(installments.filter((_, i) => i !== index));
  };

  const openNewTermPlan = () => {
    setIsEditing(false);
    setEditingPlanId(null);
    setYearOfStudy('');
    setAcademicYear('');
    setWeeklyBudget('');
    setStartDate('');
    setEndDate('');
    setInstallments([{ label: '', amount: '', date: '' }]);
    setTermError('');
    setShowTermPlanModal(true);
  };

  const openEditTermPlan = () => {
    if (!activePlan) return;
    setIsEditing(true);
    setEditingPlanId(activePlan.id);
    setYearOfStudy(activePlan.yearOfStudy || '');
    setAcademicYear(activePlan.academicYear || '');
    setWeeklyBudget(activePlan.weeklyBudget?.toString() || '');
    setStartDate(activePlan.startDate || '');
    setEndDate(activePlan.endDate || '');
    const planInstallments = activePlanInstallments.filter(i => i.termPlanId === activePlan.id);
    if (planInstallments.length > 0) {
      setInstallments(planInstallments.map(i => ({
        id: i.id,
        label: i.label || '',
        amount: i.amount?.toString() || '',
        date: i.date || ''
      })));
    } else {
      setInstallments([{ label: '', amount: '', date: '' }]);
    }
    setTermError('');
    setShowTermPlanModal(true);
  };

  const handleTermPlanSubmit = async () => {
    const missing = [];
    if (!academicYear.trim()) missing.push('Academic Year');
    if (!yearOfStudy) missing.push('Year of Study');
    if (!weeklyBudget) missing.push('Weekly Budget');
    if (!startDate) missing.push('Start Date');
    if (!endDate) missing.push('End Date');
    const validInstallments = installments.filter(i => i.label.trim() && i.amount && i.date);
    if (validInstallments.length === 0) missing.push('At least one instalment');
    if (missing.length > 0) {
      setTermError(`Please fill in: ${missing.join(', ')}`);
      return;
    }
    setTermError('');
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId'));

    let termPlan;

    if (isEditing && editingPlanId) {
      const res = await fetch(`${API_URL}/api/v1/termPlan/${editingPlanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          termName: `${academicYear} - ${yearOfStudy}`,
          yearOfStudy,
          academicYear,
          weeklyBudget: parseFloat(weeklyBudget),
          startDate,
          endDate,
          user: { id: userId }
        })
      });
      termPlan = await res.json();

      const oldInstallments = activePlanInstallments.filter(i => i.termPlanId === editingPlanId);
      for (const old of oldInstallments) {
        await fetch(`${API_URL}/api/v1/installment/${old.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }

      for (const inst of validInstallments) {
        await fetch(`${API_URL}/api/v1/installment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            label: inst.label,
            amount: parseFloat(inst.amount),
            date: inst.date,
            termPlan: { id: termPlan.id }
          })
        });
      }
    } else {
      const res = await fetch(`${API_URL}/api/v1/termPlan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          termName: `${academicYear} - ${yearOfStudy}`,
          yearOfStudy,
          academicYear,
          weeklyBudget: parseFloat(weeklyBudget),
          startDate,
          endDate,
          user: { id: userId }
        })
      });
      termPlan = await res.json();

      for (const inst of validInstallments) {
        await fetch(`${API_URL}/api/v1/installment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            label: inst.label,
            amount: parseFloat(inst.amount),
            date: inst.date,
            termPlan: { id: termPlan.id }
          })
        });
      }
    }

    localStorage.setItem('activeTermPlanId', termPlan.id);
    setShowTermPlanModal(false);
    await fetchTermPlans();
    await fetchInstallments();
    refreshData();
  };

  const handleSwitchPlan = (planId) => {
    const plan = termPlans.find(p => p.id === parseInt(planId));
    if (plan) {
      setActivePlan(plan);
      localStorage.setItem('activeTermPlanId', plan.id);
      refreshData();
    }
  };

  const allIncome = [...transactions, ...pastInstallments].sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalIncomeLocal = allIncome.reduce((sum, t) => sum + t.amount, 0);
  const currentPlanInstallments = activePlan ? activePlanInstallments.filter(i => i.termPlanId === activePlan.id) : [];

  const inputClass = "w-full p-3 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.3)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors";
  const inputClassSm = "p-2 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.3)] focus:outline-none text-sm";

  return (
    <div className="min-h-screen bg-[#0c0e18] p-6">
      <h1 className="text-2xl font-bold text-[#f0e8ea] mb-6">Income Management</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#f0e8ea]">Term Plan</h2>
            {termPlans.length > 1 && (
              <select
                value={activePlan?.id || ''}
                onChange={(e) => handleSwitchPlan(e.target.value)}
                className="p-2 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] text-xs focus:outline-none"
              >
                {termPlans.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.academicYear || `Plan #${p.id}`} — {p.yearOfStudy || 'Unknown year'}
                  </option>
                ))}
              </select>
            )}
          </div>

          {activePlan ? (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-widest mb-1">Academic Year</p>
                  <p className="text-white font-semibold">{activePlan.academicYear || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-widest mb-1">Year of Study</p>
                  <p className="text-white font-semibold">{activePlan.yearOfStudy || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-widest mb-1">Weekly Budget</p>
                  <p className="text-white font-semibold font-mono">£{(activePlan.weeklyBudget || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-widest mb-1">Term Dates</p>
                  <p className="text-white text-sm font-semibold">
                    {activePlan.startDate ? new Date(activePlan.startDate).toLocaleDateString('en-GB') : '-'}
                    {' — '}
                    {activePlan.endDate ? new Date(activePlan.endDate).toLocaleDateString('en-GB') : '-'}
                  </p>
                </div>
              </div>

              {currentPlanInstallments.length > 0 && (
                <div className="mb-4 pt-3 border-t border-[rgba(200,150,160,0.08)]">
                  <p className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-widest mb-2">Instalments</p>
                  <div className="flex flex-col gap-1.5">
                    {currentPlanInstallments.map(inst => (
                      <div key={inst.id} className="flex items-center justify-between">
                        <span className="text-sm text-[rgba(255,255,255,0.6)]">{inst.label || 'Instalment'}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[rgba(255,255,255,0.3)]">{inst.date}</span>
                          <span className="text-sm font-mono font-semibold text-[#8ab8a0]">
                            £{Number(inst.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-2 border-t border-[rgba(200,150,160,0.06)]">
                      <span className="text-xs text-[rgba(255,255,255,0.4)]">Total</span>
                      <span className="text-sm font-mono font-semibold text-white">
                        £{currentPlanInstallments
                          .reduce((sum, i) => sum + i.amount, 0)
                          .toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={openEditTermPlan}
                  className="flex-1 py-2.5 bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.18)] text-[#f0e8ea] rounded-lg hover:bg-[rgba(200,150,160,0.18)] transition-colors text-sm font-medium">
                  Edit Plan
                </button>
                <button onClick={openNewTermPlan}
                  className="flex-1 py-2.5 bg-[#c896a0] text-[#0c0e18] rounded-lg hover:opacity-90 transition-colors text-sm font-semibold">
                  New Plan
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[rgba(240,232,234,0.5)] text-sm mb-6">
                Set your student loan instalments and weekly budget for this academic year
              </p>
              <button
                className="w-full bg-[#c896a0] text-[#0c0e18] py-3 rounded-lg hover:opacity-90 transition-colors font-semibold"
                onClick={openNewTermPlan}
              >
                Set Up Term Plan
              </button>
            </div>
          )}
        </div>

        <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#f0e8ea]">{editingId ? 'Edit Income' : 'Add Income'}</h2>
            {editingId && (
              <button onClick={handleCancelEdit}
                className="text-sm text-[rgba(255,255,255,0.4)] hover:text-white transition-colors">
                Cancel edit
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[rgba(208,136,136,0.08)] border border-[rgba(208,136,136,0.15)] rounded-lg">
              <p className="text-sm text-[#d08888]">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#f0e8ea] mb-2">Title</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Part-time Job, Freelance, Bursary" className={inputClass} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#f0e8ea] mb-2">Amount (£)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="800" className={inputClass} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#f0e8ea] mb-2">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>

          <button onClick={handleAddIncome}
            className={`w-full py-3 rounded-lg hover:opacity-90 transition-colors font-semibold ${
              editingId ? 'bg-[#c896a0] text-[#0c0e18]' : 'bg-[#8ab8a0] text-[#0c0e18]'
            }`}>
            {editingId ? 'Update Income' : 'Add Income'}
          </button>
        </div>

      </div>

      <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#f0e8ea]">Income History</h2>
          <p className="text-lg font-semibold font-mono tracking-tight text-[#8ab8a0]">
            Total: £{totalIncomeLocal.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {allIncome.length > 0 ? (
            allIncome.map((transaction) => (
              <div key={transaction.id} className={`flex items-center justify-between p-4 hover:bg-[rgba(200,150,160,0.05)] rounded-lg transition-all duration-300 border ${
                editingId === transaction.id ? 'border-[#c896a0] bg-[rgba(200,150,160,0.05)]' : 'border-[rgba(200,150,160,0.08)]'
              }`}>
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#f0e8ea]">{transaction.description}</p>
                      {transaction.type === 'INSTALMENT' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(138,184,160,0.1)] border border-[rgba(138,184,160,0.2)] text-[#8ab8a0]">
                          Instalment
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[rgba(255,255,255,0.4)]">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[#8ab8a0] font-semibold font-mono tracking-tight text-lg">
                    +£{Number(transaction.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </p>
                  {transaction.type !== 'INSTALMENT' && (
                    <>
                      <button onClick={() => handleEditIncome(transaction)}
                        className="text-[rgba(240,232,234,0.25)] hover:text-[#c896a0] transition-colors text-sm">
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteIncome(transaction.id)}
                        className="text-[rgba(240,232,234,0.25)] hover:text-[#d08888] transition-colors">
                        <span className="text-xl"><FaDeleteLeft /></span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[rgba(255,255,255,0.3)] text-center py-8">No income transactions yet. Add your first income above!</p>
          )}
        </div>
      </div>

      {showTermPlanModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c0e18] border border-[rgba(200,150,160,0.15)] rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#f0e8ea] mb-6">
              {isEditing ? 'Edit Term Plan' : 'Set Up Term Plan'}
            </h2>

            {termError && (
              <div className="mb-4 p-3 bg-[rgba(208,136,136,0.08)] border border-[rgba(208,136,136,0.15)] rounded-lg">
                <p className="text-sm text-[#d08888]">{termError}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#f0e8ea] mb-2">Academic Year</label>
              <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g., 2025/26" className={inputClass} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#f0e8ea] mb-2">Year of Study</label>
              <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full p-3 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors">
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[#f0e8ea] mb-2">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f0e8ea] mb-2">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[#f0e8ea] mb-2">Weekly Budget (£)</label>
              <input type="number" value={weeklyBudget} onChange={(e) => setWeeklyBudget(e.target.value)}
                placeholder="150" className={inputClass} />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#f0e8ea]">Student Finance Instalments</label>
                <button onClick={addInstallment} className="text-[#c896a0] text-sm hover:opacity-80">+ Add</button>
              </div>
              {installments.map((inst, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                  <input type="text" placeholder="Label" value={inst.label}
                    onChange={(e) => updateInstallment(index, 'label', e.target.value)} className={inputClassSm} />
                  <input type="number" placeholder="Amount" value={inst.amount}
                    onChange={(e) => updateInstallment(index, 'amount', e.target.value)} className={inputClassSm} />
                  <div className="flex gap-1">
                    <input type="date" value={inst.date}
                      onChange={(e) => updateInstallment(index, 'date', e.target.value)}
                      className={"w-full " + inputClassSm} />
                    {installments.length > 1 && (
                      <button onClick={() => removeInstallment(index)} className="text-[#d08888] hover:opacity-80 px-1">✕</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowTermPlanModal(false)}
                className="flex-1 py-3 bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.18)] text-[#f0e8ea] rounded-lg hover:bg-[rgba(200,150,160,0.15)] transition-colors">
                Cancel
              </button>
              <button onClick={handleTermPlanSubmit}
                className="flex-1 py-3 bg-[#c896a0] text-[#0c0e18] rounded-lg hover:opacity-90 transition-colors font-semibold">
                {isEditing ? 'Update Plan' : 'Save Term Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Income;