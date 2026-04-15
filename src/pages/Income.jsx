import { useState, useEffect } from 'react';
import { FaDeleteLeft } from "react-icons/fa6";

function Income() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

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
  
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Income Management</h1>

      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Term Plan Setup</h2>
          <p className="text-gray-400 text-sm mb-6">
            Set your student loan amount, rent, and term dates to calculate your budget
          </p>
          <button
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => alert('Term plan form coming soon!')}
          >
            Set Up Term Plan
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Add Income</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Income Source
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Part-time Job, Freelance"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Amount (£)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="800"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>

          <button onClick={handleAddIncome} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
            Add Income
          </button>
        </div>

      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Income History</h2>
          <p className="text-lg font-semibold text-green-400">Total: £{transactions.reduce((sum, t) => sum + t.amount, 0)}</p>
        </div>

        <div className="flex flex-col gap-4">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-all duration-300 border border-white/10">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-white">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                <p className="text-green-400 font-semibold text-lg">+£{transaction.amount}</p>
                <button
                      onClick={() => handleDeleteIncome(transaction.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors">
                     <span className="text-xl"><FaDeleteLeft /></span>
                </button>
              </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No income transactions yet. Add your first income above!</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default Income;