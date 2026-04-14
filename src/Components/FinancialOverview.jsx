import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

function FinancialOverview({ totalBalance, totalIncome, totalExpenses }) {

  const data = [
    { name: 'Total Income', value: totalIncome },
    { name: 'Total Expenses', value: totalExpenses },
  ];

  const COLORS = ['#FF6B35', '#7C3AED'];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Financial Overview</h2>
        <button
          className="px-4 py-2 bg-white/10 border border-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-all duration-300"
          onClick={() => alert('Category breakdown coming soon!')}
        >
          View Breakdown
        </button>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm text-gray-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-sm text-gray-500 mb-1">Total Balance</p>
          <p className="text-3xl font-bold text-white">£{totalBalance}</p>
        </div>
      </div>
    </div>
  );
}

export default FinancialOverview;