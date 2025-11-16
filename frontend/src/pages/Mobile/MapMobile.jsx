import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polyline,
  useMap,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  X,
  Star,
  Target,
  Compass,
  Footprints,
  Car,
  Bike,
  Locate,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom icons
const userLocationIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#3B82F6" stroke="#FFFFFF" stroke-width="3"/>
      <circle cx="16" cy="16" r="6" fill="#FFFFFF"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const famousPlaceIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenMarker = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const OPENROUTE_API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjQ1N2I3YTYyYzZiMTRjZTc5MjI5OTdhNWI3NTIzY2I1IiwiaCI6Im11cm11cjY0In0=";

// ==================== UTILITY FUNCTIONS ====================
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const formatDistance = (distance) => {
  return distance <= 1000
    ? `${Math.round(distance)}m`
    : `${(distance / 1000).toFixed(1)}km`;
};

// OpenRouteService Profile Mapping
const getORSProfile = (travelMode) => {
  const profileMap = {
    walking: "foot-walking",
    driving: "driving-car",
    cycling: "cycling-regular",
  };
  return profileMap[travelMode] || "foot-walking";
};

const getStepIcon = (stepType) => {
  const icons = {
    0: "→", // Continue
    1: "←", // Turn left
    2: "→", // Turn right
    3: "↶", // Sharp left
    4: "↷", // Sharp right
    5: "↶", // Slight left
    6: "↷", // Slight right
    11: "↑", // Head toward
  };
  return icons[stepType] || "→";
};

// ==================== COMPONENTS ====================

// Location Updater Component
const LocationUpdater = memo(
  ({ setUserLocation, setLocationError, isTesting, setLocationLoading }) => {
    const map = useMap();
    const watchIdRef = useRef(null);

    useEffect(() => {
      if (isTesting) {
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        return;
      }

      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by this browser.");
        return;
      }

      setLocationLoading(true);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setUserLocation(newLocation);
          setLocationError(null);
          setLocationLoading(false);
          map.setView([newLocation.latitude, newLocation.longitude], 15);
        },
        (error) => {
          const errorMessage = getGeolocationError(error);
          setLocationError(errorMessage);
          setLocationLoading(false);
        }
      );

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setUserLocation(newLocation);
          setLocationError(null);
        },
        (error) => {
          const errorMessage = getGeolocationError(error);
          setLocationError(`Location tracking error: ${errorMessage}`);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
          distanceFilter: 10,
        }
      );

      return () => {
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
      };
    }, [map, setUserLocation, setLocationError, isTesting, setLocationLoading]);

    return null;
  }
);

// Better Error Handling Functions
const getGeolocationError = (error) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Location access denied. Please enable location permissions.";
    case error.POSITION_UNAVAILABLE:
      return "Location information unavailable.";
    case error.TIMEOUT:
      return "Location request timed out.";
    default:
      return "An unknown error occurred while getting location.";
  }
};

// Better Error Handling Functions - FIXED VERSION
const getNavigationError = (errorData) => {
  if (!errorData || typeof errorData !== "object") {
    return "Route calculation failed. Please try again.";
  }

  if (errorData.error?.code === 2003) {
    return "Invalid travel mode configuration.";
  }
  if (errorData.error?.code === 2004) {
    return "No route found. Please try a different destination.";
  }
  if (errorData.error?.message) {
    return errorData.error.message;
  }

  return "Failed to calculate route. Please try again.";
};

