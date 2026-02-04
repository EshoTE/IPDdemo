import { MdAccountBalance } from "react-icons/md";
import { IoWalletOutline } from "react-icons/io5";
import { BsCashCoin } from "react-icons/bs";

function SummaryCards({ totalBalance, totalIncome, totalExpenses }){
    return(
    <div className="grid grid-cols-3 gap-6 mb-6">
        
        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500 mb-2">Total Balance</p>
            
            <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-black">£{totalBalance}</p>
                <MdAccountBalance className="text-5xl text-black" />
            </div>
        </div>

        {/*Total Income */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500 mb-2">Total Income</p>

            <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-green-600">£{totalIncome}</p>
                <IoWalletOutline className="text-5xl text-black" />
            </div>
        </div>

        {/* Expenses Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-sm text-gray-500 mb-2">Total Expenses</p>

            <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-red-600">£{totalExpenses}</p>
                <BsCashCoin className="text-5xl text-black" />
            </div>
        </div>
        
    </div>
    );
}

export default SummaryCards