import React from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TravelHubMobile = ({
  activeTab,
  setActiveTab,
  userTrips,
  loading,
  flightDeals,
  quickActions,
  onRefresh,
  calculateTotalActivities,
}) => {
  const TripCard = ({ trip }) => {
    const totalActivities = calculateTotalActivities(trip);
    const completedActivities = trip.progress?.completedActivities || 0;
    const completionPercentage = trip.progress?.completionPercentage || 0;
    const navigate = useNavigate()

    return (
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-base mb-1">
              {trip.title}
            </h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-gray-500 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {trip.duration?.days || 0} days
              </div>
              <div className="flex items-center text-gray-500 text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {totalActivities} activities
              </div>
            </div>
          </div>
          <div className="bg-red-50 px-2 py-1 rounded-full">
            <span className="text-red-700 text-xs font-semibold">
              {trip.budget?.total || "Flexible budget"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-gray-500 text-xs mt-1">
            {completedActivities} of {totalActivities} activities completed
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => navigate(`/main/travelhub-details/${trip._id}`)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl mr-2 transition-colors"
          >
            <span className="text-center text-sm font-semibold">
              {completionPercentage === 100 ? "View Trip" : "Continue Planning"}
            </span>
          </button>
          <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    );
  };

  const FlightCard = ({ flight }) => (
    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-base">
            {flight.airline}
          </h3>
          <p className="text-gray-500 text-sm">{flight.route}</p>
        </div>
        <div className="bg-green-50 px-3 py-1 rounded-full">
          <span className="text-green-700 font-bold text-base">
            {flight.price}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-500 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {flight.duration}
          </div>
          <div className="flex items-center text-gray-500 text-xs">
            <Layers className="w-3 h-3 mr-1" />
            {flight.stops}
          </div>
        </div>
        <span className="text-gray-500 text-xs">{flight.date}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white pt-4 pb-4 px-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Travel Hub</h1>
            <p className="text-red-600 text-sm font-semibold">
              Plan • Book • Explore
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white border-b border-gray-200">
        <button
          onClick={() => setActiveTab("planner")}
          className={`flex-1 py-4 text-center border-b-2 transition-colors ${
            activeTab === "planner"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500"
          }`}
        >
          <span className="font-semibold">Trip Planner</span>
        </button>
        <button
          onClick={() => setActiveTab("flights")}
          className={`flex-1 py-4 text-center border-b-2 transition-colors ${
            activeTab === "flights"
              ? "border-red-600 text-red-600"
              : "border-transparent text-gray-500"
          }`}
        >
          <span className="font-semibold">Flights</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "planner" ? (
          /* TRIP PLANNER TAB */
          <>
            {/* Quick Actions */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-wrap justify-between mb-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-[48%] mb-3 text-left"
                >
                  <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                      style={{ backgroundColor: `${action.color}15` }}
                    >
                      {action.icon === "plus-circle" && (
                        <Plus
                          className="w-5 h-5"
                          style={{ color: action.color }}
                        />
                      )}
                      {action.icon === "download" && (
                        <Download
                          className="w-5 h-5"
                          style={{ color: action.color }}
                        />
                      )}
                      {action.icon === "users" && (
                        <Users
                          className="w-5 h-5"
                          style={{ color: action.color }}
                        />
                      )}
                      {action.icon === "trending-up" && (
                        <TrendingUp
                          className="w-5 h-5"
                          style={{ color: action.color }}
                        />
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {action.title}
                    </h3>
                    <p className="text-gray-500 text-xs">{action.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Saved Itineraries */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                My Itineraries
              </h2>
              <button
                onClick={onRefresh}
                className="text-red-600 text-sm font-semibold hover:text-red-700"
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <span className="text-gray-500">Loading your trips...</span>
              </div>
            ) : userTrips.length === 0 ? (
              <div className="flex flex-col items-center py-8 bg-white rounded-2xl p-6 border border-gray-200">
                <MapPin className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg text-center mb-2">
                  No trips yet
                </p>
                <p className="text-gray-400 text-sm text-center mb-4">
                  Create your first trip with AI Planner!
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl transition-colors">
                  <span className="font-semibold">Plan with AI</span>
                </button>
              </div>
            ) : (
              userTrips.map((trip) => <TripCard key={trip._id} trip={trip} />)
            )}
          </>
        ) : (
          /* FLIGHTS TAB */
          <>
            {/* Quick Search */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-6">
              <h2 className="font-bold text-gray-900 text-lg mb-3">
                Find Flights
              </h2>
              <div className="flex space-x-2 mb-3">
                <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2">
                  <span className="text-gray-500 text-xs">From</span>
                  <p className="text-gray-900 text-sm font-medium">Manila</p>
                </div>
                <div className="flex-1 bg-gray-100 rounded-xl px-3 py-2">
                  <span className="text-gray-500 text-xs">To</span>
                  <p className="text-gray-900 text-sm font-medium">Cebu</p>
                </div>
              </div>
              <button className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl w-full transition-colors">
                <span className="font-semibold">Search Flights</span>
              </button>
            </div>

            {/* Flight Deals */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Best Deals to Cebu
            </h2>

            {flightDeals.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TravelHubMobile;
