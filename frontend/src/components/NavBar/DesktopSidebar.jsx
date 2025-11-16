import React, { useContext } from "react";
import {
  Home,
  Compass,
  MessageCircle,
  Users,
  Briefcase,
  MapPin,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthenticationContext } from "../../context/AuthenticationContext";
import logo from "../../assets/logo.png";

export default function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthenticationContext);

  const menuItems = [
    { id: "home", icon: Home, label: "Home", path: "/main/home" },
    {
      id: "discover",
      icon: Compass,
      label: "Discover",
      path: "/main/discover",
    },
    {
      id: "ai-chatbot",
      icon: MessageCircle,
      label: "AI Chat",
      path: "/main/ai-chatbot",
    },
    {
      id: "social-feed",
      icon: Users,
      label: "Social Feed",
      path: "/main/social-feed",
    },
    {
      id: "travel-hub",
      icon: Briefcase,
      label: "Travel Hub",
      path: "/main/travel-hub",
    },
    { id: "map", icon: MapPin, label: "Map View", path: "/main/map" },
  ];

  const bottomMenuItems = [
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      path: "/main/settings",
    },
    { id: "logout", icon: LogOut, label: "Logout", path: "/logout" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleNavigation = (path) => {
    if (path === "/logout") {
      handleLogout();
    } else {
      navigate(path);
    }
  };

  const getUserInitial = () => {
    if (!user) return "U";
    return (
      user.displayName?.charAt(0)?.toUpperCase() ||
      user.username?.charAt(0)?.toUpperCase() ||
      "U"
    );
  };

  const getUserDisplayName = () => {
    if (!user) return "Guest User";
    return user.displayName || user.username || "User";
  };

  const getUserEmail = () => {
    if (!user) return "guest@example.com";
    return user.email || "user@example.com";
  };

  return (
    <div className="w-64 bg-white h-screen shadow-lg border-r border-gray-200 flex flex-col fixed">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <img src={logo} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">SugVoyage</h1>
            <p className="text-sm text-gray-500">Travel Guide</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 py-6 overflow-hidden">
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <IconComponent size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-gray-200">
        <nav className="space-y-2">
          {bottomMenuItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  active
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <IconComponent size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="mt-4 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-red-100">
          <div
            onClick={() => navigate("/main/profile")}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">
                {getUserInitial()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 truncate">{getUserEmail()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
