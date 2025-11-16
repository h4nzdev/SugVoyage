import React from "react";
import { MapPin, Star } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { useNavigate } from "react-router-dom";

// Error Boundary Component
class AttractionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("❌ AttractionList Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mb-8">
          <SectionHeader title="Popular Attractions" />
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <MapPin className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Error Loading Attractions
            </h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              There was an error displaying the attractions. Please refresh the
              page and try again.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AttractionList = ({ spots = [], userLocation = null, radius = null }) => {
  // Safe spots array check
  const safeSpots = Array.isArray(spots) ? spots.filter((s) => s) : [];
  const navigate = useNavigate();

  // Filter spots within radius if user location and radius are provided
  const { filteredSpots, hasNoSpotNearby } = (() => {
    if (!userLocation || !radius) {
      // No radius filtering - limit to 10 spots
      return { filteredSpots: safeSpots.slice(0, 10), hasNoSpotNearby: false };
    }

    // Calculate distance for each spot
    const spotsWithDistance = safeSpots.map((spot) => ({
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
      return { filteredSpots: spotsInRadius, hasNoSpotNearby: false };
    } else {
      return { filteredSpots: safeSpots.slice(0, 10), hasNoSpotNearby: true };
    }
  })();

  if (filteredSpots.length === 0) {
    return (
      <div className="mb-8">
        <SectionHeader title="Popular Attractions" />
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            No Attractions Available
          </h3>
          <p className="text-sm text-gray-500 text-center max-w-sm">
            There are no attractions in this category yet. Try selecting a
            different category.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AttractionErrorBoundary>
      <div className="mb-8">
        <SectionHeader
          title="Popular Attractions"
          actionText="See all"
          onActionPress={() => console.log("See all attractions")}
        />

        {/* Show message if no spots nearby */}
        {hasNoSpotNearby && (
          <div className="px-4 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg mx-4">
            <p className="text-sm text-blue-700">
              📍 No spots found nearby. Showing nearby attractions instead.
            </p>
          </div>
        )}

        <div className="flex space-x-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
          {safeSpots.map((spot) => {
            // Skip invalid spots
            if (!spot) return null;

            const safeId = spot._id || spot.id || Math.random();
            const safeName = spot.name || "Unnamed";
            const safeLocation = spot.location || "Cebu";
            const safeDescription =
              spot.description || "Explore this beautiful location";
            const safeImageUrl =
              spot.image_url ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
            const safeRating = spot.rating ?? 4.0;
            const safeReviews = spot.reviews ?? 0;

            return (
              <div
                onClick={() => navigate(`/main/detailed-info/${spot._id}`)}
                key={safeId}
                className="flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-100 cursor-pointer active:scale-95 transition-transform"
              >
                {/* Image section */}
                <div className="relative h-40">
                  <img
                    src={safeImageUrl}
                    alt={safeName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Content section */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {safeName}
                  </h3>
                  <div className="flex items-center mb-2">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500 ml-1">
                      {safeLocation}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {safeDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-gray-800 ml-1">
                        {typeof safeRating === "number"
                          ? safeRating.toFixed(1)
                          : safeRating}
                      </span>
                      <span className="text-xs text-gray-500 ml-1">
                        ({safeReviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AttractionErrorBoundary>
  );
};

export default AttractionList;

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
