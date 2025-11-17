import React, { useContext } from "react";
import {
  X,
  MapPin,
  Navigation,
  Star,
  Clock,
  Users,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationContext } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function NotificationPopup() {
  const { notification, dismissNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  // Calculate distance text with proper units
  const getDistanceText = (distance) => {
    if (!distance) return "";
    if (distance < 1000) {
      return `${Math.round(distance)}m away`;
    }
    return `${(distance / 1000).toFixed(1)}km away`;
  };

  // Get category-specific colors and icons - Softer, friendlier colors
  const getCategoryInfo = (category) => {
    const categoryMap = {
      cultural: {
        color: "from-purple-400 to-purple-500",
        icon: "🏛️",
        bg: "bg-purple-100",
        text: "text-purple-800",
      },
      historical: {
        color: "from-amber-400 to-amber-500",
        icon: "🏰",
        bg: "bg-amber-100",
        text: "text-amber-800",
      },
      adventure: {
        color: "from-emerald-400 to-emerald-500",
        icon: "⛰️",
        bg: "bg-emerald-100",
        text: "text-emerald-800",
      },
      beach: {
        color: "from-sky-400 to-sky-500",
        icon: "🏝️",
        bg: "bg-sky-100",
        text: "text-sky-800",
      },
      food: {
        color: "from-orange-400 to-orange-500",
        icon: "🍴",
        bg: "bg-orange-100",
        text: "text-orange-800",
      },
      nature: {
        color: "from-green-400 to-green-500",
        icon: "🌿",
        bg: "bg-green-100",
        text: "text-green-800",
      },
    };
    return (
      categoryMap[category?.toLowerCase()] || {
        color: "from-blue-400 to-blue-500",
        icon: "📍",
        bg: "bg-blue-100",
        text: "text-blue-800",
      }
    );
  };

  const isMultipleSpot = () => {
    if (notification.spotsCount > 1) {
      return `${notification.spotsCount} spots nearby`;
    } else {
      return notification.spotName;
    }
  };

  const categoryInfo = getCategoryInfo(notification?.category);

  return (
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
          {/* Main Notification Card - Much softer design */}
          <div className="bg-white md:rounded-2xl shadow-2xl p-6 md:w-96 w-full border border-gray-100 backdrop-blur-sm relative overflow-hidden">
            {/* Subtle gradient accent line at top */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryInfo.color}`}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${categoryInfo.bg}`}>
                  <Compass size={20} className={categoryInfo.text} />
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-lg">
                    Discover Nearby
                  </span>
                  {notification.category && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs">{categoryInfo.icon}</span>
                      <span
                        className={`text-xs ${categoryInfo.text} font-medium capitalize`}
                      >
                        {notification.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={dismissNotification}
                className="hover:bg-gray-100 p-2 rounded-xl transition-all active:scale-95 group"
              >
                <X
                  size={18}
                  className="text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-transform"
                />
              </button>
            </div>

            {/* Spot Details */}
            <div className="space-y-4">
              {/* Spot Name */}
              {notification.spotName && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3">
                    {isMultipleSpot()}
                  </h3>

                  {/* Rating and Distance */}
                  <div className="flex items-center justify-between">
                    {notification.rating && (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star
                            size={16}
                            className="text-amber-400 fill-current"
                          />
                          <span className="font-semibold text-gray-900">
                            {notification.rating}
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          ({notification.reviewCount || "100+"} reviews)
                        </span>
                      </div>
                    )}

                    {notification.distance && (
                      <div className="bg-gray-100 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-gray-700">
                          {getDistanceText(notification.distance)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Spot Info */}
              <div className="grid grid-cols-2 gap-3">
                {notification.duration && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                    <Clock size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">
                      {notification.duration}
                    </span>
                  </div>
                )}

                {notification.popularity && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
                    <Users size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700 font-medium">
                      {notification.popularity}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {notification.description && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {notification.description}
                  </p>
                </div>
              )}

              {/* Spots Count */}
              {notification.spotsCount && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-600">
                    Total nearby spots
                  </span>
                  <span className="font-bold text-gray-900 text-lg">
                    {notification.spotsCount}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons - Softer colors */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  dismissNotification();
                  navigate("/main/discover");
                }}
                className={`flex-1 bg-gradient-to-r ${categoryInfo.color} text-white hover:shadow-lg font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2`}
              >
                <Navigation size={18} />
                Explore
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold py-3 px-4 rounded-xl transition-all active:scale-95 border border-gray-200">
                Save
              </button>
            </div>

            {/* Progress Indicator for Multiple Spots */}
            {notification.spotsCount > 1 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>More spots nearby</span>
                  <span>
                    {Math.min(
                      notification.currentSpotIndex || 1,
                      notification.spotsCount
                    )}
                    /{notification.spotsCount}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-500 bg-gradient-to-r ${categoryInfo.color}`}
                    style={{
                      width: `${
                        ((notification.currentSpotIndex || 1) /
                          notification.spotsCount) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Friendly decorative element */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 opacity-5">
              <Compass size={80} className="text-gray-400" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
