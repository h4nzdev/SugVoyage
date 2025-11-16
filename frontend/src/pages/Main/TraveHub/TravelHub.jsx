import React, { useState, useEffect, useContext } from "react";
import TravelHubMobile from "../../Mobile/TravelHubMobile";
import TravelHubDesktop from "../../Desktop/TravelHubDesktop";
import { TripPlanService } from "../../../services/tripPlanService";
import { AuthenticationContext } from "../../../context/AuthenticationContext";

export default function TravelHub() {
  const [activeTab, setActiveTab] = useState("planner");
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthenticationContext);

  const flightDeals = [
    {
      id: 1,
      airline: "Cebu Pacific",
      route: "Manila → Cebu",
      price: "₱1,499",
      date: "Dec 15, 2024",
      duration: "1h 15m",
      stops: "Direct",
    },
    {
      id: 2,
      airline: "Philippine Airlines",
      route: "Cebu → Manila",
      price: "₱1,899",
      date: "Dec 20, 2024",
      duration: "1h 15m",
      stops: "Direct",
    },
    {
      id: 3,
      airline: "AirAsia",
      route: "Davao → Cebu",
      price: "₱2,199",
      date: "Dec 18, 2024",
      duration: "1h 45m",
      stops: "Direct",
    },
    {
      id: 4,
      airline: "Cebu Pacific",
      route: "Cebu → Bohol",
      price: "₱899",
      date: "Dec 22, 2024",
      duration: "45m",
      stops: "Direct",
    },
  ];

  const quickActions = [
    {
      icon: "plus-circle",
      title: "Create New Trip",
      subtitle: "Start from scratch",
      action: () => console.log("Create trip"),
      color: "#DC143C",
    },
    {
      icon: "download",
      title: "Import Plans",
      subtitle: "From other apps",
      action: () => console.log("Import"),
      color: "#059669",
    },
    {
      icon: "users",
      title: "Group Trip",
      subtitle: "Plan with friends",
      action: () => console.log("Group Trip"),
      color: "#0369A1",
    },
    {
      icon: "trending-up",
      title: "Flight Alerts",
      subtitle: "Price drop notifications",
      action: () => console.log("Alerts"),
      color: "#8B5CF6",
    },
  ];

  useEffect(() => {
    loadUserTrips();
  }, []);

  console.log(user)

  const loadUserTrips = async () => {
    try {
      setLoading(true);
      const response = await TripPlanService.getUserTrips(user.id);
      setUserTrips(response.trips);
      setLoading(false); // ADD THIS LINE
    } catch (error) {
      console.error("Error loading trips:", error);
      setLoading(false);
    }
  };

  const calculateTotalActivities = (trip) => {
    return (
      trip.days?.reduce(
        (total, day) => total + (day.activities?.length || 0),
        0
      ) || 0
    );
  };

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden">
        <TravelHubMobile
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userTrips={userTrips}
          loading={loading}
          flightDeals={flightDeals}
          quickActions={quickActions}
          onRefresh={loadUserTrips}
          calculateTotalActivities={calculateTotalActivities}
        />
      </div>

      {/* Desktop View - NO MAX WIDTH! 🚀 */}
      <div className="hidden md:block">
        <TravelHubDesktop
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userTrips={userTrips}
          loading={loading}
          flightDeals={flightDeals}
          quickActions={quickActions}
          onRefresh={loadUserTrips}
          calculateTotalActivities={calculateTotalActivities}
        />
      </div>
    </>
  );
}
