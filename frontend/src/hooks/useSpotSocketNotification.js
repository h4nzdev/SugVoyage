// hooks/useSpotSocketNotification.js
import { useEffect, useRef } from "react";
import { useNotification } from "../context/NotificationContext";
import socketService from "../services/socketService";

export const useSpotSocketNotification = (userLocation, radius) => {
  const { showNotification } = useNotification();
  const socketRef = useRef(null);
  const lastNotificationRef = useRef(null);

  useEffect(() => {
    if (!userLocation?.latitude || !userLocation?.longitude) return;

    socketRef.current = socketService.connect();

    socketService.onSpotInRadius((data) => {
      const now = Date.now();
      if (
        !lastNotificationRef.current ||
        now - lastNotificationRef.current > 5000
      ) {
        showNotification(data.message, data.count, data.nearestSpot);
        lastNotificationRef.current = now;
      }
    });

    socketService.sendUserLocation(userLocation, radius);

    return () => {
      socketService.offSpotInRadius();
    };
  }, [userLocation, radius, showNotification]);

  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      socketService.sendUserLocation(userLocation, radius);
    }
  }, [userLocation, radius]);

  return {
    connected: socketRef.current?.connected || false,
  };
};
