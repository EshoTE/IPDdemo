import SummaryCards from './Components/SummaryCards';
import FinancialOverview from './Components/FinancialOverview';

function Home({ totalBalance, totalIncome, totalExpenses, transactions }) {
  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      <SummaryCards
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
      />

      <div className="grid grid-cols-2 gap-6 mt-6">

        <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Transactions</h2>

          <div className="flex flex-col gap-4">

            <div className="flex items-center justify-between hover:bg-white/5 p-2 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-900/30 border border-purple-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <div>
                  <p className="text-white font-medium">Youtube Revenue</p>
                  <p className="text-sm text-gray-500">7th Feb 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-green-400 font-semibold">+ £9500</p>
                <span className="text-green-400">📈</span>
              </div>
            </div>

            <div className="flex items-center justify-between hover:bg-white/5 p-2 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-900/30 border border-purple-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="text-white font-medium">Trading</p>
                  <p className="text-sm text-gray-500">6th Feb 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-green-400 font-semibold">+ £10000</p>
                <span className="text-green-400">📈</span>
              </div>
            </div>

            <div className="flex items-center justify-between hover:bg-white/5 p-2 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-900/30 border border-purple-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <p className="text-white font-medium">Salary</p>
                  <p className="text-sm text-gray-500">4th Feb 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-green-400 font-semibold">+ £12500</p>
                <span className="text-green-400">📈</span>
              </div>
            </div>

            <div className="flex items-center justify-between hover:bg-white/5 p-2 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-900/30 border border-purple-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✈️</span>
                </div>
                <div>
                  <p className="text-white font-medium">Travel</p>
                  <p className="text-sm text-gray-500">3rd Feb 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-red-400 font-semibold">- £380</p>
                <span className="text-red-400">📉</span>
              </div>
            </div>

            <div className="flex items-center justify-between hover:bg-white/5 p-2 rounded-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-900/30 border border-purple-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🏢</span>
                </div>
                <div>
                  <p className="text-white font-medium">Business Income</p>
                  <p className="text-sm text-gray-500">2nd Feb 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-green-400 font-semibold">+ £6500</p>
                <span className="text-green-400">📈</span>
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