import React, { useState, useEffect } from "react";
import { Home, Compass, Map, Users, Briefcase } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNavBar({ onVisibilityChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Check if we're on pages where we hide navbar
  const isMapPage = location.pathname.includes("/main/map");
  const isAIChatbotPage = location.pathname.includes("/main/ai-chatbot");
  const isProfilePage = location.pathname.includes("/main/profile");
  const isDetailedInfo = location.pathname.includes("/main/detailed-info");
  const shouldHideNavbar =
    isMapPage || isAIChatbotPage || isProfilePage || isDetailedInfo;

  // Notify parent component about visibility changes
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(shouldHideNavbar ? false : isVisible);
    }
  }, [isVisible, shouldHideNavbar, onVisibilityChange]);

  // Auto-hide navbar on scroll down, show on scroll up
  useEffect(() => {
    if (shouldHideNavbar) return; // Don't handle scroll if navbar is hidden

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, shouldHideNavbar]);

  const handleTabPress = (path) => {
    navigate(path);
  };

  // Don't show navbar on these pages
  if (shouldHideNavbar) {
    return null;
  }

  // ... rest of your component (tabs array, getActiveTab, etc.)
  const tabs = [
    { id: "home", icon: Home, label: "Home", path: "/main/home" },
    {
      id: "discover",
      icon: Compass,
      label: "Discover",
      path: "/main/discover",
    },
    { id: "map", icon: Map, label: "Map", path: "/main/map" },
    {
      id: "social-feed",
      icon: Users,
      label: "Social",
      path: "/main/social-feed",
    },
    {
      id: "travel-hub",
      icon: Briefcase,
      label: "TravelHub",
      path: "/main/travel-hub",
    },
  ];

  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/main/home")) return "home";
    if (path.includes("/main/discover")) return "discover";
    if (path.includes("/main/social-feed")) return "social-feed";
    if (path.includes("/main/travel-hub")) return "travel-hub";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-transparent pointer-events-none z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-lg py-2 shadow-lg border-t border-red-100 pointer-events-auto">
        <div className="flex justify-between items-center px-2">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            const isMapTab = tab.id === "map";

            return (
              <button
                key={tab.id}
                onClick={() => handleTabPress(tab.path)}
                className="flex flex-col items-center justify-center flex-1 relative group"
              >
                {/* Active indicator line at top */}
                {isActive && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-red-600 rounded-full transition-all duration-200" />
                )}

                <div
                  className={`flex items-center justify-center rounded-full transition-all duration-300 w-11 h-11 ${
                    isActive
                      ? isMapTab
                        ? "bg-red-600 scale-110"
                        : "bg-red-50"
                      : isMapTab
                      ? "bg-red-600 hover:bg-red-700 hover:scale-105"
                      : "hover:bg-gray-100 group-hover:scale-105"
                  }`}
                >
                  <IconComponent
                    size={22}
                    className={`transition-all duration-200 ${
                      isActive
                        ? isMapTab
                          ? "text-white"
                          : "text-red-600"
                        : isMapTab
                        ? "text-white"
                        : "text-gray-500 group-hover:text-red-600"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>

                {/* Label */}
                <span
                  className={`text-xs mt-1 transition-all duration-200 font-medium ${
                    isActive
                      ? "text-red-600 scale-105"
                      : "text-gray-500 group-hover:text-red-600"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