// Header Component with Better Error Display
const Header = memo(
  ({
    isTesting,
    locationError,
    onBack,
    loading,
    locationLoading,
    navigationError,
  }) => {
    return (
      <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2">
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            {loading
              ? "Loading spots..."
              : locationLoading
              ? "Getting location..."
              : isTesting
              ? "Testing Mode"
              : "Live Mode"}
          </h1>
          <div className="p-2">
            <MapPin size={20} className="text-gray-700" />
          </div>
        </div>

        {/* Error Display */}
        {(locationError || navigationError) && (
          <div className="flex items-center justify-center space-x-1 mt-1">
            <AlertCircle size={12} className="text-red-500" />
            <div className="text-red-500 text-xs text-center">
              {locationError || navigationError}
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Custom Marker with Label Component
const CustomMarker = memo(({ spot, onSpotSelect, isWithinRadius }) => {
  const markerIcon = isWithinRadius ? greenMarker : famousPlaceIcon;

  return (
    <Marker
      position={[spot.latitude, spot.longitude]}
      icon={markerIcon}
      eventHandlers={{
        click: () => onSpotSelect(spot),
      }}
    />
  );
});

// Category Filter Component
const CategoryFilter = memo(
  ({ selectedCategory, setSelectedCategory, categories }) => {
    const getIconComponent = (iconName) => {
      const iconMap = {
        "map-pin": <MapPin size={16} />,
        book: <Compass size={16} />,
        home: <Compass size={16} />,
        compass: <Compass size={16} />,
        sun: <Compass size={16} />,
      };
      return iconMap[iconName] || <MapPin size={16} />;
    };

    return (
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-3 rounded-2xl flex items-center whitespace-nowrap transition-colors border shadow-lg ${
                selectedCategory === category.name
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white/95 border-gray-200 text-gray-800"
              }`}
            >
              <span className="mr-2">{getIconComponent(category.icon)}</span>
              <span className="font-bold text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

// Radius Selector Component
const RadiusSelector = memo(
  ({ radius, setRadius, spotsCount, radiusOptions }) => {
    const [showRadius, setShowRadius] = useState(false);

    return (
      <div className="absolute top-50 right-4 z-[1000]">
        <button
          onClick={() => setShowRadius(!showRadius)}
          className="bg-white w-12 h-12 flex items-center justify-center rounded-xl shadow-lg"
        >
          <Target size={20} className="text-red-600" />
        </button>

        {showRadius && (
          <div className="absolute top-12 right-0 bg-white rounded-xl p-3 shadow-lg min-w-[120px]">
            <div className="text-gray-700 font-bold mb-2 text-center">
              Radius
            </div>
            {radiusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setRadius(option.value);
                  setShowRadius(false);
                }}
                className={`w-full px-3 py-2 rounded-lg mb-1 text-sm font-medium text-center transition-colors ${
                  radius === option.value
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
            <div className="text-gray-500 text-xs mt-2 text-center">
              {spotsCount} spots found
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Travel Mode Selector Component
const TravelModeSelector = memo(
  ({ travelMode, setTravelMode, travelModes }) => {
    const getTravelIcon = (modeValue) => {
      const iconMap = {
        walking: <Footprints size={16} />,
        driving: <Car size={16} />,
        cycling: <Bike size={16} />,
      };
      return iconMap[modeValue] || <Footprints size={16} />;
    };

    return (
      <div className="mb-4">
        <div className="text-gray-700 font-bold text-sm mb-2">Travel Mode</div>
        <div className="grid grid-cols-3 gap-2">
          {travelModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setTravelMode(mode.value)}
              className={`py-3 rounded-xl border text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                travelMode === mode.value
                  ? "border-gray-800 bg-gray-50 text-gray-900"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {getTravelIcon(mode.value)}
              <span>{mode.label}</span>
            </button>
          ))}
        </div>
        <div className="text-gray-500 text-xs mt-2 text-center">
          {travelModes.find((mode) => mode.value === travelMode)?.description}
        </div>
      </div>
    );
  }
);

// Enhanced Spot Card Component with Route Info
const SpotCard = memo(
  ({
    spot,
    userLocation,
    radius,
    onNavigate,
    onClose,
    travelMode,
    setTravelMode,
    travelModes,
    routeInfo,
    isCalculatingRoute,
  }) => {
    const distance = useMemo(
      () =>
        calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          spot.latitude,
          spot.longitude
        ),
      [userLocation, spot]
    );

    const isWithinRadius = distance <= radius;

    if (!spot || !userLocation) return null;

    return (
      <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">{spot.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{spot.location}</p>
            <p className="text-gray-600 text-sm mb-3">{spot.description}</p>

            <TravelModeSelector
              travelMode={travelMode}
              setTravelMode={setTravelMode}
              travelModes={travelModes}
            />

            {/* Route Information */}
            {routeInfo && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <Navigation size={14} className="text-blue-600" />
                    <span className="font-medium text-blue-800">
                      {routeInfo.distance} km
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Compass size={14} className="text-blue-600" />
                    <span className="font-medium text-blue-800">
                      {Math.round(routeInfo.duration)} min
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Star
                  size={14}
                  className="text-yellow-500 mr-1"
                  fill="currentColor"
                />
                <span className="text-gray-800 font-medium text-sm">
                  {spot.rating}
                </span>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isWithinRadius
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {formatDistance(distance)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 ml-2"
          >
            <X size={20} />
          </button>
        </div>

        <button
          onClick={() => onNavigate(spot)}
          disabled={isCalculatingRoute}
          className={`w-full py-3 rounded-xl font-medium text-white transition-colors flex items-center justify-center ${
            isCalculatingRoute
              ? "bg-gray-400 cursor-not-allowed"
              : isWithinRadius
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isCalculatingRoute ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              CALCULATING ROUTE...
            </>
          ) : (
            "START NAVIGATION"
          )}
        </button>
      </div>
    );
  }
);

// Map Controls Component
const MapControls = memo(
  ({
    onFocusUser,
    isNavigating,
    onStopNavigation,
    isTesting,
    onToggleTesting,
  }) => {
    return (
      <div className="absolute top-20 right-4 z-[1000] flex flex-col space-y-3">
        <button
          onClick={onToggleTesting}
          className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-lg font-bold text-sm transition-colors ${
            isTesting
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {isTesting ? "TEST" : "LIVE"}
        </button>

        <button
          onClick={onFocusUser}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
        >
          <Navigation size={20} className="text-gray-700" />
        </button>

        {isNavigating && (
          <button
            onClick={onStopNavigation}
            className="w-12 h-12 flex items-center justify-center bg-red-500 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        )}
      </div>
    );
  }
);

// Location Controller Component
const LocationController = memo(({ onMove, isTesting }) => {
  if (!isTesting) return null;

  return (
    <div className="absolute bottom-32 left-4 z-[1000] bg-white p-3 rounded-lg shadow-lg">
      <h3 className="font-bold text-sm mb-1 flex items-center">
        <Compass size={14} className="mr-1" />
        Move Marker
      </h3>
      <div className="space-y-1">
        <div className="flex justify-center">
          <button
            onClick={() => onMove("up")}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-12 h-12 flex items-center justify-center"
          >
            <Navigation size={20} className="rotate-180" />
          </button>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => onMove("left")}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-12 h-12 flex items-center justify-center"
          >
            <Navigation size={20} className="-rotate-90" />
          </button>
          <button
            onClick={() => onMove("right")}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-12 h-12 flex items-center justify-center"
          >
            <Navigation size={20} className="rotate-90" />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => onMove("down")}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-12 h-12 flex items-center justify-center"
          >
            <Navigation size={20} />
          </button>
        </div>
      </div>
    </div>
  );
});

// Bottom Info Bar Component
const BottomInfoBar = memo(
  ({
    spotsWithinRadius,
    selectedCategory,
    radius,
    userLocation,
    isTesting,
    loading,
    error,
    locationLoading,
  }) => {
    if (loading) {
      return (
        <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
          <div className="text-center text-gray-600 text-sm">
            Loading spots...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
          <div className="text-center text-red-500 text-sm">Error: {error}</div>
        </div>
      );
    }

    return (
      <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-600 text-sm flex-1">
            {spotsWithinRadius.length} {selectedCategory.toLowerCase()} spots
            within {radius / 1000}km
          </div>
          <div className="text-xs text-gray-500">
            {isTesting ? "Testing Mode" : "Live GPS"}
          </div>
        </div>
        {userLocation && (
          <div className="text-gray-400 text-xs text-center">
            {locationLoading ? (
              "Getting your location..."
            ) : (
              <>
                Location: {userLocation.latitude.toFixed(6)},{" "}
                {userLocation.longitude.toFixed(6)}
                {!isTesting && userLocation.accuracy && (
                  <span> • Accuracy: {userLocation.accuracy.toFixed(1)}m</span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

// ==================== MAIN COMPONENT ====================
const MapMobile = ({
  spots,
  spotsWithinRadius,
  selectedCategory,
  selectedSpot,
  travelMode,
  radius,
  userLocation,
  categories,
  radiusOptions,
  travelModes,
  loading,
  error,
  onCategoryChange,
  onSpotSelect,
  onTravelModeChange,
  onRadiusChange,
  onNavigate,
  onUserLocationChange,
  onGetUserLocation,
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [navigationError, setNavigationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const navigate = useNavigate();
  const mapRef = useRef();

  const focusOnSpot = useCallback(
    (spot) => {
      onSpotSelect(spot);
      if (mapRef.current) {
        mapRef.current.setView([spot.latitude, spot.longitude], 16);
      }
    },
    [onSpotSelect]
  );

  const focusOnUser = useCallback(() => {
    onSpotSelect(null);
    setIsNavigating(false);
    setRouteInfo(null);
    setRouteCoordinates([]);
    setNavigationError(null);
    if (mapRef.current) {
      mapRef.current.setView(
        [userLocation.latitude, userLocation.longitude],
        15
      );
    }
  }, [userLocation, onSpotSelect]);

  const handleUserMove = useCallback(
    (direction) => {
      if (!isTesting) return;

      const step = 0.0001;
      const newLocation = { ...userLocation };

      switch (direction) {
        case "up":
          newLocation.latitude += step;
          break;
        case "down":
          newLocation.latitude -= step;
          break;
        case "left":
          newLocation.longitude -= step;
          break;
        case "right":
          newLocation.longitude += step;
          break;
        default:
          return;
      }

      onUserLocationChange(newLocation);
      if (mapRef.current) {
        mapRef.current.setView([newLocation.latitude, newLocation.longitude]);
      }
    },
    [isTesting, userLocation, onUserLocationChange]
  );

  // Enhanced Navigation with OpenRouteService
  // Enhanced Navigation with OpenRouteService - FIXED VERSION
  const startNavigation = useCallback(
    async (spot) => {
      setIsCalculatingRoute(true);
      setNavigationError(null);
      setRouteInfo(null);
      setRouteCoordinates([]);

      try {
        const orsProfile = getORSProfile(travelMode);

        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/${orsProfile}/geojson`,
          {
            method: "POST",
            headers: {
              Authorization: OPENROUTE_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coordinates: [
                [userLocation.longitude, userLocation.latitude],
                [spot.longitude, spot.latitude],
              ],
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Route calculation failed");
        }

        const routeData = await response.json();

        if (routeData.features?.[0]) {
          const feature = routeData.features[0];
          // Convert to [lat, lng] array format for Leaflet
          const coordinates = feature.geometry.coordinates.map((coord) => [
            coord[1], // latitude
            coord[0], // longitude
          ]);

          // Validate coordinates
          if (coordinates.length === 0) {
            throw new Error("No route coordinates received");
          }

          const distance = (
            feature.properties.segments[0].distance / 1000
          ).toFixed(1);
          const duration = Math.round(
            feature.properties.segments[0].duration / 60
          );

          const steps = feature.properties.segments[0].steps;
          setNavigationSteps(steps);
          setCurrentStepIndex(0);

          setRouteInfo({ distance, duration });
          setRouteCoordinates(coordinates);
          setIsNavigating(true);
          onSpotSelect(null);

          // Safe bounds fitting with validation
          if (mapRef.current && coordinates.length > 0) {
            try {
              const bounds = L.latLngBounds(coordinates);
              if (bounds.isValid()) {
                mapRef.current.fitBounds(bounds, { padding: [50, 50] });
              } else {
                mapRef.current.setView([spot.latitude, spot.longitude], 14);
              }
            } catch (boundsError) {
              console.warn("Bounds error, using fallback:", boundsError);
              mapRef.current.setView([spot.latitude, spot.longitude], 14);
            }
          }
        } else {
          throw new Error("No route found for this destination");
        }
      } catch (error) {
        console.error("Navigation error:", error);

        // ✅ FIX 3: Better error parsing
        let errorMessage = "Failed to calculate route";
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = getNavigationError(errorData);
        } catch {
          // If it's not JSON, use the raw message
          errorMessage = error.message || "Route calculation failed";
        }

        setNavigationError(errorMessage);
      } finally {
        setIsCalculatingRoute(false);
      }
    },
    [travelMode, userLocation, onSpotSelect]
  );

  const NavigationInstructions = () => {
    if (!isNavigating || navigationSteps.length === 0) return null;

    const currentStep = navigationSteps[currentStepIndex];
    const progress = ((currentStepIndex + 1) / navigationSteps.length) * 100;

    return (
      <div className="absolute -bottom-10 left-4 right-4 z-[1000] bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg border border-gray-200">
        <div className="text-center">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Navigation size={16} className="mr-2" />
            NAVIGATION ACTIVE
          </h3>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Current Step */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
            <div className="text-sm text-blue-800 font-semibold">
              {getStepIcon(currentStep.type)} {currentStep.instruction}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              in {formatDistance(currentStep.distance)}
            </div>
          </div>

          {/* Progress */}
          <div className="text-xs text-gray-500">
            Step {currentStepIndex + 1} of {navigationSteps.length}
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (isTesting && isNavigating) {
    }
  }, [isTesting, isNavigating, userLocation]);

  const stopNavigation = useCallback(() => {
    setIsNavigating(false);
    setRouteInfo(null);
    setRouteCoordinates([]);
    setNavigationError(null);
    setNavigationSteps([]);
    setCurrentStepIndex(0);
    focusOnUser();
  }, [focusOnUser]);

  const toggleTestingMode = useCallback(() => {
    setIsTesting(!isTesting);
    if (!isTesting) {
      onUserLocationChange({
        latitude: 10.3157,
        longitude: 123.8854,
        accuracy: null,
      });
    }
  }, [isTesting, onUserLocationChange]);

  const handleBack = useCallback(() => {
    return navigate(-1);
  }, [navigate]);

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      <Header
        isTesting={isTesting}
        locationError={locationError}
        navigationError={navigationError}
        onBack={handleBack}
        loading={loading}
        locationLoading={locationLoading}
      />

      {/* Main Map Area */}
      <div className="flex-1 w-full relative">
        {userLocation && userLocation.latitude && userLocation.longitude ? (
          <MapContainer
            ref={mapRef}
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            className="leaflet-container"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* User Location Marker */}
            <Marker
              position={[userLocation.latitude, userLocation.longitude]}
              icon={userLocationIcon}
            >
              <Popup>
                {isTesting ? "Test Location" : "You are here!"}
                <br />
                {!isTesting &&
                  userLocation.accuracy &&
                  `Accuracy: ${userLocation.accuracy.toFixed(1)}m`}
              </Popup>
            </Marker>

            {/* Spots Markers */}
            {spots.map((spot) => {
              const isWithinRadius = spotsWithinRadius.some(
                (radiusSpot) => radiusSpot.id === spot.id
              );
              return (
                <CustomMarker
                  key={spot.id}
                  spot={spot}
                  onSpotSelect={focusOnSpot}
                  isWithinRadius={isWithinRadius}
                />
              );
            })}

            {/* Navigation Route */}
            {isNavigating && routeCoordinates.length > 0 && (
              <Polyline
                positions={routeCoordinates}
                pathOptions={{
                  color: "#3B82F6",
                  weight: 6,
                  opacity: 0.7,
                  lineJoin: "round",
                }}
                key={routeCoordinates.length} // Force re-render when coordinates change
              />
            )}

            {/* Radius Circle */}
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              radius={radius}
              pathOptions={{
                color: "red",
                fillColor: "red",
                fillOpacity: 0.1,
              }}
            />

            <LocationUpdater
              setUserLocation={onUserLocationChange}
              setLocationError={setLocationError}
              isTesting={isTesting}
              setLocationLoading={setLocationLoading}
            />
          </MapContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Loading map...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
            </div>
          </div>
        )}

        {/* UI Components */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={onCategoryChange}
          categories={categories}
        />

        <MapControls
          onFocusUser={focusOnUser}
          spotsCount={spotsWithinRadius.length}
          isNavigating={isNavigating}
          onStopNavigation={stopNavigation}
          isTesting={isTesting}
          onToggleTesting={toggleTestingMode}
        />

        <RadiusSelector
          radius={radius}
          setRadius={onRadiusChange}
          spotsCount={spotsWithinRadius.length}
          radiusOptions={radiusOptions}
        />

        <LocationController onMove={handleUserMove} isTesting={isTesting} />
        <NavigationInstructions />

        {selectedSpot && (
          <SpotCard
            spot={selectedSpot}
            userLocation={userLocation}
            radius={radius}
            onNavigate={startNavigation}
            onClose={() => onSpotSelect(null)}
            travelMode={travelMode}
            setTravelMode={onTravelModeChange}
            travelModes={travelModes}
            routeInfo={routeInfo}
            isCalculatingRoute={isCalculatingRoute}
          />
        )}
      </div>

      <BottomInfoBar
        spotsWithinRadius={spotsWithinRadius}
        selectedCategory={selectedCategory}
        radius={radius}
        userLocation={userLocation}
        isTesting={isTesting}
        loading={loading}
        error={error}
        locationLoading={locationLoading}
      />
    </div>
  );
};

export default MapMobile;
