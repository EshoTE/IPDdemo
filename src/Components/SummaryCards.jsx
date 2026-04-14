import { MdAccountBalance } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";

function SummaryCards({ totalBalance, totalIncome, totalExpenses }){
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <p className="text-sm text-gray-500 mb-2">Total Balance</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-white">£{totalBalance}</p>
          <MdAccountBalance className="text-5xl text-gray-400" />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <p className="text-sm text-gray-500 mb-2">Total Income</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-green-400">£{totalIncome}</p>
          <IoWalletOutline className="text-5xl text-gray-400" />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
        <p className="text-sm text-gray-500 mb-2">Total Expenses</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold text-red-400">£{totalExpenses}</p>
          <BsCashCoin className="text-5xl text-gray-400" />
        </div>
      </div>

    </div>
  );
}

export default SummaryCards;