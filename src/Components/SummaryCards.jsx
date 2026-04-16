import { MdAccountBalance } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";

function SummaryCards({ totalBalance, totalIncome, totalExpenses }){
  return (
    <div className="grid grid-cols-3 gap-6 mb-6">

      <div className="bg-[rgba(200,150,160,0.03)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6 hover:bg-[rgba(200,150,160,0.06)] transition-all duration-300">
        <p className="text-sm text-[rgba(240,232,234,0.4)] mb-2">Total Balance</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold font-mono tracking-tight text-[#f0e8ea]">
            £{(totalBalance || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </p>
          <MdAccountBalance className="text-5xl text-white" />
        </div>
      </div>

      <div className="bg-[rgba(138,184,160,0.04)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6 hover:bg-[rgba(138,184,160,0.08)] transition-all duration-300">
        <p className="text-sm text-[rgba(240,232,234,0.4)] mb-2">Total Income</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold font-mono tracking-tight text-[#8ab8a0]">
            £{(totalIncome || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </p>
          <IoWalletOutline className="text-5xl text-white" />
        </div>
      </div>

      <div className="bg-[rgba(208,136,136,0.04)] border border-[rgba(200,150,160,0.08)] rounded-2xl p-6 hover:bg-[rgba(208,136,136,0.08)] transition-all duration-300">
        <p className="text-sm text-[rgba(240,232,234,0.4)] mb-2">Total Expenses</p>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold font-mono tracking-tight text-[#d08888]">
            £{(totalExpenses || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
          </p>
          <BsCashCoin className="text-5xl text-white" />
        </div>
      </div>

    </div>
  );
}

export default SummaryCards;