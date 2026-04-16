import { useState, useEffect } from 'react';
import { FaDeleteLeft } from "react-icons/fa6";

function Expense() {
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categories, setCategories] = useState([
    'Groceries', 'Rent', 'Transport', 'Eating Out', 'Entertainment', 'Bills', 'Shopping', 'Other'
  ]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/v1/transactions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      const expenses = data.filter(t => t.type === 'EXPENSE');
      setTransactions(expenses);
      const existingCategories = [...new Set(expenses.map(t => t.category).filter(Boolean))];
      const merged = [...new Set([...categories, ...existingCategories])];
      setCategories(merged);
    })
    .catch(err => console.error(err));
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === '__custom__') {
      setShowCustomInput(true);
      setCategory('');
    } else {
      setShowCustomInput(false);
      setCategory(value);
    }
  };

  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      setCategories([...categories, customCategory.trim()]);
      setCategory(customCategory.trim());
      setCustomCategory('');
      setShowCustomInput(false);
    }
  };

  const handleAddExpense = async () => {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:8080/api/v1/transaction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            description: description || category,
            amount: parseFloat(amount),
            category,
            type: 'EXPENSE',
            date,
            user: { id: parseInt(localStorage.getItem('userId')) }
        })
    });
    const updatedResponse = await fetch('http://localhost:8080/api/v1/transactions', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const updatedData = await updatedResponse.json();
    setTransactions(updatedData.filter(t => t.type === 'EXPENSE'));
    setCategory('');
    setDescription('');
    setAmount('');
    setDate('');
  };

  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8080/api/v1/transaction/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-[#0c0e18] p-6">
      <h1 className="text-2xl font-bold text-[#f0e8ea] mb-6">Expense Management</h1>

      <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-[#f0e8ea] mb-4">Add Expense</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#f0e8ea] mb-2">
              Expense Category
            </label>
            <select
              value={showCustomInput ? '__custom__' : category}
              onChange={handleCategoryChange}
              className="w-full p-3 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors"
            >
              <option value="">Select a category</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat}>{cat}</option>
              ))}
              <option value="__custom__">+ Add custom category</option>
            </select>
            {showCustomInput && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter new category"
                  className="flex-1 p-2 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.3)] focus:outline-none text-sm"
                />
                <button onClick={handleAddCustomCategory}
                  className="px-3 py-2 bg-[rgba(200,150,160,0.15)] border border-[rgba(200,150,160,0.2)] text-[#f0e8ea] rounded-lg text-sm hover:bg-[rgba(200,150,160,0.25)] transition-colors">
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#f0e8ea] mb-2">
              Amount (£)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50"
              className="w-full p-3 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.3)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#f0e8ea] mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[#f0e8ea] mb-2">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional details"
              className="w-full p-3 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.3)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors"
            />
          </div>
        </div>

        <button onClick={handleAddExpense} className="w-full bg-[rgba(200,150,160,0.12)] border border-[rgba(200,150,160,0.2)] text-[#f0e8ea] py-3 rounded-lg hover:bg-[rgba(200,150,160,0.2)] transition-all duration-300 mt-2 font-semibold">
          Add Expense
        </button>
      </div>

      <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#f0e8ea]">Expense History</h2>
          <div className="flex items-center gap-4">
            <p className="text-lg font-semibold font-mono tracking-tight text-[#d08888]">
              Total: £{totalExpenses.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
            <button className="px-4 py-2 bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.18)] text-[#f0e8ea] text-sm rounded-lg hover:bg-[rgba(200,150,160,0.15)] transition-all duration-300">
              Export to CSV
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-[rgba(200,150,160,0.05)] rounded-lg transition-all duration-300 border border-[rgba(200,150,160,0.08)]">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-[#f0e8ea]">
                      {transaction.description || transaction.category || 'Expense'}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-[rgba(240,232,234,0.4)]">{transaction.date}</p>
                      {transaction.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.15)] text-[rgba(240,232,234,0.5)]">
                          {transaction.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[#d08888] font-semibold font-mono tracking-tight text-lg">
                    -£{Math.abs(transaction.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </p>
                  <button
                    onClick={() => handleDeleteExpense(transaction.id)}
                    className="text-[rgba(240,232,234,0.25)] hover:text-[#d08888] transition-colors">
                    <span className="text-xl"><FaDeleteLeft /></span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[rgba(240,232,234,0.3)] text-center py-8">No expenses yet. Add your first expense above!</p>
          )}
        </div>
      </div>

      <div className="bg-[rgba(208,136,136,0.04)] border border-[rgba(208,136,136,0.12)] rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-bold text-[#f0e8ea] mb-4">⚠️ Spending Alerts</h2>
        <div className="flex flex-col gap-3">
          <div className="bg-[rgba(208,136,136,0.06)] border border-[rgba(208,136,136,0.1)] p-4 rounded-lg">
            <p className="text-sm text-[rgba(240,232,234,0.6)]">
              <span className="font-semibold text-[#d08888]">Budget Alert:</span> You're approaching your weekly spending limit!
            </p>
          </div>
          <div className="bg-[rgba(208,136,136,0.06)] border border-[rgba(208,136,136,0.1)] p-4 rounded-lg">
            <p className="text-sm text-[rgba(240,232,234,0.6)]">
              <span className="font-semibold text-[#d08888]">Upcoming Bill:</span> Rent payment due in 3 days (£500)
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Expense;