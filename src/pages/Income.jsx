import { useState, useEffect } from 'react';
import { FaDeleteLeft } from "react-icons/fa6";

function Income() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [showTermPlanModal, setShowTermPlanModal] = useState(false);
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [weeklyBudget, setWeeklyBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [installments, setInstallments] = useState([{ label: '', amount: '', date: '' }]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/v1/transactions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setTransactions(data.filter(t => t.type === 'INCOME')))
    .catch(err => console.error(err));
  }, []);

  const handleAddIncome = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:8080/api/v1/transaction', {
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
    const updatedResponse = await fetch('http://localhost:8080/api/v1/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const updatedData = await updatedResponse.json();
    setTransactions(updatedData.filter(t => t.type === 'INCOME'));
  };

  const handleDeleteIncome = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8080/api/v1/transaction/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    setTransactions(transactions.filter(t => t.id !== id));
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

  const handleTermPlanSubmit = async () => {
    const token = localStorage.getItem('token');
    const userId = parseInt(localStorage.getItem('userId'));

    const termPlanResponse = await fetch('http://localhost:8080/api/v1/termPlan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            yearOfStudy,
            academicYear,
            weeklyBudget: parseFloat(weeklyBudget),
            startDate,
            endDate,
            user: { id: userId }
        })
    });
    const termPlan = await termPlanResponse.json();

    for (const inst of installments) {
        await fetch('http://localhost:8080/api/v1/installment', {
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
    setShowTermPlanModal(false);
  };

  const inputClass = "w-full p-3 bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.2)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors";
  const inputClassSm = "p-2 bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.2)] focus:outline-none text-sm";

  return (
    <div className="min-h-screen bg-[#0c0e18] p-6">
      <h1 className="text-2xl font-bold text-[#f0e8ea] mb-6">Income Management</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[#f0e8ea] mb-4">Term Plan Setup</h2>
          <p className="text-[rgba(240,232,234,0.4)] text-sm mb-6">
            Set your student loan instalments and weekly budget for this academic year
          </p>
          <button
            className="w-full bg-[#c896a0] text-[#0c0e18] py-3 rounded-lg hover:opacity-90 transition-colors font-semibold"
            onClick={() => setShowTermPlanModal(true)}
          >
            Set Up Term Plan
          </button>
        </div>

        <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6">
          <h2 className="text-xl font-bold text-[#f0e8ea] mb-4">Add Income</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">Income Source</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Part-time Job, Freelance" className={inputClass} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">Amount (£)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="800" className={inputClass} />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>

          <button onClick={handleAddIncome}
            className="w-full bg-[#8ab8a0] text-[#0c0e18] py-3 rounded-lg hover:opacity-90 transition-colors font-semibold">
            Add Income
          </button>
        </div>

      </div>

      <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#f0e8ea]">Income History</h2>
          <p className="text-lg font-semibold text-[#8ab8a0]">Total: £{transactions.reduce((sum, t) => sum + t.amount, 0)}</p>
        </div>

        <div className="flex flex-col gap-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-[rgba(200,150,160,0.05)] rounded-lg transition-all duration-300 border border-[rgba(200,150,160,0.08)]">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-[#f0e8ea]">{transaction.description}</p>
                    <p className="text-sm text-[rgba(240,232,234,0.3)]">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[#8ab8a0] font-semibold text-lg">+£{transaction.amount}</p>
                  <button onClick={() => handleDeleteIncome(transaction.id)}
                    className="text-[rgba(240,232,234,0.2)] hover:text-[#d08888] transition-colors">
                    <span className="text-xl"><FaDeleteLeft /></span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[rgba(240,232,234,0.25)] text-center py-8">No income transactions yet. Add your first income above!</p>
          )}
        </div>
      </div>

      {showTermPlanModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#0c0e18] border border-[rgba(200,150,160,0.15)] rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#f0e8ea] mb-6">Set Up Term Plan</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">Academic Year</label>
              <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g., 2025/26" className={inputClass} />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">Year of Study</label>
              <select value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full p-3 bg-[#0a0c16] border border-[rgba(200,150,160,0.08)] rounded-lg text-[#f0e8ea] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors">
                <option value="">Select year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">Weekly Budget (£)</label>
              <input type="number" value={weeklyBudget} onChange={(e) => setWeeklyBudget(e.target.value)}
                placeholder="150" className={inputClass} />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)]">Student Finance Instalments</label>
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
                Save Term Plan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Income;