import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  DollarSign,
  Users,
  Calculator,
  Cpu,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Circle,
  Plus,
  Book,
  Coffee,
  Trees,
  Trophy,
  Zap,
  Truck,
  MapPin,
} from "lucide-react";
import { TripPlanService } from "../../../services/tripPlanService";
import EditTripModal from "./EditTripModal"; // Import the edit modal
import { useReminder } from "../../../context/ReminderContext";
import CreateTripModal from "./CreateTripModal";

export default function TripDetails() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updatingActivity, setUpdatingActivity] = useState(null);
  const navigate = useNavigate();

  const [isCreateModal, setIsCreateModal] = useState(false);

  const { tripId } = useParams();
  const { monitorTrip } = useReminder();

  const colors = {
    primary: "#DC143C",
    secondary: "#FFF8DC",
    background: "#FFFFFF",
    text: "#2D3748",
    muted: "#718096",
    light: "#F7FAFC",
  };

  useEffect(() => {
    if (tripId) {
      loadTripDetails();
    }
  }, [tripId]);

  useEffect(() => {
    if (trip) {
      monitorTrip(trip);

      const interval = setInterval(() => {
        monitorTrip(trip);
      }, 5000);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }
  }, [trip, monitorTrip]);

  const loadTripDetails = async () => {
    try {
      setLoading(true);
      const result = await TripPlanService.getTripById(tripId);

      if (result.success) {
        setTrip(result.trip);
      } else {
        alert("Error: Trip not found");
        navigate(-1);
      }
    } catch (error) {
      console.error("❌ Error loading trip details:", error);
      alert("Error: Failed to load trip details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActivity = async (dayIndex, activityIndex) => {
    const activity = trip.days[dayIndex].activities[activityIndex];
    const activityId = `${dayIndex}-${activityIndex}`;

    console.log("🖱️ Toggle clicked for:", {
      dayIndex,
      activityIndex,
      activityId,
      currentStatus: activity.isCompleted,
      tripId,
    });

    try {
      setUpdatingActivity(activityId);

      if (!activity.isCompleted) {
        console.log("🔄 Marking as completed via API...");

        const result = await TripPlanService.markActivityCompleted(
          tripId,
          dayIndex,
          activityIndex
        );

        console.log("📡 API Response:", result);

        if (result.success) {
          // Update local state
          setTrip((prevTrip) => {
            const newDays = [...prevTrip.days];
            newDays[dayIndex].activities[activityIndex].isCompleted = true;

            // Recalculate progress
            const totalActivities = newDays.reduce(
              (total, day) => total + day.activities.length,
              0
            );
            const completedActivities = newDays.reduce(
              (total, day) =>
                total + day.activities.filter((act) => act.isCompleted).length,
              0
            );

            return {
              ...prevTrip,
              days: newDays,
              progress: {
                plannedActivities: totalActivities,
                completedActivities: completedActivities,
                completionPercentage: Math.round(
                  (completedActivities / totalActivities) * 100
                ),
              },
            };
          });
        } else {
          throw new Error(result.message);
        }
      } else {
        // Mark as incomplete - we'll use the updateTrip method
        const updatedTrip = { ...trip };
        updatedTrip.days[dayIndex].activities[
          activityIndex
        ].isCompleted = false;

        const result = await TripPlanService.updateTrip(tripId, updatedTrip);

        if (result.success) {
          setTrip(result.trip);
        } else {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      console.error("❌ Error updating activity:", error);
      alert("Failed to update activity status");
    } finally {
      setUpdatingActivity(null);
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Flexible time";
    return timeString;
  };

  // Replace the getCategoryIcon function with this:
  const getCategoryIcon = (category) => {
    const iconProps = {
      size: 20,
      className: "text-current",
    };

    switch (category) {
      case "historical":
        return <Book {...iconProps} />;
      case "food":
        return <Coffee {...iconProps} />;
      case "nature":
        return <Trees {...iconProps} />;
      case "cultural":
        return <Trophy {...iconProps} />;
      case "adventure":
        return <Zap {...iconProps} />;
      case "transport":
        return <Truck {...iconProps} />;
      default:
        return <MapPin {...iconProps} />;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      historical: "#F59E0B",
      food: "#EF4444",
      nature: "#10B981",
      cultural: "#8B5CF6",
      adventure: "#DC2626",
      transport: "#6366F1",
      default: "#6B7280",
    };
    return colors[category] || colors.default;
  };

  const calculateTotalCost = () => {
    if (!trip?.days) return "₱0";

    let total = 0;
    trip.days.forEach((day) => {
      day.activities.forEach((activity) => {
        const cost = activity.cost;
        if (cost && cost !== "Free") {
          const numericValue = cost.match(/₱?([0-9,]+)/);
          if (numericValue) {
            total += parseInt(numericValue[1].replace(/,/g, ""));
          }
        }
      });
    });

    return `₱${total.toLocaleString()}`;
  };

  const handleSaveTrip = async (updatedTrip) => {
    try {
      const result = await TripPlanService.updateTrip(tripId, updatedTrip);
      if (result.success) {
        setTrip(result.trip);
        alert("Trip updated successfully!");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating trip:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-gray-400 mx-auto" />
          <p className="text-gray-500 mt-4 text-lg">Trip not found</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 py-3 px-6 rounded-xl mt-4 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-4 pb-4 px-4 md:px-6 border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-black text-gray-900">
                {trip.title}
              </h1>
              <p className="text-red-600 text-sm font-semibold">
                {trip.duration?.days || 0} Days • {trip.duration?.nights || 0}{" "}
                Nights
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button
              onClick={loadTripDetails}
              className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <RefreshCw size={20} className="text-gray-700" />
            </button>
            <button
              onClick={() => setIsCreateModal(true)}
              className="p-2 bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
            >
              <Plus size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="md:mx-8 mx-4 py-6">
        {/* Trip Overview */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Trip Overview
            </h2>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Trip Progress</span>
                <span className="text-red-600 font-semibold">
                  {trip.progress?.completionPercentage || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-600 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${trip.progress?.completionPercentage || 0}%`,
                  }}
                />
              </div>
              <p className="text-gray-500 text-sm mt-2">
                {trip.progress?.completedActivities || 0} of{" "}
                {trip.progress?.plannedActivities || 0} activities completed
              </p>
            </div>

            {/* Trip Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <DollarSign size={16} className="text-gray-500" />
                  <span className="text-gray-500 text-sm ml-2">Budget</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {trip.budget?.total || "Flexible"}
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Users size={16} className="text-gray-500" />
                  <span className="text-gray-500 text-sm ml-2">Travelers</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {trip.travelers
                    ? `${trip.travelers.adults} Adult${
                        trip.travelers.adults !== 1 ? "s" : ""
                      }${
                        trip.travelers.children > 0
                          ? `, ${trip.travelers.children} Child${
                              trip.travelers.children !== 1 ? "ren" : ""
                            }`
                          : ""
                      }${
                        trip.travelers.seniors > 0
                          ? `, ${trip.travelers.seniors} Senior${
                              trip.travelers.seniors !== 1 ? "s" : ""
                            }`
                          : ""
                      }`
                    : "Solo"}
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Calculator size={16} className="text-gray-500" />
                  <span className="text-gray-500 text-sm ml-2">Total Cost</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {calculateTotalCost()}
                </p>
              </div>

              <div>
                <div className="flex items-center mb-2">
                  <Cpu size={16} className="text-gray-500" />
                  <span className="text-gray-500 text-sm ml-2">Generated</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {trip.generatedByAI ? "AI Planned" : "Manual"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Days Navigation & Activities */}
        {trip.days && trip.days.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Itinerary
            </h2>

            {/* Day Themes - Horizontal Scroll for Mobile */}
            <div className="mb-6">
              <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
                {trip.days.map((day, index) => (
                  <button
                    key={day._id?.$oid || index}
                    onClick={() => setActiveDay(index)}
                    className={`px-4 py-3 rounded-xl min-w-[140px] flex-shrink-0 transition-colors ${
                      activeDay === index
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <span className="font-bold text-center block">
                      Day {index + 1}
                    </span>
                    <span
                      className={`text-xs text-center mt-1 block ${
                        activeDay === index ? "text-red-100" : "text-gray-500"
                      }`}
                    >
                      {day.theme}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Day Activities */}
            <div className="bg-white rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm">
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 text-xl">
                  Day {activeDay + 1}
                </h3>
                <p className="text-red-600 font-medium">
                  {trip.days[activeDay]?.theme}
                </p>
              </div>

              {trip.days[activeDay]?.activities?.length > 0 ? (
                <div className="space-y-6">
                  {trip.days[activeDay].activities.map((activity, index) => {
                    const activityId = `${activeDay}-${index}`;
                    const isUpdating = updatingActivity === activityId;

                    return (
                      <div
                        key={activity._id?.$oid || index}
                        className="flex items-start"
                      >
                        {/* Timeline */}
                        <div className="relative mr-4 flex-shrink-0">
                          <div
                            className="w-3 h-3 rounded-full mt-2"
                            style={{
                              backgroundColor: getCategoryColor(
                                activity.category
                              ),
                            }}
                          />
                          {index <
                            trip.days[activeDay].activities.length - 1 && (
                            <div className="absolute top-5 left-1.5 w-0.5 h-16 bg-gray-300" />
                          )}
                        </div>

                        {/* Activity Content */}
                        <div className="flex-1 bg-gray-50 rounded-xl p-4">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1">
                              <button
                                onClick={() =>
                                  handleToggleActivity(activeDay, index)
                                }
                                disabled={isUpdating}
                                className={`flex-shrink-0 mt-1 transition-all ${
                                  isUpdating
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:scale-110"
                                }`}
                              >
                                {activity.isCompleted ? (
                                  <CheckCircle
                                    size={24}
                                    className="text-green-500 "
                                  />
                                ) : (
                                  <Circle
                                    size={24}
                                    className="text-gray-400 hover:text-green-500"
                                  />
                                )}
                              </button>

                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{
                                  backgroundColor: `${getCategoryColor(
                                    activity.category
                                  )}20`,
                                }}
                              >
                                <span
                                  style={{
                                    color: getCategoryColor(activity.category),
                                  }}
                                >
                                  {getCategoryIcon(activity.category)}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h4
                                  className={`font-semibold text-gray-900 text-lg mb-1 ${
                                    activity.isCompleted
                                      ? "line-through text-gray-500"
                                      : ""
                                  }`}
                                >
                                  {activity.name}
                                </h4>
                                <div className="flex items-center text-gray-500">
                                  <Clock size={14} className="mr-1" />
                                  <span className="text-sm">
                                    {activity.time} • {activity.duration}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  activity.cost === "Free"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {activity.cost}
                              </div>
                              <div
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  activity.isCompleted
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {isUpdating
                                  ? "Updating..."
                                  : activity.isCompleted
                                  ? "Completed"
                                  : "Pending"}
                              </div>
                            </div>
                          </div>

                          {/* Category */}
                          <div className="mt-3">
                            <span className="bg-gray-200 px-3 py-1 rounded-full text-gray-700 text-sm font-medium capitalize">
                              {activity.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar size={32} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No activities planned for this day
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 bg-red-600 py-3 rounded-xl text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Edit Trip
          </button>
          <button className="flex-1 bg-white border border-gray-300 py-3 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
            Share Trip
          </button>
        </div>
      </div>

      {/* Edit Trip Modal */}
      <EditTripModal
        trip={trip}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveTrip}
      />

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={isCreateModal}
        onClose={() => setIsCreateModal(false)}
      />
    </div>
  );
}
