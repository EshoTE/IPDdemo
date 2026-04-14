function Expense({ totalExpenses, transactions }) {

  const expenseTransactions = transactions.filter(t => t.amount < 0);

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Expense Management</h1>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Add Expense</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Expense Category
            </label>
            <input
              type="text"
              placeholder="e.g., Groceries, Rent, Transport"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Amount (£)
            </label>
            <input
              type="number"
              placeholder="50"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Date
            </label>
            <input
              type="date"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="Any additional details"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>

        <button className="w-full bg-white/10 border border-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition-all duration-300 mt-2">
          Add Expense
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Expense History</h2>
          <div className="flex items-center gap-4">
            <p className="text-lg font-semibold text-red-400">Total: £{totalExpenses}</p>
            <button className="px-4 py-2 bg-white/10 border border-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-all duration-300">
              Export to CSV
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {expenseTransactions.length > 0 ? (
            expenseTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-white/5 rounded-lg transition-all duration-300 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{transaction.icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{transaction.name}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-red-400 font-semibold text-lg">-£{Math.abs(transaction.amount)}</p>
                  <button className="text-gray-600 hover:text-red-400 transition-colors">
                    <span className="text-xl">🗑️</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No expenses yet. Add your first expense above!</p>
          )}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
        <h2 className="text-xl font-bold text-white mb-4">⚠️ Spending Alerts</h2>
        <div className="flex flex-col gap-3">
          <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-gray-200">Budget Alert:</span> You're approaching your weekly spending limit!
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-gray-200">Upcoming Bill:</span> Rent payment due in 3 days (£500)
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Expense;