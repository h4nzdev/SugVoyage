import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNavBar from "../NavBar/BottomNavBar";
import DesktopSidebar from "../NavBar/DesktopSidebar";
import NotificationPopup from "../NotificationPopup";
import AIIcon from "../AIChatbot/AIIcon";
import { useSpotSocketNotification } from "../../hooks/useSpotSocketNotification";
import { useUserLocation } from "../../context/UserLocationContext";

export default function MainLayout({ children }) {
  const [isBottomNavVisible, setIsBottomNavVisible] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const { userLocation } = useUserLocation();

  const { connected } = useSpotSocketNotification(
    !showSplash ? userLocation : null,
    5000
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 bg-red-500 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo Placeholder - Easy to replace with actual logo */}
            <motion.div
              className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg border border-white"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            >
              <img src="/logo.png" alt="SugVoyage" className="w-24 h-24" />
            </motion.div>

            {/* Loader */}
            <motion.div
              className="w-16 h-16 border-4 border-white border-t-transparent rounded-full mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />

            {/* Greetings & App Name */}
            <motion.h1
              className="text-4xl font-bold text-white text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Welcome to
            </motion.h1>
            <motion.h2
              className="text-5xl font-bold text-white mt-2 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              SugVoyage
            </motion.h2>
            <motion.p
              className="text-white text-lg mt-4 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Your Ultimate Trip Buddy
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest of your existing layout with fade-in effect */}
      <NotificationPopup />

      <div className="hidden md:block">
        <DesktopSidebar />
      </div>

      {/* Prevent scrollbar flash by hiding overflow on main container */}
      <div
        className={`flex-1 flex flex-col min-w-0 md:ml-64 ${
          showSplash ? "overflow-hidden" : ""
        }`}
      >
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {!showSplash && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full"
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {!showSplash && (
          <div className="block md:hidden">
            <AIIcon />
            <BottomNavBar onVisibilityChange={setIsBottomNavVisible} />
          </div>
        )}
      </div>

      <style jsx>{`
        .bottom-navbar-aware {
          bottom: ${isBottomNavVisible ? "6rem" : "1.5rem"};
          transition: bottom 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
