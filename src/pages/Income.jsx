function Income({ totalIncome, transactions }) {
  
  // Filter to show only income transactions (positive amounts)
  const incomeTransactions = transactions.filter(t => t.amount > 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Income Management</h1>
      
      {/* Two columns - Term Plan and Add Income */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        
        {/* Left - Term Plan Setup */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Term Plan Setup</h2>
          <p className="text-gray-500 text-sm mb-6">
            Set your student loan amount, rent, and term dates to calculate your budget
          </p>
          
          <button 
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors"
            onClick={() => alert('Term plan form coming soon!')}
          >
            Set Up Term Plan
          </button>
        </div>

        {/* Right - Add Income Form */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Add Income</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Income Source
            </label>
            <input 
              type="text"
              placeholder="e.g., Part-time Job, Freelance"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (£)
            </label>
            <input 
              type="number"
              placeholder="800"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input 
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors">
            Add Income
          </button>
        </div>
      </div>

      {/* Income List */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Income History</h2>
          <p className="text-lg font-semibold text-green-600">Total: £{totalIncome}</p>
        </div>
        
        <div className="flex flex-col gap-4">
          {incomeTransactions.length > 0 ? (
            incomeTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{transaction.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transaction.name}</p>
                    <p className="text-sm text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <p className="text-green-600 font-semibold text-lg">+£{transaction.amount}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">No income transactions yet. Add your first income above!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Income;