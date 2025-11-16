import React, { useState, useEffect } from "react";
import BottomNavBar from "../NavBar/BottomNavBar";
import DesktopSidebar from "../NavBar/DesktopSidebar";
import NotificationPopup from "../NotificationPopup";
import AIIcon from "../AIChatbot/AIIcon";

export default function MainLayout({ children }) {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Notification Popup - Global */}
      <NotificationPopup />

      {/* Sidebar - Fixed and separate from content flow */}
      <div className="hidden md:block">
        <DesktopSidebar />
      </div>

      {/* Main Content - Add left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {" "}
        {/* Added md:ml-64 */}
        <div className="flex-1 overflow-auto">
          <div className="md:pb-0">{children}</div>
        </div>
        {/* Bottom Navbar - Hidden on desktop, visible on mobile */}
        <div className="block md:hidden">
          <AIIcon />
          <BottomNavBar onVisibilityChange={setIsBottomNavVisible} />
        </div>
      </div>

      {/* Add CSS for dynamic positioning */}
      <style jsx>{`
        .bottom-navbar-aware {
          bottom: ${isBottomNavVisible ? "6rem" : "1.5rem"};
          transition: bottom 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
