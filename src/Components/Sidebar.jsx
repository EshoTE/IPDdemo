import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SIDE_MENU_DATA } from "../utils/data";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    
    // Navigate to the route
    navigate(route);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    window.location.reload();
  };

  // Determine active menu based on current path
  const getActiveMenu = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/income') return 'Income';
    if (location.pathname === '/expense') return 'Expense';
    return 'Dashboard';
  };

  const activeMenu = getActiveMenu();

  return (
    <div className="w-64 h-[calc(100vh-80px)] bg-white border-r border-gray-200/50 p-5 sticky top-20 z-20">
      
      {/* User Profile Section */}
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center">
          <span className="text-3xl">👤</span>
        </div>
        <h5 className="text-gray-950 font-medium leading-6">
          Your Name
        </h5>
      </div>

      {/* Menu Items */}
      {SIDE_MENU_DATA.map((item, index) => (
        <button
          key={`menu_${index}`}
          className={`w-full flex items-center gap-4 text-base ${
            activeMenu === item.label ? "text-white bg-purple-600" : "text-gray-700 hover:bg-purple-100 hover:text-purple-600"
          } py-3 px-6 rounded-lg mb-3 transition-colors`}
          onClick={() => handleClick(item.path)}
        >
          <item.icon className="text-xl" />
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;