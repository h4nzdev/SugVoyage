// components/NotificationPopup/NotificationPopup.jsx
import React, { useState, useContext } from "react";
import { X, MapPin, Navigation, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationContext } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import SpotStories from "./SpotStories/SpotStories";

export default function NotificationPopup() {
  const { notification, dismissNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [showStory, setShowStory] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState("");

  const handleLearnStory = () => {
    if (notification.spotName) {
      setSelectedSpot(notification.spotName);
      setShowStory(true);
      dismissNotification();
    }
  };

  const closeStory = () => {
    setShowStory(false);
    setSelectedSpot("");
  };

  const isMultipleSpot = () => {
    if (notification.spotsCount > 1) {
      return `${notification.spotsCount} spots detected nearby`;
    } else {
      return notification.spotName;
    }
  };

  // Get category-specific colors - Using your original colors
  const getCategoryInfo = (category) => {
    const categoryMap = {
      cultural: {
        color: "from-purple-400 to-purple-500",
        bg: "bg-purple-100",
        text: "text-purple-800",
      },
      historical: {
        color: "from-amber-400 to-amber-500",
        bg: "bg-amber-100",
        text: "text-amber-800",
      },
      adventure: {
        color: "from-emerald-400 to-emerald-500",
        bg: "bg-emerald-100",
        text: "text-emerald-800",
      },
      beach: {
        color: "from-sky-400 to-sky-500",
        bg: "bg-sky-100",
        text: "text-sky-800",
      },
      food: {
        color: "from-orange-400 to-orange-500",
        bg: "bg-orange-100",
        text: "text-orange-800",
      },
      nature: {
        color: "from-green-400 to-green-500",
        bg: "bg-green-100",
        text: "text-green-800",
      },
    };
    return (
      categoryMap[category?.toLowerCase()] || {
        color: "from-blue-400 to-blue-500",
        bg: "bg-blue-100",
        text: "text-blue-800",
      }
    );
  };

  const categoryInfo = getCategoryInfo(notification?.category);

  return (
    <>
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: 400, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, y: -20, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              duration: 0.3,
            }}
            className="fixed md:top-4 flex items-end justify-end z-[9999] w-full"
          >
            {/* Main Notification Card */}
            <div className="bg-white md:rounded-2xl shadow-2xl p-6 md:w-96 w-full border border-gray-100 backdrop-blur-sm relative overflow-hidden">
              {/* Gradient accent line - Using original colors */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryInfo.color}`}
              />

              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${categoryInfo.bg}`}>
                    <MapPin size={20} className={categoryInfo.text} />
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 text-lg">
                      Nearby Discovery
                    </span>
                    <div className="text-sm text-gray-500 mt-1">
                      {notification.spotsCount > 1
                        ? `${notification.spotsCount} spots nearby`
                        : "New spot detected"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={dismissNotification}
                  className="hover:bg-gray-100 p-2 rounded-xl transition-all group"
                >
                  <X
                    size={18}
                    className="text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-transform"
                  />
                </button>
              </div>

              {/* Spot Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {isMultipleSpot()}
                </h3>

                <p className="text-gray-600">
                  {notification.spotsCount > 1
                    ? "Would you like to learn the stories behind these fascinating places?"
                    : "Would you like to learn the story behind this fascinating place?"}
                </p>
              </div>

              {/* Action Buttons - Using original gradient colors */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleLearnStory}
                  className={`flex-1 bg-gradient-to-r ${categoryInfo.color} text-white hover:shadow-lg font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2`}
                >
                  <Sparkles size={18} />
                  Learn Story
                </button>
                <button
                  onClick={() => {
                    dismissNotification();
                    navigate("/main/discover");
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 border border-gray-200 flex items-center justify-center gap-2"
                >
                  <Navigation size={18} />
                  Explore
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spot Stories Modal */}
      <SpotStories
        spot={selectedSpot}
        isOpen={showStory}
        onClose={closeStory}
        categoryInfo={categoryInfo}
      />
    </>
  );
}
