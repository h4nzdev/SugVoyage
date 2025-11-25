import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import MapMobile from "../../Mobile/MapMobile";
import MapDesktop from "../../Desktop/MapDesktop";
import { useSpots } from "../../../hooks/useSpots";
import { useUserLocation } from "../../../context/UserLocationContext";

const categories = [
  { name: "All", icon: "map-pin" },
  { name: "Cultural", icon: "book" },
  { name: "Historical", icon: "home" },
  { name: "Adventure", icon: "compass" },
  { name: "Beach", icon: "sun" },
];

const travelModes = [
  {
    value: "foot-walking",
    label: "Walking",
    description: "Best for short distances",
  },
  {
    value: "driving-car",
    label: "Driving",
    description: "Fastest route by car",
  },
  {
    value: "cycling-regular",
    label: "Cycling",
    description: "Bike-friendly routes",
  },
];

export default function Map() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [travelMode, setTravelMode] = useState("foot-walking");
  const [destination, setDestination] = useState(null);

  // Load radius from localStorage, default to 500m
  const [radius, setRadius] = useState(() => {
    const savedRadius = localStorage.getItem("mapRadius");
    return savedRadius ? parseInt(savedRadius, 10) : 500;
  });

  // Use global user location from context
  const { userLocation, setUserLocation } = useUserLocation();

  // Save radius to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mapRadius", radius.toString());
  }, [radius]);

  // Handle destination from URL parameters when coming from DetailedInfo
  useEffect(() => {
    const destinationId = searchParams.get("destination");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const name = searchParams.get("name");

    if (destinationId && lat && lon && name) {
      setDestination({
        id: destinationId,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        name: decodeURIComponent(name),
      });
    }
  }, [searchParams]);

  // Use the spots hook to get real Cebu data
  const { spots: allSpots, loading, error } = useSpots();

  const radiusOptions = [
    { value: 500, label: "500m" },
    { value: 1000, label: "1km" },
    { value: 2000, label: "2km" },
    { value: 5000, label: "5km" },
    { value: 10000, label: "10km" },
  ];

  // Filter spots by category
  const filteredSpots = useMemo(() => {
    if (!allSpots) return [];

    if (selectedCategory === "All") return allSpots;

    return allSpots.filter(
      (spot) => spot.category?.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [allSpots, selectedCategory]);

  // Calculate distance between user and spots
  const spotsWithDistance = useMemo(() => {
    if (!filteredSpots || !userLocation) return [];

    return filteredSpots.map((spot) => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.latitude || 10.3157,
        spot.longitude || 123.8854
      );
      return {
        ...spot,
        distance,
        id: spot._id || spot.id,
        name: spot.name || "Cebu Spot",
        location: spot.location || "Cebu",
        description: spot.description || "Explore this Cebu destination",
        rating: spot.rating || 4.0,
        category: spot.category || "cultural",
      };
    });
  }, [filteredSpots, userLocation]);

  // Filter spots within radius
  const spotsWithinRadius = useMemo(() => {
    return spotsWithDistance.filter((spot) => spot.distance <= radius);
  }, [spotsWithDistance, radius]);

  const handleSpotSelect = (spot) => {
    setSelectedSpot(spot);
  };

  const handleNavigate = (spot) => {
    const navSpot = spot || destination;
    if (!navSpot) {
      console.log("No destination selected");
      return;
    }

    console.log(`Creating route to ${navSpot.name} via ${travelMode}`);
    setSelectedSpot(navSpot);

    alert(
      `Route created to ${navSpot.name}!\nTravel mode: ${travelMode}\nDistance: Calculate using OpenRouteService`
    );
  };

  // Refresh user location with high accuracy
  const getUserLocation = () => {
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
          console.log("Error getting location:", error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  };

  return (
    <>
      {/* Mobile View */}
      <div className="block md:hidden">
        <MapMobile
          spots={spotsWithDistance}
          spotsWithinRadius={spotsWithinRadius}
          selectedCategory={selectedCategory}
          selectedSpot={selectedSpot}
          travelMode={travelMode}
          radius={radius}
          userLocation={userLocation}
          categories={categories}
          radiusOptions={radiusOptions}
          travelModes={travelModes}
          loading={loading}
          error={error}
          onCategoryChange={setSelectedCategory}
          onSpotSelect={handleSpotSelect}
          onTravelModeChange={setTravelMode}
          onRadiusChange={setRadius}
          onNavigate={handleNavigate}
          onUserLocationChange={setUserLocation}
          onGetUserLocation={getUserLocation}
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <MapDesktop
          spots={spotsWithDistance}
          spotsWithinRadius={spotsWithinRadius}
          selectedCategory={selectedCategory}
          selectedSpot={selectedSpot}
          travelMode={travelMode}
          radius={radius}
          userLocation={userLocation}
          categories={categories}
          radiusOptions={radiusOptions}
          travelModes={travelModes}
          loading={loading}
          error={error}
          onCategoryChange={setSelectedCategory}
          onSpotSelect={handleSpotSelect}
          onTravelModeChange={setTravelMode}
          onRadiusChange={setRadius}
          onNavigate={handleNavigate}
          onUserLocationChange={setUserLocation}
          onGetUserLocation={getUserLocation}
        />
      </div>
    </>
  );
}

// Utility function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
}
