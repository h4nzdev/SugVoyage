import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Star,
  Clock,
  Sun,
  DollarSign,
  Navigation,
  Share2,
  Download,
  Flag,
  Camera,
  Truck,
  Coffee,
  Map,
  Users,
  Shield,
  CheckCircle,
  Info,
  Cpu,
  ChevronRight,
} from "lucide-react";
import { CebuSpotsService } from "../../services/cebuSpotService";

export default function DetailedInfoDesktop() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spotData, setSpotData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const navigate = useNavigate();
  const { id } = useParams();

  // Helper function to get appropriate icons for facilities
  const getFacilityIcon = (activity, index) => {
    const activityLower = activity.toLowerCase();
    const iconMap = {
      hiking: "trending-up",
      walking: "navigation",
      photography: "camera",
      sightseeing: "eye",
      dining: "coffee",
      shopping: "shopping-bag",
      parking: "truck",
      swimming: "droplet",
      camping: "home",
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (activityLower.includes(key)) {
        return icon;
      }
    }

    // Default icons
    const defaultIcons = [
      "camera",
      "eye",
      "map",
      "navigation",
      "flag",
      "compass",
    ];
    return defaultIcons[index % defaultIcons.length];
  };

  // Helper function to generate highlights
  const generateHighlights = (data) => {
    const highlights = [];

    if (data.type === "viewpoint") {
      highlights.push(
        "Panoramic city views",
        "Perfect for sunset photos",
        "Great for photography"
      );
    }

    if (data.rating >= 4.5) {
      highlights.push("Highly rated by visitors");
    }

    if (data.featured) {
      highlights.push("Featured destination");
    }

    // Add some default highlights
    highlights.push("Beautiful scenery", "Memorable experience");

    return highlights.slice(0, 5);
  };

  // Transform API data to match our UI structure
  const transformSpotData = (data) => {
    if (!data) return null;

    return {
      // Basic info
      _id: data._id,
      name: data.name || "Unknown Place",
      type: data.type || data.category || "Attraction",
      location: data.location || "Cebu, Philippines",
      address: data.location || "Cebu, Philippines",
      rating: parseFloat(data.rating) || 0,
      reviews: data.reviews || 0,
      price: data.price || "FREE",
      description: data.description || "No description available.",

      // Coordinates for directions
      latitude: data.latitude,
      longitude: data.longitude,

      // Additional info
      bestTime: "3:00 PM - 6:00 PM", // Default value
      visitDuration: data.days || "1-2 hours",

      // Facilities - using actual activities if available
      facilities: data.activities
        ? data.activities.slice(0, 6).map((activity, index) => ({
            icon: getFacilityIcon(activity, index),
            name: activity,
          }))
        : [
            { icon: "camera", name: "Photo Spot" },
            { icon: "truck", name: "Parking" },
            { icon: "coffee", name: "Souvenirs" },
          ],

      // Highlights based on description and type
      highlights: generateHighlights(data),

      // Travel tips
      tips: [
        "Bring camera for great photos",
        "Visit during sunset for best views",
        "Wear comfortable shoes for walking",
      ],

      image:
        data.image_url ||
        "https://images.unsplash.com/photo-1588666309990-70df6fe85e74?w=800&h=400&fit=crop",
    };
  };

  useEffect(() => {
    if (id) {
      loadSpotData();
    } else {
      setError("No spot ID provided");
      setLoading(false);
    }
  }, [id]);

  const loadSpotData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading spot data for ID:", id);
      const spot = await CebuSpotsService.getSpotByIdFromAPI(id);

      if (spot) {
        console.log("Spot data loaded:", spot.name);
        setSpotData(spot);
      } else {
        setError("Spot not found");
      }
    } catch (err) {
      console.error("Error loading spot data:", err);
      setError("Failed to load spot information");
    } finally {
      setLoading(false);
    }
  };

  const locationData = spotData
    ? transformSpotData(spotData)
    : {
        // Fallback data
        name: "Loading...",
        type: "Attraction",
        address: "Cebu, Philippines",
        rating: 0,
        reviews: 0,
        price: "FREE",
        description: "Loading description...",
        bestTime: "Anytime",
        visitDuration: "1-2 hours",
        facilities: [
          { icon: "camera", name: "Photo Spot" },
          { icon: "truck", name: "Parking" },
          { icon: "coffee", name: "Souvenirs" },
        ],
        highlights: [
          "Beautiful scenery",
          "Great for photos",
          "Cultural experience",
        ],
        tips: [
          "Bring camera",
          "Visit during good weather",
          "Wear comfortable shoes",
        ],
        image_url:
          "https://images.unsplash.com/photo-1588666309990-70df6fe85e74?w=800&h=400&fit=crop",
      };

  const handleBookNow = () => {
    console.log("Planning visit to:", locationData.name);
  };

  const handleGetDirections = () => {
    if (spotData?.latitude && spotData?.longitude) {
      navigate("/main/map", {
        state: {
          destination: {
            latitude: spotData.latitude,
            longitude: spotData.longitude,
            name: spotData.name,
          },
        },
      });
    } else {
      console.log("No coordinates available for directions");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="h-screen w-full bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="text-gray-600 mt-4">Loading spot information...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex-1 bg-white flex flex-col justify-center items-center px-8">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Info className="text-red-600" size={24} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mt-4 text-center">
          Unable to Load
        </h2>
        <p className="text-gray-600 text-center mt-2 mb-6">{error}</p>
        <button
          onClick={loadSpotData}
          className="bg-red-600 px-6 py-3 rounded-xl text-white font-semibold hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Tab Content Components
  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Quick Info Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Sun size={18} className="text-blue-600" />
            <span className="text-blue-700 font-semibold text-sm ml-2">
              Best Time
            </span>
          </div>
          <p className="text-gray-900 text-base font-medium">
            {locationData.bestTime}
          </p>
        </div>

        <div className="bg-orange-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <DollarSign size={18} className="text-orange-600" />
            <span className="text-orange-700 font-semibold text-sm ml-2">
              Entrance Fee
            </span>
          </div>
          <p className="text-gray-900 text-base font-medium">
            {locationData.price}
          </p>
        </div>

        <div className="bg-emerald-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Clock size={18} className="text-emerald-600" />
            <span className="text-emerald-700 font-semibold text-sm ml-2">
              Duration
            </span>
          </div>
          <p className="text-gray-900 text-base font-medium">
            {locationData.visitDuration}
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-gray-900 font-bold text-xl mb-3">
          About This Place
        </h3>
        <p className="text-gray-600 text-base leading-7">
          {locationData.description}
        </p>
      </div>

      {/* Highlights */}
      {locationData.highlights && locationData.highlights.length > 0 && (
        <div>
          <h3 className="text-gray-900 font-bold text-xl mb-4">Why Visit?</h3>
          <div className="grid grid-cols-2 gap-3">
            {locationData.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle
                  size={18}
                  className="text-green-500 mt-1 flex-shrink-0"
                />
                <p className="text-gray-700 text-base ml-3 flex-1">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const FacilitiesTab = () => (
    <div className="space-y-6">
      <h3 className="text-gray-900 font-bold text-xl mb-4">
        Facilities & Services
      </h3>

      <div className="grid grid-cols-3 gap-6">
        {locationData.facilities.map((facility, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl"
          >
            <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-3 border border-red-100">
              {facility.icon === "camera" && (
                <Camera size={24} className="text-red-600" />
              )}
              {facility.icon === "truck" && (
                <Truck size={24} className="text-red-600" />
              )}
              {facility.icon === "coffee" && (
                <Coffee size={24} className="text-red-600" />
              )}
              {facility.icon === "map" && (
                <Map size={24} className="text-red-600" />
              )}
              {facility.icon === "users" && (
                <Users size={24} className="text-red-600" />
              )}
              {facility.icon === "shield" && (
                <Shield size={24} className="text-red-600" />
              )}
              {/* Add more icons as needed */}
            </div>
            <p className="text-gray-700 text-sm text-center font-semibold">
              {facility.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const TipsTab = () => (
    <div className="space-y-6">
      <h3 className="text-gray-900 font-bold text-xl mb-4">
        Travel Tips & Recommendations
      </h3>

      <div className="space-y-4">
        {locationData.tips.map((tip, index) => (
          <div
            key={index}
            className="flex items-start bg-yellow-50 rounded-xl p-4"
          >
            <Info size={18} className="text-yellow-600 mt-1 flex-shrink-0" />
            <p className="text-gray-700 text-base ml-3 flex-1">{tip}</p>
          </div>
        ))}
      </div>

      {/* AI Assistant CTA */}
      <button className="bg-red-50 rounded-xl p-6 border border-red-100 w-full text-left hover:bg-red-100 transition-colors">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mr-4">
            <Cpu size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-red-900 font-bold text-lg">
              Need Personalized Advice?
            </p>
            <p className="text-red-700 text-base mt-1">
              Ask our AI assistant for customized travel recommendations
            </p>
          </div>
          <ChevronRight size={20} className="text-emerald-600" />
        </div>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-700" />
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  {locationData.name}
                </h1>
                <div className="flex items-center mt-1">
                  <MapPin size={16} className="text-gray-500" />
                  <span className="text-gray-600 text-base ml-2">
                    {locationData.address}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                <Heart
                  size={20}
                  className={
                    isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"
                  }
                />
              </button>

              <div className="bg-red-100 px-4 py-2 rounded-xl">
                <span className="text-red-700 font-bold text-lg">
                  {locationData.price}
                </span>
              </div>
            </div>
          </div>

          {/* Rating and Info */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={
                      star <= Math.floor(locationData.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-gray-900 font-bold text-lg ml-2">
                  {locationData.rating || "N/A"}
                </span>
                <span className="text-gray-400 text-lg ml-2">
                  · {locationData.reviews || 0} reviews
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-600 text-base">
                {locationData.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 py-6">
        <div className="flex space-x-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Image */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6">
              <img
                src={spotData?.image_url}
                alt={locationData.name}
                className="w-full h-80 object-cover"
              />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm">
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "facilities", label: "Facilities" },
                  { id: "tips", label: "Tips" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 border-b-2 ${
                      activeTab === tab.id
                        ? "border-red-500 text-red-600"
                        : "border-transparent text-gray-500"
                    } font-semibold text-base transition-colors`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "overview" && <OverviewTab />}
                {activeTab === "facilities" && <FacilitiesTab />}
                {activeTab === "tips" && <TipsTab />}
              </div>
            </div>
          </div>

          {/* Sidebar - Action Panel */}
          <div className="w-80">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-gray-900 font-bold text-xl mb-4">
                Plan Your Visit
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Entrance Fee</span>
                  <span className="text-gray-900 font-bold text-lg">
                    {locationData.price}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Best Time</span>
                  <span className="text-gray-900 font-medium">
                    {locationData.bestTime}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="text-gray-900 font-medium">
                    {locationData.visitDuration}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <button
                  onClick={handleGetDirections}
                  className="w-full border border-red-500 py-4 rounded-xl flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <Navigation size={20} className="text-red-600" />
                  <span className="text-red-600 font-semibold text-lg ml-2">
                    Get Directions
                  </span>
                </button>

                <button
                  onClick={handleBookNow}
                  className="w-full bg-red-500 py-4 rounded-xl text-white font-bold text-lg hover:bg-red-600 transition-colors"
                >
                  Plan My Visit
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-gray-900 font-semibold text-lg mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center py-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <Share2 size={18} className="text-gray-500" />
                    <span className="text-gray-700 text-base ml-3">
                      Share Location
                    </span>
                  </button>
                  <button className="w-full flex items-center py-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <Download size={18} className="text-gray-500" />
                    <span className="text-gray-700 text-base ml-3">
                      Save for Later
                    </span>
                  </button>
                  <button className="w-full flex items-center py-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <Flag size={18} className="text-gray-500" />
                    <span className="text-gray-700 text-base ml-3">
                      Report Issue
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
