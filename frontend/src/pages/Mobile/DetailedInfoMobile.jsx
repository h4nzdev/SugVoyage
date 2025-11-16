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
  CheckCircle,
  Info,
  Cpu,
  ChevronRight,
  Camera,
  Truck,
  Coffee,
} from "lucide-react";
import { CebuSpotsService } from "../../services/cebuSpotService";

export default function DetailedInfoMobile() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [spotData, setSpotData] = useState(null);
  const [error, setError] = useState(null);

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
      navigate("/map", {
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
      <div className="flex-1 bg-white flex flex-col justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="text-gray-600 mt-4">Loading spot information...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex-1 bg-white flex flex-col justify-center items-center px-8 min-h-screen">
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

  return (
    <div className="flex flex-col bg-white min-h-screen">
      <div className="flex-1 overflow-y-auto">
        {/* Image Header */}
        <div className="relative">
          <img
            src={spotData?.image_url}
            alt={locationData.name}
            className="w-full h-64 object-cover"
          />

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-12 left-5 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-12 right-5 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <Heart
              size={20}
              className={
                isFavorite ? "text-red-400 fill-red-400" : "text-white"
              }
            />
          </button>

          {/* Price/Type Badge */}
          <div className="absolute bottom-4 left-5 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl">
            <p className="text-red-600 font-bold text-sm">
              {locationData.price}
            </p>
            <p className="text-gray-600 text-xs">{locationData.type}</p>
          </div>
        </div>

        {/* Header Info Section */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-gray-900 font-black text-2xl flex-1 mr-3">
              {locationData.name}
            </h1>
          </div>

          <div className="flex items-center mb-3">
            <MapPin size={14} className="text-gray-500" />
            <p className="text-gray-600 text-sm ml-1 flex-1">
              {locationData.address}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center mr-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= Math.floor(locationData.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-900 font-bold text-sm">
                {locationData.rating || "N/A"}
              </span>
              <span className="text-gray-400 text-sm ml-2">
                · {locationData.reviews || 0} reviews
              </span>
            </div>

            <div className="flex items-center bg-emerald-50 px-3 py-1 rounded-full">
              <Clock size={12} className="text-emerald-600" />
              <span className="text-emerald-700 text-xs font-medium ml-1">
                {locationData.visitDuration}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex justify-between">
            <div className="flex-1 bg-blue-50 rounded-xl p-3 mr-2">
              <div className="flex items-center mb-1">
                <Sun size={16} className="text-blue-600" />
                <span className="text-blue-700 font-semibold text-sm ml-2">
                  Best Time
                </span>
              </div>
              <p className="text-gray-900 text-sm font-medium">
                {locationData.bestTime}
              </p>
            </div>

            <div className="flex-1 bg-orange-50 rounded-xl p-3 ml-2">
              <div className="flex items-center mb-1">
                <DollarSign size={16} className="text-orange-600" />
                <span className="text-orange-700 font-semibold text-sm ml-2">
                  Entrance Fee
                </span>
              </div>
              <p className="text-gray-900 text-sm font-medium">
                {locationData.price}
              </p>
            </div>
          </div>
        </div>

        {/* Facilities */}
        {locationData.facilities && locationData.facilities.length > 0 && (
          <div className="px-5 py-5 border-b border-gray-100">
            <h2 className="text-gray-900 font-bold text-lg mb-4">
              Facilities & Services
            </h2>

            <div className="flex flex-wrap justify-between">
              {locationData.facilities.map((facility, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center mb-4"
                  style={{ width: "30%" }}
                >
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-2 border border-red-100">
                    {facility.icon === "camera" && (
                      <Camera size={20} className="text-red-600" />
                    )}
                    {facility.icon === "truck" && (
                      <Truck size={20} className="text-red-600" />
                    )}
                    {facility.icon === "coffee" && (
                      <Coffee size={20} className="text-red-600" />
                    )}
                    {/* Add more icons as needed */}
                  </div>
                  <p className="text-gray-700 text-xs text-center font-medium">
                    {facility.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Highlights */}
        {locationData.highlights && locationData.highlights.length > 0 && (
          <div className="px-5 py-5 border-b border-gray-100">
            <h2 className="text-gray-900 font-bold text-lg mb-3">Why Visit?</h2>
            <div className="space-y-2">
              {locationData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle
                    size={16}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <p className="text-gray-700 text-sm ml-2 flex-1">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Travel Tips */}
        {locationData.tips && locationData.tips.length > 0 && (
          <div className="px-5 py-5 border-b border-gray-100">
            <h2 className="text-gray-900 font-bold text-lg mb-3">
              Travel Tips
            </h2>
            <div className="space-y-2">
              {locationData.tips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <Info
                    size={16}
                    className="text-yellow-500 mt-1 flex-shrink-0"
                  />
                  <p className="text-gray-700 text-sm ml-2 flex-1">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="px-5 py-5">
          <h2 className="text-gray-900 font-bold text-lg mb-3">
            About This Place
          </h2>
          <p className="text-gray-600 text-sm leading-6 mb-4">
            {locationData.description}
          </p>

          {/* AI Assistant CTA */}
          <button className="bg-red-50 rounded-xl p-4 border border-red-100 w-full text-left hover:bg-red-100 transition-colors">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center mr-3">
                <Cpu size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-red-900 font-bold text-sm">
                  Need more info?
                </p>
                <p className="text-red-700 text-xs">
                  Ask AI assistant about this location
                </p>
              </div>
              <ChevronRight size={16} className="text-emerald-600" />
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="px-5 py-4 border-t border-gray-200 bg-white flex items-center justify-between sticky bottom-0">
        <div className="flex-shrink-0">
          <p className="text-gray-900 font-black text-2xl">
            {locationData.price}
          </p>
          <p className="text-gray-600 text-sm">Entrance</p>
        </div>

        <div className="flex flex-1 justify-end gap-3">
          <button
            onClick={handleGetDirections}
            className="border border-red-500 px-4 py-3 rounded-xl flex items-center hover:bg-red-50 transition-colors"
          >
            <Navigation size={16} className="text-red-600" />
            <span className="text-red-600 font-semibold text-sm ml-2">
              Directions
            </span>
          </button>

          <button
            onClick={handleBookNow}
            className="bg-red-500 px-6 py-3 rounded-xl min-w-20 hover:bg-red-600 transition-colors"
          >
            <span className="text-white font-bold text-base text-center">
              Plan Visit
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
