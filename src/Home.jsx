import SummaryCards from './Components/SummaryCards';
import FinancialOverview from './Components/FinancialOverview';

function Home({ totalBalance, totalIncome, totalExpenses, transactions }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      
      <SummaryCards 
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />

      
      <div className="grid grid-cols-2 gap-6">
        
        
        <div className="flex flex-col bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-xl font-bold mb-6">Recent Transactions</h2>
          
          <div className="flex flex-col gap-4">
            
            {/* Youtube Revenue */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Youtube Revenue</p>
                  <p className="text-sm text-gray-400">7th Feb 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-green-500 font-semibold">+ $9500</p>
                <span className="text-green-500">📈</span>
              </div>
            </div>

            {/* Trading */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Trading</p>
                  <p className="text-sm text-gray-400">6th Feb 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-green-500 font-semibold">+ $10000</p>
                <span className="text-green-500">📈</span>
              </div>
            </div>

            {/* Salary */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Salary</p>
                  <p className="text-sm text-gray-400">4th Feb 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-green-500 font-semibold">+ $12500</p>
                <span className="text-green-500">📈</span>
              </div>
            </div>

            {/* Travel */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✈️</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Travel</p>
                  <p className="text-sm text-gray-400">3rd Feb 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-red-500 font-semibold">- $380</p>
                <span className="text-red-500">📉</span>
              </div>
            </div>

            {/* Business Income */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
                <div>
                  <p className="text-gray-800 font-medium">Business Income</p>
                  <p className="text-sm text-gray-400">2nd Feb 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-green-500 font-semibold">+ $6500</p>
                <span className="text-green-500">📈</span>
              </div>
            </div>

          </div>
        </div>

        
        <FinancialOverview 
          totalBalance={totalBalance}
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
        />
        
      </div>
    </div>
  );
}

export default Home;