import React, { useState, useEffect } from "react";
import MainHeader from "../../components/Header/MainHeader";
import LiveStatus from "../../components/Home/LiveStatus";
import HeroBanner from "../../components/Home/HeroBanner";
import CategoryTabs from "../../components/Home/CategoryTabs";
import AttractionList from "../../components/Home/AttractionList";
import MapSection from "../../components/Home/MapSection";

const HomePageMobile = ({
  selectedCategory,
  setSelectedCategory,
  spots,
  categories,
}) => {
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

  const [hasNoSpotNearby, setHasNoSpotNearby] = useState(false);

  // Update hasNoSpotNearby state when noSpotNearby value changes
  useEffect(() => {
    setHasNoSpotNearby(noSpotNearby);
  }, [noSpotNearby]);
  return (
    <div className="min-h-screen">
      <div className="flex-1">
        <MainHeader />
        <LiveStatus />
        <HeroBanner />
        <CategoryTabs
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          categories={categories}
        />
        <AttractionList
          spots={getFilteredSpots}
          userLocation={userLocation}
          radius={radius}
        />
      </div>
    </div>
  );
};

export default HomePageMobile;

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
