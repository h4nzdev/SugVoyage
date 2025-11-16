import React, { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  ChevronRight,
  Search,
  Loader,
  AlertCircle,
  RefreshCw,
  Sun,
  TrafficCone,
  Users,
  Clock,
} from "lucide-react";
import MainHeader from "../../components/Header/MainHeader";
import { LiveDataService } from "../../services/liveDataService";
import { useNavigate } from "react-router-dom";

const HomePageDesktop = ({
  selectedCategory,
  setSelectedCategory,
  spots,
  categories,
  loading,
  error,
  onSearch,
  onRefresh,
}) => {
  // Add search state and handler
  const [searchQuery, setSearchQuery] = React.useState("");

  // Load radius from localStorage
  const [radius, setRadius] = useState(() => {
    const savedRadius = localStorage.getItem("mapRadius");
    return savedRadius ? parseInt(savedRadius, 10) : 2000; // 2km default
  });

  const [userLocation, setUserLocation] = useState({
    latitude: 10.3157, // Cebu City center
    longitude: 123.8854,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [hasNoSpotNearby, setHasNoSpotNearby] = useState(false);
  const [liveData, setLiveData] = useState({
    weather: null,
    traffic: null,
    crowd: null,
    loading: true,
    lastUpdated: null,
  });

  // Load user location from browser geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        },
        (error) => {
          console.log("Geolocation error:", error.message);
          // Keep default Cebu location as fallback
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  // Save radius to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mapRadius", radius.toString());
  }, [radius]);

  const fetchLiveData = async () => {
    setLiveData((prev) => ({ ...prev, loading: true }));

    try {
      const [weatherData, trafficData] = await Promise.all([
        LiveDataService.getWeatherData(),
        LiveDataService.getTrafficData(),
      ]);

      const crowdData = LiveDataService.getCrowdData();

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

    const interval = setInterval(fetchLiveData, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleLiveDataRefresh = () => {
    fetchLiveData();
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Calculate filtered spots and check if no spots nearby
  const { filteredSpots: getFilteredSpots, noSpotNearby } = (() => {
    if (!userLocation || !radius) {
      // No radius filtering - limit to 10 spots
      return { filteredSpots: spots.slice(0, 10), noSpotNearby: false };
    }

    // Calculate distance for each spot
    const spotsWithDistance = spots.map((spot) => ({
      ...spot,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude || 10.3157,
        spot.longitude || 123.8854
      ),
    }));

    // Filter spots within radius
    const spotsInRadius = spotsWithDistance.filter(
      (spot) => spot.distance <= radius
    );

    // If spots found in radius, return them; otherwise return first 10 with flag
    if (spotsInRadius.length > 0) {
      return { filteredSpots: spotsInRadius, noSpotNearby: false };
    } else {
      return { filteredSpots: spots.slice(0, 10), noSpotNearby: true };
    }
  })();

  // Update hasNoSpotNearby state when noSpotNearby value changes
  useEffect(() => {
    setHasNoSpotNearby(noSpotNearby);
  }, [noSpotNearby]);

  const DesktopHeroBanner = () => (
    <div className="px-8 py-6">
      <div
        className="rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 h-96 relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1534008897995-27a23e859048?w=1200')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-12">
          <h1 className="text-white text-5xl font-bold mb-3">
            Cebu, Philippines
          </h1>
          <div className="flex items-center">
            <MapPin className="w-6 h-6 text-white" />
            <span className="text-white/90 text-xl ml-2">
              Discover the Queen City of the South
            </span>
          </div>
          <p className="text-white/80 text-lg mt-3 max-w-2xl">
            Explore stunning waterfalls, historical landmarks, pristine beaches,
            and vibrant culture in the heart of the Visayas.
          </p>

          {/* Search Bar in Hero */}
          <div className="mt-6 max-w-xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search attractions, locations, categories..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:ring-2 focus:ring-red-500 bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DesktopCategoryTabs = () => (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-200 ${
                selectedCategory === category.name
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          <span className="font-semibold text-gray-700">
            {loading ? "Refreshing..." : "Refresh"}
          </span>
        </button>
      </div>
    </div>
  );

  const LoadingState = () => (
    <div className="px-8 py-6">
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-200">
        <Loader className="w-12 h-12 text-red-600 animate-spin mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Loading Attractions
        </h3>
        <p className="text-gray-500 text-lg text-center max-w-md">
          Fetching the latest spots from Cebu...
        </p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="px-8 py-6">
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-200">
        <AlertCircle className="w-16 h-16 text-red-600 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Failed to Load Data
        </h3>
        <p className="text-gray-500 text-lg text-center max-w-md mb-6">
          {error || "There was an error loading the attractions."}
        </p>
        <button
          onClick={onRefresh}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </button>
      </div>
    </div>
  );

  const DesktopAttractionCard = ({ spot }) => {
    // Safe rendering with null checks
    if (!spot) return null;
    const navigate = useNavigate();

    const safeImageUrl =
      spot.image_url ||
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
    const safeName = spot.name || "Unnamed Attraction";
    const safeLocation = spot.location || "Cebu";
    const safeDescription =
      spot.description || "Explore this beautiful location in Cebu.";
    const safeCategory = spot.category || "attraction";
    const safeRating = spot.rating ?? 4.0;
    const safeReviews = spot.reviews ?? 0;

    return (
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group">
        {/* Image section */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={safeImageUrl}
            alt={safeName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
            }}
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-red-600 text-sm font-bold capitalize">
              {safeCategory}
            </span>
          </div>
          <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm font-semibold">{safeRating}</span>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{safeName}</h3>
          <div className="flex items-center mb-3">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-500 text-sm ml-2">{safeLocation}</span>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
            {safeDescription}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-gray-500 text-sm">
                ({safeReviews} reviews)
              </span>
            </div>
            <button
              onClick={() => navigate(`/main/detailed-info/${spot._id}`)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition-colors"
            >
              <span className="font-semibold">Explore</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const DesktopAttractionList = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState />;

    return (
      <div className="px-8 py-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "Popular Attractions"}
            </h2>
            <p className="text-gray-500 text-lg mt-2">
              {getFilteredSpots.length}{" "}
              {getFilteredSpots.length === 1 ? "attraction" : "attractions"}{" "}
              found nearby
              {selectedCategory !== "All" && ` in ${selectedCategory}`}
            </p>
          </div>
          <button className="text-red-600 hover:text-red-700 font-semibold text-lg flex items-center gap-2">
            <span>See all</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Show message if no spots nearby */}
        {hasNoSpotNearby && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <p className="text-sm text-blue-700">
              📍 No spots found nearby. Showing nearby attractions instead.
            </p>
          </div>
        )}

        {getFilteredSpots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-gray-200">
            <Search className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {searchQuery ? "No Results Found" : "No Attractions Available"}
            </h3>
            <p className="text-gray-500 text-lg text-center max-w-md">
              {searchQuery
                ? `No attractions found for "${searchQuery}". Try a different search term.`
                : "There are no attractions in this category yet. Try selecting a different category."}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  onSearch("");
                }}
                className="mt-4 text-red-600 hover:text-red-700 font-semibold"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {getFilteredSpots.map((spot) => (
              <DesktopAttractionCard key={spot.id} spot={spot} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const DesktopLiveStatus = () => {
    const {
      weather,
      traffic,
      crowd,
      loading: liveLoading,
      lastUpdated,
    } = liveData;

    const getStatusColor = (status) => {
      switch (status) {
        case "perfect":
        case "good":
          return "bg-green-50 border-green-200";
        case "moderate":
          return "bg-yellow-50 border-yellow-200";
        case "poor":
          return "bg-red-50 border-red-200";
        default:
          return "bg-gray-50 border-gray-200";
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case "perfect":
        case "good":
          return "✅";
        case "moderate":
          return "⚠️";
        case "poor":
          return "❌";
        default:
          return "⏳";
      }
    };

    const getStatusText = (status) => {
      switch (status) {
        case "perfect":
        case "good":
          return "Good conditions";
        case "moderate":
          return "Moderate conditions";
        case "poor":
          return "Poor conditions";
        default:
          return "Checking...";
      }
    };

    return (
      <div className="px-8 py-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center mr-4">
                <div
                  className={`w-6 h-6 bg-red-600 rounded-full ${
                    liveLoading ? "animate-pulse" : ""
                  }`}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Live Status
                </h2>
                <p className="text-gray-500">
                  {liveLoading
                    ? "Fetching real-time data..."
                    : "Real-time conditions in Cebu"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <span className="text-sm text-gray-500">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleLiveDataRefresh}
                disabled={liveLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${liveLoading ? "animate-spin" : ""}`}
                />
                <span>{liveLoading ? "Refreshing..." : "Refresh"}</span>
              </button>
              <div
                className={`flex items-center px-4 py-2 rounded-full ${
                  liveLoading ? "bg-gray-100" : "bg-green-50"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mr-2 ${
                    liveLoading ? "bg-gray-400" : "bg-green-500"
                  }`}
                />
                <span
                  className={`font-semibold ${
                    liveLoading ? "text-gray-600" : "text-green-700"
                  }`}
                >
                  {liveLoading ? "UPDATING..." : "LIVE UPDATES"}
                </span>
              </div>
            </div>
          </div>

          {/* Status indicators */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {/* Weather */}
            <div
              className={`rounded-2xl p-6 border text-center ${
                liveLoading || !weather
                  ? "bg-gray-50 border-gray-200"
                  : getStatusColor(weather.status)
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  liveLoading || !weather ? "bg-gray-100" : "bg-white"
                }`}
              >
                <span className="text-2xl">
                  {liveLoading || !weather ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    <Sun className="w-8 h-8 text-yellow-500" />
                  )}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Weather</h3>
              <p className="text-gray-600 text-sm">
                {liveLoading || !weather
                  ? "Loading..."
                  : `${weather.temperature}°C • ${weather.condition}`}
              </p>
              <p
                className={`text-xs mt-2 ${
                  liveLoading || !weather
                    ? "text-gray-500"
                    : weather.status === "good" || weather.status === "perfect"
                    ? "text-green-600"
                    : weather.status === "moderate"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {liveLoading || !weather
                  ? "Checking conditions..."
                  : getStatusText(weather.status)}
              </p>
            </div>

            {/* Traffic */}
            <div
              className={`rounded-2xl p-6 border text-center ${
                liveLoading || !traffic
                  ? "bg-gray-50 border-gray-200"
                  : getStatusColor(traffic.status)
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  liveLoading || !traffic ? "bg-gray-100" : "bg-white"
                }`}
              >
                <span className="text-2xl">
                  {liveLoading || !traffic ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    <TrafficCone className="w-8 h-8 text-orange-500" />
                  )}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Traffic</h3>
              <p className="text-gray-600 text-sm">
                {liveLoading || !traffic
                  ? "Loading..."
                  : `${traffic.duration} min • ${traffic.traffic}`}
              </p>
              <p
                className={`text-xs mt-2 ${
                  liveLoading || !traffic
                    ? "text-gray-500"
                    : traffic.status === "good"
                    ? "text-green-600"
                    : traffic.status === "moderate"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {liveLoading || !traffic
                  ? "Checking routes..."
                  : `${traffic.distance} km • ${getStatusText(traffic.status)}`}
              </p>
            </div>

            {/* Crowd */}
            <div
              className={`rounded-2xl p-6 border text-center ${
                liveLoading || !crowd
                  ? "bg-gray-50 border-gray-200"
                  : getStatusColor(crowd.status)
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  liveLoading || !crowd ? "bg-gray-100" : "bg-white"
                }`}
              >
                <span className="text-2xl">
                  {liveLoading || !crowd ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    <Users className="w-8 h-8 text-blue-500" />
                  )}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Crowd</h3>
              <p className="text-gray-600 text-sm">
                {liveLoading || !crowd
                  ? "Loading..."
                  : `${crowd.level} • Peak: ${crowd.peak}`}
              </p>
              <p
                className={`text-xs mt-2 ${
                  liveLoading || !crowd
                    ? "text-gray-500"
                    : crowd.status === "good"
                    ? "text-green-600"
                    : crowd.status === "moderate"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {liveLoading || !crowd
                  ? "Checking crowd levels..."
                  : getStatusText(crowd.status)}
              </p>
            </div>

            {/* Best Time */}
            <div
              className={`rounded-2xl p-6 border text-center ${
                liveLoading
                  ? "bg-gray-50 border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                  liveLoading ? "bg-gray-100" : "bg-white"
                }`}
              >
                <span className="text-2xl">
                  {liveLoading ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    <Clock className="w-8 h-8 text-blue-500" />
                  )}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Best Time</h3>
              <p className="text-gray-600 text-sm">
                {liveLoading ? "Loading..." : "Morning Hours"}
              </p>
              <p
                className={`text-xs mt-2 ${
                  liveLoading ? "text-gray-500" : "text-blue-600"
                }`}
              >
                {liveLoading
                  ? "Analyzing patterns..."
                  : "8-11 AM for fewer crowds"}
              </p>
            </div>
          </div>

          {/* Overall Summary */}
          <div
            className={`rounded-2xl p-6 border ${
              liveLoading
                ? "bg-gray-50 border-gray-200"
                : "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center mr-4 ${
                    liveLoading ? "bg-gray-100" : "bg-green-100"
                  }`}
                >
                  <span
                    className={liveLoading ? "text-gray-400" : "text-green-600"}
                  >
                    {liveLoading ? "..." : getStatusIcon("good")}
                  </span>
                </div>
                <div>
                  <h3
                    className={`font-semibold text-lg ${
                      liveLoading ? "text-gray-600" : "text-green-800"
                    }`}
                  >
                    {liveLoading
                      ? "Checking conditions..."
                      : "Good conditions for exploration!"}
                  </h3>
                  <p
                    className={liveLoading ? "text-gray-500" : "text-green-600"}
                  >
                    {liveLoading
                      ? "Please wait while we fetch the latest data"
                      : `Weather: ${weather?.condition || "N/A"}, Traffic: ${
                          traffic?.traffic || "N/A"
                        }, Crowd: ${crowd?.level || "N/A"}`}
                  </p>
                </div>
              </div>
              <span
                className={
                  liveLoading ? "text-gray-500" : "text-green-700 text-sm"
                }
              >
                {liveLoading ? "Updating..." : "Live data enabled"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <DesktopHeroBanner />
      <DesktopLiveStatus />
      <DesktopCategoryTabs />
      <DesktopAttractionList />
    </div>
  );
};

export default HomePageDesktop;

// Utility function to calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
}
