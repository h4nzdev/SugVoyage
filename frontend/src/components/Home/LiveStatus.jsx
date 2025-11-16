import React, { useState, useEffect } from "react";
import {
  Activity,
  Sun,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Loader,
} from "lucide-react";
import { LiveDataService } from "../../services/liveDataService";

const LiveStatus = () => {
  const [liveData, setLiveData] = useState({
    weather: null,
    traffic: null,
    crowd: null,
    loading: true,
    lastUpdated: null,
  });

  const [userLocation, setUserLocation] = useState({
    latitude: 10.3157, // Cebu default
    longitude: 123.8854,
  });

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Using default Cebu location");
        }
      );
    }
  }, []);

  const fetchLiveData = async () => {
    setLiveData((prev) => ({ ...prev, loading: true }));

    try {
      const [weatherData, trafficData, crowdData] = await Promise.all([
        LiveDataService.getWeatherData(
          userLocation.latitude,
          userLocation.longitude
        ),
        LiveDataService.getTrafficData(),
        LiveDataService.getCrowdData(),
      ]);

      setLiveData({
        weather: weatherData,
        traffic: trafficData,
        crowd: crowdData,
        loading: false,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Failed to fetch live data:", error);
      setLiveData((prev) => ({
        ...prev,
        loading: false,
        lastUpdated: new Date(),
      }));
    }
  };

  useEffect(() => {
    fetchLiveData();

    // Refresh every 5 minutes
    const interval = setInterval(fetchLiveData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userLocation]);

  const handleRefresh = () => {
    fetchLiveData();
  };

  // Status items with real data
  const statusItems = [
    {
      id: "weather",
      icon: Sun,
      title: "Weather",
      subtitle: liveData.weather
        ? `${liveData.weather.temperature}°C ${liveData.weather.condition}`
        : "Loading...",
      status: liveData.weather?.status || "good",
      color: getStatusColor(liveData.weather?.status),
      bgColor: getStatusBgColor(liveData.weather?.status),
      borderColor: getStatusBorderColor(liveData.weather?.status),
    },
    {
      id: "traffic",
      icon: TrendingUp,
      title: "Traffic",
      subtitle: liveData.traffic ? `${liveData.traffic.traffic}` : "Loading...",
      status: liveData.traffic?.status || "good",
      color: getStatusColor(liveData.traffic?.status),
      bgColor: getStatusBgColor(liveData.traffic?.status),
      borderColor: getStatusBorderColor(liveData.traffic?.status),
    },
    {
      id: "crowds",
      icon: Users,
      title: "Crowds",
      subtitle: liveData.crowd ? `${liveData.crowd.level}` : "Loading...",
      status: liveData.crowd?.status || "moderate",
      color: getStatusColor(liveData.crowd?.status),
      bgColor: getStatusBgColor(liveData.crowd?.status),
      borderColor: getStatusBorderColor(liveData.crowd?.status),
    },
    {
      id: "best-time",
      icon: Clock,
      title: "Best Time",
      subtitle: liveData.crowd?.peak || "3-5PM",
      status: "recommended",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
  ];

  // Helper functions for status colors
  function getStatusColor(status) {
    switch (status) {
      case "perfect":
      case "good":
        return "text-green-600";
      case "moderate":
        return "text-yellow-600";
      case "poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  }

  function getStatusBgColor(status) {
    switch (status) {
      case "perfect":
      case "good":
        return "bg-green-50";
      case "moderate":
        return "bg-yellow-50";
      case "poor":
        return "bg-red-50";
      default:
        return "bg-gray-50";
    }
  }

  function getStatusBorderColor(status) {
    switch (status) {
      case "perfect":
      case "good":
        return "border-green-200";
      case "moderate":
        return "border-yellow-200";
      case "poor":
        return "border-red-200";
      default:
        return "border-gray-200";
    }
  }

  // Get overall status message
  const getOverallStatus = () => {
    if (liveData.loading) return "Loading live data...";

    const allGood = [liveData.weather, liveData.traffic, liveData.crowd].every(
      (data) => data?.status === "good" || data?.status === "perfect"
    );

    if (allGood) return "Perfect day for exploration!";

    const hasPoor = [liveData.weather, liveData.traffic, liveData.crowd].some(
      (data) => data?.status === "poor"
    );

    if (hasPoor) return "Some challenges today - plan accordingly";

    return "Good conditions for your adventure!";
  };

  const getOverallStatusColor = () => {
    if (liveData.loading) return "text-gray-600";

    const hasPoor = [liveData.weather, liveData.traffic, liveData.crowd].some(
      (data) => data?.status === "poor"
    );

    const allGood = [liveData.weather, liveData.traffic, liveData.crowd].every(
      (data) => data?.status === "good" || data?.status === "perfect"
    );

    if (allGood) return "text-green-600";
    if (hasPoor) return "text-red-600";
    return "text-yellow-600";
  };

  const getOverallStatusIcon = () => {
    if (liveData.loading) return Loader;

    const hasPoor = [liveData.weather, liveData.traffic, liveData.crowd].some(
      (data) => data?.status === "poor"
    );

    const allGood = [liveData.weather, liveData.traffic, liveData.crowd].every(
      (data) => data?.status === "good" || data?.status === "perfect"
    );

    if (allGood) return CheckCircle;
    if (hasPoor) return AlertTriangle;
    return CheckCircle;
  };

  const OverallIcon = getOverallStatusIcon();

  return (
    <div className="px-4 py-4 mx-4 rounded-2xl shadow-sm mb-4 mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Activity className="w-5 h-5 text-red-600" />
          <span className="text-xl font-bold text-gray-800 ml-2">
            Live Status
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={liveData.loading}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${liveData.loading ? "animate-spin" : ""}`}
            />
            <span className="text-xs">Refresh</span>
          </button>
          <div className="flex items-center">
            <div
              className={`w-2 h-2 rounded-full mr-1 ${
                liveData.loading ? "bg-gray-400" : "bg-green-500"
              }`}
            />
            <span
              className={`text-xs font-semibold ${
                liveData.loading ? "text-gray-600" : "text-green-600"
              }`}
            >
              {liveData.loading ? "UPDATING" : "LIVE"}
            </span>
            <span className="text-gray-500 text-xs ml-2">
              {liveData.lastUpdated
                ? liveData.lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "--:--"}
            </span>
          </div>
        </div>
      </div>

      {/* Status Items */}
      <div className="grid grid-cols-4 gap-4 mb-3">
        {statusItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className="flex flex-col items-center active:scale-95 transition-transform"
              disabled={liveData.loading}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
                  liveData.loading
                    ? "bg-gray-50 border-gray-200"
                    : `${item.bgColor} ${item.borderColor}`
                }`}
              >
                {liveData.loading ? (
                  <Loader className="w-6 h-6 text-gray-400 animate-spin" />
                ) : (
                  <IconComponent className={`w-6 h-6 ${item.color}`} />
                )}
              </div>
              <span className="font-semibold text-gray-800 text-sm text-center mt-2 mb-1">
                {item.title}
              </span>
              <span
                className={`text-xs text-center ${
                  liveData.loading ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {item.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quick Status Bar */}
      <div
        className={`rounded-xl p-3 border ${
          liveData.loading
            ? "bg-gray-50 border-gray-200"
            : "bg-green-50 border-green-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {liveData.loading ? (
              <Loader className="w-4 h-4 text-gray-400 animate-spin" />
            ) : (
              <OverallIcon className={`w-4 h-4 ${getOverallStatusColor()}`} />
            )}
            <span
              className={`text-sm font-semibold ml-2 ${
                liveData.loading ? "text-gray-600" : getOverallStatusColor()
              }`}
            >
              {getOverallStatus()}
            </span>
          </div>
          <span className="text-gray-500 text-xs">
            {liveData.lastUpdated
              ? `Updated ${liveData.lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "Updating..."}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LiveStatus;
