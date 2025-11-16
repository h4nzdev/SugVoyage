import React, { useContext } from "react";
import { Search, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "../../context/AuthenticationContext";

const MainHeader = () => {
  const { user } = useContext(AuthenticationContext);
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-white shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <span className="ml-2 text-xl font-bold text-gray-900">
          {user?.username}
        </span>
      </div>

      {/* Search Bar - Hidden on mobile, visible on desktop */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search attractions..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>
        <Link
          to="/main/profile"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <User className="w-5 h-5 text-gray-600" />
        </Link>
      </div>
    </div>
  );
};

export default MainHeader;
