import { useState, useEffect } from 'react';
import { FaDeleteLeft } from "react-icons/fa6";

function Expense() {
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:8080/api/v1/transactions', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setTransactions(data.filter(t => t.type === 'EXPENSE')))
    .catch(err => console.error(err));
  }, []);

  const handleAddExpense = async () => {
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
  };

  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:8080/api/v1/transaction/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0c0e18] p-6">
      <h1 className="text-2xl font-bold text-[#f0e8ea] mb-6">Expense Management</h1>

      <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-[#f0e8ea] mb-4">Add Expense</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">
              Expense Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Groceries, Rent, Transport"
              className="w-full p-3 bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.2)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">
              Amount (£)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50"
              className="w-full p-3 bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.2)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.2)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-[rgba(240,232,234,0.4)] mb-2">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional details"
              className="w-full p-3 bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-lg text-[#f0e8ea] placeholder-[rgba(240,232,234,0.2)] focus:outline-none focus:border-[rgba(200,150,160,0.3)] transition-colors"
            />
          </div>
        </div>

        <button onClick={handleAddExpense} className="w-full bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.18)] text-[#c896a0] py-3 rounded-lg hover:bg-[rgba(200,150,160,0.18)] transition-all duration-300 mt-2 font-semibold">
          Add Expense
        </button>
      </div>

      <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#f0e8ea]">Expense History</h2>
          <div className="flex items-center gap-4">
            <p className="text-lg font-semibold text-[#d08888]">Total: £{transactions.reduce((sum, t) => sum + t.amount, 0)}</p>
            <button className="px-4 py-2 bg-[rgba(200,150,160,0.1)] border border-[rgba(200,150,160,0.18)] text-[#c896a0] text-sm rounded-lg hover:bg-[rgba(200,150,160,0.15)] transition-all duration-300">
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
                    <p className="font-medium text-[#f0e8ea]">{transaction.description}</p>
                    <p className="text-sm text-[rgba(240,232,234,0.3)]">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[#d08888] font-semibold text-lg">-£{Math.abs(transaction.amount)}</p>
                  <button
                    onClick={() => handleDeleteExpense(transaction.id)}
                    className="text-[rgba(240,232,234,0.2)] hover:text-[#d08888] transition-colors">
                    <span className="text-xl"><FaDeleteLeft /></span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[rgba(240,232,234,0.25)] text-center py-8">No expenses yet. Add your first expense above!</p>
          )}
        </div>
      </div>

      <div className="bg-[rgba(208,136,136,0.04)] border border-[rgba(208,136,136,0.12)] rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-bold text-[#f0e8ea] mb-4">⚠️ Spending Alerts</h2>
        <div className="flex flex-col gap-3">
          <div className="bg-[rgba(208,136,136,0.06)] border border-[rgba(208,136,136,0.1)] p-4 rounded-lg">
            <p className="text-sm text-[rgba(240,232,234,0.5)]">
              <span className="font-semibold text-[#d08888]">Budget Alert:</span> You're approaching your weekly spending limit!
            </p>
          </div>
          <div className="bg-[rgba(208,136,136,0.06)] border border-[rgba(208,136,136,0.1)] p-4 rounded-lg">
            <p className="text-sm text-[rgba(240,232,234,0.5)]">
              <span className="font-semibold text-[#d08888]">Upcoming Bill:</span> Rent payment due in 3 days (£500)
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Expense;