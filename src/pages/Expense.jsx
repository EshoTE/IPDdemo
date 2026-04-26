import { useState, useEffect } from 'react';
import { FaDeleteLeft } from "react-icons/fa6";
import API_URL from '../config';

// Expense management page with spending alert algorithm
function Expense({ totalExpenses, transactions: transactionsProp, refreshData }) {
  const [transactions, setTransactions] = useState([]);

  // Form state for add/edit expense
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Preset categories merged with user-defined custom ones (no separate categories table)
  const [categories, setCategories] = useState([
    'Groceries', 'Rent', 'Transport', 'Eating Out', 'Entertainment', 'Bills', 'Shopping', 'Other'
  ]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Data needed by the alert algorithm
  const [termPlan, setTermPlan] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Initial data fetch on mount
  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${API_URL}/api/v1/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      const expenses = data.filter(t => t.type === 'EXPENSE');
      setTransactions(expenses);
      // Merge any historical custom categories so they persist across sessions
      const existingCategories = [...new Set(expenses.map(t => t.category).filter(Boolean))];
      const merged = [...new Set([...categories, ...existingCategories])];
      setCategories(merged);
    })
    .catch(err => console.error(err));

    fetch(`${API_URL}/api/v1/termPlans`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      // Use the active plan from localStorage if set, otherwise fall back to the most recent
      const activeId = parseInt(localStorage.getItem('activeTermPlanId'));
      const plan = activeId ? data.find(p => p.id === activeId) : data[data.length - 1];
      setTermPlan(plan || null);
    })
    .catch(err => console.error(err));

    fetch(`${API_URL}/api/v1/installments`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setInstallments(data))
    .catch(err => console.error(err));
  }, []);

  // Spending alert algorithm - re-runs whenever transactions, term plan or instalments change.
  // Evaluates four conditions in sequence: weekly budget thresholds, upcoming instalments,
  // category concentration, and the on-track fallback.
  useEffect(() => {
    if (!termPlan) return;
    const newAlerts = [];
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Sum the user's expense transactions from the last 7 days
    const weeklySpent = transactions
      .filter(t => new Date(t.date) >= weekAgo)
      .reduce((sum, t) => sum + t.amount, 0);

    const weeklyBudget = termPlan.weeklyBudget || 0;

    // Condition 1: weekly budget thresholds (graduated alerts at 100%, 80%, 50%)
    if (weeklyBudget > 0) {
      const percentUsed = (weeklySpent / weeklyBudget) * 100;

      if (percentUsed >= 100) {
        newAlerts.push({
          type: 'danger',
          title: 'Over Budget',
          message: `You've exceeded your weekly budget by £${(weeklySpent - weeklyBudget).toFixed(2)}. Weekly budget: £${weeklyBudget.toFixed(2)}, spent: £${weeklySpent.toFixed(2)}.`
        });
      } else if (percentUsed >= 80) {
        newAlerts.push({
          type: 'warning',
          title: 'Budget Warning',
          message: `You've used ${Math.round(percentUsed)}% of your weekly budget (£${weeklySpent.toFixed(2)} of £${weeklyBudget.toFixed(2)}). £${(weeklyBudget - weeklySpent).toFixed(2)} remaining.`
        });
      } else if (percentUsed >= 50) {
        newAlerts.push({
          type: 'info',
          title: 'Budget Update',
          message: `You've used ${Math.round(percentUsed)}% of your weekly budget. £${(weeklyBudget - weeklySpent).toFixed(2)} remaining this week.`
        });
      }
    }

    // Condition 2: instalments arriving within the next 14 days, sorted chronologically
    const upcomingInstallments = installments
      .filter(i => {
        const instDate = new Date(i.date);
        const daysUntil = Math.ceil((instDate - today) / (1000 * 60 * 60 * 24));
        return daysUntil > 0 && daysUntil <= 14;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    upcomingInstallments.forEach(inst => {
      const daysUntil = Math.ceil((new Date(inst.date) - today) / (1000 * 60 * 60 * 24));
      newAlerts.push({
        type: 'success',
        title: 'Upcoming Instalment',
        message: `${inst.label || 'Student Finance'} of £${Number(inst.amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })} arriving in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}.`
      });
    });

    // Condition 3: flag if any single category dominates total spending (40%+)
    const categorySpending = {};
    transactions.forEach(t => {
      if (t.category) {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      }
    });

    const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
      const percentage = totalSpent > 0 ? Math.round((topAmount / totalSpent) * 100) : 0;
      if (percentage >= 40) {
        newAlerts.push({
          type: 'info',
          title: 'Spending Insight',
          message: `${topCategory} accounts for ${percentage}% of your total expenses (£${topAmount.toFixed(2)}).`
        });
      }
    }

    // Condition 4: positive fallback if no other alerts triggered
    if (newAlerts.length === 0 && weeklyBudget > 0) {
      newAlerts.push({
        type: 'success',
        title: 'On Track',
        message: `You're within your weekly budget. £${(weeklyBudget - weeklySpent).toFixed(2)} remaining this week.`
      });
    }

    setAlerts(newAlerts);
  }, [transactions, termPlan, installments]);

  // Show inline input when the user picks "+ Add custom category"
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

  // Pre-populate the form with the existing transaction's values
  const handleEditExpense = (transaction) => {
    setEditingId(transaction.id);
    setDescription(transaction.description || '');
    setAmount(transaction.amount.toString());
    setDate(transaction.date);
    setCategory(transaction.category || '');
    setShowCustomInput(false);
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDescription('');
    setAmount('');
    setDate('');
    setCategory('');
    setError('');
  };

  // Handles both create (POST) and update (PUT) depending on editingId
  const handleAddExpense = async () => {
    const missing = [];
    if (!category.trim()) missing.push('Category');
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
          description: description || category,
          amount: parseFloat(amount),
          category,
          type: 'EXPENSE',
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
          description: description || category,
          amount: parseFloat(amount),
          category,
          type: 'EXPENSE',
          date,
          user: { id: parseInt(localStorage.getItem('userId')) }
        })
      });
    }

    // Re-fetch to pick up the new/updated transaction, then sync App.jsx via refreshData
    const updatedResponse = await fetch(`${API_URL}/api/v1/transactions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const updatedData = await updatedResponse.json();
    setTransactions(updatedData.filter(t => t.type === 'EXPENSE'));
    setCategory('');
    setDescription('');
    setAmount('');
    setDate('');
    refreshData();
  };

  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/v1/transaction/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    setTransactions(transactions.filter(t => t.id !== id));
    if (editingId === id) handleCancelEdit();
    refreshData();
  };

  const totalExpensesLocal = transactions.reduce((sum, t) => sum + t.amount, 0);

  // Maps an alert type to its colour scheme and icon
  const getAlertStyles = (type) => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-[rgba(208,136,136,0.08)]',
          border: 'border-[rgba(208,136,136,0.15)]',
          title: 'text-[#d08888]',
          icon: '🔴'
        };
      case 'warning':
        return {
          bg: 'bg-[rgba(220,180,100,0.08)]',
          border: 'border-[rgba(220,180,100,0.15)]',
          title: 'text-[#dcb464]',
          icon: '🟡'
        };
      case 'success':
        return {
          bg: 'bg-[rgba(138,184,160,0.08)]',
          border: 'border-[rgba(138,184,160,0.15)]',
          title: 'text-[#8ab8a0]',
          icon: '🟢'
        };
      case 'info':
      default:
        return {
          bg: 'bg-[rgba(150,170,200,0.08)]',
          border: 'border-[rgba(150,170,200,0.15)]',
          title: 'text-[#96aac8]',
          icon: '🔵'
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0e18] p-6">
      <h1 className="text-2xl font-bold text-[#f0e8ea] mb-6">Expense Management</h1>

      {/* Add/edit expense form */}
      <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#f0e8ea]">{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
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
              Title (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Tesco weekly shop"
              className="w-full p-3 bg-[#1a1c2e] border border-[rgba(200,150,160,0.12)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.3)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors"
            />
          </div>
        </div>

        <button onClick={handleAddExpense}
          className={`w-full py-3 rounded-lg hover:opacity-90 transition-all duration-300 mt-2 font-semibold ${
            editingId
              ? 'bg-[#c896a0] text-[#0c0e18]'
              : 'bg-[rgba(200,150,160,0.12)] border border-[rgba(200,150,160,0.2)] text-[#f0e8ea] hover:bg-[rgba(200,150,160,0.2)]'
          }`}>
          {editingId ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>

      {/* Expense history list with edit/delete actions */}
      <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#f0e8ea]">Expense History</h2>
          <div className="flex items-center gap-4">
            <p className="text-lg font-semibold font-mono tracking-tight text-[#d08888]">
              Total: £{totalExpensesLocal.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className={`flex items-center justify-between p-4 hover:bg-[rgba(200,150,160,0.05)] rounded-lg transition-all duration-300 border ${
                editingId === transaction.id ? 'border-[#c896a0] bg-[rgba(200,150,160,0.05)]' : 'border-[rgba(200,150,160,0.08)]'
              }`}>
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
                  <button onClick={() => handleEditExpense(transaction)}
                    className="text-[rgba(240,232,234,0.25)] hover:text-[#c896a0] transition-colors text-sm">
                    ✏️
                  </button>
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

      {/* Spending alerts panel - rendered from the alerts state computed by the algorithm above */}
      <div className="bg-[rgba(200,150,160,0.04)] border border-[rgba(200,150,160,0.1)] rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-bold text-[#f0e8ea] mb-4">Spending Alerts</h2>
        <div className="flex flex-col gap-3">
          {alerts.length > 0 ? (
            alerts.map((alert, index) => {
              const styles = getAlertStyles(alert.type);
              return (
                <div key={index} className={`${styles.bg} border ${styles.border} p-4 rounded-lg`}>
                  <p className="text-sm text-[rgba(240,232,234,0.7)]">
                    <span className={`font-semibold ${styles.title}`}>{styles.icon} {alert.title}:</span> {alert.message}
                  </p>
                </div>
              );
            })
          ) : !termPlan ? (
            <div className="bg-[rgba(150,170,200,0.08)] border border-[rgba(150,170,200,0.15)] p-4 rounded-lg">
              <p className="text-sm text-[rgba(240,232,234,0.7)]">
                <span className="font-semibold text-[#96aac8]">🔵 Set up required:</span> Create a term plan with a weekly budget to enable spending alerts.
              </p>
            </div>
          ) : (
            <div className="bg-[rgba(138,184,160,0.08)] border border-[rgba(138,184,160,0.15)] p-4 rounded-lg">
              <p className="text-sm text-[rgba(240,232,234,0.7)]">
                <span className="font-semibold text-[#8ab8a0]">🟢 All clear:</span> No spending alerts at this time.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default Expense;