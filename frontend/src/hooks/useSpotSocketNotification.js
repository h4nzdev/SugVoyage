import { useContext, useEffect, useRef } from "react";
import { NotificationContext } from "../context/NotificationContext";
import socketService from "../services/socketService";

/**
 * Real-time notification hook using Socket.io
 * Zero delay - receives notifications instantly when spots enter radius
 */
export const useSpotSocketNotification = (userLocation, radius) => {
  const { showNotification } = useContext(NotificationContext);
  const socketRef = useRef(null);
  const lastNotificationRef = useRef(null);

  useEffect(() => {
    // Only connect if we have valid user location
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
      return;
    }

    // Connect to socket
    socketRef.current = socketService.connect();

    // Listen for spot-in-radius events
    socketService.onSpotInRadius((data) => {
      const now = Date.now();

      // Prevent spam - only notify every 5 seconds max
      if (
        !lastNotificationRef.current ||
        now - lastNotificationRef.current > 5000
      ) {
        showNotification(data.message, data.count, data.nearestSpot);
        lastNotificationRef.current = now;
      }
    });

    // Send location update to server
    socketService.sendUserLocation(userLocation, radius);

    // Cleanup on unmount
    return () => {
      socketService.offSpotInRadius();
    };
  }, [userLocation, radius, showNotification]);

  useEffect(() => {
    // Update location whenever it changes (continuous sync)
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      socketService.sendUserLocation(userLocation, radius);
    }
  }, [userLocation, radius]);

  return {
    connected: socketRef.current?.connected || false,
  };
};
