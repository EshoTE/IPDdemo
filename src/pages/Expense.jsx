function Expense({ totalExpenses, transactions }) {
  
  // Filter to show only expense transactions (negative amounts)
  const expenseTransactions = transactions.filter(t => t.amount < 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Expense Management</h1>
      
      {/* Add Expense Form */}
      <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Add Expense</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expense Category
            </label>
            <input 
              type="text"
              placeholder="e.g., Groceries, Rent, Transport"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (£)
            </label>
            <input 
              type="number"
              placeholder="50"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input 
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <input 
              type="text"
              placeholder="Any additional details"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        <button className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors mt-2">
          Add Expense
        </button>
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Expense History</h2>
          <div className="flex items-center gap-4">
            <p className="text-lg font-semibold text-red-600">Total: £{totalExpenses}</p>
            <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors">
              Export to CSV
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          {expenseTransactions.length > 0 ? (
            expenseTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{transaction.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{transaction.name}</p>
                    <p className="text-sm text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-red-600 font-semibold text-lg">-£{Math.abs(transaction.amount)}</p>
                  <button className="text-gray-400 hover:text-red-600 transition-colors">
                    <span className="text-xl">🗑️</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">No expenses yet. Add your first expense above!</p>
          )}
        </div>
      </div>

      {/* Alerts Section (FR6) */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 shadow-md mt-6">
        <h2 className="text-xl font-bold text-orange-800 mb-4">⚠️ Spending Alerts</h2>
        <div className="flex flex-col gap-3">
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-orange-600">Budget Alert:</span> You're approaching your weekly spending limit!
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-orange-600">Upcoming Bill:</span> Rent payment due in 3 days (£500)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Expense;