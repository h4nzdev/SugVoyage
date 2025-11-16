import { useContext, useEffect, useRef, useState } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { getSpotsInRadius } from "../utils/radiusUtils";
import { CebuSpotsService } from "../services/cebuSpotService";

/**
 * Hook that continuously monitors user location and checks for nearby spots
 * Shows notification when spots are found within radius
 */
export const useSpotNotificationService = (
  userLocation,
  radiusInMeters = 1000,
  checkIntervalMs = 5000
) => {
  const { showNotification } = useContext(NotificationContext);
  const intervalRef = useRef(null);
  const lastNotificationRef = useRef(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Only start monitoring if we have a valid user location
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return;
    }

    const startMonitoring = async () => {
      // Clear existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setIsMonitoring(true);

      // Set up interval for periodic checking
      intervalRef.current = setInterval(async () => {
        try {
          // Fetch all spots
          const allSpots = await CebuSpotsService.getAllCebuSpots();

          if (!allSpots || allSpots.length === 0) {
            return;
          }

          // Get spots within radius
          const spotsInRadius = getSpotsInRadius(
            userLocation,
            allSpots,
            radiusInMeters
          );

          // Only show notification if spots found
          if (spotsInRadius.length > 0) {
            const now = Date.now();
            // Prevent spam - only notify every 30 seconds max
            if (
              !lastNotificationRef.current ||
              now - lastNotificationRef.current > 5000
            ) {
              const nearestSpot = spotsInRadius[0];
              showNotification(
                `${spotsInRadius.length} spot(s) found near you!`,
                spotsInRadius.length,
                nearestSpot.name
              );

              lastNotificationRef.current = now;
            }
          }
        } catch (error) {
          console.error("Error in spot notification service:", error);
        }
      }, checkIntervalMs);
    };

    startMonitoring();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        setIsMonitoring(false);
      }
    };
  }, [userLocation, radiusInMeters, checkIntervalMs, showNotification]);

  return {
    isMonitoring,
  };
};
