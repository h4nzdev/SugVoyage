import React from "react";
import {
  X,
  Calendar,
  MapPin,
  DollarSign,
  Download,
  Loader,
} from "lucide-react";

const TripPreviewModal = ({ tripData, onSave, loading, visible, onClose }) => {
  if (!visible || !tripData) return null;

  // Calculate total activities
  const totalActivities =
    tripData?.days?.reduce((total, day) => {
      const activities = day.activities || [];
      return total + activities.length;
    }, 0) || 0;

  // Safe data access functions
  const getDayActivities = (day) => {
    if (!day) return [];
    if (Array.isArray(day.activities)) {
      return day.activities;
    }
    return [];
  };

  const getActivityName = (activity) => {
    if (typeof activity === "string") return activity;
    if (activity && typeof activity === "object") {
      return activity.name || "Activity";
    }
    return "Activity";
  };

  const getActivityTime = (activity) => {
    if (typeof activity === "string") return "";
    if (activity && typeof activity === "object") {
      return activity.time || "";
    }
    return "";
  };

  const getActivityCost = (activity) => {
    if (typeof activity === "string") return "";
    if (activity && typeof activity === "object") {
      return activity.cost || "";
    }
    return "";
  };

  // FIX: Properly handle duration object
  const getDurationText = () => {
    if (!tripData.duration) return "0 days";

    if (typeof tripData.duration === "object") {
      const { days, nights } = tripData.duration;
      if (days && nights) {
        return `${days} days, ${nights} nights`;
      } else if (days) {
        return `${days} days`;
      }
    }

    return String(tripData.duration || "0 days");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                Trip Preview
              </h2>
              <p className="text-red-600 text-sm font-medium">
                Review your itinerary before saving
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <X size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Trip Header */}
          <div className="bg-red-50 rounded-2xl p-6 mb-6 border border-red-100">
            <h3 className="text-xl font-black text-gray-900 mb-2">
              {tripData.title || "Untitled Trip"}
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <Calendar size={16} className="text-red-600 mr-2" />
                <span className="text-gray-600 text-sm">
                  {getDurationText()}{" "}
                  {/* FIXED: Using function instead of direct object */}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="text-red-600 mr-2" />
                <span className="text-gray-600 text-sm">
                  {totalActivities} activities
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign size={16} className="text-red-600 mr-2" />
                <span className="text-gray-600 text-sm">
                  {typeof tripData.budget === "object"
                    ? tripData.budget.total
                    : tripData.budget || "Flexible"}
                </span>
              </div>
            </div>
          </div>

          {/* Itinerary */}
          <h4 className="text-lg font-black text-gray-900 mb-4">
            Daily Itinerary
          </h4>

          {tripData.days && tripData.days.length > 0 ? (
            <div className="space-y-4">
              {tripData.days.map((day, index) => {
                const activities = getDayActivities(day);

                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-gray-200 p-6"
                  >
                    {/* Day Header */}
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-black text-gray-900 text-base">
                          Day {index + 1}
                        </h5>
                        <p className="text-red-600 font-medium text-sm">
                          {day.theme || `Day ${index + 1} Activities`}
                        </p>
                      </div>
                    </div>

                    {/* Activities */}
                    <div className="space-y-4">
                      {activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex">
                          {/* Timeline */}
                          <div className="relative mr-4 flex flex-col items-center">
                            <div className="w-2.5 h-2.5 bg-red-600 rounded-full mt-2 z-10" />
                            {activityIndex < activities.length - 1 && (
                              <div className="absolute top-4 left-1 w-0.5 h-8 bg-gray-300" />
                            )}
                          </div>

                          {/* Activity Content */}
                          <div className="flex-1 pb-4 border-b border-gray-100 last:border-b-0">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-gray-900 text-sm flex-1">
                                {getActivityName(activity)}
                              </span>
                              <span className="text-gray-500 text-xs">
                                {getActivityTime(activity)}
                              </span>
                            </div>

                            {getActivityCost(activity) && (
                              <div className="flex items-center mt-1">
                                <span className="text-gray-500 text-xs">
                                  {getActivityCost(activity)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col items-center">
              <Calendar size={48} className="text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg text-center">
                No itinerary available
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 mb-4">
            <button
              onClick={onClose}
              className="flex-1 bg-white border border-gray-300 py-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-700 font-semibold text-base">
                Cancel
              </span>
            </button>
            <button
              onClick={() => onSave(tripData)}
              disabled={loading}
              className={`flex-1 py-4 rounded-xl flex items-center justify-center transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {loading ? (
                <Loader size={20} className="text-white animate-spin" />
              ) : (
                <Download size={20} className="text-white" />
              )}
              <span className="text-white font-semibold text-base ml-2">
                {loading ? "Saving..." : "Save Trip"}
              </span>
            </button>
          </div>

          <p className="text-gray-400 text-xs text-center">
            ✨ This itinerary will be saved to your Travel Hub
          </p>
        </div>
      </div>
    </div>
  );
};

export default TripPreviewModal;
