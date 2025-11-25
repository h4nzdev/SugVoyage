import React, { useState } from "react";
import {
  Plus,
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  Layers,
  Share2,
  Users,
  Download,
  TrendingUp,
  Plane,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TravelHubDesktop = ({
  activeTab,
  setActiveTab,
  userTrips,
  loading,
  flightDeals,
  quickActions,
  onRefresh,
  calculateTotalActivities,
}) => {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [flightSchedule, setFlightSchedule] = useState({
    departureDate: "",
    returnDate: "",
    preferredTime: "morning",
    airline: "",
    flightNumber: "",
    notes: "",
  });

  const TripCard = ({ trip }) => {
    const totalActivities = calculateTotalActivities(trip);
    const completedActivities = trip.progress?.completedActivities || 0;
    const completionPercentage = trip.progress?.completionPercentage || 0;
    const navigate = useNavigate();

    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-xl mb-2">
              {trip.title}
            </h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">{trip.duration?.days || 0} days</span>
              </div>
              <div className="flex items-center text-gray-500">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{totalActivities} activities</span>
              </div>
            </div>
          </div>
          <div className="bg-red-50 px-4 py-2 rounded-full">
            <span className="text-red-700 font-bold">
              {trip.budget?.total || "Flexible budget"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {completedActivities} of {totalActivities} activities completed (
            {completionPercentage}%)
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => navigate(`/main/travelhub-details/${trip._id}`)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl mr-3 transition-all duration-200 hover:scale-105"
          >
            <span className="font-semibold">
              {completionPercentage === 100 ? "View Trip" : "Continue Planning"}
            </span>
          </button>
          <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110">
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  const FlightCard = ({ flight }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-xl mb-1">
            {flight.airline}
          </h3>
          <p className="text-gray-500 text-lg">{flight.route}</p>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-full group-hover:scale-105 transition-transform">
          <span className="text-green-700 font-bold text-xl">
            {flight.price}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{flight.duration}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Layers className="w-4 h-4 mr-2" />
            <span className="text-sm">{flight.stops}</span>
          </div>
        </div>
        <span className="text-gray-500 text-sm">{flight.date}</span>
      </div>
    </div>
  );

  const handleScheduleInput = (field, value) => {
    setFlightSchedule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSchedule = () => {
    console.log("📅 Flight Schedule Details:", flightSchedule);

    // Here you would typically save to your database
    // For now, we'll just log and close the modal
    alert("Flight schedule added! Check console for details.");

    // Reset form and close modal
    setFlightSchedule({
      departureDate: "",
      returnDate: "",
      preferredTime: "morning",
      airline: "",
      flightNumber: "",
      notes: "",
    });
    setShowScheduleModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">
                Travel Hub
              </h1>
              <p className="text-red-600 text-xl font-semibold">
                Your All-in-One Travel Planning Center
              </p>
            </div>
            <button
              onClick={onRefresh}
              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex bg-white border-b border-gray-200">
        <button
          onClick={() => setActiveTab("planner")}
          className={`flex-1 py-6 text-center border-b-2 text-lg font-semibold transition-all duration-200 ${
            activeTab === "planner"
              ? "border-red-600 text-red-600 bg-red-50"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Trip Planner
        </button>
        <button
          onClick={() => setActiveTab("flights")}
          className={`flex-1 py-6 text-center border-b-2 text-lg font-semibold transition-all duration-200 ${
            activeTab === "flights"
              ? "border-red-600 text-red-600 bg-red-50"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Flights & Deals
        </button>
      </div>

      <div className="p-8">
        {activeTab === "planner" ? (
          /* TRIP PLANNER TAB - FULL WIDTH GRID! */
          <div>
            {/* Quick Actions */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className="text-left group"
                  >
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                        style={{ backgroundColor: `${action.color}15` }}
                      >
                        {action.icon === "plus-circle" && (
                          <Plus
                            className="w-7 h-7"
                            style={{ color: action.color }}
                          />
                        )}
                        {action.icon === "download" && (
                          <Download
                            className="w-7 h-7"
                            style={{ color: action.color }}
                          />
                        )}
                        {action.icon === "users" && (
                          <Users
                            className="w-7 h-7"
                            style={{ color: action.color }}
                          />
                        )}
                        {action.icon === "trending-up" && (
                          <TrendingUp
                            className="w-7 h-7"
                            style={{ color: action.color }}
                          />
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-2">
                        {action.title}
                      </h3>
                      <p className="text-gray-500 text-sm">{action.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                My Itineraries
              </h2>
              <button
                onClick={onRefresh}
                className="text-red-600 hover:text-red-700 font-semibold text-lg transition-colors"
              >
                {loading ? "Loading..." : "Refresh All"}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <span className="text-gray-500 text-xl">
                    Loading your amazing trips...
                  </span>
                </div>
              </div>
            ) : userTrips.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center border border-gray-200 shadow-sm">
                <MapPin className="w-24 h-24 text-gray-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  No trips planned yet
                </h3>
                <p className="text-gray-500 text-xl mb-8 max-w-2xl mx-auto">
                  Start your Cebu adventure! Create your first itinerary and let
                  AI help you plan the perfect trip.
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 rounded-xl text-xl font-semibold transition-all duration-200 hover:scale-105 inline-flex items-center gap-3">
                  <Plus className="w-6 h-6" />
                  Create Your First Trip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                {userTrips.map((trip) => (
                  <TripCard key={trip._id} trip={trip} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* FLIGHTS TAB - FULL WIDTH! 🚀 */
          <div className="grid grid-cols-3 gap-8">
            {/* Flight Search - Sidebar */}
            <div className="col-span-1">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-8">
                <h2 className="font-bold text-gray-900 text-2xl mb-6">
                  Find Flights
                </h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">
                      From
                    </label>
                    <div className="bg-gray-100 rounded-xl px-4 py-3">
                      <p className="text-gray-900 text-lg font-medium">
                        Manila (MNL)
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm mb-2 block">
                      To
                    </label>
                    <div className="bg-gray-100 rounded-xl px-4 py-3">
                      <p className="text-gray-900 text-lg font-medium">
                        Cebu (CEB)
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl w-full text-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3 mb-4"
                >
                  <Calendar className="w-5 h-5" />
                  Add Flight Schedule
                </button>

                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl w-full text-lg font-semibold transition-all duration-200 hover:scale-105 flex items-center justify-center gap-3">
                  <Search className="w-5 h-5" />
                  Search Flights
                </button>

                {/* Quick Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Flight Insights
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Best Time to Book</span>
                      <span className="font-semibold text-gray-900">
                        2-3 months ahead
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Price</span>
                      <span className="font-semibold text-gray-900">
                        ₱1,800
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Popular Airlines</span>
                      <span className="font-semibold text-gray-900">
                        Cebu Pacific
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flight Deals - Main Content */}
            <div className="col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Best Flight Deals to Cebu
              </h2>

              <div className="grid grid-cols-2 gap-6">
                {flightDeals.map((flight) => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>

              {/* Additional Flight Info */}
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mt-8">
                <div className="flex items-center gap-4 mb-4">
                  <Plane className="w-8 h-8 text-red-600" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Why Fly to Cebu?
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ✈️ Direct Flights Available
                    </h4>
                    <p className="text-gray-600">
                      Multiple daily flights from major Philippine cities and
                      international destinations.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      💰 Budget-Friendly Options
                    </h4>
                    <p className="text-gray-600">
                      Regular promos and seat sales make Cebu accessible for
                      every budget.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Flight Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Add Flight Schedule
                </h2>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    value={flightSchedule.departureDate}
                    onChange={(e) =>
                      handleScheduleInput("departureDate", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Return Date
                  </label>
                  <input
                    type="date"
                    value={flightSchedule.returnDate}
                    onChange={(e) =>
                      handleScheduleInput("returnDate", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Time
                  </label>
                  <select
                    value={flightSchedule.preferredTime}
                    onChange={(e) =>
                      handleScheduleInput("preferredTime", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="morning">Morning (6AM - 12PM)</option>
                    <option value="afternoon">Afternoon (12PM - 6PM)</option>
                    <option value="evening">Evening (6PM - 12AM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Airline (Optional)
                  </label>
                  <input
                    type="text"
                    value={flightSchedule.airline}
                    onChange={(e) =>
                      handleScheduleInput("airline", e.target.value)
                    }
                    placeholder="e.g., Cebu Pacific, Philippine Airlines"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flight Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={flightSchedule.flightNumber}
                    onChange={(e) =>
                      handleScheduleInput("flightNumber", e.target.value)
                    }
                    placeholder="e.g., 5J 123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={flightSchedule.notes}
                    onChange={(e) =>
                      handleScheduleInput("notes", e.target.value)
                    }
                    placeholder="Any special requirements or notes..."
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSchedule}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                >
                  Add Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelHubDesktop;
