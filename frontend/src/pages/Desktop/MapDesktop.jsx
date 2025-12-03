import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  memo,
  useEffect,
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
  Filter,
  Search,
  AlertCircle,
  LoaderCircle,
  Move,
  GripVertical,
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

// Cebu Boundary Configuration
const CEBU_BOUNDARY = {
  bounds: [
    [9.5, 123.0], // Southwest corner
    [11.5, 124.5], // Northeast corner
  ],
};

const CEBU_CENTER = [10.3157, 123.8854];

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

// Green marker for spots within radius
const greenMarkerIcon = new L.Icon({
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

// ==================== COMPONENTS ====================

// Boundary Controller Component
const BoundaryController = memo(() => {
  const map = useMap();

  useEffect(() => {
    // Set Cebu boundary restrictions
    const bounds = L.latLngBounds(CEBU_BOUNDARY.bounds);
    map.setMaxBounds(bounds);

    // Ensure map stays within Cebu bounds
    map.on("drag", () => {
      map.panInsideBounds(bounds, { animate: false });
    });

    // Set initial view to Cebu center
    map.setView(CEBU_CENTER, 11);
  }, [map]);

  return null;
});

// Location Updater Component
const LocationUpdater = memo(
  ({
    setUserLocation,
    setLocationError,
    setLocationLoading,
    isTesting,
    onLocationUpdate,
  }) => {
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
          onLocationUpdate(newLocation);
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

// Custom Marker with Label Component
const CustomMarker = memo(({ spot, onSpotSelect, isWithinRadius }) => {
  const markerIcon = isWithinRadius ? greenMarkerIcon : famousPlaceIcon;

  return (
    <Marker
      position={[spot.latitude, spot.longitude]}
      icon={markerIcon}
      eventHandlers={{
        click: () => onSpotSelect(spot),
      }}
    >
      <Tooltip permanent direction="top" offset={[0, -30]}>
        <span className="text-xs font-semibold bg-white text-black px-2 py-1 rounded shadow">
          {spot.name}
        </span>
      </Tooltip>
    </Marker>
  );
});

// Floating Filter Panel Component
const FloatingFilterPanel = memo(
  ({
    categories,
    selectedCategory,
    onCategoryChange,
    radiusOptions,
    radius,
    onRadiusChange,
    spots,
  }) => {
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
      setIsDragging(true);
      setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = useCallback(
      (e) => {
        if (!isDragging) return;
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      },
      [isDragging, dragOffset]
    );

    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    return (
      <div
        className="absolute bg-white rounded-xl shadow-lg z-[1000] w-64"
        style={{
          left: position.x,
          top: position.y,
          cursor: isDragging ? "grabbing" : "default",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center p-3 border-b cursor-move"
          onMouseDown={handleMouseDown}
        >
          <GripVertical size={16} className="text-gray-400 mr-2" />
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </h3>
        </div>

        {/* Content */}
        <div className="p-3 space-y-4">
          {/* Categories */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2 text-sm">
              Categories
            </h4>
            <div className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => onCategoryChange(category.name)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                    selectedCategory === category.name
                      ? "bg-red-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Radius */}
          <div>
            <h4 className="font-medium text-gray-700 mb-2 text-sm flex items-center">
              <Target className="w-3 h-3 mr-1" />
              Radius
            </h4>
            <div className="space-y-1">
              {radiusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onRadiusChange(option.value)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm ${
                    radius === option.value
                      ? "bg-red-500 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// Enhanced Travel Mode Selector Component
const TravelModeSelector = memo(
  ({ travelMode, setTravelMode, travelModes }) => {
    const getTravelIcon = (modeValue) => {
      const iconMap = {
        walking: <Footprints size={18} />,
        driving: <Car size={18} />,
        cycling: <Bike size={18} />,
      };
      return iconMap[modeValue] || <Footprints size={18} />;
    };

    return (
      <div className="mb-6">
        <h4 className="font-bold text-gray-900 text-lg mb-4">Travel Mode</h4>
        <div className="grid grid-cols-3 gap-4">
          {travelModes.map((mode) => (
            <button
              key={mode.value}
              onClick={() => setTravelMode(mode.value)}
              className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-center space-x-2 ${
                travelMode === mode.value
                  ? "border-red-500 bg-red-50 text-red-700 shadow-md"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {getTravelIcon(mode.value)}
              <span className="font-semibold">{mode.label}</span>
            </button>
          ))}
        </div>
        <div className="text-gray-500 text-sm mt-3 text-center">
          {travelModes.find((mode) => mode.value === travelMode)?.description}
        </div>
      </div>
    );
  }
);

// Location Controller Component for Testing Mode
const LocationController = memo(({ onMove, isTesting }) => {
  if (!isTesting) return null;

  return (
    <div className="absolute bottom-32 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="font-bold text-sm mb-2 flex items-center">
        <Compass size={16} className="mr-2" />
        Move Marker (Testing Mode)
      </h3>
      <div className="space-y-2">
        <div className="flex justify-center">
          <button
            onClick={() => onMove("up")}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-12 h-12 flex items-center justify-center transition-colors"
          >
            <Navigation size={20} className="rotate-180" />
          </button>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => onMove("left")}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-12 h-12 flex items-center justify-center transition-colors"
          >
            <Navigation size={20} className="-rotate-90" />
          </button>
          <button
            onClick={() => onMove("right")}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-12 h-12 flex items-center justify-center transition-colors"
          >
            <Navigation size={20} className="rotate-90" />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => onMove("down")}
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-12 h-12 flex items-center justify-center transition-colors"
          >
            <Navigation size={20} />
          </button>
        </div>
      </div>
    </div>
  );
});

// ==================== MAIN COMPONENT ====================
const MapDesktop = ({
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
      mapRef.current.setView(CEBU_CENTER, 11);
    }
  }, [onSpotSelect]);

  const handleUserMove = useCallback(
    (direction) => {
      if (!isTesting) return;

      const step = 0.001;
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
          const coordinates = feature.geometry.coordinates.map((coord) => [
            coord[1],
            coord[0],
          ]);

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

          if (mapRef.current && coordinates.length > 0) {
            try {
              const bounds = L.latLngBounds(coordinates);
              if (bounds.isValid()) {
                mapRef.current.fitBounds(bounds, { padding: [50, 50] });
              } else {
                mapRef.current.setView([spot.latitude, spot.longitude], 14);
              }
            } catch (boundsError) {
              mapRef.current.setView([spot.latitude, spot.longitude], 14);
            }
          }
        } else {
          throw new Error("No route found for this destination");
        }
      } catch (error) {
        console.error("Navigation error:", error);

        let errorMessage = "Failed to calculate route";
        try {
          const errorData = JSON.parse(error.message);
          errorMessage = getNavigationError(errorData);
        } catch {
          errorMessage = error.message || "Route calculation failed";
        }

        setNavigationError(errorMessage);
      } finally {
        setIsCalculatingRoute(false);
      }
    },
    [travelMode, userLocation, onSpotSelect]
  );

  const updateCurrentStep = useCallback(
    (currentLocation) => {
      if (!isNavigating || navigationSteps.length === 0) return;

      const currentStep = navigationSteps[currentStepIndex];
      const [startIdx, endIdx] = currentStep.way_points;

      if (
        endIdx >= routeCoordinates.length ||
        startIdx >= routeCoordinates.length
      ) {
        return;
      }

      const stepEndCoordinate = routeCoordinates[endIdx];
      const distanceToStepEnd = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        stepEndCoordinate[0],
        stepEndCoordinate[1]
      );

      if (
        distanceToStepEnd < 100 &&
        currentStepIndex < navigationSteps.length - 1
      ) {
        setCurrentStepIndex((prev) => prev + 1);
      }
    },
    [isNavigating, navigationSteps, currentStepIndex, routeCoordinates]
  );

  useEffect(() => {
    if (isTesting && isNavigating) {
      updateCurrentStep(userLocation);
    }
  }, [isTesting, isNavigating, userLocation, updateCurrentStep]);

  const NavigationInstructions = () => {
    if (!isNavigating || navigationSteps.length === 0) return null;

    const currentStep = navigationSteps[currentStepIndex];
    const nextStep = navigationSteps[currentStepIndex + 1];
    const progress = ((currentStepIndex + 1) / navigationSteps.length) * 100;

    return (
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg border border-gray-200 min-w-80">
        <div className="text-center">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Navigation size={16} className="mr-2" />
            NAVIGATION ACTIVE
          </h3>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
            <div className="text-sm text-blue-800 font-semibold">
              {getStepIcon(currentStep.type)} {currentStep.instruction}
            </div>
            <div className="text-xs text-blue-600 mt-1">
              in {formatDistance(currentStep.distance)}
            </div>
          </div>

          {nextStep && (
            <div className="text-xs text-gray-600 border-t pt-2">
              Next: {getStepIcon(nextStep.type)} {nextStep.instruction} (
              {formatDistance(nextStep.distance)})
            </div>
          )}

          <div className="text-xs text-gray-500 mt-2">
            Step {currentStepIndex + 1} of {navigationSteps.length}
          </div>
        </div>
      </div>
    );
  };

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

  const isSpotWithinRadius = useCallback(
    (spot) => {
      return spotsWithinRadius.some((radiusSpot) => radiusSpot.id === spot.id);
    },
    [spotsWithinRadius]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-3xl font-black text-gray-900">
                  Cebu Interactive Map
                </h1>
                <p className="text-red-600 text-md font-semibold">
                  {loading
                    ? "Loading spots..."
                    : locationLoading
                    ? "Getting location..."
                    : isTesting
                    ? "Testing Mode"
                    : "Live Mode"}
                </p>
                {(locationError || navigationError) && (
                  <div className="flex items-center space-x-2 mt-1">
                    <AlertCircle size={14} className="text-red-500" />
                    <div className="text-red-500 text-sm">
                      {locationError || navigationError}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTestingMode}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                  isTesting
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
              >
                {isTesting ? "TEST MODE" : "LIVE MODE"}
              </button>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="pl-12 pr-4 py-3 bg-gray-100 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen Map Container */}
      <div className="relative w-full h-[calc(100vh-140px)]">
        {/* Floating Filter Panel */}
        <FloatingFilterPanel
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          radiusOptions={radiusOptions}
          radius={radius}
          onRadiusChange={onRadiusChange}
          spots={spots}
          spotsWithinRadius={spotsWithinRadius}
        />

        {/* Map Container */}
        <MapContainer
          ref={mapRef}
          center={CEBU_CENTER}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          className="leaflet-container"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Boundary Controller */}
          <BoundaryController />

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
          {spots.map((spot) => (
            <CustomMarker
              key={spot.id}
              spot={spot}
              onSpotSelect={focusOnSpot}
              isWithinRadius={isSpotWithinRadius(spot)}
            />
          ))}

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
            onLocationUpdate={updateCurrentStep}
          />
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col space-y-3">
          <button
            onClick={focusOnUser}
            className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
          >
            <Navigation size={20} className="text-gray-700" />
          </button>

          {isNavigating && (
            <button
              onClick={stopNavigation}
              className="w-12 h-12 flex items-center justify-center bg-red-500 rounded-xl shadow-lg hover:bg-red-600 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          )}
        </div>

        <NavigationInstructions />

        <LocationController onMove={handleUserMove} isTesting={isTesting} />

        {/* Selected Spot Details Panel */}
        {selectedSpot && (
          <div className="absolute max-w-3xl bottom-4 right-0 right-4 z-[1000] bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedSpot.name}
                </h3>
                <p className="text-gray-500 text-lg mb-3">
                  {selectedSpot.location}
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {selectedSpot.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star
                        size={18}
                        className="text-yellow-500 mr-2"
                        fill="currentColor"
                      />
                      <span className="text-gray-800 font-semibold text-lg">
                        {selectedSpot.rating}
                      </span>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-lg font-semibold ${
                        selectedSpot.distance <= radius
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {formatDistance(selectedSpot.distance)} away
                      {selectedSpot.distance <= radius && " ✅"}
                    </div>
                  </div>
                </div>

                <TravelModeSelector
                  travelMode={travelMode}
                  setTravelMode={onTravelModeChange}
                  travelModes={travelModes}
                />

                {routeInfo && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center text-lg">
                      <div className="flex items-center space-x-3">
                        <Navigation size={18} className="text-blue-600" />
                        <span className="font-semibold text-blue-800">
                          {routeInfo.distance} km
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Compass size={18} className="text-blue-600" />
                        <span className="font-semibold text-blue-800">
                          {Math.round(routeInfo.duration)} min
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => onSpotSelect(null)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors ml-4"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <button
              onClick={() => startNavigation(selectedSpot)}
              disabled={isCalculatingRoute}
              className={`w-full py-4 rounded-2xl font-semibold text-xl text-white transition-all duration-200 hover:scale-101 cursor-pointer ${
                isCalculatingRoute
                  ? "bg-gray-400 cursor-not-allowed"
                  : selectedSpot.distance <= radius
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isCalculatingRoute ? (
                <div className="flex items-center justify-center gap-4 rounded-full">
                  CALCULATING ROUTE
                  <LoaderCircle className="animate-spin" />
                </div>
              ) : (
                `START NAVIGATION TO ${selectedSpot.name.toUpperCase()}`
              )}
            </button>
          </div>
        )}

        {/* Bottom Info Bar */}
        {!selectedSpot && (
          <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white/95 backdrop-blur rounded-2xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-lg">
                  🗺️ Found {spotsWithinRadius.length}{" "}
                  {selectedCategory.toLowerCase()} spots within {radius / 1000}
                  km radius
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  Click on any marker to see details and start navigation
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                  <span className="text-gray-500">Within range</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                  <span className="text-gray-500">Outside range</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapDesktop;
