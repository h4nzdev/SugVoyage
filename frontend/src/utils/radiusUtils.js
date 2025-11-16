/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

/**
 * Check if a spot is within user's radius
 */
export const isSpotInRadius = (userLocation, spot, radiusInMeters) => {
  if (!userLocation || !spot) return false;

  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    spot.latitude || spot.lat,
    spot.longitude || spot.lon
  );

  return distance <= radiusInMeters;
};

/**
 * Get all spots within user's radius
 */
export const getSpotsInRadius = (userLocation, spots, radiusInMeters) => {
  if (!userLocation || !spots || spots.length === 0) return [];

  return spots.filter((spot) =>
    isSpotInRadius(userLocation, spot, radiusInMeters)
  );
};
